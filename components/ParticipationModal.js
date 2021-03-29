import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles, MuiThemeProvider,
  Typography
} from "@material-ui/core";
import Moment from "react-moment";
import {createMuiTheme} from "@material-ui/core/styles";
import {green, red} from "@material-ui/core/colors";

const useStyles = makeStyles({
  topMargin: {
    marginTop: '3rem'
  },
  desc: {
    fontSize: '1.25rem',
    lineHeight: '1.75rem'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between'
  }
});

const customTheme = createMuiTheme({
  palette: {
    primary: red,
    secondary: green
  }
});

export default function ParticipationModal({ giveaway, participation, joinGiveaway, leaveGiveaway, handleClose, open, uid }) {
  const classes = useStyles();

  if (giveaway) {

    console.log(giveaway);

    return (<Dialog onClose={handleClose} fullWidth={true} maxWidth='lg' open={open}>
      <DialogTitle id="dialog-title">
        <Typography variant="h2" component='span'>{giveaway.title}</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography className={classes.desc} component='p'>{giveaway.desc}</Typography>
          <Typography variant="body1" color="textPrimary" component='p'><em>- {giveaway.host.displayName}</em></Typography>
          <Typography className={classes.topMargin + ' ' + classes.desc} color="textPrimary" component='p'>Giveaway started <Moment date={giveaway.timeBegins._seconds * 1000} fromNow /></Typography>
          <Typography className={classes.desc} color="textPrimary" component='p'>Giveaway ends <Moment date={giveaway.timeEnds._seconds * 1000} fromNow /></Typography>
          <Typography className={classes.topMargin + ' ' + classes.desc} color="textPrimary" component='p'>
            Your referral link: <Button color='primary' target='_blank' href={new URL(window.location.href).origin + '/refer/' + giveaway.id + '/' + uid}>{new URL(window.location.href).origin + '/refer/' + giveaway.id + '/' + uid}</Button>
          </Typography>
          <Typography className={classes.desc} color="textPrimary" component='p'>
            Current referrals: {participation[giveaway.id].referrals}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.topMargin + ' ' + classes.buttons}>
        <MuiThemeProvider theme={customTheme}>
          {(!Object.keys(participation).includes(giveaway.id) || participation[giveaway.id].joined === 0) && (<Button variant='outlined' size='large' onClick={joinGiveaway} color="secondary">
            Join
          </Button>)}
          {(Object.keys(participation).includes(giveaway.id) && participation[giveaway.id].joined === 1) && (<Button variant='outlined' size='large' onClick={leaveGiveaway} color="primary">
            Leave
          </Button>)}
          <Button variant='contained' size='large' disableElevation onClick={handleClose} color="primary">
            Close
          </Button>
        </MuiThemeProvider>
      </DialogActions>
    </Dialog>);
  } else {
    return (<div />)
  }
}