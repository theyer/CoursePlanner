import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const useStyles = makeStyles((theme) => ({
  snackbar: {
    background: 'white',
    color: 'black',
  },
}));

export default function Notification(props) {
  const classes = useStyles();

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      color="inherit"
      open={props.open}
      autoHideDuration={5000}
      onClose={props.closeNotification}
    >
      <SnackbarContent
        className={classes.snackbar}
        message={props.message}
        action={
          <IconButton size="small" color="inherit" onClick={props.closeNotification}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Snackbar>
  );
}