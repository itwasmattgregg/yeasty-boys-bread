import { connectToDatabase } from "../../util/mongodb";
import { SessionData, sessionOptions } from "../../lib/session";
import { getIronSession } from "iron-session";

export default async (req, res) => {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  if (req.method === "POST") {
    const { db } = await connectToDatabase();
    if (session.isLoggedIn) {
      try {
        const response = await db.collection("sourdough").findOneAndUpdate(
          { uniqueEmail: req.body.email },
          {
            $set: { paused: false },
          }
        );

        res.json({ user: response.value });
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
