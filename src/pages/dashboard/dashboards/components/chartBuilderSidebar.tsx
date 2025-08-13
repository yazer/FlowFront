import { Box, Collapse, Grid, IconButton, Typography } from "@mui/material";
import "./components.css";

import Pie from "../../../../assets/dashboard-builder/apx-pie.png";
import AreaStacked from "../../../../assets/dashboard-builder/apx-area-stacked.png";
import Area from "../../../../assets/dashboard-builder/apx-area.png";
import BarGrouped from "../../../../assets/dashboard-builder/apx-bar-grouped.svg";
import BarStacked from "../../../../assets/dashboard-builder/apx-bar-stacked.svg";
import Stacked100 from "../../../../assets/dashboard-builder/apx-bar-stacked100.svg";
import Bubble from "../../../../assets/dashboard-builder/apx-bubble.svg";
import ColumnGrouped from "../../../../assets/dashboard-builder/apx-column-grouped.png";
import ColumnStacked from "../../../../assets/dashboard-builder/apx-column-stacked.png";
import ColumnRange from "../../../../assets/dashboard-builder/apx-column-range.png";
import Donut from "../../../../assets/dashboard-builder/apx-donut.png";
import Funnel from "../../../../assets/dashboard-builder/apx-funnel.png";
import HeatMap from "../../../../assets/dashboard-builder/apx-heatmap.svg";
import Lines from "../../../../assets/dashboard-builder/apx-lines.png";
import PolarArea from "../../../../assets/dashboard-builder/apx-polar-area.svg";
import Radar from "../../../../assets/dashboard-builder/apx-radar.svg";
import RadialBar from "../../../../assets/dashboard-builder/apx-radialbar.svg";
import Scatter from "../../../../assets/dashboard-builder/apx-scatter.svg";
import SlopeChart from "../../../../assets/dashboard-builder/apx-slope-chart.png";
import Spline from "../../../../assets/dashboard-builder/apx-spline.png";
import Timeline from "../../../../assets/dashboard-builder/apx-timeline.png";
import Treemap from "../../../../assets/dashboard-builder/apx-treemap.png";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useMemo, useState } from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { TypeDataSetOptions } from "../dashboards";
import Dropdown from "../../../../components/Dropdown/Dropdown";
import Input from "../../../../components/Input/Input";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";

export const chartImages = [
  { id: 1, name: "Pie", image: Pie },
  { id: 2, name: "Area Stacked", image: AreaStacked },
  { id: 3, name: "Area", image: Area },
  { id: 11, name: "Donut", image: Donut },
  //   { id: 4, name: "Bar Grouped", image: BarGrouped },
  //   { id: 5, name: "Bar Stacked", image: BarStacked },
  //   { id: 6, name: "Bar Stacked 100", image: Stacked100 },
  //   { id: 7, name: "Bubble", image: Bubble },
  { id: 8, name: "Column Grouped", image: ColumnGrouped },
  { id: 9, name: "Column Stacked", image: ColumnStacked },
  { id: 14, name: "Lines", image: Lines },
  { id: 10, name: "Column Range", image: ColumnRange },
  { id: 12, name: "Funnel", image: Funnel },
  //   { id: 13, name: "HeatMap", image: HeatMap },
  //   { id: 15, name: "Polar Area", image: PolarArea },
  //   { id: 16, name: "Radar", image: Radar },
  //   { id: 17, name: "Radial Bar", image: RadialBar },
  //   { id: 18, name: "Scatter", image: Scatter },
  { id: 19, name: "Slope Chart", image: SlopeChart },
  { id: 20, name: "Spline", image: Spline },
  { id: 21, name: "Timeline", image: Timeline },
  { id: 22, name: "Treemap", image: Treemap },
];

export type DataSetProps = {
  dataSetOptions: TypeDataSetOptions;
  dataSetList: Array<any>;
  selectedDataSet: string;
  setSelectedDataSet: Function;
  handleDataSetChange: (dataSet: string) => void;
};

export default function ChartBuilderSidebar({
  dataSetOptions,
  dataSetList,
  selectedDataSet,
  setSelectedDataSet,
  handleDataSetChange,
}: DataSetProps) {
  const [isVisualTypes, setIsVisualTypes] = useState(false);
  const [searchText, setSearchText] = useState("");

  const columnList = useMemo(
    () =>
      Object.keys(dataSetList[0] ?? {}).filter((x) => x.includes(searchText)),
    [dataSetList, searchText]
  );

  return (
    <div className="border-l border-gray-200 h-full w-[250px]">
      <div className={`${isVisualTypes ? "h-[60%]" : "h-[90%]"}`}>
        <div className="p-4">
          <Dropdown
            value={selectedDataSet}
            name={"datasetdropdown"}
            label="Dataset"
            onChange={(e) => handleDataSetChange(e.target.value)}
            options={dataSetOptions.map((opt) => ({
              value: opt.id,
              label: opt.name,
            }))}
          />

          <div>
            <Input
              name={"field_search"}
              label="Fields list"
              placeHolder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            
            <div>
              {columnList?.map((item) => (
                <div className="flex item-center justify-start gap-2 p-1">
                  <LabelOutlinedIcon />
                  <Typography fontSize={"14px"}>{item}</Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`border-t border-gray-200 ${
          isVisualTypes ? "h-[40%]" : "h-[10%]"
        }`}
        style={{ padding: "8px 16px 16px 16px" }}
      >
        <div className="flex items-center justify-between mb-4">
          <Typography fontWeight={500}>Visual types</Typography>
          <IconButton onClick={() => setIsVisualTypes(!isVisualTypes)}>
            {isVisualTypes ? (
              <KeyboardDoubleArrowUpIcon />
            ) : (
              <KeyboardDoubleArrowDownIcon />
            )}
          </IconButton>
        </div>
        <Droppable droppableId="external" isDropDisabled={true}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ marginBottom: "20px" }}
            >
              <Collapse in={isVisualTypes}>
                <Grid container rowSpacing={4}>
                  {chartImages.map((item, index) => (
                    <Draggable
                      draggableId={item.name}
                      index={index}
                      key={item.id}
                      isDragDisabled={!selectedDataSet}
                    >
                      {(provided) => (
                        <Grid
                          item
                          xs={2.4}
                          lg={2.4}
                          sm={2.4}
                          md={2.4}
                          xl={2.4}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Box className={"chart_image_container"}>
                            <img
                              style={{
                                filter: selectedDataSet
                                  ? "none"
                                  : "grayscale(70%) brightness(0.6) contrast(0.5)",
                              }}
                              className={"chart_image"}
                              src={item.image}
                              alt={"Chart Image" + item.id}
                            ></img>
                          </Box>
                        </Grid>
                      )}
                    </Draggable>
                  ))}
                </Grid>
              </Collapse>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}
