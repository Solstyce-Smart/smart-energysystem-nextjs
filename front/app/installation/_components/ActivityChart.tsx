"use client";

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

const ActivityChart = () => {
  const [options, setOptions] = useState<any>(null);
  useEffect(() => {
    const parentElement = document.getElementById("activityContainer");
    const parentWidth = parentElement?.offsetWidth;
    const parentHeight = parentElement?.offsetHeight;

    const x = parentWidth ? parentWidth / 2 : 0;
    const y = parentHeight ? parentHeight / 2 : 0;

    const options = {
      chart: {
        type: "solidgauge",
      },
      exporting: {
        enabled: false,
      },

      title: {
        text: "Autoconsommation",
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
          return { x: x - 40, y: y - 20 };
        },
        valueSuffix: "%",
        pointFormat:
          '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',

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
          data: [
            {
              color: "#04276E",
              radius: "112%",
              innerRadius: "88%",
              y: 80,
            },
          ],
        },
        {
          name: "Mensuelle",
          data: [
            {
              color: "#009DE0",
              radius: "87%",
              innerRadius: "63%",
              y: 27,
            },
          ],
        },
        {
          name: "Annuelle",
          data: [
            {
              color: "#04276E",
              radius: "62%",
              innerRadius: "38%",
              y: 27,
            },
          ],
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
    setOptions(options);
  }, []);

  return (
    <div className="block w-[100%] h-[100%]">
      <HighchartsReact highcharts={Highcharts} options={options} id="test" />
    </div>
  );
};
export default ActivityChart;
