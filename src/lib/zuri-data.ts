// Illustrative seed data for ZURI Sales OS with realistic sales conversion and GPS
export type Role = "Direction" | "Responsable Commercial" | "Commercial terrain" | "Gestionnaire de stock";
export type ClientType = "Distributeur" | "Grossiste" | "Détaillant" | "Supermarché" | "Quincaillerie" | "Magasin ménager" | "Particulier";
export type ClientCategory = "VIP" | "Régulier" | "Nouveau" | "À Réactiver";

export type Product = { id: string; name: string; sku: string; category: string; capacity: number; color: string; cost: number; price: number; wholesale: number; distributor: number; stock: number; inProduction: number; minStock: number; moq: number; sold30: number };

export type Client = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  city: string;
  district: string;
  type: ClientType;
  rep: string;
  revenue: number;
  lastVisit: string;
  nextFollowUp: string;
  loyalty: "Fidèle" | "Régulier" | "Inactif" | "Fort potentiel";
  category: ClientCategory;
  lat: number;
  lng: number;
  notes: string;
};

export type Stage = "Nouveau" | "Contacté" | "RDV planifié" | "Intéressé" | "Devis envoyé" | "Négociation" | "Gagné" | "Perdu";
export type Lead = { id: string; name: string; city: string; source: string; type: ClientType; potential: number; stage: Stage; rep: string; score: number; lostReason?: string };
export type OrderStatus = "Brouillon" | "Devis" | "En attente d'approbation" | "Confirmée" | "En préparation" | "Prête à livrer" | "Livrée" | "Facturée" | "Payée" | "Annulée";
export type OrderLine = { productId: string; qty: number; unit: number };
export type Order = { id: string; clientId: string; date: string; lines: OrderLine[]; discount: number; status: OrderStatus; rep: string; paid: number };
export type Visit = { id: string; clientName: string; city: string; rep: string; date: string; checkIn?: string; lat?: number; lng?: number; outcome: string; status: "Planifiée" | "Effectuée" };
export type CompetitorPrice = { id: string; competitor: string; product: string; equivalent: string; price: number; market: string; date: string };
export type Ticket = { id: string; clientName: string; kind: "Réclamation qualité" | "Retour" | "Livraison" | "Satisfaction"; product: string; description: string; status: "Ouvert" | "En cours" | "Résolu"; rating?: number; date: string };
export type Task = { id: string; title: string; rep: string; day: string; done: boolean };
export type User = { id: string; name: string; role: Role; zone: string; target: number; active: boolean };

export const REPS = ["Aline Niyonzima", "Jean-Claude Ndayishimiye", "Diane Irakoze", "Eric Hakizimana"];
export const CITIES = ["Bujumbura", "Gitega", "Ngozi", "Rumonge", "Kayanza", "Muyinga", "Makamba", "Kirundo"];
export const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
export const STAGES: Stage[] = ["Nouveau", "Contacté", "RDV planifié", "Intéressé", "Devis envoyé", "Négociation", "Gagné", "Perdu"];
export const ORDER_FLOW: OrderStatus[] = ["Devis", "En attente d'approbation", "Confirmée", "En préparation", "Prête à livrer", "Livrée", "Facturée", "Payée"];

export const MAX_DISCOUNT: Record<Role, number> = {
  Direction: 100,
  "Responsable Commercial": 10,
  "Commercial terrain": 3,
  "Gestionnaire de stock": 0,
};

export const PERMISSIONS: Record<Role, string[]> = {
  Direction: ["Accès total", "Approbation remises > 10 %", "Gestion des utilisateurs", "Exports comptables"],
  "Responsable Commercial": ["Gestion pipeline & clients", "Validation devis (≤ 10 %)", "Attribution des commerciaux", "Rapports hebdomadaires"],
  "Commercial terrain": ["Fiches clients & devis (≤ 3 %)", "Check-in GPS & visites", "Saisie de commandes", "Planning personnel"],
  "Gestionnaire de stock": ["Mouvements de stock", "Préparation des commandes", "Entrées d'usine", "Alertes réassort"],
};

export const MONTHLY_TARGET = 35_000_000;

export const CATEGORY_COLORS: Record<ClientCategory, { bg: string; text: string; hex: string; labelFr: string; labelEn: string }> = {
  VIP: { bg: "bg-emerald-500", text: "text-emerald-700", hex: "#10b981", labelFr: "VIP / Grand Compte", labelEn: "VIP / Key Account" },
  Régulier: { bg: "bg-blue-500", text: "text-blue-700", hex: "#3b82f6", labelFr: "Régulier", labelEn: "Regular" },
  Nouveau: { bg: "bg-amber-500", text: "text-amber-700", hex: "#f59e0b", labelFr: "Nouveau Client", labelEn: "New Client" },
  "À Réactiver": { bg: "bg-rose-500", text: "text-rose-700", hex: "#f43f5e", labelFr: "À Réactiver", labelEn: "At Risk" },
};

