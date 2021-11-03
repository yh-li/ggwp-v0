import React, { PureComponent } from "react";
import { Cell, PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
const COLORS = ["#0088FE", "#FF8042"];
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    result,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const radius = innerRadius + (outerRadius - innerRadius) * 0;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      {/* this is label line */}
      {/*       <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      /> */}
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        fill={"#333"}
        style={{ textShadow: "0.5px 0.5px #aaa" }}
      >{`${result}`}</text>
      {/*       <text
        x={x}
        y={y}
        dy={18}
        textAnchor={textAnchor}
        fill="#333"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text> */}
    </g>
  );
};

export default class WinRatePieChart extends PureComponent {
  state = {
    activeIndex: -1,
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };
  onPieLeave = (_, index) => {
    this.setState({
      activeIndex: -1,
    });
  };

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width="100%" height="100%">
          {this.state.activeIndex === -1 ? (
            <text
              x={77}
              y={70}
              textAnchor="middle"
              dominantBaseline="center"
              fontSize={12}
            >
              {`Win Rate`}
            </text>
          ) : (
            <text
              x={77}
              y={80}
              textAnchor="middle"
              dominantBaseline="center"
              fontSize={12}
            >
              {`${Math.round(
                (100 * this.props.data[this.state.activeIndex].value) /
                  (this.props.data[0].value + this.props.data[1].value)
              )}%`}
            </text>
          )}
          {this.state.activeIndex === -1 ? (
            <text
              x={77}
              y={90}
              textAnchor="middle"
              dominantBaseline="center"
              fontSize={12}
            >
              {`${Math.round(
                (100 * this.props.data[0].value) /
                  (this.props.data[0].value + this.props.data[1].value)
              )}%`}
            </text>
          ) : (
            <></>
          )}

          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={this.props.data}
            startAngle={90}
            endAngle={450}
            paddingAngle={10}
            cx={"50%"}
            cy={"50%"}
            innerRadius={40}
            outerRadius={50}
            dataKey="value"
            onMouseEnter={this.onPieEnter}
            onMouseLeave={this.onPieLeave}
            labelLine={false}
          >
            {this.props.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
