
import { useTheme } from '@mui/material/styles'
import ReactApexcharts from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { memo, useMemo } from 'react'

const BarChart = () => {
  const theme = useTheme()

  const options: ApexOptions = useMemo(() => ({
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      redrawOnParentResize: true,
      style: {
        minHeight: "unset", 
      },
    },
    colors: ['#00cfe8'],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        // borderRadius: 8,
        barHeight: '30%',
        horizontal: true,
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: false },
      },
      padding: {
        top: -10,
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
        'MON, 11',
        'THU, 14',
        'FRI, 15',
        'MON, 18',
        'WED, 20',
        'FRI, 21',
        'MON, 23',
      ],
      labels: {
        style: { colors: theme.palette.text.disabled },
      },
    },
  }), [theme]);

    return (
        <ReactApexcharts
          type='bar'
          options={options}
          series={[{ data: [700, 350, 480, 600, 210, 550, 150] }]}
          width="100%"
          height="100%"
        />
  )
}

export default memo(BarChart)
