import React from 'react';
import { Box, Typography } from '@material-ui/core';
import Login from "../components/LoginButton";

export default function Index() {
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
      <Typography variant="h2">Giveaways</Typography>
      <Box my={4} />
      <Login />
    </Box>
  );
}
