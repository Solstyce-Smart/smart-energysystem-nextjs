"use client";

import React, { useState, useEffect } from "react";
import AreaChart from "./_components/AreaChart";
import BarChart from "./_components/BarChart";
import BarChartMonth from "./_components/BarChartMonth";
import { Button } from "@/components/ui/button";
import ActivityChart from "./_components/ActivityChart";
import Bubbles from "./_components/Bubbles";

const Installation = () => {
  const [graph, setGraph] = useState("area");
  const [installation, setInstallation] = useState<any>();
  const [dataProd, setDataProd] = useState([]);
  const [dataConso, setDataConso] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSmarted, setIsSmarted] = useState(false);

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
    fetch("http://164.132.50.131:3001/1/installations/1", {
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
      .then((installation) => {
        const smartActiveTag = installation.tagsLive.find(
          (tag: any) => tag.tagName === "SMART_ACTIVE"
        );

        if (smartActiveTag) {
          setIsSmarted(smartActiveTag.value === 1);
        }
        setInstallation(installation);

        setIsLoading(false);
      })
      .catch((err) => console.log("Erreur lors du fetch des datas" + err));
  };

  useEffect(() => {
    fetchData(); // Appeler initialement les données

    const interval = setInterval(fetchData, 60000 * 5);
    return () => clearInterval(interval);
  }, []);

  if (!isLoading) {
    return (
      <main className="relative w-full h-full min-h-[90vh] bg-primary gap-6">
        <label className="absolute top-0 right-0 inline-flex items-center cursor-pointer mt-1.5 mr-2">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            defaultChecked={isSmarted}
            onClick={() => setIsSmarted(!isSmarted)}
          />
          <div className="w-10 h-5 bg-white ring-2 ring-white peer-focus:outline-none peer-checked:ring-2 peer-checked:ring-white peer-focus:ring-2 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-[115%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[-3px] after:bg-white after:border-primary after:border-4 after:rounded-full after:ring-1 after:ring-white after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:bg-primary peer-checked:after:border-2"></div>
          <span className="mx-3 font-medium text-white text-xl">
            {isSmarted ? "SMART ON" : "SMART OFF"}
          </span>
        </label>
        <div className="flex flex-wrap bg-primary p-2 md:p-10 ">
          <div className="flex flex-col items-center justify-center relative w-full md:w-1/2 pt-10 md:pt-0 md:max-h-full ">
            {graph === "area" && (
              <>
                <AreaChart dataProd={dataProd} dataConso={dataConso} />
                <div className="flex gap-4 my-4 max-w-full items-center justify-center md:pt-0">
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
                <BarChart dataProd={dataProd} dataConso={dataConso} />
                <div className="flex gap-4 my-4 max-w-full items-center justify-center md:pt-0">
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
                <div className="flex gap-4 my-4 max-w-full items-center justify-center md:pt-0">
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
          <div
            id="activityContainer"
            className="flex w-full md:w-1/2 flex-col items-center justify-center"
          >
            <ActivityChart dataProd={dataProd} dataConso={dataConso} />
          </div>
          {/* <div className="flex w-full md:w-1/2 items-center justify-center">
            <Bubbles installation={installation} />
          </div>
          <div className="flex w-full md:w-1/2"></div> */}
        </div>
      </main>
    );
  } else {
    return "hm";
  }
};

export default Installation;
