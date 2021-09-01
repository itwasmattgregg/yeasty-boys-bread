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

  const pickWinner = (people) => {
    setEmailSent(false);
    // Find lowest number of wins for curve
    const lowestNumber = people.reduce(
      (a, { numberOfBreads }) => Math.min(a, numberOfBreads),
      people[0].numberOfBreads
    );
    // Create an array with peoples names where people with less wins have more entries
    let weightedArray = people.reduce((acc, item) => {
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
      <div className="container mx-auto mt-40 px-6 max-w-3xl">
        <h1>Admin</h1>
        <button
          className="inline-flex justify-center py-2 px-4 border 
                        border-transparent shadow-sm text-sm font-medium rounded-md 
                        text-white bg-red hover:bg-red focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 focus:ring-red"
          onClick={() => setWinner(pickWinner(breadies))}
        >
          Select winner
        </button>
        {winner && (
          <>
            <p>Winner is: {winner.name}</p>
            <button
              disabled={emailSent || submitting}
              className="inline-flex justify-center py-2 px-4 border 
                        border-transparent shadow-sm text-sm font-medium rounded-md 
                        text-white bg-red hover:bg-red focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 focus:ring-red disabled:opacity-50"
              onClick={() => incrementAndSendEmail(winner.uniqueEmail)}
            >
              Crown winner?
            </button>
          </>
        )}
        {emailSent && <p>Email has been sent</p>}
        <table className="table-auto border border-green-800 bg-white">
          <thead>
            <tr>
              <th className="border border-green-600">Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Number Won</th>
              <th>Last won</th>
            </tr>
          </thead>
          <tbody>
            {breadies.map((breadie) => (
              <tr key={breadie._id}>
                <td>{breadie.name}</td>
                <td>{breadie.email}</td>
                <td>{breadie.address}</td>
                <td>{breadie.numberOfBreads}</td>
                <td>{breadie.lastModified}</td>
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
