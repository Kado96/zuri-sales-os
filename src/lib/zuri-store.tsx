import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as D from "./zuri-data";
import { translations, type Lang, type TranslationKey } from "./i18n";
import {
  type TimeFilterState,
  DEFAULT_TIME_FILTER,
  isWithinTimeFilter,
} from "./time-filter";

type State = {
  lang: Lang;
  role: D.Role;
  timeFilter: TimeFilterState;
  products: D.Product[];
  clients: D.Client[];
  leads: D.Lead[];
  orders: D.Order[];
  visits: D.Visit[];
  competitors: D.CompetitorPrice[];
  tickets: D.Ticket[];
  tasks: D.Task[];
  users: D.User[];
};

const initial: State = {
  lang: "fr",
  role: "Responsable Commercial",
  timeFilter: DEFAULT_TIME_FILTER,
  products: D.seedProducts,
  clients: D.seedClients,
  leads: D.seedLeads,
  orders: D.seedOrders,
  visits: D.seedVisits,
  competitors: D.seedCompetitors,
  tickets: D.seedTickets,
  tasks: D.seedTasks,
  users: D.seedUsers,
};

const KEY = "zuri-sales-os-v2";

type Ctx = State & {
  set: <K extends keyof State>(k: K, v: State[K] | ((p: State[K]) => State[K])) => void;
  reset: () => void;
  t: (k: TranslationKey) => string;
  setLang: (lang: Lang) => void;
  // CRUD Helpers for Clients
  addClient: (c: Omit<D.Client, "id">) => void;
  updateClient: (id: string, patch: Partial<D.Client>) => void;
  deleteClient: (id: string) => void;
  // CRUD Helpers for Visits
  addVisit: (v: Omit<D.Visit, "id">) => void;
  updateVisit: (id: string, patch: Partial<D.Visit>) => void;
  deleteVisit: (id: string) => void;
  // Navigation helper
  navigateToClient: (lat: number, lng: number, name?: string) => void;
  // Time filter helper
  setTimeFilter: (tf: TimeFilterState | ((prev: TimeFilterState) => TimeFilterState)) => void;
  isFiltered: (dateStr?: string, timeStr?: string) => boolean;
};

const C = createContext<Ctx | null>(null);

export function ZuriProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setS((prev) => ({
          ...initial,
          ...parsed,
          // Guarantee coordinates & categories exist
          clients: (parsed.clients || initial.clients).map((c: D.Client, i: number) => ({
            ...initial.clients[i % initial.clients.length],
            ...c,
            category: c.category || "Régulier",
            lat: c.lat || -3.38 + (i * 0.05),
            lng: c.lng || 29.36 + (i * 0.05),
          })),
        }));
      }
    } catch {
      /* ignore storage errors */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem(KEY, JSON.stringify(s));
    }
  }, [s, ready]);

  const set: Ctx["set"] = (k, v) =>
    setS((p) => ({
      ...p,
      [k]: typeof v === "function" ? (v as (x: unknown) => unknown)(p[k]) : v,
    }));

  const setLang = (lang: Lang) => set("lang", lang);

  const t = (k: TranslationKey): string => {
    const dict = translations[s.lang] || translations.fr;
    return (dict as Record<string, string>)[k] || k;
  };

  const addClient: Ctx["addClient"] = (c) => {
    const id = uid("c");
    set("clients", (prev) => [{ ...c, id }, ...prev]);
  };

  const updateClient: Ctx["updateClient"] = (id, patch) => {
    set("clients", (prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const deleteClient: Ctx["deleteClient"] = (id) => {
    set("clients", (prev) => prev.filter((c) => c.id !== id));
  };

  const addVisit: Ctx["addVisit"] = (v) => {
    const id = uid("v");
    set("visits", (prev) => [{ ...v, id }, ...prev]);
  };

  const updateVisit: Ctx["updateVisit"] = (id, patch) => {
    set("visits", (prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  };

  const deleteVisit: Ctx["deleteVisit"] = (id) => {
    set("visits", (prev) => prev.filter((v) => v.id !== id));
  };

  // Naviguer directement vers le client avec Google Maps / itinéraire
  const navigateToClient: Ctx["navigateToClient"] = (lat, lng, name) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name || "Client")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const setTimeFilter: Ctx["setTimeFilter"] = (tf) => {
    set("timeFilter", tf);
  };

  const isFiltered: Ctx["isFiltered"] = (dateStr, timeStr) => {
    return isWithinTimeFilter(dateStr, timeStr, s.timeFilter);
  };

  return (
    <C.Provider
      value={{
        ...s,
        set,
        reset: () => setS(initial),
        t,
        setLang,
        addClient,
        updateClient,
        deleteClient,
        addVisit,
        updateVisit,
        deleteVisit,
        navigateToClient,
        setTimeFilter,
        isFiltered,
      }}
    >
      {children}
    </C.Provider>
  );
}

export function useZuri() {
  const c = useContext(C);
  if (!c) throw new Error("ZuriProvider missing");
  return c;
}

export const uid = (p: string) => p + Math.random().toString(36).slice(2, 8);
