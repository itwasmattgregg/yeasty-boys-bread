import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {


  if (req.method === 'POST') {
    const { db } = await connectToDatabase();

    let regex = /\+(.*)(?=@)/gm;
    // let re = new RegExp(regex);
    // const foundPlus = re.test(req.body.email);
    const strippedEmail = req.body.email.replace(regex, '');


    // Check if user is already in database
    const findEmail = await db
      .collection("sourdough")
      .findOne({
        email: strippedEmail
      });

    if (findEmail) {
      res.status(500).send("You've already been added to the list");
      return;
    }

    // add request to database
    const request = await db
      .collection("sourdough")
      .insertOne({
        ...req.body,
        email: strippedEmail,
        numberOfBreads: 0,
      });

    res.status(201).json(request);
  } else {
    // Method not permitted
    res.status(405).end();
  }
};
