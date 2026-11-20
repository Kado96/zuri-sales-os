import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  ShoppingCart,
  UserPlus,
  Clock,
  BellRing,
  Sparkles,
  MapPin,
} from "lucide-react";
import { useZuri } from "@/lib/zuri-store";
import { PageHeader, Panel, Stat, Pill } from "@/components/zuri/ui";
import {
  fmtM,
  orderTotal,
  isRevenueStatus,
  daysSince,
  clientsToFollowUp,
  stockState,
} from "@/lib/zuri-logic";
import { MONTHLY_TARGET } from "@/lib/zuri-data";
import { Progress } from "@/components/ui/progress";
import { BurundiClientMap } from "@/components/zuri/burundi-map";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — ZURI Sales OS" },
      {
        name: "description",
        content:
          "KPIs commerciaux ZURI en BIF : chiffre d'affaires, objectifs, carte interactive des clients et approvisionnement.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { orders, products, clients, users, isFiltered, t, lang } = useZuri();
  const rev = orders.filter((o) => isRevenueStatus(o) && isFiltered(o.date));
  const sum = (days: number) =>
    rev.filter((o) => daysSince(o.date) < days).reduce((s, o) => s + orderTotal(o), 0);
  const month = sum(30),
    pct = Math.min(100, (month / MONTHLY_TARGET) * 100);
  const pending = orders.filter((o) =>
    ["En attente d'approbation", "Confirmée", "En préparation", "Prête à livrer"].includes(
      o.status
    )
  ).length;
  const units = products
    .map((p) => ({
      name: p.name,
      units: rev.reduce(
        (s, o) =>
          s +
          o.lines
            .filter((l) => l.productId === p.id)
            .reduce((a, l) => a + l.qty, 0),
        0
      ),
    }))
    .sort((a, b) => b.units - a.units);
  const trend = Array.from({ length: 14 }, (_, i) => {
    const day = 13 - i;
    return {
      j: `J-${day}`,
      ca:
        rev
          .filter((o) => daysSince(o.date) === day)
          .reduce((s, o) => s + orderTotal(o), 0) / 1e6,
    };
  });
  const topClients = clients
    .map((c) => ({
      ...c,
      ca: rev
        .filter((o) => o.clientId === c.id)
        .reduce((s, o) => s + orderTotal(o), 0),
    }))
    .sort((a, b) => b.ca - a.ca)
    .slice(0, 10);
  const reps = users
    .filter((u) => u.role === "Commercial terrain")
    .map((u) => {
      const ca = rev
        .filter((o) => o.rep === u.name && daysSince(o.date) < 30)
        .reduce((s, o) => s + orderTotal(o), 0);
      return { ...u, ca, pct: u.target ? (ca / u.target) * 100 : 0 };
    });
  const alerts = products.filter((p) => stockState(p) !== "OK");
  const follow = clientsToFollowUp(clients);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard")}
        subtitle={`${lang === "fr" ? "Vue d'ensemble commerciale" : "Executive Sales Overview"} · ${new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { weekday: "long", day: "numeric", month: "long" })}`}
      />

      {/* Cartes KPI Principales */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          tone="accent"
          label={lang === "fr" ? "CA du mois" : "Monthly Revenue"}
          value={fmtM(month)}
          hint={`${lang === "fr" ? "Objectif" : "Target"} ${fmtM(MONTHLY_TARGET)}`}
        />
        <Stat
          label={lang === "fr" ? "CA semaine" : "Weekly Revenue"}
          value={fmtM(sum(7))}
          hint={`${lang === "fr" ? "Aujourd'hui" : "Today"} : ${fmtM(sum(1))}`}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <Stat
          label={lang === "fr" ? "Commandes" : "Orders"}
          value={rev.filter((o) => daysSince(o.date) < 30).length}
          hint={`${pending} ${lang === "fr" ? "en attente" : "pending"}`}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <Stat
          label={lang === "fr" ? "Clients à relancer" : "Clients to follow-up"}
          value={follow.length}
          tone="warn"
          hint={`${clients.length} ${lang === "fr" ? "clients géolocalisés" : "geolocated clients"}`}
          icon={<BellRing className="h-4 w-4" />}
        />
      </div>

      {/* Progression objectif */}
      <Panel>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display font-semibold">
            {lang === "fr"
              ? "Progression vers l'objectif mensuel"
              : "Progress toward monthly target"}
          </p>
          <p className="text-sm text-muted-foreground">
            <b className="text-foreground">{pct.toFixed(0)} %</b>{" "}
            {lang === "fr" ? "atteint · reste" : "reached · remaining"}{" "}
            {fmtM(Math.max(0, MONTHLY_TARGET - month))}
          </p>
        </div>
        <Progress value={pct} className="mt-3 h-3" />
      </Panel>

      {/* CARTE DU BURUNDI DANS LE TABLEAU DE BORD (Visibilité immédiate de tous les clients avec couleurs) */}
      <BurundiClientMap clients={clients} height="360px" />

      {/* Graphiques CA & Top Produits */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title={
            lang === "fr"
              ? "Chiffre d'affaires — 14 jours (M BIF)"
              : "Revenue — 14 days (M BIF)"
          }
          className="lg:col-span-2"
        >
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="1" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="j" fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip formatter={(v: number) => `${v.toFixed(2)} M BIF`} />
                <Area
                  dataKey="ca"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#g)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title={lang === "fr" ? "Top produits (unités)" : "Top Products (Units)"}>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={units.slice(0, 6)} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  fontSize={11}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip />
                <Bar dataKey="units" fill="var(--chart-2)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Performances et alertes */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title={
            lang === "fr"
              ? "Performance des commerciaux"
              : "Sales Rep Performance"
          }
        >
          <div className="grid gap-4">
            {reps.map((r) => (
              <div key={r.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{r.name}</span>
                  <span className="text-muted-foreground">{fmtM(r.ca)}</span>
                </div>
                <Progress value={Math.min(100, r.pct)} className="mt-1.5 h-2" />
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.pct.toFixed(0)} % {lang === "fr" ? "de" : "of"} {fmtM(r.target)} ·{" "}
                  {r.zone}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title={lang === "fr" ? "Top 10 clients" : "Top 10 Clients"}
          action={
            <Link to="/clients" className="text-xs text-primary font-medium hover:underline">
              {lang === "fr" ? "Voir CRM & Carte" : "View CRM & Map"}
            </Link>
          }
        >
          <ol className="grid gap-2 text-sm">
            {topClients.map((c, i) => (
              <li key={c.id} className="flex items-center justify-between gap-2">
                <span className="truncate">
                  <span className="mr-2 text-muted-foreground">{i + 1}.</span>
                  {c.name}
                </span>
                <span className="shrink-0 font-medium">{fmtM(c.ca)}</span>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel
          title={lang === "fr" ? "Alertes & Relances" : "Alerts & Follow-ups"}
          action={
            <Link
              to="/assistant"
              className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
            >
              <Sparkles className="h-3 w-3" />
              {t("assistant")}
            </Link>
          }
        >
          <ul className="grid gap-2 text-sm">
            {alerts.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>
                  {p.name} {p.capacity}L
                </span>
                <Pill tone={p.stock <= 0 ? "red" : "amber"}>
                  {p.stock <= 0
                    ? lang === "fr"
                      ? "Rupture"
                      : "Out of Stock"
                    : `${lang === "fr" ? "Stock faible" : "Low stock"} : ${p.stock}`}
                </Pill>
              </li>
            ))}
            {follow.slice(0, 4).map((c) => (
              <li key={c.id} className="flex justify-between">
                <span className="truncate">{c.name}</span>
                <Pill tone="blue">
                  <Clock className="mr-1 h-3 w-3" />
                  {lang === "fr" ? "Relance" : "Follow-up"}
                </Pill>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
