import Nav from "components/Nav";
import Head from "next/head";

function Layout(props) {
  return (
    <div className="relative overflow-hidden">
      <Head>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@itwasmattgregg" />
        <meta
          property="og:title"
          content="Yeasty Boys Sourdough Bread Lottery"
          key="title"
        />
        <meta property="og:description" content="yeasty" />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_VERCEL_URL}/images/logo.png`}
        />
        <title>Yeasty Boys Sourdough Bread Lottery</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍞</text></svg>"
        />
      </Head>
      <Nav />
      <div>{props.children}</div>
    </div>
  );
}

export default Layout;
