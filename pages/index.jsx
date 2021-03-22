import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [submitting, setSubmitting] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData(e.target);
    const body = JSON.stringify({
      email: data.get("email"),
      name: data.get("name"),
      address: data.get("address"),
    });
    try {
      const settings = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body,
      };
      const fetchResponse = await fetch(`/api/addRequest`, settings);
      const data = await fetchResponse;
      console.log(data);
      if (data.ok) {
        // success
      } else {
        throw new Error("Unsuccessful");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Yeasty Boys Sourdough Bread Lottery</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍞</text></svg>"
        />
      </Head>

      <main>
        <h1>The Yeasty Boys Sourdough Bread Lottery</h1>

        <p>
          This is the official waiting list for Matt Gregg's sourdough. I
          generally make one loaf to give away for free every week. If you live
          in the twin cities area of Minnesota you are eligible to enter this
          lottery. Please fill out your name, email and full address below and I
          will notify you if you've won a loaf.
        </p>

        <form onSubmit={submitForm}>
          <label>
            Name:
            <input type="text" name="name" required />
          </label>
          <label>
            Email:
            <input type="email" name="email" required />
          </label>
          <label className="address">
            Address (including city and zip code):
            <input type="text" name="address" required />
          </label>
          <div className="submit">
            <button>Submit</button>
          </div>
        </form>
      </main>

      <footer></footer>

      <style jsx>{`
        .container {
          background: limegreen;
          min-height: 100vh;
          padding: 3rem;
        }
        main {
          padding: 3rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 900px;
          margin: 0 auto;
          background: #fff;
          border-radius: 1rem;
        }
        form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        label {
          margin-bottom: 0.5rem;
        }
        input {
          display: block;
          width: 100%;
          font-size: 1rem;
          border: none;
          border-bottom: 2px solid #333;
          margin-top: 0.5rem;
          padding: 3px 0;
        }
        .address {
          grid-column: 1 / -1;
        }
        .submit {
          grid-column: 1 / -1;
          text-align: center;
        }
        button {
          border: 2px solid #333;
          padding: 0.5rem 1rem;
          background: #fff;
          font-size: 18px;
          border-radius: 0.5rem;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-size: 18px;
          line-height: 1.3;
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
