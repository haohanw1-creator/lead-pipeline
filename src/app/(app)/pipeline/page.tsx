import { createSupabaseServer } from "@/lib/supabase/server";
import PipelineBoard from "./pipelineBoard";

export default async function PipelinePage() {
  const supabase = createSupabaseServer();

  const { data: stages } = await supabase
    .from("stages")
    .select("name,order_index")
    .order("order_index", { ascending: true });

  const { data: deals } = await supabase
    .from("deals")
    .select("id,name,stage,probability,est_value,next_follow_up_at")
    .order("updated_at", { ascending: false })
    .limit(500);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow p-5">
        <h1 className="text-xl font-semibold">Pipeline</h1>
        <p className="text-sm text-gray-600 mt-1">Drag deals across stages.</p>
      </div>

      <PipelineBoard
        stages={(stages ?? []).map((s) => s.name)}
        initialDeals={deals ?? []}
      />
    </div>
  );
}
