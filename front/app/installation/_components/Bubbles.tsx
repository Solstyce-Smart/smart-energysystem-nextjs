import React, { useState, useEffect, useRef } from "react";
import Bubble from "./Bubble";
import {
  UtilityPole,
  BatteryCharging,
  Car,
  Fuel,
  Sun,
  Building2,
  PlugZap,
  LucideArrowBigRightDash as ArrowBigRightDash,
} from "lucide-react";
import CustomArrow from "./CustomArrow";

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
}

const Bubbles = (props: BubblesProps) => {
  const { battery, nbIRVE, tagsLive } = props?.installation;
  const [bubbles, setBubbles] = useState<BubblesState>({
    basic: [],
    IRVEs: [],
  });
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

    const findTagValue = (tagName: string) =>
      tagsLive.find((tag) => tag.tagName === tagName)?.value;

    basicBubbles.push(
      {
        name: "Production PV",
        value: findTagValue("PV1_P"),
        icon: <Sun width={30} height={30} />,
      },
      {
        name: "Consommation du bâtiment",
        value: findTagValue("METER1_P"),
        icon: <Building2 width={30} height={30} />,
      }
    );

    if (battery) {
      basicBubbles.push({
        name: "Batterie",
        value: 0,
        icon: <BatteryCharging width={30} height={30} />,
      });
    }

    if (nbIRVE !== 0) {
      basicBubbles.push({
        name: "IRVE",
        value: nbIRVE,
        icon: <Fuel width={30} height={30} />,
      });
      for (let i = 0; i < nbIRVE; i++) {
        IRVEBubbles.push({
          name: `Borne de recharge ${i + 1}`,
          value: findTagValue(`IRVE${i + 1}_P`),
          icon: <Car width={30} height={30} />,
        });
      }
    }

    setBubbles({
      basic: basicBubbles,
      IRVEs: IRVEBubbles,
    });
  };

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-0 items-center justify-center">
      {/* 1 */}
      <div></div>
      <Bubble
        name={bubbles.basic[0]?.name}
        value={bubbles.basic[0]?.value}
        icon={bubbles.basic[0]?.icon}
        ref={pvRef}
      />
      <div></div>
      {/* 2 */}
      <Bubble
        name={bubbles.basic[2]?.name}
        value={bubbles.basic[2]?.value}
        icon={bubbles.basic[2]?.icon}
        ref={batteryRef}
      />
      <div></div>
      <Bubble
        name="Réseau"
        value={0}
        icon={<UtilityPole height={30} width={30} />}
        ref={networkRef}
      />
      {/* 3 */}
      <div></div>
      <Bubble
        name={"Consommation du bâtiment"}
        value={0}
        icon={<PlugZap height={30} width={30} />}
        ref={consoRef}
      />
      <div></div>
      {/* 4 */}
      <Bubble
        name={bubbles.basic[3]?.name}
        value={bubbles.basic[3]?.value}
        icon={bubbles.basic[3]?.icon}
        IRVEs={bubbles.IRVEs}
        ref={irveRef}
      />
      <div></div>
      <Bubble
        name={bubbles.basic[1]?.name}
        value={bubbles.basic[1]?.value}
        icon={bubbles.basic[1]?.icon}
        ref={buildingRef}
      />
      <CustomArrow startRef={pvRef} endRef={networkRef} />
      <CustomArrow startRef={pvRef} endRef={consoRef} />
      <CustomArrow startRef={pvRef} endRef={batteryRef} />
      <CustomArrow startRef={batteryRef} endRef={consoRef} />
      <CustomArrow startRef={networkRef} endRef={consoRef} />
      <CustomArrow startRef={consoRef} endRef={irveRef} />
      <CustomArrow startRef={consoRef} endRef={buildingRef} />
    </div>
  );
};

export default Bubbles;
