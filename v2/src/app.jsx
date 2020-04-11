class CourseList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { courses: [<Course name="torts" credits="3" startTime="07:00" endTime="08:00" />] };
    }

    addCourse(course) {
        this.setState((state, course) => ({
            courses: state.courses.push(course)
        }));
    }

    render() {
        return (
            <table id="course-list-table">
                <tr>
                    <th>Displayed</th>
                    <th>Course Name</th>
                    <th>Credits</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Days</th>
                </tr>
                {this.state.courses}
            </table>
        );
    }
}

class Course extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isDisplayed: true };
    }

    render() {
        return (
            <tr id={this.props.name}>
                <td>checkbox</td>
                <td>{this.props.name}</td>
                <td>{this.props.credits}</td>
                <td>{this.props.startTime}</td>
                <td>{this.props.endTime}</td>
                <td>more checkboxes</td>
            </tr>
        );
    }
}

ReactDOM.render(
    <CourseList />,
    document.getElementById('course_list')
);