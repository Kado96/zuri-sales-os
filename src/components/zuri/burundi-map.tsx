import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, MapPin, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_COLORS, type Client, type ClientCategory } from "@/lib/zuri-data";
import { useZuri } from "@/lib/zuri-store";

interface BurundiClientMapProps {
  clients?: Client[];
  height?: string;
  selectedClientId?: string;
  onSelectClient?: (c: Client) => void;
  showFilters?: boolean;
}

export function BurundiClientMap({
  clients: customClients,
  height = "480px",
  selectedClientId,
  onSelectClient,
  showFilters = true,
}: BurundiClientMapProps) {
  const { clients: allClients, navigateToClient, t, lang } = useZuri();
  const clients = customClients || allClients;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredClients = clients.filter((c) => {
    if (filterCategory === "all") return true;
    return c.category === filterCategory;
  });

  // Initialisation de la carte Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Coordonnées du Burundi : centré vers Gitega / Bujumbura (-3.38, 29.85)
    const map = L.map(mapContainerRef.current, {
      center: [-3.38, 29.75],
      zoom: 9,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Mise à jour des marqueurs selon les clients filtrés
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredClients.forEach((client) => {
      if (!client.lat || !client.lng) return;

      const catInfo = CATEGORY_COLORS[client.category] || CATEGORY_COLORS.Régulier;

      // Création d'une icône HTML personnalisée avec pastille de couleur
      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="
            background-color: ${catInfo.hex};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 11px;
            cursor: pointer;
          ">
            📍
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const marker = L.marker([client.lat, client.lng], { icon: customIcon });

      // Popup avec détails et bouton d'action vers l'itinéraire direct
      const popupContent = document.createElement("div");
      popupContent.className = "p-1 font-sans text-xs space-y-1.5";
      popupContent.innerHTML = `
        <div style="font-weight: bold; font-size: 13px; color: #1e293b;">${client.name}</div>
        <div style="color: #64748b;">${client.city} (${client.district})</div>
        <div style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: 600; color: white; background: ${catInfo.hex}; font-size: 10px;">
          ${lang === "fr" ? catInfo.labelFr : catInfo.labelEn}
        </div>
        <div style="color: #334155; margin-top: 4px;"><strong>Contact :</strong> ${client.contact} (${client.phone})</div>
        <div style="color: #334155;"><strong>CA :</strong> ${client.revenue.toLocaleString()} FBU</div>
      `;

      // Bouton S'y rendre dans le popup
      const btnNav = document.createElement("button");
      btnNav.className = "mt-2 w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded flex items-center justify-center gap-1 cursor-pointer";
      btnNav.innerHTML = `<span>🚀</span> <span>${t("goToClient")}</span>`;
      btnNav.onclick = (e) => {
        e.stopPropagation();
        navigateToClient(client.lat, client.lng, client.name);
      };
      popupContent.appendChild(btnNav);

      marker.bindPopup(popupContent);
      marker.on("click", () => {
        if (onSelectClient) onSelectClient(client);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [filteredClients, lang, t, navigateToClient, onSelectClient]);

  // Si un client particulier est sélectionné, centrer la carte sur lui
  useEffect(() => {
    if (selectedClientId && mapInstanceRef.current) {
      const c = clients.find((x) => x.id === selectedClientId);
      if (c && c.lat && c.lng) {
        mapInstanceRef.current.flyTo([c.lat, c.lng], 13, { duration: 1.2 });
      }
    }
  }, [selectedClientId, clients]);

  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-card p-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-sm">{t("mapTitle")}</h3>
            <p className="text-xs text-muted-foreground">
              {filteredClients.length} {t("clientsFound")}
            </p>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterCategory("all")}
              className={`rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${
                filterCategory === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {t("allCategories")} ({clients.length})
            </button>
            {(Object.keys(CATEGORY_COLORS) as ClientCategory[]).map((cat) => {
              const info = CATEGORY_COLORS[cat];
              const count = clients.filter((c) => c.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  style={{
                    backgroundColor: filterCategory === cat ? info.hex : undefined,
                    color: filterCategory === cat ? "#fff" : undefined,
                  }}
                  className={`rounded-full px-2 py-0.5 text-xs font-medium border flex items-center gap-1 transition-colors ${
                    filterCategory === cat ? "border-transparent" : "bg-card text-foreground"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: info.hex }} />
                  {lang === "fr" ? info.labelFr : info.labelEn} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Conteneur de la Carte Leaflet */}
      <div
        ref={mapContainerRef}
        style={{ height, width: "100%", borderRadius: "0.5rem" }}
        className="z-0 overflow-hidden"
      />
    </div>
  );
}
