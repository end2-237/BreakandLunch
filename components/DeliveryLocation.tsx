"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SpotKind = "" | "bureau" | "domicile";

export type DeliverySpot = {
  /** Nature du lieu. « bureau » est le cas courant : livraison en entreprise. */
  kind: SpotKind;
  /** Rue et quartier, tels que retournés par OpenStreetMap ou saisis à la main. */
  label: string;
  /** Ville, région. */
  context: string;
  lat: number | null;
  lng: number | null;
  /** Le complément que seule la personne connaît : le livreur en a besoin. */
  block: string;
  floor: string;
  office: string;
  landmark: string;
};

export const EMPTY_SPOT: DeliverySpot = {
  kind: "",
  label: "",
  context: "",
  lat: null,
  lng: null,
  block: "",
  floor: "",
  office: "",
  landmark: "",
};

type Value = {
  spot: DeliverySpot;
  /** Le dernier bureau enregistré : « je suis au bureau » le rappelle d'un geste. */
  office: DeliverySpot | null;
  /** Une adresse est utilisable dès qu'on sait où aller : un libellé ou un point. */
  isSet: boolean;
  save: (next: DeliverySpot) => void;
  clear: () => void;
  /** Ce qui part chez Camille et se lit sur le bon de commande. */
  fullAddress: string;
  details: string;
};

const Ctx = createContext<Value | null>(null);
const KEY = "blj-livraison";
const OFFICE_KEY = "blj-bureau";

export function DeliveryLocationProvider({ children }: { children: ReactNode }) {
  const [spot, setSpot] = useState<DeliverySpot>(EMPTY_SPOT);
  const [office, setOffice] = useState<DeliverySpot | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSpot({ ...EMPTY_SPOT, ...(JSON.parse(raw) as DeliverySpot) });
      const bureau = window.localStorage.getItem(OFFICE_KEY);
      if (bureau) setOffice({ ...EMPTY_SPOT, ...(JSON.parse(bureau) as DeliverySpot) });
    } catch {
      /* une adresse illisible ne doit pas casser la page */
    }
  }, []);

  const save = useCallback((next: DeliverySpot) => {
    setSpot(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
      // Le bureau est mémorisé à part : on livre presque toujours au même,
      // et le client ne devrait avoir à le décrire qu'une fois.
      if (next.kind === "bureau" && (next.label.trim() || next.lat != null)) {
        window.localStorage.setItem(OFFICE_KEY, JSON.stringify(next));
        setOffice(next);
      }
    } catch {
      /* navigation privée : l'adresse vaut alors pour la session */
    }
  }, []);

  const clear = useCallback(() => {
    setSpot(EMPTY_SPOT);
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* rien à nettoyer */
    }
  }, []);

  const value = useMemo<Value>(() => {
    const parts = [spot.label, spot.context].map((p) => p.trim()).filter(Boolean);
    const details = [
      spot.block && `Bloc ${spot.block}`,
      spot.floor && `Étage ${spot.floor}`,
      spot.office && `Bureau ${spot.office}`,
      spot.landmark,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      spot,
      office,
      isSet: Boolean(spot.label.trim() || (spot.lat != null && spot.lng != null)),
      save,
      clear,
      fullAddress: parts.join(" — "),
      details,
    };
  }, [spot, office, save, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDeliveryLocation() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDeliveryLocation doit être utilisé dans DeliveryLocationProvider");
  return ctx;
}
