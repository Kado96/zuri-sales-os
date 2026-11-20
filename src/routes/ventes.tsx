import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, FileText, ArrowRight, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useZuri } from "@/lib/zuri-store";
import { PageHeader, Panel, Pill } from "@/components/zuri/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ORDER_FLOW, MAX_DISCOUNT, type Order, type OrderLine, type OrderStatus } from "@/lib/zuri-data";
import { fmtBIF, fmtM, orderSubtotal, orderTotal, needsApproval, shortage } from "@/lib/zuri-logic";

export const Route = createFileRoute("/ventes")({
  head: () => ({ meta: [{ title: "Ventes & Commandes — ZURI Sales OS" }, { name: "description", content: "Devis, bons de commande, proformas, livraisons et paiements ZURI en BIF." }, { property: "og:title", content: "Ventes & Commandes — ZURI Sales OS" }, { property: "og:description", content: "Devis, bons de commande, proformas, livraisons et paiements ZURI en BIF." }] }),
  component: Ventes,
});

const tone = (s: OrderStatus) => (s === "Payée" ? "green" : s === "Annulée" ? "red" : s === "En attente d'approbation" ? "amber" : ["Devis", "Brouillon"].includes(s) ? "gray" : "blue");

function Ventes() {
  const { orders, clients, products, set, role, users, isFiltered } = useZuri();
  const [open, setOpen] = useState(false); const [filter, setFilter] = useState("Toutes");
  const [clientId, setClientId] = useState(clients[0]?.id ?? ""); const [tier, setTier] = useState<"price" | "wholesale" | "distributor">("wholesale");
  const [lines, setLines] = useState<OrderLine[]>([]); const [discount, setDiscount] = useState(0);
  const cName = (id: string) => clients.find((c) => c.id === id)?.name ?? "—";
  const pr = (id: string) => products.find((p) => p.id === id)!;
  const canApprove = role === "Direction" || role === "Responsable Commercial";

  const save = (asQuote: boolean) => {
    if (!lines.length) return toast.error("Ajoutez au moins un produit");
    const status: OrderStatus = asQuote ? "Devis" : needsApproval(discount, role) ? "En attente d'approbation" : "Confirmée";
    const o: Order = { id: "CMD-" + (2400 + orders.length + Math.floor(Math.random() * 90)), clientId, date: new Date().toISOString().slice(0, 10), lines, discount, status, rep: users.find((u) => u.role === "Commercial terrain")?.name ?? "", paid: 0 };
    set("orders", (p) => [o, ...p]); setOpen(false); setLines([]); setDiscount(0);
    if (status === "En attente d'approbation") toast.warning(`Remise de ${discount} % > limite ${MAX_DISCOUNT[role]} % : envoyée en approbation`); else toast.success(asQuote ? "Devis créé" : "Commande confirmée");
  };
  const advance = (o: Order) => {
    if (o.status === "En attente d'approbation" && !canApprove) return toast.error("Seule la direction ou le responsable commercial peut approuver");
    const i = ORDER_FLOW.indexOf(o.status); const next = ORDER_FLOW[i + 1]; if (!next) return;
    if (next === "Prête à livrer") { set("products", (ps) => ps.map((p) => { const l = o.lines.find((x) => x.productId === p.id); return l ? { ...p, stock: Math.max(0, p.stock - l.qty) } : p; })); }
    set("orders", (p) => p.map((x) => x.id === o.id ? { ...x, status: next, paid: next === "Payée" ? orderTotal(x) : x.paid } : x));
  };
  const printQuote = (o: Order) => {
    const w = window.open("", "_blank"); if (!w) return;
    w.document.write(`<html><head><title>${o.id}</title><style>body{font-family:sans-serif;padding:40px}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ddd;padding:8px;text-align:left}h1{margin:0}</style></head><body><h1>ZURI — Zahara Industries SPRL</h1><p>Bujumbura, Burundi</p><h2>${o.status === "Devis" ? "Devis / Proforma" : "Bon de commande"} ${o.id}</h2><p>Client : <b>${cName(o.clientId)}</b><br/>Date : ${o.date}</p><table><tr><th>Produit</th><th>Qté</th><th>P.U. (BIF)</th><th>Total</th></tr>${o.lines.map((l) => `<tr><td>${pr(l.productId).name} ${pr(l.productId).capacity}L</td><td>${l.qty}</td><td>${fmtBIF(l.unit)}</td><td>${fmtBIF(l.qty * l.unit)}</td></tr>`).join("")}</table><p>Sous-total : ${fmtBIF(orderSubtotal(o))}<br/>Remise : ${o.discount} %<br/><b>Total : ${fmtBIF(orderTotal(o))}</b></p><script>print()</script></body></html>`);
    w.document.close();
  };
  const list = orders.filter((o) => (filter === "Toutes" || o.status === filter) && isFiltered(o.date));
  const draft = { lines, discount };
  return (
    <div>
      <PageHeader title="Ventes & Commandes" subtitle={`Votre rôle : ${role} · remise autorisée jusqu'à ${MAX_DISCOUNT[role]} %`}>
        <Button onClick={() => setOpen(true)}><Plus className="mr-1 h-4 w-4" />Nouveau devis / commande</Button>
      </PageHeader>
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">{["Toutes", ...ORDER_FLOW, "Annulée"].map((s) => <button key={s} onClick={() => setFilter(s)} className={"shrink-0 rounded-full border px-3 py-1 text-xs " + (filter === s ? "border-primary bg-primary text-primary-foreground" : "bg-card")}>{s} {s !== "Toutes" && `(${orders.filter((o) => o.status === s).length})`}</button>)}</div>
      <Panel>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b text-left text-xs uppercase text-muted-foreground"><th className="py-2">N°</th><th>Client</th><th className="hidden md:table-cell">Date</th><th className="text-right">Montant</th><th className="pl-3">Statut</th><th /></tr></thead>
          <tbody>{list.map((o) => (
            <tr key={o.id} className="border-b last:border-0">
              <td className="py-2.5 font-medium">{o.id}</td><td className="max-w-40 truncate">{cName(o.clientId)}</td><td className="hidden md:table-cell text-muted-foreground">{o.date}</td>
              <td className="text-right font-medium">{fmtM(orderTotal(o))}{o.discount > 0 && <span className="block text-xs text-muted-foreground">-{o.discount} %</span>}</td>
              <td className="pl-3"><Pill tone={tone(o.status)}>{o.status}</Pill></td>
              <td className="whitespace-nowrap text-right">
                <Button size="icon" variant="ghost" aria-label="Imprimer / PDF" onClick={() => printQuote(o)}><FileText className="h-4 w-4" /></Button>
                {o.status !== "Payée" && o.status !== "Annulée" && <Button size="sm" variant="outline" onClick={() => advance(o)}>{o.status === "En attente d'approbation" ? "Approuver" : o.status === "Devis" ? "Accepté" : ORDER_FLOW[ORDER_FLOW.indexOf(o.status) + 1]}<ArrowRight className="ml-1 h-3 w-3" /></Button>}
              </td>
            </tr>))}</tbody>
        </table></div>
      </Panel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>Nouveau devis / commande</DialogTitle></DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">Client<select value={clientId} onChange={(e) => setClientId(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2">{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <label className="text-sm">Tarif<select value={tier} onChange={(e) => setTier(e.target.value as typeof tier)} className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2"><option value="price">Prix officiel</option><option value="wholesale">Grossiste</option><option value="distributor">Distributeur</option></select></label>
          </div>
          <div className="grid gap-2">
            {lines.map((l, i) => { const p = pr(l.productId); const miss = shortage(p, l.qty); return (
              <div key={i} className="rounded-lg border p-2">
                <div className="flex items-center gap-2">
                  <select value={l.productId} onChange={(e) => { const np = pr(e.target.value); setLines((ls) => ls.map((x, j) => j === i ? { ...x, productId: np.id, unit: np[tier] } : x)); }} className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-sm">{products.map((p) => <option key={p.id} value={p.id}>{p.name} {p.capacity}L</option>)}</select>
                  <Input type="number" min={1} className="w-24" value={l.qty} onChange={(e) => setLines((ls) => ls.map((x, j) => j === i ? { ...x, qty: Number(e.target.value) } : x))} />
                  <Button size="icon" variant="ghost" aria-label="Retirer" onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{fmtBIF(l.unit)} × {l.qty} = <b>{fmtBIF(l.unit * l.qty)}</b></p>
                {miss > 0 && <p className="mt-1 flex items-center gap-1 text-xs text-destructive"><AlertTriangle className="h-3 w-3" />Stock insuffisant : {p.stock} disponibles, manque {miss} unités — le gestionnaire de stock sera alerté.</p>}
              </div>); })}
            <Button variant="outline" size="sm" onClick={() => setLines((ls) => [...ls, { productId: products[0].id, qty: products[0].moq, unit: products[0][tier] }])}><Plus className="mr-1 h-4 w-4" />Ajouter un produit</Button>
          </div>
          <label className="text-sm">Remise (%)<Input type="number" min={0} max={30} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="mt-1 w-28" /></label>
          {needsApproval(discount, role) && <p className="text-xs text-warning-foreground">Remise supérieure à votre limite ({MAX_DISCOUNT[role]} %) : la commande passera en approbation.</p>}
          <div className="rounded-lg bg-muted p-3 text-sm"><div className="flex justify-between"><span>Sous-total</span><span>{fmtBIF(orderSubtotal(draft))}</span></div><div className="flex justify-between font-display text-lg font-bold"><span>Total</span><span>{fmtBIF(orderTotal(draft))}</span></div></div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end"><Button variant="outline" onClick={() => save(true)}>Enregistrer comme devis</Button><Button onClick={() => save(false)}>Créer la commande</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
