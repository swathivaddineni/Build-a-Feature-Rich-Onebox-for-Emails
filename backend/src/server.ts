// backend/src/server.ts
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import { ensureIndex } from "./esClient";
import emailsRouter from "./routes/emails";
import ragRouter from "./routes/rag";
import { startImapForAccount } from "./imapWorker";
import { indexEmailDocument } from "./indexer";
import { classifyAndStore } from "./categorizer";
import { notifyInterested } from "./notifier";

const app = express();
app.use(bodyParser.json());

app.get("/api/health", async (req, res) => {
  try {
    const esResp = await ensureIndex();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || e });
  }
});

// mount routers
app.use("/api/emails", emailsRouter);
app.use("/api/rag", ragRouter);

// manual trigger to classify and notify (for demo)
app.post("/api/demo/classify", express.json(), async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "id required" });
  try {
    const r = await (await import("./esClient")).es.get({ index: "emails_v1", id });
    const source = r._source;
    const label = await classifyAndStore(id, source.subject, source.body_text);
    if (label.toLowerCase() === "interested") {
      await notifyInterested({ id, ...source });
    }
    res.json({ id, label });
  } catch (e) {
    console.error("demo classify error", e);
    res.status(500).json({ error: "failed" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log("Backend running on", PORT);
  try {
    await ensureIndex();
  } catch (e) {
    console.error("es ensure index failed", e);
  }

  // start IMAP workers from env
  try {
    const accountsJson = process.env.IMAP_ACCOUNTS_JSON;
    if (accountsJson) {
      const accs = JSON.parse(accountsJson);
      for (const a of accs) {
        startImapForAccount(a);
      }
    } else {
      console.log("No IMAP accounts provided in IMAP_ACCOUNTS_JSON");
    }
  } catch (e) {
    console.error("starting IMAP workers failed", e);
  }
});
