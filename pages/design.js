import Head from "next/head";
import CanvasDraw from "react-canvas-draw";
import { useState } from "react";

import Layout from "../components/Layout";

export default function Design() {
  const [canvas, setCanvas] = useState(null);
  return (
    <Layout>
      <div className="container mx-auto">
        <Head>
          <title>Yeasty Boys Bread Machine</title>
        </Head>

        <main className="mt-40 text-center">
          <CanvasDraw
            ref={(canvasDraw) => setCanvas(canvasDraw)}
            imgSrc="/images/oval.png"
            hideGrid
            brushRadius={1}
            lazyRadius={0}
            style={{ border: "1px solid black", margin: "0 auto" }}
          />
          <button onClick={() => canvas.clear()}>Clear</button>
          <button onClick={() => canvas.getSaveData()}>save</button>
        </main>
      </div>
    </Layout>
  );
}
