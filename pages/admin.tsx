import withSession from "../lib/session";
import fetchJson from "../lib/fetchJson";
import { connectToDatabase } from "../util/mongodb";
import { useState } from "react";
import useRouterRefresh from "../lib/useRouterRefresh";
import classNames from "classnames";

const Admin = ({ breadies, meta }) => {
  const [winner, setWinner] = useState<any>();
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

  const increment = async (email) => {
    try {
      await fetchJson("/api/increment", {
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
    <div className="container px-6 mx-auto mt-40">
      <h1 className="relative mb-8 text-3xl font-bold leading-tight md:text-5xl md:leading-tight">
        Admin
      </h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <p>
          Donated: {meta.donated}{" "}
          <button
            onClick={() => incrementMeta("donated")}
            disabled={incrementingDonated}
            className="inline-flex justify-center px-4 py-2 mb-8 text-sm font-medium bg-white border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red disabled:opacity-50"
          >
            🔥
          </button>
        </p>
        <p>
          Sold: {meta.sold}{" "}
          <button
            onClick={() => incrementMeta("sold")}
            disabled={incrementingSold}
            className="inline-flex justify-center px-4 py-2 mb-8 text-sm font-medium bg-white border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red disabled:opacity-50"
          >
            🔥
          </button>
        </p>
        <p>
          Kept: {meta.kept}{" "}
          <button
            onClick={() => incrementMeta("kept")}
            disabled={incrementingKept}
            className="inline-flex justify-center px-4 py-2 mb-8 text-sm font-medium bg-white border border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red disabled:opacity-50"
          >
            🔥
          </button>
        </p>
      </div>
      <button
        className="inline-flex justify-center px-4 py-2 mb-8 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-red hover:bg-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red"
        onClick={() => setWinner(pickWinner(breadies))}
      >
        Select winner
      </button>
      {winner && (
        <>
          <p>
            Winner is: {winner.name} | wins: {winner.numberOfBreads} |{" "}
            {winner.address}
          </p>
          <button
            disabled={emailSent || submitting}
            className="inline-flex justify-center px-4 py-2 mb-8 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-red hover:bg-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red disabled:opacity-50"
            onClick={() => incrementAndSendEmail(winner.uniqueEmail)}
          >
            Crown winner?
          </button>
        </>
      )}
      {emailSent && <p>Email has been sent</p>}
      <div className="overflow-x-auto border">
        <table className="bg-white table-auto">
          <thead>
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Number won</th>
              <th className="p-2 text-left">Last updated</th>
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
                <td className="flex items-center gap-1 p-2 text-sm">
                  {breadie.numberOfBreads}
                  <button
                    onClick={() => decrement(breadie.email)}
                    className="p-2 border"
                  >
                    🔻
                  </button>
                  <button
                    onClick={() => increment(breadie.email)}
                    className="p-2 border"
                  >
                    🔺
                  </button>
                </td>
                <td className="p-2 text-sm">{breadie.lastModified}</td>
                <td>
                  <button
                    onClick={() => deleteUser(breadie.email)}
                    className={classNames("p-3 ", {
                      "bg-red": breadie.email === confirmDelete,
                    })}
                  >
                    {breadie.email === confirmDelete ? "🔥" : "🗑"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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

  const response = await db.collection("otherBread").findOne({});
  const meta = await response;

  return {
    props: {
      meta: JSON.parse(JSON.stringify(meta)),
      breadies: JSON.parse(JSON.stringify(breadies)),
    },
  };
});

export default Admin;
