import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import SignOutButton from "./signOutButton";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  const userEmail = data.user?.email ?? "";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 bg-white border-b">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <Link className="font-semibold" href="/dashboard">Lead Pipeline</Link>
            <nav className="flex gap-3 text-sm text-gray-700">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/pipeline">Pipeline</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 hidden sm:block">{userEmail}</div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}
