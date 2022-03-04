import { connectToDatabase } from "../../util/mongodb";
import withSession from "../../lib/session";
import { NextApiResponse } from "next";

export type Images = {
  images: String[];
};

export default withSession(async (req, res: NextApiResponse<Images>) => {
  const user = req.session.get("user");

  if (user) {
    const { db } = await connectToDatabase();

    const imagesRes = await db.collection("designs").find({});
    res.json({ images: await imagesRes.toArray() });
  }
});
