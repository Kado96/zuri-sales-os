import { useState } from "react";
import { Clock, Calendar, Check, SlidersHorizontal } from "lucide-react";
import { useZuri } from "@/lib/zuri-store";
import type { TimePreset } from "@/lib/time-filter";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TimeFilterControl() {
  const { timeFilter, setTimeFilter, lang } = useZuri();
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [startDateTime, setStartDateTime] = useState(
    timeFilter.startDateTime || new Date().toISOString().slice(0, 16)
  );
  const [endDateTime, setEndDateTime] = useState(
    timeFilter.endDateTime || new Date().toISOString().slice(0, 16)
  );

  const presets: { id: TimePreset; labelFr: string; labelEn: string; group: string }[] = [
    { id: "all", labelFr: "Tout l'historique", labelEn: "All time", group: "Général" },
    { id: "15m", labelFr: "15 dernières minutes", labelEn: "Last 15 minutes", group: "Minutes & Heures" },
    { id: "30m", labelFr: "30 dernières minutes", labelEn: "Last 30 minutes", group: "Minutes & Heures" },
    { id: "1h", labelFr: "Dernière heure", labelEn: "Last hour", group: "Minutes & Heures" },
    { id: "24h", labelFr: "Dernières 24 heures", labelEn: "Last 24 hours", group: "24 Heures & Jours" },
    { id: "today", labelFr: "Aujourd'hui", labelEn: "Today", group: "24 Heures & Jours" },
    { id: "7d", labelFr: "7 derniers jours", labelEn: "Last 7 days", group: "24 Heures & Jours" },
    { id: "30d", labelFr: "30 derniers jours", labelEn: "Last 30 days", group: "Mois & Années" },
    { id: "this_month", labelFr: "Ce mois-ci", labelEn: "This month", group: "Mois & Années" },
    { id: "last_month", labelFr: "Le mois dernier", labelEn: "Last month", group: "Mois & Années" },
    { id: "this_year", labelFr: "Cette année (2026)", labelEn: "This year (2026)", group: "Mois & Années" },
  ];

  const currentLabel =
    timeFilter.preset === "custom"
      ? lang === "fr"
        ? "Personnalisé"
        : "Custom"
      : presets.find((p) => p.id === timeFilter.preset)?.[
          lang === "fr" ? "labelFr" : "labelEn"
        ] || "Tout";

  const handlePresetSelect = (preset: TimePreset) => {
    if (preset === "custom") {
      setIsCustomOpen(true);
    } else {
      setTimeFilter({ preset });
    }
  };

  const applyCustom = () => {
    setTimeFilter({
      preset: "custom",
      startDateTime,
      endDateTime,
    });
    setIsCustomOpen(false);
  };

  return (
    <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-2.5 text-xs text-sidebar-foreground">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-sidebar-foreground">
          <Clock className="h-3.5 w-3.5 text-sidebar-primary" />
          <span>{lang === "fr" ? "Filtre Temporel Global" : "Global Time Filter"}</span>
        </div>
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
            timeFilter.preset === "all"
              ? "bg-muted text-muted-foreground"
              : "bg-sidebar-primary text-sidebar-primary-foreground animate-pulse"
          )}
        >
          {timeFilter.preset === "all"
            ? lang === "fr"
              ? "Inactif"
              : "Inactive"
            : lang === "fr"
              ? "Actif"
              : "Active"}
        </span>
      </div>

      <div className="space-y-1.5">
        <select
          value={timeFilter.preset}
          onChange={(e) => handlePresetSelect(e.target.value as TimePreset)}
          className="w-full rounded-md border border-sidebar-border bg-sidebar-accent px-2 py-1.5 text-xs font-medium text-sidebar-accent-foreground outline-none focus:ring-1 focus:ring-sidebar-primary"
        >
          <optgroup label={lang === "fr" ? "Général" : "General"}>
            <option value="all">{lang === "fr" ? "Tous les enregistrements" : "All records"}</option>
          </optgroup>
          <optgroup label={lang === "fr" ? "Minutes & Heures" : "Minutes & Hours"}>
            <option value="15m">{lang === "fr" ? "15 dernières minutes" : "Last 15 minutes"}</option>
            <option value="30m">{lang === "fr" ? "30 dernières minutes" : "Last 30 minutes"}</option>
            <option value="1h">{lang === "fr" ? "Dernière heure (60 min)" : "Last hour"}</option>
            <option value="24h">{lang === "fr" ? "Espace de 24 heures" : "24 hours span"}</option>
          </optgroup>
          <optgroup label={lang === "fr" ? "Jours & Semaines" : "Days & Weeks"}>
            <option value="today">{lang === "fr" ? "Aujourd'hui" : "Today"}</option>
            <option value="7d">{lang === "fr" ? "7 derniers jours" : "Last 7 days"}</option>
          </optgroup>
          <optgroup label={lang === "fr" ? "Mois & Années" : "Months & Years"}>
            <option value="30d">{lang === "fr" ? "30 derniers jours" : "Last 30 days"}</option>
            <option value="this_month">{lang === "fr" ? "Ce mois-ci" : "This month"}</option>
            <option value="last_month">{lang === "fr" ? "Le mois dernier" : "Last month"}</option>
            <option value="this_year">{lang === "fr" ? "Cette année (2026)" : "This year (2026)"}</option>
          </optgroup>
          <optgroup label={lang === "fr" ? "Précis / Plage personnalisée" : "Custom range"}>
            <option value="custom">{lang === "fr" ? "De telle minute/heure à l'autre..." : "From hour/min to..."}</option>
          </optgroup>
        </select>

        <button
          onClick={() => setIsCustomOpen(true)}
          className="flex w-full items-center justify-between rounded border border-sidebar-border/60 bg-sidebar-accent/60 px-2 py-1 text-[11px] text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <span className="flex items-center gap-1.5 truncate">
            <SlidersHorizontal className="h-3 w-3 text-sidebar-primary" />
            <span className="truncate">{currentLabel}</span>
          </span>
          <span className="text-[10px] text-sidebar-primary underline">
            {lang === "fr" ? "Ajuster" : "Edit"}
          </span>
        </button>
      </div>

      {/* Modal de sélection personnalisée précise (Minutes / Heures / Jours) */}
      <Dialog open={isCustomOpen} onOpenChange={setIsCustomOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>
                {lang === "fr"
                  ? "Filtrage Précis (Date, Heure, Minute)"
                  : "Precision Filter (Date, Hour, Minute)"}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {lang === "fr"
                  ? "Début (Date et Heure / Minute) :"
                  : "Start (Date and Time / Minute):"}
              </label>
              <Input
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {lang === "fr"
                  ? "Fin (Date et Heure / Minute) :"
                  : "End (Date and Time / Minute):"}
              </label>
              <Input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="text-sm"
              />
            </div>

            <p className="rounded bg-muted/60 p-2 text-xs text-muted-foreground">
              💡{" "}
              {lang === "fr"
                ? "Ce filtre temporel s'applique immédiatement à l'ensemble du système : Tableau de bord, Ventes, Clients et Visites terrain."
                : "This time filter applies immediately across the entire system: Dashboard, Sales, Clients, and Field visits."}
            </p>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsCustomOpen(false)}>
              {lang === "fr" ? "Annuler" : "Cancel"}
            </Button>
            <Button size="sm" onClick={applyCustom}>
              <Check className="mr-1 h-4 w-4" />
              {lang === "fr" ? "Appliquer le filtre" : "Apply filter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
