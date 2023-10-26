import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

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
}

const BarChart = ({ dataConso, dataProd }: BarChartProps) => {
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

  const filteredDataConso = Array.from({ length: daysInMonth }, (_, day) => {
    const dayString = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${(day + 1).toString().padStart(2, "0")}`;
    const filteredData = dataConso.filter(
      (item) => item.dateReq.startsWith(dayString) && item.value !== 0
    );
    const totalConso = filteredData.reduce((acc, item, index, array) => {
      if (index > 0) {
        const prevValue = array[index - 1].value;
        const currValue = item.value;
        const hours = 5 / 60;
        const consumption = ((currValue + prevValue) / 2) * hours;
        return acc + Math.abs(consumption);
      }
      return acc;
    }, 0);

    return Math.round(totalConso);
  });

  const filteredDataProd = Array.from({ length: daysInMonth }, (_, day) => {
    const dayString = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${(day + 1).toString().padStart(2, "0")}`;
    const filteredData = dataProd.filter(
      (item) => item.dateReq.startsWith(dayString) && item.value !== 0
    );
    const totalProd = filteredData.reduce((acc, item, index, array) => {
      if (index > 0) {
        const prevValue = array[index - 1].value;
        const currValue = item.value;
        const hours = 5 / 60;
        const production = ((currValue + prevValue) / 2) * hours;
        return acc + Math.abs(production);
      }
      return acc;
    }, 0);
    return Math.round(totalProd);
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
        marker: {
          enabled: false,
        },
        pointPadding: -0.2,
      },
    },
    yAxis: {
      title: {
        text: "kWh",
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
        name: "Consommation",
        data: filteredDataConso,
        color: "#04276E",
      },
      {
        name: "Production",
        data: filteredDataProd,
        color: "#009DE0",
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
    <div className="flex flex-col w-[100%] h-[100%] md:px-8 mb-1">
      <div className="subtitle-container flex pt-2  flex-col items-center justify-center bg-white ">
        <h2 className="text-xl font-bold text-primary">Installation</h2>
        <div className="flex gap-3 justify-center items-center text-center">
          <h3 className="text-md">{formattedDate}</h3>
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BarChart;
