import { connectToDatabase } from "../../util/mongodb";
import { NextApiResponse } from "next";

export type Images = {
  images: String[];
};

export default async (_, res: NextApiResponse<Images>) => {
  const { db } = await connectToDatabase();

  const imagesRes = await db.collection("designs").find({});
  res.json({ images: await imagesRes.toArray() });
};
