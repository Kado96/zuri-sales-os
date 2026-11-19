import { createFileRoute } from "@tanstack/react-router";
import { Plus, Star } from "lucide-react";
import { useZuri, uid } from "@/lib/zuri-store";
import { PageHeader, Panel, Pill, FormDialog, Stat } from "@/components/zuri/ui";
import { Button } from "@/components/ui/button";
import type { Ticket } from "@/lib/zuri-data";

export const Route = createFileRoute("/sav")({
  head: () => ({ meta: [{ title: "SAV & Relations clients — ZURI Sales OS" }, { name: "description", content: "Réclamations qualité, retours et satisfaction des clients ZURI." }, { property: "og:title", content: "SAV & Relations clients — ZURI Sales OS" }, { property: "og:description", content: "Réclamations qualité, retours et satisfaction des clients ZURI." }] }),
  component: Sav,
});

function Sav() {
  const { tickets, set, clients, products } = useZuri();
  const rated = tickets.filter((t) => t.rating);
  const next = (t: Ticket) => set("tickets", (ts) => ts.map((x) => x.id === t.id ? { ...x, status: x.status === "Ouvert" ? "En cours" : "Résolu" } : x));
  return (
    <div>
      <PageHeader title="SAV & Relations clients" subtitle="Réclamations, retours et satisfaction">
        <FormDialog title="Nouveau ticket" trigger={<Button><Plus className="mr-1 h-4 w-4" />Ticket</Button>}
          fields={[{ name: "clientName", label: "Client", type: "select", options: clients.map((c) => c.name) }, { name: "kind", label: "Type", type: "select", options: ["Réclamation qualité", "Retour", "Livraison", "Satisfaction"] }, { name: "product", label: "Produit", type: "select", options: products.map((p) => p.name) }, { name: "description", label: "Description", required: true }, { name: "rating", label: "Note satisfaction (1-5, optionnel)", type: "number" }]}
          onSubmit={(v) => set("tickets", (p) => [{ id: uid("t"), clientName: v.clientName, kind: v.kind as Ticket["kind"], product: v.product, description: v.description, status: "Ouvert", rating: v.rating ? Number(v.rating) : undefined, date: new Date().toISOString().slice(0, 10) }, ...p])} />
      </PageHeader>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Stat label="Ouverts" value={tickets.filter((t) => t.status !== "Résolu").length} tone="warn" />
        <Stat label="Résolus" value={tickets.filter((t) => t.status === "Résolu").length} />
        <Stat label="Satisfaction" value={rated.length ? (rated.reduce((s, t) => s + (t.rating ?? 0), 0) / rated.length).toFixed(1) + " / 5" : "—"} tone="accent" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {tickets.map((t) => (
          <Panel key={t.id}>
            <div className="flex items-start justify-between gap-2"><div><p className="font-semibold">{t.clientName}</p><p className="text-xs text-muted-foreground">{t.kind} · {t.product} · {t.date}</p></div><Pill tone={t.status === "Résolu" ? "green" : t.status === "En cours" ? "blue" : "amber"}>{t.status}</Pill></div>
            <p className="mt-2 text-sm">{t.description}</p>
            <div className="mt-3 flex items-center justify-between">{t.rating ? <span className="flex">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={"h-4 w-4 " + (i < (t.rating ?? 0) ? "fill-accent text-accent" : "text-muted-foreground")} />)}</span> : <span />}{t.status !== "Résolu" && <Button size="sm" variant="outline" onClick={() => next(t)}>{t.status === "Ouvert" ? "Prendre en charge" : "Marquer résolu"}</Button>}</div>
          </Panel>))}
      </div>
    </div>
  );
}
