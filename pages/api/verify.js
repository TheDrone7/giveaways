import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
config();

import { Channel, Participation } from '../../firebase';

export default async  (req, res) => {
  if (req.headers.authorization) {
    const [ tokenType, token ] = req.headers.authorization.split(' ');
    if (tokenType === 'JWT') {
      try {
        const user = jwt.verify(token, process.env.clientSecret);
        const channel = await new Channel(user.uid).fetch();
        const participation = await new Participation(user.uid).fetch();
        res.status(200).json({ user, channel, participation });
      } catch (error) {
        console.log(error);
        res.status(401).json({ error });
      }
    } else res.status(401).json({ message: 'UNAUTHORIZED' });
  } else res.status(400).json({ message: 'BAD REQUEST' });
}