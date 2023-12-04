"use client";

import React from "react";
import Highcharts from "highcharts";
import dynamic from "next/dynamic";

const HighchartsReact = dynamic(() => import("highcharts-react-official"), {
  ssr: false,
});

interface BarChartMonthProps {
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
const BarChartMonth = ({
  title,
  BTMP,
  IRVEPSUM,
  PVPBAT,
  RESEAUPCONSO,
  PVPCONSO,
  BATPCONSO,
  PVPRESEAU,
}: BarChartMonthProps) => {
  console.log("BTMP", BTMP);

  // Filtrer les données pour chaque mois de l'année
  const currentDate = new Date();
  const currentYear = new Date().getFullYear();
  const dateToShow = new Date(currentDate);
  dateToShow.setDate(dateToShow.getDate());
  const year = dateToShow.getFullYear();
  const formattedDate = `${year}`;

  function calculateTotalWithFilter(data: any[]) {
    return Array.from({ length: 12 }, (_, day) => {
      const dayString = `${currentYear.toString().padStart(2, "0")}-${(day + 1)
        .toString()
        .padStart(2, "0")}`;
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

      return parseFloat((total / 1000).toFixed(2));
    });
  }
  function calculateTotalWithFilterNeg(data: any[]) {
    return Array.from({ length: 12 }, (_, day) => {
      const dayString = `${currentYear.toString().padStart(2, "0")}-${(day + 1)
        .toString()
        .padStart(2, "0")}`;
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

      return -parseFloat((total / 1000).toFixed(2));
    });
  }

  const filteredDataBTMP = calculateTotalWithFilter(BTMP);
  const filteredDataIRVEPSUM = calculateTotalWithFilter(IRVEPSUM);
  const filteredDataPVPBAT = calculateTotalWithFilterNeg(PVPBAT);
  const filteredDataRESEAUPCONSO = calculateTotalWithFilter(RESEAUPCONSO);
  const filteredDataPVPCONSO = calculateTotalWithFilter(PVPCONSO);
  const filteredDataBATPCONSO = calculateTotalWithFilter(BATPCONSO);
  const filteredDataPVPRESEAU = calculateTotalWithFilterNeg(PVPRESEAU);

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
        marker: {
          enabled: false,
        },
        pointPadding: -0.2,
        stacking: "normal",
      },
    },
    yAxis: {
      title: {
        text: "mWh",
      },
    },
    xAxis: {
      title: {
        text: "Mois",
      },
      categories: [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
      ],
      max: 11,
    },
    series: [
      {
        name: "Consommation IRVE",
        data: filteredDataIRVEPSUM,
        color: "darkmagenta",
        stack: "Consommation",
      },
      {
        name: "Consommation du bâtiment",
        data: filteredDataBTMP,
        color: "#04276E",
        stack: "Consommation",
      },
      {
        name: "Consommation batterie",
        data: filteredDataPVPBAT,
        color: "red",
        stack: "Consommation",
      },
      {
        name: "Appros réseau",
        data: filteredDataRESEAUPCONSO,
        color: "darkred",
        stack: "Production",
      },
      {
        name: "Production PV autoconsommée",
        data: filteredDataPVPCONSO,
        color: "#009DE0",
        stack: "Production",
      },
      {
        name: "Réinjection batterie",
        data: filteredDataBATPCONSO,
        color: "yellow",
        stack: "Production",
      },
      {
        name: "Production PV revendue",
        data: filteredDataPVPRESEAU,
        color: "green",
        stack: "Production",
      },
    ],
    tooltip: {
      useHTML: true,
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        let tooltip = '<div class="custom-tooltip z-50">';
        if (this.y !== undefined && this.y !== null) {
          tooltip +=
            "<div>" +
            `Total :` +
            this.point.total +
            " mWh" +
            '</div><br/><div class="tooltip-series" style="display: flex; flex-direction: row">' +
            this.series.name +
            " : </div> " +
            '<span class="tooltip-value" style="">' +
            Highcharts.numberFormat(this.y, 2) +
            " mWh</span>";
        }
        tooltip += "</div>";
        return tooltip;
      },
    },

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

export default BarChartMonth;
