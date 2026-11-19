import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Send, PackagePlus, PhoneCall, TrendingUp, Target } from "lucide-react";
import { useZuri } from "@/lib/zuri-store";
import { PageHeader, Panel, Pill } from "@/components/zuri/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MONTHLY_TARGET } from "@/lib/zuri-data";
import { daysOfCover, reorderQty, daysSince, leadPriority, fmtM, orderTotal, isRevenueStatus } from "@/lib/zuri-logic";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "ZURI AI Business Assistant — ZURI Sales OS" }, { name: "description", content: "Recommandations commerciales, suggestions de réassort et prévisions de ventes ZURI." }, { property: "og:title", content: "ZURI AI Business Assistant — ZURI Sales OS" }, { property: "og:description", content: "Recommandations commerciales, suggestions de réassort et prévisions de ventes ZURI." }] }),
  component: Assistant,
});

function Assistant() {
  const z = useZuri();
  const rev = z.orders.filter(isRevenueStatus);
  const month = rev.filter((o) => daysSince(o.date) < 30).reduce((s, o) => s + orderTotal(o), 0);
  const dayOfMonth = new Date().getDate(); const forecast = (month / Math.max(1, Math.min(30, dayOfMonth + 15))) * 30;
  const restock = z.products.filter((p) => reorderQty(p) > 0).sort((a, b) => daysOfCover(a) - daysOfCover(b));
  const inactive = z.clients.filter((c) => daysSince(c.lastVisit) > 20).sort((a, b) => b.revenue - a.revenue);
  const hotLeads = z.leads.filter((l) => !["Gagné", "Perdu"].includes(l.stage)).sort((a, b) => leadPriority(b) - leadPriority(a)).slice(0, 3);
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([{ me: false, t: "Bonjour ! Je suis ZURI AI. Demandez-moi : « réassort », « relances », « prévision », « prospects » ou « meilleur produit »." }]);
  const [q, setQ] = useState("");
  const answer = (s: string) => {
    const x = s.toLowerCase();
    if (x.includes("réassort") || x.includes("stock")) return restock.length ? "À réapprovisionner en priorité : " + restock.slice(0, 4).map((p) => `${p.name} ${p.capacity}L (+${reorderQty(p)} u, couverture ${daysOfCover(p) === Infinity ? "—" : daysOfCover(p) + " j"})`).join(", ") + "." : "Aucun réassort urgent.";
    if (x.includes("relance") || x.includes("inactif")) return "Clients à relancer : " + inactive.slice(0, 4).map((c) => `${c.name} (${daysSince(c.lastVisit)} j sans visite)`).join(", ") + ".";
    if (x.includes("prévi") || x.includes("objectif")) return `Au rythme actuel, le mois devrait clôturer autour de ${fmtM(forecast)}, soit ${Math.round((forecast / MONTHLY_TARGET) * 100)} % de l'objectif de ${fmtM(MONTHLY_TARGET)}.`;
    if (x.includes("prospect") || x.includes("lead")) return "Prospects à contacter en priorité : " + hotLeads.map((l) => `${l.name} (score ${l.score}, ${l.stage})`).join(", ") + ".";
    if (x.includes("produit") || x.includes("meilleur")) { const top = [...z.products].sort((a, b) => b.sold30 - a.sold30); return `Meilleures ventes 30 j : ${top.slice(0, 3).map((p) => p.name).join(", ")}. À dynamiser : ${top.slice(-2).map((p) => p.name).join(", ")} — proposez-les en lot avec Ghajini.`; }
    return "Je peux vous aider sur : réassort, relances, prévision, prospects, meilleur produit.";
  };
  const send = (t: string) => { if (!t.trim()) return; setMsgs((m) => [...m, { me: true, t }, { me: false, t: answer(t) }]); setQ(""); };
  return (
    <div>
      <PageHeader title="ZURI AI Business Assistant" subtitle="Recommandations calculées à partir de vos ventes, stocks et visites" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="grid gap-4">
          <Panel title="Prévision du mois" action={<TrendingUp className="h-4 w-4 text-primary" />}><p className="font-display text-3xl font-bold">{fmtM(forecast)}</p><p className="text-sm text-muted-foreground">{Math.round((forecast / MONTHLY_TARGET) * 100)} % de l'objectif projeté</p></Panel>
          <Panel title="Suggestions de réassort" action={<PackagePlus className="h-4 w-4 text-primary" />}><ul className="grid gap-2 text-sm">{restock.slice(0, 5).map((p) => <li key={p.id} className="flex justify-between"><span>{p.name} {p.capacity}L</span><Pill tone={daysOfCover(p) < 15 ? "red" : "amber"}>+{reorderQty(p)} u</Pill></li>)}</ul></Panel>
          <Panel title="Clients à relancer" action={<PhoneCall className="h-4 w-4 text-primary" />}><ul className="grid gap-2 text-sm">{inactive.slice(0, 5).map((c) => <li key={c.id} className="flex justify-between gap-2"><span className="truncate">{c.name}</span><span className="text-muted-foreground">{daysSince(c.lastVisit)} j</span></li>)}</ul></Panel>
          <Panel title="Prospects prioritaires" action={<Target className="h-4 w-4 text-primary" />}><ul className="grid gap-2 text-sm">{hotLeads.map((l) => <li key={l.id} className="flex justify-between gap-2"><span className="truncate">{l.name}</span><Pill tone="green">{l.score}</Pill></li>)}</ul></Panel>
        </div>
        <Panel title="Discuter avec ZURI AI" action={<Sparkles className="h-4 w-4 text-accent-foreground" />} className="flex flex-col">
          <div className="mb-3 flex max-h-[28rem] min-h-72 flex-1 flex-col gap-2 overflow-y-auto">{msgs.map((m, i) => <div key={i} className={"max-w-[85%] rounded-xl px-3 py-2 text-sm " + (m.me ? "self-end bg-primary text-primary-foreground" : "self-start bg-muted")}>{m.t}</div>)}</div>
          <div className="mb-2 flex flex-wrap gap-1.5">{["Réassort", "Relances", "Prévision", "Prospects", "Meilleur produit"].map((s) => <button key={s} onClick={() => send(s)} className="rounded-full border px-2.5 py-1 text-xs hover:bg-muted">{s}</button>)}</div>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); send(q); }}><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Posez votre question…" /><Button type="submit" size="icon" aria-label="Envoyer"><Send className="h-4 w-4" /></Button></form>
        </Panel>
      </div>
    </div>
  );
}
