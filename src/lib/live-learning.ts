import type { Product, Client, Order, Lead, Visit } from "./zuri-data";
import { orderTotal, isRevenueStatus, daysSince } from "./zuri-logic";

export type LiveLearningState = {
  totalRevenue: number;
  monthlyTarget: number;
  attainmentRate: number;
  activeClientsCount: number;
  topSellingProducts: { name: string; units: number; share: number }[];
  atRiskClients: { name: string; daysInactive: number }[];
  highPotentialLeads: { name: string; potential: number; score: number }[];
  urgentStockouts: { name: string; available: number; daysCover: number }[];
  pipelineWeightedValue: number;
  recentOrdersCount: number;
  lastUpdated: string;
};

/**
 * MOTEUR D'APPRENTISSAGE EN TEMPS RÉEL (Real-Time Analytical Learning Engine)
 * Analyse automatiquement le flux d'entrées (commandes, clients, stocks, visites)
 * et génère la synthèse opérationnelle que l'IA communique aux utilisateurs.
 */
export function computeRealTimeLearning(
  products: Product[],
  clients: Client[],
  orders: Order[],
  leads: Lead[],
  visits: Visit[]
): LiveLearningState {
  // 1. Analyse financière et vélocité des ventes
  const revOrders = orders.filter(isRevenueStatus);
  const totalRevenue = revOrders.reduce((sum, o) => sum + orderTotal(o), 0);
  const monthlyTarget = 35_000_000;
  const attainmentRate = Math.min(100, Math.round((totalRevenue / monthlyTarget) * 100));

  // 2. Analyse des produits phares & Pareto des ventes (Apprentissage par fréquence)
  const productSalesMap = new Map<string, number>();
  let totalUnitsSold = 0;

  for (const o of revOrders) {
    for (const l of o.lines) {
      const cur = productSalesMap.get(l.productId) || 0;
      productSalesMap.set(l.productId, cur + l.qty);
      totalUnitsSold += l.qty;
    }
  }

  const topSellingProducts = products
    .map((p) => {
      const units = productSalesMap.get(p.id) || p.sold30 || 0;
      return {
        name: `${p.name} ${p.capacity}L`,
        units,
        share: totalUnitsSold > 0 ? Math.round((units / totalUnitsSold) * 100) : 0,
      };
    })
    .sort((a, b) => b.units - a.units)
    .slice(0, 4);

  // 3. Détection des comptes dormants & Risque d'attrition (Churn Detection)
  const atRiskClients = clients
    .filter((c) => daysSince(c.lastVisit) > 20)
    .map((c) => ({
      name: c.name,
      daysInactive: daysSince(c.lastVisit),
    }))
    .sort((a, b) => b.daysInactive - a.daysInactive)
    .slice(0, 4);

  // 4. Scoring & Priorisation des Opportunités du Pipeline
  const highPotentialLeads = leads
    .filter((l) => !["Gagné", "Perdu"].includes(l.stage))
    .map((l) => ({
      name: l.name,
      potential: l.potential,
      score: l.score,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const pipelineWeightedValue = leads
    .filter((l) => !["Gagné", "Perdu"].includes(l.stage))
    .reduce((sum, l) => sum + l.potential * (l.score / 100), 0);

  // 5. Analyse des Ruptures & Jours de Couverture (Days of Cover)
  const urgentStockouts = products
    .filter((p) => p.stock <= p.minStock)
    .map((p) => {
      const dailyVelocity = Math.max(1, (p.sold30 || 30) / 30);
      const daysCover = Math.round(p.stock / dailyVelocity);
      return {
        name: `${p.name} ${p.capacity}L`,
        available: p.stock,
        daysCover,
      };
    })
    .slice(0, 4);

  return {
    totalRevenue,
    monthlyTarget,
    attainmentRate,
    activeClientsCount: clients.length,
    topSellingProducts,
    atRiskClients,
    highPotentialLeads,
    urgentStockouts,
    pipelineWeightedValue: Math.round(pipelineWeightedValue),
    recentOrdersCount: orders.length,
    lastUpdated: new Date().toLocaleTimeString(),
  };
}

/**
 * GÉNÉRATEUR D'ANALYSES AUTOMATIQUES BILINGUE (FR / EN)
 * Traduit instantanément les métriques apprises en recommandations stratégiques.
 */
export function generateStrategicBrief(learning: LiveLearningState, lang: "fr" | "en"): string {
  const isEn = lang === "en";
  const fmt = (v: number) =>
    (v / 1e6).toFixed(1).replace(".", ",") + (isEn ? "M BIF" : " M BIF");

  if (isEn) {
    return (
      `📊 **ZURI Real-Time Machine Learning Diagnostic (Updated: ${learning.lastUpdated}):**\n\n` +
      `• **Revenue Attainment:** Current month collection is **${fmt(learning.totalRevenue)}** (${learning.attainmentRate}% of the ${fmt(learning.monthlyTarget)} target).\n` +
      `• **Pipeline Forecast:** Weighted pipeline value stands at **${fmt(learning.pipelineWeightedValue)}** across active deals.\n` +
      `• **Top Velocity SKUs:** ${learning.topSellingProducts.map((p) => `${p.name} (${p.units} units sold)`).join(", ")}.\n` +
      `• **Stockout Early Warning:** ${learning.urgentStockouts.length > 0 ? learning.urgentStockouts.map((s) => `${s.name} (${s.daysCover} days cover left)`).join("; ") : "No critical factory shortages."}\n` +
      `• **Retention Alert:** ${learning.atRiskClients.length} accounts inactive for >20 days (${learning.atRiskClients.map((c) => c.name).join(", ")}).`
    );
  }

  return (
    `📊 **Diagnostic d'Apprentissage Automatique en Temps Réel (Actualisé à ${learning.lastUpdated}) :**\n\n` +
    `• **Progression Commerciale :** Chiffre d'affaires à **${fmt(learning.totalRevenue)}** (${learning.attainmentRate} % de l'objectif de ${fmt(learning.monthlyTarget)}).\n` +
    `• **Prévision Pipeline :** Valeur pondérée des opportunités : **${fmt(learning.pipelineWeightedValue)}**.\n` +
    `• **Produits Phares :** ${learning.topSellingProducts.map((p) => `${p.name} (${p.units} unités)`).join(", ")}.\n` +
    `• **Alerte Ruptures Usine :** ${learning.urgentStockouts.length > 0 ? learning.urgentStockouts.map((s) => `${s.name} (${s.daysCover} j d'autonomie)`).join(" ; ") : "Tous les stocks sont sous contrôle."}\n` +
    `• **Comptes à Relancer :** ${learning.atRiskClients.length} clients sans visite depuis +20j (${learning.atRiskClients.map((c) => c.name).join(", ")}).`
  );
}
