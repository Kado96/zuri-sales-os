import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { useZuri } from "@/lib/zuri-store";
import { PageHeader, Panel, Pill, Stat } from "@/components/zuri/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { stockState, daysOfCover, reorderQty } from "@/lib/zuri-logic";

export const Route = createFileRoute("/stocks")({
  head: () => ({ meta: [{ title: "Stocks & Disponibilités — ZURI Sales OS" }, { name: "description", content: "Niveaux de stock usine ZURI, alertes de rupture, production en cours et réapprovisionnement." }, { property: "og:title", content: "Stocks & Disponibilités — ZURI Sales OS" }, { property: "og:description", content: "Niveaux de stock usine ZURI, alertes de rupture, production en cours et réapprovisionnement." }] }),
  component: Stocks,
});

type Move = { id: string; productId: string; qty: number; kind: "Entrée" | "Sortie"; by: string; validated: boolean };

function Stocks() {
  const { products, orders, set, role } = useZuri();
  const [moves, setMoves] = useState<Move[]>([]);
  const [pid, setPid] = useState(products[0].id); const [qty, setQty] = useState(100); const [kind, setKind] = useState<Move["kind"]>("Entrée");
  const canValidate = role === "Direction" || role === "Gestionnaire de stock";
  const reserved = (id: string) => orders.filter((o) => ["Confirmée", "En préparation"].includes(o.status)).reduce((s, o) => s + o.lines.filter((l) => l.productId === id).reduce((a, l) => a + l.qty, 0), 0);
  const validate = (m: Move) => { set("products", (ps) => ps.map((p) => p.id === m.productId ? { ...p, stock: Math.max(0, p.stock + (m.kind === "Entrée" ? m.qty : -m.qty)) } : p)); setMoves((ms) => ms.map((x) => x.id === m.id ? { ...x, validated: true } : x)); toast.success("Mouvement validé"); };
  return (
    <div>
      <PageHeader title="Stocks & Disponibilités" subtitle="Stock usine Bujumbura · les mouvements doivent être validés par un responsable autorisé" />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Références" value={products.length} />
        <Stat label="En rupture" value={products.filter((p) => stockState(p) === "Rupture").length} tone="danger" />
        <Stat label="Stock faible" value={products.filter((p) => stockState(p) === "Faible").length} tone="warn" />
        <Stat label="En production" value={products.reduce((s, p) => s + p.inProduction, 0) + " u"} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Niveaux de stock">
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs uppercase text-muted-foreground"><th className="py-2">Produit</th><th className="text-right">Dispo</th><th className="text-right">Réservé</th><th className="text-right hidden sm:table-cell">Production</th><th className="text-right hidden sm:table-cell">Couverture</th><th className="text-right">Réassort</th><th className="pl-3">État</th></tr></thead>
            <tbody>{products.map((p) => { const st = stockState(p), r = reserved(p.id), cov = daysOfCover(p); return (
              <tr key={p.id} className="border-b last:border-0"><td className="py-2.5 font-medium">{p.name} <span className="text-muted-foreground">{p.capacity}L</span></td><td className="text-right">{p.stock}</td><td className={"text-right " + (r > p.stock ? "text-destructive font-semibold" : "")}>{r}{r > p.stock && <span className="block text-xs">manque {r - p.stock}</span>}</td><td className="text-right hidden sm:table-cell">{p.inProduction}</td><td className="text-right hidden sm:table-cell">{cov === Infinity ? "—" : cov + " j"}</td><td className="text-right">{reorderQty(p) || "—"}</td><td className="pl-3"><Pill tone={st === "OK" ? "green" : st === "Faible" ? "amber" : "red"}>{st}</Pill></td></tr>); })}</tbody>
          </table></div>
        </Panel>
        <Panel title="Mouvements de stock">
          <div className="grid gap-2">
            <select value={pid} onChange={(e) => setPid(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm">{products.map((p) => <option key={p.id} value={p.id}>{p.name} {p.capacity}L</option>)}</select>
            <div className="flex gap-2"><select value={kind} onChange={(e) => setKind(e.target.value as Move["kind"])} className="h-9 rounded-md border border-input bg-background px-2 text-sm"><option>Entrée</option><option>Sortie</option></select><Input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} /></div>
            <Button onClick={() => { setMoves((m) => [{ id: Math.random().toString(36), productId: pid, qty, kind, by: role, validated: false }, ...m]); toast.info("Mouvement soumis pour validation"); }}>Déclarer le mouvement</Button>
          </div>
          <ul className="mt-4 grid gap-2 text-sm">
            {moves.length === 0 && <li className="text-muted-foreground">Aucun mouvement déclaré.</li>}
            {moves.map((m) => <li key={m.id} className="flex items-center justify-between gap-2 rounded-md border p-2"><span>{m.kind} {m.qty} × {products.find((p) => p.id === m.productId)?.name}<span className="block text-xs text-muted-foreground">par {m.by}</span></span>{m.validated ? <Pill tone="green">Validé</Pill> : canValidate ? <Button size="sm" onClick={() => validate(m)}>Valider</Button> : <Pill tone="amber"><Lock className="mr-1 h-3 w-3" />En attente</Pill>}</li>)}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
