import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
config();

import { auth, Channel, Participation } from '../../firebase';

export default async  (req, res) => {
  if (req.headers.authorization && req.query.id) {
    const [ tokenType, token ] = req.headers.authorization.split(' ');
    if (tokenType === 'JWT') {
      try {
        jwt.verify(token, process.env.clientSecret);
        const user = await auth.getUser(req.query.id);
        const channel = await new Channel(req.query.id).fetch();
        const participation = await new Participation(req.query.id).fetch();
        if (!user || !channel || !participation) res.status(404).json({ message: 'Referrer not found. Check the link please.' });
        else res.status(200).json({ user, channel, participation });
      } catch (error) {
        console.log(error);
        res.status(401).json({ error });
      }
    } else res.status(401).json({ message: 'UNAUTHORIZED' });
  } else res.status(400).json({ message: 'BAD REQUEST' });
}