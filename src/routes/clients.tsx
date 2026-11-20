import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone,
  MessageCircle,
  Plus,
  Search,
  MapPin,
  Navigation,
  Edit,
  Trash2,
  AlertTriangle,
  LocateFixed,
} from "lucide-react";
import { toast } from "sonner";
import { useZuri } from "@/lib/zuri-store";
import { PageHeader, Panel, Pill, Stat } from "@/components/zuri/ui";
import { Button } from "@/components/ui/button";
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
import {
  CITIES,
  REPS,
  CATEGORY_COLORS,
  type Client,
  type ClientType,
  type ClientCategory,
} from "@/lib/zuri-data";
import { fmtM, daysSince, orderTotal, isRevenueStatus } from "@/lib/zuri-logic";
import { BurundiClientMap } from "@/components/zuri/burundi-map";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "CRM Clients — ZURI Sales OS" },
      {
        name: "description",
        content:
          "Fiches clients ZURI : grossistes, distributeurs, quincailleries, détaillants, géolocalisation GPS et routes d'approvisionnement.",
      },
    ],
  }),
  component: Clients,
});

const TYPES: ClientType[] = [
  "Distributeur",
  "Grossiste",
  "Détaillant",
  "Supermarché",
  "Quincaillerie",
  "Magasin ménager",
  "Particulier",
];

const CATEGORIES: ClientCategory[] = ["VIP", "Régulier", "Nouveau", "À Réactiver"];

