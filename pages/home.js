import React from 'react';
import {Box, makeStyles, AppBar, Toolbar, Tabs, Tab} from '@material-ui/core';
import fetch from 'node-fetch';
import Logout from "../components/LogoutButton";
import TabPanel from "../components/TabPanel";
import Home from "../components/pages/Home";
import History from "../components/pages/History";
import Giveaways from "../components/pages/Giveaways";

function a11yProps(index) { return { id: `tab-${index}`, 'aria-controls': `tabpanel-${index}` }; }

export async function getServerSideProps(context) {
  if (context.req.cookies && context.req.cookies['user-key']) {
    const userResponse = await fetch(`http://localhost:3000/api/verify`, {
      headers: { 'Authorization': `JWT ${context.req.cookies['user-key']}`}
    }).then(res => res.json());
    const giveawaysResponse = await fetch(`http://localhost:3000/api/giveaways`, {
      headers: { 'Authorization': `JWT ${context.req.cookies['user-key']}`}
    }).then(res => res.json());
    if (userResponse.user && giveawaysResponse.giveaways) return { props: { ...userResponse, giveaways: giveawaysResponse.giveaways, auth: context.req.cookies['user-key'] } };
    else return { redirect: { destination: '/', permanent: false } };
  } else return { redirect: { destination: '/', permanent: false } };
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

export default function Index({ user, participation, giveaways, auth }) {

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => { setValue(newValue); };

  return (
    <div>
      <AppBar position='fixed' elevation={2} className={classes.bar}>
        <Toolbar variant="dense">
          <Tabs className={classes.stretch} value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Home" {...a11yProps(0)} />
            <Tab label="All giveaways" {...a11yProps(1)} />
            <Tab label="My past giveaways" {...a11yProps(2)} />
          </Tabs>
          <div className={classes.rightPart}><Logout /></div>
        </Toolbar>
      </AppBar>
      <Box display="flex" flexDirection="column" justifyContent="start" alignItems="center" height="100vh" py={12}>
        <TabPanel value={value} index={0}>
          <Home onViewAll={() => { setValue(1) }} user={user} participation={participation.giveaways} auth={auth} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Giveaways giveaways={giveaways.filter(g => (g.timeEnds * 1000) > Date.now())} participation={participation.giveaways} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <History onViewAll={() => { setValue(1) }} participation={participation.giveaways} />
        </TabPanel>
      </Box>
    </div>
  );
}
