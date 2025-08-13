import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Style, Icon, Stroke, Fill } from "ol/style";
import { Feature } from "ol";
import { Point, Polygon, LineString, Circle as CircleGeom } from "ol/geom";
import { Coordinate } from "ol/coordinate";
import Circle from "ol/geom/Circle";


const MapPreview = ({
 shapeData,
  height,
  width,
}: {
  shapeData: any;
  height: string;
  width: string;
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const feature = new Feature();
    let geometry: any;
    let center: Coordinate = [0, 0]; // fallback center

    switch (shapeData.type) {
      case "Point": {
        geometry = new Point(shapeData.coordinates as Coordinate);
        center = shapeData.coordinates;
        feature.setStyle(
          new Style({
            image: new Icon({
              anchor: [0.5, 1],
              src: "https://openlayers.org/en/latest/examples/data/icon.png",
            }),
          })
        );
        break;
      }

      case "Polygon": {
        let coordinates = shapeData.coordinates;

        // Normalize if not wrapped
        if (!Array.isArray(coordinates[0][0])) {
          coordinates = [coordinates];
        }

        geometry = new Polygon(coordinates as Coordinate[][]);
        center = coordinates[0][0]; // Use first point
        feature.setStyle(
          new Style({
            stroke: new Stroke({ color: "red", width: 2 }),
            fill: new Fill({ color: "rgba(255, 0, 0, 0.3)" }),
          })
        );
        break;
      }

      case "LineString": {
        geometry = new LineString(shapeData.coordinates as Coordinate[]);
        center = shapeData.coordinates[0]; // First point of line
        feature.setStyle(
          new Style({
            stroke: new Stroke({ color: "blue", width: 2 }),
          })
        );
        break;
      }

      case "Circle": {
        if (shapeData.center && shapeData.radius) {
          geometry = new CircleGeom(shapeData.center, shapeData.radius);
          center = shapeData.center;
          feature.setStyle(
            new Style({
              stroke: new Stroke({ color: "green", width: 2 }),
              fill: new Fill({ color: "rgba(0, 255, 0, 0.3)" }),
            })
          );
        } else {
          console.warn("Circle requires center and radius.");
          return;
        }
        break;
      }

      default:
        console.warn("Unsupported geometry type:", shapeData.type);
        return;
    }

    feature.setGeometry(geometry);

    const vectorLayer = new VectorLayer({
      source: new VectorSource({ features: [feature] }),
    });

    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      view: new View({
        center,
        zoom: 10,
      }),
    });

    mapInstance.current = map;

    return () => {
      map.setTarget(undefined);
      mapInstance.current = null;
    };
  }, [shapeData]);

  return <div ref={mapRef} style={{ width, height }} />;
};

export default MapPreview;
