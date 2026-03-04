export default function DebugPage() {
  return (
    <div style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1>Debug</h1>
      <p><b>NEXT_PUBLIC_SUPABASE_URL:</b> {process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING"}</p>
      <p><b>NEXT_PUBLIC_SUPABASE_ANON_KEY:</b> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING"}</p>
      <p style={{ marginTop: 12, color: "#555" }}>
        If either is MISSING, fix Vercel Environment Variables and Redeploy.
      </p>
    </div>
  );
}