function Clients() {
  const {
    clients,
    orders,
    addClient,
    updateClient,
    deleteClient,
    navigateToClient,
    isFiltered,
    t,
    lang,
  } = useZuri();

  const [q, setQ] = useState("");
  const [type, setType] = useState("Tous");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sel, setSel] = useState<Client | null>(clients[0] || null);

  // Modales d'ajout et d'édition
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Client>>({
    name: "",
    contact: "",
    phone: "+257 ",
    city: "Bujumbura",
    district: "",
    type: "Distributeur",
    category: "Régulier",
    rep: REPS[0],
    lat: -3.38,
    lng: 29.36,
    notes: "",
  });

  const list = clients.filter((c) => {
    const matchType = type === "Tous" || c.type === type;
    const matchCat = selectedCategory === "all" || c.category === selectedCategory;
    const matchQ = (c.name + c.city + c.district + c.contact)
      .toLowerCase()
      .includes(q.toLowerCase());
    const matchTime = isFiltered(c.lastVisit);
    return matchType && matchCat && matchQ && matchTime;
  });

  const history = sel ? orders.filter((o) => o.clientId === sel.id && isFiltered(o.date)) : [];
  const score = (c: Client) =>
    Math.max(5, Math.min(100, Math.round(c.revenue / 200_000 - daysSince(c.lastVisit) + 40)));

  // Géolocalisation automatique depuis le navigateur
  const captureCurrentPosition = () => {
    if (!navigator.geolocation) {
      toast.error(
        lang === "fr"
          ? "La géolocalisation n'est pas supportée par votre navigateur"
          : "Geolocation is not supported by your browser"
      );
      return;
    }
    toast.info(lang === "fr" ? "Recherche du signal GPS..." : "Acquiring GPS signal...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        }));
        toast.success(
          lang === "fr"
            ? `Position GPS capturée : ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
            : `GPS Captured: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
        );
      },
      () => {
        toast.error(
          lang === "fr"
            ? "Impossible d'accéder au GPS. Veuillez saisir les coordonnées manuellement."
            : "Could not access GPS. Please enter coordinates manually."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      contact: "",
      phone: "+257 ",
      city: "Bujumbura",
      district: "",
      type: "Distributeur",
      category: "Régulier",
      rep: REPS[0],
      lat: -3.382,
      lng: 29.364,
      notes: "",
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (c: Client) => {
    setFormData({ ...c });
    setIsEditOpen(true);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error(lang === "fr" ? "Veuillez saisir un nom" : "Please enter a name");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const newClient: Omit<Client, "id"> = {
      name: formData.name || "",
      contact: formData.contact || "",
      phone: formData.phone || "+257 ",
      city: formData.city || "Bujumbura",
      district: formData.district || "",
      type: (formData.type as ClientType) || "Distributeur",
      rep: formData.rep || REPS[0],
      revenue: 0,
      lastVisit: today,
      nextFollowUp: today,
      loyalty: formData.category === "VIP" ? "Fidèle" : "Régulier",
      category: (formData.category as ClientCategory) || "Régulier",
      lat: formData.lat || -3.38,
      lng: formData.lng || 29.36,
      notes: formData.notes || "",
    };
    addClient(newClient);
    setIsAddOpen(false);
    toast.success(lang === "fr" ? "Client ajouté avec succès" : "Client successfully added");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name) return;
    updateClient(formData.id, formData);
    if (sel?.id === formData.id) {
      setSel((prev) => (prev ? ({ ...prev, ...formData } as Client) : null));
    }
    setIsEditOpen(false);
    toast.success(lang === "fr" ? "Client modifié avec succès" : "Client successfully updated");
  };

  const confirmDelete = () => {
    if (!clientToDelete) return;
    deleteClient(clientToDelete.id);
    if (sel?.id === clientToDelete.id) {
      setSel(null);
    }
    toast.success(lang === "fr" ? "Client supprimé" : "Client deleted");
    setClientToDelete(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("clientsTitle")}
        subtitle={t("clientsSubtitle")}
      >
        <Button onClick={handleOpenAdd} className="gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          {t("newClient")}
        </Button>
      </PageHeader>

      {/* Cartographie interactive complète avec filtre de catégorie */}
      <BurundiClientMap
        clients={clients}
        height="380px"
        selectedClientId={sel?.id}
        onSelectClient={(c) => setSel(c)}
      />

      {/* Statistiques par catégorie & portefeuille */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={t("clientsTitle").split(" ")[0]} value={clients.length} />
        <Stat
          label={lang === "fr" ? "VIP / Fidèles" : "VIP / Loyal"}
          value={clients.filter((c) => c.category === "VIP").length}
          tone="success"
        />
        <Stat
          label={lang === "fr" ? "Réguliers" : "Regular"}
          value={clients.filter((c) => c.category === "Régulier").length}
        />
        <Stat
          label={lang === "fr" ? "À Réactiver" : "At Risk"}
          value={clients.filter((c) => c.category === "À Réactiver").length}
          tone="danger"
        />
      </div>

      {/* Liste des Clients & Fiche détaillée */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Panel className="lg:col-span-3">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder={t("search")}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="Tous">{lang === "fr" ? "Tous les types" : "All types"}</option>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <ul className="divide-y max-h-[500px] overflow-y-auto">
            {list.map((c) => {
              const catInfo = CATEGORY_COLORS[c.category] || CATEGORY_COLORS.Régulier;
              return (
                <li key={c.id}>
                  <div
                    className={
                      "flex w-full items-center justify-between gap-3 px-3 py-3 rounded-md transition-colors hover:bg-muted/60 " +
                      (sel?.id === c.id ? "bg-muted" : "")
                    }
                  >
                    <button
                      onClick={() => setSel(c)}
                      className="min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: catInfo.hex }}
                        />
                        <p className="truncate font-semibold text-sm">{c.name}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {c.type} · {c.city}, {c.district} · {c.rep.split(" ")[0]}
                      </p>
                    </button>

                    <div className="flex shrink-0 items-center gap-2">
                      <div className="text-right">
                        <span
                          style={{ backgroundColor: catInfo.hex }}
                          className="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                        >
                          {lang === "fr" ? catInfo.labelFr : catInfo.labelEn}
                        </span>
                        <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                          {fmtM(c.revenue)}
                        </p>
                      </div>

                      {/* Actions Rapides CRUD */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(c);
                        }}
                        title={t("edit")}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setClientToDelete(c);
                        }}
                        title={t("delete")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        {/* Fiche Client & Actions Terrain / GPS */}
        <Panel className="lg:col-span-2" title={sel ? sel.name : t("details")}>
          {!sel ? (
            <p className="text-sm text-muted-foreground">
              {lang === "fr"
                ? "Sélectionnez un client pour voir sa fiche et son itinéraire."
                : "Select a client to see details and navigation."}
            </p>
          ) : (
            <div className="grid gap-3 text-sm">
              {/* Bouton Majeur : S'y rendre (Technique Kukasoko) */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs font-semibold text-primary mb-1.5">
                  📍 {lang === "fr" ? "Localisation & Approvisionnement" : "Location & Supply Route"}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>
                    GPS : {sel.lat.toFixed(4)}, {sel.lng.toFixed(4)}
                  </span>
                  <span>{sel.city}</span>
                </div>
                <Button
                  className="w-full gap-2 font-semibold shadow-sm"
                  onClick={() => navigateToClient(sel.lat, sel.lng, sel.name)}
                >
                  <Navigation className="h-4 w-4" />
                  {t("goToClient")}
                </Button>
              </div>

              {/* Boutons d'Appels & WhatsApp */}
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <a href={`tel:${sel.phone}`}>
                    <Phone className="mr-1 h-4 w-4" />
                    {lang === "fr" ? "Appeler" : "Call"}
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://wa.me/${sel.phone.replace(/\D/g, "")}`}
                  >
                    <MessageCircle className="mr-1 h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              </div>

              <dl className="grid grid-cols-2 gap-2 text-xs">
                {[
                  [t("contactPerson"), sel.contact],
                  [t("phone"), sel.phone],
                  [t("type"), sel.type],
                  [t("category"), sel.category],
                  [t("rep"), sel.rep],
                  [t("lastVisit"), sel.lastVisit],
                  [t("nextFollowUp"), sel.nextFollowUp],
                  [t("revenue"), fmtM(sel.revenue)],
                  ["Score", `${score(sel)} / 100`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded bg-muted/40 p-2">
                    <dt className="text-[11px] text-muted-foreground">{k}</dt>
                    <dd className="font-semibold text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Historique des achats */}
              <div className="mt-1">
                <p className="mb-1 text-xs font-semibold text-muted-foreground">
                  {lang === "fr" ? "Historique des commandes" : "Order History"}
                </p>
                {history.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {lang === "fr" ? "Aucune commande enregistrée." : "No orders recorded."}
                  </p>
                ) : (
                  <ul className="grid gap-1 max-h-36 overflow-y-auto">
                    {history.slice(0, 5).map((o) => (
                      <li
                        key={o.id}
                        className="flex justify-between items-center rounded bg-muted/30 px-2 py-1 text-xs"
                      >
                        <span>
                          {o.id} · {o.date}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          {fmtM(orderTotal(o))}
                          {!isRevenueStatus(o) && <Pill>{o.status}</Pill>}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Actions de modification / suppression dans la fiche */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1"
                  onClick={() => handleOpenEdit(sel)}
                >
                  <Edit className="h-3.5 w-3.5" />
                  {t("edit")}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-1"
                  onClick={() => setClientToDelete(sel)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t("delete")}
                </Button>
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* DIALOG AJOUT CLIENT (AVEC CAPTURE GPS OBLIGATOIRE) */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("newClient")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveNew} className="grid gap-3 py-2 text-xs">
            <div>
              <label className="font-semibold">{t("clientName")} *</label>
              <Input
                required
                className="mt-1"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Quincaillerie Moderne Rohero"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold">{t("contactPerson")}</label>
                <Input
                  className="mt-1"
                  value={formData.contact || ""}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="Ex: Patrick Ndaye"
                />
              </div>
              <div>
                <label className="font-semibold">{t("phone")}</label>
                <Input
                  className="mt-1"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+257 79 000 000"
                />
              </div>
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
                <label className="font-semibold">{t("district")}</label>
                <Input
                  className="mt-1"
                  value={formData.district || ""}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Quartier / Avenue"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold">{t("type")}</label>
                <select
                  className="mt-1 w-full rounded-md border border-input bg-background p-2"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as ClientType })
                  }
                >
                  {TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold">{t("category")} *</label>
                <select
                  className="mt-1 w-full rounded-md border border-input bg-background p-2 font-medium"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as ClientCategory,
                    })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {lang === "fr"
                        ? CATEGORY_COLORS[c].labelFr
                        : CATEGORY_COLORS[c].labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SECTION GPS DU CLIENT */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-primary flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {lang === "fr" ? "Coordonnées GPS Client" : "Client GPS Coordinates"} *
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-[11px] gap-1"
                  onClick={captureCurrentPosition}
                >
                  <LocateFixed className="h-3 w-3" />
                  {t("captureGps")}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground">{t("latitude")}</label>
                  <Input
                    type="number"
                    step="any"
                    required
                    value={formData.lat || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">{t("longitude")}</label>
                  <Input
                    type="number"
                    step="any"
                    required
                    value={formData.lng || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
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

      {/* DIALOG ÉDITION CLIENT */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("editClient")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="grid gap-3 py-2 text-xs">
            <div>
              <label className="font-semibold">{t("clientName")} *</label>
              <Input
                required
                className="mt-1"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold">{t("contactPerson")}</label>
                <Input
                  className="mt-1"
                  value={formData.contact || ""}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
              <div>
                <label className="font-semibold">{t("phone")}</label>
                <Input
                  className="mt-1"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
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
                <label className="font-semibold">{t("district")}</label>
                <Input
                  className="mt-1"
                  value={formData.district || ""}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold">{t("category")} *</label>
                <select
                  className="mt-1 w-full rounded-md border border-input bg-background p-2"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as ClientCategory,
                    })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {lang === "fr"
                        ? CATEGORY_COLORS[c].labelFr
                        : CATEGORY_COLORS[c].labelEn}
                    </option>
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

            {/* GPS Modification */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-primary flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {lang === "fr" ? "Coordonnées GPS" : "GPS Coordinates"}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-[11px] gap-1"
                  onClick={captureCurrentPosition}
                >
                  <LocateFixed className="h-3 w-3" />
                  {t("captureGps")}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground">{t("latitude")}</label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.lat || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">{t("longitude")}</label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.lng || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit">{t("save")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG CONFIRMATION DE SUPPRESSION */}
      <AlertDialog
        open={!!clientToDelete}
        onOpenChange={(open) => !open && setClientToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("deleteConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmDesc")} ({clientToDelete?.name})
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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
