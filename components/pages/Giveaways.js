import {Box, Snackbar, Typography} from "@material-ui/core";
import React from "react";
import MuiAlert from "@material-ui/lab/Alert";
import {makeStyles} from "@material-ui/core/styles";
import GiveawayCard from "../GiveawayCard";
import GiveawayModal from "../GiveawayModal";

const useStyles = makeStyles({
  mainBox: { width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' },
  root: {
    marginTop: '2rem;',
    width: '90%'
  }
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Giveaways({ giveaways, participation }) {
  const classes = useStyles();

  const [giveaway, setGiveaway] = React.useState(null);
  const [snack, setSnack] = React.useState({ message: null, type: 'success' });

  const joinGiveaway = async (host, id) => {
    const subscriptions = await fetch('/api/user/join?host=' + host + '&ga=' + id, {
      method: 'POST',
      headers: { 'Authorization': `JWT ${document.cookie.split(';').find(c => c.includes('user-key')).split('=')[1]}`}
    }).then(res => res.json());
    if (subscriptions.message) {
      setSnack({ message: subscriptions.message, type: 'error' });
    } else {
      if (!participation[id]) participation[id] = { joined: 1, referrals: 0 };
      else participation[id].joined = 1;
      setSnack({ message: 'You have joined the giveaway.', type: 'success'});
    }
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

  return (<Box className={classes.mainBox}>
    <Box color="#cccccc" className={classes.root}>
      { (giveaways.length > 0) && (<div>
        { giveaways.map((g, i) => Date.now() < (g.timeEnds * 1000 ) ? <GiveawayCard openGiveaway={() => { setGiveaway(g); }} giveaway={g} key={i} /> : null) }
      </div>) }
      { (giveaways.length < 1) && (<div>
        <Typography variant="h3">There seem to be no ongoing giveaways for now. Check again later!</Typography>
      </div>)}
    </Box>
    {<GiveawayModal handleClose={() => { setGiveaway(null); }} joinGiveaway={async () => { await joinGiveaway(giveaway.hostChannel, giveaway.id); setGiveaway(null)}} leaveGiveaway={async () => { await leaveGiveaway(giveaway.hostChannel, giveaway.id); setGiveaway(null); }} open={giveaway !== null} giveaway={giveaway} participation={participation} />}
    <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={snack.message !== null} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={snack.type}>
        {snack.message}
      </Alert>
    </Snackbar>
  </Box>)
}