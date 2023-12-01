import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BubbleProps {
  name: string;
  value: number | undefined;
  id?: string;
  group?: Array<{
    name: string;
    value: number | undefined;
    icon: any;
    status?: number;
  }>;
  icon: any;
  placing?: string;
  eday?: number;
  intensites?: Array<{
    name: string;
    phase1: number;
    phase2: number;
    phase3: number;
  }>;
}

const Bubble: React.ForwardRefRenderFunction<HTMLDivElement, BubbleProps> = (
  { name, value, group, icon, placing, eday, intensites, id },
  ref
) => {
  const [childrensDisplayed, setChildrensDisplayed] = useState(false);
  const [totalProd, setTotalProd] = useState(0);
  useEffect(() => {
    if (group) {
      let totalProd = 0;
      for (let i = 0; i < group.length; i++) {
        totalProd += group[i].value || 0;
      }
      setTotalProd(totalProd);
    }
  }, [group]);

  const showChildrens = () => {
    setChildrensDisplayed((prev) => !prev);
  };

  const generateLiElements = (
    datas:
      | Array<{
          name: string;
          value: number | undefined;
          icon: any;
          status?: number;
        }>
      | undefined,
    placing: string | undefined,
    childrensDisplayed: any
  ) => {
    return (
      <>
        {datas?.map((data, i, arr) => {
          let rotate, inverseRotate;

          if (placing === "bottom") {
            rotate = -(180 / (arr.length - 1)) * i;
            inverseRotate = -(180 / (-arr.length + 1)) * i;
          } else if (placing === "left") {
            rotate = 90 - (180 / (arr.length - 1)) * i;
            inverseRotate = -90 - (180 / (-arr.length + 1)) * i;
          } else if (placing === "top") {
            rotate = (180 / (arr.length - 1)) * i;
            inverseRotate = (180 / (-arr.length + 1)) * i;
          } else if (placing === "right") {
            rotate = -90 - (180 / (arr.length - 1)) * i;
            inverseRotate = 90 - (180 / (-arr.length + 1)) * i;
          }

          const rotateText = rotate + "deg";
          const inverseRotateText = inverseRotate + "deg";
          const transition = 300 * i;

          return (
            <TooltipProvider key={i}>
              <Tooltip>
                <TooltipTrigger
                  id={id}
                  style={
                    childrensDisplayed
                      ? {
                          transform: `rotate(${rotateText})`,
                          transitionDelay: `${transition}ms`,
                          transitionDuration: "0.5s",
                        }
                      : {}
                  }
                  className={`absolute text-white border-4 border-white shadow-[0_0_10px_rgba(0,0,0,1)] ${
                    data.status === 0
                      ? "shadow-primary"
                      : data.status === 1
                      ? "shadow-red-500"
                      : data.status === 2
                      ? "shadow-secondary"
                      : data.status === 3
                      ? "shadow-secondary"
                      : data.status === 4
                      ? "shadow-green-500"
                      : name === "Production PV"
                      ? "shadow-secondary"
                      : ""
                  } bg-gradient-to-t from-secondary via-secondary via-35% to-primary z-10 cursor-pointer rotate-0 -ml-[80px] md:-ml-[110px] left-0 list-none origin-[117px] md:origin-[160px] flex items-center justify-center w-[75px] h-[75px] md:w-[100px] md:h-[100px] rounded-full transition-all ${
                    childrensDisplayed ? `opacity-1` : "opacity-0"
                  } ${
                    data.value && data.value > 0.5 && name === "IRVE"
                      ? "animate-animateShadow"
                      : ""
                  } `}
                >
                  <li key={data.name}>
                    <span
                      className="flex flex-col items-center justify-center text-center"
                      style={{
                        transform: `rotate(${inverseRotateText})`,
                      }}
                    >
                      <p className="relative">
                        {data.icon}
                        {name === "IRVE" && (
                          <span className="absolute w-[30px] h-[30px] text-center top-[22%] left-[18%] font-bold rounded-full text-white border-primary">
                            {i + 1}
                          </span>
                        )}
                      </p>
                      {data.value?.toFixed(1)}kW
                    </span>
                  </li>
                </TooltipTrigger>
                <TooltipContent className="z-20">
                  {name === "IRVE" && intensites !== undefined && (
                    <div className="flex flex-col space-y-1 z-30">
                      <p className="mb-4">{intensites[i].name}</p>
                      <p>Consigne : {data.status}</p>
                      <p>Intensité phase 1: {intensites[i].phase1} A</p>
                      <p>Intensité phase 2: {intensites[i].phase2} A</p>
                      <p>Intensité phase 3: {intensites[i].phase3} A</p>
                    </div>
                  )}
                  {name === "Production PV" && intensites !== undefined && (
                    <div className="flex flex-col space-y-1 z-30">
                      <p className="mb-4">{intensites[i].name}</p>
                      {/* TODO */}
                      <p>Energie du jour :</p>
                      {/* TODO */}
                      <p>Intensité phase 1: {intensites[i].phase1} A</p>
                      <p>Intensité phase 2: {intensites[i].phase2} A</p>
                      <p>Intensité phase 3: {intensites[i].phase3} A</p>
                    </div>
                  )}
                  {/*TODO*/}
                  {name === "Réseau" && (
                    <div className="flex flex-col space-y-1">Compteurs</div>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <div className="menu relative z-10 m-1 3xl:m-6 items-center justify-center flex pb-10 mb:pb-0">
          <TooltipTrigger>
            <div
              onClick={() => {
                name === "IRVE" || name === "Production PV"
                  ? showChildrens()
                  : null;
              }}
              ref={ref}
              className={`toggle flex-col text-white border-4 border-white shadow-[0_0_10px_rgba(0,0,0,1)] transition-all bg-gradient-to-t from-primary via-primary to-secondary flex items-center w-[75px] h-[75px] md:w-[100px] md:h-[100px] justify-center rounded-full cursor-pointer text-xl ${
                childrensDisplayed
                  ? "rotate-[360deg] duration-1000 shadow-secondary"
                  : name === "IRVE" && value !== 0
                  ? "animate-animateShadow"
                  : name === "Batterie" && value === 100
                  ? "shadow-green-500"
                  : "shadow-secondary"
              }`}
            >
              {icon}
              {name === "Batterie" ? (
                <span className="text-xs">{value} %</span>
              ) : (
                <span className="text-sm">{value} kW</span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {name === "Production PV" && group && (
              <div className="flex flex-col space-y-1">
                Nombres d'onduleurs : {group.length} <br />
                <br />
                Puissance totale : {totalProd.toFixed(2)} kW
                <br />
                Production du jour : {eday} kWh <br />
                <br />
                {group.map((onduleur, i) => (
                  <div key={i}>
                    {onduleur.name} : {onduleur.value?.toFixed(1) || 0} kW
                  </div>
                ))}
              </div>
            )}
            {name === "Batterie" && (
              <div>Taux de charge de la batterie: {value} %</div>
            )}
            {name === "Réseau" && (
              <div>
                Énergie achetée dans le réseau: {value} kW <br />
                Calcul |||| Positif envoyé au réseau / Negatif revendue
              </div>
            )}
            {name === "Consommation totale" && (
              <div className="flex flex-col space-y-1">
                <p>Consommation totale: {value} kW</p>
              </div>
            )}
            {name === "Consommation du bâtiment" && (
              <div className="flex flex-col space-y-1">
                <p>Consommation du bâtiment: {value} kW</p>
              </div>
            )}
            {name === "IRVE" && (
              <div className="flex flex-col space-y-1">
                Consommation totale instantanée: {value} kW
              </div>
            )}
          </TooltipContent>
          {generateLiElements(group, placing, childrensDisplayed)}
        </div>
      </Tooltip>
    </TooltipProvider>
  );
};

export default React.forwardRef(Bubble);
