"use client";

import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation"; // Importez useNavigation depuis next/navigation

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
  const pathname = usePathname(); // Utilisez useNavigation pour obtenir la navigation

  return (
    <html lang="fr">
      <body className={montserrat.className}>
        {pathname === "/" ? null : <Navbar />}
        {children}
      </body>
    </html>
  );
}
