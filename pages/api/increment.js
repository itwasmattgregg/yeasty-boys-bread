import { connectToDatabase } from '../../util/mongodb';
import withSession from '../../lib/session';
const client = require('@sendgrid/client');

export default withSession(async (req, res) => {
  const user = req.session.get('user');

  client.setApiKey(process.env.SENDGRID_API_KEY);

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
        const foundWinner = response.value;

        const request = {
          method: 'POST',
          url: '/v3/mail/send',
          body: {
            template_id: 'd-8eee7c28510044edb7200f18f43802e5',
            from: {
              email: 'mattdgregg@gmail.com',
            },
            personalizations: [
              {
                to: [
                  {
                    email: foundWinner.email,
                    name: foundWinner.name,
                  },
                ],
              },
            ],
          },
        };
        await client.request(request);
        // assume email went through
        res.json({ user: foundWinner, email: 'ok' });
      } catch (e) {
        console.log(e.response.body);
        res.status(500).json(e);
      }
    } else res.status(403).end();
  } else {
    // Method not permitted
    res.status(405).end();
  }
});
