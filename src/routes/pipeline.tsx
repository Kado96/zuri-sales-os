import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  ChevronRight,
  ChevronLeft,
  Edit,
  Trash2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useZuri, uid } from "@/lib/zuri-store";
import { PageHeader, Pill, FormDialog, Stat } from "@/components/zuri/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CITIES,
  REPS,
  STAGES,
  type ClientType,
  type Stage,
  type Lead,
} from "@/lib/zuri-data";
import { fmtM } from "@/lib/zuri-logic";

export const Route = createFileRoute("/pipeline")({
  head: () => ({ meta: [{ title: "Prospection & Pipeline — ZURI Sales OS" }, { name: "description", content: "Génération de leads, qualification et suivi des opportunités commerciales ZURI." }, { property: "og:title", content: "Prospection & Pipeline — ZURI Sales OS" }, { property: "og:description", content: "Génération de leads, qualification et suivi des opportunités commerciales ZURI." }] }),
  component: Pipeline,
});

function Pipeline() {
  const { leads, set, clients } = useZuri();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  const [editFormData, setEditFormData] = useState<Partial<Lead>>({});

  const openDetail = (l: Lead) => {
    setSelectedLead(l);
    setIsDetailOpen(true);
  };

  const openEdit = (l: Lead) => {
    setSelectedLead(l);
    setEditFormData({ ...l });
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    const potential = Number(editFormData.potential || 0);
    const score = Math.min(95, 30 + Math.round(potential / 200_000));
    set("leads", (prev) =>
      prev.map((l) =>
        l.id === selectedLead.id
          ? {
              ...l,
              ...editFormData,
              potential,
              score,
            }
          : l
      )
    );
    setIsEditOpen(false);
    toast.success("Opportunité mise à jour avec succès");
  };

  const confirmDeleteLead = () => {
    if (!leadToDelete) return;
    set("leads", (prev) => prev.filter((l) => l.id !== leadToDelete.id));
    toast.success("Opportunité supprimée");
    setLeadToDelete(null);
  };

  const move = (id: string, dir: 1 | -1) =>
    set("leads", (p) =>
      p.map((l) => {
        if (l.id !== id) return l;
        const i = STAGES.indexOf(l.stage);
        const next = STAGES[Math.max(0, Math.min(STAGES.length - 1, i + dir))] as Stage;
        if (next === "Perdu") {
          const reason = window.prompt("Raison de la perte ?") || "Non précisée";
          return { ...l, stage: next, lostReason: reason };
        }
        if (next === "Gagné" && !clients.some((c) => c.name === l.name)) {
          const t = new Date().toISOString().slice(0, 10);
          set("clients", (cs) => [
            {
              id: uid("c"),
              name: l.name,
              contact: "",
              phone: "+257 ",
              city: l.city,
              district: "",
              type: l.type,
              rep: l.rep,
              revenue: 0,
              lastVisit: t,
              nextFollowUp: t,
              loyalty: "Fort potentiel",
              notes: "Converti depuis le pipeline",
              category: "Nouveau",
              lat: -3.38 + Math.random() * 0.05,
              lng: 29.36 + Math.random() * 0.05,
            },
            ...cs,
          ]);
          toast.success(l.name + " converti en client");
        }
        return { ...l, stage: next };
      })
    );
  const open = leads.filter((l) => !["Gagné", "Perdu"].includes(l.stage));
  return (
    <div>
      <PageHeader title="Prospection & Pipeline" subtitle="Du nouveau prospect au client gagné">
        <FormDialog title="Nouveau prospect" trigger={<Button><Plus className="mr-1 h-4 w-4" />Prospect</Button>}
          fields={[
            { name: "name", label: "Nom de l'établissement / Contact", required: true },
            { name: "city", label: "Ville", defaultValue: "Bujumbura" },
            { name: "source", label: "Provenance", type: "select", options: ["Visite terrain", "Recommandation", "WhatsApp", "Appel entrant", "Facebook", "Salon commercial"] },
            { name: "type", label: "Type", type: "select", options: ["Grossiste", "Distributeur", "Détaillant", "Supermarché", "Quincaillerie", "Magasin ménager"] },
            { name: "potential", label: "Potentiel mensuel (BIF)", type: "number", defaultValue: "1000000" },
            { name: "rep", label: "Commercial", type: "select", options: REPS },
            { name: "description", label: "Description détaillée & Besoins (quantités, produits ciblés)", type: "textarea" },
          ]}
          onSubmit={(v) =>
            set("leads", (p) => [
              {
                id: uid("l"),
                name: v.name,
                city: v.city,
                source: v.source,
                type: v.type as ClientType,
                potential: Number(v.potential),
                stage: "Nouveau",
                rep: v.rep,
                score: Math.min(95, 30 + Math.round(Number(v.potential) / 200_000)),
                description: v.description || "",
              },
              ...p,
            ])
          }
        />
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
            <div className="grid gap-2">
              {items.map((l) => (
                <div
                  key={l.id}
                  onClick={() => openDetail(l)}
                  className="group relative cursor-pointer rounded-lg border bg-card p-3 shadow-soft transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary">
                      {l.name}
                    </p>
                    <div
                      className="flex items-center gap-1 opacity-80"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        title="Modifier le prospect"
                        onClick={() => openEdit(l)}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        title="Supprimer le prospect"
                        onClick={() => setLeadToDelete(l)}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {l.city} · {l.source}
                  </p>
                  <p className="text-[11px] text-muted-foreground/80">
                    Type: <span className="font-medium text-foreground">{l.type}</span> · Resp: {l.rep}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      {fmtM(l.potential)}
                    </span>
                    <Pill tone={l.score > 75 ? "green" : l.score > 50 ? "amber" : "gray"}>
                      Score {l.score}
                    </Pill>
                  </div>

                  {l.lostReason && (
                    <p className="mt-1.5 text-xs text-destructive">⚠️ {l.lostReason}</p>
                  )}

                  <div
                    className="mt-3 flex items-center justify-between border-t pt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      aria-label="Étape précédente"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => move(l.id, -1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Étape
                    </span>
                    <Button
                      aria-label="Étape suivante"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => move(l.id, 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>); })}
      </div>

      {/* DIALOG DETAILS PROSPECT */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="text-lg font-bold">{selectedLead?.name}</span>
              {selectedLead && (
                <Pill tone={selectedLead.score > 75 ? "green" : selectedLead.score > 50 ? "amber" : "gray"}>
                  Score Prédictif: {selectedLead.score} / 100
                </Pill>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedLead && (
            <div className="grid gap-3 py-2 text-sm">
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Ville & Province</p>
                  <p className="font-semibold">{selectedLead.city}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type d'établissement</p>
                  <p className="font-semibold">{selectedLead.type}</p>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Canal de provenance</p>
                  <p className="font-semibold">{selectedLead.source}</p>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Commercial responsable</p>
                  <p className="font-semibold">{selectedLead.rep}</p>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Potentiel mensuel estimé :</span>
                  <span className="font-display text-base font-bold text-primary">
                    {fmtM(selectedLead.potential)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Étape actuelle du pipeline :</span>
                  <span className="font-semibold">{selectedLead.stage}</span>
                </div>
                {selectedLead.lostReason && (
                  <div className="mt-2 rounded bg-destructive/10 p-2 text-xs text-destructive">
                    <strong>Motif d'abandon :</strong> {selectedLead.lostReason}
                  </div>
                )}
                {selectedLead.description && (
                  <div className="mt-2.5 rounded bg-muted/60 p-2.5 text-xs">
                    <p className="font-semibold text-foreground mb-1">📝 Description & Détails du besoin :</p>
                    <p className="text-muted-foreground whitespace-pre-wrap">{selectedLead.description}</p>
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground">
                🤖 <strong>Analyse ZURI AI :</strong> Ce prospect affiche une probabilité de conversion de{" "}
                <span className="font-bold text-foreground">{selectedLead.score}%</span>.{" "}
                {selectedLead.score > 70
                  ? "Priorité haute : programmer une visite terrain ou envoyer un devis sous 48h."
                  : "Prospect en phase amont : prévoir un appel de qualification des besoins en bassines et seaux ZURI."}
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setIsDetailOpen(false);
                if (selectedLead) setLeadToDelete(selectedLead);
              }}
            >
              <Trash2 className="mr-1.5 h-4 w-4" /> Supprimer
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsDetailOpen(false);
                  if (selectedLead) openEdit(selectedLead);
                }}
              >
                <Edit className="mr-1.5 h-4 w-4" /> Modifier
              </Button>
              <Button size="sm" onClick={() => setIsDetailOpen(false)}>
                Fermer
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG MODIFIER PROSPECT */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'Opportunité</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="grid gap-3 py-2">
            <div>
              <label className="text-xs font-semibold">Nom de l'établissement / Contact</label>
              <Input
                value={editFormData.name || ""}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold">Ville</label>
                <select
                  value={editFormData.city || "Bujumbura"}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold">Type de client</label>
                <select
                  value={editFormData.type || "Grossiste"}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, type: e.target.value as ClientType }))
                  }
                  className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
                >
                  {[
                    "Grossiste",
                    "Distributeur",
                    "Détaillant",
                    "Supermarché",
                    "Quincaillerie",
                    "Magasin ménager",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold">Potentiel mensuel (BIF)</label>
                <Input
                  type="number"
                  value={editFormData.potential || 0}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, potential: Number(e.target.value) }))
                  }
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold">Commercial assigné</label>
                <select
                  value={editFormData.rep || REPS[0]}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, rep: e.target.value }))}
                  className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
                >
                  {REPS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">Étape du Pipeline</label>
              <select
                value={editFormData.stage || "Nouveau"}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, stage: e.target.value as Stage }))
                }
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold">Description détaillée & Besoins</label>
              <Textarea
                rows={3}
                value={editFormData.description || ""}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Précisez les besoins (modèles de bassines/seaux ZURI, quantités mensuelles, conditions de livraison)..."
                className="text-sm"
              />
            </div>

            <DialogFooter className="mt-3">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer les modifications</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION SUPPRESSION PROSPECT */}
      <AlertDialog
        open={Boolean(leadToDelete)}
        onOpenChange={(open) => !open && setLeadToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Supprimer cette opportunité ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'opportunité pour{" "}
              <strong>{leadToDelete?.name}</strong> (Valeur : {fmtM(leadToDelete?.potential || 0)}) ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLead}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
