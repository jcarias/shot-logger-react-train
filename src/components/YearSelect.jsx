import React, { Component } from "react";

class YearSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentYear: props.value || new Date().getFullYear(),
      intervalSize: props.intervalSize || 5,
      years: []
    };
  }

  updateSelection = event => {
    this.updateInterval(event.target.value);
    if (this.props.handleChangeEvent) {
      this.props.handleChangeEvent(event);
    }
  };

  updateInterval = (newValue = this.state.currentYear) => {
    let lowerEnd = Number(newValue) - Number(this.state.intervalSize);
    let upperEnd = Number(newValue) + Number(this.state.intervalSize);
    let years = [];
    for (let i = lowerEnd; i <= upperEnd; i++) {
      years.push(i);
    }
    this.setState({ years: years, currentYear: newValue });
  };

  componentDidMount = () => {
    this.updateInterval(this.state.currentYear);
  };

  componentWillReceiveProps = args => {
    this.updateInterval(args.value || new Date().getFullYear());
  };

  render() {
    return (
      <React.Fragment>
        <select
          className={this.props.className}
          value={this.state.currentYear}
          onChange={this.updateSelection}
        >
          {this.state.years.map((year, index) => {
            return (
              <option key={index} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </React.Fragment>
    );
  }
}

export default YearSelect;
