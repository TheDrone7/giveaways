const refreshTokenSetup =  (res) => {
  let timing = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

  const refreshToken = async () => {
    const newAuth = await res.reloadAuthResponse();
    timing = (newAuth.expires_in || 3600 - 5 * 60) * 1000;

    console.log('newAuth', newAuth)
    console.log('newAuthToken', newAuth.id_token);

    setTimeout(refreshToken, timing);

    let loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response:{
          tokenObj: newAuth,
          tokenId: newAuth.id_token
        }})
    });
    if (loginResponse.status !== 200) alert(`Trouble logging in :: ${await loginResponse.text()}`);
    else {
      let login = await loginResponse.json();
      document.cookie = 'user-key=;max-age=0;path=/;' + document.cookie;
      document.cookie = 'user-key=' + login.user + ';path=/;' + document.cookie;
    }
  }

  setTimeout(refreshToken, timing)
}

export default refreshTokenSetup;