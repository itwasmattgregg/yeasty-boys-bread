import {connectToDatabase} from '../../util/mongodb';
import {SessionData, sessionOptions} from '../../lib/session';
import {getIronSession} from 'iron-session';
import {removeContact} from '../../lib/email';

export default async (req, res) => {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  const {email} = req.body;

  if (req.method === 'POST') {
    const {db} = await connectToDatabase();
    if (session.isLoggedIn) {
      try {
        // Admin may pass either the display email or uniqueEmail.
        const findToCopy = await db.collection('sourdough').findOne({
          $or: [{uniqueEmail: email}, {email}],
        });

        if (!findToCopy) {
          console.log('No documents matched the query. Deleted 0 documents.');
          throw new Error("Couldn't find user");
        }

        await db.collection('archived').insertOne(findToCopy);

        const result = await db.collection('sourdough').deleteOne({
          _id: findToCopy._id,
        });

        if (result.deletedCount === 1) {
          console.log('Successfully deleted one document.');

          // Best-effort Resend cleanup; Mongo delete already succeeded.
          await removeContact(findToCopy.email || findToCopy.uniqueEmail);

          res.json({deleted: 'ok'});
        } else {
          console.log('No documents matched the query. Deleted 0 documents.');

          throw new Error("Couldn't find user");
        }
      } catch (e) {
        console.log(e);
        res.status(500).end();
      }
    } else res.status(403).end();
  } else {
    // Method not permitted
    res.status(405).end();
  }
};
