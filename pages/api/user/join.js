import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library'
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import {Participation, Giveaway, fieldValue} from "../../../firebase";
config();

export default async  (req, res) => {
  if (req.headers.authorization && req.query.host && req.query.ga) {
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
        }, async (error, result) => {
          if (error) res.status(401).send({ message: 'Could not fetch the subscriptions. Try logging out and logging in again.' });
          else {
            if (result && result.data && result.data.items.length && result.data.items.length > 0) {
              const userGa = await new Participation(user.uid).fetch();
              if (!userGa.giveaways[req.query.ga]) userGa.giveaways[req.query.ga] = {};
              userGa.giveaways[req.query.ga].joined = 1;
              if (!userGa.giveaways[req.query.ga].referrals)
                userGa.giveaways[req.query.ga].referrals = 0;
              if (req.query.referred)
                userGa.giveaways[req.query.ga].referred = true;
              const ga = await new Giveaway(req.query.ga).fetch();
              if (!ga.participants.includes(user.uid)) ga.participants.push(user.uid);
              await userGa.save();
              await ga.save();
              if (req.query.referred) {
                const referrerGa = await new Participation(req.query.referred).fetch();
                referrerGa.giveaways[req.query.ga].referrals += 1;
                await referrerGa.save();
              }
              res.status(200).send({ message: null });
            } else res.status(400).send({ message: 'You are not subscribed to the host. Subscribe and try again!' });
          }
        });
      } catch (error) {
        console.log(error);
        res.status(401).json({ error });
      }
    } else res.status(401).json({ message: 'UNAUTHORIZED' });
  } else res.status(400).json({ message: 'BAD REQUEST' });
}