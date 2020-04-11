var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CourseList = function (_React$Component) {
    _inherits(CourseList, _React$Component);

    function CourseList(props) {
        _classCallCheck(this, CourseList);

        var _this = _possibleConstructorReturn(this, (CourseList.__proto__ || Object.getPrototypeOf(CourseList)).call(this, props));

        _this.state = { courses: [React.createElement(Course, { name: "torts", credits: "3", startTime: "07:00", endTime: "08:00" })] };
        return _this;
    }

    _createClass(CourseList, [{
        key: "addCourse",
        value: function addCourse(course) {
            this.setState(function (state, course) {
                return {
                    courses: state.courses.push(course)
                };
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "table",
                { id: "course-list-table" },
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "th",
                        null,
                        "Displayed"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Course Name"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Credits"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Start Time"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "End Time"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Days"
                    )
                ),
                this.state.courses
            );
        }
    }]);

    return CourseList;
}(React.Component);

var Course = function (_React$Component2) {
    _inherits(Course, _React$Component2);

    function Course(props) {
        _classCallCheck(this, Course);

        var _this2 = _possibleConstructorReturn(this, (Course.__proto__ || Object.getPrototypeOf(Course)).call(this, props));

        _this2.state = { isDisplayed: true };
        return _this2;
    }

    _createClass(Course, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "tr",
                { id: this.props.name },
                React.createElement(
                    "td",
                    null,
                    "checkbox"
                ),
                React.createElement(
                    "td",
                    null,
                    this.props.name
                ),
                React.createElement(
                    "td",
                    null,
                    this.props.credits
                ),
                React.createElement(
                    "td",
                    null,
                    this.props.startTime
                ),
                React.createElement(
                    "td",
                    null,
                    this.props.endTime
                ),
                React.createElement(
                    "td",
                    null,
                    "more checkboxes"
                )
            );
        }
    }]);

    return Course;
}(React.Component);

ReactDOM.render(React.createElement(CourseList, null), document.getElementById('course_list'));