import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useZuri, uid } from "@/lib/zuri-store";
import { PageHeader, Panel, Pill, FormDialog } from "@/components/zuri/ui";
import { Button } from "@/components/ui/button";
import { fmtBIF } from "@/lib/zuri-logic";

export const Route = createFileRoute("/veille")({
  head: () => ({ meta: [{ title: "Veille concurrentielle — ZURI Sales OS" }, { name: "description", content: "Relevés de prix du marché burundais et comparaison des produits concurrents face à ZURI." }, { property: "og:title", content: "Veille concurrentielle — ZURI Sales OS" }, { property: "og:description", content: "Relevés de prix du marché burundais et comparaison des produits concurrents face à ZURI." }] }),
  component: Veille,
});

function Veille() {
  const { competitors, products, set } = useZuri();
  const ours = (eq: string) => products.find((p) => eq.toLowerCase().startsWith(p.name.toLowerCase()));
  return (
    <div>
      <PageHeader title="Veille concurrentielle" subtitle="Relevés de prix terrain comparés au prix officiel ZURI">
        <FormDialog title="Nouveau relevé de prix" trigger={<Button><Plus className="mr-1 h-4 w-4" />Relevé</Button>}
          fields={[{ name: "competitor", label: "Concurrent", required: true }, { name: "product", label: "Produit concurrent", required: true }, { name: "equivalent", label: "Équivalent ZURI", type: "select", options: products.map((p) => p.name + " " + p.capacity + "L") }, { name: "price", label: "Prix constaté (BIF)", type: "number", required: true }, { name: "market", label: "Marché / lieu", defaultValue: "Marché central Bujumbura" }]}
          onSubmit={(v) => set("competitors", (p) => [{ id: uid("cp"), competitor: v.competitor, product: v.product, equivalent: v.equivalent, price: Number(v.price), market: v.market, date: new Date().toISOString().slice(0, 10) }, ...p])} />
      </PageHeader>
      <Panel>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b text-left text-xs uppercase text-muted-foreground"><th className="py-2">Concurrent</th><th>Produit</th><th>Équiv. ZURI</th><th className="text-right">Prix concurrent</th><th className="text-right">Prix ZURI</th><th className="pl-3">Écart</th><th className="hidden md:table-cell">Lieu</th></tr></thead>
          <tbody>{competitors.map((c) => { const p = ours(c.equivalent); const gap = p ? ((p.price - c.price) / c.price) * 100 : 0; return (
            <tr key={c.id} className="border-b last:border-0"><td className="py-2.5 font-medium">{c.competitor}</td><td>{c.product}</td><td>{c.equivalent}</td><td className="text-right">{fmtBIF(c.price)}</td><td className="text-right">{p ? fmtBIF(p.price) : "—"}</td><td className="pl-3"><Pill tone={gap > 5 ? "red" : gap < -5 ? "green" : "amber"}>{gap > 0 ? "+" : ""}{gap.toFixed(0)} %</Pill></td><td className="hidden md:table-cell text-muted-foreground">{c.market} · {c.date}</td></tr>); })}</tbody>
        </table></div>
      </Panel>
    </div>
  );
}
