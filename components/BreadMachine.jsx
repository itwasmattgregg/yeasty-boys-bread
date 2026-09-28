import Head from 'next/head';
import {useCallback, useEffect, useRef, useState} from 'react';
import * as Tone from 'tone';

const PADS = [
  {id: 'Tap', code: 'KeyQ', label: 'Q', name: 'Tap'},
  {id: 'Crunch', code: 'KeyW', label: 'W', name: 'Crunch'},
  {id: 'Knife', code: 'KeyE', label: 'E', name: 'Knife'},
  {id: 'Soft', code: 'KeyR', label: 'R', name: 'ASMR'},
  {id: 'guitar1', code: 'KeyA', label: 'A', name: 'Guitar 1'},
  {id: 'guitar2', code: 'KeyS', label: 'S', name: 'Guitar 2'},
  {id: 'guitar3', code: 'KeyD', label: 'D', name: 'Guitar 3'},
  {id: 'guitar4', code: 'KeyF', label: 'F', name: 'Guitar 4'},
  {id: 'kick', code: 'KeyG', label: 'G', name: 'Kick'},
  {id: 'nosleep', code: 'KeyH', label: 'H', name: 'No Sleep'},
  {id: 'brooklyn', code: 'KeyJ', label: 'J', name: 'Brooklyn'},
  {id: 'snare', code: 'KeyK', label: 'K', name: 'Snare'},
];

const FLASH_MS = 120;

// Mobile browsers keep a freshly created AudioContext suspended, and iOS keeps
// the output route asleep until a node has actually run inside a user gesture.
// Resuming and then burning a silent oscillator wakes both up.
function primeOutput(rawContext) {
  const gain = rawContext.createGain();
  gain.gain.value = 0;
  gain.connect(rawContext.destination);

  const oscillator = rawContext.createOscillator();
  oscillator.connect(gain);
  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
  oscillator.start();
  oscillator.stop(rawContext.currentTime + 0.15);
}

function triggerPlayer(player) {
  // Tone asserts that a restart happens strictly after the previous start, and
  // two taps inside one render quantum resolve to the same context time, so
  // stop first instead of restarting in place.
  if (player.state === 'started') {
    player.stop();
  }
  player.start();
}

export default function BreadMachine() {
  const playersRef = useRef({});
  const flashTimersRef = useRef({});
  const primedRef = useRef(false);
  const [litPads, setLitPads] = useState({});

  useEffect(() => {
    const context = Tone.getContext();
    // One-shot samples only, so the default 100ms scheduling window is pure lag.
    context.lookAhead = 0;

    const players = {};
    PADS.forEach((pad) => {
      // MP3 rather than the original m4a: AAC decoding depends on platform
      // codecs, so browsers without them fail to load the samples entirely.
      players[pad.id] = new Tone.Player(
        `/sounds/${pad.id}.mp3`
      ).toDestination();
    });
    playersRef.current = players;

    return () => {
      Object.values(players).forEach((player) => player.dispose());
      Object.values(flashTimersRef.current).forEach(clearTimeout);
      flashTimersRef.current = {};
      playersRef.current = {};
    };
  }, []);

  const wakeAudio = useCallback(() => {
    const context = Tone.getContext();
    const resumed = context.state === 'running' ? null : Tone.start();

    if (!primedRef.current) {
      primedRef.current = true;
      primeOutput(context.rawContext);
    }

    return resumed;
  }, []);

  const flashPad = useCallback((id) => {
    setLitPads((lit) => ({...lit, [id]: true}));
    clearTimeout(flashTimersRef.current[id]);
    flashTimersRef.current[id] = setTimeout(() => {
      setLitPads((lit) => {
        const next = {...lit};
        delete next[id];
        return next;
      });
    }, FLASH_MS);
  }, []);

  const hitPad = useCallback(
    (id) => {
      flashPad(id);

      // Kicked off synchronously, and before the sample check, so the browser
      // still counts us as inside the gesture that resumes the context.
      const resumed = wakeAudio();

      const player = playersRef.current[id];
      if (!player || !player.loaded) return;

      if (Tone.getContext().state === 'running') {
        triggerPlayer(player);
      } else if (resumed) {
        resumed
          .then(() => {
            if (playersRef.current[id] !== player) return;
            triggerPlayer(player);
          })
          .catch(() => {});
      }
    },
    [flashPad, wakeAudio]
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const pad = PADS.find((candidate) => candidate.code === e.code);
      if (!pad) return;
      hitPad(pad.id);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hitPad]);

  useEffect(() => {
    // iOS suspends the context when the tab is backgrounded or interrupted by a
    // call, and it never comes back on its own.
    function onVisibilityChange() {
      if (document.visibilityState !== 'visible') return;
      if (Tone.getContext().state === 'running') return;
      Tone.start().catch(() => {});
    }

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', onVisibilityChange);
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
        <p className="mb-6">Tap the pads, or use your keyboard.</p>
        <div className="keys mb-6">
          {PADS.map((pad) => (
            <button
              key={pad.id}
              type="button"
              className={`key${litPads[pad.id] ? ' playing' : ''}`}
              aria-label={`Play ${pad.name}`}
              onPointerDown={() => hitPad(pad.id)}
              onClick={(e) => {
                // Keyboard activation of a focused pad synthesises a click with
                // no pointer behind it; real taps already fired onPointerDown.
                if (e.detail === 0) hitPad(pad.id);
              }}
            >
              <kbd>{pad.label}</kbd>
              <span className="sound">{pad.name}</span>
            </button>
          ))}
        </div>
      </main>
      <style jsx>{`
        .keys {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .key {
          appearance: none;
          -webkit-appearance: none;
          border: 0.4rem solid black;
          border-radius: 0.5rem;
          font-size: 1.5rem;
          padding: 0;
          transition: all 0.07s ease;
          text-align: center;
          color: white;
          background: rgba(0, 0, 0, 0.4);
          text-shadow: 0 0 0.5rem black;
          cursor: pointer;
          /* Skip the tap delay, the double-tap zoom, and the long-press
             selection callout that all fight a fast soundboard on mobile. */
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          -webkit-user-select: none;
          user-select: none;
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
