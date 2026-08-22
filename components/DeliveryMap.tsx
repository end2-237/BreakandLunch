"use client";

import { useEffect, useRef } from "react";

type Point = { lat: number; lng: number };

/**
 * Une vraie carte OpenStreetMap, sans clé ni compte. Le repère du client se
 * déplace au clic ou au glisser : c'est ce qui permet d'indiquer une entrée
 * précise, là où une adresse écrite reste approximative à Douala.
 */
export default function DeliveryMap({
  point,
  merchant,
  onPick,
  className = "",
  height = 220,
  interactive = true,
}: {
  point: Point | null;
  merchant: Point | null;
  onPick?: (p: Point) => void;
  className?: string;
  /** Hauteur en pixels, posée en style : Leaflet exige une boîte mesurable. */
  height?: number;
  interactive?: boolean;
}) {
  const holder = useRef<HTMLDivElement>(null);
  // Refs plutôt qu'un état : Leaflet gère son propre DOM, le re-rendre le ferait
  // clignoter à chaque frappe dans le formulaire.
  const map = useRef<import("leaflet").Map | null>(null);
  const pin = useRef<import("leaflet").Marker | null>(null);
  const shop = useRef<import("leaflet").Marker | null>(null);
  const pick = useRef(onPick);
  pick.current = onPick;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !holder.current || map.current) return;

      const start = point ?? merchant ?? { lat: 4.0511, lng: 9.7679 };
      const instance = L.map(holder.current, {
        center: [start.lat, start.lng],
        zoom: point || merchant ? 15 : 12,
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(instance);

      // divIcon : pas d'images à charger, donc pas de dépendance à la config
      // des assets, et un repère aux couleurs du site.
      const icon = (color: string, ring: string) =>
        L.divIcon({
          className: "",
          html: `<span style="display:block;width:26px;height:26px;border-radius:999px;background:${color};border:3px solid ${ring};box-shadow:0 4px 12px rgba(0,0,0,.3)"></span>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

      if (merchant) {
        shop.current = L.marker([merchant.lat, merchant.lng], {
          icon: icon("#ffd400", "#131313"),
          title: "Notre cuisine",
        }).addTo(instance);
      }

      if (point) {
        pin.current = L.marker([point.lat, point.lng], {
          icon: icon("#131313", "#ffffff"),
          draggable: interactive,
          title: "Votre adresse",
        }).addTo(instance);
        if (interactive) {
          pin.current.on("dragend", () => {
            const p = pin.current!.getLatLng();
            pick.current?.({ lat: p.lat, lng: p.lng });
          });
        }
      }

      if (interactive) {
        instance.on("click", (event: import("leaflet").LeafletMouseEvent) => {
          pick.current?.({ lat: event.latlng.lat, lng: event.latlng.lng });
        });
      }

      map.current = instance;
      // Le conteneur grandit souvent après le montage (feuille qui s'ouvre) :
      // sans ce recalcul, la carte s'affiche en tuiles grises.
      window.setTimeout(() => instance.invalidateSize(), 120);
    })();

    return () => {
      cancelled = true;
    };
  }, [interactive, merchant, point]);

  // Déplacement du repère quand la position change ailleurs (recherche, GPS).
  useEffect(() => {
    (async () => {
      if (!map.current || !point) return;
      const L = (await import("leaflet")).default;
      if (pin.current) {
        pin.current.setLatLng([point.lat, point.lng]);
      } else {
        pin.current = L.marker([point.lat, point.lng], {
          icon: L.divIcon({
            className: "",
            html: `<span style="display:block;width:26px;height:26px;border-radius:999px;background:#131313;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.3)"></span>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          }),
          draggable: interactive,
        }).addTo(map.current);
        if (interactive) {
          pin.current.on("dragend", () => {
            const p = pin.current!.getLatLng();
            pick.current?.({ lat: p.lat, lng: p.lng });
          });
        }
      }
      map.current.setView([point.lat, point.lng], Math.max(map.current.getZoom(), 16));
    })();
  }, [point, interactive]);

  useEffect(() => {
    return () => {
      map.current?.remove();
      map.current = null;
      pin.current = null;
      shop.current = null;
    };
  }, []);

  return (
    <div
      ref={holder}
      role="application"
      aria-label="Carte · map"
      style={{ height }}
      className={`relative w-full overflow-hidden rounded-[12px] bg-tile ${className}`}
    />
  );
}
