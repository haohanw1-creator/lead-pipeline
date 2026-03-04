"use client";

import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function SignOutButton() {
  const supabase = createSupabaseBrowser();

  return (
    <button
      className="px-3 py-2 rounded-xl border text-sm"
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
      }}
    >
      Sign out
    </button>
  );
}
