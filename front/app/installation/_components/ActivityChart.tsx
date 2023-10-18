import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import solidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsExporting from "highcharts/modules/exporting";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
  HighchartsMore(Highcharts);
  solidGauge(Highcharts);
}

interface ActivityChartProps {
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

const ActivityChart = ({ dataConso, dataProd }: ActivityChartProps) => {
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    const parentElement = document.getElementById("activityContainer");
    const parentWidth = parentElement?.offsetWidth;
    const parentHeight = parentElement?.offsetHeight;

    const x = parentWidth ? parentWidth / 2 : 0;
    const y = parentHeight ? parentHeight / 2 : 0;

    // Filtrer les données pour le jour en cours
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate() - 1;

    const filteredDataConsoJournaliere = dataConso.filter((item: any) => {
      const itemDate = new Date(item.dateReq);
      return (
        itemDate.getFullYear() === currentYear &&
        itemDate.getMonth() + 1 === currentMonth &&
        itemDate.getDate() === currentDay
      );
    });

    const filteredDataProdJournaliere = dataProd.filter((item: any) => {
      const itemDate = new Date(item.dateReq);
      return (
        itemDate.getFullYear() === currentYear &&
        itemDate.getMonth() + 1 === currentMonth &&
        itemDate.getDate() === currentDay
      );
    });

    const productionJournaliere = filteredDataProdJournaliere.reduce(
      (acc: number, item: any) => acc + item.value,
      0
    );
    const consommationJournaliere = filteredDataConsoJournaliere.reduce(
      (acc: number, item: any) => acc + item.value,
      0
    );

    const calculateAutoconsumptionRate = (
      dailyProduction: number,
      dailyConsumption: number
    ) => {
      if (dailyProduction > 0 && dailyConsumption > 0) {
        if (dailyProduction > dailyConsumption) {
          return Math.round((dailyConsumption / dailyProduction) * 100);
        } else {
          return Math.round((dailyProduction / dailyConsumption) * 100);
        }
      }
      return 0;
    };

    const tauxAutoconsommationJournalier = calculateAutoconsumptionRate(
      productionJournaliere,
      consommationJournaliere
    );

    // Filtrer les données pour le mois en cours
    const filteredDataConsoMensuelle = dataConso.filter((item: any) => {
      const itemDate = new Date(item.dateReq);
      return (
        itemDate.getFullYear() === currentYear &&
        itemDate.getMonth() + 1 === currentMonth
      );
    });

    const filteredDataProdMensuelle = dataProd.filter((item: any) => {
      const itemDate = new Date(item.dateReq);
      return (
        itemDate.getFullYear() === currentYear &&
        itemDate.getMonth() + 1 === currentMonth
      );
    });

    const productionMensuelle = filteredDataProdMensuelle.reduce(
      (acc: number, item: any) => acc + item.value,
      0
    );
    const consommationMensuelle = filteredDataConsoMensuelle.reduce(
      (acc: number, item: any) => acc + item.value,
      0
    );

    calculateAutoconsumptionRate(productionMensuelle, consommationMensuelle);

    const tauxAutoconsommationMensuel = calculateAutoconsumptionRate(
      productionMensuelle,
      consommationMensuelle
    );

    // Filtrer les données pour l'année en cours
    const filteredDataConsoAnnuelle = dataConso.filter((item: any) => {
      const itemDate = new Date(item.dateReq);
      return itemDate.getFullYear() === currentYear;
    });

    const filteredDataProdAnnuelle = dataProd.filter((item: any) => {
      const itemDate = new Date(item.dateReq);
      return itemDate.getFullYear() === currentYear;
    });

    const productionAnnuelle = filteredDataProdAnnuelle.reduce(
      (acc: number, item: any) => acc + item.value,
      0
    );
    const consommationAnnuelle = filteredDataConsoAnnuelle.reduce(
      (acc: number, item: any) => acc + item.value,
      0
    );

    const tauxAutoconsommationAnnuel = calculateAutoconsumptionRate(
      productionAnnuelle,
      consommationAnnuelle
    );

    const options = {
      chart: {
        type: "solidgauge",
      },
      exporting: {
        enabled: false,
      },
      title: {
        text: null,
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            enabled: false,
          },
          linecap: "round",
          stickyTracking: false,
          rounded: true,
        },
      },
      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: [],
      },
      tooltip: {
        borderWidth: 0,
        backgroundColor: "none",
        shadow: false,
        style: {
          fontSize: "16px",
        },
        positioner: function () {
          return { x: x - 45, y: y - 70 };
        },
        valueSuffix: "%",
        pointFormat:
          '<div style="text-align: center; display: flex; align-items: center; justify-content: center;">{series.name}<br><span style="text-align: center; font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span></div>',
        max: 100,
        lineWidth: 0,
        tickPositions: [],
      },
      pane: {
        startAngle: 0,
        endAngle: 360,
        background: [
          {
            outerRadius: "112%",
            innerRadius: "88%",
            backgroundColor: Highcharts.color("#04276E").setOpacity(0.3).get(),
            borderWidth: 0,
          },
          {
            outerRadius: "87%",
            innerRadius: "63%",
            backgroundColor: Highcharts.color("#009DE0").setOpacity(0.3).get(),
            borderWidth: 0,
          },
          {
            outerRadius: "62%",
            innerRadius: "38%",
            backgroundColor: Highcharts.color("#04276E").setOpacity(0.3).get(),
            borderWidth: 0,
          },
        ],
      },
      series: [
        {
          name: "Journalière",
          overshoot: 100,
          data: [
            {
              color: "#04276E",
              radius: "112%",
              innerRadius: "88%",
              y: tauxAutoconsommationJournalier,
            },
          ],
          lineWidth: 2,
          borderColor: "#000",
        },
        {
          name: "Mensuelle",
          overshoot: 100,
          data: [
            {
              color: "#009DE0",
              radius: "87%",
              innerRadius: "63%",
              y: tauxAutoconsommationMensuel,
            },
          ],
          lineWidth: 2,
          borderColor: "#000",
        },
        {
          name: "Annuelle",
          overshoot: 100,
          data: [
            {
              color: "#04276E",
              radius: "62%",
              innerRadius: "38%",
              y: tauxAutoconsommationAnnuel,
            },
          ],
          lineWidth: 2,
          borderColor: "#000",
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
    setOptions(options);
  }, [dataConso, dataProd]);

  return (
    <div className="block w-[100%] h-[100%]  mb-1">
      <div className="subtitle-container flex pt-2  flex-col items-center justify-center bg-white mr-[1px] ">
        <h2 className="text-xl font-bold text-primary mb-6">
          Autoconsommation
        </h2>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ActivityChart;
