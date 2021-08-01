import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#FF8042"];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  result,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      //textAnchor={x > cx ? "start" : "end"}
      textAnchor="middle"
      dominantBaseline="center"
      fontSize={12}
    >
      {`${result}\r`}
    </text>
  );
};
export default class Example extends PureComponent {
  render() {
    return (
      <div>
        <PieChart width={150} height={150} onMouseEnter={this.onPieEnter}>
          <text
            x={77}
            y={70}
            textAnchor="middle"
            dominantBaseline="center"
            fontSize={12}
          >
            {`Win Rate`}
          </text>
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
          <Pie
            data={this.props.data}
            cx={70}
            cy={70}
            innerRadius={40}
            outerRadius={50}
            startAngle={90}
            endAngle={450}
            fill="#8884d8"
            paddingAngle={5}
            labelLine={false}
            dataKey="value"
            label={renderCustomizedLabel}
          >
            {this.props.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          {/*           <Pie
            data={this.props.data}
            cx={420}
            cy={200}
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {this.props.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie> */}
        </PieChart>
      </div>
    );
  }
}
