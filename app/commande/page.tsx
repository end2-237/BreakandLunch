import type { Metadata } from "next";
import OrderStatusView from "@/components/OrderStatusView";

export const metadata: Metadata = {
  title: "Suivi de commande",
  description: "Suivez la préparation et la livraison de votre commande.",
};

export default function CommandePage() {
  return <OrderStatusView />;
}
