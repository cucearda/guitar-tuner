import { useEditable } from "@chakra-ui/react";
import { centsDiff } from "../utils/musicUtils";
import { useState } from "react";

import React, { useEffect } from "react";

const BLACK = "#2d3a4a";

export default function Gauge({
  targetHz = 0,
  downNote = "",
  upNote = "",
  targetNote = "",
  audioServiceRef = null,
}) {
  console.log("Gauge rendered");
  const [frequency, setFrequency] = useState(null);

  useEffect(() => {
    const cleanupCallback = audioServiceRef.current.onFrequency(setFrequency);
    return cleanupCallback
  }, []);
  
  let cents = null
  if (frequency === -1) {
    cents = -100
  }else{
    cents = Math.max(-100, Math.min(100, centsDiff(targetHz, frequency)));
  }
  
  
  const cx = 100;
  const cy = 110;
  const radius = 90;

  const downNoteY = cy + 10;
  const upNoteY = cy + 10;

  const ticks = Array.from({ length: 21 }, (_, i) => {
    const angleDeg = -90 + (-80 + i * 8);
    const angleRad = angleDeg * (Math.PI / 180);
    const isCenter = i === 10;
    const isMedium = i % 4 === 0 && !isCenter;
    const len = isCenter ? 16 : isMedium ? 12 : 8;
    const x1 = cx + radius * Math.cos(angleRad);
    const y1 = cy + radius * Math.sin(angleRad);
    const x2 = cx + (radius - len) * Math.cos(angleRad);
    const y2 = cy + (radius - len) * Math.sin(angleRad);
    return { x1, y1, x2, y2, isCenter };
  });

  const needleAngle = (cents / 100) * 80;

  return (
    <svg
      viewBox="0 0 200 130"
      width="450"
      height="260"
      overflow="visible"
      style={{ display: "block", margin: "0 auto" }}
    >
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={BLACK}
          strokeWidth={t.isCenter ? 2 : 1.2}
          strokeLinecap="round"
        />
      ))}
      <g
        transform={`rotate(${needleAngle}, ${cx}, ${cy})`}
        style={{ transition: "transform 0.15s ease-out" }}
      >
        <line
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy - 85}
          stroke={BLACK}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={4} fill={"RED"} />
      </g>
      <text
        x="10%"
        y={downNoteY}
        font-family="Arial"
        font-size="24"
        fill={BLACK}
        text-anchor="end"
      >
        {downNote}
      </text>
      <text
        x="95%"
        y={upNoteY}
        fontFamily="Arial"
        font-size="24"
        fill={BLACK}
        text-anchor="start"
      >
        {upNote}
      </text>
      <text
        x="50%"
        y="10%"
        font-family="Arial"
        font-size="20"
        fill={BLACK}
        textAnchor="middle"
      >
        {targetNote}
      </text>
    </svg>
  );
}