const d = (offset: number) => { const x = new Date(); x.setDate(x.getDate() + offset); return x.toISOString().slice(0, 10); };

export const seedProducts: Product[] = [
  ["Ghajini", "ZUR-GHA-27", "Bassine multi-usage", 27, "Bleu", 9500, 14500, 13000, 12200, 820, 300, 200, 20, 450],
  ["Pogo", "ZUR-POG-25", "Bassine multi-usage", 25, "Rouge", 8800, 13500, 12200, 11500, 640, 200, 200, 20, 380],
  ["Tusker", "ZUR-TUS-40", "Bassine multi-usage", 40, "Vert", 13500, 21000, 19000, 18000, 140, 250, 150, 10, 210],
  ["Titanic", "ZUR-TIT-60", "Bac de stockage", 60, "Bleu", 19000, 29500, 27000, 25500, 180, 200, 80, 5, 120],
  ["Karishma", "ZUR-KAR-20", "Bassine décorée", 20, "Rose", 7200, 11500, 10300, 9800, 410, 100, 150, 20, 260],
  ["Bucket 5L", "ZUR-BUC-05", "Seau", 5, "Jaune", 2100, 3500, 3100, 2900, 1500, 500, 400, 50, 290],
  ["Bucket 10L", "ZUR-BUC-10", "Seau", 10, "Bleu", 3400, 5500, 4900, 4600, 260, 400, 300, 50, 230],
  ["Bucket 20L", "ZUR-BUC-20", "Seau", 20, "Noir", 5600, 8800, 8000, 7500, 320, 0, 200, 30, 150],
  ["Bassine 777", "ZUR-777-30", "Bassine ronde", 30, "Bleu", 8000, 12500, 11200, 10600, 120, 300, 150, 20, 175],
  ["Bassine 17", "ZUR-B17-17", "Bassine ronde", 17, "Vert", 4900, 7800, 7000, 6600, 520, 0, 200, 30, 95],
  ["Basin Round", "ZUR-BAS-12", "Bassine ronde", 12, "Blanc", 3900, 6200, 5600, 5300, 260, 0, 150, 30, 40],
].map((r, i) => ({ id: `p${i + 1}`, name: r[0] as string, sku: r[1] as string, category: r[2] as string, capacity: r[3] as number, color: r[4] as string, cost: r[5] as number, price: r[6] as number, wholesale: r[7] as number, distributor: r[8] as number, stock: r[9] as number, inProduction: r[10] as number, minStock: r[11] as number, moq: r[12] as number, sold30: r[13] as number }));

