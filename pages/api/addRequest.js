import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {


  if (req.method === 'POST') {
    const { db } = await connectToDatabase();

    let regex = /\+(.*)(?=@)/gm;
    const strippedEmail = req.body.email.replace(regex, '');

    // add request to database
    let response;
    try {
      response = await db
        .collection("sourdough")
        .insertOne({
          ...req.body,
          uniqueEmail: strippedEmail,
          numberOfBreads: 0,
        });
    } catch (e) {
      if (e.code === 11000) {
        res.status(500).send("You've already been added to the list");
        return;
      }
      response.status(500).end();
      return;
    }

    res.status(201).json({ ok: true });
  } else {
    // Method not permitted
    res.status(405).end();
  }
};
