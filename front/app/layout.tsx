import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";

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
    <ClerkProvider
      localization={frFR}
      appearance={{
        elements: {
          footer: "hidden",
        },
      }}
    >
      <html lang="fr">
        <body className={montserrat.className}>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
