import { createFileRoute } from "@tanstack/react-router";
import { Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useZuri, uid } from "@/lib/zuri-store";
import { PageHeader, Pill, FormDialog, Stat } from "@/components/zuri/ui";
import { Button } from "@/components/ui/button";
import { REPS, STAGES, type ClientType, type Stage } from "@/lib/zuri-data";
import { fmtM } from "@/lib/zuri-logic";

export const Route = createFileRoute("/pipeline")({
  head: () => ({ meta: [{ title: "Prospection & Pipeline — ZURI Sales OS" }, { name: "description", content: "Génération de leads, qualification et suivi des opportunités commerciales ZURI." }, { property: "og:title", content: "Prospection & Pipeline — ZURI Sales OS" }, { property: "og:description", content: "Génération de leads, qualification et suivi des opportunités commerciales ZURI." }] }),
  component: Pipeline,
});

function Pipeline() {
  const { leads, set, clients } = useZuri();
  const move = (id: string, dir: 1 | -1) => set("leads", (p) => p.map((l) => {
    if (l.id !== id) return l;
    const i = STAGES.indexOf(l.stage); const next = STAGES[Math.max(0, Math.min(STAGES.length - 1, i + dir))] as Stage;
    if (next === "Perdu") { const reason = window.prompt("Raison de la perte ?") || "Non précisée"; return { ...l, stage: next, lostReason: reason }; }
    if (next === "Gagné" && !clients.some((c) => c.name === l.name)) { const t = new Date().toISOString().slice(0, 10); set("clients", (cs) => [{ id: uid("c"), name: l.name, contact: "", phone: "+257 ", city: l.city, district: "", type: l.type, rep: l.rep, revenue: 0, lastVisit: t, nextFollowUp: t, loyalty: "Fort potentiel", notes: "Converti depuis le pipeline" }, ...cs]); toast.success(l.name + " converti en client"); }
    return { ...l, stage: next };
  }));
  const open = leads.filter((l) => !["Gagné", "Perdu"].includes(l.stage));
  return (
    <div>
      <PageHeader title="Prospection & Pipeline" subtitle="Du nouveau prospect au client gagné">
        <FormDialog title="Nouveau prospect" trigger={<Button><Plus className="mr-1 h-4 w-4" />Prospect</Button>}
          fields={[{ name: "name", label: "Nom", required: true }, { name: "city", label: "Ville", defaultValue: "Bujumbura" }, { name: "source", label: "Provenance", type: "select", options: ["Visite terrain", "Recommandation", "WhatsApp", "Appel entrant", "Facebook", "Salon commercial"] }, { name: "type", label: "Type", type: "select", options: ["Grossiste", "Distributeur", "Détaillant", "Supermarché", "Quincaillerie", "Magasin ménager"] }, { name: "potential", label: "Potentiel mensuel (BIF)", type: "number", defaultValue: "1000000" }, { name: "rep", label: "Commercial", type: "select", options: REPS }]}
          onSubmit={(v) => set("leads", (p) => [{ id: uid("l"), name: v.name, city: v.city, source: v.source, type: v.type as ClientType, potential: Number(v.potential), stage: "Nouveau", rep: v.rep, score: Math.min(95, 30 + Math.round(Number(v.potential) / 200_000)) }, ...p])} />
      </PageHeader>
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Opportunités ouvertes" value={open.length} />
        <Stat label="Valeur pipeline" value={fmtM(open.reduce((s, l) => s + l.potential, 0))} tone="accent" />
        <Stat label="Gagnés" value={leads.filter((l) => l.stage === "Gagné").length} />
        <Stat label="Taux de conversion" value={Math.round((leads.filter((l) => l.stage === "Gagné").length / Math.max(1, leads.filter((l) => ["Gagné", "Perdu"].includes(l.stage)).length)) * 100) + " %"} />
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((s) => { const items = leads.filter((l) => l.stage === s); return (
          <div key={s} className="w-64 shrink-0 rounded-xl bg-muted/70 p-3">
            <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold">{s}</h3><Pill>{items.length}</Pill></div>
            <div className="grid gap-2">{items.map((l) => (
              <div key={l.id} className="rounded-lg border bg-card p-3 shadow-soft">
                <p className="text-sm font-medium">{l.name}</p>
                <p className="text-xs text-muted-foreground">{l.city} · {l.source}</p>
                <div className="mt-2 flex items-center justify-between"><span className="text-xs font-semibold">{fmtM(l.potential)}</span><Pill tone={l.score > 75 ? "green" : l.score > 50 ? "amber" : "gray"}>Score {l.score}</Pill></div>
                {l.lostReason && <p className="mt-1 text-xs text-destructive">{l.lostReason}</p>}
                <div className="mt-2 flex justify-between"><Button aria-label="Étape précédente" size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(l.id, -1)}><ChevronLeft className="h-4 w-4" /></Button><Button aria-label="Étape suivante" size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(l.id, 1)}><ChevronRight className="h-4 w-4" /></Button></div>
              </div>))}</div>
          </div>); })}
      </div>
    </div>
  );
}
