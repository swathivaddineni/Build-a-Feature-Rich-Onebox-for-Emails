import Imap from "node-imap";
import { simpleParser } from "mailparser";
import { es } from "./esClient";
import { indexEmailDocument } from "./indexer";

type ImapAccount = {
  id: string;
  host: string;
  port: number;
  user: string;
  password: string;
  tls: boolean;
};

function formatSinceDate(days = 30) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toDateString();
}

export function startImapForAccount(account: ImapAccount) {
  const imap = new Imap({
    user: account.user,
    password: account.password,
    host: account.host,
    port: account.port,
    tls: account.tls,
    autotls: "always"
  });

  function openInbox(cb: (err?: any, box?: any) => void) {
    imap.openBox("INBOX", true, cb);
  }

  imap.once("ready", () => {
    openInbox(async (err, box) => {
      if (err) {
        console.error("Open box err", err);
        return;
      }
      // fetch last 30 days
      const since = formatSinceDate(30);
      imap.search([["SINCE", since]], (err2, results) => {
        if (err2) {
          console.error("search error", err2);
          return;
        }
        if (!results || results.length === 0) {
          console.log("No messages to fetch for", account.id);
        } else {
          const f = imap.fetch(results, { bodies: "" });
          f.on("message", (msg, seqno) => {
            msg.on("body", async (stream) => {
              try {
                const parsed = await simpleParser(stream);
                await indexEmailDocument(account.id, parsed);
              } catch (e) {
                console.error("parse/index error", e);
              }
            });
          });
        }
      });

      // realtime: listen to new mails
      imap.on("mail", (numNew) => {
        // fetch the most recent message(s)
        const criteria = ["ALL"];
        imap.search(criteria, (err3, uids) => {
          if (err3 || !uids || !uids.length) return;
          const lastUid = uids.slice(-1);
          const f = imap.fetch(lastUid, { bodies: "" });
          f.on("message", (msg) => {
            msg.on("body", async (stream) => {
              try {
                const parsed = await simpleParser(stream);
                await indexEmailDocument(account.id, parsed);
              } catch (e) {
                console.error("mail event parse error", e);
              }
            });
          });
        });
      });
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP error", err);
    setTimeout(() => {
      try {
        imap.connect();
      } catch {}
    }, 5000);
  });

  imap.once("end", () => {
    console.log("IMAP connection ended for", account.id);
    setTimeout(() => {
      try {
        imap.connect();
      } catch {}
    }, 5000);
  });

  imap.connect();
}
