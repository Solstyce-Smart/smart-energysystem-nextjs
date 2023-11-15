import React, { useState, useEffect, useRef } from "react";
import Bubble from "./Bubble";
import {
  UtilityPole,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  BatteryWarning,
  Car,
  Fuel,
  Sun,
  Building2,
  PlugZap,
  LucideArrowBigRightDash as ArrowBigRightDash,
} from "lucide-react";
import CustomArrow from "./CustomArrow";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
import Onduleur from "@/public/Onduleur";

interface BubbleData {
  name: string;
  value: number | undefined;
  icon: React.ReactNode;
}

interface BubblesProps {
  installation: {
    abo: string;
    address: string;
    battery: boolean;
    ewonId: string;
    id: number;
    lastSynchroDate: string;
    name: string;
    nbIRVE: number;
    tagsLive: Array<{
      tagName: string;
      value: number | undefined;
    }>;
  };
}

interface BubblesState {
  basic: BubbleData[];
  IRVEs: BubbleData[];
  onduleurs: BubbleData[];
}

const Bubbles = (props: BubblesProps) => {
  const { battery, nbIRVE, tagsLive } = props?.installation;
  const [bubbles, setBubbles] = useState<BubblesState>({
    basic: [],
    IRVEs: [],
    onduleurs: [],
  });
  const [pvValue, setPvValue] = useState(0);
  const [pvEday, setPvEday] = useState(0);
  const [intensiteIrve, setIntensiteIrve] = useState<
    Array<{
      name: string;
      phase1: number;
      phase2: number;
      phase3: number;
    }>
  >([]);
  const [intensiteOnduleurs, setIntensiteOnduleurs] = useState<
    Array<{
      name: string;
      phase1: number;
      phase2: number;
      phase3: number;
    }>
  >([]);
  const [consoValue, setConsoValue] = useState(0);
  const [batteryValue, setBatteryValue] = useState(0);
  const [networkValue, setNetworkValue] = useState(0);
  const [totalIrveValues, setTotalIrveValues] = useState(0);
  const [dataReady, setDataReady] = useState(false);
  const pvRef = useRef<HTMLDivElement | null>(null);
  const irveRef = useRef<HTMLDivElement | null>(null);
  const batteryRef = useRef<HTMLDivElement | null>(null);
  const buildingRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<HTMLDivElement | null>(null);
  const consoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    createBubbles();
  }, [battery, nbIRVE, tagsLive]);

  const createBubbles = async () => {
    const basicBubbles: BubbleData[] = [];
    const IRVEBubbles: BubbleData[] = [];
    const onduleursBubbles: BubbleData[] = [];

    const findTagValue = (tagName: string) =>
      tagsLive.find((tag) => tag.tagName === tagName)?.value;

    const nbOnduleurs = findTagValue("PV_NB") || 0;
    let sumEday = 0;
    for (let i = 0; i < nbOnduleurs; i++) {
      sumEday += findTagValue(`PV${i + 1}_EDAY`) || 0;
      setPvEday(sumEday);
    }
    basicBubbles.push(
      {
        name: "Production PV",
        value: findTagValue("PV_P_SUM"),
        icon: <Sun width={40} height={40} />,
      },
      {
        name: "Consommation du bâtiment",
        value: findTagValue("BTM_P"),
        icon: <Building2 width={40} height={40} />,
      }
    );

    if (battery) {
      const batteryValue = findTagValue("BAT_SOC_AV") || 0;

      let batteryIcon;

      if (batteryValue === 0) {
        batteryIcon = <Battery width={40} height={40} fill="darkred" />;
      } else if (batteryValue > 66) {
        batteryIcon = <BatteryFull width={40} height={40} fill="green" />;
      } else if (batteryValue > 33) {
        batteryIcon = <BatteryMedium width={40} height={40} fill="gold" />;
      } else {
        batteryIcon = (
          <BatteryLow width={40} height={40} fill="darkgoldenrod" />
        );
      }

      basicBubbles.push({
        name: "Batterie",
        value: batteryValue,
        icon: batteryIcon,
      });
    }

    if (nbIRVE !== 0) {
      basicBubbles.push({
        name: "IRVE",
        value: findTagValue("IRVE_P_SUM"),
        icon: <Fuel width={40} height={40} />,
      });
      let intArray = [];
      for (let i = 0; i < nbIRVE; i++) {
        IRVEBubbles.push({
          name: `Borne de recharge ${i + 1}`,
          value: findTagValue(`IRVE${i + 1}_P`),
          icon: <Car width={50} height={40} />,
        });
        intArray.push({
          name: `Borne de recharge ${i + 1}`,
          phase1: findTagValue(`IRVE${i + 1}_I_PH1`) || 0,
          phase2: findTagValue(`IRVE${i + 1}_I_PH2`) || 0,
          phase3: findTagValue(`IRVE${i + 1}_I_PH3`) || 0,
        });
      }
      console.log(intArray);

      setIntensiteIrve(intArray);
    }

    if (nbOnduleurs !== 0) {
      let intArray = [];
      for (let i = 0; i < nbOnduleurs; i++) {
        onduleursBubbles.push({
          name: `Onduleur ${i + 1}`,
          value: findTagValue(`PV${i + 1}_P`),
          icon: <Onduleur width={40} height={40} />,
        });
        intArray.push({
          name: `Onduleur ${i + 1}`,
          phase1: findTagValue(`PV${i + 1}_I_PH1`) || 0,
          phase2: findTagValue(`PV${i + 1}_I_PH2`) || 0,
          phase3: findTagValue(`PV${i + 1}_I_PH3`) || 0,
        });
      }
      setIntensiteOnduleurs(intArray);
    }

    basicBubbles.push(
      {
        name: "Consommation totale",
        value: findTagValue("CONSO_P"),
        icon: <PlugZap width={40} height={40} />,
      },
      {
        name: "Réseau",
        value: findTagValue("METER1_P"),
        icon: <UtilityPole width={40} height={40} />,
      }
    );

    setPvValue(
      basicBubbles.find((b) => b.name === "Production PV")?.value || 0
    );
    setConsoValue(
      basicBubbles.find((b) => b.name === "Consommation totale")?.value || 0
    );
    setBatteryValue(
      basicBubbles.find((b) => b.name === "Batterie")?.value || 0
    );
    setNetworkValue(basicBubbles.find((b) => b.name === "Réseau")?.value || 0);
    setTotalIrveValues(basicBubbles.find((b) => b.name === "IRVE")?.value || 0);
    setBubbles({
      basic: basicBubbles,
      IRVEs: IRVEBubbles,
      onduleurs: onduleursBubbles,
    });
    setDataReady(true);
  };

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-x-[50px] gap-y-[75px] py-20 items-center justify-center">
      {/* 1 */}
      <div></div>
      <Bubble
        name={bubbles.basic[0]?.name}
        value={bubbles.basic[0]?.value}
        icon={bubbles.basic[0]?.icon}
        ref={pvRef}
        group={bubbles.onduleurs}
        intensites={intensiteOnduleurs}
        placing="top"
        eday={pvEday}
      />
      <div></div>
      {/* 2 */}
      <Bubble
        name={bubbles.basic[2]?.name}
        value={bubbles.basic[2]?.value}
        icon={bubbles.basic[2]?.icon}
        ref={batteryRef}
        placing="left"
      />
      <div></div>
      <Bubble
        name={bubbles.basic[5]?.name}
        value={bubbles.basic[5]?.value}
        icon={bubbles.basic[5]?.icon}
        placing="right"
        ref={networkRef}
      />
      {/* 3 */}
      <div></div>
      <Bubble
        name={bubbles.basic[4]?.name}
        value={bubbles.basic[4]?.value}
        icon={bubbles.basic[4]?.icon}
        ref={consoRef}
      />
      <div></div>
      {/* 4 */}
      <Bubble
        name={bubbles.basic[3]?.name}
        value={bubbles.basic[3]?.value}
        icon={bubbles.basic[3]?.icon}
        group={bubbles.IRVEs}
        intensites={intensiteIrve}
        ref={irveRef}
        placing="bottom"
      />
      <div></div>
      <Bubble
        name={bubbles.basic[1]?.name}
        value={bubbles.basic[1]?.value}
        icon={bubbles.basic[1]?.icon}
        ref={buildingRef}
      />
      {dataReady && (
        <>
          <CustomArrow
            startRef={pvRef}
            endRef={networkRef}
            dashed
            animated={pvValue > 0}
          />
          <CustomArrow
            startRef={pvRef}
            endRef={consoRef}
            dashed
            animated={pvValue > 0}
          />

          <CustomArrow
            startRef={pvRef}
            endRef={batteryRef}
            dashed
            animated={pvValue > 0 && batteryValue < 100}
          />
          <CustomArrow
            startRef={batteryRef}
            endRef={consoRef}
            dashed
            animated={batteryValue > 0}
          />
          <CustomArrow
            startRef={networkRef}
            endRef={consoRef}
            dashed
            animated={networkValue > 0}
          />
          <CustomArrow
            startRef={consoRef}
            endRef={irveRef}
            dashed
            animated={totalIrveValues > 0}
          />
          <CustomArrow
            startRef={consoRef}
            endRef={buildingRef}
            dashed
            animated={consoValue > 0}
          />
        </>
      )}
    </div>
  );
};

export default Bubbles;
