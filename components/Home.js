import {Box, Card, CardContent, CardMedia, Typography} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

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

export default function Home({ user, participation, onViewAll }) {
  const classes = useStyles();

  let userPhoto = user.photoURL.split('=');
  userPhoto.pop();
  userPhoto = userPhoto.join('=')
  userPhoto += '=s512';

  return (<Box className={classes.mainBox}>
    <Card className={classes.root} elevation={4}>
      <Box display={{ xs: 'none', md: 'block' }}><CardMedia className={classes.profilePic} image={userPhoto} title={user.displayName} /></Box>
      <CardContent className={classes.content}>
        <Typography variant="h2">Welcome</Typography>
        <Typography variant="h2">{user.displayName}</Typography>
      </CardContent>
    </Card>
    <Box color="#cccccc" className={classes.userGiveaway}>
      { (Object.keys(participation).length > 0) && (<div>You have participated in some giveaways.</div>) }
      { (Object.keys(participation).length < 1) && (<div>
        <Typography variant="h4">You have not participated in any giveaways.</Typography>
        <Button onClick={onViewAll} style={{ marginTop: '1rem' }} variant="outlined" color="primary">Check out the ongoing giveaways!</Button>
      </div>)}
    </Box>
  </Box>)
}