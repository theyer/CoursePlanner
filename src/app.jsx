// TODO: assert course names are unique.

import React from "react";
import { hot } from "react-hot-loader";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import APIClient from './apiClient';
import { CourseInfo, Schedule } from './schema';
import "./app.scss";

// Start at 1 to match FullCalendar impl.
const DAYS_MAP = {
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5
};
// From https://www.schemecolor.com/blue-red-yellow-green.php
// and https://www.schemecolor.com/ home page.
const COLORS = ['#3581d8', '#d82e3f', '#ffe135', '#28cc2d', '#63cad8', '#f52394', '#7f00ff', '#c4c4c4'];


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { courseInfoList: [], schedules: [] };
        this.addCourse = this.addCourse.bind(this);
        this.handleDisplayChange = this.handleDisplayChange.bind(this);
        this.numCredits = this.numCredits.bind(this);
        this.submitSchedule = this.submitSchedule.bind(this);
        this.listAllSchedules = this.listAllSchedules.bind(this);
        this.loadSchedule = this.loadSchedule.bind(this);
    }

    /*async*/ componentDidMount() {
        // const accessToken = await this.props.auth.getAccessToken()
        const accessToken = '1234';
        this.apiClient = new APIClient(accessToken);
        // this.apiClient.getKudos().then((data) =>
        //   this.setState({...this.state, kudos: data})
        // );
    }

    submitSchedule() {
        let name = 'tims_';
        for (let courseInfo of this.state.courseInfoList) {
            name += courseInfo.name
        }
        const schedule = new Schedule(name, this.state.courseInfoList);
        this.apiClient.createSchedule(schedule).then((resp) => {
            console.log(resp);
        });
    }

    listAllSchedules() {
        this.apiClient.getSchedules().then((all_schedules) => {
            console.log('apollo');
            console.log(all_schedules);
            let schedules = [];
            for (let schedule of all_schedules) {
                let courseInfoList = [];
                for (let course of schedule.courseList) {
                    courseInfoList.push(new CourseInfo(course.name, course.credits, course.startTime, course.endTime, course.days, course.isDisplayed));
                }
                let s = new Schedule(schedule.name, courseInfoList);
                console.log(s);
                schedules.push(s);
            }
            console.log(schedules);
            this.setState({ schedules: schedules });
        });
    }

    loadSchedule(schedule, e) {
        e.preventDefault();
        this.setState({ courseInfoList: schedule.courseList });
    }

    handleDisplayChange(e) {
        const index = parseInt(e.target.id.split("_")[1]);
        let newCourseInfoList = this.state.courseInfoList;
        const newCourseInfo = CourseInfo.changeIsDisplayed(newCourseInfoList[index], e.target.checked);
        newCourseInfoList[index] = newCourseInfo;
        this.setState({ courseInfoList: newCourseInfoList });
    }

    addCourse(courseInfo) {
        this.setState(state => ({
            courseInfoList: state.courseInfoList.concat(courseInfo),
        }));
    }

    numCredits() {
        let credits = 0;
        for (let courseInfo of this.state.courseInfoList) {
            if (courseInfo.isDisplayed &&
                !isNaN(courseInfo.credits)) {
                credits += parseInt(courseInfo.credits);
            }
        }
        return credits;
    }

    render() {
        let courses = [];
        for (let i = 0; i < this.state.courseInfoList.length; i++) {
            let courseInfo = this.state.courseInfoList[i];
            courses.push(<Course key={i}
                id={'course_' + i}
                name={courseInfo.name}
                credits={courseInfo.credits}
                startTime={courseInfo.startTime}
                endTime={courseInfo.endTime}
                days={courseInfo.days}
                isDisplayed={courseInfo.isDisplayed}
                handleDisplayChange={this.handleDisplayChange} />)
        }

        return (
            <div id="app">
                <Calendar courses={this.state.courseInfoList} />
                <br />
                <div id="course_table_form_container">
                    <CourseTable courses={courses} numCredits={this.numCredits()} />
                    <NewCourseForm handleSubmit={this.addCourse} />
                </div>
                <button onClick={this.submitSchedule}>Save Schedule</button>
                <button onClick={this.listAllSchedules}>List Saved Schedules</button>
                <ul>
                    {this.state.schedules.map(s => (<li><a href="#" onClick={(e) => this.loadSchedule(s, e)}>{s.name}</a></li>))}
                </ul>
            </div>
        );
    }
}

class Calendar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let events = [];
        for (let i = 0; i < this.props.courses.length; i++) {
            const courseInfo = this.props.courses[i];
            if (!courseInfo.isDisplayed) {
                continue;
            }
            const colorIndex = i % COLORS.length;
            events.push({
                id: courseInfo.name + "_CalendarEvent",
                title: courseInfo.name,
                startTime: courseInfo.startTime,
                endTime: courseInfo.endTime,
                daysOfWeek: courseInfo.days,
                color: COLORS[colorIndex]
            });
        }

        return (
            <div id="calendar">
                <FullCalendar defaultView="timeGridWeek"
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    header={false}
                    footer={false}
                    aspectRatio="1.5"
                    height="auto"
                    columnHeaderFormat={{ weekday: 'long' }}
                    allDaySlot={false}
                    // TODO: set min/max dynamically?
                    minTime="07:00:00"
                    maxTime="19:00:00"
                    // Set "today" to a weekend then hide weekends to avoid highlighting today.
                    now="2020-04-05"
                    weekends={false}
                    events={events} />
            </div>
        );
    }
}

class NewCourseForm extends React.Component {
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
                    <DaysOfTheWeek idPrefix="_new"
                                   days={this.state.days}
                                   disabled={false}
                                   handleChange={this.handleDaysChange} />
                    <p>
                        <button>Submit</button>
                    </p>
                </fieldset>
            </form>
        );
    }
}

class CourseTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.courses.length === 0) {
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
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.courses}
                        <tr className="course_row">
                            <td colSpan="6">Credits: {this.props.numCredits}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

class Course extends React.Component {
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
            </tr>
        );
    }
}

class DaysOfTheWeek extends React.Component {
    constructor(props) {
        super(props);
        this.buildLabeledCheckbox = this.buildLabeledCheckbox.bind(this);
    }

    buildLabeledCheckbox(day, label) {
        return (
            <span key={this.props.idPrefix + "_" + day}>
                <Checkbox id={this.props.idPrefix + "_" + day}
                          name={day}
                          checked={this.props.days.includes(DAYS_MAP[day])}
                          disabled={this.props.disabled} 
                          handleChange={this.props.handleChange} />
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

class Checkbox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <input id={this.props.id}
                   name={this.props.name}
                   type="checkbox"
                   disabled={this.props.disabled}
                   checked={this.props.checked}
                   onChange={this.props.handleChange}>
            </input>
        );
    }
}

export default hot(module)(App);
