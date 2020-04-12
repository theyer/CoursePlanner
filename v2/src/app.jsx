// Start at 1 to match FullCalendar impl.
// TODO: pick one of these two constant approaches
const DAYS_MAP = {
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5
};
const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { courses: [<Course key={0}
                                         name="torts"
                                         credits="3"
                                         startTime="07:00"
                                         endTime="08:00"
                                         days={[MONDAY, WEDNESDAY]} />] };
        this.addCourse = this.addCourse.bind(this);
    }

    componentDidUpdate() {
        console.log(this.state.courses);
    }

    addCourse(courseInfo) {
        const course = <Course key={this.state.courses.length}
                               name={courseInfo.name}
                               credits={courseInfo.credits}
                               startTime={courseInfo.startTime}
                               endTime={courseInfo.endTime}
                               days={courseInfo.days} />;
        this.setState(state => ({
            courses: state.courses.concat(course)
        }));
    }

    render() {
        return (
            <div>
                <CourseList courses={this.state.courses} />
                <NewCourseForm handleSubmit={this.addCourse} />
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
        this.props.handleSubmit(this.state);
        this.setState(state => ({
            name: '', credits: '', startTime: '', endTime: '', days: []
        }));
    }
 
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input name={this.NAME} type="text" value={this.state.name} onChange={this.handleTextChange}></input>
                <input name={this.CREDITS} type="text" value={this.state.credits} onChange={this.handleTextChange}></input>
                <input name={this.START_TIME} type="time" min="07:00" max="19:00" value={this.state.startTime} onChange={this.handleTextChange}></input>
                <input name={this.END_TIME} type="time" min="07:00" max="19:00" value={this.state.endTime} onChange={this.handleTextChange}></input>
                <DaysOfTheWeek idPrefix="_new"
                               days={this.state.days}
                               disabled={false}
                               handleChange={this.handleDaysChange} />
                <button>Submit</button>
            </form>
        );
    }
}

class CourseList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <table id="course_table">
                <thead>
                    <tr>
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
                </tbody>
            </table>
        );
    }
}

class Course extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isDisplayed: true };
        this.handleDisplayChange = this.handleDisplayChange.bind(this);
        this.handleDaysChange = this.handleDaysChange.bind(this);
    }

    componentDidUpdate() {
        console.log('Course displayed: ' + this.state.isDisplayed);
    }

    handleDisplayChange(e) {
        this.setState({ isDisplayed: e.target.checked });
    }

    handleDaysChange(e) {
        // Do nothing. Days in a course are immutable (for now).
        return;
    }

    render() {
        return (
            <tr>
                <td><Checkbox id={this.props.name}
                              checked={this.state.isDisplayed}
                              disabled={false}
                              handleChange={this.handleDisplayChange} /></td>
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
            <div>
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
                   defaultChecked={this.props.checked}
                   onChange={this.props.handleChange}>
            </input>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('course_list')
);