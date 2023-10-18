import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

interface BarChartMonthProps {
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
const BarChartMonth = ({ dataConso, dataProd }: BarChartMonthProps) => {
  // Filtrer les données pour chaque mois de l'année
  const currentDate = new Date();
  const currentYear = new Date().getFullYear();
  const dateToShow = new Date(currentDate);
  dateToShow.setDate(dateToShow.getDate());
  const year = dateToShow.getFullYear();
  const formattedDate = `${year}`;

  const filteredDataConso = Array.from({ length: 12 }, (_, month) => {
    const monthString = `${currentYear}-${(month + 1)
      .toString()
      .padStart(2, "0")}`;
    const filteredData = dataConso.filter((item) =>
      item.dateReq.startsWith(monthString)
    );
    const totalConso = filteredData.reduce((acc, item, index, array) => {
      if (item.value !== 0) {
        if (index > 0) {
          const prevValue = array[index - 1].value;
          const currValue = item.value;
          const hours = 5 / 60;
          const consumption = (Math.abs(currValue + prevValue) / 2) * hours;
          acc += consumption;
        }
      }
      return acc;
    }, 0);
    return totalConso / 1000;
  });

  const filteredDataProd = Array.from({ length: 12 }, (_, month) => {
    const monthString = `${currentYear}-${(month + 1)
      .toString()
      .padStart(2, "0")}`;
    const filteredData = dataProd.filter((item) =>
      item.dateReq.startsWith(monthString)
    );
    const totalProd = filteredData.reduce((acc, item, index, array) => {
      if (item.value !== 0) {
        if (index > 0) {
          const prevValue = array[index - 1].value;
          const currValue = item.value;
          const hours = 5 / 60;
          const production = (Math.abs(currValue + prevValue) / 2) * hours;
          acc += production;
        }
      }
      return acc;
    }, 0);
    return totalProd / 1000;
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
        name: "Consommation",
        data: filteredDataConso.map((item) => parseFloat(item.toFixed(2))),
        color: "#04276E",
      },
      {
        name: "Production",
        data: filteredDataProd.map((value) => parseFloat(value.toFixed(2))),
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
    },
  };

  return (
    <div className="block w-[100%] h-[100%]  mb-1">
      <div className="subtitle-container flex pt-2  flex-col items-center justify-center bg-white mr-[1px] ">
        <h2 className="text-xl font-bold text-primary">Installation</h2>
        <div className="flex gap-3 justify-center items-center text-center">
          <h3 className="text-md">{formattedDate}</h3>
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BarChartMonth;
