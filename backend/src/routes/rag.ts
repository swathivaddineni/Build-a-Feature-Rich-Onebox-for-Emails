// backend/src/routes/rag.ts
import express from "express";
import { suggestReply } from "../ragService";
import { es } from "../esClient";

const router = express.Router();

router.post("/suggest", express.json(), async (req, res) => {
  try {
    const { emailId } = req.body;
    if (!emailId) return res.status(400).json({ error: "emailId required" });
    const doc = await es.get({ index: "emails_v1", id: emailId });
    const bodyText = doc._source.body_text || "";
    const suggestion = await suggestReply(bodyText);
    res.json({ suggestion });
  } catch (e) {
    console.error("RAG suggest error", e);
    res.status(500).json({ error: "failed" });
  }
});

export default router;
