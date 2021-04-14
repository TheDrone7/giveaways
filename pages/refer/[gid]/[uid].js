import React from 'react';
import {
  Box,
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardHeader,
  CardContent, Button, CardActions, MuiThemeProvider, Snackbar
} from '@material-ui/core';
import fetch from 'node-fetch';
import Logout from "../../../components/LogoutButton";
import Moment from "react-moment";
import {createMuiTheme} from "@material-ui/core/styles";
import {green, red} from "@material-ui/core/colors";
import {ErrorOutlined} from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const customTheme = createMuiTheme({
  palette: {
    primary: red,
    secondary: green
  }
});

export async function getServerSideProps(context) {
  const { gid, uid } = context.params;
  const redirect = encodeURIComponent(`/refer/${gid}/${uid}`);
  if (context.req.cookies && context.req.cookies['user-key']) {
    const userResponse = await fetch(`http://localhost:3000/api/verify`, {
      headers: { 'Authorization': `JWT ${context.req.cookies['user-key']}`}
    }).then(res => res.json());
    const giveawaysResponse = await fetch(`http://localhost:3000/api/giveaways?id=` + gid, {
      headers: { 'Authorization': `JWT ${context.req.cookies['user-key']}`}
    }).then(res => res.json());
    const referrer = await fetch(`http://localhost:3000/api/referrer?id=` + uid, {
      headers: { 'Authorization': `JWT ${context.req.cookies['user-key']}`}
    }).then(res => res.json());
    if (userResponse.user && giveawaysResponse.giveaways && referrer.user) return { props: { ...userResponse, referrer, giveaways: giveawaysResponse.giveaways, auth: context.req.cookies['user-key'] } };
    else return { redirect: { destination: `/`, permanent: false } };
  } else return { redirect: { destination: `/?redirect=${redirect}`, permanent: false } };
}

const useStyles = makeStyles((theme) => ({
  bar: {
    backgroundColor: theme.palette.background.paper
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  rightPart: {
    flexGrow: '1',
    display: "flex",
    flexDirection: 'row-reverse'
  },
  stretch: {
    height: '100%'
  }
}));

export default function Index({ user, participation, referrer, giveaways, auth }) {

  const giveaway = giveaways[0];

  const classes = useStyles();
  const [snack, setSnack] = React.useState({ message: null, type: 'success' });
  const [disabled, setDisabled] = React.useState(false);

  let error = null;

  const goHome = () => { window.location.replace('/home'); }
  const joinGiveaway = async () => {
    const subscriptions = await fetch('/api/user/join?host=' + giveaway.hostChannel + '&ga=' + giveaway.id + '&referred=' + referrer.user.uid, {
      method: 'POST',
      headers: { 'Authorization': `JWT ${auth}`}
    }).then(res => res.json());
    if (subscriptions.message) {
      setSnack({ message: subscriptions.message, type: 'error' });
    } else {
      if (!participation.giveaways[giveaway.id]) participation.giveaways[giveaway.id] = { joined: 1, referrals: 0 };
      else participation.giveaways[giveaway.id].joined = 1;
      setSnack({ message: 'You have joined the giveaway.', type: 'success'});
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') { return; }
    setSnack({ message: null, type: 'success' });
  };

  if (Object.keys(participation.giveaways).includes(giveaway.id) && participation.giveaways[giveaway.id].referred)
    error = 'You have already been referred to this giveaway.';
  else if (!Object.keys(referrer.participation.giveaways).includes(giveaway.id) || !referrer.participation.giveaways[giveaway.id].joined)
    error = 'Your referrer has not participated in the giveaway. Please check the refer link.';

  return (
    <div>
      <AppBar position='fixed' elevation={2} className={classes.bar}>
        <Toolbar variant="dense">
          <Typography variant='body1'>{user.displayName}</Typography>
          <div className={classes.rightPart}><Logout /></div>
        </Toolbar>
      </AppBar>
      <Box display="flex" flexDirection="column" justifyContent="start" alignItems="center" height="100vh" py={12}>
        {(!error) && (<Card variant='outlined'>
          <CardHeader
            color='textPrimary'
            title={`Join ${giveaway.title}`}
            subheader={<div>You have been referred by <Button color='primary' href={'https://youtube.com/channel/' + referrer.channel.id} target='_blank'>{referrer.user.displayName}</Button> to join this giveaway</div>}
          />
          <CardContent>
            <Typography variant='body1'>{giveaway.desc}</Typography>
            <Typography variant='body2'>Hosted by <Button href={'https://youtube.com/channel/' + giveaway.hostChannel} color='primary' variant='text' target='_blank'>{giveaway.host.displayName}</Button></Typography>
            <Typography variant='body2'>Giveaway ends <Moment fromNow date={giveaway.timeEnds._seconds * 1000} /></Typography>
          </CardContent>
          <CardActions style={{display: 'flex', justifyContent: 'space-between', marginTop: '2rem'}}><MuiThemeProvider theme={customTheme}>
            <Button disabled={disabled} variant='contained' color='secondary' onClick={async () => { setDisabled(true); await joinGiveaway(); }}>Join</Button>
            <Button variant='contained' color='primary' onClick={goHome}>Go Home</Button>
          </MuiThemeProvider></CardActions>
        </Card>)}
        {(error) && (<Card>
          <CardHeader
            color='textPrimary'
            avatar={
              <ErrorOutlined />
            }
            title='Error with referral'
            subheader={error}
          />
          <CardActions style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}><MuiThemeProvider theme={customTheme}>
            <Button onClick={goHome} style={{ width: '100%' }} variant='contained' color='primary'>Go Home</Button>
          </MuiThemeProvider></CardActions>
        </Card>)}
      </Box>
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={snack.message !== null} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snack.type}>
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
