import React from 'react';
import { GoogleLogin } from 'react-google-login';
import Button from "@material-ui/core/Button";
import refreshTokenSetup from '../src/refreshToken';

const clientId = '690269576735-s6atuq17k2cpr244oate9ono3d9hbcov.apps.googleusercontent.com';
const scope = ['email', 'profile', 'https://www.googleapis.com/auth/youtube.readonly'];

function Login() {
  const onSuccess = async (res) => {
    let loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: res })
    });
    if (loginResponse.status === 200) {
      let login = await loginResponse.json();
      document.cookie = 'user-key=' + login.user + ';' + document.cookie;
      window.location.replace('/home');
    } else alert(`Trouble logging in :: ${await loginResponse.text()}`);

    refreshTokenSetup(res);
  }

  const onFailure = (res) => {
    alert(`Error logging in. ${res.error}`);
  }

  return (<div>
    <GoogleLogin
      clientId={clientId}
      scope={scope.join(' ')}
      render={props => (<Button variant="contained" size="large" color="primary" disabled={props.disabled} onClick={props.onClick}>Login</Button>)}
      buttonText="Login"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
      isSignedIn={true}
      prompt='consent'
    />
  </div>)
}

export default Login;