import React from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { COLORS } from '../constants/calendarData';


export default class Calendar extends React.Component {
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