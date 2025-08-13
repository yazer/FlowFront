
import { useTheme } from '@mui/material/styles'
import { ApexOptions } from 'apexcharts'
import { memo, useMemo } from 'react'

import ReactApexcharts from 'react-apexcharts'

const donutColors = { 
  series1: '#fdd835',
  series2: '#00d4bd',
  series3: '#826bf8',
  series4: '#32baff',
  series5: '#ffa1a1'
}

const PieChart = () => {
  // ** Hook
  const theme = useTheme()

  const options : ApexOptions = useMemo(() => (
    {
      chart: {
        redrawOnParentResize: true,
        style: {
          minHeight: "unset", 
        },
      },
      stroke: { width: 0 },
      labels: ['Operational', 'Networking', 'Hiring', 'R&D'],
      colors: [donutColors.series1, donutColors.series5, donutColors.series3, donutColors.series2],
      dataLabels: {
        enabled: true,
        formatter: (val: string) => `${parseInt(val, 10)}%`
      },
      legend: {
        position: 'right',
      //   markers: { offsetX: -3 },
        labels: { colors: theme.palette.text.secondary },
        itemMargin: {
          vertical: 2,
          horizontal: 5
        }
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                fontSize: '1.2rem'
              },
              value: {
                fontSize: '1.2rem',
                color: theme.palette.text.secondary,
                formatter: val => `${parseInt(val, 10)}`
              },
              total: {
                show: true,
                fontSize: '1.2rem',
                label: 'Operational',
                formatter: () => '31%',
                color: theme.palette.text.primary
              }
            }
          }
        }
      },
      responsive: [
        {
          breakpoint: 992,
          options: {
            chart: {
              height: "auto"
            },
            legend: {
              position: "right"
            }
          }
        },
        {
          breakpoint: 576,
          options: {
            chart: {
              height: "auto"
            },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    name: {
                      fontSize: '1rem'
                    },
                    value: {
                      fontSize: '1rem'
                    },
                    total: {
                      fontSize: '1rem'
                    }
                  }
                }
              }
            }
          }
        }
      ]
    }
  ), [theme])


  return (

        <ReactApexcharts type='pie' options={options} series={[85, 16, 50, 50]} width="100%"
        height="100%"/>
  )
}

export default memo(PieChart)
