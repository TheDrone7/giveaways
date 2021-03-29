import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import {Participation} from "../../../firebase";
config();

export default async  (req, res) => {
  if (req.headers.authorization && req.query.host && req.query.ga) {
    const [ tokenType, token ] = req.headers.authorization.split(' ');
    if (tokenType === 'JWT') {
      try {
        const user = jwt.verify(token, process.env.clientSecret);
        const userGa = await new Participation(user.uid).fetch();
        if (!userGa.giveaways[req.query.ga]) userGa.giveaways[req.query.ga] = {};
        userGa.giveaways[req.query.ga].joined = 0;
        if (!userGa.giveaways[req.query.ga].referrals)
          userGa.giveaways[req.query.ga].referrals = 0;
        await userGa.save();
        res.status(200).send({ message: null });
      } catch (error) {
        console.log(error);
        res.status(401).json({ error });
      }
    } else res.status(401).json({ message: 'UNAUTHORIZED' });
  } else res.status(400).json({ message: 'BAD REQUEST' });
}