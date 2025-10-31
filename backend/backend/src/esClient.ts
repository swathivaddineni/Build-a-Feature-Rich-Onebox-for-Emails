// backend/src/esClient.ts
import { Client } from "@elastic/elasticsearch";

const node = process.env.ES_NODE || "http://localhost:9200";
const username = process.env.ES_USERNAME;
const password = process.env.ES_PASSWORD;

export const es = new Client({
  node,
  auth: username && password ? { username, password } : undefined,
});

export async function ensureIndex() {
  const index = "emails_v1";
  const exists = await es.indices.exists({ index });
  if (!exists) {
    await es.indices.create({
      index,
      body: {
        mappings: {
          properties: {
            subject: { type: "text" },
            from: { type: "keyword" },
            to: { type: "keyword" },
            body_text: { type: "text" },
            folder: { type: "keyword" },
            accountId: { type: "keyword" },
            date: { type: "date" },
            labels: { type: "keyword" }
          }
        }
      }
    });
    console.log("Created index", index);
  }
}
