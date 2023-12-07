"use client";

import React from "react";
import Highcharts from "highcharts";
import dynamic from "next/dynamic";

const HighchartsReact = dynamic(() => import("highcharts-react-official"), {
  ssr: false,
});

interface BarChartProps {
  title: string;
  PVPSUM: {
    ewonId: string;
    dateReq: string;
    tagName: string;
    value: number;
    quality: string;
  }[];
  BTMP: {
    ewonId: string;
    dateReq: string;
    tagName: string;
    value: number;
    quality: string;
  }[];
  IRVEPSUM: {
    ewonId: string;
    dateReq: string;
    tagName: string;
    value: number;
    quality: string;
  }[];
  PVPBAT: {
    ewonId: string;
    dateReq: string;
    tagName: string;
    value: number;
    quality: string;
  }[];
  RESEAUPCONSO: {
    ewonId: string;
    dateReq: string;
    tagName: string;
    value: number;
    quality: string;
  }[];
  PVPCONSO: {
    ewonId: string;
    dateReq: string;
    tagName: string;
    value: number;
    quality: string;
  }[];
  BATPCONSO: {
    ewonId: string;
    dateReq: string;
    tagName: string;
    value: number;
    quality: string;
  }[];
  PVPRESEAU: {
    ewonId: string;
    dateReq: string;
    tagName: string;
    value: number;
    quality: string;
  }[];
}

const BarChart = ({
  title,
  BTMP,
  IRVEPSUM,
  PVPBAT,
  RESEAUPCONSO,
  PVPCONSO,
  BATPCONSO,
  PVPRESEAU,
}: BarChartProps) => {
  // Filtrer les données pour le mois en cours
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dateToShow = new Date(currentDate);
  dateToShow.setDate(dateToShow.getDate());
  const month = ("0" + (dateToShow.getMonth() + 1)).slice(-2);
  const year = dateToShow.getFullYear();
  const formattedDate = `${month} / ${year}`;

  // Fonction générique pour calculer le total avec filtrage
  function calculateTotalWithFilter(data: any[]) {
    return Array.from({ length: daysInMonth }, (_, day) => {
      const dayString = `${currentYear}-${(currentMonth + 1)
        .toString()
        .padStart(2, "0")}-${(day + 1).toString().padStart(2, "0")}`;
      const filteredData = data.filter(
        (item) => item.dateReq.startsWith(dayString) && item.value !== 0
      );
      const total = filteredData.reduce((acc, item, index, array) => {
        if (index > 0) {
          const prevValue = array[index - 1].value;
          const currValue = item.value;
          const hours = 5 / 60;
          const consumption = ((currValue + prevValue) / 2) * hours;
          return acc + Math.abs(consumption);
        }
        return acc;
      }, 0);

      return parseFloat(total.toFixed(2));
    });
  }
  function calculateTotalWithFilterNeg(data: any[]) {
    return Array.from({ length: daysInMonth }, (_, day) => {
      const dayString = `${currentYear}-${(currentMonth + 1)
        .toString()
        .padStart(2, "0")}-${(day + 1).toString().padStart(2, "0")}`;
      const filteredData = data.filter(
        (item) => item.dateReq.startsWith(dayString) && item.value !== 0
      );
      const total = filteredData.reduce((acc, item, index, array) => {
        if (index > 0) {
          const prevValue = array[index - 1].value;
          const currValue = item.value;
          const hours = 5 / 60;
          const consumption = ((currValue + prevValue) / 2) * hours;
          return acc + Math.abs(consumption);
        }
        return acc;
      }, 0);

      return -parseFloat(total.toFixed(2));
    });
  }

  const filteredIRVEPSUM = calculateTotalWithFilter(IRVEPSUM);
  const filteredBTMP = calculateTotalWithFilter(BTMP);
  const filteredPVPBAT = calculateTotalWithFilter(PVPBAT);
  const filteredRESEAUPCONSO = calculateTotalWithFilter(RESEAUPCONSO);
  const filteredPVPCONSO = calculateTotalWithFilter(PVPCONSO);
  const filteredBATPCONSO = calculateTotalWithFilter(BATPCONSO);
  const filteredPVPRESEAU = calculateTotalWithFilterNeg(PVPRESEAU);

  const options = {
    chart: {
      type: "column",
    },
    exporting: {
      enabled: false,
    },
    title: {
      text: null,
    },
    plotOptions: {
      column: {
        stacking: "normal",
      },
    },
    yAxis: {
      title: {
        text: "kWh",
      },
    },
    tooltip: {
      useHTML: true,
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        let tooltip = '<div class="custom-tooltip z-50">';
        if (this.y !== undefined && this.y !== null) {
          tooltip +=
            "<div>" +
            `${
              this.series.name === "Production PV"
                ? "Production totale : "
                : "Consommation totale : "
            }` +
            this.point.total +
            " kWh" +
            '</div><br/><div class="tooltip-series" style="display: flex; flex-direction: row">' +
            this.series.name +
            " : </div> " +
            '<span class="tooltip-value" style="">' +
            Highcharts.numberFormat(this.y, 2) +
            " kWh</span>";
        }
        tooltip += "</div>";
        return tooltip;
      },
    },
    xAxis: {
      title: {
        text: "Jours",
      },
      categories: Array.from({ length: daysInMonth }, (_, day) =>
        (day + 1).toString()
      ),
      max: daysInMonth - 1,
    },
    series: [
      {
        name: "Consommation IRVE",
        data: filteredIRVEPSUM,
        color: "#009DE0",
        stack: "Consommation",
      },
      {
        name: "Consommation du bâtiment",
        data: filteredBTMP,
        color: "#04276E",
        stack: "Consommation",
      },
      {
        name: "Consommation batterie",
        data: filteredPVPBAT,
        color: "#04276E",
        stack: "Consommation",
      },
      {
        name: "Appros réseau",
        data: filteredRESEAUPCONSO,
        color: "crimson",
        stack: "Production",
      },
      {
        name: "Production PV autoconsommée",
        data: filteredPVPCONSO,
        color: "#00a040",
        stack: "Production",
      },
      {
        name: "Réinjection batterie",
        data: filteredBATPCONSO,
        color: "lightgreen",
        stack: "Production",
      },
      {
        name: "Production PV revendue",
        data: filteredPVPRESEAU,
        color: "#008937",
        stack: "Production",
      },
    ],

    credits: {
      text: "SOLSTYCE - SMART ©",
      href: "https://www.solstyce.fr/",
    },
  };

  return (
    typeof document !== undefined && (
      <div className="flex flex-col w-full h-[40vh] mb-1 md:px-8 md:py-4 bg-slate-200/30 rounded-md">
        <div className="subtitle-container flex pt-2  flex-col items-center justify-center bg-white ">
          <h2 className="text-xl font-bold text-primary capitalize">{title}</h2>
          <div className="flex gap-3 justify-center items-center text-center">
            <h3 className="text-md">{formattedDate}</h3>
          </div>
        </div>
        <HighchartsReact
          containerProps={{ style: { height: "100%" } }}
          highcharts={Highcharts}
          options={options}
        />
      </div>
    )
  );
};

export default BarChart;
