import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const AreaChart = () => {
  const randomConsommation: any[] = [];
  const setrandomConsommation = () => {
    while (randomConsommation.length < 24) {
      const randomNumber = Math.floor(Math.random() * 100); // Change 100 to the range you want
      if (!randomConsommation.includes(randomNumber)) {
        randomConsommation.push(randomNumber);
      }
    }

    return randomConsommation;
  };
  const randomProduction: any[] = [];
  const setrandomProduction = () => {
    while (randomProduction.length < 24) {
      const randomNumber = Math.floor(Math.random() * 100); // Change 100 to the range you want
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
      type: "area",
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
      title: {
        text: "Heures",
      },
      categories: Array.from({ length: 25 }, (_, i) => (i + 1).toString()),
      max: 23,
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
  };

  return (
    <div className="flex w-full h-[400px]">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default AreaChart;
