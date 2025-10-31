import React, { useEffect, useState } from "react";
import EmailList from "./EmailList";
import EmailDetail from "./EmailDetail";

type Email = {
  id: string;
  subject: string;
  from: string;
  date: string;
  folder: string;
  labels: string[];
  body_text?: string;
};

export default function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selected, setSelected] = useState<Email | null>(null);
  const [q, setQ] = useState("");

  async function fetchEmails(query = "") {
    const resp = await fetch(`/api/emails?q=${encodeURIComponent(query)}`);
    const json = await resp.json();
    setEmails(json.hits || []);
  }

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div style={{ display: "flex", padding: 16, gap: 16 }}>
      <div style={{ width: 420 }}>
        <h2>OneBox — Swathi</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={() => fetchEmails(q)}>Search</button>
        </div>
        <EmailList emails={emails} onSelect={setSelected} />
      </div>
      <div style={{ flex: 1 }}>
        <EmailDetail email={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  );
}
