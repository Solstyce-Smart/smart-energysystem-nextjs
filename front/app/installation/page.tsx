"use client";

import React, { useState, useEffect } from "react";
import AreaChart from "./_components/AreaChart";
import BarChart from "./_components/BarChart";
import BarChartMonth from "./_components/BarChartMonth";
import { Button } from "@/components/ui/button";
import ActivityChart from "./_components/ActivityChart";
import { Switch } from "@/components/ui/switch";
import Bubbles from "./_components/Bubbles";
import Loader from "@/components/Loader";
import { Label } from "@/components/ui/label";
import Financial from "./_components/Financial";

type DataItem = {
  ewonId: string;
  dateReq: string;
  tagName: string;
  value: number;
  quality: string;
}[];
const Installation = () => {
  const [plage, setPlage] = useState("journalier");
  const [installation, setInstallation] = useState<any>();
  const [PVPSUM, setPVPSUM] = useState([]);
  const [PVPBAT, setPVPBAT] = useState([]);
  const [PVPCONSO, setPVPCONSO] = useState([]);
  const [PVPRESEAU, setPVPRESEAU] = useState([]);
  const [BATPCONSO, setBATPCONSO] = useState([]);
  const [RESEAUPCONSO, setRESEAUPCONSO] = useState([]);
  const [IRVEPSUM, setIRVEPSUM] = useState([]);
  const [BTMP, setBTMP] = useState([]);
  const [CONSOP, setCONSOP] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSmarted, setIsSmarted] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const fetchData = async (
    url: string,
    setDataCallback: (data: any) => void
  ) => {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Origin: "https://smart-energysystem.fr",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.log("Erreur");
        throw new Error("HTTP error " + res.status);
      }

      const data = await res.json();
      setDataCallback(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataAndUpdateState = async () => {
    setDataReady(false);
    await fetchData(
      "https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/BTM_P",
      setBTMP
    );
    await fetchData(
      "https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/IRVE_P_SUM",
      setIRVEPSUM
    );
    await fetchData(
      "https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/PV_P_SUM",
      setPVPSUM
    );
    await fetchData(
      "https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/PV_P_BAT",
      setPVPBAT
    );
    await fetchData(
      "https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/BAT_P_CONSO",
      setBATPCONSO
    );
    await fetchData(
      "https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/CONSO_P",
      setCONSOP
    );
    await fetchData(
      "https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/PV_P_CONSO",
      setPVPCONSO
    );
    await fetchData(
      "https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/PV_P_RESEAU",
      setPVPRESEAU
    );
    await fetchData(
      "https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/RESEAU_P_CONSO",
      setRESEAUPCONSO
    );

    try {
      const res = await fetch(
        "https://vps.smart-energysystem.fr:3001/1/installations/1",
        {
          method: "GET",
          headers: {
            Origin: "https://smart-energysystem.fr",
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        console.log("Erreur");
        throw new Error("HTTP error " + res.status);
      }

      const installation = await res.json();
      const smartActiveTag = installation.tagsLive.find(
        (tag: any) => tag.tagName === "SMART_ACTIVE"
      );

      if (smartActiveTag) {
        setIsSmarted(smartActiveTag.value === 1);
      }

      setInstallation(installation);
      setIsLoading(false);
      console.log("Fetch data at", new Date());
    } catch (error) {
      console.log("Erreur lors du fetch des datas" + error);
    }
    setDataReady(true);
  };
  const scheduleNextFetch = (firstInstance = false) => {
    if (firstInstance) {
      const now = new Date();

      // Détermine le prochain bloc de 5 minutes à partir de l'heure actuelle
      const nextFiveMinuteBlock = Math.ceil(now.getMinutes() / 5) * 5;
      const nextScheduledTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        nextFiveMinuteBlock,
        30
      );

      // Calcule le temps jusqu'au prochain bloc de 5 minutes
      const timeUntilNextScheduledTime =
        nextScheduledTime.getTime() - now.getTime();

      // Planifie le premier fetch au lancement de la page
      fetchDataAndUpdateState();

      // Planifie le prochain fetch en fonction du prochain bloc de 5 minutes
      setTimeout(() => {
        fetchDataAndUpdateState();
        scheduleNextFetch(); // Planifie le prochain fetch
      }, timeUntilNextScheduledTime);
    } else {
      const interval = setInterval(() => {
        fetchDataAndUpdateState();
      }, 60000 * 5);
      return () => clearInterval(interval);
    }
  };

  useEffect(() => {
    scheduleNextFetch(true);
  }, []);

  if (!isLoading) {
    return (
      <main className="relative w-full h-full min-h-[90vh] gap-6">
        <div className="absolute top-0 right-0 flex items-center cursor-pointer mt-2 mr-2">
          <Switch id="smarted" checked={isSmarted} className="mr-2" />
          <Label htmlFor="smarted" className="text-primary text-xl">
            {isSmarted ? "SMART ON" : "SMART OFF"}
          </Label>
        </div>
        <div className="flex flex-wrap bg-gradient-to-br justify-center items-center lg:items-start from-white via-white via-85% to-secondary px-2 py-10 lg:p-10 gap-y-10 min-h-[90vh] h-full w-full ">
          <div className="flex flex-col min-h-[35vh] bg-slate-100/50 gap-4 h-full w-full items-center justify-center relative pt-10 lg:pt-0 lg:w-1/2">
            {plage === "journalier" && (
              <AreaChart
                PVPSUM={PVPSUM}
                BTMP={BTMP}
                IRVEPSUM={IRVEPSUM}
                PVPBAT={PVPBAT}
                BATPCONSO={BATPCONSO}
                title={plage}
              />
            )}
            {plage === "mensuel" && (
              <BarChart
                PVPSUM={PVPSUM}
                BTMP={BTMP}
                IRVEPSUM={IRVEPSUM}
                PVPBAT={PVPBAT}
                RESEAUPCONSO={RESEAUPCONSO}
                BATPCONSO={BATPCONSO}
                PVPCONSO={PVPCONSO}
                PVPRESEAU={PVPRESEAU}
                title={plage}
              />
            )}
            {plage === "annuel" && (
              <BarChartMonth
                PVPSUM={PVPSUM}
                BTMP={BTMP}
                IRVEPSUM={IRVEPSUM}
                PVPBAT={PVPBAT}
                RESEAUPCONSO={RESEAUPCONSO}
                BATPCONSO={BATPCONSO}
                PVPCONSO={PVPCONSO}
                PVPRESEAU={PVPRESEAU}
                title={plage}
              />
            )}
            <div className="flex w-full justify-center items-center gap-4">
              <Button
                variant={`${plage === "journalier" ? "outline" : "ghost"}`}
                onClick={() => setPlage("journalier")}
              >
                Journalier
              </Button>
              <Button
                variant={`${plage === "mensuel" ? "outline" : "ghost"}`}
                onClick={() => setPlage("mensuel")}
              >
                Mensuel
              </Button>
              <Button
                variant={`${plage === "annuel" ? "outline" : "ghost"}`}
                onClick={() => setPlage("annuel")}
              >
                Annuel
              </Button>
            </div>
            <div className="flex w-full h-full bg-slate-200/30 rounded-md md:px-8 md:py-4">
              <Financial
                pasDeTemps={plage}
                CONSOP={CONSOP}
                PVPRESEAU={PVPRESEAU}
                PVPCONSO={PVPCONSO}
                PVPBAT={PVPBAT}
                RESEAUPCONSO={RESEAUPCONSO}
                BTMP={BTMP}
                IRVEPSUM={IRVEPSUM}
                PVPSUM={PVPSUM}
                BATPCONSO={BATPCONSO}
              />
            </div>
          </div>
          {/* <div
            id="activityContainer"
            className="flex w-full lg:w-1/2 flex-col items-center justify-center"
          >
            <ActivityChart PVPSUM={PVPSUM} BTMP={BTMP} />
          </div> */}
          <div className="flex w-full lg:w-[50%] h-full min-h-[80vh] items-center justify-center">
            {dataReady ? <Bubbles installation={installation} /> : <Loader />}
          </div>
        </div>
      </main>
    );
  } else {
    return <Loader />;
  }
};

export default Installation;
