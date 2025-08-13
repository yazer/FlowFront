import React from "react";
import { Box, Card, Grid, Typography } from "@mui/material";
import { AttachMoney, People, BarChart, ShowChart } from "@mui/icons-material";

// Dynamically load ApexCharts to avoid server-side rendering issues
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const ProcessDashboard = () => {
  // Line chart data for ApexCharts
  const lineChartOptions: ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    colors: ["#0060AB"],
    stroke: {
      width: 2,
    },
    tooltip: {
      theme: "light",
    },
  };

  const lineChartSeries = [
    {
      name: "Revenue",
      data: [400, 300, 600, 800, 500, 700],
    },
  ];

  // Bar chart data for ApexCharts
  const barChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    colors: ["#0060AB"],
    tooltip: {
      theme: "light",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "50%",
      },
    },
  };

  const barChartSeries = [
    {
      name: "Activity",
      data: [120, 150, 180, 140, 200],
    },
  ];

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#f9f9f9",
        height: "calc(100vh - 68px)",
        overflowY: "auto",
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Process Overview
      </Typography>

      {/* Cards Grid */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="subtitle2" color="textSecondary">
                Total Revenue
              </Typography>
              <AttachMoney sx={{ color: "#0060AB" }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="primary">
              $45,231
            </Typography>
            <Typography variant="caption" color="textSecondary">
              +20.1% from last month
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="subtitle2" color="textSecondary">
                New Users
              </Typography>
              <People sx={{ color: "#0060AB" }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="primary">
              2,345
            </Typography>
            <Typography variant="caption" color="textSecondary">
              +15.5% from last month
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="subtitle2" color="textSecondary">
                Active Sessions
              </Typography>
              <BarChart sx={{ color: "#0060AB" }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="primary">
              1,789
            </Typography>
            <Typography variant="caption" color="textSecondary">
              +12.3% from last month
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="subtitle2" color="textSecondary">
                Conversion Rate
              </Typography>
              <ShowChart sx={{ color: "#0060AB" }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="primary">
              3.24%
            </Typography>
            <Typography variant="caption" color="textSecondary">
              +4.2% from last month
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <Typography variant="h6" fontWeight="bold" sx={{ p: 2 }}>
              Revenue Trends
            </Typography>
            <ReactApexChart
              options={lineChartOptions}
              series={lineChartSeries}
              type="line"
              height={300}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <Typography variant="h6" fontWeight="bold" sx={{ p: 2 }}>
              Daily Activity
            </Typography>
            <ReactApexChart
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
              height={300}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProcessDashboard;
