import Head from "next/head";
import { useEffect } from "react";
import * as Tone from "tone";

export default function BreadMachine() {
  function removeTransition(e) {
    if (e.propertyName !== "transform") return;
    e.target.classList.remove("playing");
  }

  function playSound(e, sampler) {
    let keyCode;
    if (e.keyCode) {
      keyCode = e.keyCode;
    } else {
      keyCode = e.currentTarget.dataset.key;
    }
    const key = document.querySelector(`div[data-key="${keyCode}"]`);
    if (!key) return;

    Tone.loaded().then(() => {
      if (sampler[keyCode]) {
        sampler[keyCode].start();
      }
    });

    key.classList.add("playing");
  }

  useEffect(() => {
    const keys = Array.from(document.querySelectorAll(".key"));
    keys.forEach((key) => {
      key.addEventListener("transitionend", removeTransition);
      key.addEventListener("click", (e) => playSound(e, sequencer));
    });
    window.addEventListener("keydown", (e) => playSound(e, sequencer));
    const sequencer = {
      81: new Tone.Player("/sounds/Tap.m4a").toDestination(),
      87: new Tone.Player("/sounds/Crunch.m4a").toDestination(),
      69: new Tone.Player("/sounds/Knife.m4a").toDestination(),
      82: new Tone.Player("/sounds/Soft.m4a").toDestination(),
      65: new Tone.Player("/sounds/guitar1.m4a").toDestination(),
      83: new Tone.Player("/sounds/guitar2.m4a").toDestination(),
      68: new Tone.Player("/sounds/guitar3.m4a").toDestination(),
      70: new Tone.Player("/sounds/guitar4.m4a").toDestination(),
      71: new Tone.Player("/sounds/kick.m4a").toDestination(),
      72: new Tone.Player("/sounds/nosleep.m4a").toDestination(),
      74: new Tone.Player("/sounds/brooklyn.m4a").toDestination(),
      75: new Tone.Player("/sounds/snare.m4a").toDestination(),
    };
  }, []);

  return (
    <div className="container mx-auto">
      <Head>
        <title>Yeasty Boys Bread Machine</title>
      </Head>

      <main className="mt-40">
        <h1 className="relative mb-10 text-4xl font-extrabold">
          The Yeasty Boys Bread (Drum) Machine
        </h1>
        <p className="mb-6">
          The first row of sounds were recorded on my very own sourdough bread.
        </p>
        <p className="mb-6">
          Note: works best on chrome or firefox.
        </p>
        <div className="mb-6 keys">
          <div data-key="81" className="key">
            <kbd>Q</kbd>
            <span className="sound">Tap</span>
          </div>
          <div data-key="87" className="key">
            <kbd>W</kbd>
            <span className="sound">Crunch</span>
          </div>
          <div data-key="69" className="key">
            <kbd>E</kbd>
            <span className="sound">Knife</span>
          </div>
          <div data-key="82" className="key">
            <kbd>R</kbd>
            <span className="sound">ASMR</span>
          </div>
          <div data-key="65" className="key">
            <kbd>A</kbd>
            <span className="sound">Guitar 1</span>
          </div>
          <div data-key="83" className="key">
            <kbd>S</kbd>
            <span className="sound">Guitar 2</span>
          </div>
          <div data-key="68" className="key">
            <kbd>D</kbd>
            <span className="sound">Guitar 3</span>
          </div>
          <div data-key="70" className="key">
            <kbd>F</kbd>
            <span className="sound">Guitar 4</span>
          </div>
          <div data-key="71" className="key">
            <kbd>G</kbd>
            <span className="sound">Kick</span>
          </div>
          <div data-key="72" className="key">
            <kbd>H</kbd>
            <span className="sound">No Sleep</span>
          </div>
          <div data-key="74" className="key">
            <kbd>J</kbd>
            <span className="sound">Brooklyn</span>
          </div>
          <div data-key="75" className="key">
            <kbd>K</kbd>
            <span className="sound">Snare</span>
          </div>
        </div>
      </main>
      <style jsx>{`
        .keys {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          gap: 10px;
        }

        .key {
          border: 0.4rem solid black;
          border-radius: 0.5rem;
          font-size: 1.5rem;
          padding: 0;
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
          font-size: 1.5rem;
        }

        .sound {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1rem;
          color: #ffc600;
        }

        @media (min-width: 725px) {
          .key {
            padding: 1rem 0.5rem;
          }
          kbd {
            font-size: 3rem;
          }
          .sound {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}
