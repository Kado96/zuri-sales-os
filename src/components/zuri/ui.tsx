import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Stat({ label, value, hint, tone = "default", icon }: { label: string; value: ReactNode; hint?: ReactNode; tone?: "default" | "accent" | "warn" | "danger"; icon?: ReactNode }) {
  return (
    <div className={cn("rounded-xl border bg-card p-4 shadow-soft", tone === "accent" && "bg-primary text-primary-foreground border-primary")}>
      <div className="flex items-center justify-between">
        <p className={cn("text-xs font-medium uppercase tracking-wider", tone === "accent" ? "text-primary-foreground/75" : "text-muted-foreground")}>{label}</p>
        {icon && <span className={cn(tone === "warn" && "text-warning", tone === "danger" && "text-destructive", tone === "default" && "text-primary")}>{icon}</span>}
      </div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      {hint && <p className={cn("mt-1 text-xs", tone === "accent" ? "text-primary-foreground/75" : "text-muted-foreground")}>{hint}</p>}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border bg-card p-4 shadow-soft md:p-5", className)}>
      {title && <div className="mb-4 flex items-center justify-between"><h2 className="font-display font-semibold">{title}</h2>{action}</div>}
      {children}
    </section>
  );
}

const toneMap: Record<string, string> = {
  green: "bg-success/15 text-success", amber: "bg-warning/20 text-warning-foreground", red: "bg-destructive/15 text-destructive", blue: "bg-primary/10 text-primary", gray: "bg-muted text-muted-foreground", gold: "bg-accent text-accent-foreground",
};
export function Pill({ tone = "gray", children }: { tone?: keyof typeof toneMap; children: ReactNode }) {
  return <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium", toneMap[tone])}>{children}</span>;
}

export type Field = { name: string; label: string; type?: "text" | "number" | "date" | "select"; options?: string[]; required?: boolean; defaultValue?: string };
export function FormDialog({ trigger, title, fields, onSubmit }: { trigger: ReactNode; title: string; fields: Field[]; onSubmit: (v: Record<string, string>) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onSubmit(Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]))); setOpen(false); }}>
          {fields.map((f) => (
            <div key={f.name} className="grid gap-1.5">
              <Label htmlFor={f.name}>{f.label}</Label>
              {f.type === "select" ? (
                <select id={f.name} name={f.name} defaultValue={f.defaultValue ?? f.options?.[0]} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                  {f.options?.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : <Input id={f.name} name={f.name} type={f.type ?? "text"} required={f.required} defaultValue={f.defaultValue} />}
            </div>
          ))}
          <Button type="submit" className="mt-2">Enregistrer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function downloadCSV(name: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const head = Object.keys(rows[0]!);
  const csv = [head.join(";"), ...rows.map((r) => head.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(";"))].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv" }));
  a.download = name; a.click();
}
