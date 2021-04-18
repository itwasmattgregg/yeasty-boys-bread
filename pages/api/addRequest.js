import { connectToDatabase } from '../../util/mongodb';
const client = require('@sendgrid/client');

export default async (req, res) => {
  if (req.method === 'POST') {
    const { db } = await connectToDatabase();

    client.setApiKey(process.env.SENDGRID_API_KEY);
    const request = {
      method: 'PUT',
      url: '/v3/marketing/contacts',
    };

    let regex = /\+(.*)(?=@)/gm;
    const contact = req.body;
    const strippedEmail = contact.email.replace(regex, '');

    try {
      await db.collection('sourdough').insertOne({
        ...req.body,
        uniqueEmail: strippedEmail,
        numberOfBreads: 0,
      });
      request.body = {
        contacts: [
          {
            email: contact.email,
            first_name: contact.name,
          },
        ],
      };
      await client.request(request);
      res.status(201).json({ ok: true });
    } catch (e) {
      if (e.code === 11000) {
        res.status(500).send("You've already been added to the list");
        return;
      }
      res.status(500).end();
    }
  } else {
    // Method not permitted
    res.status(405).end();
  }
};
