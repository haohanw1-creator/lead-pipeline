"use client";

import { useMemo, useState } from "react";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { useDraggable } from "@dnd-kit/core";

type Deal = {
  id: string;
  name: string;
  stage: string;
  probability: number;
  est_value: number | null;
  next_follow_up_at: string | null;
};

export default function PipelineBoard({
  stages,
  initialDeals,
}: {
  stages: string[];
  initialDeals: Deal[];
}) {
  const supabase = createSupabaseBrowser();
  const [deals, setDeals] = useState<Deal[]>(initialDeals);

  const grouped = useMemo(() => {
    const m = new Map<string, Deal[]>();
    stages.forEach((s) => m.set(s, []));
    deals.forEach((d) => {
      if (!m.has(d.stage)) m.set(d.stage, []);
      m.get(d.stage)!.push(d);
    });
    return m;
  }, [deals, stages]);

  async function onDragEnd(e: DragEndEvent) {
    const activeId = String(e.active.id);
    const overId = e.over?.id ? String(e.over.id) : null;
    if (!overId) return;

    const deal = deals.find((d) => d.id === activeId);
    if (!deal) return;

    const newStage = overId;
    if (deal.stage === newStage) return;

    setDeals((prev) =>
      prev.map((d) => (d.id === activeId ? { ...d, stage: newStage } : d))
    );

    await supabase.from("deals").update({ stage: newStage }).eq("id", activeId);
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-3">
        {stages.map((stage) => (
          <Column key={stage} stage={stage} deals={grouped.get(stage) ?? []} />
        ))}
      </div>
    </DndContext>
  );
}

function Column({ stage, deals }: { stage: string; deals: Deal[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      className={"min-w-[290px] max-w-[290px] bg-white rounded-2xl shadow p-3 " + (isOver ? "ring-2 ring-black/20" : "")}
    >
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm">{stage}</div>
        <div className="text-xs text-gray-600">{deals.length}</div>
      </div>

      <div className="mt-3 space-y-2" style={{ minHeight: 40 }}>
        {deals.map((d) => (
          <DealCard key={d.id} deal={d} />
        ))}
      </div>
    </div>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="border rounded-xl p-3 cursor-grab active:cursor-grabbing hover:bg-gray-50"
    >
      <div className="text-sm font-medium">{deal.name}</div>
      <div className="text-xs text-gray-600 mt-1">
        {deal.probability}% • Follow-up: {deal.next_follow_up_at ?? "-"}
      </div>
      {deal.est_value != null ? (
        <div className="text-xs text-gray-700 mt-1">Est: ${Number(deal.est_value).toLocaleString()}</div>
      ) : null}
    </div>
  );
}
