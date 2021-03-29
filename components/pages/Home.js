import {Box, Card, CardContent, CardMedia, Snackbar, Typography} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import HomeGiveaway from "../HomeGiveaway";
import ParticipationModal from "../ParticipationModal";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles({
  mainBox: { width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' },
  root: {
    padding: '2rem',
    display: 'flex',
    width: '90%',
  },
  profilePic: {
    width: '14.5rem',
    height: '100%',
    borderRadius: '12px'
  },
  content: {
    margin: '1.5rem'
  },
  userGiveaway: {
    marginTop: '2rem;',
    width: '90%'
  }
})

export default function Home({ user, participation, onViewAll, auth }) {
  const classes = useStyles();

  const [gid, setGid] = React.useState(false);
  const [snack, setSnack] = React.useState({ message: null, type: 'success' });

  let userPhoto = user.photoURL.split('=');
  userPhoto.pop();
  userPhoto = userPhoto.join('=')
  userPhoto += '=s512';

  const fetchGiveaway = async (gid) => {
    let giveaway = await fetch((new URL(window.location.href)).origin + '/api/giveaways?id=' + gid, {
      headers: {
        Authorization: `JWT ${auth}`
      }
    }).then(r => r.json());
    setGid(giveaway.giveaways[0]);
  }

  const leaveGiveaway = async (host, id) => {
    const subscriptions = await fetch('/api/user/leave?host=' + host + '&ga=' + id, {
      method: 'POST',
      headers: { 'Authorization': `JWT ${document.cookie.split(';').find(c => c.includes('user-key')).split('=')[1]}`}
    }).then(res => res.json());
    if (subscriptions.message) {
      setSnack({ message: subscriptions.message, type: 'error' });
    } else {
      participation[id].joined = 0
      setSnack({ message: 'You have left the giveaway.', type: 'success'});
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') { return; }
    setSnack({ message: null, type: 'success' });
  };

  let giveawayCards = Object.keys(participation).filter(p => participation[p].joined === 1).map((g, i) => <HomeGiveaway part={participation[g]} openGiveaway={() => fetchGiveaway(g)} gid={g} key={i} auth={auth} />);

  return (<Box className={classes.mainBox}>
    <Card className={classes.root} elevation={4}>
      <Box display={{ xs: 'none', md: 'block' }}><CardMedia className={classes.profilePic} image={userPhoto} title={user.displayName} /></Box>
      <CardContent className={classes.content}>
        <Typography variant="h2">Welcome</Typography>
        <Typography variant="h2">{user.displayName}</Typography>
      </CardContent>
    </Card>
    <Box color="#cccccc" className={classes.userGiveaway}>
      { (giveawayCards.length > 0) && (giveawayCards) }
      { (giveawayCards.length < 1) && (<div>
        <Typography variant="h4">You have not participated in any giveaways.</Typography>
        <Button onClick={onViewAll} style={{ marginTop: '1rem' }} variant="outlined" color="primary">Check out the ongoing giveaways!</Button>
      </div>)}
      <ParticipationModal leaveGiveaway={async () => { await leaveGiveaway(gid.hostChannel, gid.id); setGid(false) } } open={gid} uid={user.uid} participation={participation} handleClose={() => setGid(false)} giveaway={gid} />
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={snack.message !== null} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snack.type}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  </Box>)
}