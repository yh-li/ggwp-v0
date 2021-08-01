import React, { useState } from "react";
import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { Text } from "@visx/text";

function VisxChart({
  data,
  labelKey,
  valueKey,
  colorKey,
  colors = ["#0088FE", "#FF8042"],
}) {
  const [active, setActive] = useState(null);
  const offset = 50;
  const width = 200;
  const half = width / 2;
  const halfOffset = offset / 2;
  return (
    <div className="pie_chart">
      <svg width={width + offset} height={width + offset}>
        <Group top={half + halfOffset} left={half + halfOffset}>
          <Pie
            data={data}
            pieValue={(data) => data[valueKey]}
            startAngle={0}
            outerRadius={({ data }) => {
              const size =
                active && active[labelKey] === data[labelKey] ? 5 : 0;
              return half + size;
            }}
            innerRadius={({ data }) => {
              const size =
                active && active[labelKey] === data[labelKey] ? 25 : 20;
              return half - size;
            }}
            padAngle={0.05}
          >
            {(pie) => {
              return pie.arcs.map((arc) => {
                return (
                  <g
                    key={arc.data[labelKey]}
                    onMouseEnter={() => {
                      setActive(arc.data);
                    }}
                    onMouseLeave={() => {
                      setActive(null);
                    }}
                  >
                    <path
                      d={pie.path(arc)}
                      fill={
                        colorKey
                          ? arc.data[colorKey]
                          : colors[arc.index % colors.length]
                      }
                    ></path>
                  </g>
                );
              });
            }}
          </Pie>
          {active ? (
            <>
              <Text
                textAnchor="middle"
                fill={colorKey ? active[colorKey] : colors[0]}
                fontSize={30}
                dx={3}
                dy={3}
              >
                {`${active[labelKey]}`}
              </Text>
              <Text
                textAnchor="middle"
                fill={colorKey ? active[colorKey] : colors[0]}
                fontSize={20}
                dy={27}
              >
                {`${active[valueKey]}`}
              </Text>
            </>
          ) : (
            <>
              <Text
                textAnchor="middle"
                fill={colors[0]}
                fontSize={30}
                dx={5}
                dy={10}
              >
                {`${Math.round(
                  (100 * data[0][valueKey]) /
                    data.reduce((acc, data) => data[valueKey] + acc, 0)
                )}%`}
              </Text>
            </>
          )}
        </Group>
      </svg>
    </div>
  );
}

export default VisxChart;
