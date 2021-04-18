import { connectToDatabase } from '../../util/mongodb';
import withSession from '../../lib/session';

export default withSession(async (req, res) => {
  const user = req.session.get('user');

  if (req.method === 'POST') {
    const { db } = await connectToDatabase();
    if (user) {
      try {
        const response = await db
          .collection('sourdough')
          .findOneAndUpdate(
            { uniqueEmail: req.body.email },
            { $inc: { numberOfBreads: 1 } }
          );
        res.json(response.value);
      } catch (e) {
        res.status(500).end();
      }
    } else res.status(403).end();
  } else {
    // Method not permitted
    res.status(405).end();
  }
});
