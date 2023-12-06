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
import Link from "next/link";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { CircleIcon } from "lucide-react";
import { useGoogleMapsScript } from "use-google-maps-script";
import { useUser } from "@clerk/nextjs";

interface Centrale {
  installationId: string;
  name: string;
  address: { latitude: string; longitude: string }[];
}

const MesCentrales: React.FC = () => {
  const { user } = useUser();
  const [centrales, setCentrales] = useState<Centrale[]>([]);
  const [tempCentrales, setTempCentrales] = useState<Centrale[]>([]);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [dataReady, setDataReady] = useState(false);
  const { isLoaded, loadError } = useGoogleMapsScript({
    googleMapsApiKey: "AIzaSyCR-uZ_JoitorYTckvODC2NCPJ3IS73llg" ?? "",
  });

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
          const currentUser = await fetch(
            `https://vps.smart-energysystem.fr:3001/users/${activeUser.userId}`,
            {
              method: "GET",
              headers: {
                Origin: "https://smart-energysystem.fr",
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
              },
            }
          );

          if (!currentUser.ok) {
            console.log(
              "Erreur lors de la récupération des données des installations"
            );
            return;
          }

          const userData = await currentUser.json();
          const newCentrales: Centrale[] = [];

          for (const installation of userData.installations) {
            const existingCentrale = centrales.find(
              (centrale) =>
                centrale.installationId === installation.installationId
            );

            if (!existingCentrale) {
              const response = await fetch(
                `https://vps.smart-energysystem.fr:3001/installations/${installation.installationId}`,
                {
                  method: "GET",
                  headers: {
                    Origin: "https://smart-energysystem.fr",
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                  },
                }
              );

              if (response.ok) {
                const centraleData: Centrale = await response.json();
                const existingCentrale = newCentrales.find(
                  (centrale) => centrale.name === centraleData.name
                );
                if (!existingCentrale) {
                  newCentrales.push(centraleData);
                } else {
                  console.log("Doublon");
                }
              } else {
                console.error(
                  "Erreur lors de la récupération des données de centrale"
                );
              }
            }
          }

          // Mettre à jour l'état temporaire au lieu de l'état principal
          setTempCentrales(newCentrales);

          if (newCentrales.length > 0) {
            setCenter({
              lat: parseFloat(newCentrales[0].address[0].latitude),
              lng: parseFloat(newCentrales[0].address[0].longitude),
            });
          }

          setDataReady(true);
        }
      } catch (error) {
        console.error("Erreur générale :", error);
      }
    };

    fetchData();
  }, [user]);

  // Nouvel effet pour mettre à jour l'état principal
  useEffect(() => {
    // Mettre à jour l'état principal avec les nouvelles centrales
    setCentrales([]);
    setCentrales((prevCentrales) => [...prevCentrales, ...tempCentrales]);
  }, [tempCentrales]);

  return (
    dataReady && (
      <div className="flex h-full min-h-[90vh] w-full min-w-[100vw]">
        <SideBar centrales={centrales} />
        <div className="flex flex-col w-full h-full min-h-[90vh] justify-between">
          <div className="flex w-full p-8">
            <Table className="h-1/2 w-full">
              <TableCaption>
                Une liste de vos différentes centrales.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom de la centrale</TableHead>
                  <TableHead>Taux d'autonomie</TableHead>
                  <TableHead>Économies réalisées</TableHead>
                  <TableHead className="text-right">
                    Statut de la centrale
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {centrales.map((centrale, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Link href={`/centrale/${centrale.installationId}`}>
                        {centrale.name}
                      </Link>
                    </TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell className="text-green-500">$250.00</TableCell>
                    <TableCell className="text-right flex justify-end gap-3">
                      En ligne{" "}
                      <CircleIcon width={20} height={20} fill="#10B981" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex w-full h-1/2 p-8 ">
            {isLoaded && (
              <GoogleMap
                zoom={18}
                center={center}
                mapContainerClassName="w-full h-[45vh] shadow-md shadow-black-500 rounded-md"
              >
                {centrales.map((centrale, i) => (
                  <Marker
                    key={i}
                    position={{
                      lat: parseFloat(centrale.address[0].latitude),
                      lng: parseFloat(centrale.address[0].longitude),
                    }}
                  />
                ))}
              </GoogleMap>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default MesCentrales;
