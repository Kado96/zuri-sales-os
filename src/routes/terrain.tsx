import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Plus,
  CheckCircle2,
  Navigation,
  Edit,
  Trash2,
  AlertTriangle,
  LocateFixed,
} from "lucide-react";
import { toast } from "sonner";
import { useZuri, uid } from "@/lib/zuri-store";
import { PageHeader, Panel, Pill } from "@/components/zuri/ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
import { CITIES, REPS, type Visit } from "@/lib/zuri-data";
import { BurundiClientMap } from "@/components/zuri/burundi-map";

export const Route = createFileRoute("/terrain")({
  head: () => ({
    meta: [
      { title: "Field Sales & GPS — ZURI Sales OS" },
      {
        name: "description",
        content:
          "Visites terrain des commerciaux ZURI à Bujumbura et en provinces : carte interactive, check-in GPS et comptes-rendus.",
      },
    ],
  }),
  component: Terrain,
});

function Terrain() {
  const {
    visits,
    clients,
    updateVisit,
    deleteVisit,
    addVisit,
    navigateToClient,
    isFiltered,
    t,
    lang,
  } = useZuri();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [visitToEdit, setVisitToEdit] = useState<Partial<Visit> | null>(null);
  const [visitToDelete, setVisitToDelete] = useState<Visit | null>(null);

  // Formulaire pour nouvelle visite
  const [formData, setFormData] = useState({
    clientName: clients[0]?.name || "",
    city: "Bujumbura",
    rep: REPS[0],
    date: new Date().toISOString().slice(0, 10),
  });

  const checkIn = (v: Visit) => {
    const time = new Date().toLocaleTimeString(lang === "fr" ? "fr-FR" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (!navigator.geolocation) {
      updateVisit(v.id, { checkIn: time });
      return toast.info(
        lang === "fr"
          ? "Check-in enregistré sans GPS"
          : "Check-in recorded without GPS"
      );
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateVisit(v.id, {
          checkIn: time,
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        });
        toast.success(
          lang === "fr"
            ? "Check-in GPS enregistré"
            : "GPS Check-in recorded"
        );
      },
      () => {
        updateVisit(v.id, { checkIn: time });
        toast.info(
          lang === "fr"
            ? "Position refusée — check-in enregistré sans GPS"
            : "Position denied — check-in recorded without GPS"
        );
      }
    );
  };

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    addVisit({
      clientName: formData.clientName,
      city: formData.city,
      rep: formData.rep,
      date: formData.date,
      outcome: "",
      status: "Planifiée",
    });
    setIsAddOpen(false);
    toast.success(
      lang === "fr" ? "Visite planifiée avec succès" : "Visit successfully planned"
    );
  };

  const handleUpdateVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitToEdit?.id) return;
    updateVisit(visitToEdit.id, visitToEdit);
    setIsEditOpen(false);
    toast.success(
      lang === "fr" ? "Visite mise à jour" : "Visit updated"
    );
  };

  const confirmDeleteVisit = () => {
    if (!visitToDelete) return;
    deleteVisit(visitToDelete.id);
    toast.success(lang === "fr" ? "Visite supprimée" : "Visit deleted");
    setVisitToDelete(null);
  };

  const sorted = [...visits]
    .filter((v) => isFiltered(v.date, v.checkIn))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === "fr" ? "Field Sales & GPS" : "Field Sales & GPS"}
        subtitle={
          lang === "fr"
            ? "Planifier, pointer, s'y rendre et rendre compte des visites terrain"
            : "Plan, check-in, navigate and report field sales visits"
        }
      >
        <Button onClick={() => setIsAddOpen(true)} className="gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          {lang === "fr" ? "Planifier une visite" : "Plan a Visit"}
        </Button>
      </PageHeader>

      {/* CARTE INTERACTIVE DU BURUNDI POUR LA TOURNÉE TERRAIN */}
      <BurundiClientMap clients={clients} height="360px" />

      {/* Cartes des Visites Terrain */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((v) => {
          // Trouver le client associé pour récupérer ses coordonnées précises
          const targetClient = clients.find(
            (c) => c.name.toLowerCase() === v.clientName.toLowerCase()
          );
          const navLat = v.lat || targetClient?.lat;
          const navLng = v.lng || targetClient?.lng;

          return (
            <Panel key={v.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{v.clientName}</p>
                  <p className="text-xs text-muted-foreground">
                    {v.city} · {v.rep} · {v.date}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Pill tone={v.status === "Effectuée" ? "green" : "blue"}>
                    {v.status === "Effectuée"
                      ? lang === "fr"
                        ? "Effectuée"
                        : "Completed"
                      : lang === "fr"
                        ? "Planifiée"
                        : "Planned"}
                  </Pill>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-primary"
                    onClick={() => {
                      setVisitToEdit(v);
                      setIsEditOpen(true);
                    }}
                    title={t("edit")}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => setVisitToDelete(v)}
                    title={t("delete")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Bouton S'y rendre (GPS direct) */}
              {navLat && navLng && (
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full gap-1.5 text-xs font-semibold"
                    onClick={() => navigateToClient(navLat, navLng, v.clientName)}
                  >
                    <Navigation className="h-3.5 w-3.5 text-blue-600" />
                    {t("goToClient")}
                  </Button>
                </div>
              )}

              {v.checkIn && (
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  Check-in {v.checkIn}
                  {v.lat != null && (
                    <a
                      className="text-primary underline"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://www.openstreetmap.org/?mlat=${v.lat}&mlon=${v.lng}#map=16/${v.lat}/${v.lng}`}
                    >
                      {" "}
                      · {v.lat.toFixed(3)}, {v.lng?.toFixed(3)}
                    </a>
                  )}
                </p>
              )}

              {v.status === "Effectuée" ? (
                <p className="mt-2 rounded-md bg-muted p-2 text-sm">
                  {v.outcome ||
                    (lang === "fr"
                      ? "Pas de compte-rendu renseigné"
                      : "No report provided")}
                </p>
              ) : (
                <form
                  className="mt-3 grid gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const o = String(new FormData(e.currentTarget).get("o") || "");
                    updateVisit(v.id, { status: "Effectuée", outcome: o });
                    toast.success(
                      lang === "fr"
                        ? "Compte-rendu enregistré"
                        : "Report successfully saved"
                    );
                  }}
                >
                  {!v.checkIn && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => checkIn(v)}
                    >
                      <MapPin className="mr-1 h-4 w-4" />
                      {lang === "fr" ? "Check-in ici" : "Check-in here"}
                    </Button>
                  )}
                  <Textarea
                    name="o"
                    placeholder={
                      lang === "fr"
                        ? "Compte-rendu : commande, besoins, remarques…"
                        : "Report: orders, needs, feedback..."
                    }
                    rows={2}
                  />
                  <Button size="sm" type="submit">
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    {lang === "fr" ? "Clôturer la visite" : "Complete Visit"}
                  </Button>
                </form>
              )}
            </Panel>
          );
        })}
      </div>

      {/* DIALOG PLANIFIER UNE VISITE */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {lang === "fr" ? "Planifier une visite" : "Plan a Visit"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateVisit} className="grid gap-3 py-2 text-xs">
            <div>
              <label className="font-semibold">{t("clientName")}</label>
              <select
                className="mt-1 w-full rounded-md border border-input bg-background p-2"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold">{t("city")}</label>
                <select
                  className="mt-1 w-full rounded-md border border-input bg-background p-2"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                >
                  {CITIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold">{t("rep")}</label>
                <select
                  className="mt-1 w-full rounded-md border border-input bg-background p-2"
                  value={formData.rep}
                  onChange={(e) => setFormData({ ...formData, rep: e.target.value })}
                >
                  {REPS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold">Date</label>
              <Input
                type="date"
                className="mt-1"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit">{t("save")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG MODIFIER UNE VISITE */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {lang === "fr" ? "Modifier la visite" : "Edit Visit"}
            </DialogTitle>
          </DialogHeader>
          {visitToEdit && (
            <form onSubmit={handleUpdateVisitSubmit} className="grid gap-3 py-2 text-xs">
              <div>
                <label className="font-semibold">{t("clientName")}</label>
                <Input
                  className="mt-1"
                  value={visitToEdit.clientName || ""}
                  onChange={(e) =>
                    setVisitToEdit({ ...visitToEdit, clientName: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold">{t("city")}</label>
                  <select
                    className="mt-1 w-full rounded-md border border-input bg-background p-2"
                    value={visitToEdit.city}
                    onChange={(e) =>
                      setVisitToEdit({ ...visitToEdit, city: e.target.value })
                    }
                  >
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold">{t("rep")}</label>
                  <select
                    className="mt-1 w-full rounded-md border border-input bg-background p-2"
                    value={visitToEdit.rep}
                    onChange={(e) =>
                      setVisitToEdit({ ...visitToEdit, rep: e.target.value })
                    }
                  >
                    {REPS.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold">Date</label>
                <Input
                  type="date"
                  className="mt-1"
                  value={visitToEdit.date}
                  onChange={(e) =>
                    setVisitToEdit({ ...visitToEdit, date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-semibold">
                  {lang === "fr" ? "Compte-rendu" : "Outcome / Report"}
                </label>
                <Textarea
                  className="mt-1"
                  rows={2}
                  value={visitToEdit.outcome || ""}
                  onChange={(e) =>
                    setVisitToEdit({ ...visitToEdit, outcome: e.target.value })
                  }
                />
              </div>

              <DialogFooter className="mt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit">{t("save")}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG CONFIRMATION SUPPRESSION VISITE */}
      <AlertDialog
        open={!!visitToDelete}
        onOpenChange={(open) => !open && setVisitToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("deleteConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmDesc")} ({visitToDelete?.clientName})
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteVisit}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
