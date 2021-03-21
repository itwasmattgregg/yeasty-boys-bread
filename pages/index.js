import Head from 'next/head'
import { useState } from 'react';

export default function Home() {
  const [submitting, setSubmitting] = useState(false);

  const submitForm = async e => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData(e.target);
    const body = JSON.stringify({
      email: data.get('email'),
      name: data.get('name'),
      address: data.get('address')
    });
    try {
      const settings = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body
      };
      const fetchResponse = await fetch(`/api/addRequest`, settings);
      const data = await fetchResponse;
      console.log(data);
      if (data.ok) {
        // success
      } else {
        throw new Error('Unsuccessful')
      }
    } catch (e) {
      console.log(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Head>
        <title>Yeasty Boys Sourdough Bread Lottery</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍞</text></svg>" />
      </Head>

      <main>
        <h1>
          Yeasty Boys Sourdough Bread Lottery
        </h1>

        <p></p>

        <form onSubmit={submitForm}>
          <label>
            Name:
            <input type="text" name="name" required />
          </label>
          <label>
            Email:
            <input type="email" name="email" required />
          </label>
          <label>
            Address (including city and zip code):
            <input type="text" name="address" required />
          </label>
          <button>Submit</button>
        </form>
      </main>

      <footer>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

