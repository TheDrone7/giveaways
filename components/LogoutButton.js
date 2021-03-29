import React from 'react';
import { GoogleLogout } from 'react-google-login';
import Button from "@material-ui/core/Button";

const clientId = '690269576735-s6atuq17k2cpr244oate9ono3d9hbcov.apps.googleusercontent.com';

function Logout() {
  const onSuccess = (res) => {
    document.cookie='user-key=;max-age=0;path=/;' + document.cookie;
    window.location.replace('/');
  }

  const onFailure = async (res) => {
    console.log(res);
  }

  return (<div>
    <GoogleLogout
      clientId={clientId}
      render={props => (<Button variant="contained" color="secondary" disabled={props.disabled} onClick={props.onClick}>Logout</Button>)}
      buttonText="Logout"
      onLogoutSuccess={onSuccess}
      onFailure={onFailure}
    />
  </div>)
}

export default Logout;