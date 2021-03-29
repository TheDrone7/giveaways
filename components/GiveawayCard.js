import {
  Card,
  CardActions,
  CardContent,
  Typography,
  makeStyles,
  CardMedia,
  Box,
  Button
} from "@material-ui/core";
import Moment from "react-moment";
import {ChevronRight} from "@material-ui/icons";
import React from "react";

const useStyles = makeStyles({
  root: {
    display: 'flex',
    marginBottom: '3rem'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '3rem'
  },
  title: {
    marginBottom: '2rem'
  },
  profilePic: {
    width: '17.4375rem',
    height: '100%'
  },
  spacer: {
    flexGrow: '1'
  },
  buttons: {
    marginTop: '3rem',
    padding: '0'
  },
  centerAll: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  desc: {
    whiteSpace: 'nowrap',
    right: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
});

export default function GiveawayCard({ giveaway, openGiveaway }) {
  const classes = useStyles();

  let userPhoto = giveaway.host.photoURL.split('=');
  userPhoto.pop();
  userPhoto = userPhoto.join('=')
  userPhoto += '=s512';

  return (<Card className={classes.root}>
    <Box display={{ xs: 'none', md: 'block' }}><CardMedia className={classes.profilePic} image={userPhoto} title={giveaway.host.displayName} /></Box>
    <CardContent className={classes.content}>
      <Typography variant="h4" component="h2">{giveaway.title}</Typography>
      <Typography variant="subtitle1" color="textSecondary" component="p" className={classes.title}>Hosted by <Typography color="textPrimary" component="span">{giveaway.host.displayName}</Typography></Typography>
      <Typography variant="body1" className={classes.desc} component="p">{giveaway.desc.length > 160 ? giveaway.desc.substr(0, 160) + '...' : giveaway.desc}</Typography>
      <Typography variant="body1" component="p">Giveaway ends <Moment fromNow date={giveaway.timeEnds * 1000} /></Typography>
      <div className={classes.spacer} />
      <CardActions className={classes.buttons}>
        <Button onClick={openGiveaway} size='large' variant='outlined'>
          <div className={classes.centerAll}>View Details &#8195; <ChevronRight style={{ fontSize: '1.125rem' }} /></div>
        </Button>
      </CardActions>
    </CardContent>
  </Card>)
}