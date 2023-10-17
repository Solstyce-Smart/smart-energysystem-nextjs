"use client";

import React, { useState, useEffect } from "react";
import AreaChart from "./_components/AreaChart";
import BarChart from "./_components/BarChart";
import BarChartMonth from "./_components/BarChartMonth";
import { Button } from "@/components/ui/button";
import ActivityChart from "./_components/ActivityChart";

const Installation = () => {
  const [graph, setGraph] = useState("area");
  const [dataProd, setDataProd] = useState([]);
  const [dataConso, setDataConso] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    fetch("http://164.132.50.131:3001/elastic/dataindex/1425275/PV1_P", {
      method: "GET",
      headers: {
        Origin: "http://localhost:3000",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log("Erreur");
          throw new Error("HTTP error " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        setDataProd(data);
        setIsLoading(false);
        console.log("Mis a jour");
      })
      .catch((err) => console.log(err));
    fetch("http://164.132.50.131:3001/elastic/dataindex/1425275/METER1_P", {
      method: "GET",
      headers: {
        Origin: "http://localhost:3000",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log("Erreur");
          throw new Error("HTTP error " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        setDataConso(data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData(); // Appeler initialement les données

    // Mettre à jour les données toutes les 5 minutes (300 000 millisecondes)
    const interval = setInterval(fetchData, 60000);

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(interval);
  }, []);

  if (!isLoading) {
    return (
      <main className="w-full h-full min-h-[90vh] bg-primary">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-primary p-2 md:p-10 ">
          {graph === "area" ? (
            <div className="flex flex-col items-center justify-center relative">
              <AreaChart dataProd={dataProd} dataConso={dataConso} />
              <div className="flex gap-4 mt-4 max-w-full items-center justify-center md:pt-0 absolute bottom-[-3em]">
                <Button
                  className="w-[100px] h-10 "
                  variant="primary"
                  onClick={() => {
                    setGraph("bar");
                  }}
                >
                  Mensuel
                </Button>
                <Button
                  className="w-[100px] h-10 "
                  variant="primary"
                  onClick={() => {
                    setGraph("barMonth");
                  }}
                >
                  Annuel
                </Button>
              </div>
            </div>
          ) : graph === "bar" ? (
            <div className="flex flex-col items-center justify-center relative">
              <BarChart />
              <div className="flex gap-4 mt-4 max-w-full items-center justify-center md:pt-0 absolute bottom-[-3em]">
                <Button
                  className="w-[100px] h-10 "
                  variant="primary"
                  onClick={() => {
                    setGraph("area");
                  }}
                >
                  Journalier
                </Button>
                <Button
                  className="w-[100px] h-10 "
                  variant="primary"
                  onClick={() => {
                    setGraph("barMonth");
                  }}
                >
                  Annuel
                </Button>
              </div>
            </div>
          ) : graph === "barMonth" ? (
            <div className="flex flex-col items-center justify-center relative">
              <BarChartMonth />
              <div className="flex gap-4 mt-4 max-w-full items-center justify-center md:pt-0 absolute bottom-[-3em]">
                <Button
                  className="w-[100px] h-10 "
                  variant="primary"
                  onClick={() => {
                    setGraph("area");
                  }}
                >
                  Journalier
                </Button>
                <Button
                  className="w-[100px] h-10 "
                  variant="primary"
                  onClick={() => {
                    setGraph("bar");
                  }}
                >
                  Mensuel
                </Button>
              </div>
            </div>
          ) : null}
          <div id="activityContainer">
            <ActivityChart dataProd={dataProd} dataConso={dataConso} />
          </div>
        </div>
      </main>
    );
  } else {
    return "hm";
  }
};

export default Installation;
