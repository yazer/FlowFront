import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Box, Card, CardContent, Grid, IconButton, Stack } from "@mui/material";
import ColumnChart from "./charts/columnChart";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import "react-resizable/css/styles.css";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { TypeChartDetails } from "../dashboards";
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AreaChart from "./charts/areaChart";
import PieChart from "./charts/pieChart";
import ColumnStackedChart from "./charts/columnStackedChart";
import AreaStackedChart from "./charts/areaStacked";
import DonutChart from "./charts/donutChart";
import LineChart from "./charts/lineChart";
import BarChart from "./charts/barChart";


type ChartAreaProps = {
  sheets: any[];
  chartDetails: TypeChartDetails;
  setChartDetails: Dispatch<SetStateAction<TypeChartDetails>>;
  selectedTab: number;
  updateChartDetails: (payload : TypeChartDetails) => Promise<void>  
  fetchChartDetails: () => Promise<void> 
};

function ChartArea({
  sheets,
  chartDetails,
  setChartDetails,
  selectedTab,
  updateChartDetails,  
  fetchChartDetails
}: ChartAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null); // Reference for the parent container

  const [maxWidth, setMaxWidth] = useState(window.innerWidth);
  const [selectedChart, setSelectedChart] = useState("");

  useEffect(() => {
    const calculateMaxWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setMaxWidth(containerWidth);
      }
    };

    calculateMaxWidth(); 
    window.addEventListener("resize", calculateMaxWidth);

    return () => window.removeEventListener("resize", calculateMaxWidth);
  }, []);

  useEffect(() => {
    if (selectedChart) {
      setSelectedChart("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  const handleResize = (
    event: SyntheticEvent,
    { size }: ResizeCallbackData,
    currentId: string
  ) => {
    // const ASPECT_RATIO = 4 / 3;
    // const adjustedHeight = size.width / ASPECT_RATIO;

    const updatedWidthItem = chartDetails?.[selectedTab].map((x) =>
      x.id === currentId
        ? {
            ...x,
            width: size.width,
            height: size.height,
          }
        : x
    );

    let editedDetails = {
      ...chartDetails,
      [selectedTab]: updatedWidthItem,
    }
    setChartDetails(editedDetails);
    // updateChartDetails(editedDetails)
  };

  const handleDeleteChart = (chartId: string) => {
    const updatedChartDetails = chartDetails?.[selectedTab].filter(
      (x) => x.id !== chartId
    );

    let editedDetails = {
      ...chartDetails,
      [selectedTab]: updatedChartDetails,
    }

    setChartDetails(editedDetails);
    // updateChartDetails(editedDetails)
    setSelectedChart("");
  };

  const renderCharts: Record<string, React.ReactNode> = useMemo(
    () => ({
      Pie: <PieChart />,
      "Area Stacked": <AreaStackedChart />,
      Lines: <LineChart />,
      "Column Grouped": <ColumnChart />,
      "Column Stacked": <ColumnStackedChart />,
      Area: <AreaChart />,
      Donut: <DonutChart />,
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [chartDetails]
  );

   const combineRefs = (...refs: any[]) => (node: HTMLElement | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object") {
        ref.current = node;
      }
    });
  };

  return (
    <Droppable droppableId="droppable-list">
      {(provided) => (
        <div
          ref={combineRefs(provided.innerRef, containerRef)}
          {...provided.droppableProps}
          style={{
            listStyle: "none",
            padding: 10,
            background: "#f8f5f5",
            border: "1px solid #ccc",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "none",
            marginTop: "-1px",
            height: "calc(100vh - 106px)",
            overflowY: "auto",
          }}
        >
          <Grid container wrap="wrap" spacing={1}>
            {chartDetails?.[selectedTab]?.map((item, index) => (
              <Draggable key={item?.id} draggableId={item?.id} index={index}>
                {(provided) => (
                  <Grid
                    item
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <ResizableBox
                      width={item.width}
                      height={item.height}
                      resizeHandles={["se"]}
                      onResizeStop={(e, data) =>
                        handleResize(e, data, item?.id)
                      }
                      minConstraints={[400, 300]}
                      maxConstraints={[maxWidth - 20, 800]}
                    >
                      <Card
                        onClick={() => setSelectedChart(item?.id)}
                        className={`chart_card ${
                          selectedChart === item?.id && "selected_chart"
                        }`}
                        elevation={0}
                        sx={{
                          border: "1px solid #e0e0e0",
                          backgroundColor: "#f9f9f9",
                          height: "100%",
                          width: "100%",
                          transition: "0.3s",
                        }}
                        onBlur={() => setSelectedChart("")}
                      >
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          {" "}
                          <IconButton
                            disableFocusRipple
                            disableRipple
                            {...provided.dragHandleProps}
                          >
                            <DragHandleIcon className="text-gray-500" />
                          </IconButton>
                        </Box>
                        <CardContent sx={{ zIndex: 20, height: "100%" }}>
                          <Box height={"90%"}>
                            {renderCharts?.[item?.chartType] ?? (
                              <ColumnChart
                                width={item.width}
                                height={item.width}
                              />
                            )}
                          </Box>
                        </CardContent>
                        {selectedChart === item?.id && (
                          <Box className="chart_controls_popup">
                            <Stack
                              direction={"column"}
                              gap={"5px"}
                              alignItems={"center"}
                              justifyContent={"center"}
                            >
                              <IconButton
                                sx={{
                                  padding: "5px",
                                  "&:hover": {
                                    backgroundColor: "transparent",
                                  },
                                }}
                                onClick={() => handleDeleteChart(item.id)}
                              >
                                <DeleteOutlineOutlinedIcon
                                  fontSize="small"
                                  sx={{
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    "&:hover": {
                                      opacity: 0.9,
                                    },
                                  }}
                                />
                              </IconButton>
                            </Stack>
                          </Box>
                        )}
                      </Card>
                    </ResizableBox>
                  </Grid>
                )}
              </Draggable>
            ))}
          </Grid>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default ChartArea;