export const seedClients: Client[] = [
  { id: "c1", name: "Ets Kabondo Distribution", contact: "Pascal Kabondo", phone: "+257 79 100 200", city: "Bujumbura", district: "Rohero", type: "Distributeur", rep: REPS[0], revenue: 18_400_000, lastVisit: d(0), nextFollowUp: d(3), loyalty: "Fidèle", category: "VIP", lat: -3.3855, lng: 29.3644, notes: "Magasin principal avenue de l'Uprona" },
  { id: "c2", name: "Grossiste Ngagara", contact: "Fatuma Hassan", phone: "+257 79 113 207", city: "Bujumbura", district: "Ngagara", type: "Grossiste", rep: REPS[1], revenue: 11_200_000, lastVisit: d(-4), nextFollowUp: d(-1), loyalty: "Fidèle", category: "VIP", lat: -3.3582, lng: 29.3741, notes: "Proche Rond-point des Nations Unies" },
  { id: "c3", name: "Quincaillerie Buyenzi", contact: "Ali Said", phone: "+257 79 127 214", city: "Bujumbura", district: "Buyenzi", type: "Quincaillerie", rep: REPS[2], revenue: 4_600_000, lastVisit: d(-12), nextFollowUp: d(1), loyalty: "Régulier", category: "Régulier", lat: -3.3768, lng: 29.3685, notes: "14ème avenue Buyenzi" },
  { id: "c4", name: "Supermarché Gitega Centre", contact: "Claudine Ntakarutimana", phone: "+257 79 140 221", city: "Gitega", district: "Centre-ville", type: "Supermarché", rep: REPS[3], revenue: 6_900_000, lastVisit: d(-6), nextFollowUp: d(5), loyalty: "Fort potentiel", category: "Régulier", lat: -3.4286, lng: 29.9248, notes: "Face au grand marché de Gitega" },
  { id: "c5", name: "Boutique Maman Ange", contact: "Ange Uwimana", phone: "+257 79 154 228", city: "Ngozi", district: "Marché central", type: "Détaillant", rep: REPS[0], revenue: 850_000, lastVisit: d(-35), nextFollowUp: d(-5), loyalty: "Inactif", category: "À Réactiver", lat: -2.9077, lng: 29.8306, notes: "Relancer pour nouvelle commande" },
  { id: "c6", name: "Distributeur Rumonge Lac", contact: "Thierry Bigirimana", phone: "+257 79 167 235", city: "Rumonge", district: "Port", type: "Distributeur", rep: REPS[1], revenue: 9_800_000, lastVisit: d(-2), nextFollowUp: d(7), loyalty: "Fidèle", category: "VIP", lat: -3.9734, lng: 29.4382, notes: "Zone portuaire Rumonge" },
  { id: "c7", name: "Maison du Ménage Kayanza", contact: "Josiane Kaneza", phone: "+257 79 181 242", city: "Kayanza", district: "Centre", type: "Magasin ménager", rep: REPS[2], revenue: 2_300_000, lastVisit: d(-20), nextFollowUp: d(-2), loyalty: "Régulier", category: "Nouveau", lat: -2.9242, lng: 29.6291, notes: "Nouveau point de vente ouvert en octobre" },
  { id: "c8", name: "Grossiste Muyinga Est", contact: "Emmanuel Nshimirimana", phone: "+257 79 194 249", city: "Muyinga", district: "Gisanze", type: "Grossiste", rep: REPS[3], revenue: 3_100_000, lastVisit: d(-48), nextFollowUp: d(-10), loyalty: "Inactif", category: "À Réactiver", lat: -2.8451, lng: 30.3414, notes: "Zone frontalière Kobero" },
  { id: "c9", name: "Quincaillerie Makamba", contact: "Gérard Niyongabo", phone: "+257 79 208 256", city: "Makamba", district: "Centre", type: "Quincaillerie", rep: REPS[0], revenue: 1_900_000, lastVisit: d(-9), nextFollowUp: d(2), loyalty: "Fort potentiel", category: "Nouveau", lat: -4.1333, lng: 29.8000, notes: "Gros projet d'agrandissement" },
  { id: "c10", name: "Super Kiosque Kinindo", contact: "Sandrine Ishimwe", phone: "+257 79 221 263", city: "Bujumbura", district: "Kinindo", type: "Supermarché", rep: REPS[1], revenue: 5_200_000, lastVisit: d(-1), nextFollowUp: d(10), loyalty: "Régulier", category: "Régulier", lat: -3.4112, lng: 29.3551, notes: "Avenue du Large, Kinindo" },
];

// Leads incluant des affaires gagnées démontrant un taux de conversion réel
export const seedLeads: Lead[] = [
  { id: "l1", name: "Grossiste Bwiza Nouveau", city: "Bujumbura", source: "Visite terrain", type: "Grossiste", potential: 6_000_000, stage: "Négociation", score: 86, rep: REPS[1] },
  { id: "l2", name: "Magasin Ménager Gitega Sud", city: "Gitega", source: "Recommandation", type: "Magasin ménager", potential: 2_500_000, stage: "Gagné", score: 92, rep: REPS[3] },
  { id: "l3", name: "Distributeur Ngozi Nord", city: "Ngozi", source: "Salon commercial", type: "Distributeur", potential: 12_000_000, stage: "RDV planifié", score: 80, rep: REPS[0] },
  { id: "l4", name: "Supermarché Rumonge Plage", city: "Rumonge", source: "Appel entrant", type: "Supermarché", potential: 3_800_000, stage: "Devis envoyé", score: 77, rep: REPS[1] },
  { id: "l5", name: "Quincaillerie Moderne Mutanga", city: "Bujumbura", source: "Visite terrain", type: "Quincaillerie", potential: 4_200_000, stage: "Gagné", score: 88, rep: REPS[2] },
  { id: "l6", name: "Quincaillerie Kirundo", city: "Kirundo", source: "Visite terrain", type: "Quincaillerie", potential: 1_200_000, stage: "Contacté", score: 55, rep: REPS[3] },
  { id: "l7", name: "Boutique Cibitoke", city: "Bujumbura", source: "Facebook", type: "Détaillant", potential: 600_000, stage: "Perdu", score: 22, rep: REPS[0], lostReason: "Prix jugé trop élevé" },
];

