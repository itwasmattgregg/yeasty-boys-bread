import {addContact, sendWelcomeEmail} from '../../lib/email';
import {connectToDatabase} from '../../util/mongodb';

export default async (req, res) => {
  if (req.method === 'POST') {
    const {db} = await connectToDatabase();

    let regex = /\+(.*)(?=@)/gm;
    const {email, name, address} = req.body;
    const strippedEmail = email.replace(regex, '');

    try {
      await db.collection('sourdough').insertOne({
        email,
        name,
        address,
        uniqueEmail: strippedEmail,
        numberOfBreads: 0,
      });
      await sendWelcomeEmail({email});
      await addContact({email, name});
      res.status(201).json({ok: true});
    } catch (e) {
      if (e.code === 11000) {
        res.status(500).send("You've already been added to the list");
        return;
      }
      console.log(e);
      res.status(500).end();
    }
  } else {
    // Method not permitted
    res.status(405).end();
  }
};
