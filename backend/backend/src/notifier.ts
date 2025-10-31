// backend/src/notifier.ts
import axios from "axios";

const slackWebhook = process.env.SLACK_WEBHOOK_URL;
const webhookSite = process.env.WEBHOOK_SITE_URL;

export async function notifyInterested(emailDoc: any) {
  const text = `*New Interested lead*\n*Subject:* ${emailDoc.subject}\n*From:* ${emailDoc.from}\n*Snippet:* ${emailDoc.body_text?.slice(0,120)}`;
  if (slackWebhook) {
    try {
      await axios.post(slackWebhook, { text });
    } catch (e) {
      console.error("slack notify error", e);
    }
  }
  if (webhookSite) {
    try {
      await axios.post(webhookSite, { type: "interested", doc: emailDoc });
    } catch (e) {
      console.error("webhook.site post error", e);
    }
  }
}
