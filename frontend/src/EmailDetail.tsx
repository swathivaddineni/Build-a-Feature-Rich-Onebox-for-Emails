import React from "react";

export default function EmailDetail({ email, onClose }: any) {
  const [suggestion, setSuggestion] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  if (!email) return <div>Select an email to view details</div>;

  async function requestSuggestion() {
    setLoading(true);
    const resp = await fetch("/api/rag/suggest", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ emailId: email.id }) });
    const j = await resp.json();
    setSuggestion(j.suggestion);
    setLoading(false);
  }

  return (
    <div>
      <button onClick={onClose}>Back</button>
      <h3>{email.subject}</h3>
      <div style={{ color: "#666", marginBottom: 12 }}>{email.from} • {new Date(email.date).toLocaleString()}</div>
      <pre style={{ whiteSpace: "pre-wrap", background: "#fafafa", padding: 12 }}>{email.body_text}</pre>
      <div style={{ marginTop: 12 }}>
        <button onClick={requestSuggestion} disabled={loading}>Suggest Reply</button>
        {loading && <div>Loading...</div>}
        {suggestion && (
          <div style={{ marginTop: 12 }}>
            <h4>Suggested Reply:</h4>
            <div style={{ whiteSpace: "pre-wrap", border: "1px solid #eee", padding: 12 }}>{suggestion}</div>
          </div>
        )}
      </div>
    </div>
  );
}
