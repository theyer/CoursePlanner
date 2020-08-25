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
  constructor(name, uid, courseList) {
      this.name = name;
      this.uid = uid;
      this.courseList = courseList;
  }
}

// Defines how to convert Schedule class to/from a simple dict.
export const scheduleConverter = {
  toFirestore: schedule => {
    return {
      name: schedule.name,
      uid: schedule.uid,
      courseList: schedule.courseList.map(courseInfo => {
        return {
          name: courseInfo.name,
          credits: courseInfo.credits,
          startTime: courseInfo.startTime,
          endTime: courseInfo.endTime,
          days: courseInfo.days,
          isDisplayed: courseInfo.isDisplayed
        }
      })
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Schedule(
      data.name,
      data.uid,
      data.courseList.map(info => {
        return new CourseInfo(
          info.name,
          info.credits,
          info.startTime,
          info.endTime,
          info.days,
          info.isDisplayed
        );
      })
    );
  }
}