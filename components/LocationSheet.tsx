"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useDeliveryLocation, type DeliverySpot } from "./DeliveryLocation";
import { useCatalog } from "./CatalogProvider";
import { distanceKm, type Place } from "@/lib/geo";
import Portal from "./Portal";
import { CheckIcon, CloseIcon, FriendsIcon, PinIcon, SearchIcon } from "./icons";
import { useI18n } from "./I18nProvider";

// Leaflet touche au DOM : il ne doit pas être rendu côté serveur.
const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => <div className="h-[220px] w-full animate-pulse rounded-[12px] bg-tile" />,
});

export default function LocationSheet({ onClose }: { onClose: () => void }) {
  const { spot, office, save } = useDeliveryLocation();
  const { merchant } = useCatalog();
  const { t } = useI18n();

  const [draft, setDraft] = useState<DeliverySpot>(spot);
  const [query, setQuery] = useState(spot.label);
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const typed = useRef(false);
  // Quand c'est NOUS qui remplissons le champ (choix d'une suggestion, bureau
  // rappelé, position partagée), il ne faut pas relancer une recherche : la
  // liste se rouvrirait par-dessus les boutons pour proposer ce qui est déjà
  // choisi.
  const silent = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Recherche au fil de la frappe, temporisée : OpenStreetMap n'a pas à recevoir
  // une requête par caractère.
  useEffect(() => {
    if (silent.current) {
      silent.current = false;
      return;
    }
    if (!typed.current || query.trim().length < 3) {
      setResults([]);
      return;
    }
    const id = window.setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/geo/search?q=${encodeURIComponent(query)}`);
        const body = await res.json();
        setResults(Array.isArray(body.places) ? body.places : []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => window.clearTimeout(id);
  }, [query]);

  const point = draft.lat != null && draft.lng != null ? { lat: draft.lat, lng: draft.lng } : null;
  const shop =
    merchant.lat != null && merchant.lng != null ? { lat: merchant.lat, lng: merchant.lng } : null;

  const distance = useMemo(() => {
    if (!point || !shop) return null;
    const km = distanceKm(shop, point);
    // Au-delà de 120 km, ce n'est plus une livraison à Douala : la position de
    // la boutique est mal renseignée dans Camille (souvent lat/lng inversées).
    // Afficher « à 66 km de notre cuisine » ferait fuir le client.
    return km > 120 ? null : km;
  }, [point, shop]);

  function choose(place: Place) {
    silent.current = true;
    setDraft((d) => ({ ...d, label: place.label, context: place.context, lat: place.lat, lng: place.lng }));
    setQuery(place.label);
    setResults([]);
    setMessage(null);
  }

  async function reverse(lat: number, lng: number) {
    setDraft((d) => ({ ...d, lat, lng }));
    try {
      const res = await fetch(`/api/geo/reverse?lat=${lat}&lng=${lng}`);
      const body = await res.json();
      if (body.place) {
        silent.current = true;
        setDraft((d) => ({ ...d, label: body.place.label, context: body.place.context, lat, lng }));
        setQuery(body.place.label);
        setResults([]);
      }
    } catch {
      /* le point suffit au livreur, le libellé viendra du marchand */
    }
  }

  /**
   * « Je suis au bureau » : c'est le cas courant chez B&L. Le lieu est marqué
   * comme bureau — et si un bureau a déjà été décrit, il revient tel quel,
   * étage et bloc compris, plutôt que de tout redemander.
   */
  function useOffice() {
    setMessage(null);
    if (office) {
      silent.current = true;
      setDraft({ ...office, kind: "bureau" });
      setQuery(office.label);
      setResults([]);
      return;
    }
    setDraft((d) => ({ ...d, kind: "bureau" }));
  }

  function locate() {
    if (!navigator.geolocation) {
      setMessage(t.location.noGeo);
      return;
    }
    setLocating(true);
    setMessage(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await reverse(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setMessage(err.code === err.PERMISSION_DENIED ? t.location.denied : t.location.unavailable);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  const usable = Boolean(draft.label.trim() || (draft.lat != null && draft.lng != null));

  return (
    <Portal>
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={t.common.close}
        onClick={onClose}
        className="absolute inset-0 animate-fade bg-ink/45"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.location.title}
        className="animate-fade-up relative flex max-h-[92vh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-[22px] bg-white sm:rounded-[22px]"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[17px] font-bold tracking-[-0.01em]">{t.location.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-tile"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-5">
          <div className="relative">
            <div className="flex h-12 items-center gap-3 rounded-[10px] border border-line px-4 focus-within:border-ink/30">
              <SearchIcon className="h-[18px] w-[18px] shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => {
                  typed.current = true;
                  setQuery(e.target.value);
                  setDraft((d) => ({ ...d, label: e.target.value }));
                }}
                placeholder={t.location.searchPlaceholder}
                aria-label={t.location.searchLabel}
                className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
              />
              {searching && <span className="text-[12px] text-muted">…</span>}
            </div>

            {results.length > 0 && (
              <ul className="animate-fade absolute inset-x-0 top-[calc(100%+6px)] z-10 max-h-[240px] overflow-y-auto rounded-[12px] border border-line bg-white p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
                {results.map((place, i) => (
                  <li key={`${place.lat}-${place.lng}-${i}`}>
                    <button
                      type="button"
                      onClick={() => choose(place)}
                      className="flex w-full items-start gap-2.5 rounded-[9px] px-3 py-2.5 text-left transition hover:bg-tile"
                    >
                      <PinIcon className="mt-[2px] h-4 w-4 shrink-0 text-muted" />
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-medium">{place.label}</span>
                        {place.context && (
                          <span className="block truncate text-[12px] text-muted">{place.context}</span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={locate}
              disabled={locating}
              className="flex h-11 items-center justify-center gap-2 rounded-[10px] border border-line px-3 text-[13.5px] font-semibold transition hover:bg-tile disabled:opacity-60"
            >
              <PinIcon className="h-[18px] w-[18px] shrink-0" />
              {locating ? t.location.locating : t.location.useMyPosition}
            </button>

            <button
              type="button"
              onClick={useOffice}
              aria-pressed={draft.kind === "bureau"}
              className={`flex h-11 items-center justify-center gap-2 rounded-[10px] border px-3 text-[13.5px] font-semibold transition ${
                draft.kind === "bureau"
                  ? "border-ink bg-ink text-white"
                  : "border-line hover:bg-tile"
              }`}
            >
              <FriendsIcon className="h-[18px] w-[18px] shrink-0" />
              {t.location.atOffice}
              {draft.kind === "bureau" && <CheckIcon className="h-4 w-4 shrink-0" />}
            </button>
          </div>

          {draft.kind === "bureau" && !office && (
            <p className="mt-2 text-[12.5px] leading-snug text-muted">
              {t.location.officeHint}
            </p>
          )}

          {message && <p className="mt-2 text-[12.5px] leading-snug text-muted">{message}</p>}

          <div className="mt-4">
            <DeliveryMap
              point={point}
              merchant={shop}
              onPick={(p) => reverse(p.lat, p.lng)}
              height={220}
            />
            <p className="mt-2 text-[12px] leading-snug text-muted">
              {t.location.mapHint}
              {distance != null && (
                <>
                  {" "}
                  <span className="font-medium text-ink">
                    {t.location.distance(distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`)}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Ce que la carte ne saura jamais : c'est la personne qui le sait. */}
          <div className="mt-5 grid grid-cols-3 gap-4">
            {(
              [
                [t.location.block, "block"],
                [t.location.floor, "floor"],
                [t.location.office_field, "office"],
              ] as const
            ).map(([label, key]) => (
              <label key={key} className="block">
                <span className="text-[12px] text-muted">{label}</span>
                <input
                  value={draft[key]}
                  onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                  placeholder="—"
                  className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
                />
              </label>
            ))}
          </div>

          <label className="mt-4 block">
            <span className="text-[12px] text-muted">{t.location.landmark}</span>
            <input
              value={draft.landmark}
              onChange={(e) => setDraft((d) => ({ ...d, landmark: e.target.value }))}
              placeholder={t.location.landmarkPlaceholder}
              className="mt-1 h-9 w-full border-b border-line bg-transparent text-[14px] font-medium outline-none transition focus:border-ink"
            />
          </label>
        </div>

        <div className="flex items-center gap-3 border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-[10px] px-4 text-[14px] font-medium text-ink-soft transition hover:bg-tile"
          >
            {t.common.cancel}
          </button>
          <button
            type="button"
            disabled={!usable}
            onClick={() => {
              save(draft);
              onClose();
            }}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[10px] bg-ink text-[14px] font-semibold text-white transition hover:bg-ink/85 disabled:opacity-50"
          >
            <CheckIcon className="h-4 w-4" />
            {t.location.save}
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}
