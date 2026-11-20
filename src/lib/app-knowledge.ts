export type AppGuideSection = {
  id: string;
  page: string;
  titleFr: string;
  titleEn: string;
  summaryFr: string;
  summaryEn: string;
  howToUseFr: string[];
  howToUseEn: string[];
  dataAnalysisInsightsFr: string[];
  dataAnalysisInsightsEn: string[];
  algorithmsAndLearningFr: string;
  algorithmsAndLearningEn: string;
  keywords: string[];
};

export const ZURI_APP_KNOWLEDGE_BASE: AppGuideSection[] = [
  {
    id: "dashboard",
    page: "Tableau de bord (/)",
    titleFr: "Pilotage Stratégique & KPIs Commerciaux",
    titleEn: "Strategic Dashboard & Commercial KPIs",
    summaryFr:
      "Vue d'ensemble exécutive permettant à la Direction et au Responsable Commercial de suivre le chiffre d'affaires mensuel, la progression par rapport à l'objectif (35 M BIF), les alertes de commandes et la carte interactive du Burundi.",
    summaryEn:
      "Executive overview allowing Management and Sales Officers to track monthly revenue, target progress (35M BIF), order alerts, and the interactive Burundi distribution map.",
    howToUseFr: [
      "Consulter les indicateurs clés : CA cumulé, pourcentage d'atteinte de l'objectif et commandes en attente.",
      "Analyser le graphique des tendances des 14 derniers jours pour identifier les pics ou baisses d'activité.",
      "Interagir avec la carte Leaflet du Burundi pour observer la distribution spatiale des clients et de l'approvisionnement.",
      "Utiliser le Filtre Temporel Global (sidebar) pour recalculer instantanément le CA sur 24h, 7j, ce mois-ci ou une plage de minutes précise.",
    ],
    howToUseEn: [
      "View key metrics: cumulative revenue, target attainment percentage, and pending orders.",
      "Analyze the 14-day trend chart to detect sales spikes or volume drops.",
      "Interact with the Burundi Leaflet map to inspect client spatial distribution and supply points.",
      "Use the Global Time Filter (sidebar) to recalculate revenue over 24h, 7d, this month, or a precise minute/hour range.",
    ],
    dataAnalysisInsightsFr: [
      "Ratio de conversion : compare le volume de devis émis et le CA effectivement encaissé ('Payée').",
      "Vélocité de vente : analyse le délai moyen entre la confirmation de commande et la livraison physique.",
      "Détection d'anomalies : alerte visuelle si le CA glissant baisse de plus de 15 % par rapport à la moyenne mobile.",
    ],
    dataAnalysisInsightsEn: [
      "Conversion ratio: compares quote volume against actual collected revenue ('Payée').",
      "Sales velocity: analyzes average turnaround time between order confirmation and physical delivery.",
      "Anomaly detection: visual alert if rolling revenue drops more than 15% below the moving average.",
    ],
    algorithmsAndLearningFr:
      "Régression linéaire et moyenne mobile pondérée (SMA 7j/14j) pour la prévision de clôture mensuelle. Détection de saisonnalité selon les jours de marché au Burundi.",
    algorithmsAndLearningEn:
      "Linear regression and weighted moving average (SMA 7d/14d) for end-of-month revenue forecasting, incorporating weekly market-day seasonality across Burundi.",
    keywords: ["tableau de bord", "kpi", "chiffre d'affaires", "ca", "objectif", "carte", "dashboard", "revenue", "target"],
  },
  {
    id: "pipeline",
    page: "Prospection & Pipeline (/pipeline)",
    titleFr: "Entonnoir de Prospection & Conversion Commerciale",
    titleEn: "Prospecting Funnel & Sales Conversion",
    summaryFr:
      "Gestionnaire de cycle de vente visuel type Kanban. Permet de suivre chaque opportunité depuis la détection jusqu'à la conclusion ('Gagné') ou la qualification de l'échec ('Perdu'), avec édition complète des descriptions et besoins.",
    summaryEn:
      "Kanban-style sales cycle tracker. Manage each lead from initial contact to closing ('Gagné') or lost deal analysis ('Perdu'), with full description and requirement editing.",
    howToUseFr: [
      "Cliquer sur '+ Prospect' pour enregistrer un nouveau prospect avec nom, ville, source, type, potentiel en BIF et description détaillée.",
      "Cliquer sur n'importe quelle carte de prospect pour afficher la fiche détaillée, avec analyse prédictive ZURI AI.",
      "Utiliser les boutons d'action 'Modifier' et 'Supprimer' sur la carte ou dans la fiche pour ajuster les montants ou les besoins.",
      "Utiliser les flèches '<' et '>' pour déplacer une opportunité (Nouveau → Contacté → RDV planifié → Intéressé → Devis envoyé → Négociation → Gagné).",
      "Lorsqu'un prospect passe à 'Gagné', il est automatiquement converti en Client actif dans le CRM.",
    ],
    howToUseEn: [
      "Click '+ Prospect' to register a new lead with name, city, source, type, BIF potential, and detailed description.",
      "Click any lead card to open the comprehensive inspection dialog with ZURI AI predictive insights.",
      "Use 'Edit' and 'Delete' action buttons on the card or modal to update amounts, assigned reps, or customer needs.",
      "Use '<' and '>' arrows to advance stages (Nouveau → Contacté → RDV planifié → Intéressé → Devis envoyé → Négociation → Gagné).",
      "When marked 'Gagné', the lead automatically converts into an active CRM client.",
    ],
    dataAnalysisInsightsFr: [
      "Taux de conversion d'étape : pourcentage d'opportunités franchissant chaque phase de l'entonnoir.",
      "Valeur pondérée du pipeline : somme des potentiels multipliée par la probabilité associée à l'étape.",
      "Motifs de perte récurrents : identification des freins (prix jugé élevé, concurrence, indisponibilité produit).",
    ],
    dataAnalysisInsightsEn: [
      "Stage conversion rate: percentage of leads successfully advancing through each funnel milestone.",
      "Weighted pipeline value: sum of potential amounts weighted by historical stage win probabilities.",
      "Recurring loss drivers: identification of lost reasons (price sensitivity, competitor presence, inventory shortage).",
    ],
    algorithmsAndLearningFr:
      "Algorithme de Scoring Prédictif de Lead (0 à 100) : calcule la probabilité de clôture en combinant le montant potentiel, le canal d'acquisition (visite terrain vs réseaux sociaux) et la complétude du dossier.",
    algorithmsAndLearningEn:
      "Predictive Lead Scoring Algorithm (0-100): computes closing probability using expected revenue, acquisition channel weights (field visit > incoming call > social media), and account completeness.",
    keywords: ["pipeline", "prospect", "lead", "prospection", "entonnoir", "gagné", "perdu", "kanban", "score", "funnel"],
  },
  {
    id: "clients",
    page: "CRM Clients (/clients)",
    titleFr: "Portefeuille Clients & Géolocalisation GPS",
    titleEn: "Client Portfolio & GPS Field Navigation",
    summaryFr:
      "Répertoire complet des points de vente, grossistes, distributeurs et quincailleries au Burundi, enrichi de coordonnées GPS et d'un système d'aide à la navigation terrain.",
    summaryEn:
      "Central directory of points of sale, wholesalers, distributors, and hardware stores in Burundi, enhanced with GPS coordinates and turn-by-turn navigation.",
    howToUseFr: [
      "Ajouter un nouveau client avec capture GPS automatique en un clic via le bouton 'Capturer position GPS'.",
      "Consulter la carte interactive pour visualiser les clients avec code couleur par catégorie (VIP, Régulier, Nouveau, À Réactiver).",
      "Cliquer sur 'S'y rendre' pour lancer directement Google Maps avec calcul d'itinéraire vers le point de vente.",
      "Modifier ou supprimer une fiche client avec confirmation de sécurité.",
      "Consulter l'historique d'achat et le score de fidélité de chaque compte client.",
    ],
    howToUseEn: [
      "Add a new client with one-click automated browser/device GPS capture.",
      "Explore the interactive map with color-coded client categories (VIP, Regular, New, Re-activate).",
      "Click 'S'y rendre / Navigate' to launch turn-by-turn navigation directly in Google Maps.",
      "Edit or delete customer profiles with safety confirmation dialogs.",
      "Review client transaction history and computed relationship scores.",
    ],
    dataAnalysisInsightsFr: [
      "Segmentation RFM (Récence, Fréquence, Montant) pour classer automatiquement les clients de VIP à 'À Réactiver'.",
      "Score de churn (risque d'attrition) : détection des comptes sans commande depuis plus de 20 jours.",
    ],
    dataAnalysisInsightsEn: [
      "RFM segmentation (Recency, Frequency, Monetary) classifying accounts into actionable priority tiers.",
      "Churn risk scoring: early detection of dormant accounts inactive for over 20 days.",
    ],
    algorithmsAndLearningFr:
      "Algorithme de clustering K-Means spatial pour le regroupement de clients par zone de tournée commerciale, réduisant les temps de trajet de 25 %.",
    algorithmsAndLearningEn:
      "Spatial K-Means clustering grouping retail locations into optimized delivery zones to minimize transit fuel and time.",
    keywords: ["crm", "client", "clients", "gps", "carte", "navigation", "itinéraire", "visite", "vip", "relance", "map"],
  },
  {
    id: "produits",
    page: "Catalogue ZURI (/produits)",
    titleFr: "Catalogue Produits & Analyse des Marges",
    titleEn: "Product Catalog & Margin Engineering",
    summaryFr:
      "Gestion complète des produits industriels en plastique ZURI (Ghajini, Tusker, Titanic, Pogo, etc.) avec coûts de revient, prix distributeurs, prix grossistes et marges brutes.",
    summaryEn:
      "Catalog of Zahara molded plastic products (Ghajini, Tusker, Titanic, Pogo) with unit costs, wholesale/distributor pricing tiers, and gross margin analysis.",
    howToUseFr: [
      "Ajouter, modifier ou supprimer des références produits (nom, SKU, capacité en litres, couleur, coût et prix).",
      "Surveiller les marges calculées automatiquement par le système.",
      "Consulter les niveaux de stock physique et de stock en cours de production.",
    ],
    howToUseEn: [
      "Create, edit, or delete product references (SKU, volume capacity, color, unit manufacturing cost, sales prices).",
      "Monitor automated profit margins computed across customer tiers.",
      "Track physical inventory alongside units currently in the injection molding queue.",
    ],
    dataAnalysisInsightsFr: [
      "Contribution à la marge : classe les produits générant le plus de rentabilité nette.",
      "Élasticité-prix : évalue la sensibilité des commandes de grossistes face aux variations tarifaires.",
    ],
    dataAnalysisInsightsEn: [
      "Margin contribution matrix ranking high-margin anchor SKUs vs volume drivers.",
      "Price elasticity indicators assessing order frequency against competitor pricing.",
    ],
    algorithmsAndLearningFr:
      "Matrice BCG automatisée (Phares, Vaches à lait, Dilemmes, Poids morts) pour piloter l'allocation des capacités de production plastique.",
    algorithmsAndLearningEn:
      "Automated BCG matrix categorizing SKUs into Cash Cows, Stars, and Question Marks to optimize production mold schedules.",
    keywords: ["catalogue", "produits", "produit", "prix", "marge", "ghajini", "tusker", "titanic", "plastique", "catalog", "products", "margin"],
  },
  {
    id: "ventes",
    page: "Ventes & Commandes (/ventes)",
    titleFr: "Cycle de Commande & Encadrement des Remises",
    titleEn: "Order Management & Discount Governance",
    summaryFr:
      "Gestion du cycle de vente de A à Z : devis proforma, bons de commande, validation des remises par rôle hiérarchique, livraison et encaissement.",
    summaryEn:
      "End-to-end order processing: quotes, purchase orders, role-governed discount ceilings, production dispatch, and invoicing.",
    howToUseFr: [
      "Créer un devis ou bon de commande en sélectionnant le client et les lignes d'articles.",
      "Appliquer une remise commerciale : si la remise dépasse le seuil autorisé (ex: max 10 % pour Responsable Commercial), la commande bascule en 'En attente d'approbation'.",
      "Faire avancer le statut de commande (Devis → Confirmée → En préparation → Prête à livrer → Livrée → Facturée → Payée).",
      "Imprimer un devis ou bon de commande au format professionnel en un clic.",
    ],
    howToUseEn: [
      "Generate quotes and orders by selecting clients and catalog items.",
      "Apply discounts: orders requiring discounts beyond user role limits (e.g. >10% for Sales Officer) enter an approval workflow.",
      "Advance orders across sequential fulfillment stages (Devis → Confirmée → En préparation → Prête à livrer → Livrée → Facturée → Payée).",
      "Print clean PDF-ready proforma invoices and purchase slips with a single click.",
    ],
    dataAnalysisInsightsFr: [
      "Taux d'encaissement : rapport entre facturation émise et fonds encaissés.",
      "Impact des remises : calcul de l'érosion de marge liée aux remises accordées sur le terrain.",
    ],
    dataAnalysisInsightsEn: [
      "Cash collection ratio evaluating billed versus settled order totals.",
      "Discount erosion impact quantifying revenue lost to field negotiations.",
    ],
    algorithmsAndLearningFr:
      "Arbre de décision pour le circuit d'approbation financière et règles automatisées de déstockage temps réel lors du passage en livraison.",
    algorithmsAndLearningEn:
      "Rule-based approval decision trees coupled with real-time atomic inventory deduction upon shipping validation.",
    keywords: ["ventes", "commandes", "devis", "proforma", "remise", "approbation", "facture", "paiement", "sales", "orders", "invoice"],
  },
  {
    id: "stocks",
    page: "Stocks & Disponibilités (/stocks)",
    titleFr: "Contrôle des Stocks & Prévention des Ruptures",
    titleEn: "Inventory Intelligence & Stockout Prevention",
    summaryFr:
      "Supervision des stocks disponibles, unités réservées sur commandes confirmées et déclenchement automatique des ordres de fabrication.",
    summaryEn:
      "Real-time monitoring of available inventory, reserved units for active orders, and automated reorder calculation.",
    howToUseFr: [
      "Vérifier le statut de chaque produit : OK, Réassort ou Alerte Rupture.",
      "Calculer la quantité recommandée à réapprovisionner selon la vitesse de rotation des 30 derniers jours.",
      "Ajuster les quantités en stock et lancer des ordres de production.",
    ],
    howToUseEn: [
      "Inspect status per SKU: OK, Reorder Needed, or Critical Shortage Alert.",
      "Review automated replenishment recommendations based on 30-day velocity.",
      "Adjust warehouse levels and trigger factory production work orders.",
    ],
    dataAnalysisInsightsFr: [
      "Jours de couverture (Days of Cover) : nombre de jours de vente restants avant épuisement total.",
      "Rotation des stocks : fréquence de renouvellement par type d'article.",
    ],
    dataAnalysisInsightsEn: [
      "Days of Cover (DOC): remaining inventory runway before reaching stockout.",
      "Turnover ratio measuring warehouse velocity per mold category.",
    ],
    algorithmsAndLearningFr:
      "Formule de Wilson (Quantité Économique de Commande - EOQ) et calcul de stock de sécurité dynamique basé sur la variance de la demande hebdomadaire.",
    algorithmsAndLearningEn:
      "Dynamic Safety Stock model and Economic Order Quantity (EOQ) based on weekly demand variance and replenishment lead times.",
    keywords: ["stock", "stocks", "rupture", "réassort", "inventaire", "couverture", "disponibilité", "inventory", "reorder"],
  },
  {
    id: "terrain",
    page: "Terrain & GPS (/terrain)",
    titleFr: "Tournées Commerciales & Check-in GPS",
    titleEn: "Field Route Execution & GPS Check-in",
    summaryFr:
      "Outil terrain pour les commerciaux en déplacement : planification des tournées, pointage GPS en temps réel sur place et rédaction de comptes-rendus de visite.",
    summaryEn:
      "Field rep companion for route planning, verified on-site GPS check-in, and rapid visit reporting.",
    howToUseFr: [
      "Planifier une visite client avec date, commercial assigné et ville.",
      "Cliquer sur 'Pointer (Check-in)' à l'arrivée chez le client pour enregistrer l'heure exacte et les coordonnées GPS réelles du pointage.",
      "Cliquer sur 'S'y rendre' pour ouvrir Google Maps avec guidage routier.",
      "Ajouter le compte-rendu commercial (commandes futures, besoins, réclamations).",
    ],
    howToUseEn: [
      "Schedule client visits specifying sales rep, scheduled date, and territory.",
      "Click 'Check-in' upon arrival to timestamp the visit and capture verified field coordinates.",
      "Click 'Navigate' to launch routing assistance directly via Google Maps.",
      "Log meeting summaries, next delivery requests, and customer feedback.",
    ],
    dataAnalysisInsightsFr: [
      "Taux de conformité des visites : ratio de visites réelles pointées par GPS vs visites théoriques planifiées.",
      "Efficacité terrain : ratio de commandes générées par visite effectuée.",
    ],
    dataAnalysisInsightsEn: [
      "Route compliance rate: ratio of verified GPS check-ins against scheduled route visits.",
      "Field effectiveness ratio: orders closed per client face-to-face interaction.",
    ],
    algorithmsAndLearningFr:
      "Optimisation de tournées (problème du voyageur de commerce - TSP heuristique) pour ordonnancer les visites quotidiennes avec le minimum de kilomètres.",
    algorithmsAndLearningEn:
      "Traveling Salesperson (TSP) heuristic algorithm sorting daily client sequences to reduce travel distance and fuel expenditure.",
    keywords: ["terrain", "visite", "visites", "check-in", "pointage", "gps", "tournée", "commercial", "field", "route"],
  },
  {
    id: "time_filter",
    page: "Filtre Temporel Global",
    titleFr: "Filtrage Précis Multi-Périodes",
    titleEn: "Precision Global Time Filter",
    summaryFr:
      "Composant universel permettant d'isoler l'activité du système sur 15 min, 30 min, 1h, 24h, 7j, 30j, le mois en cours, l'année ou une plage précise à la minute.",
    summaryEn:
      "Universal time-slicing filter enabling instant recalculation across 15m, 30m, 1h, 24h, 7d, 30d, monthly, yearly, or custom minute-level date ranges.",
    howToUseFr: [
      "Sélectionner une plage rapide dans le menu déroulant sous le logo.",
      "Cliquer sur 'Ajuster' pour choisir une date/heure de début et une date/heure de fin précises.",
      "Les graphiques, ventes, historiques clients et visites s'adaptent instantanément.",
    ],
    howToUseEn: [
      "Choose a quick preset from the dropdown menu in the sidebar/header.",
      "Click 'Edit / Ajuster' to specify start and end timestamps down to the exact minute.",
      "All KPIs, charts, orders, and field logs update synchronously.",
    ],
    dataAnalysisInsightsFr: [
      "Permet d'isoler des périodes de promotion, des journées de livraison spécifiques ou les performances d'une matinée de prospection.",
    ],
    dataAnalysisInsightsEn: [
      "Isolates promotional surges, delivery windows, or morning shift sales spikes.",
    ],
    algorithmsAndLearningFr:
      "Filtrage temporel O(N) avec normalisation ISO UTC pour une synchronisation fluide entre les environnements mobiles et web.",
    algorithmsAndLearningEn:
      "O(N) memory-efficient time-window matching with ISO UTC normalization across mobile and browser clients.",
    keywords: ["filtre", "temps", "heure", "minute", "24h", "date", "calendrier", "période", "filter", "time", "hour"],
  },
];
