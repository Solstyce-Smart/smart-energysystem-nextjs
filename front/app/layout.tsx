import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SMART - EnergySystem",
  description: "Bienvenue sur le site de SMART - EnergySystem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={montserrat.className}>
        <div className="h-full">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
