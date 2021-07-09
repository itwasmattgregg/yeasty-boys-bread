import Head from "next/head";
import { useEffect } from "react";
import Layout from "../components/Layout";

export default function BreadMachine() {
  function removeTransition(e) {
    if (e.propertyName !== "transform") return;
    e.target.classList.remove("playing");
  }

  function playSound(e) {
    let keyCode;
    if (e.keyCode) {
      keyCode = e.keyCode;
    } else {
      keyCode = e.currentTarget.dataset.key;
    }
    const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
    const key = document.querySelector(`div[data-key="${keyCode}"]`);
    if (!audio) return;

    key.classList.add("playing");
    audio.currentTime = 0;
    audio.play();
  }

  useEffect(() => {
    const keys = Array.from(document.querySelectorAll(".key"));
    keys.forEach((key) => {
      key.addEventListener("transitionend", removeTransition);
      key.addEventListener("click", playSound);
    });
    window.addEventListener("keydown", playSound);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto">
        <Head>
          <title>Yeasty Boys Bread Machine</title>
        </Head>

        <main className="mt-40">
          <h1 className="mb-10 relative text-4xl tracking-tight font-extrabold">
            The Yeasty Boys Bread (Drum) Machine
          </h1>
          <p>Note: works best on chrome or firefox</p>
          <div className="keys">
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

          <audio preload="auto" data-key="81" src="sounds/Tap.m4a"></audio>
          <audio preload="auto" data-key="87" src="sounds/Crunch.m4a"></audio>
          <audio preload="auto" data-key="69" src="sounds/Knife.m4a"></audio>
          <audio preload="auto" data-key="82" src="sounds/Soft.m4a"></audio>

          <audio preload="auto" data-key="65" src="sounds/guitar1.m4a"></audio>
          <audio preload="auto" data-key="83" src="sounds/guitar2.m4a"></audio>
          <audio preload="auto" data-key="68" src="sounds/guitar3.m4a"></audio>
          <audio preload="auto" data-key="70" src="sounds/guitar4.m4a"></audio>
          <audio preload="auto" data-key="71" src="sounds/kick.m4a"></audio>
          <audio preload="auto" data-key="72" src="sounds/nosleep.m4a"></audio>
          <audio preload="auto" data-key="74" src="sounds/brooklyn.m4a"></audio>
          <audio preload="auto" data-key="75" src="sounds/snare.m4a"></audio>
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
    </Layout>
  );
}
