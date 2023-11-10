"use client";

import React from "react";
import Highcharts from "highcharts";
import dynamic from "next/dynamic";

const HighchartsReact = dynamic(() => import("highcharts-react-official"), {
  ssr: false,
});

interface BarChartProps {
  dataProd: {
    ewonId: string;
    dateReq: string;
    tagName: string;
    value: number;
    quality: string;
  }[];
  dataConso: {
    ewonId: string;
    dateReq: string;
    tagName: string;
    value: number;
    quality: string;
  }[];
  dataIrve: {
    ewonId: string;
    dateReq: string;
    tagName: string;
    value: number;
    quality: string;
  }[];
}

const BarChart = ({ dataConso, dataProd, dataIrve }: BarChartProps) => {
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

  const filteredIrve = calculateTotalWithFilter(dataIrve);
  const filteredDataConso = calculateTotalWithFilter(dataConso);
  const filteredDataProd = calculateTotalWithFilter(dataProd);

  const filteredConsoWithoutIrve = filteredDataConso.map((conso, i) => {
    return parseFloat((conso - filteredIrve[i]).toFixed(2));
  });

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
        data: filteredIrve,
        color: "darkmagenta",
        stack: "Consommation",
      },
      {
        name: "Consommation du bâtiment",
        data: filteredConsoWithoutIrve,
        color: "#04276E",
        stack: "Consommation",
      },
      {
        name: "Production PV",
        data: filteredDataProd,
        color: "#009DE0",
        stack: "Production",
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 200,
          },
          chartOptions: {
            legend: {
              align: "center",
              verticalAlign: "bottom",
              layout: "horizontal",
            },
            yAxis: {
              labels: {
                align: "left",
                x: 0,
                y: -5,
              },
              title: {
                text: null,
              },
            },
            subtitle: {
              text: null,
            },
            credits: {
              enabled: false,
            },
          },
        },
      ],
    },
    credits: {
      text: "SOLSTYCE - SMART ©",
      href: "https://www.solstyce.fr/",
    },
  };

  return (
    typeof document !== undefined && (
      <div className="flex flex-col w-[100%] h-[100%] md:px-8 mb-1">
        <div className="subtitle-container flex pt-2  flex-col items-center justify-center bg-white ">
          <h2 className="text-xl font-bold text-primary">Installation</h2>
          <div className="flex gap-3 justify-center items-center text-center">
            <h3 className="text-md">{formattedDate}</h3>
          </div>
        </div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    )
  );
};

export default BarChart;
