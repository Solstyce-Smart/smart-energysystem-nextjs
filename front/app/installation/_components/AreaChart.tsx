import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

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
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Les mois sont indexés à partir de 0
  const currentDay = currentDate.getDate();

  // Filtrer les données pour la journée en cours
  const filteredDataProd = dataProd
    .map((item) => {
      const itemDate = new Date(item.dateReq);
      itemDate.setHours(itemDate.getHours());

      // Formater la date en heure sans les secondes
      const formattedDate = new Date(itemDate);
      formattedDate.setSeconds(0);
      formattedDate.setMilliseconds(0);

      return {
        ...item,
        dateReq: formattedDate,
      };
    })
    // @ts-ignore
    .sort((a, b) => a.dateReq - b.dateReq)
    .filter((item) =>
      item.dateReq
        .toISOString()
        .includes(currentDate.toISOString().substr(0, 10))
    )
    .filter((item, index) => index % 5 === 0);

  const chartDataProd = filteredDataProd.map((item) => {
    const timestamp = new Date(item.dateReq).getTime();

    return {
      x: timestamp,
      y: Number(item.value.toFixed(2)),
    };
  });
  const filteredDataConso = dataConso
    .map((item) => {
      const itemDate = new Date(item.dateReq);
      itemDate.setHours(itemDate.getHours());

      // Formater la date en heure sans les secondes
      const formattedDate = new Date(itemDate);
      formattedDate.setSeconds(0);
      formattedDate.setMilliseconds(0);

      return {
        ...item,
        dateReq: formattedDate,
      };
    })
    // @ts-ignore
    .sort((a, b) => a.dateReq - b.dateReq)
    .filter((item) =>
      item.dateReq
        .toISOString()
        .includes(currentDate.toISOString().substr(0, 10))
    )
    .filter((item, index) => index % 5 === 0);

  const chartDataConso = filteredDataConso.map((item) => {
    const timestamp = new Date(item.dateReq).getTime();

    return {
      x: timestamp,
      y: Number(item.value.toFixed(2)),
    };
  });

  const startOfDay = new Date(
    currentYear,
    currentMonth - 1,
    currentDay,
    0,
    0,
    0
  );

  const endOfDay = new Date(
    currentYear,
    currentMonth - 1,
    currentDay,
    23,
    59,
    59
  );

  const options = {
    chart: {
      type: "area",
    },
    exporting: {
      enabled: false,
    },
    title: {
      text: "Installation",
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
        text: "kWh",
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
      },
      {
        name: "Production",
        data: chartDataProd,
        color: "#009DE0",
      },
    ],
    tooltip: {
      headerFormat: `{point.key:%Hh%M}<br/>`,
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
    },
  };

  return (
    <div className="block w-[100%] h-[100%]  mb-1">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default AreaChart;
