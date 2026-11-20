import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  BookOpen,
  BrainCircuit,
  Database,
  ArrowRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useZuri } from "@/lib/zuri-store";
import { ZURI_APP_KNOWLEDGE_BASE, type AppGuideSection } from "@/lib/app-knowledge";
import { computeRealTimeLearning, generateStrategicBrief } from "@/lib/live-learning";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  sources?: string[];
  suggestions?: string[];
};

export function ZuriExplainerBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const { lang, products, clients, orders, leads, visits } = useZuri();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isEn = lang === "en";

  // Moteur d'apprentissage automatique en temps réel branché sur les données de l'application
  const currentLearning = computeRealTimeLearning(products, clients, orders, leads, visits);

  const getWelcomeMessage = (): Message => ({
    id: "m0",
    sender: "bot",
    text: isEn
      ? "👋 Hello! I am the ZURI Sales OS AI Guide & Analyst. I know every page of the application, calculations, data learning algorithms, and how to analyze your sales operations. What would you like to know?"
      : "👋 Bonjour ! Je suis le Bot Guide & Analyste IA de ZURI Sales OS. Je connais chaque page de l'application, les calculs, les algorithmes d'apprentissage des données et comment analyser vos opérations commerciales. Que souhaitez-vous savoir ?",
    suggestions: isEn
      ? [
          "How to use Prospecting & Pipeline?",
          "How does the predictive lead scoring algorithm work?",
          "Explain inventory calculations & stockouts",
          "How does the precision time filter work?",
        ]
      : [
          "Comment utiliser la page Prospection & Pipeline ?",
          "Comment fonctionne l'algorithme de scoring des leads ?",
          "Explique-moi le calcul des ruptures et stocks",
          "Comment fonctionne le filtre temporel à la minute ?",
        ],
  });

  const [messages, setMessages] = useState<Message[]>([getWelcomeMessage()]);

  // Si l'utilisateur change la langue du site (FR <-> EN), on actualise les messages du bot
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "m0") {
        return [getWelcomeMessage()];
      }
      return prev;
    });
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Moteur d'analyse intelligente bilingue FR/EN
  const processQuery = (rawQuery: string): { reply: string; sources: string[]; suggestions: string[] } => {
    const q = rawQuery.toLowerCase().trim();

    // Algorithmes et apprentissage des données
    if (
      q.includes("algorithme") ||
      q.includes("algorithm") ||
      q.includes("apprentissage") ||
      q.includes("learning") ||
      q.includes("ia") ||
      q.includes("ai") ||
      q.includes("machine learning") ||
      q.includes("modèle") ||
      q.includes("model") ||
      q.includes("diagnostic") ||
      q.includes("analyse") ||
      q.includes("analysis")
    ) {
      const liveBrief = generateStrategicBrief(currentLearning, isEn ? "en" : "fr");
      return isEn
        ? {
            reply: `${liveBrief}\n\n` +
              `🧠 **Core Learning Algorithms Implemented:**\n` +
              `1. **Predictive Lead Scoring (0-100):** Evaluates acquisition channel credibility and order size.\n` +
              `2. **Linear Run-Rate Sales Regression:** Projects monthly quota attainment with market seasonality.\n` +
              `3. **Inventory Days of Cover (DOC):** Anticipates factory shortages dynamically.\n` +
              `4. **Spatial Route Clustering:** Groups client GPS pins into optimal daily itineraries.`,
            sources: ["Prospecting & Pipeline", "Stocks & Inventory", "ZURI AI Assistant"],
            suggestions: [
              "How to edit a lead in the pipeline?",
              "How to add a client with GPS coordinates?",
              "Explain discount approval rules",
            ],
          }
        : {
            reply: `${liveBrief}\n\n` +
              `🧠 **Algorithmes d'Apprentissage Automatique Implémentés :**\n` +
              `1. **Scoring Prédictif de Conversion des Leads (0-100) :** Calcule la probabilité de signature.\n` +
              `2. **Régression Linéaire & Prévision des Ventes :** Projette l'atteinte de l'objectif mensuel.\n` +
              `3. **Jours de Couverture des Stocks (DOC) :** Anticipe les ruptures usine de manière proactive.\n` +
              `4. **Clustering Spatial de Tournées :** Regroupe les points GPS pour minimiser les kilomètres.`,
            sources: ["Prospection & Pipeline", "Stocks & Disponibilités", "ZURI AI Assistant"],
            suggestions: [
              "Comment modifier un prospect dans le pipeline ?",
              "Comment ajouter un client avec coordonnées GPS ?",
              "Comment fonctionne la politique de remise ?",
            ],
          };
    }

    // Pipeline / Prospection
    if (
      q.includes("pipeline") ||
      q.includes("prospect") ||
      q.includes("lead") ||
      q.includes("kanban") ||
      q.includes("funnel")
    ) {
      const sec = ZURI_APP_KNOWLEDGE_BASE.find((s) => s.id === "pipeline")!;
      return isEn
        ? {
            reply: `📋 **Step-by-Step Guide — ${sec.titleEn} (${sec.page}):**\n\n` +
              `• **What it is:** ${sec.summaryEn}\n\n` +
              `• **How to use it:**\n` +
              sec.howToUseEn.map((step, idx) => `  ${idx + 1}. ${step}`).join("\n") +
              `\n\n• **Detailed Inspection & Editing:** Click any card to inspect full details, update potential and requirements, or delete the lead.\n\n` +
              `• **Algorithms & Data Insights:** ${sec.algorithmsAndLearningEn}`,
            sources: [sec.page],
            suggestions: [
              "What happens when a lead is marked as 'Gagné'?",
              "How is the lead conversion score calculated?",
              "Explain the Client CRM module",
            ],
          }
        : {
            reply: `📋 **Guide Étape par Étape — ${sec.titleFr} (${sec.page}) :**\n\n` +
              `• **Qu'est-ce que c'est ?** ${sec.summaryFr}\n\n` +
              `• **Comment l'utiliser concrètement :**\n` +
              sec.howToUseFr.map((step, idx) => `  ${idx + 1}. ${step}`).join("\n") +
              `\n\n• **Détails, Modification et Description :** Vous pouvez cliquer directement sur n'importe quelle carte prospect pour ouvrir sa fiche détaillée, modifier ses informations ou ses besoins en produits, ou le supprimer.\n\n` +
              `• **Apprentissage & Algorithme :** ${sec.algorithmsAndLearningFr}`,
            sources: [sec.page],
            suggestions: [
              "Que se passe-t-il quand un prospect passe à 'Gagné' ?",
              "Comment fonctionne le calcul du score de lead ?",
              "Explique-moi la page CRM Clients",
            ],
          };
    }

    // Clients / CRM / GPS
    if (
      q.includes("client") ||
      q.includes("crm") ||
      q.includes("gps") ||
      q.includes("carte") ||
      q.includes("map") ||
      q.includes("navigation")
    ) {
      const sec = ZURI_APP_KNOWLEDGE_BASE.find((s) => s.id === "clients")!;
      return isEn
        ? {
            reply: `👥 **Step-by-Step Guide — ${sec.titleEn} (${sec.page}):**\n\n` +
              `• **Overview:** ${sec.summaryEn}\n\n` +
              `• **Usage Steps:**\n` +
              sec.howToUseEn.map((step) => `  - ${step}`).join("\n") +
              `\n\n• **Data Analytics:** ${sec.dataAnalysisInsightsEn.join(" | ")}\n\n` +
              `• **Applied Algorithms:** ${sec.algorithmsAndLearningEn}`,
            sources: [sec.page],
            suggestions: [
              "How to launch GPS turn-by-turn navigation?",
              "How to create orders with discount limits?",
              "Explain the global time filter",
            ],
          }
        : {
            reply: `👥 **Guide Étape par Étape — ${sec.titleFr} (${sec.page}) :**\n\n` +
              `• **Fonctionnalités :** ${sec.summaryFr}\n\n` +
              `• **Utilisation :**\n` +
              sec.howToUseFr.map((step) => `  - ${step}`).join("\n") +
              `\n\n• **Analyse des données :** ${sec.dataAnalysisInsightsFr.join(" | ")}\n\n` +
              `• **Algorithme d'optimisation :** ${sec.algorithmsAndLearningFr}`,
            sources: [sec.page],
            suggestions: [
              "Comment lancer la navigation GPS vers un client ?",
              "Comment créer une commande ?",
              "Explique-moi le filtre temporel",
            ],
          };
    }

    // Recherche par correspondance générique
    const match = ZURI_APP_KNOWLEDGE_BASE.find((sec) =>
      sec.keywords.some((k) => q.includes(k))
    );

    if (match) {
      return isEn
        ? {
            reply: `💡 **Detailed Module Guide: ${match.titleEn} (${match.page})**\n\n` +
              `${match.summaryEn}\n\n` +
              `**Operational Steps:**\n` +
              match.howToUseEn.map((h, i) => `${i + 1}. ${h}`).join("\n") +
              `\n\n**Algorithms & Analytics:**\n${match.algorithmsAndLearningEn}`,
            sources: [match.page],
            suggestions: [
              "How to analyze KPIs on this page?",
              "Explain the complete application architecture",
              "How does the precision time filter work?",
            ],
          }
        : {
            reply: `💡 **Explication détaillée : ${match.titleFr} (${match.page})**\n\n` +
              `${match.summaryFr}\n\n` +
              `**Étapes d'utilisation :**\n` +
              match.howToUseFr.map((h, i) => `${i + 1}. ${h}`).join("\n") +
              `\n\n**Analyses & Algorithmes associés :**\n${match.algorithmsAndLearningFr}`,
            sources: [match.page],
            suggestions: [
              "Comment analyser les indicateurs de cette page ?",
              "Explique-moi l'ensemble du système",
              "Comment fonctionne le filtre temporel ?",
            ],
          };
    }

    // Réponse générale système
    return isEn
      ? {
          reply: `ℹ️ **ZURI Sales OS System Overview:**\n\n` +
            `ZURI Sales OS is an industrial commercial management ecosystem engineered for Zahara Industries SPRL (Burundi).\n\n` +
            `**Key Operational Modules:**\n` +
            `1. 📊 **Executive Dashboard:** Real-time revenue, targets (35M BIF), and delivery alerts.\n` +
            `2. 👥 **Client CRM:** 10+ geolocated accounts with RFM segmentation and turn-by-turn navigation.\n` +
            `3. 🎯 **Prospecting & Pipeline:** Full CRUD lead lifecycle with detail modal, editing, and conversion.\n` +
            `4. 📦 **ZURI Catalog:** Injection-molded SKUs (Ghajini, Tusker, Titanic) with cost & profit margins.\n` +
            `5. 🛒 **Orders & Sales:** Strict approval workflows for commercial discounts.\n` +
            `6. 🏭 **Inventory & Stockouts:** Automated Days of Cover (DOC) reordering alerts.\n` +
            `7. 📍 **Field Sales & GPS:** Scheduled rep routes with verified on-site check-in.\n` +
            `8. ⏱️ **Precision Time Filter:** Slices all metrics across minutes, hours, 24h, days, months, and years.`,
          sources: ["ZURI Sales OS Knowledge Base"],
          suggestions: [
            "How to use Prospecting & Pipeline?",
            "Explain inventory calculations & stockouts",
            "What algorithms power the platform?",
          ],
        }
      : {
          reply: `ℹ️ **Vue d'ensemble de ZURI Sales OS :**\n\n` +
            `ZURI Sales OS est un système complet de gestion commerciale industrielle conçu pour Zahara Industries SPRL (Burundi).\n\n` +
            `**Les 10 modules principaux intégrés :**\n` +
            `1. 📊 **Tableau de bord :** Suivi du CA mensuel, atteinte des objectifs et tendances.\n` +
            `2. 👥 **CRM Clients :** Répertoire des clients géolocalisés avec code couleur et navigation GPS.\n` +
            `3. 🎯 **Prospection & Pipeline :** Suivi des leads en colonnes Kanban, modification/suppression et conversion automatique.\n` +
            `4. 📦 **Catalogue ZURI :** Produits Ghajini, Tusker, Titanic avec calculs des marges.\n` +
            `5. 🛒 **Ventes & Commandes :** Devis, bons de commande et circuit de validation des remises.\n` +
            `6. 🏭 **Stocks & Disponibilités :** Contrôle des ruptures et calcul de réassort automatique.\n` +
            `7. 📍 **Terrain & GPS :** Planification des tournées et pointage GPS en temps réel.\n` +
            `8. ⏱️ **Filtre Temporel Précis :** Filtrage instantané à la minute, à l'heure, 24h, jours, mois ou années.`,
          sources: ["Documentation ZURI Sales OS"],
          suggestions: [
            "Comment utiliser la page Prospection & Pipeline ?",
            "Explique-moi le calcul des stocks",
            "Quels sont les algorithmes utilisés dans le système ?",
          ],
        };
  };

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg: Message = {
      id: "u_" + Date.now(),
      sender: "user",
      text: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const res = processQuery(q);
      const botMsg: Message = {
        id: "b_" + Date.now(),
        sender: "bot",
        text: res.reply,
        sources: res.sources,
        suggestions: res.suggestions,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 200);
  };

  return (
    <>
      {/* BOUTON FLOTTANT DU CHAT BOT */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isEn ? "Open AI Guide & Analyst" : "Ouvrir le Guide et Chatbot IA"}
        className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-sidebar-primary to-amber-500 text-sidebar-primary-foreground shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 md:bottom-6 md:right-6"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <BrainCircuit className="h-7 w-7 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
          </div>
        )}
      </button>

      {/* FENÊTRE DE CHAT / GUIDE INTERACTIF */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 flex flex-col rounded-2xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl transition-all duration-300",
            isExpanded
              ? "inset-4 md:inset-10"
              : "bottom-24 right-4 h-[580px] w-[95vw] max-w-[440px] md:bottom-24 md:right-6"
          )}
        >
          {/* En-tête */}
          <div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 text-sidebar-foreground rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-bold leading-none">
                  {isEn ? "ZURI AI Guide & Analyst" : "ZURI Guide & Assistant IA"}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-sidebar-foreground/70">
                  <Database className="h-3 w-3 text-emerald-400" />
                  {isEn ? "Embedded System Knowledge Base" : "Base de connaissances système intégrée"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="rounded p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                title={isExpanded ? (isEn ? "Minimize" : "Réduire") : isEn ? "Maximize" : "Agrandir"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                title={isEn ? "Close" : "Fermer"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Corps de la conversation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col gap-1.5",
                  m.sender === "user" ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted text-card-foreground rounded-tl-none border border-border/40"
                  )}
                >
                  {m.text}
                </div>

                {m.sources && m.sources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground px-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{isEn ? "Referenced modules:" : "Pages référencées :"}</span>
                    {m.sources.map((s, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-muted px-1.5 py-0.5 font-medium text-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1 px-1">
                    {m.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(sug)}
                        className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] text-primary hover:bg-primary/10 transition-colors"
                      >
                        <span>{sug}</span>
                        <ArrowRight className="h-2.5 w-2.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Champ d'entrée */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-border bg-card p-3 rounded-b-2xl"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isEn
                  ? "Ask anything about how to use the app or analyze data..."
                  : "Posez une question sur le fonctionnement du site ou l'analyse des données..."
              }
              className="flex-1 text-xs"
            />
            <Button type="submit" size="sm" className="gap-1.5">
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isEn ? "Send" : "Envoyer"}</span>
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
