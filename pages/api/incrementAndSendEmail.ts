import {getIronSession} from 'iron-session';
import {SessionData, sessionOptions} from 'lib/session';
import {sendWinnerEmail} from 'lib/email';
import {connectToDatabase} from '../../util/mongodb';
const converter = require('number-to-words');

export default async (req, res) => {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  if (req.method === 'POST') {
    const {db} = await connectToDatabase();
    if (session.isLoggedIn) {
      try {
        const response = await db.collection('sourdough').findOneAndUpdate(
          {uniqueEmail: req.body.email},
          {
            $inc: {numberOfBreads: 1},
            $currentDate: {lastModified: true},
          },
          {returnDocument: 'after'}
        );
        const foundWinner = response.value;

        await sendWinnerEmail({
          email: foundWinner.email,
          name: foundWinner.name,
          numWins: converter.toWordsOrdinal(foundWinner.numberOfBreads),
          address: foundWinner.address,
        });

        res.json({user: response.value, email: 'ok'});
      } catch (e) {
        console.log(e);
        res.status(500).json(e);
      }
    } else res.status(403).end();
  } else {
    // Method not permitted
    res.status(405).end();
  }
};
