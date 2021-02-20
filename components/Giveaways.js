import {Box, Typography} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  mainBox: { width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' },
  root: {
    marginTop: '2rem;',
    width: '90%'
  }
})

export default function Giveaways({ giveaways }) {
  const classes = useStyles();

  return (<Box className={classes.mainBox}>
    <Box color="#cccccc" className={classes.root}>
      { (giveaways.length > 0) && (<div>There seem to be some ongoing giveaways.</div>) }
      { (giveaways.length < 1) && (<div>
        <Typography variant="h3">There seem to be no ongoing giveaways for now. Check again later!</Typography>
      </div>)}
    </Box>
  </Box>)
}