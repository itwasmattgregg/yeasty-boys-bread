import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "lib/session";
import { connectToDatabase } from "../../util/mongodb";
const client = require("@sendgrid/client");
const converter = require("number-to-words");

export default async (req, res) => {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  client.setApiKey(process.env.SENDGRID_API_KEY);

  if (req.method === "POST") {
    const { db } = await connectToDatabase();
    if (session.isLoggedIn) {
      try {
        const response = await db.collection("sourdough").findOneAndUpdate(
          { uniqueEmail: req.body.email },
          {
            $inc: { numberOfBreads: 1 },
            $currentDate: { lastModified: true },
          },
          { returnDocument: "after" }
        );
        const foundWinner = response.value;

        const request = {
          method: "POST",
          url: "/v3/mail/send",
          body: {
            template_id: "d-8eee7c28510044edb7200f18f43802e5",
            from: {
              email: "bread@yeastyboysbread.com",
            },
            personalizations: [
              {
                to: [
                  {
                    email: foundWinner.email,
                    name: foundWinner.name,
                  },
                ],
                dynamic_template_data: {
                  num_wins: converter.toWordsOrdinal(
                    foundWinner.numberOfBreads
                  ),
                  address: foundWinner.address,
                },
              },
            ],
          },
        };
        await client.request(request);
        // assume email went through
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
};
