// backend/src/ragService.ts
// Simple RAG: store "knowledge" in memory (for demo) and use OpenAI embeddings + LLM to generate reply.
// For production: replace with Weaviate / Milvus / pgvector.

import OpenAI from "openai";
import { es } from "./esClient";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// seed docs in memory for demo:
const knowledgeDocs = [
  { id: "prod1", text: "We are ReachInbox. If lead is interested, share meeting link: https://cal.com/example" },
  { id: "prod2", text: "Our product helps automate outreach across LinkedIn, Email, and Twitter." }
];

export async function suggestReply(emailBody: string) {
  // naive retrieval: pick docs containing keywords
  const context = knowledgeDocs
    .filter(d => {
      return emailBody.toLowerCase().includes("interview") || d.text.toLowerCase().includes("meeting");
    })
    .slice(0, 3);
  const ctxText = context.map((c, i) => `${i+1}. ${c.text}`).join("\n");
  const prompt = `You are a professional candidate assistant. Use this context:\n${ctxText}\n\nEmail: "${emailBody}"\n\nCompose a short professional reply. If the email shows interest, include booking link https://cal.com/example.`;
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200
  });
  return res.choices?.[0]?.message?.content?.trim() || "Thanks!";
}
