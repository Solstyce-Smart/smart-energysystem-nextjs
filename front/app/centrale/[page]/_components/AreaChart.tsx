"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Highcharts from "highcharts";
import { Button } from "@/components/ui/button";

const HighchartsReact = dynamic(() => import("highcharts-react-official"), {
  ssr: false,
});
interface AreaChartProps {
  title: string;
  centrale: any;
  height: string;
  PVPSUM: DataItem;
  IRVEPSUM: DataItem;
  BTMP: DataItem;
  PVPBAT: DataItem;
  BATPCONSO: DataItem;
}

type DataItem = {
  ewonId: string;
  dateReq: string;
  tagName: string;
  value: number;
  quality: string;
}[];

const AreaChart = ({
  title,
  height,
  PVPSUM,
  IRVEPSUM,
  BTMP,
  PVPBAT,
  BATPCONSO,
}: AreaChartProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newDate, setNewDate] = useState(0);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Les mois sont indexés à partir de 0
  const currentDay = currentDate.getDate() + newDate;
  const dateToShow = new Date(currentDate);
  dateToShow.setDate(dateToShow.getDate() + newDate);
  const day = ("0" + dateToShow.getDate()).slice(-2);
  const month = ("0" + (dateToShow.getMonth() + 1)).slice(-2);
  const year = dateToShow.getFullYear();
  const formattedDate = `${day} / ${month} / ${year}`;

  const updateDate = (delta: number) => {
    const updatedDate = new Date(currentDate);
    updatedDate.setDate(updatedDate.getDate() + delta);
    setCurrentDate(updatedDate);
  };

  function sortByDate(data: DataItem) {
    return data.sort(
      (a: any, b: any) =>
        new Date(a.dateReq).getTime() - new Date(b.dateReq).getTime()
    );
  }

  const sortedPVPSUM = sortByDate(PVPSUM);
  const sortedIRVEPSUM = sortByDate(IRVEPSUM);
  const sortedBTMP = sortByDate(BTMP);
  const sortedDataPVPBAT = sortByDate(PVPBAT);
  const sortedDataBATPCONSO = sortByDate(BATPCONSO);

  function convertToChartData(data: DataItem) {
    return data.map((item) => {
      const timestamp = new Date(item.dateReq);
      timestamp.setSeconds(0, 0); // Arrondir au début de la minute

      return {
        x: timestamp.getTime(),
        y: item.value ? Number(item.value.toFixed(2)) : 0,
      };
    });
  }

  const chartPVPSUM = convertToChartData(sortedPVPSUM);
  const chartDataPVPBAT = convertToChartData(sortedDataPVPBAT);
  const chartDataBATPCONSO = convertToChartData(sortedDataBATPCONSO);
  const chartIRVEPSUM = convertToChartData(sortedIRVEPSUM);
  const chartBTMP = convertToChartData(sortedBTMP);

  const startOfDay = new Date(
    currentYear,
    currentMonth - 1,
    currentDay + newDate,
    0,
    0,
    0
  );
  const endOfDay = new Date(
    currentYear,
    currentMonth - 1,
    currentDay + newDate,
    23,
    59,
    59
  );

  function doesDataExistForDate(data: DataItem, dateCible: Date) {
    return data.some((item) => {
      const itemDate = new Date(item.dateReq);
      return (
        itemDate.getFullYear() === dateCible.getFullYear() &&
        itemDate.getMonth() === dateCible.getMonth() &&
        itemDate.getDate() === dateCible.getDate()
      );
    });
  }

  const dataExistePourDate = (delta: number) => {
    const dateCible = new Date(currentDate);
    dateCible.setDate(dateCible.getDate() + delta);

    // Vérifier si des données existent pour la date cible dans chaque tableau
    const PVPSUMExiste = doesDataExistForDate(PVPSUM, dateCible);
    const BTMPExiste = doesDataExistForDate(BTMP, dateCible);
    const IRVEPSUMExiste = doesDataExistForDate(IRVEPSUM, dateCible);
    const dataPVPBATExiste = doesDataExistForDate(PVPBAT, dateCible);
    const dataBATPCONSOExiste = doesDataExistForDate(BATPCONSO, dateCible);

    // Retourner true si des données existent pour au moins l'un des tableaux
    return (
      PVPSUMExiste ||
      BTMPExiste ||
      IRVEPSUMExiste ||
      dataPVPBATExiste ||
      dataBATPCONSOExiste
    );
  };

  const options = {
    chart: {
      type: "area",
    },
    accessibility: {
      enabled: false,
    },

    exporting: {
      enabled: false,
    },
    title: {
      text: null,
    },
    plotOptions: {
      area: {
        marker: {
          enabled: false,
        },
        stacking: "normal",
        connectNulls: true,
        dataGrouping: {
          enabled: false,
        },
      },
    },
    yAxis: {
      title: {
        text: "kW",
      },
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Heures",
      },
      dateTimeLabelFormats: {
        hour: "%H:%M",
      },
      min: startOfDay.getTime(), // Limite minimale de l'axe des x
      max: endOfDay.getTime(),
      labels: {
        formatter: function (
          this: Highcharts.AxisLabelsFormatterContextObject
        ) {
          // Formatage de l'axe X au format "00h, 01h, ..., 22h, 23h"
          const date = new Date(this.value);
          const hours = date.getHours();

          return hours.toString().padStart(2, "0") + "h";
        },
        rotation: 0, // Rotation à 0 degrés (horizontal)
      },
    },
    series: [
      {
        name: "Charge de la batterie",
        data: chartDataPVPBAT,
        color: "#04276E",
        turboThreshold: 0,
        stack: "Consommation",
      },
      {
        name: "Consommation IRVE",
        data: chartIRVEPSUM,
        color: "#009DE0",
        turboThreshold: 0,
        stack: "Consommation",
      },
      {
        name: "Consommation",
        data: chartBTMP,
        color: "#04276E",
        turboThreshold: 0,
        stack: "Consommation",
      },
      {
        name: "Réinjection batterie",
        data: chartDataBATPCONSO,
        color: "lightgreen",
        turboThreshold: 0,
        stack: "Production",
      },
      {
        name: "Production PV",
        data: chartPVPSUM,
        color: "#008937",
        turboThreshold: 0,
        stack: "Production",
      },
    ],
    tooltip: {
      useHTML: true,
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        let tooltip = '<div class="custom-tooltip z-50">';
        if (this.x !== undefined) {
          const date = new Date(this.x);
          date.setHours(date.getHours() + 1);
          const formattedTime =
            ("0" + date.getUTCHours()).slice(-2) +
            "h" +
            ("0" + date.getUTCMinutes()).slice(-2);

          tooltip += `<div>Heure :</div>
          <div class="tooltip-time">${formattedTime} </div><br />`;
        }
        if (this.y !== undefined && this.y !== null) {
          tooltip +=
            '<div class="tooltip-series" style="display: flex; flex-direction: row">' +
            this.series.name +
            " : </div> " +
            '<span class="tooltip-value" style="">' +
            Highcharts.numberFormat(this.y, 2) +
            " kW</span>";
        }
        tooltip += "</div>";
        return tooltip;
      },
    },

    credits: {
      text: "SOLSTYCE - SMART ©",
      href: "https://www.solstyce.fr/",
    },
    legend: {
      align: "right",
      verticalAlign: "top",
      layout: "vertical",
      x: 0,
      y: 0,
    },
    responsive: {
      rules: [
        {
          condition: {
            minWidth: 800,
          },
          chartOptions: {
            legend: {
              align: "center",
              verticalAlign: "bottom",
              layout: "horizontal",
            },
          },
        },
      ],
    },
  };

  return (
    typeof document !== "undefined" && (
      <div
        className={`flex flex-col w-full ${height} min-h-[300px] mb-1 md:px-8 md:py-4 bg-slate-200/30 rounded-md`}
      >
        <HighchartsReact
          containerProps={{ style: { height: "100%" } }}
          highcharts={Highcharts}
          options={options}
        />
      </div>
    )
  );
};

export default AreaChart;
