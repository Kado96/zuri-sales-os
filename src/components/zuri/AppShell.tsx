import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Target,
  Package,
  ShoppingCart,
  Warehouse,
  MapPin,
  Eye,
  LifeBuoy,
  CalendarDays,
  Sparkles,
  Settings,
  Menu,
  Globe,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useZuri } from "@/lib/zuri-store";
import type { Role } from "@/lib/zuri-data";
import type { TranslationKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { TimeFilterControl } from "@/components/zuri/TimeFilterControl";
import { ZuriExplainerBot } from "@/components/zuri/ZuriExplainerBot";

const NAV_ITEMS: { to: string; key: TranslationKey; icon: typeof LayoutDashboard }[] = [
  { to: "/", key: "dashboard", icon: LayoutDashboard },
  { to: "/clients", key: "crm", icon: Users },
  { to: "/pipeline", key: "prospecting", icon: Target },
  { to: "/produits", key: "catalog", icon: Package },
  { to: "/ventes", key: "sales", icon: ShoppingCart },
  { to: "/stocks", key: "stocks", icon: Warehouse },
  { to: "/terrain", key: "fieldSales", icon: MapPin },
  { to: "/veille", key: "intelligence", icon: Eye },
  { to: "/sav", key: "support", icon: LifeBuoy },
  { to: "/planning", key: "planning", icon: CalendarDays },
  { to: "/assistant", key: "assistant", icon: Sparkles },
  { to: "/admin", key: "admin", icon: Settings },
];

const MOBILE = ["/", "/clients", "/ventes", "/terrain", "/assistant"];

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <img
        src="/icon.png"
        alt="ZURI Sales OS Logo"
        className="h-9 w-9 rounded-lg object-contain shadow-sm"
      />
      <div className="leading-tight">
        <p className="font-display text-base font-extrabold tracking-wide">
          ZURI <span className="text-sidebar-primary">Sales OS</span>
        </p>
        <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
          Zahara Industries
        </p>
      </div>
    </div>
  );
}

function LangSwitch() {
  const { lang, setLang } = useZuri();
  return (
    <div className="flex items-center justify-between rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2 text-xs">
      <div className="flex items-center gap-2 text-sidebar-foreground/80 font-medium">
        <Globe className="h-4 w-4 text-sidebar-primary" />
        <span>Langue / Language</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setLang("fr")}
          className={cn(
            "rounded px-2 py-1 text-xs font-semibold transition-colors",
            lang === "fr"
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent"
          )}
        >
          FR
        </button>
        <button
          onClick={() => setLang("en")}
          className={cn(
            "rounded px-2 py-1 text-xs font-semibold transition-colors",
            lang === "en"
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent"
          )}
        >
          EN
        </button>
      </div>
    </div>
  );
}

function NavList({ onNav }: { onNav?: () => void }) {
  const { pathname } = useLocation();
  const { t } = useZuri();
  return (
    <nav className="mt-4 grid gap-0.5">
      {NAV_ITEMS.map(({ to, key, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNav}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
            )}
          >
            <Icon className={cn("h-4 w-4", active && "text-sidebar-primary")} />
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
}

function RoleSwitch() {
  const { role, set, t } = useZuri();
  return (
    <label className="block px-2 text-xs text-sidebar-foreground/60">
      {t("connectedAs")}
      <select
        value={role}
        onChange={(e) => set("role", e.target.value as Role)}
        className="mt-1 w-full rounded-md border border-sidebar-border bg-sidebar-accent px-2 py-1.5 text-sm text-sidebar-accent-foreground"
      >
        {["Direction", "Responsable Commercial", "Commercial terrain", "Gestionnaire de stock"].map(
          (r) => (
            <option key={r}>{r}</option>
          )
        )}
      </select>
    </label>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { t } = useZuri();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between overflow-y-auto border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground md:flex">
        <div className="space-y-3">
          <Brand />
          <div className="space-y-2">
            <LangSwitch />
            <TimeFilterControl />
          </div>
          <NavList />
        </div>
        <div className="mt-4 pt-3 border-t border-sidebar-border">
          <RoleSwitch />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden pb-16 md:pb-0">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:hidden">
          <Brand />
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger aria-label="Ouvrir le menu" className="p-2">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 overflow-y-auto bg-sidebar p-4 text-sidebar-foreground">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="space-y-3">
                  <Brand />
                  <div className="space-y-2">
                    <LangSwitch />
                    <TimeFilterControl />
                  </div>
                  <NavList />
                </div>
                <div className="mt-6 pt-3 border-t border-sidebar-border">
                  <RoleSwitch />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      {/* Chat Bot Intelligent Guide & Analyste */}
      <ZuriExplainerBot />

      {/* Barre de navigation Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-border bg-background/95 py-2 backdrop-blur md:hidden">
        {NAV_ITEMS.filter((item) => MOBILE.includes(item.to)).map(({ to, key, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors",
                active ? "text-primary font-bold" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {t(key)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
