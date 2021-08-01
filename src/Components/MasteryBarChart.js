import React, { PureComponent } from "react";
import Champion from "./Champion";
import "./MasteryBarChart.css";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default class MasteryBarChart extends PureComponent {
  state = {
    mastery: this.props.mastery,
    activeIndex: -1,
  };

  handleClick = (masteryEntry, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    const { activeIndex } = this.state;
    const activeItem = this.props.mastery[activeIndex];
    console.log(this.props.mastery);
    console.log(activeItem);
    return (
      <div className="mastery_block">
        <ResponsiveContainer
          width="100%"
          height={200}
          className="mastery_block_chart"
        >
          <BarChart width="100%" height={40} data={this.props.mastery}>
            <Bar dataKey="championPoints" onClick={this.handleClick}>
              {this.props.mastery.map((entry, index) => (
                <Cell
                  cursor="pointer"
                  fill={index === activeIndex ? "#82ca9d" : "#8884d8"}
                  key={`cell-${index}`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mastery_block_champs">
          {this.props.mastery ? (
            this.props.mastery.map((ms) => (
              <div className="mastery_block_champs_icon">
                <img key={ms.championId} src={ms.championIcon} width="80%" />
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>

        {activeIndex < 0 ? (
          <p className="mastery_block_msg">
            Want a higher tier? Based on your match history, we suggest these
            picks.
          </p>
        ) : (
          <p className="mastery_block_msg">{`Your mastery score for ${activeItem.championName} is ${activeItem.championPoints}.`}</p>
        )}
      </div>
    );
  }
}
