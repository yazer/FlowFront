import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import ChartBuilderSidebar from "./components/chartBuilderSidebar";
import { Stack } from "@mui/material";
import ChartArea from "./components/chartArea";
import DynamicTabMenu from "./components/sheetTabmenu";
import {
  getGraphBuilderChartDetails,
  getGraphBuilderSheet,
  getGraphDataSet,
  getGraphListByDataSet,
  UpdateGraphBuilderChartDetails,
} from "../../../apis/graphBuilder";

export type sheetType = {
  sheetId: number;
  sheetName: string;
};

export type chartType = {
  chartType: string;
  width: number | string;
  height: number | string;
};

export type SheetConfig = {
  chartType: string;
  width: number;
  height: number;
  options: Record<string, unknown>;
  id: string;
};

export type TypeChartDetails = Record<number, SheetConfig[]>;

export type TypeDataSetOptions = Array<{ name: string; id: string }>;

const App = () => {
  const [sheets, setSheets] = useState<sheetType[]>([
    { sheetId: 1, sheetName: "Sheet 1" },
  ]);
  const [selectedTab, setSelectedTab] = useState(1);
  const [chartDetails, setChartDetails] = useState<TypeChartDetails>({});
  const [selectedDataSet, setSelectedDataSet] = useState<string>("");
  const [dataSetOptions, setDataSetOptions] = useState<TypeDataSetOptions>([
    { name: "Report", id: "1" },
    { name: "Sales Pipeline", id: "2" },
  ]);
  const [dataSetList, setDataSetList] = useState<Array<unknown>>([]);

  const fetchDataSet = async () => {
    try {
      const res = await getGraphDataSet();
      setDataSetOptions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchListByDataSet = async (dataSet: string) => {
    try {
      const res = await getGraphListByDataSet(dataSet);

      setDataSetList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSheetsList = async () => {
    try {
      const res = await getGraphBuilderSheet();
      setSheets(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChartDetails = async () => {
    try {
      const res = await getGraphBuilderChartDetails();
      setChartDetails(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateChartDetails = async (payload: TypeChartDetails) => {
    try {
      const res = await UpdateGraphBuilderChartDetails(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const updateSheetList = async (payload: sheetType[]) => {
    try {
      const res = await UpdateGraphBuilderChartDetails(payload);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   fetchSheetsList()
  //   fetchChartDetails()
  //   fetchDataSet()
  // } , [])

  const handleOnDragEnd = (result: DropResult) => {
    const selectedChartSheet = chartDetails?.[selectedTab] ?? [];
    let payload = {};
    if (!result.destination) return;

    if (result.source.droppableId === "external") {
      const newItem = {
        id: "id" + result.draggableId + new Date().getTime(),
        chartType: result.draggableId ?? "",
        width: 400,
        height: 300,
        options: {},
      };
      const updatedItems = Array.from(selectedChartSheet);
      updatedItems.splice(result.destination.index, 0, newItem);
      payload = { ...chartDetails, [selectedTab]: updatedItems };
      setChartDetails(payload);
    } else {
      const reorderedItems = Array.from(selectedChartSheet);
      const [movedItem] = reorderedItems.splice(result.source.index, 1);
      reorderedItems.splice(result.destination.index, 0, movedItem);
      payload = { ...chartDetails, [selectedTab]: reorderedItems };
      setChartDetails(payload);
    }
    // updateChartDetails(payload)
  };

  const handleDataSetChange = (dataSet: string) => {
    setSelectedDataSet(dataSet);
    if (dataSet === "1") {
      setDataSetList(reportsList);
    } else {
      setDataSetList(salesPipeline);
    }
    // fetchListByDataSet(dataSet)
  };

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Stack
          direction={"row"}
          height={"100%"}
          justifyContent={"space-between"}
        >
          <div className="w-[calc(100vw_-_500px)]">
            <DynamicTabMenu
              sheets={sheets}
              setSelectedTab={setSelectedTab}
              selectedTab={selectedTab}
              setSheets={setSheets}
              updateSheetList={updateSheetList}
              fetchSheetsList={fetchSheetsList}
            >
              <ChartArea
                sheets={sheets}
                chartDetails={chartDetails}
                setChartDetails={setChartDetails}
                selectedTab={selectedTab}
                fetchChartDetails={fetchChartDetails}
                updateChartDetails={updateChartDetails}
              ></ChartArea>
            </DynamicTabMenu>
          </div>
          <ChartBuilderSidebar
            dataSetOptions={dataSetOptions}
            dataSetList={dataSetList}
            selectedDataSet={selectedDataSet}
            setSelectedDataSet={setSelectedDataSet}
            handleDataSetChange={handleDataSetChange}
          ></ChartBuilderSidebar>
        </Stack>{" "}
      </DragDropContext>
    </>
  );
};

export default App;

const salesPipeline = [
  {
    id: "1",
    stage: "Lead",
    name: "John Doe",
    company: "Tech Innovators",
    contact: "john.doe@example.com",
    value: 5000,
    status: "Contacted",
  },
  {
    id: "2",
    stage: "Lead",
    name: "Jane Smith",
    company: "Creative Solutions",
    contact: "jane.smith@example.com",
    value: 3000,
    status: "New",
  },
  {
    id: "3",
    stage: "Qualified",
    name: "Michael Johnson",
    company: "Global Ventures",
    contact: "michael.j@example.com",
    value: 10000,
    status: "Negotiating",
  },
  {
    id: "4",
    stage: "Proposal Sent",
    name: "Emily Davis",
    company: "StartUp Co.",
    contact: "emily.d@example.com",
    value: 2000,
    status: "Awaiting Response",
  },
  {
    id: "5",
    stage: "Closed",
    name: "William Brown",
    company: "Retail World",
    contact: "william.b@example.com",
    value: 15000,
    status: "Won",
  },
  {
    id: "6",
    stage: "Lost",
    name: "Sarah Wilson",
    company: "EduCorp",
    contact: "sarah.w@example.com",
    value: 4000,
    status: "Lost",
  },
];

const reportsList = [
  {
    id: "101",
    title: "Monthly Sales Report",
    date: "2024-11-01",
    author: "John Doe",
    summary: "A detailed overview of monthly sales performance.",
    totalSales: 50000,
    unitsSold: 1200,
    highestRegion: "North America",
  },
  {
    id: "102",
    title: "Customer Feedback Report",
    date: "2024-10-15",
    author: "Jane Smith",
    summary: "Analysis of customer feedback and satisfaction scores.",
    positiveFeedback: 85,
    negativeFeedback: 10,
    neutralFeedback: 5,
  },
  {
    id: "103",
    title: "Quarterly Performance Report",
    date: "2024-09-30",
    author: "Michael Johnson",
    summary: "A review of the company’s performance over the last quarter.",
    revenue: 150000,
    profitMargin: 20,
    newClients: 35,
  },
  {
    id: "104",
    title: "Product Launch Metrics",
    date: "2024-08-20",
    author: "Emily Davis",
    summary: "Metrics from the recent product launch campaign.",
    unitsSold: 500,
    adClicks: 12000,
    conversionRate: 4.2,
  },
  {
    id: "105",
    title: "Annual Revenue Report",
    date: "2024-12-31",
    author: "William Brown",
    summary: "Comprehensive revenue analysis for the fiscal year.",
    totalRevenue: 600000,
    growthRate: 15,
    topProduct: "Smartwatch Pro",
  },
];
