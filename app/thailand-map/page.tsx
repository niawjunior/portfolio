"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import thailandGeoJSON from "./thailand.json"; // Load Thailand GeoJSON file

const ThailandMap = () => {
  const mapRef = useRef<SVGSVGElement | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const width = 960;
    const height = 600;

    const svg = d3
      .select(mapRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`);

    const projection = d3
      .geoMercator()
      .scale(1800)
      .rotate([-100.6331, -13.2])
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const g = svg.append("g");

    // Draw provinces
    g.selectAll("path")
      .data(thailandGeoJSON.features)
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("fill", "#4A90E2")
      .attr("stroke", "#FFF")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this).transition().duration(200).attr("fill", "orange");
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("fill", "#4A90E2");
      })
      .on("click", function (_, d) {
        const [x, y] = path.centroid(d);
        setPopupPosition({ x, y });
        setSelectedProvince(d.properties.name);
      });

    // Zoom and Pan
    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
  }, []);

  return (
    <main className="flex items-center justify-center h-screen bg-gray-900 relative">
      <svg ref={mapRef}></svg>

      {selectedProvince && popupPosition && (
        <div
          className="absolute bg-white text-black px-4 py-2 rounded shadow-md"
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <p className="font-bold">{selectedProvince}</p>
        </div>
      )}
    </main>
  );
};

export default ThailandMap;
