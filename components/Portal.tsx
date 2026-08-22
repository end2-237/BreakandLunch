"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Sort un calque du flux de la page.
 *
 * Un élément `fixed` n'est pas positionné par rapport à la fenêtre dès qu'un
 * ancêtre porte un filtre, une transformation ou un `backdrop-filter` : il se
 * retrouve enfermé dans cet ancêtre. C'est ce qui coupait le menu mobile à la
 * hauteur de l'en-tête. Passer par le corps du document règle le problème une
 * fois pour toutes, quel que soit l'endroit d'où le calque est appelé.
 */
export default function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
