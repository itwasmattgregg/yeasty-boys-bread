import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
  if (req.method === "POST") {
    const { db } = await connectToDatabase();
    const { image, name } = req.body;

    const isBase64 = (text) => {
      let utf8 = Buffer.from(text).toString("utf8");
      // eslint-disable-next-line no-control-regex
      return !/[^\x00-\x7f]/.test(utf8);
    };

    if (!isBase64(image)) {
      res.status(500).end();
      return;
    }

    try {
      await db.collection("designs").insertOne({
        image,
        name,
      });

      res.status(201).json({ ok: true });
    } catch (e) {
      res.status(500).end();
    }
  } else {
    // Method not permitted
    res.status(405).end();
  }
};
