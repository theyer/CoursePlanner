import React from "react";
import { hot } from "react-hot-loader";
import CssBaseline from '@material-ui/core/CssBaseline';
import Calendar from './components/calendar'
import MenuAppBar from './components/appbar';
import CourseTable, { CourseRow } from './components/courseTable';
import NewCourseForm from './components/newCourseForm';
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
    auth.signInWithPopup(provider).then(result => {
      this.setState({ user: result.user });
    }).catch(error => {
      console.error("Login error: ", error);
    });
  }

  logout() {
    auth.signOut().then(() => {
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
    let newCourseInfoList = [...this.state.courseInfoList];
    const newCourseInfo = CourseInfo.changeIsDisplayed(newCourseInfoList[index], e.target.checked);
    newCourseInfoList[index] = newCourseInfo;
    this.setState({ courseInfoList: newCourseInfoList });
  }

  addCourse(courseInfo) {
    this.setState(state => ({
      courseInfoList: state.courseInfoList.concat(courseInfo),
    }));
  }

  deleteCourse(deleteIndex) {
    if (this.state.courseInfoList.length <= 1) {
      this.clearSchedule();
      return;
    }
    this.setState(state => ({
      courseInfoList: state.courseInfoList.filter((_, index) => {
        return index !== deleteIndex;
      }),
    }));
  }

  numCredits() {
    let credits = 0;
    for (let courseInfo of this.state.courseInfoList) {
      if (courseInfo.isDisplayed && !isNaN(courseInfo.credits)) {
        credits += parseInt(courseInfo.credits);
      }
    }
    return credits;
  }

  render() {
    let courseRows = [];
    for (let i = 0; i < this.state.courseInfoList.length; i++) {
      let courseInfo = this.state.courseInfoList[i];
      courseRows.push(
        <CourseRow
          key={i}
          id={'course_' + i}
          name={courseInfo.name}
          credits={courseInfo.credits}
          startTime={courseInfo.startTime}
          endTime={courseInfo.endTime}
          days={courseInfo.days}
          isDisplayed={courseInfo.isDisplayed}
          handleDisplayChange={this.handleDisplayChange}
          handleDelete={() => {this.deleteCourse(i)}}
        />
      );
    }

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
          <CourseTable courseRows={courseRows} numCredits={this.numCredits()} />
          <NewCourseForm handleSubmit={this.addCourse} />
        </div>
      </div>
    );
  }
}

export default hot(module)(App);
