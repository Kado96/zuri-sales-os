import { createFileRoute } from "@tanstack/react-router";
import { Download, Plus } from "lucide-react";
import { useZuri, uid } from "@/lib/zuri-store";
import { PageHeader, Panel, FormDialog, downloadCSV } from "@/components/zuri/ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { DAYS, REPS } from "@/lib/zuri-data";
import { orderTotal, isRevenueStatus, daysSince, fmtM } from "@/lib/zuri-logic";

export const Route = createFileRoute("/planning")({
  head: () => ({ meta: [{ title: "Planning & Rapports — ZURI Sales OS" }, { name: "description", content: "Tournées commerciales, objectifs hebdomadaires et exports de rapports ZURI." }, { property: "og:title", content: "Planning & Rapports — ZURI Sales OS" }, { property: "og:description", content: "Tournées commerciales, objectifs hebdomadaires et exports de rapports ZURI." }] }),
  component: Planning,
});

function Planning() {
  const { tasks, set, orders, clients, visits, users } = useZuri();
  const cName = (id: string) => clients.find((c) => c.id === id)?.name ?? "";
  const weekly = users.filter((u) => u.role === "Commercial terrain").map((u) => { const ca = orders.filter((o) => isRevenueStatus(o) && o.rep === u.name && daysSince(o.date) < 7).reduce((s, o) => s + orderTotal(o), 0); const goal = u.target / 4; return { ...u, ca, goal }; });
  return (
    <div>
      <PageHeader title="Planning & Rapports" subtitle="Tournées de la semaine, objectifs et exports">
        <FormDialog title="Nouvelle tâche / tournée" trigger={<Button variant="outline"><Plus className="mr-1 h-4 w-4" />Tâche</Button>} fields={[{ name: "title", label: "Intitulé", required: true }, { name: "rep", label: "Commercial", type: "select", options: REPS }, { name: "day", label: "Jour", type: "select", options: DAYS }]} onSubmit={(v) => set("tasks", (p) => [...p, { id: uid("k"), title: v.title, rep: v.rep, day: v.day, done: false }])} />
        <Button onClick={() => downloadCSV("zuri-ventes.csv", orders.map((o) => ({ commande: o.id, date: o.date, client: cName(o.clientId), commercial: o.rep, statut: o.status, remise: o.discount, total_bif: Math.round(orderTotal(o)) })))}><Download className="mr-1 h-4 w-4" />Export ventes</Button>
        <Button variant="secondary" onClick={() => downloadCSV("zuri-visites.csv", visits.map(({ id: _id, ...v }) => v))}><Download className="mr-1 h-4 w-4" />Export visites</Button>
      </PageHeader>
      <Panel title="Objectifs hebdomadaires" className="mb-4">
        <div className="grid gap-4 md:grid-cols-2">{weekly.map((w) => <div key={w.id}><div className="flex justify-between text-sm"><span className="font-medium">{w.name}</span><span className="text-muted-foreground">{fmtM(w.ca)} / {fmtM(w.goal)}</span></div><Progress className="mt-1.5 h-2" value={Math.min(100, (w.ca / w.goal) * 100)} /></div>)}</div>
      </Panel>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DAYS.map((d) => (
          <Panel key={d} title={d}>
            <ul className="grid gap-2">{tasks.filter((t) => t.day === d).map((t) => (
              <li key={t.id} className="flex items-start gap-2 text-sm"><Checkbox checked={t.done} onCheckedChange={(c) => set("tasks", (ts) => ts.map((x) => x.id === t.id ? { ...x, done: !!c } : x))} className="mt-0.5" /><span className={t.done ? "text-muted-foreground line-through" : ""}>{t.title}<span className="block text-xs text-muted-foreground">{t.rep}</span></span></li>))}
              {tasks.filter((t) => t.day === d).length === 0 && <li className="text-sm text-muted-foreground">Rien de prévu</li>}
            </ul>
          </Panel>))}
      </div>
    </div>
  );
}
