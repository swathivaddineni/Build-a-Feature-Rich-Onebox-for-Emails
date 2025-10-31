// backend/src/categorizer.ts
import OpenAI from "openai";
import { es } from "./esClient";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const promptTemplate = (subject: string, text: string) => {
  return `You are an email classifier. Choose one of the labels exactly: Interested, Meeting Booked, Not Interested, Spam, Out of Office.

Examples:
Subject: "Out of office auto-reply"
Body: "I am on leave until next week."
Label: Out of Office

Subject: "Re: Sales Inquiry"
Body: "Thanks, I'm interested in learning more. Can we schedule a call?"
Label: Interested

Now label this email:
Subject: "${subject}"
Body: "${text}"
Label:`;
};

export async function classifyAndStore(docId: string, subject: string, text: string) {
  try {
    const prompt = promptTemplate(subject, text).slice(0, 3800);
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 16,
      temperature: 0.0
    });

    const labelRaw = res.choices?.[0]?.message?.content?.trim() || "Not Interested";
    const label = labelRaw.split("\n")[0].replace(/\./g, "").trim();
    // update ES doc
    await es.update({
      index: "emails_v1",
      id: docId,
      doc: {
        labels: [label]
      },
      retry_on_conflict: 3
    });
    return label;
  } catch (err) {
    console.error("classification error", err);
    return "Not Interested";
  }
}
