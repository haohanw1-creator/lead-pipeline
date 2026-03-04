"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function LoginPage() {
  const supabase = createSupabaseBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setMsg(null);

  if (mode === "signin") {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return setMsg(error.message);
    setMsg("Signed in.");
    return;
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) return setMsg(error.message);
  setMsg("Account created. You can sign in now.");
}
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold">Lead Pipeline</h1>
        <p className="text-sm text-gray-600 mt-1">Login to your private CRM.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full border rounded-xl p-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            className="w-full border rounded-xl p-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />

          <button className="w-full rounded-xl bg-black text-white p-3 font-medium">
            {mode === "signin" ? "Sign in" : "Sign up"}
          </button>

          <button
            type="button"
            className="w-full rounded-xl border p-3"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            Switch to {mode === "signin" ? "Sign up" : "Sign in"}
          </button>

          {msg ? <p className="text-sm text-gray-700">{msg}</p> : null}
        </form>
      </div>
    </div>
  );
}
