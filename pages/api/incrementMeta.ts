import {getIronSession} from 'iron-session';
import {SessionData, sessionOptions} from 'lib/session';
import {connectToDatabase} from '../../util/mongodb';
const client = require('@sendgrid/client');

export default async (req, res) => {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  client.setApiKey(process.env.SENDGRID_API_KEY);

  if (req.method === 'POST') {
    const {db} = await connectToDatabase();
    if (session.isLoggedIn) {
      const {body} = req;
      try {
        let response;

        if (body.donated) {
          response = await db.collection('otherBread').findOneAndUpdate(
            {},
            {
              $inc: {donated: 1},
            }
          );
        } else if (body.sold) {
          response = await db.collection('otherBread').findOneAndUpdate(
            {},
            {
              $inc: {sold: 1},
            }
          );
        } else if (body.kept) {
          response = await db.collection('otherBread').findOneAndUpdate(
            {},
            {
              $inc: {kept: 1},
            }
          );
        } else {
          throw new Error('Error');
        }

        res.json({user: response.value, email: 'ok'});
      } catch (e) {
        console.log(e.response.body);
        res.status(500).json(e);
      }
    } else res.status(403).end();
  } else {
    // Method not permitted
    res.status(405).end();
  }
};
