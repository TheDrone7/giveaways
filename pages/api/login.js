import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library'
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
config();

import { auth, Channel, Participation } from '../../firebase';

export default async (req, res) => {
  if (req.method === 'POST') {
    if (req.body.response) {

      const oauth = new OAuth2Client(process.env.clientId, process.env.clientSecret);
      const youtube = google.youtube('v3');

      const ticket = await oauth.verifyIdToken({ idToken: req.body.response.tokenId, audience: process.env.clientId });
      const payload = ticket.getPayload();

      auth.getUserByEmail(payload.email).then(user => {

        let userData = user.toJSON();
        userData.token = req.body.response.tokenObj;
        const userKey = jwt.sign(userData, process.env.clientSecret);
        res.status(200).json({ user: userKey });

      }).catch(async error => {

        if (error.code === 'auth/user-not-found') {
          oauth.setCredentials(req.body.response.tokenObj);
          youtube.channels.list({
            mine: true, auth: oauth, part: 'snippet'
          }, async (err, response) => {
            if (err)
              res.status(401).send({ message: `APIError.\n${err}` });
            else if (response.data.items.length < 1)
              res.status(404).send({ message: `No such channel found` });
            else {
              const channel = response.data.items[0];
              let newUser = await auth.createUser({
                email: payload.email,
                emailVerified: payload.email_verified,
                displayName: payload.name,
                photoURL: payload.picture
              }).catch(res.send);
              await new Channel(newUser.uid, channel.id, channel.snippet.title, channel.snippet.description || 'No description').save();
              await new Participation(newUser.uid).save();
              let userData = newUser.toJSON();
              userData.token = req.body.response.tokenObj;
              const userKey = jwt.sign(userData, process.env.clientSecret);
              res.status(200).json({ user: userKey });
            }
          });
        } else {
          res.status(401).json({ message: 'Error fetching the user', error });
        }

      });

    } else res.status(401).json({ message: 'Unauthorized.' });
  } else res.status(404).end();
}