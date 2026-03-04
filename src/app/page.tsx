import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold">Lead Pipeline</h1>
        <p className="text-sm text-gray-600 mt-2">
          A simple personal CRM (accounts + deals + pipeline + follow-ups).
        </p>
        <div className="mt-5">
          <Link className="inline-flex px-4 py-2 rounded-xl bg-black text-white text-sm" href="/login">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
