"use client";

import React, { useEffect, useState } from "react";
import SideBar from "./_components/SideBar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@clerk/nextjs";

const MesCentrales = () => {
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

  console.log(centrales);

  return (
    <div className="flex">
      <SideBar centrales={centrales} />
      <Table>
        <TableCaption>Une liste de vos différentes centrales.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nom de la centrale</TableHead>
            <TableHead>Taux d'autonomie</TableHead>
            <TableHead>Économies réalisées</TableHead>
            <TableHead className="text-right">Statut de la centrale</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {centrales.map((centrale: any) => (
            <TableRow key={centrale.id}>
              <TableCell className="font-medium">{centrale.name}</TableCell>
              <TableCell>100%</TableCell>
              <TableCell className="text-green-500">$250.00</TableCell>
              <TableCell className="text-right">En ligne</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MesCentrales;
