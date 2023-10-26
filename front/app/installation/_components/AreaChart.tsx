import React, { useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Button } from "@/components/ui/button";

interface AreaChartProps {
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
}

const AreaChart = ({ dataProd, dataConso }: AreaChartProps) => {
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

  const sortedDataProd = dataProd.sort((a, b) => {
    return new Date(a.dateReq).getTime() - new Date(b.dateReq).getTime();
  });

  const sortedDataConso = dataConso.sort((a, b) => {
    return new Date(a.dateReq).getTime() - new Date(b.dateReq).getTime();
  });

  const chartDataProd = sortedDataProd.map((item) => {
    const timestamp = new Date(item.dateReq).getTime();

    return {
      x: timestamp,
      y: Number(item.value.toFixed(2)),
    };
  });

  const chartDataConso = sortedDataConso.map((item) => {
    const timestamp = new Date(item.dateReq).getTime();

    return {
      x: timestamp,
      y: Number(item.value.toFixed(2)),
    };
  });

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

  const dataExistePourDate = (delta: number) => {
    const dateCible = new Date(currentDate);
    dateCible.setDate(dateCible.getDate() + delta);

    // Vérifier si des données existent dans dataProd pour la date cible
    const dataProdExiste = dataProd.some((item) => {
      const itemDate = new Date(item.dateReq);
      return (
        itemDate.getFullYear() === dateCible.getFullYear() &&
        itemDate.getMonth() === dateCible.getMonth() &&
        itemDate.getDate() === dateCible.getDate()
      );
    });

    // Vérifier si des données existent dans dataConso pour la date cible
    const dataConsoExiste = dataConso.some((item) => {
      const itemDate = new Date(item.dateReq);
      return (
        itemDate.getFullYear() === dateCible.getFullYear() &&
        itemDate.getMonth() === dateCible.getMonth() &&
        itemDate.getDate() === dateCible.getDate()
      );
    });

    // Retourner true si des données existent pour au moins l'un des tableaux
    return dataProdExiste || dataConsoExiste;
  };

  const options = {
    chart: {
      type: "area",
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
        name: "Consommation",
        data: chartDataConso,
        color: "#04276E",
        turboThreshold: 0,
      },
      {
        name: "Production",
        data: chartDataProd,
        color: "#009DE0",
        turboThreshold: 0,
      },
    ],
    tooltip: {
      useHTML: true,
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        let tooltip = '<div class="custom-tooltip z-50">';
        if (this.x !== undefined) {
          const date = new Date(this.x);
          date.setHours(date.getHours() + 2);
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
    <div className="flex flex-col w-[100%] h-[100%] mb-1 md:px-8">
      <div className="subtitle-container flex pt-2  flex-col items-center justify-center bg-white ">
        <h2 className="text-xl font-bold text-primary">Installation</h2>
        <div className="flex gap-3 justify-center items-center text-center">
          {dataExistePourDate(-1) && (
            <button
              className="text-primary text-md font-semibold"
              onClick={() => updateDate(-1)}
            >
              &lt;
            </button>
          )}
          <h3 className="text-md">{formattedDate}</h3>
          {dataExistePourDate(1) && (
            <button
              className="text-primary text-md font-semibold"
              onClick={() => updateDate(1)}
            >
              &gt;
            </button>
          )}
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default AreaChart;
