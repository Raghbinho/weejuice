import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CURRENT_LANG, isRTL } from "@/lib/i18n";

export const metadata = {
  title: "WeeJuice — Jus frais pressés à la commande",
  description:
    "Jus 100% naturels, frais et préparés à la commande. Commandez en ligne, payez à la livraison.",
};

export const viewport = {
  themeColor: "#22c55e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang={CURRENT_LANG} dir={isRTL() ? "rtl" : "ltr"}>
      <body>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
