import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
config();

import { Giveaway, auth } from '../../firebase';

export default async  (req, res) => {
  if (req.headers.authorization) {
    const [ tokenType, token ] = req.headers.authorization.split(' ');
    if (tokenType === 'JWT') {
      try {
        const user = jwt.verify(token, process.env.clientSecret);
        let giveaways;
        if (!req.query.id)
          giveaways = await Giveaway.fetchAll();
        else {
          giveaways = [];
          giveaways.push(await new Giveaway(req.query.id).fetch());
        }
        for (const g of giveaways) {
          g.host = await auth.getUser(g.host.trim());
        }
        res.status(200).json({ user, giveaways });
      } catch (error) {
        console.log(error);
        res.status(401).json({ error });
      }
    } else res.status(401).json({ message: 'UNAUTHORIZED' });
  } else res.status(400).json({ message: 'BAD REQUEST' });
}