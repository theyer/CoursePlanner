import React from "react";
import { hot } from "react-hot-loader";
import CssBaseline from '@material-ui/core/CssBaseline';
import Calendar from './components/calendar'
import MenuAppBar from './components/appbar';
import CourseTable from './components/courseTable';
import DaysOfTheWeek, { Checkbox } from './components/daysOfTheWeek';
import { DAYS_MAP } from './constants/calendarData';
import { CourseInfo } from './schema';
import { buildScheduleData, scheduleConverter } from './schema';
import firebase, { auth, provider } from './components/Firebase/firebase';
import "./app.scss";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courseInfoList: [],
            schedules: [],
            scheduleId: '',
            user: null
        };
        this.db = firebase.firestore().collection('schedules');

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.getSavedSchedules = this.getSavedSchedules.bind(this);
        this.addCourse = this.addCourse.bind(this);
        this.handleDisplayChange = this.handleDisplayChange.bind(this);
        this.numCredits = this.numCredits.bind(this);
        this.submitSchedule = this.submitSchedule.bind(this);
        this.updateCurrentSchedule = this.updateCurrentSchedule.bind(this);
        this.deleteSchedule = this.deleteSchedule.bind(this);
        this.clearSchedule = this.clearSchedule.bind(this);
        this.loadSchedule = this.loadSchedule.bind(this);
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({ user: user });
                this.getSavedSchedules();
            }
        });
    }

    getSavedSchedules() {
        this.unsubscribe = this.db
            .withConverter(scheduleConverter)
            .where("uid", "==", this.state.user.uid)
            .orderBy("name")
            .onSnapshot(querySnapshot => {
                const schedules = querySnapshot.docs.map(doc => {
                    return doc.data();
                });
                this.setState({ schedules: schedules });
            });
    }

    login() {
        auth.signInWithPopup(provider)
            .then(result => {
                this.setState({ user: result.user });
            })
            .catch(error => {
                console.error("Login error: ", error);
            });
    }

    logout() {
        auth.signOut()
            .then(() => {
                this.unsubscribe();
                this.setState({ user: null, schedules: [], scheduleId: '' });
            });
    }

    async submitSchedule(scheduleName) {
        if (!this.state.user) { return; }
        const scheduleData = buildScheduleData(
            scheduleName, this.state.user.uid, this.state.courseInfoList);
        return this.db.add(scheduleData).then(docRef => {
            this.setState({ scheduleId: docRef.id });
        }).catch(error => {
            console.error("Error adding schedule: ", error);
        });
    }

    async updateCurrentSchedule() {
        if (!this.state.user) { return; }
        if (!this.state.scheduleId) {
            console.error("Error updating schedule: missing scheduleId.");
            return;
        }
        return this.db.doc(this.state.scheduleId).update({
            courseList: this.state.courseInfoList.map(courseInfo => {
                return courseInfo.toData();
            })
        }).catch(error => {
            console.error("Error updating schedule: ", error);
        });
    }

    async deleteSchedule(schedule) {
        if (!this.state.user) { return; }
        const id = schedule.id;
        return this.db.doc(id).delete().then(() => {
            if (this.state.scheduleId === id) {
                this.setState({ scheduleId: '' });
            }
        }).catch(error => {
            console.error("Error deleting schedule: ", error);
        });
    }

    clearSchedule() {
        this.setState({ courseInfoList: [], scheduleId: ''});
    }

    loadSchedule(schedule) {
        this.setState({
            courseInfoList: schedule.courseList,
            scheduleId: schedule.id
        });
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
        return (
            <div id="app">
                <CssBaseline />
                <MenuAppBar
                    isSavedSchedule={Boolean(this.state.scheduleId)}
                    schedules={this.state.schedules}
                    user={this.state.user}
                    login={this.login}
                    logout={this.logout}
                    handleClear={this.clearSchedule}
                    handleSave={this.submitSchedule}
                    handleUpdate={this.updateCurrentSchedule}
                    handleOpen={this.loadSchedule}
                    handleDelete={this.deleteSchedule}
                />
                <br />
                <Calendar courses={this.state.courseInfoList} />
                <br />
                <div id="course_table_form_container">
                    <CourseTable
                        courseInfoList={this.state.courseInfoList}
                        numCredits={this.numCredits()}
                        handleDisplayChange={this.handleDisplayChange}
                    />
                    <NewCourseForm handleSubmit={this.addCourse} />
                </div>
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

export default hot(module)(App);