const statuses: OrderStatus[] = ["Payée", "Livrée", "Facturée", "Confirmée", "En préparation", "Prête à livrer", "En attente d'approbation", "Devis", "Payée", "Payée"];
export const seedOrders: Order[] = Array.from({ length: 34 }, (_, i) => {
  const p1 = seedProducts[i % seedProducts.length]!, p2 = seedProducts[(i * 3 + 1) % seedProducts.length]!;
  const lines = [{ productId: p1.id, qty: 20 + ((i * 17) % 80), unit: p1.wholesale }, { productId: p2.id, qty: 10 + ((i * 11) % 60), unit: p2.wholesale }];
  const status = statuses[i % statuses.length]!;
  const total = lines.reduce((s, l) => s + l.qty * l.unit, 0);
  return { id: `CMD-${String(2400 + i)}`, clientId: seedClients[i % seedClients.length]!.id, date: d(-Math.floor(i * 0.9)), lines, discount: i % 5 === 0 ? 3 : 0, status, rep: REPS[i % 4]!, paid: status === "Payée" ? total : 0 };
});

export const seedVisits: Visit[] = [
  { id: "v1", clientName: "Grossiste Ngagara", city: "Bujumbura", rep: REPS[1], date: d(0), status: "Effectuée", checkIn: "09:12", lat: -3.3582, lng: 29.3741, outcome: "Commande de 60 Ghajini prévue vendredi" },
  { id: "v2", clientName: "Quincaillerie Buyenzi", city: "Bujumbura", rep: REPS[2], date: d(0), status: "Planifiée", outcome: "" },
  { id: "v3", clientName: "Supermarché Gitega Centre", city: "Gitega", rep: REPS[3], date: d(1), status: "Planifiée", outcome: "" },
  { id: "v4", clientName: "Distributeur Rumonge Lac", city: "Rumonge", rep: REPS[1], date: d(-1), status: "Effectuée", checkIn: "14:40", lat: -3.9734, lng: 29.4382, outcome: "Demande de remise 5 % sur Tusker" },
];

export const seedCompetitors: CompetitorPrice[] = [
  ["Plastico Kenya", "Bassine 30L", "Ghajini 27L", 13800, "Marché central Bujumbura"],
  ["Tanzaplast", "Seau 5L", "Bucket 5L", 3200, "Gitega"],
  ["Import Chine (générique)", "Bassine 40L", "Tusker 40L", 18500, "Bujumbura - Buyenzi"],
  ["Plastico Kenya", "Seau 20L", "Bucket 20L", 8200, "Ngozi"],
].map((r, i) => ({ id: `cp${i + 1}`, competitor: r[0] as string, product: r[1] as string, equivalent: r[2] as string, price: r[3] as number, market: r[4] as string, date: d(-((i * 4) % 15)) }));

export const seedTickets: Ticket[] = [
  { id: "t1", clientName: "Ets Kabondo Distribution", kind: "Satisfaction", product: "Ghajini", description: "Très satisfait de la résistance aux chocs sur le lot d'octobre.", status: "Résolu", rating: 5, date: d(-5) },
  { id: "t2", clientName: "Grossiste Ngagara", kind: "Réclamation qualité", product: "Bucket 10L", description: "Anses jugées un peu fines sur 12 pièces reçues.", status: "En cours", rating: 3, date: d(-2) },
  { id: "t3", clientName: "Supermarché Gitega Centre", kind: "Livraison", product: "Tusker", description: "Colis livré avec 24h de décalage suite aux pluies.", status: "Résolu", rating: 4, date: d(-8) },
  { id: "t4", clientName: "Distributeur Rumonge Lac", kind: "Satisfaction", product: "Pogo", description: "Forte rotation dans le secteur pêche du lac Tanganyika.", status: "Résolu", rating: 5, date: d(-1) },
];

export const seedTasks: Task[] = [
  { id: "tk1", title: "Visite réassort Ets Kabondo", rep: REPS[0], day: "Lundi", done: false },
  { id: "tk2", title: "Validation commande Super Kiosque", rep: REPS[1], day: "Mardi", done: true },
  { id: "tk3", title: "Relance devis Grossiste Bwiza", rep: REPS[0], day: "Mercredi", done: false },
  { id: "tk4", title: "Vérification stocks Ghajini 27L", rep: REPS[2], day: "Jeudi", done: true },
];

export const seedUsers: User[] = [
  { id: "u1", name: "Aline Niyonzima", role: "Responsable Commercial", zone: "Bujumbura Nord & Ouest", target: 12_000_000, active: true },
  { id: "u2", name: "Jean-Claude Ndayishimiye", role: "Commercial terrain", zone: "Bujumbura Sud & Rumonge", target: 9_000_000, active: true },
  { id: "u3", name: "Diane Irakoze", role: "Commercial terrain", zone: "Bujumbura Centre & Gitega", target: 8_000_000, active: true },
  { id: "u4", name: "Eric Hakizimana", role: "Commercial terrain", zone: "Ngozi, Kayanza & Nord", target: 6_000_000, active: true },
];
