// backend/src/routes/emails.ts
import express from "express";
import { es } from "../esClient";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { account, folder, q, size = 20, page = 1 } = req.query as any;
    const must: any[] = [];
    if (account) must.push({ term: { accountId: account } });
    if (folder) must.push({ term: { folder } });
    const body: any = {
      from: (page - 1) * size,
      size: Number(size),
      query: {
        bool: {
          must
        }
      },
      sort: [{ date: { order: "desc" } }]
    };

    if (q) {
      body.query = {
        bool: {
          must,
          should: [
            { match: { subject: q } },
            { match: { body_text: q } }
          ]
        }
      };
    }

    const r = await es.search({ index: "emails_v1", body });
    const hits = r.hits.hits.map((h: any) => ({ id: h._id, ...h._source }));
    res.json({ total: r.hits.total, hits });
  } catch (e) {
    console.error("GET /emails error", e);
    res.status(500).json({ error: "search failed" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const r = await es.get({ index: "emails_v1", id });
    res.json({ id: r._id, ...r._source });
  } catch (e) {
    res.status(404).json({ error: "not found" });
  }
});

router.post("/:id/label", express.json(), async (req, res) => {
  try {
    const id = req.params.id;
    const { label } = req.body;
    await es.update({
      index: "emails_v1",
      id,
      doc: { labels: [label] },
      retry_on_conflict: 3
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "label failed" });
  }
});

export default router;
