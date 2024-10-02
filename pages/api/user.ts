import {getIronSession} from 'iron-session';
import {sessionOptions} from 'lib/session';

export default async (req, res) => {
  const session = await getIronSession<any>(req, res, sessionOptions);

  res.json(session);
};
