import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default async function DashboardPage() {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Ensure default stages exist for this user
  const { data: existingStages } = await supabase
    .from("stages")
    .select("id,name,order_index")
    .order("order_index", { ascending: true });

  if (!existingStages || existingStages.length === 0) {
    const defaults = [
      "Lead",
      "Contacted",
      "RFQ / Quoted",
      "Sample / Testing",
      "Negotiation",
      "PO Pending",
      "Won",
      "Lost",
    ];
    await supabase.from("stages").insert(
      defaults.map((name, idx) => ({
        owner_user_id: user.id,
        name,
        order_index: idx + 1,
      }))
    );
  }

  const today = todayISO();
  const next7 = addDaysISO(7);

  const { data: dueDeals } = await supabase
    .from("deals")
    .select("id,name,stage,next_follow_up_at")
    .lte("next_follow_up_at", today)
    .order("next_follow_up_at", { ascending: true })
    .limit(50);

  const { data: weekDeals } = await supabase
    .from("deals")
    .select("id,name,stage,next_follow_up_at")
    .gte("next_follow_up_at", today)
    .lte("next_follow_up_at", next7)
    .order("next_follow_up_at", { ascending: true })
    .limit(50);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-5">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Follow-ups you need to do.</p>

        <div className="mt-4 flex gap-2">
          <Link className="px-3 py-2 rounded-xl bg-black text-white text-sm" href="/pipeline">
            Open Pipeline
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-semibold">Due Today / Overdue</h2>
          <div className="mt-3 space-y-2">
            {(dueDeals ?? []).length === 0 ? (
              <p className="text-sm text-gray-600">Nothing due.</p>
            ) : (
              (dueDeals ?? []).map((d: any) => (
                <div key={d.id} className="border rounded-xl p-3">
                  <div className="text-sm font-medium">{d.name}</div>
                  <div className="text-xs text-gray-600">
                    {d.stage} • Follow-up: {d.next_follow_up_at ?? "-"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-semibold">Next 7 Days</h2>
          <div className="mt-3 space-y-2">
            {(weekDeals ?? []).length === 0 ? (
              <p className="text-sm text-gray-600">No scheduled follow-ups.</p>
            ) : (
              (weekDeals ?? []).map((d: any) => (
                <div key={d.id} className="border rounded-xl p-3">
                  <div className="text-sm font-medium">{d.name}</div>
                  <div className="text-xs text-gray-600">
                    {d.stage} • Follow-up: {d.next_follow_up_at ?? "-"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="font-semibold">Quick start</h2>
        <ol className="list-decimal ml-5 mt-2 text-sm text-gray-700 space-y-1">
          <li>Go to Pipeline</li>
          <li>Create deals in Supabase Table Editor (temporary) until we add forms</li>
          <li>Drag deals across stages</li>
        </ol>
        <p className="text-xs text-gray-500 mt-2">
          Next step: we add “Create Account/Deal/Activity” pages so you don’t need Supabase editor.
        </p>
      </div>
    </div>
  );
}
