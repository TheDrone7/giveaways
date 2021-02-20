import {Box, Typography} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  mainBox: { width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' },
  userGiveaway: {
    marginTop: '2rem;',
    width: '90%'
  }
})

export default function History({ participation, onViewAll }) {
  const classes = useStyles();

  return (<Box className={classes.mainBox}>
    <Box color="#cccccc" className={classes.userGiveaway}>
      { (Object.keys(participation).length > 0) && (<div>You have participated in some giveaways.</div>) }
      { (Object.keys(participation).length < 1) && (<div>
        <Typography variant="h3">You have never participated in any giveaways.</Typography>
        <Button onClick={onViewAll} style={{ marginTop: '1rem' }} variant="outlined" size="large" color="primary">Check out the ongoing giveaways!</Button>
      </div>)}
    </Box>
  </Box>)
}