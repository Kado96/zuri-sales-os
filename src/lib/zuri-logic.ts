import type { Order, Product, Client, Lead, Role } from "./zuri-data";
import { MAX_DISCOUNT } from "./zuri-data";

export const fmtBIF = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " BIF";
export const fmtM = (n: number) => (n >= 1_000_000 ? (n / 1_000_000).toFixed(1).replace(".", ",") + " M" : new Intl.NumberFormat("fr-FR").format(Math.round(n))) + " BIF";

export const orderSubtotal = (o: Pick<Order, "lines">) => o.lines.reduce((s, l) => s + l.qty * l.unit, 0);
export const orderTotal = (o: Pick<Order, "lines" | "discount">) => orderSubtotal(o) * (1 - o.discount / 100);

/** Discount above the role's limit must go to approval. */
export const needsApproval = (discount: number, role: Role) => discount > MAX_DISCOUNT[role];

/** Units missing to fulfil a requested quantity. */
export const shortage = (p: Product, qty: number) => Math.max(0, qty - p.stock);

export const stockState = (p: Product): "Rupture" | "Faible" | "OK" => (p.stock <= 0 ? "Rupture" : p.stock < p.minStock ? "Faible" : "OK");

export const margin = (p: Product) => ((p.price - p.cost) / p.price) * 100;

/** Days of stock left at current 30-day sales pace. */
export const daysOfCover = (p: Product) => (p.sold30 > 0 ? Math.round(p.stock / (p.sold30 / 30)) : Infinity);

export const reorderQty = (p: Product) => Math.max(0, Math.ceil((p.sold30 * 1.5) - p.stock - p.inProduction));

export const isRevenueStatus = (o: Order) => !["Brouillon", "Devis", "Annulée"].includes(o.status);

export const daysSince = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);

export const clientsToFollowUp = (cs: Client[]) => cs.filter((c) => daysSince(c.nextFollowUp) >= 0);

export const leadPriority = (l: Lead) => l.score * 0.6 + Math.min(40, l.potential / 300_000);
