import { connectToDatabase } from "../../util/mongodb";
import withSession from "../../lib/session";
const client = require("@sendgrid/client");

export default withSession(async (req, res) => {
  const user = req.session.get("user");
  const { email } = req.body;

  client.setApiKey(process.env.SENDGRID_API_KEY);

  if (req.method === "POST") {
    const { db } = await connectToDatabase();
    if (user) {
      try {
        const result = await db
          .collection("sourdough")
          .deleteOne({ uniqueEmail: email });

        if (result.deletedCount === 1) {
          console.log("Successfully deleted one document.");

          const request = {
            url: `/v3/marketing/contacts/search/emails`,
            method: "POST",
            body: {
              emails: [email],
            },
          };

          const [, userResponse] = await client.request(request);
          const userId = userResponse.result[email].contact.id;

          if (userId) {
            const deleteRequest = {
              method: "DELETE",
              url: `/v3/marketing/contacts?ids=${userId}`,
            };
            const resp = await client.request(deleteRequest);
            console.log(resp);
          }

          res.json({ deleted: "ok" });
        } else {
          console.log("No documents matched the query. Deleted 0 documents.");

          throw new Error("Couldn't find user");
        }
      } catch (e) {
        console.log(e)
        res.status(500).end();
      }
    } else res.status(403).end();
  } else {
    // Method not permitted
    res.status(405).end();
  }
});
