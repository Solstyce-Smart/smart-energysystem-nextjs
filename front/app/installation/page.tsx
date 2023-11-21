"use client";

import React, { useState, useEffect } from "react";
import AreaChart from "./_components/AreaChart";
import BarChart from "./_components/BarChart";
import BarChartMonth from "./_components/BarChartMonth";
import { Button } from "@/components/ui/button";
import ActivityChart from "./_components/ActivityChart";
import Bubbles from "./_components/Bubbles";
import Loader from "@/components/Loader";
import { format, addMinutes, setSeconds, startOfMinute } from "date-fns";

const Installation = () => {
  const [graph, setGraph] = useState("area");
  const [installation, setInstallation] = useState<any>();
  const [dataProd, setDataProd] = useState([]);
  const [PVPBAT, setPVPBAT] = useState([]);
  const [BATPCONSO, setBATPCONSO] = useState([]);
  const [dataIrve, setDataIrve] = useState([]);
  const [dataConso, setDataConso] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSmarted, setIsSmarted] = useState(false);

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
    await fetchData(
      "https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/BTM_P",
      setDataConso
    );
    await fetchData(
      "https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/IRVE_P_SUM",
      setDataIrve
    );
    await fetchData(
      "https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/PV_P_SUM",
      setDataProd
    );
    await fetchData(
      "https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/PV_P_BAT",
      setPVPBAT
    );
    await fetchData(
      "https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/BAT_P_CONSO",
      setBATPCONSO
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
      <main className="relative w-full h-full min-h-[90vh] bg-primary gap-6">
        <label className="absolute top-0 right-0 inline-flex items-center cursor-pointer mt-1.5 mr-2">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={isSmarted}
            onClick={() => setIsSmarted(!isSmarted)}
            readOnly
          />
          <div className="w-10 h-5 bg-white ring-2 ring-white peer-focus:outline-none peer-checked:ring-2 peer-checked:ring-white peer-focus:ring-2 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-[115%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[-3px] after:bg-white after:border-primary after:border-4 after:rounded-full after:ring-1 after:ring-white after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:bg-primary peer-checked:after:border-2"></div>
          <span className="mx-3 font-medium text-white text-xl">
            {isSmarted ? "SMART ON" : "SMART OFF"}
          </span>
        </label>
        <div className="flex flex-wrap bg-primary p-2 lg:p-10 gap-y-10 ">
          <div className="flex flex-col items-center justify-start relative w-full lg:w-1/2 pt-10 lg:pt-0 lg:max-h-full ">
            {graph === "area" && (
              <>
                <AreaChart
                  dataProd={dataProd}
                  dataConso={dataConso}
                  dataIrve={dataIrve}
                  PVPBAT={PVPBAT}
                  BATPCONSO={BATPCONSO}
                />
                <div className="flex gap-4 my-4 max-w-full items-center justify-center lg:pt-0">
                  <Button
                    className="w-[100px] h-10"
                    variant="primary"
                    onClick={() => {
                      setGraph("bar");
                    }}
                  >
                    Mensuel
                  </Button>
                  <Button
                    className="w-[100px] h-10"
                    variant="primary"
                    onClick={() => {
                      setGraph("barMonth");
                    }}
                  >
                    Annuel
                  </Button>
                </div>
              </>
            )}
            {graph === "bar" && (
              <>
                <BarChart
                  dataProd={dataProd}
                  dataConso={dataConso}
                  dataIrve={dataIrve}
                />
                <div className="flex gap-4 my-4 max-w-full items-center justify-center lg:pt-0">
                  <Button
                    className="w-[100px] h-10"
                    variant="primary"
                    onClick={() => {
                      setGraph("area");
                    }}
                  >
                    Journalier
                  </Button>
                  <Button
                    className="w-[100px] h-10"
                    variant="primary"
                    onClick={() => {
                      setGraph("barMonth");
                    }}
                  >
                    Annuel
                  </Button>
                </div>
              </>
            )}
            {graph === "barMonth" && (
              <>
                <BarChartMonth dataProd={dataProd} dataConso={dataConso} />
                <div className="flex gap-4 my-4 max-w-full items-center justify-center lg:pt-0">
                  <Button
                    className="w-[100px] h-10"
                    variant="primary"
                    onClick={() => {
                      setGraph("area");
                    }}
                  >
                    Journalier
                  </Button>
                  <Button
                    className="w-[100px] h-10"
                    variant="primary"
                    onClick={() => {
                      setGraph("bar");
                    }}
                  >
                    Mensuel
                  </Button>
                </div>
              </>
            )}
          </div>
          {/* <div
            id="activityContainer"
            className="flex w-full lg:w-1/2 flex-col items-center justify-center"
          >
            <ActivityChart dataProd={dataProd} dataConso={dataConso} />
          </div> */}
          <div className="flex w-full lg:w-1/2 items-center justify-center">
            <Bubbles installation={installation} />
          </div>
          <div className="flex w-full lg:w-1/2"></div>
        </div>
      </main>
    );
  } else {
    return <Loader />;
  }
};

export default Installation;
