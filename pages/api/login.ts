import { SessionData, sessionOptions } from "../../lib/session";
import { getIronSession } from "iron-session";

export default async (req, res) => {
  const { password } = await req.body;
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  try {
    if (password === process.env.PASSWORD) {
      session.isLoggedIn = true;
      await session.save();
      res.json(session);
    } else {
      res.json(session);
    }
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
};
