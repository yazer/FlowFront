// ** React Imports
import { ApexOptions } from 'apexcharts'

import ReactApexcharts from 'react-apexcharts'
import { useTheme } from '@mui/material/styles'
import { memo, useMemo } from 'react'

const areaColors = {
  series1: '#ab7efd',
  series2: '#b992fe',
  series3: '#e0cffe'
}



const AreaChart = () => {

  const theme = useTheme()

  const series = useMemo(
    () => [
      {
        name: 'Visits',
        data: [100, 120, 90, 170, 130, 160, 140, 240, 220, 180, 270, 280, 375],
      },
      {
        name: 'Clicks',
        data: [60, 80, 70, 110, 80, 100, 90, 180, 160, 140, 200, 220, 275],
      },
      {
        name: 'Sales',
        data: [20, 40, 30, 70, 40, 60, 50, 140, 120, 100, 140, 180, 220],
      },
    ],
    []
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        parentHeightOffset: 0,
        toolbar: { show: false },
        redrawOnParentResize: true,
        style: {
          minHeight: "unset", 
        },
      },
      tooltip: { shared: false },
      dataLabels: { enabled: false },
      stroke: {
        show: false,
        curve: 'straight',
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
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
      colors: [areaColors.series3, areaColors.series2, areaColors.series1],
      fill: {
        opacity: 1,
        type: 'solid',
      },
      grid: {
        show: true,
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
        crosshairs: {
          stroke: { color: theme.palette.divider },
        },
        labels: {
          style: { colors: theme.palette.text.disabled },
        },
        categories: [
          '7/12',
          '8/12',
          '9/12',
          '10/12',
          '11/12',
          '12/12',
          '13/12',
          '14/12',
          '15/12',
          '16/12',
          '17/12',
          '18/12',
          '19/12',
        ],
      },
    }),
    [theme]
  );




  return (
        <ReactApexcharts type='area' options={options} series={series} width="100%"
        height="100%"/>
  )
}

export default memo(AreaChart)
