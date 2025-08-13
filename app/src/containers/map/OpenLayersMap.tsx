import { Feature } from "ol";
import Map from "ol/Map";
import View from "ol/View";
import { Point, Polygon, LineString, Circle } from "ol/geom";
import { Draw } from "ol/interaction";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import "ol/ol.css";
import { OSM, Vector as VectorSource } from "ol/source";
import { Fill, Icon, Stroke, Style } from "ol/style";
import React, { useEffect, useRef, useState } from "react";
import { Stack, Tooltip } from "@mui/material";
import { fromLonLat } from "ol/proj";
import { FaDrawPolygon } from "react-icons/fa";
import { IoAnalyticsOutline } from "react-icons/io5";
import { TbPointFilled } from "react-icons/tb";
import CustomizedInputBase from "./CustomizedSearch";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";
import type { Geometry } from "ol/geom";
import type { DrawEvent, Options as DrawOptions } from "ol/interaction/Draw";
import type { Coordinate } from "ol/coordinate";

export enum GeometryType {
  POINT = "Point",
  LINE_STRING = "LineString",
  LINEAR_RING = "LinearRing",
  POLYGON = "Polygon",
  MULTI_POINT = "MultiPoint",
  MULTI_LINE_STRING = "MultiLineString",
  MULTI_POLYGON = "MultiPolygon",
  GEOMETRY_COLLECTION = "GeometryCollection",
  CIRCLE = "Circle",
}

export interface ShapeData {
  type: GeometryType;
  coordinates: number[][] | number[]; // For point it's a single coordinate, for others it's an array
  center?: number[]; // Optional center point for circle
  radius?: number; // Optional radius for circle in meters
}

