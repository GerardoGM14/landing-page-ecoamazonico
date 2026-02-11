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

const PeruMap = () => {
  const [content, setContent] = useState("");

  const handleRegionClick = (geo: GeoObject) => {
    const regionName = geo.properties.NOMBDEP || geo.properties.NAME_1 || geo.properties.name || "Región desconocida";
    alert(`Has seleccionado la región: ${regionName}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[500px] bg-gray-50 rounded-xl shadow-inner p-4">
      <h3 className="text-2xl font-bold text-green-800 mb-4">Mapa de Regiones del Perú</h3>
      <p className="text-gray-600 mb-6">Haz clic en una región para explorar más.</p>
      
      <div className="w-full max-w-4xl border border-gray-200 rounded-lg overflow-hidden bg-blue-50 relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 2300,
            center: [-75, -9.5]
          }}
          className="w-full h-auto"
          style={{ maxHeight: "600px" }}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo: GeoObject) => (
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
                        fill: "#D6D6DA",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: "#4ade80", // green-400
                        stroke: "#FFFFFF",
                        strokeWidth: 0.75,
                        outline: "none",
                        cursor: "pointer"
                      },
                      pressed: {
                        fill: "#16a34a", // green-600
                        stroke: "#FFFFFF",
                        strokeWidth: 1,
                        outline: "none",
                      }
                    }}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <Tooltip id="my-tooltip" />
      </div>
    </div>
  );
};

export default PeruMap;
