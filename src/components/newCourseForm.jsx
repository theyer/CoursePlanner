import React from 'react';
import DaysOfTheWeek from './daysOfTheWeek';
import { CourseInfo } from '../schema';
import { DAYS_MAP } from '../constants/calendarData';

export default class NewCourseForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', credits: '', startTime: '', endTime: '', days: [] };
    this.handleDaysChange = this.handleDaysChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.NAME = '_new_name';
    this.CREDITS = '_new_credits';
    this.START_TIME = '_new_start_time';
    this.END_TIME = '_new_end_time';
  }

  handleDaysChange(e) {
    const dayInt = DAYS_MAP[e.target.name];
    if (e.target.checked && !this.state.days.includes(dayInt)) {
      // Add dayInt.
      this.setState(state => ({
        days: state.days.concat(dayInt)
      }));
    } else if (!e.target.checked && this.state.days.includes(dayInt)) {
      // Remove dayInt.
      this.setState(state => ({
        days: state.days.filter(day => day != dayInt)
      }));
    }
  }

  handleTextChange(e) {
    if (e.target.name == this.NAME) {
      this.setState({ name: e.target.value });
    } else if (e.target.name == this.CREDITS) {
      this.setState({ credits: e.target.value });
    } else if (e.target.name == this.START_TIME) {
      this.setState({ startTime: e.target.value });
    } else if (e.target.name == this.END_TIME) {
      this.setState({ endTime: e.target.value });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.name.length === 0 ||
        this.state.startTime.length === 0 ||
        this.state.endTime.length === 0 ||
        this.state.days.length === 0) {
      return;
    }
    const courseInfo = new CourseInfo(this.state.name,
                                      this.state.credits,
                                      this.state.startTime,
                                      this.state.endTime,
                                      this.state.days,
                                      /*isDisplayed=*/true);
    this.props.handleSubmit(courseInfo);
    this.setState(state => ({
      name: '', credits: '', startTime: '', endTime: '', days: []
    }));
  }

  render() {
    return (
      <form id="new_course_form" onSubmit={this.handleSubmit}>
        <fieldset>
          <legend>Add a new course:</legend>
          <div>
            <label htmlFor={this.NAME} className="formLabel">Name: </label>
            <input name={this.NAME} type="text" className="formInput" value={this.state.name} onChange={this.handleTextChange}></input>
          </div><div>
            <label htmlFor={this.CREDITS} className="formLabel">Credits: </label>
            <input name={this.CREDITS} type="text" className="formInput" value={this.state.credits} onChange={this.handleTextChange}></input>
          </div><div>
            <label htmlFor={this.START_TIME} className="formLabel">Start time: </label>
            <input name={this.START_TIME} type="time" className="formInput" min="07:00" max="19:00" value={this.state.startTime} onChange={this.handleTextChange}></input>
          </div><div>
            <label htmlFor={this.END_TIME} className="formLabel">End time: </label>
            <input name={this.END_TIME} type="time" className="formInput" min="07:00" max="19:00" value={this.state.endTime} onChange={this.handleTextChange}></input>
          </div>
          <DaysOfTheWeek
            idPrefix="_new"
            days={this.state.days}
            disabled={false}
            handleChange={this.handleDaysChange}
          />
          <p>
            <button>Submit</button>
          </p>
        </fieldset>
      </form>
    );
  }
}
