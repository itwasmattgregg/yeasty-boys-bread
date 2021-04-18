import withSession from '../../lib/session';

export default withSession(async (req, res) => {
  const { password } = await req.body;

  try {
    if (password === process.env.PASSWORD) {
      const user = { isLoggedIn: true };
      req.session.set('user', user);
      await req.session.save();
      res.json(user);
    } else {
      const user = { isLoggedIn: false };
      res.json(user);
    }
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
