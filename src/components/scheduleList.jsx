import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    width: 250,
    maxHeight: 210,
  },
}));

export default function ScheduleList(props) {
  const classes = useStyles();

  const getListItem = (schedule, index) => {
    return (
      <React.Fragment key={"schedule_list_item".concat(index)}>
        { index != 0 && <Divider variant="middle" />}
        <ListItem
          button
          onClick={() => props.handleOpen(schedule)}
        >
          <ListItemText>{schedule.name}</ListItemText>
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              onClick={() => props.handleDelete(schedule)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </React.Fragment>
    );
  }

  return (
    <List component="nav" className={classes.root}>
      { props.schedules.map(getListItem) }
    </List>
  );
}