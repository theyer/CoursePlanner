import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DaysOfTheWeek, { Checkbox } from './daysOfTheWeek';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  tableContainer: {
    maxWidth: 750,
    display: 'inline-block',
  },
  table: {
    maxWidth: 750,
    // size: 'small',
    // padding: 'none',
  },
  tableRow: {
    // height: 33,
  }
});

export default function CourseTable(props) {
  const classes = useStyles();

  if (props.courseInfoList.length === 0) {
    return null;
  }
  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table padding='none' className={classes.table} size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell align='center'>Displayed</TableCell>
            <TableCell align='center'>Course Name</TableCell>
            <TableCell align='center'>Credits</TableCell>
            <TableCell align='center'>Start Time</TableCell>
            <TableCell align='center'>End Time</TableCell>
            <TableCell align='center'>Days</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.courseInfoList.map((course, index) => (
            <TableRow padding='none' className={classes.tableRow} key={'row_' + index}>
              <TableCell align='center'>
                <Checkbox
                  id={'course_' + index + '_isDisplayed'}
                  checked={course.isDisplayed}
                  disabled={false}
                  handleChange={props.handleDisplayChange}
                />
              </TableCell>
              <TableCell align='center'>{course.name}</TableCell>
              <TableCell align='center'>{course.credits}</TableCell>
              <TableCell align='center'>{course.startTime}</TableCell>
              <TableCell align='center'>{course.endTime}</TableCell>
              <TableCell align='center'>
                <DaysOfTheWeek
                  idPrefix={course.name}
                  days={course.days}
                  disabled={true}
                  handleChange={props.handleDaysChange}
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow className={classes.tableRow}>
            <TableCell align='center' colSpan={6}>
              Credits: {props.numCredits}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}