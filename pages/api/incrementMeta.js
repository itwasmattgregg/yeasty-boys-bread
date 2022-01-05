import { connectToDatabase } from "../../util/mongodb";
import withSession from "../../lib/session";
const client = require("@sendgrid/client");

export default withSession(async (req, res) => {
  const user = req.session.get("user");

  client.setApiKey(process.env.SENDGRID_API_KEY);

  if (req.method === "POST") {
    const { db } = await connectToDatabase();
    if (user) {
      const { body } = req;
      try {
        let response;

        if (body.donated) {
          response = await db.collection("otherBread").findOneAndUpdate(
            {},
            {
              $inc: { donated: 1 },
            }
          );
        } else if (body.sold) {
          response = await db.collection("otherBread").findOneAndUpdate(
            {},
            {
              $inc: { sold: 1 },
            }
          );
        } else if (body.kept) {
          response = await db.collection("otherBread").findOneAndUpdate(
            {},
            {
              $inc: { kept: 1 },
            }
          );
        } else {
          throw new Error("Error");
        }

        res.json({ user: response.value, email: "ok" });
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
