import React, { PureComponent } from "react";
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

  handleEntry = (masteryEntry, index) => {
    this.setState({
      activeIndex: index,
    });
  };
  handleLeave = (masteryEntry, index) => {
    this.setState({
      activeIndex: -1,
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
            <Bar
              dataKey="championPoints"
              onMouseEnter={this.handleEntry}
              onMouseLeave={this.handleLeave}
            >
              {this.props.mastery.map((entry, index) => (
                <Cell
                  cursor="pointer"
                  fill={index === activeIndex ? "#5089c6" : "#001e6c"}
                  key={`cell-${index}`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mastery_block_champs">
          {this.props.mastery ? (
            this.props.mastery.map((ms, index) => (
              <div className="mastery_block_champs_icon">
                <img
                  key={ms.championId}
                  alt={ms.championId}
                  src={ms.championIcon}
                  width={"80%"}
                  className={
                    index === activeIndex
                      ? "mastery_block_champs_icon_active"
                      : "mastery_block_champs_icon_inactive"
                  }
                />
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
