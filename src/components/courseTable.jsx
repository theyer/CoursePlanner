import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DaysOfTheWeek, { Checkbox } from './daysOfTheWeek';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function CourseTable(props) {
  const classes = useStyles();

  if (props.courseInfoList.length === 0) {
    return null;
  }
  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Displayed</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Credits</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Days</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.courseInfoList.map((course, index) => (
            <TableRow key={'row_' + index}>
              <TableCell>
                <Checkbox
                  id={'course_' + index + '_isDisplayed'}
                  checked={course.isDisplayed}
                  disabled={false}
                  handleChange={props.handleDisplayChange}
                />
              </TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.credits}</TableCell>
              <TableCell>{course.startTime}</TableCell>
              <TableCell>{course.endTime}</TableCell>
              <TableCell>
                <DaysOfTheWeek
                  idPrefix={course.name}
                  days={course.days}
                  disabled={true}
                  handleChange={props.handleDaysChange}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}