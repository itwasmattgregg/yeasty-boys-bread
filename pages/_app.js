import Head from 'next/head';
import Nav from '../components/Nav';
import 'tailwindcss/tailwind.css';
import {Analytics} from '@vercel/analytics/react';
import {SpeedInsights} from '@vercel/speed-insights/next';
import {Sora} from 'next/font/google';

const sora = Sora({weight: ['400', '700'], subsets: ['latin']});

function MyApp({Component, pageProps}) {
  return (
    <main className={sora.className}>
      <Head>
        <title>Yeasty Boys Sourdough Bread Lottery</title>
      </Head>
      <Analytics />
      <SpeedInsights />
      <div
        className="relative overflow-hidden subpixel-antialiased"
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%23f1f1f1' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <Nav />
        <Component {...pageProps} />
      </div>
    </main>
  );
}

export default MyApp;
