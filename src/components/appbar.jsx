import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import ScheduleList from './scheduleList';
import Notification from './notification';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: "#7908b8",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    // marginLeft: theme.spacing(2),
  },
  popoverForm: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textField: {
    marginLeft: theme.spacing(1),
    width: '25ch',
  },
  submitButton: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    background: '#7908b8',
    color: 'white',
  },
}));

function ClearButton(props) {
  return (
    <Tooltip title="Clear schedule">
      <IconButton color="inherit" onClick={props.handleClear}>
        <ClearIcon />
      </IconButton>
    </Tooltip>
  );
}

function OpenButton(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);

  const openPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  const openNotification = () => {
    setIsNotificationOpen(true);
  }

  const closeNotification = () => {
    setIsNotificationOpen(false);
  }

  const handleOpen = (schedule) => {
    props.handleOpen(schedule);
    closePopover();
  }

  const handleDelete = (schedule) => {
    props.handleDelete(schedule).then(() => {
      openNotification();
    });
  }

  const isPopoverOpen = Boolean(anchorEl);
  const popoverId = isPopoverOpen ? 'open-popover' : undefined;

  return (
    <React.Fragment>
      <Tooltip title="Open">
        <span>
          <IconButton color="inherit" onClick={openPopover} disabled={props.disabled}>
            <FolderOpenIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Popover
        id={popoverId}
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <ScheduleList
          schedules={props.schedules}
          handleOpen={handleOpen}
          handleDelete={handleDelete}
        />
      </Popover>
      <Notification 
        open={isNotificationOpen}
        closeNotification={closeNotification}
        message="Schedule deleted."
      />
    </React.Fragment>
  );
}

function SaveButton(props) {
  const classes = useStyles();
  const [scheduleName, setScheduleName] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);

  const openPopoverOrUpdateSchedule = (event) => {
    if (props.isSavedSchedule) {
      // Update schedule instead of opening popover.
      props.handleUpdate().then(() => {
        openNotification();
      });
    } else {
      // Schedule is new, open popover.
      setAnchorEl(event.currentTarget);
    }
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  const openNotification = () => {
    setIsNotificationOpen(true);
  }

  const closeNotification = () => {
    setIsNotificationOpen(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    closePopover();
    props.handleSave(scheduleName).then(() => {
      openNotification();
    });
    setScheduleName('');
  }

  const isPopoverOpen = Boolean(anchorEl);
  const popoverId = isPopoverOpen ? 'save-popover' : undefined;

  return (
    <React.Fragment>
      <Tooltip title="Save">
        <span>
          <IconButton
            color="inherit"
            onClick={openPopoverOrUpdateSchedule}
            disabled={props.disabled}
          >
            <SaveIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Popover
        id={popoverId}
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <form autoComplete="off" onSubmit={handleSubmit} className={classes.popoverForm}>
          <TextField
            id="schedule-name-field"
            className={classes.textField}
            variant="outlined"
            margin="dense"
            label="Schedule Name"
            placeholder="Fall Semester"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required />
          <Button variant="contained" type="submit" className={classes.submitButton}>Save</Button>
        </form>
      </Popover>
      <Notification
        open={isNotificationOpen}
        closeNotification={closeNotification}
        message="Schedule saved."
      />
    </React.Fragment>
  );
}

export default function MenuAppBar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Course Planner
          </Typography>
          <OpenButton
            schedules={props.schedules}
            handleOpen={props.handleOpen}
            handleDelete={props.handleDelete}
            disabled={!props.user}
          />
          <SaveButton
            isSavedSchedule={props.isSavedSchedule}
            handleSave={props.handleSave}
            handleUpdate={props.handleUpdate}
            disabled={!props.user}
          />
          <ClearButton handleClear={props.handleClear} />
          {props.user ?
            <Button color="inherit" onClick={props.logout}>Logout</Button> :
            <Button color="inherit" onClick={props.login}>Login</Button>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}