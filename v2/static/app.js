var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Start at 1 to match FullCalendar impl.
// TODO: pick one of these two constant approaches
var DAYS_MAP = {
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5
};
var MONDAY = 1;
var TUESDAY = 2;
var WEDNESDAY = 3;
var THURSDAY = 4;
var FRIDAY = 5;

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = { courses: [React.createElement(Course, { key: 0,
                name: 'torts',
                credits: '3',
                startTime: '07:00',
                endTime: '08:00',
                days: [MONDAY, WEDNESDAY] })] };
        _this.addCourse = _this.addCourse.bind(_this);
        return _this;
    }

    _createClass(App, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            console.log(this.state.courses);
        }
    }, {
        key: 'addCourse',
        value: function addCourse(courseInfo) {
            var course = React.createElement(Course, { key: this.state.courses.length,
                name: courseInfo.name,
                credits: courseInfo.credits,
                startTime: courseInfo.startTime,
                endTime: courseInfo.endTime,
                days: courseInfo.days });
            this.setState(function (state) {
                return {
                    courses: state.courses.concat(course)
                };
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(CourseList, { courses: this.state.courses }),
                React.createElement(NewCourseForm, { handleSubmit: this.addCourse })
            );
        }
    }]);

    return App;
}(React.Component);

var NewCourseForm = function (_React$Component2) {
    _inherits(NewCourseForm, _React$Component2);

    function NewCourseForm(props) {
        _classCallCheck(this, NewCourseForm);

        var _this2 = _possibleConstructorReturn(this, (NewCourseForm.__proto__ || Object.getPrototypeOf(NewCourseForm)).call(this, props));

        _this2.state = { name: '', credits: '', startTime: '', endTime: '', days: [] };
        _this2.handleDaysChange = _this2.handleDaysChange.bind(_this2);
        _this2.handleTextChange = _this2.handleTextChange.bind(_this2);
        _this2.handleSubmit = _this2.handleSubmit.bind(_this2);

        _this2.NAME = '_new_name';
        _this2.CREDITS = '_new_credits';
        _this2.START_TIME = '_new_start_time';
        _this2.END_TIME = '_new_end_time';
        return _this2;
    }

    _createClass(NewCourseForm, [{
        key: 'handleDaysChange',
        value: function handleDaysChange(e) {
            var dayInt = DAYS_MAP[e.target.name];
            if (e.target.checked && !this.state.days.includes(dayInt)) {
                // Add dayInt.
                this.setState(function (state) {
                    return {
                        days: state.days.concat(dayInt)
                    };
                });
            } else if (!e.target.checked && this.state.days.includes(dayInt)) {
                // Remove dayInt.
                this.setState(function (state) {
                    return {
                        days: state.days.filter(function (day) {
                            return day != dayInt;
                        })
                    };
                });
            }
        }
    }, {
        key: 'handleTextChange',
        value: function handleTextChange(e) {
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
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(e) {
            e.preventDefault();
            if (this.state.name.length === 0 || this.state.startTime.length === 0 || this.state.endTime.length === 0 || this.state.days.length === 0) {
                return;
            }
            this.props.handleSubmit(this.state);
            this.setState(function (state) {
                return {
                    name: '', credits: '', startTime: '', endTime: '', days: []
                };
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'form',
                { onSubmit: this.handleSubmit },
                React.createElement('input', { name: this.NAME, type: 'text', value: this.state.name, onChange: this.handleTextChange }),
                React.createElement('input', { name: this.CREDITS, type: 'text', value: this.state.credits, onChange: this.handleTextChange }),
                React.createElement('input', { name: this.START_TIME, type: 'time', min: '07:00', max: '19:00', value: this.state.startTime, onChange: this.handleTextChange }),
                React.createElement('input', { name: this.END_TIME, type: 'time', min: '07:00', max: '19:00', value: this.state.endTime, onChange: this.handleTextChange }),
                React.createElement(DaysOfTheWeek, { idPrefix: '_new',
                    days: this.state.days,
                    disabled: false,
                    handleChange: this.handleDaysChange }),
                React.createElement(
                    'button',
                    null,
                    'Submit'
                )
            );
        }
    }]);

    return NewCourseForm;
}(React.Component);

var CourseList = function (_React$Component3) {
    _inherits(CourseList, _React$Component3);

    function CourseList(props) {
        _classCallCheck(this, CourseList);

        return _possibleConstructorReturn(this, (CourseList.__proto__ || Object.getPrototypeOf(CourseList)).call(this, props));
    }

    _createClass(CourseList, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'table',
                { id: 'course_table' },
                React.createElement(
                    'thead',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'th',
                            null,
                            'Displayed'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Course Name'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Credits'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Start Time'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'End Time'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Days'
                        )
                    )
                ),
                React.createElement(
                    'tbody',
                    null,
                    this.props.courses
                )
            );
        }
    }]);

    return CourseList;
}(React.Component);

