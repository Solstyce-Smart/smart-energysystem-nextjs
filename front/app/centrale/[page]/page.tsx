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
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";

type DataItem = {
  ewonId: string;
  dateReq: string;
  tagName: string;
  value: number;
  quality: string;
}[];

type Installation = {
  abo: number;
  address: string | null;
  battery: boolean | null;
  ewonId: string;
  id: number;
  lastSynchroDate: string;
  name: string;
  nbIRVE: number;
  tarifAchat: number;
  tarifRevente: number;
  tagsLive: DataItem;
};
const Centrale = () => {
  const [plage, setPlage] = useState<string>("journalier");
  const [installation, setInstallation] = useState<Installation | undefined>();
  const [PVPSUM, setPVPSUM] = useState<DataItem>([]);
  const [PVPBAT, setPVPBAT] = useState<DataItem>([]);
  const [PVPCONSO, setPVPCONSO] = useState<DataItem>([]);
  const [PVPRESEAU, setPVPRESEAU] = useState<DataItem>([]);
  const [BATPCONSO, setBATPCONSO] = useState<DataItem>([]);
  const [RESEAUPCONSO, setRESEAUPCONSO] = useState<DataItem>([]);
  const [IRVEPSUM, setIRVEPSUM] = useState<DataItem>([]);
  const [BTMP, setBTMP] = useState<DataItem>([]);
  const [CONSOP, setCONSOP] = useState<DataItem>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [isSmarted, setIsSmarted] = useState<Boolean>(false);
  const [dataReady, setDataReady] = useState<Boolean>(false);
  const { user } = useUser();
  const [userId, setUserId] = useState<number>();
  const [centrale, setCentrale] = useState<any>([]);
  const [userReady, setUserReady] = useState<Boolean>(false);
  const [centraleReady, setCentraleReady] = useState<Boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>(getDate(0));
  const pathname = usePathname();
  const centraleId = pathname.match(/\/centrale\/(.+)/)?.[1] || "";

  type SetStateCallback<T> = React.Dispatch<React.SetStateAction<T>>;

  const fetchData = async (
    url: string,
    setDataCallback: SetStateCallback<DataItem>
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

  function getDate(delta: number) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Les mois sont 0-indexés, donc ajoutez 1
    const day = String(today.getDate() + delta).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const updateDate = async (delta: number) => {
    const currentDateObj = new Date(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() + delta);

    const year = currentDateObj.getFullYear();
    const month = String(currentDateObj.getMonth() + 1).padStart(2, "0");
    const day = String(currentDateObj.getDate()).padStart(2, "0");

    const updatedDate = `${year}-${month}-${day}`;

    setCurrentDate(updatedDate);
  };
  const fetchDataAndUpdateState = async () => {
    setDataReady(false);

    await fetchData(
      `https://vps.smart-energysystem.fr:3001/elastic/dataindex/${centrale.ewonId}/BTM_P/${currentDate}`,
      setBTMP
    );

    await fetchData(
      `https://vps.smart-energysystem.fr:3001/elastic/dataindex/${centrale.ewonId}/IRVE_P_SUM/${currentDate}`,
      setIRVEPSUM
    );

    await fetchData(
      `https://vps.smart-energysystem.fr:3001/elastic/dataindex/${centrale.ewonId}/PV_P_SUM/${currentDate}`,
      setPVPSUM
    );
    await fetchData(
      `https://vps.smart-energysystem.fr:3001/elastic/dataindex/${centrale.ewonId}/PV_P_BAT/${currentDate}`,
      setPVPBAT
    );
    await fetchData(
      `https://vps.smart-energysystem.fr:3001/elastic/dataindex/${centrale.ewonId}/BAT_P_CONSO/${currentDate}`,
      setBATPCONSO
    );
    await fetchData(
      `https://vps.smart-energysystem.fr:3001/elastic/dataindex/${centrale.ewonId}/CONSO_P/${currentDate}`,
      setCONSOP
    );
    await fetchData(
      `https://vps.smart-energysystem.fr:3001/elastic/dataindex/${centrale.ewonId}/PV_P_CONSO/${currentDate}`,
      setPVPCONSO
    );
    await fetchData(
      `https://vps.smart-energysystem.fr:3001/elastic/dataindex/${centrale.ewonId}/PV_P_RESEAU/${currentDate}`,
      setPVPRESEAU
    );
    await fetchData(
      `https://vps.smart-energysystem.fr:3001/elastic/dataindex/${centrale.ewonId}/RESEAU_P_CONSO/${currentDate}`,
      setRESEAUPCONSO
    );

    if (!userId || !centraleId) {
      console.log("Attente des données utilisateur et centraleId...");
      return;
    }

    try {
      const res = await fetch(
        `https://vps.smart-energysystem.fr:3001/installations/${centraleId}`,
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
    const fetchUser = async () => {
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

        const activeUser = await utilisateurs.find(
          (bddUser: any) => bddUser.clerkId === user.id
        );

        if (activeUser && centraleId) {
          const installationsRes = await fetch(
            `https://vps.smart-energysystem.fr:3001/installations/${centraleId}`,
            {
              method: "GET",
              headers: {
                Origin: "https://smart-energysystem.fr",
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
              },
            }
          );
          setUserId(activeUser.userId);
          setUserReady(true);

          if (!installationsRes.ok) {
            console.log(
              "Erreur lors de la récupération des données des installations"
            );
            return;
          }

          const centrale = await installationsRes.json();

          setCentrale(centrale);
          setCentraleReady(true);
        }
      } catch (error) {
        console.error("Erreur générale :", error);
      }
    };
    fetchUser();
    if (!userReady || !centraleReady || !currentDate) {
      console.log("Attente des données utilisateur...");
      return;
    }
    scheduleNextFetch(true);
  }, [user, currentDate, userReady, centraleReady]);

  if (!isLoading) {
    return (
      <main className="relative w-full h-full min-h-[80vh] gap-6">
        <div className="absolute top-0 right-0 flex items-center cursor-pointer mt-2 mr-2">
          {/* @ts-ignore */}
          <Switch id="smarted" checked={isSmarted} className="mr-2" />
          <Label htmlFor="smarted" className="text-primary text-xl">
            {isSmarted ? "SMART ON" : "SMART OFF"}
          </Label>
        </div>
        <div className="flex flex-wrap flex-col-reverse md:flex-row justify-center items-center px-2 lg:px-10 gap-y-10 min-h-[80vh] h-full w-full ">
          <div className="flex flex-col min-h-[35vh] bg-slate-100/50 gap-4 h-full w-full items-center justify-center relative pt-10 lg:pt-0 lg:w-1/2">
            {plage === "journalier" && (
              <>
                <Dialog>
                  <DialogTrigger
                    asChild
                    className="flex absolute top-6 right-9 text-primary"
                  >
                    <Maximize2 />
                  </DialogTrigger>
                  <DialogContent className="w-full min-w-[99vw] h-auto items-center justify-center flex">
                    <AreaChart
                      title={plage}
                      centrale={centrale}
                      height="h-[80vh]"
                      IRVEPSUM={IRVEPSUM}
                      BTMP={BTMP}
                      PVPBAT={PVPBAT}
                      BATPCONSO={BATPCONSO}
                      PVPSUM={PVPSUM}
                    />
                  </DialogContent>
                </Dialog>
                <div className="subtitle-container flex pt-2  flex-col items-center justify-center bg-white w-[95%] my-2">
                  <h2 className="text-xl font-bold text-primary capitalize hidden lg:flex">
                    {plage}
                  </h2>
                  <div className="flex gap-3 justify-center items-center text-center">
                    <button
                      className="text-primary text-md font-semibold"
                      onClick={() => updateDate(-1)}
                    >
                      &lt;
                    </button>

                    <h3 className="text-md">{currentDate}</h3>

                    <button
                      className="text-primary text-md font-semibold"
                      onClick={() => updateDate(+1)}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
                <AreaChart
                  title={plage}
                  centrale={centrale}
                  height="h-[40vh]"
                  IRVEPSUM={IRVEPSUM}
                  BTMP={BTMP}
                  PVPBAT={PVPBAT}
                  BATPCONSO={BATPCONSO}
                  PVPSUM={PVPSUM}
                />
              </>
            )}
            {plage === "mensuel" && (
              <>
                <Dialog>
                  <DialogTrigger
                    asChild
                    className="flex absolute top-6 right-9 text-primary"
                  >
                    <Maximize2 />
                  </DialogTrigger>
                  <DialogContent className="w-full min-w-[99vw] h-auto items-center justify-center flex">
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
                  </DialogContent>
                </Dialog>
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
              </>
            )}
            {plage === "annuel" && (
              <>
                <Dialog>
                  <DialogTrigger
                    asChild
                    className="flex absolute top-6 right-9 text-primary"
                  >
                    <Maximize2 />
                  </DialogTrigger>
                  <DialogContent className="w-full min-w-[99vw] h-auto items-center justify-center flex">
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
                  </DialogContent>
                </Dialog>
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
              </>
            )}
            <div className="flex w-full justify-center items-center">
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
          <div className="flex w-full lg:w-[50%] pb-8 md:pb-0 h-full items-center justify-center">
            {dataReady ? (
              // @ts-ignore
              <Bubbles installation={installation} />
            ) : (
              // @ts-ignore
              <Bubbles installation={installation} />
            )}
          </div>
        </div>
      </main>
    );
  } else {
    return <Loader />;
  }
};

export default Centrale;
