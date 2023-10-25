import Head from "next/head";
import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Yeasty Boys Sourdough Bread Lottery</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
