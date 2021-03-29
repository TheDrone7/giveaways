import {
  Card,
  CardContent,
  Typography,
  makeStyles, CardActions, Button, IconButton,
} from "@material-ui/core";
import {ChevronRight} from "@material-ui/icons";
import React from "react";

const useStyles = makeStyles({
  root: {
    display: 'inline-flex',
    marginBottom: '2rem',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '1rem',
    paddingRight: '0'
  },
  title: {
    marginBottom: '0'
  },
  subtitle: {
    marginTop: '0',
    marginBottom: '1rem'
  },
  button: {
    marginLeft: '2rem',
    fontSize: '2rem'
  }
});

export default function HomeGiveaway({ gid, auth, part, openGiveaway }) {
  const classes = useStyles();

  const [giveaway, setGiveaway] = React.useState(null);

  React.useEffect(async () => {
    let link = new URL(window.location.href);
    let giveaway = await fetch(link.origin + '/api/giveaways?id=' + gid, {
      headers: {
        Authorization: `JWT ${auth}`
      }
    }).then(r => r.json());
    setGiveaway(giveaway.giveaways[0]);
  });

  return (<Card className={classes.root} variant='outlined'>

      {(giveaway) && (
        <CardContent className={classes.content}>
          <div>
            <Typography variant="h5" component="h2" className={classes.title}>{giveaway.title}</Typography>
            <Typography variant="subtitle1" component="h2" className={classes.subtitle}>By {giveaway.host.displayName}</Typography>
            <Typography variant="body1" component="p">Entries: {part.joined} | {part.referrals}</Typography>
          </div>
          <CardActions className={classes.buttons}>
            <IconButton onClick={openGiveaway} className={classes.button}><ChevronRight style={{ fontSize: '100%' }} /></IconButton>
          </CardActions>
        </CardContent>
      )}
  </Card>)
}