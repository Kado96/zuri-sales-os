# ZURI Sales OS — Operating System Commercial & Terrain

> **Système Intégré de Pilotage Commercial, Géolocalisation GPS & Intelligence de Données**  
> Conçu spécialement pour **ZAHARA INDUSTRIES SPRL** (Bujumbura, Burundi)  
> Démonstration en direct : [https://zuri-sales-os.vercel.app](https://zuri-sales-os.vercel.app)

---

## 🌟 Vue d'ensemble du Système

**ZURI Sales OS** est une solution complète conçue pour accompagner la force de vente et la Direction Commerciale de **Zahara Industries SPRL** dans le développement de ses parts de marché sur l'ensemble du territoire burundais (Bujumbura et provinces).

Elle combine la gestion rigoureuse des clients industriels, la prospection terrain avec pointage GPS, le contrôle des stocks en temps réel pour éviter les ruptures de fabrication, et un **Moteur d'Intelligence Artificielle conversationnel bilingue** capable d'expliquer le système et d'analyser les indicateurs de rentabilité.

---

## 📱 Modules Principaux & Fonctionnalités Clés

### 1. 📊 Tableau de Bord Stratégique (`/`)
* **KPIs Directeurs :** Suivi en temps réel du chiffre d'affaires mensuel, du taux d'atteinte de l'objectif (35 M BIF) et du nombre de commandes en cours.
* **Tendance Dynamique :** Graphique des flux de vente sur 14 jours glissants.
* **Cartographie Interactive :** Visualisation géographique de la pénétration de marché avec Leaflet/OpenStreetMap.
* **Filtre Temporel Global :** Recalcul instantané à la minute, à l'heure, 24h, 7j, 30j, ce mois-ci ou plage personnalisée.

### 2. 👥 CRM Clients & Points de Vente (`/clients`)
* **Répertoire Centralisé :** Grossistes, distributeurs, détaillants, quincailleries.
* **Géolocalisation GPS Réelle :** Capture automatique des coordonnées GPS via le navigateur ou le smartphone du commercial.
* **Aide à la Navigation :** Bouton direct **« S'y rendre »** lançant le guidage d'itinéraire Google Maps vers le client.
* **Segmentation RFM :** Classification visuelle par code couleur (VIP, Régulier, Nouveau, À Réactiver).
* **Gestion Complète (CRUD) :** Ajout, modification, suppression sécurisée avec boîte de dialogue.

### 3. 🎯 Prospection & Pipeline Commercial (`/pipeline`)
* **Cycle de Vente Kanban :** Progression visuelle des opportunités : `Nouveau → Contacté → RDV planifié → Intéressé → Devis envoyé → Négociation → Gagné / Perdu`.
* **Fiche Détaillée du Prospect :** Clic direct sur la carte pour inspecter le potentiel, le commercial en charge et les descriptions de besoins.
* **Description & Besoins Personnalisés :** Ajout et modification des quantités souhaitées et des modèles de bassines/seaux ciblés.
* **Conversion Automatique :** Lorsqu'un prospect atteint l'étape **« Gagné »**, il est immédiatement inscrit dans le CRM Clients.
* **Scoring Prédictif de Conversion :** Score algorithmique de 0 à 100 calculé selon le canal d'acquisition et le volume potentiel.

### 4. 📦 Catalogue Produits & Marges ZURI (`/produits`)
* **Gamme Plastique Zahara :** Ghajini (27L), Tusker (40L), Titanic (70L), Seaux (5L/10L/20L), Pogo.
* **Contrôle des Prix & Rentabilité :** Coût de revient usine, prix distributeur, prix grossiste et calcul automatique des marges bénéficiaires.
* **Gestion des Références :** Ajout, modification et suppression des fiches techniques.

### 5. 🛒 Ventes & Commandes (`/ventes`)
* **Génération de Devis & Proformas :** Sélection multi-articles et édition prête pour impression PDF en un clic.
* **Circuit de Validation des Remises :** Limites strictes par rôle (Commercial terrain : 3 %, Responsable Commercial : 10 %, Direction : 100 %).
* **Statuts séquentiels :** `Devis → Confirmée → En préparation → Prête à livrer → Livrée → Facturée → Payée`.
* **Déstockage Automatique :** Mise à jour en temps réel des stocks physiques dès la validation de livraison.

### 6. 🏭 Stocks & Disponibilités (`/stocks`)
* **Prévention des Ruptures :** Surveillance des stocks disponibles vs réservés sur commandes en cours.
* **Jours de Couverture (Days of Cover - DOC) :** Calcul algorithmique du délai d'épuisement des stocks.
* **Recommandation de Réassort :** Suggestion automatique des quantités prioritaires à fabriquer en usine.

### 7. 📍 Visites Terrain & Check-in GPS (`/terrain`)
* **Planification des Tournées :** Calendrier des visites pour les commerciaux à Bujumbura et en province.
* **Pointage GPS sur Place :** Validation de présence physique chez le client avec horodatage et coordonnées réelles.
* **Comptes-rendus Immédiats :** Enregistrement des retours d'échange pour un suivi d'équipe fluide.

### 8. 🤖 Chatbot Guide & Analyste IA Bilingue
* **Bulle Flottante Interactive :** Disponible sur chaque écran (en bas à droite).
* **Bilinguisme Parfait (FR / EN) :** S'adapte instantanément à la langue sélectionnée dans l'application.
* **Expertise Métier :** Explique le fonctionnement étape par étape de chaque page, guide l'utilisateur et explicite les algorithmes de données (Lead scoring, régression de vente, clustering spatial).

---

## 🛠️ Stack Technique & Architecture

* **Frontend :** React 19, TypeScript, Vite 8, TanStack Start & Router.
* **Style & UI :** Tailwind CSS 4, Radix UI, Lucide Icons, Recharts.
* **Cartographie :** Leaflet & OpenStreetMap avec Leaflet-CSS intégré.
* **Mobile Natif :** Capacitor 8 (Plateforme Android native avec permissions GPS fines et accès réseau).
* **Hébergement & CI/CD :** Vercel (Auto-deploy depuis la branche `main` de GitHub).

---

## 🚀 Installation & Lancement Local

```powershell
# Cloner le dépôt
git clone https://github.com/Kado96/zuri-sales-os.git
cd "zuri-sales-os"

# Installer les dépendances
bun install

# Lancer le serveur de développement
bun run dev
```

### Build et Déploiement
```powershell
# Compiler l'application
bun run build

# Synchroniser la plateforme mobile Android
npx cap sync android

# Ouvrir dans Android Studio pour générer l'APK
npx cap open android
```

---

## 👤 Auteur & Candidat
**Donald KANDEKE**  
*Cadre Commercial & Spécialiste Opérations Commerciales & Data*  
Bujumbura, Burundi  
📞 (+257) 66 324 968 | 💬 WhatsApp : (+257) 79 928 864  
✉️ kandekedonald@gmail.com  
🐙 [github.com/Kado96](https://github.com/Kado96)