const OpenLayersMap = ({
  height,
  width,
  onLocationSelect,
}: {
  height: string;
  width: string;
  onLocationSelect?: (shapeData: ShapeData) => void;
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSource = useRef(new VectorSource());
  const markerSource = useRef(new VectorSource());
  const drawInteraction = useRef<Draw | null>(null);
  const [drawType, setDrawType] = useState<GeometryType | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({
          source: vectorSource.current,
          style: new Style({
            fill: new Fill({ color: "rgba(255, 0, 0, 0.3)" }),
            stroke: new Stroke({ color: "red", width: 2 }),
          }),
        }),
        new VectorLayer({ source: markerSource.current }),
      ],
      view: new View({ center: fromLonLat([0, 0]), zoom: 2 }),
    });

    mapInstance.current.on("click", (event) => {
      const coordinates = event.coordinate;

      if (!drawType) {
        addMarker(coordinates);
      }
    });

    return () => {
      mapInstance.current?.setTarget(undefined);
      mapInstance.current = null;
    };
  }, []);

  const enableDrawing = (type: GeometryType) => {
    if (!mapInstance.current) return;

    if (drawInteraction.current) {
      mapInstance.current.removeInteraction(drawInteraction.current);
    }

    let geometryFunction: DrawOptions["geometryFunction"] | undefined;

    if (type === GeometryType.CIRCLE) {
      geometryFunction = (coordinates: any, geometry?: any): any => {
        const [center, edge] = coordinates;
        const radius = Math.sqrt(
          Math.pow(edge[0] - center[0], 2) + Math.pow(edge[1] - center[1], 2)
        );

        if (!geometry || !(geometry instanceof Circle)) {
          return new Circle(center, radius);
        } else {
          geometry.setCenterAndRadius(center, radius);
          return geometry;
        }
      };
    }

    drawInteraction.current = new Draw({
      source: vectorSource.current,
      type: type === GeometryType.CIRCLE ? "Circle" : type,
      geometryFunction,
    });

    drawInteraction.current.on("drawend", (event: DrawEvent) => {
      const geometry = event.feature.getGeometry();
      if (!geometry) return;

      let shapeData: ShapeData;

      if (drawType === GeometryType.CIRCLE && geometry instanceof Circle) {
        // Circle geometry was drawn with custom geometryFunction
        shapeData = {
          type: GeometryType.CIRCLE,
          center: geometry.getCenter(),
          radius: geometry.getRadius(),
          coordinates: [], // optional or can skip
        };
      } else if (geometry instanceof Point) {
        shapeData = {
          type: GeometryType.POINT,
          coordinates: geometry.getCoordinates(),
        };
      } else if (geometry instanceof LineString) {
        shapeData = {
          type: GeometryType.LINE_STRING,
          coordinates: geometry.getCoordinates(),
        };
      } else if (geometry instanceof Polygon) {
        shapeData = {
          type: GeometryType.POLYGON,
          coordinates: geometry.getCoordinates()[0],
        };
      } else {
        console.warn("Unsupported geometry type");
        return;
      }

      onLocationSelect?.(shapeData);
    });

    mapInstance.current.addInteraction(drawInteraction.current);
    setDrawType(type);
  };

  const clearShapes = () => {
    vectorSource.current.clear();
    markerSource.current.clear();
    if (drawInteraction.current && mapInstance.current) {
      mapInstance.current.removeInteraction(drawInteraction.current);
    }
    setDrawType(null);
  };

  const addMarker = (coordinates: number[]) => {
    markerSource.current.clear();

    const marker = new Feature({ geometry: new Point(coordinates) });
    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
        }),
      })
    );

    markerSource.current.addFeature(marker);
    mapInstance.current?.getView().animate({ center: coordinates, zoom: 10 });

    // Send to parent as a point
    onLocationSelect?.({
      type: GeometryType.POINT,
      coordinates: coordinates,
    });
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lon, lat } = data[0];
        const coordinates = fromLonLat([parseFloat(lon), parseFloat(lat)]);
        addMarker(coordinates);
        mapInstance.current
          ?.getView()
          .animate({ center: coordinates, zoom: 10 });
      } else {
        alert("Location not found!");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <Stack spacing={1.5} direction="row" marginBottom={2}>
          <DrawIcon
            onClick={() => enableDrawing(GeometryType.POINT)}
            icon={<TbPointFilled />}
            type={GeometryType.POINT}
            selected={drawType === GeometryType.POINT}
          />
          <DrawIcon
            onClick={() => enableDrawing(GeometryType.LINE_STRING)}
            icon={<IoAnalyticsOutline />}
            type={GeometryType.LINE_STRING}
            selected={drawType === GeometryType.LINE_STRING}
          />
          <DrawIcon
            onClick={() => enableDrawing(GeometryType.POLYGON)}
            icon={<FaDrawPolygon />}
            type={GeometryType.POLYGON}
            selected={drawType === GeometryType.POLYGON}
          />
          <DrawIcon
            onClick={() => enableDrawing(GeometryType.CIRCLE)}
            icon={<FaRegCircle />}
            type={GeometryType.CIRCLE}
            selected={drawType === GeometryType.CIRCLE}
          />
          <DrawIcon
            onClick={() => clearShapes()}
            icon={<MdOutlineDoNotDisturbAlt />}
            type={"Clear All"}
            selected={!drawType}
          />
        </Stack>
        <CustomizedInputBase
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={searchLocation}
          searchQuery={searchQuery}
          onSelected={(data) => {
            const { lon, lat } = data;
            const coordinates = fromLonLat([parseFloat(lon), parseFloat(lat)]);
            addMarker(coordinates);
            mapInstance.current
              ?.getView()
              .animate({ center: coordinates, zoom: 10 });
          }}
        />
      </div>
      <div ref={mapRef} style={{ width, height }} />
    </div>
  );
};

export default OpenLayersMap;

function DrawIcon({
  onClick,
  icon,
  selected,
  type,
}: {
  onClick: () => void;
  icon: JSX.Element;
  selected?: boolean;
  type: string;
}) {
  return (
    <Tooltip title={type}>
      <button
        onClick={onClick}
        style={{
          fontSize: "20px",
          padding: "5px",
          borderRadius: "4px",
        }}
        className={`${
          selected ? "bg-gray-200" : ""
        } hover:bg-gray-300 color-gray-800`}
      >
        {React.cloneElement(icon, { color: "darkgrey" })}
      </button>
    </Tooltip>
  );
}
