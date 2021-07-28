import withSession from "../lib/session";
import Layout from "../components/Layout";
import fetchJson from "../lib/fetchJson";
import { connectToDatabase } from "../util/mongodb";
import { useState } from "react";
import useRouterRefresh from "../lib/useRouterRefresh";

const Admin = ({ breadies }) => {
  const [winner, setWinner] = useState();
  const [emailSent, setEmailSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const refresh = useRouterRefresh();

  const pickWinner = (array) => {
    setEmailSent(false);
    const lowestNumber = array.reduce(
      (a, { numberOfBreads }) => Math.min(a, numberOfBreads),
      array[0].numberOfBreads
    );
    let weightedArray = array.reduce((acc, item) => {
      const wins = item.numberOfBreads;
      const weight = (num) => Math.floor(10 * 3 ** (0.1 + lowestNumber - num));
      const tempArray = new Array(weight(wins));
      tempArray.fill(item);
      return [...acc, ...tempArray];
    }, []);
    return weightedArray[Math.floor(Math.random() * weightedArray.length)];
  };

  const incrementAndSendEmail = async (winnerEmail) => {
    setSubmitting(true);
    try {
      await fetchJson("/api/incrementAndSendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: winnerEmail }),
      });
      setEmailSent(true);
      refresh();
    } catch (error) {
      console.error("An unexpected error happened:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto mt-20 px-6 max-w-3xl">
        <h1>Admin</h1>
        <button onClick={() => setWinner(pickWinner(breadies))}>
          Select winner
        </button>
        {winner && (
          <>
            <p>Winner is: {winner.name}</p>
            <button
              disabled={emailSent || submitting}
              onClick={() => incrementAndSendEmail(winner.uniqueEmail)}
            >
              Crown winner?
            </button>
          </>
        )}
        {emailSent && <p>Email has been sent</p>}
        <table className="table-auto border border-green-800">
          <thead>
            <tr>
              <th className="border border-green-600">Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Number Won</th>
            </tr>
          </thead>
          <tbody>
            {breadies.map((breadie) => (
              <tr key={breadie._id}>
                <td>{breadie.name}</td>
                <td>{breadie.email}</td>
                <td>{breadie.address}</td>
                <td>{breadie.numberOfBreads}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user");

  if (user === undefined) {
    res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const { db } = await connectToDatabase();
  let breadies = [];

  try {
    const response = await db.collection("sourdough").find({});
    breadies = await response.toArray();
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      user: req.session.get("user"),
      breadies: JSON.parse(JSON.stringify(breadies)),
    },
  };
});

export default Admin;
