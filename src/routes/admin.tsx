import { createFileRoute } from "@tanstack/react-router";
import { Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useZuri, uid } from "@/lib/zuri-store";
import { PageHeader, Panel, Pill, FormDialog } from "@/components/zuri/ui";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PERMISSIONS, MAX_DISCOUNT, type Role } from "@/lib/zuri-data";
import { fmtM } from "@/lib/zuri-logic";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administration & Rôles — ZURI Sales OS" }, { name: "description", content: "Utilisateurs, rôles, permissions et paramètres de ZURI Sales OS." }, { property: "og:title", content: "Administration & Rôles — ZURI Sales OS" }, { property: "og:description", content: "Utilisateurs, rôles, permissions et paramètres de ZURI Sales OS." }] }),
  component: Admin,
});

const ROLES = Object.keys(PERMISSIONS) as Role[];

function Admin() {
  const { users, set, role, reset } = useZuri();
  const allowed = role === "Direction";
  return (
    <div>
      <PageHeader title="Administration & Rôles" subtitle={allowed ? "Gestion des utilisateurs et des autorisations" : "Lecture seule — seule la Direction peut modifier les utilisateurs"}>
        {allowed && <FormDialog title="Nouvel utilisateur" trigger={<Button><Plus className="mr-1 h-4 w-4" />Utilisateur</Button>} fields={[{ name: "name", label: "Nom complet", required: true }, { name: "role", label: "Rôle", type: "select", options: ROLES }, { name: "zone", label: "Zone", defaultValue: "Bujumbura" }, { name: "target", label: "Objectif mensuel (BIF)", type: "number", defaultValue: "0" }]} onSubmit={(v) => set("users", (p) => [...p, { id: uid("u"), name: v.name, role: v.role as Role, zone: v.zone, target: Number(v.target), active: true }])} />}
        <Button variant="outline" onClick={() => { reset(); toast.success("Données d'exemple restaurées"); }}><RotateCcw className="mr-1 h-4 w-4" />Réinitialiser les données</Button>
      </PageHeader>
      <div className="grid gap-4 lg:grid-cols-5">
        <Panel title="Utilisateurs" className="lg:col-span-3">
          <ul className="divide-y">{users.map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0"><p className="truncate font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.zone}{u.target ? " · objectif " + fmtM(u.target) : ""}</p></div>
              <div className="flex items-center gap-3">
                {allowed ? <select value={u.role} onChange={(e) => set("users", (us) => us.map((x) => x.id === u.id ? { ...x, role: e.target.value as Role } : x))} className="h-8 rounded-md border border-input bg-background px-2 text-xs">{ROLES.map((r) => <option key={r}>{r}</option>)}</select> : <Pill tone="blue">{u.role}</Pill>}
                <Switch aria-label="Actif" checked={u.active} disabled={!allowed} onCheckedChange={(c) => set("users", (us) => us.map((x) => x.id === u.id ? { ...x, active: c } : x))} />
              </div>
            </li>))}</ul>
        </Panel>
        <Panel title="Rôles & permissions" className="lg:col-span-2">
          <div className="grid gap-4">{ROLES.map((r) => (
            <div key={r}><div className="flex items-center justify-between"><p className="font-semibold">{r}</p><Pill tone="gold">Remise max {MAX_DISCOUNT[r] === 100 ? "illimitée" : MAX_DISCOUNT[r] + " %"}</Pill></div><ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">{PERMISSIONS[r].map((p) => <li key={p}>{p}</li>)}</ul></div>))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
