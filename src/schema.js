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
  constructor(name, id, uid, courseList) {
      this.name = name;
      this.id = id;
      this.uid = uid;
      this.courseList = courseList;
  }
}

export const buildScheduleData = (name, uid, courseInfoList) => {
  return {
    name: name,
    uid: uid,
    courseList: courseInfoList.map(courseInfo => {
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
}

// Defines how to create Schedule class from Firestore data.
export const scheduleConverter = {
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Schedule(
      data.name,
      snapshot.id,
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