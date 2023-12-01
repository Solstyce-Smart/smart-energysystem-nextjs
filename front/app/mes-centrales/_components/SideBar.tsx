"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowBigRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const SideBar = () => {
  const { user } = useUser();
  const [centrales, setCentrales] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          console.log("Attente des données de l'utilisateur...");
          return;
        }

        const userRes = await fetch(
          "https://vps.smart-energysystem.fr:3001/users",
          {
            method: "GET",
            headers: {
              Origin: "https://smart-energysystem.fr",
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );

        if (!userRes.ok) {
          console.log(
            "Erreur lors de la récupération des données de l'utilisateur"
          );
          return;
        }

        const utilisateurs = await userRes.json();

        const activeUser = utilisateurs.find(
          (bddUser: any) => bddUser.clerkId === user.id
        );

        if (activeUser) {
          const installationsRes = await fetch(
            `https://vps.smart-energysystem.fr:3001/${activeUser.userId}/installations`,
            {
              method: "GET",
              headers: {
                Origin: "https://smart-energysystem.fr",
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
              },
            }
          );

          if (!installationsRes.ok) {
            console.log(
              "Erreur lors de la récupération des données des installations"
            );
            return;
          }

          const centrales = await installationsRes.json();

          setCentrales(centrales);
        }
      } catch (error) {
        console.error("Erreur générale :", error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <Sheet>
      <SheetTrigger>
        <div className="flex w-5 h-full min-h-[90vh] items-center justify-center bg-white border-r-2 border-primary/30">
          <ArrowBigRight className="absolute ml-4 text-primary w-8 h-8 bg-white rounded-sm" />
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="w-[200px]">
        <SheetHeader>
          <SheetTitle>Liste des centrales</SheetTitle>
          <SheetDescription>
            {centrales.map((centrale: any) => (
              <Link href={`/centrale/${centrale.id}`} key={centrale.name}>
                {centrale.name}
              </Link>
            ))}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SideBar;
