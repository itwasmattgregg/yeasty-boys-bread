import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import Layout from "../components/Layout";

export default function BreadMachine() {
  function removeTransition(e) {
    if (e.propertyName !== "transform") return;
    e.target.classList.remove("playing");
  }

  function playSound(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
    if (!audio) return;

    key.classList.add("playing");
    audio.currentTime = 0;
    audio.play();
  }

  useEffect(() => {
    const keys = Array.from(document.querySelectorAll(".key"));
    keys.forEach((key) =>
      key.addEventListener("transitionend", removeTransition)
    );
    window.addEventListener("keydown", playSound);
  }, []);

  return (
    <Layout>
      <div className="container">
        <Head>
          <title>Yeasty Boys Bread Machine</title>
          <link
            rel="icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍞</text></svg>"
          />
        </Head>

        <div className="background-wrap">
          <Image
            src="/images/IMG_3547.jpg"
            alt="Bread"
            layout="fill"
            objectFit="cover"
            quality={15}
          />
        </div>

        <main>
          <h1>The Yeasty Boys Bread (Drum) Machine</h1>
          <div className="keys">
            <div data-key="65" className="key">
              <kbd>A</kbd>
              <span className="sound">clap</span>
            </div>
            <div data-key="83" className="key">
              <kbd>S</kbd>
              <span className="sound">hihat</span>
            </div>
            <div data-key="68" className="key">
              <kbd>D</kbd>
              <span className="sound">kick</span>
            </div>
            <div data-key="70" className="key">
              <kbd>F</kbd>
              <span className="sound">openhat</span>
            </div>
            <div data-key="71" className="key">
              <kbd>G</kbd>
              <span className="sound">boom</span>
            </div>
            <div data-key="72" className="key">
              <kbd>H</kbd>
              <span className="sound">ride</span>
            </div>
            <div data-key="74" className="key">
              <kbd>J</kbd>
              <span className="sound">snare</span>
            </div>
            <div data-key="75" className="key">
              <kbd>K</kbd>
              <span className="sound">tom</span>
            </div>
          </div>

          <audio data-key="65" src="sounds/clap.wav"></audio>
          <audio data-key="83" src="sounds/hihat.wav"></audio>
          <audio data-key="68" src="sounds/kick.wav"></audio>
          <audio data-key="70" src="sounds/openhat.wav"></audio>
          <audio data-key="71" src="sounds/boom.wav"></audio>
          <audio data-key="72" src="sounds/ride.wav"></audio>
          <audio data-key="74" src="sounds/snare.wav"></audio>
          <audio data-key="75" src="sounds/tom.wav"></audio>
        </main>
        <style jsx>{`
          .keys {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            align-items: center;
            justify-content: center;
          }

          .key {
            border: 0.4rem solid black;
            border-radius: 0.5rem;
            margin: 1rem;
            font-size: 1.5rem;
            padding: 1rem 0.5rem;
            transition: all 0.07s ease;
            text-align: center;
            color: white;
            background: rgba(0, 0, 0, 0.4);
            text-shadow: 0 0 0.5rem black;
          }

          .playing {
            transform: scale(1.1);
            border-color: #ffc600;
            box-shadow: 0 0 1rem #ffc600;
          }

          kbd {
            display: block;
            font-size: 4rem;
          }

          .sound {
            font-size: 1.2rem;
            text-transform: uppercase;
            letter-spacing: 0.1rem;
            color: #ffc600;
          }
        `}</style>
      </div>
    </Layout>
  );
}
