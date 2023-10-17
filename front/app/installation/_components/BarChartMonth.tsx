import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const BarChartMonth = () => {
  const randomConsommation: any[] = [];
  const setrandomConsommation = () => {
    while (randomConsommation.length < 12) {
      const randomNumber = Math.floor(Math.random() * 100);
      if (!randomConsommation.includes(randomNumber)) {
        randomConsommation.push(randomNumber);
      }
    }

    return randomConsommation;
  };
  const randomProduction: any[] = [];
  const setrandomProduction = () => {
    while (randomProduction.length < 12) {
      const randomNumber = Math.floor(Math.random() * 100);
      if (!randomProduction.includes(randomNumber)) {
        randomProduction.push(randomNumber);
      }
    }

    return randomProduction;
  };

  setrandomConsommation();
  setrandomProduction();

  const options = {
    chart: {
      type: "column",
    },
    exporting: {
      enabled: false,
    },

    title: {
      text: "Installation",
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
        data: randomConsommation,
        color: "#009DE0",
      },
      {
        name: "Production",
        data: randomProduction,
        color: "#04276E",
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
    <div className="block w-[100%] h-[100%] items-center justify-center">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BarChartMonth;