var Course = function (_React$Component4) {
    _inherits(Course, _React$Component4);

    function Course(props) {
        _classCallCheck(this, Course);

        var _this4 = _possibleConstructorReturn(this, (Course.__proto__ || Object.getPrototypeOf(Course)).call(this, props));

        _this4.state = { isDisplayed: true };
        _this4.handleDisplayChange = _this4.handleDisplayChange.bind(_this4);
        _this4.handleDaysChange = _this4.handleDaysChange.bind(_this4);
        return _this4;
    }

    _createClass(Course, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            console.log('Course displayed: ' + this.state.isDisplayed);
        }
    }, {
        key: 'handleDisplayChange',
        value: function handleDisplayChange(e) {
            this.setState({ isDisplayed: e.target.checked });
        }
    }, {
        key: 'handleDaysChange',
        value: function handleDaysChange(e) {
            // Do nothing. Days in a course are immutable (for now).
            return;
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'tr',
                null,
                React.createElement(
                    'td',
                    null,
                    React.createElement(Checkbox, { id: this.props.name,
                        checked: this.state.isDisplayed,
                        disabled: false,
                        handleChange: this.handleDisplayChange })
                ),
                React.createElement(
                    'td',
                    null,
                    this.props.name
                ),
                React.createElement(
                    'td',
                    null,
                    this.props.credits
                ),
                React.createElement(
                    'td',
                    null,
                    this.props.startTime
                ),
                React.createElement(
                    'td',
                    null,
                    this.props.endTime
                ),
                React.createElement(
                    'td',
                    null,
                    React.createElement(DaysOfTheWeek, { idPrefix: this.props.name,
                        days: this.props.days,
                        disabled: true,
                        handleChange: this.handleDaysChange })
                )
            );
        }
    }]);

    return Course;
}(React.Component);

var DaysOfTheWeek = function (_React$Component5) {
    _inherits(DaysOfTheWeek, _React$Component5);

    function DaysOfTheWeek(props) {
        _classCallCheck(this, DaysOfTheWeek);

        var _this5 = _possibleConstructorReturn(this, (DaysOfTheWeek.__proto__ || Object.getPrototypeOf(DaysOfTheWeek)).call(this, props));

        _this5.buildLabeledCheckbox = _this5.buildLabeledCheckbox.bind(_this5);
        return _this5;
    }

    _createClass(DaysOfTheWeek, [{
        key: 'buildLabeledCheckbox',
        value: function buildLabeledCheckbox(day, label) {
            return React.createElement(
                'span',
                { key: this.props.idPrefix + "_" + day },
                React.createElement(Checkbox, { id: this.props.idPrefix + "_" + day,
                    name: day,
                    checked: this.props.days.includes(DAYS_MAP[day]),
                    disabled: this.props.disabled,
                    handleChange: this.props.handleChange }),
                React.createElement(
                    'label',
                    { htmlFor: this.props.idPrefix + "_" + day },
                    label
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this6 = this;

            var dayLabels = [['monday', 'M'], ['tuesday', 'T'], ['wednesday', 'W'], ['thursday', 'Th'], ['friday', 'F']];
            return React.createElement(
                'div',
                null,
                dayLabels.map(function (dayLabel) {
                    return _this6.buildLabeledCheckbox(dayLabel[0], dayLabel[1]);
                })
            );
        }
    }]);

    return DaysOfTheWeek;
}(React.Component);

var Checkbox = function (_React$Component6) {
    _inherits(Checkbox, _React$Component6);

    function Checkbox(props) {
        _classCallCheck(this, Checkbox);

        return _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).call(this, props));
    }

    _createClass(Checkbox, [{
        key: 'render',
        value: function render() {
            return React.createElement('input', { id: this.props.id,
                name: this.props.name,
                type: 'checkbox',
                disabled: this.props.disabled,
                defaultChecked: this.props.checked,
                onChange: this.props.handleChange });
        }
    }]);

    return Checkbox;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('course_list'));