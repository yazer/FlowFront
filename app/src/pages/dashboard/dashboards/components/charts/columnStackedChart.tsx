import { memo, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import ReactApexcharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const columnColors = {
  bg: "#f8d3ff",
  series1: "#826af9",
  series2: "#d2b0ff",
};

const series = [
  {
    name: "Apple",
    data: [90, 120, 55, 100, 80, 125, 175, 70, 88],
  },
  {
    name: "Samsung",
    data: [85, 100, 30, 40, 95, 90, 30, 110, 62],
  },
];

const ColumnStackedChart = () => {
  const theme = useTheme();

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        offsetX: -10,
        stacked: true,
        parentHeightOffset: 0,
        toolbar: { show: false },
        redrawOnParentResize: true,
        style: {
          minHeight: "unset", 
        },
      },
      fill: { opacity: 1 },
      dataLabels: { enabled: false },
      colors: [columnColors.series1, columnColors.series2],
      legend: {
        position: "top",
        horizontalAlign: "left",
        labels: { colors: theme.palette.text.secondary },
        markers: {
          offsetY: 1,
          offsetX: -3,
        },
        itemMargin: {
          vertical: 3,
          horizontal: 10,
        },
      },
      stroke: {
        show: true,
        colors: ["transparent"],
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          colors: {
            // backgroundBarRadius: 10,
            backgroundBarColors: [
              columnColors.bg,
              columnColors.bg,
              columnColors.bg,
              columnColors.bg,
              columnColors.bg,
            ],
          },
        },
      },
      grid: {
        borderColor: theme.palette.divider,
        xaxis: {
          lines: { show: true },
        },
      },
      yaxis: {
        labels: {
          style: { colors: theme.palette.text.disabled },
        },
      },
      xaxis: {
        axisBorder: { show: false },
        axisTicks: { color: theme.palette.divider },
        categories: [
          "7/12",
          "8/12",
          "9/12",
          "10/12",
          "11/12",
          "12/12",
          "13/12",
          "14/12",
          "15/12",
        ],
        crosshairs: {
          stroke: { color: theme.palette.divider },
        },
        labels: {
          style: { colors: theme.palette.text.disabled },
        },
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "35%",
              },
            },
          },
        },
      ],
    }),
    [theme]
  );

  return <ReactApexcharts type="bar" options={options} series={series} width="100%"
  height="100%"/>;
};

export default memo(ColumnStackedChart);
