import React from 'react';
import DaysOfTheWeek, { Checkbox } from './daysOfTheWeek';
import IconButton from '@material-ui/core/IconButton';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';

export default class CourseTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.courseRows.length === 0) {
      return null;
    }
    return (
      <div id="course_table_container">
        <table id="course_table">
          <thead>
            <tr className="course_row">
              <th>Displayed</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Days</th>
              <th></th>  {/*Delete button column.*/}
            </tr>
          </thead>
          <tbody>
            {this.props.courseRows}
            <tr className="course_row">
              <td colSpan="7">Credits: {this.props.numCredits}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export class CourseRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleDaysChange = this.handleDaysChange.bind(this);
  }

  handleDaysChange(e) {
    // Do nothing. Days in a course are immutable (for now).
    return;
  }

  render() {
    return (
      <tr className="course_row">
        <td><Checkbox id={this.props.id + '_isDisplayed'}
                      checked={this.props.isDisplayed}
                      disabled={false}
                      handleChange={this.props.handleDisplayChange} /></td>
        <td>{this.props.name}</td>
        <td>{this.props.credits}</td>
        <td>{this.props.startTime}</td>
        <td>{this.props.endTime}</td>
        <td><DaysOfTheWeek idPrefix={this.props.name}
                           days={this.props.days}
                           disabled={true}
                           handleChange={this.handleDaysChange} /></td>
        <td>
          <IconButton onClick={this.props.handleDelete}
                      style={{ 'padding': '1px' }}>
            <DeleteTwoToneIcon fontSize='small'/>
          </IconButton>
        </td>
      </tr>
    );
  }
}
