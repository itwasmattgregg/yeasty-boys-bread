import withSession from "../lib/session";
import Layout from "../components/Layout";
import fetchJson from "../lib/fetchJson";
import { connectToDatabase } from "../util/mongodb";
import { useState } from "react";
import useRouterRefresh from "../lib/useRouterRefresh";

const Admin = ({ breadies, meta, images }) => {
  const [winner, setWinner] = useState();
  const [emailSent, setEmailSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [incrementingDonated, setIncrementingDonated] = useState(false);
  const [incrementingSold, setIncrementingSold] = useState(false);
  const [incrementingKept, setIncrementingKept] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");
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

  const decrement = async (email) => {
    try {
      await fetchJson("/api/decrement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      refresh();
    } catch (error) {
      console.error("An unexpected error happened:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUser = async (email) => {
    if (confirmDelete === "") {
      setConfirmDelete(email);
      setTimeout(() => {
        setConfirmDelete("");
      }, 5000);
    } else if (confirmDelete !== email) {
      setConfirmDelete("");
    } else {
      setConfirmDelete("");
      try {
        await fetchJson("/api/deleteUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        refresh();
      } catch (error) {
        console.error("An unexpected error happened:", error);
      }
    }
  };

  const incrementMeta = async (type) => {
    switch (type) {
      case "donated":
        setIncrementingDonated(true);
        try {
          await fetchJson("/api/incrementMeta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ donated: true }),
          });
          refresh();
        } catch (error) {
          console.error("An unexpected error happened:", error);
        } finally {
          setIncrementingDonated(false);
        }
        break;
      case "sold":
        setIncrementingSold(true);
        try {
          await fetchJson("/api/incrementMeta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sold: true }),
          });
          refresh();
        } catch (error) {
          console.error("An unexpected error happened:", error);
        } finally {
          setIncrementingSold(false);
        }
        break;
      case "kept":
        setIncrementingKept(true);
        try {
          await fetchJson("/api/incrementMeta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kept: true }),
          });
          refresh();
        } catch (error) {
          console.error("An unexpected error happened:", error);
        } finally {
          setIncrementingKept(false);
        }
        break;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto mt-40 px-6 max-w-3xl">
        <h1
          className="mb-8 relative text-3xl md:text-5xl
              leading-tight md:leading-tight font-bold"
        >
          Admin
        </h1>
        <div className="mb-8">
          <p>
            Donated: {meta.donated}{" "}
            <button
              onClick={() => incrementMeta("donated")}
              disabled={incrementingDonated}
              className="inline-flex justify-center mb-8 py-2 px-4 border 
                         border-transparent shadow-sm text-sm font-medium rounded-md 
                       border-gray-800 bg-white focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-red disabled:opacity-50"
            >
              🔥
            </button>
          </p>
          <p>
            Sold: {meta.sold}{" "}
            <button
              onClick={() => incrementMeta("sold")}
              disabled={incrementingSold}
              className="inline-flex justify-center mb-8 py-2 px-4 border 
                         border-transparent shadow-sm text-sm font-medium rounded-md 
                       border-gray-800 bg-white focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-red disabled:opacity-50"
            >
              🔥
            </button>
          </p>
          <p>
            Kept: {meta.kept}{" "}
            <button
              onClick={() => incrementMeta("kept")}
              disabled={incrementingKept}
              className="inline-flex justify-center mb-8 py-2 px-4 border 
                         border-transparent shadow-sm text-sm font-medium rounded-md 
                       border-gray-800 bg-white focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-red disabled:opacity-50"
            >
              🔥
            </button>
          </p>
        </div>
        <button
          className="inline-flex justify-center mb-8 py-2 px-4 border 
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
              className="inline-flex justify-center mb-8 py-2 px-4 border 
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
        <div className="overflow-x-auto border">
          <table className="table-auto bg-white">
            <thead>
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Address</th>
                <th className="text-left p-2">Number Won</th>
                <th className="text-left p-2">Last won</th>
              </tr>
            </thead>
            <tbody>
              {breadies.map((breadie) => (
                <tr key={breadie._id}>
                  <td className="p-2 text-sm">{breadie.name}</td>
                  <td className="p-2 text-sm">
                    <a href={`mailto: ${breadie.email}`}>{breadie.email}</a>
                  </td>
                  <td className="p-2 text-sm">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${breadie.address}`}
                    >
                      {breadie.address}
                    </a>
                  </td>
                  <td className="p-2 text-sm">
                    {breadie.numberOfBreads}
                    <button onClick={() => decrement(breadie.email)}>
                      Decrement
                    </button>
                  </td>
                  <td className="p-2 text-sm">{breadie.lastModified}</td>
                  <td>
                    <button onClick={() => deleteUser(breadie.email)}>
                      {breadie.email === confirmDelete ? "Confirm?" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <h2
        className="mb-8 relative text-xl md:text-3xl
              leading-tight md:leading-tight font-bold"
      >
        Image submissions
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-6">
        {images.map(({ image, name, _id }) => (
          <div key={_id}>
            <p>{name}</p>
            <img src={image} width="200" />
          </div>
        ))}
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

  const imagesRes = await db.collection("designs").find({});
  const images = await imagesRes.toArray();

  const response = await db.collection("otherBread").findOne({});
  const meta = await response;

  return {
    props: {
      meta: JSON.parse(JSON.stringify(meta)),
      breadies: JSON.parse(JSON.stringify(breadies)),
      images: JSON.parse(JSON.stringify(images)),
    },
  };
});

export default Admin;
