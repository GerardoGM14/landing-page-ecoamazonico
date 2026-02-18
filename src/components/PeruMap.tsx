import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const geoUrl = "https://raw.githubusercontent.com/juaneladio/peru-geojson/master/peru_departamental_simple.geojson";

interface GeoProperties {
  NOMBDEP?: string;
  NAME_1?: string;
  name?: string;
}

interface GeoObject {
  rsmKey: string;
  properties: GeoProperties;
}

interface PeruMapProps {
  highlightedRegions?: string[];
}

const PeruMap = ({ highlightedRegions = [] }: PeruMapProps) => {
  const [content, setContent] = useState("");

  const handleRegionClick = (geo: GeoObject) => {
    const regionName = geo.properties.NOMBDEP || geo.properties.NAME_1 || geo.properties.name || "Región desconocida";
    // Optional: Add specific interaction for highlighted regions
  };

  const isHighlighted = (geo: GeoObject) => {
    const name = geo.properties.NOMBDEP || geo.properties.NAME_1 || geo.properties.name || "";
    return highlightedRegions.some(region => name.toUpperCase().includes(region.toUpperCase()));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-full relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 2000,
            center: [-75, -9.5]
          }}
          className="w-full h-auto"
        >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo: GeoObject) => {
                  const highlighted = isHighlighted(geo);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content={geo.properties.NOMBDEP || geo.properties.NAME_1 || geo.properties.name || ""}
                      onClick={() => handleRegionClick(geo)}
                      onMouseEnter={() => {
                        setContent(geo.properties.NOMBDEP || geo.properties.NAME_1 || geo.properties.name || "");
                      }}
                      onMouseLeave={() => {
                        setContent("");
                      }}
                      style={{
                        default: {
                          fill: highlighted ? "#C4EA10" : "#D6D6DA", // Highlighted regions in eco-lime, others in gray
                          stroke: "#FFFFFF",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: highlighted ? "#a3c20d" : "#C4EA10", // Darker on hover if highlighted, else eco-lime
                          stroke: "#FFFFFF",
                          strokeWidth: 0.75,
                          outline: "none",
                          cursor: "pointer"
                        },
                        pressed: {
                          fill: "#a3c20d", // darker eco-lime
                          stroke: "#FFFFFF",
                          strokeWidth: 1,
                          outline: "none",
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
        </ComposableMap>
        <Tooltip id="my-tooltip" />
      </div>
    </div>
  );
};

export default PeruMap;
