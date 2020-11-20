import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DAYS_MAP } from '../constants/calendarData';

const useStyles = makeStyles({
  daysContainer: {
    display: 'inline-block',
  },
});

export function Checkbox(props) {
  return (
    <input id={props.id}
      name={props.name}
      type="checkbox"
      disabled={props.disabled}
      checked={props.checked}
      onChange={props.handleChange}>
    </input>
  );
}

export default function DaysOfTheWeek(props) {
  const classes = useStyles();

  const buildLabeledCheckbox = (day, label) => {
    return (
      <span key={props.idPrefix + "_" + day}>
        <Checkbox
          id={props.idPrefix + "_" + day}
          name={day}
          checked={props.days.includes(DAYS_MAP[day])}
          disabled={props.disabled}
          handleChange={props.handleChange}
        />
        <label htmlFor={props.idPrefix + "_" + day}>{label}</label>
      </span>
    );
  }

  const dayLabels = [
    ['monday', 'M'],
    ['tuesday', 'T'],
    ['wednesday', 'W'],
    ['thursday', 'Th'],
    ['friday', 'F']
  ];

  return (
    <div className={classes.daysContainer} style={{ 'white-space': 'nowrap' }}>
      {dayLabels.map(dayLabel => buildLabeledCheckbox(dayLabel[0], dayLabel[1]))}
    </div>
  );
}