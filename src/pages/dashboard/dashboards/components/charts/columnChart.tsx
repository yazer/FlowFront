
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { memo, useMemo } from "react";


const ColumnChart = ({width , height} : any) => {

  const chartData: ApexOptions = useMemo(() => ({
    chart: {
      type:"line", 
      redrawOnParentResize: true,
      parentHeightOffset: 0,
      style: {
        minHeight: "unset", 
      },
     
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 100]
        // colorStops: []
      }
    },
    legend: {
      // position: '',
      // width: 400
      // position: 'top',
    },
  }),[]);

  return <ReactApexChart type="bar" options={chartData} series={[
    {
      name: "Distance Traveled",
      type: "column",
      data: [440, 505, 414, 571, 227, 413, 201, 352, 652, 320, 257, 160]
    },
    {
      name: "Time Traveled",
      type: "column",
      data: [23, 42, 35, 27, 43, 22, 17, 31, 42, 22, 12, 16]
    }
  ]} 
  width={"100%"}
  height={"100%"}
  />;
};


export default memo(ColumnChart);
