import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library'
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
config();

export default async  (req, res) => {
  if (req.headers.authorization) {
    const [ tokenType, token ] = req.headers.authorization.split(' ');
    if (tokenType === 'JWT') {
      try {
        const user = jwt.verify(token, process.env.clientSecret);
        const oauth = new OAuth2Client(process.env.clientId, process.env.clientSecret);
        const youtube = google.youtube('v3');
        oauth.setCredentials(user.token);

        youtube.subscriptions.list({
          part: 'snippet,contentDetails',
          mine: true, auth: oauth, forChannelId: req.query.host
        }, (error, result) => {
          res.send({ error, result });
        });
      } catch (error) {
        console.log(error);
        res.status(401).json({ error });
      }
    } else res.status(401).json({ message: 'UNAUTHORIZED' });
  } else res.status(400).json({ message: 'BAD REQUEST' });
}