import React from 'react';
import { DAYS_MAP } from '../constants/calendarData';

export class Checkbox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <input
        id={this.props.id}
        name={this.props.name}
        type="checkbox"
        disabled={this.props.disabled}
        checked={this.props.checked}
        onChange={this.props.handleChange}>
      </input>
    );
  }
}

export default class DaysOfTheWeek extends React.Component {
  constructor(props) {
    super(props);
    this.buildLabeledCheckbox = this.buildLabeledCheckbox.bind(this);
  }

  buildLabeledCheckbox(day, label) {
    return (
      <span key={this.props.idPrefix + "_" + day}>
        <Checkbox
          id={this.props.idPrefix + "_" + day}
          name={day}
          checked={this.props.days.includes(DAYS_MAP[day])}
          disabled={this.props.disabled}
          handleChange={this.props.handleChange}
        />
        <label htmlFor={this.props.idPrefix + "_" + day}>{label}</label>
      </span>
    );
  }

  render() {
    const dayLabels = [
      ['monday', 'M'],
      ['tuesday', 'T'],
      ['wednesday', 'W'],
      ['thursday', 'Th'],
      ['friday', 'F']
    ];
    return (
      <div id={this.props.idPrefix + "_DaysOfTheWeek"}>
        {dayLabels.map(dayLabel => this.buildLabeledCheckbox(dayLabel[0], dayLabel[1]))}
      </div>
    );
  }
}
