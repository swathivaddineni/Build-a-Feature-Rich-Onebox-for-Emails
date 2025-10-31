// backend/src/indexer.ts
import { es } from "./esClient";
import { v4 as uuidv4 } from "uuid";
import { simpleParser } from "mailparser";

export async function indexEmailDocument(accountId: string, parsedMail: any) {
  try {
    const docId = (parsedMail.messageId || uuidv4()).replace(/[<>]/g, "");
    const bodyText = parsedMail.text || parsedMail.html || "";
    const doc = {
      subject: parsedMail.subject || "",
      from: parsedMail.from?.text || "",
      to: parsedMail.to?.text || "",
      body_text: bodyText,
      folder: parsedMail.folder || "INBOX",
      accountId,
      date: parsedMail.date || new Date(),
      labels: []
    };
    await es.index({
      index: "emails_v1",
      id: docId,
      document: doc
    });
    console.log("Indexed email", docId, "account", accountId);
    return docId;
  } catch (err) {
    console.error("indexEmailDocument err", err);
    throw err;
  }
}
