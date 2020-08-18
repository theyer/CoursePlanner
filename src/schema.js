export class CourseInfo {
  constructor(name, credits, startTime, endTime, days, isDisplayed) {
      this.name = name;
      this.credits = credits;
      this.startTime = startTime;
      this.endTime = endTime;
      this.days = days;
      this.isDisplayed = isDisplayed;
  }

  static changeIsDisplayed(courseInfo, isDisplayed) {
      return new CourseInfo(courseInfo.name, courseInfo.credits, courseInfo.startTime,
                            courseInfo.endTime, courseInfo.days, isDisplayed);
  }
}

export class Schedule {
  constructor(name, courseList) {
      this.name = name;
      this.courseList = courseList;
  }
}