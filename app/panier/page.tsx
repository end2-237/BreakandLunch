import type { Metadata } from "next";
import CheckoutView from "@/components/CheckoutView";

export const metadata: Metadata = {
  title: "Informations de commande",
  description: "Adresse de livraison, heure souhaitée et paiement de votre commande.",
};

export default function PanierPage() {
  return <CheckoutView />;
}
