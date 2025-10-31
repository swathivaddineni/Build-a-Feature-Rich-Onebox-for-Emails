import React from "react";

export default function EmailList({ emails, onSelect }: any) {
  return (
    <div style={{ marginTop: 12 }}>
      {emails.length === 0 && <div>No emails yet</div>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {emails.map((e: any) => (
          <li key={e.id} style={{ padding: 8, borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => onSelect(e)}>
            <div style={{ fontWeight: 600 }}>{e.subject || "(no subject)"}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{e.from} • {new Date(e.date).toLocaleString()}</div>
            <div style={{ marginTop: 6 }}>
              {e.labels?.map((l: string) => <span key={l} style={{ marginRight: 6, fontSize: 12, background: "#f1f1f1", padding: "2px 6px", borderRadius: 4 }}>{l}</span>)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
