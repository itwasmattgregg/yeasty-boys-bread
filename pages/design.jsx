import Head from 'next/head';
import {useRef, useEffect, useState} from 'react';

export default function Design() {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [bgImage, setBgImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    resizeCanvasToDisplaySize(canvas);

    const context = canvas.getContext('2d');
    context.strokeStyle = '#C40101';
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = 3;
    let oval = new Image();
    oval.src = '/images/oval.png';
    oval.onload = function () {
      context.drawImage(oval, 0, 0, canvas.width / 2, canvas.height / 2);
    };
    setBgImage(oval);
    contextRef.current = context;

    canvas.ontouchstart = startTouch;
    canvas.ontouchmove = handleTouchMove;
  }, []);

  const startDrawing = ({nativeEvent}) => {
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const startTouch = (event) => {
    event.preventDefault();

    const {touches} = event;
    const {clientX, clientY} = touches[0];
    var bcr = event.target.getBoundingClientRect();
    contextRef.current.beginPath();
    contextRef.current.moveTo(clientX - bcr.x, clientY - bcr.y);
    setIsDrawing(true);
  };

  function handleTouchMove(event) {
    event.preventDefault();

    var bcr = event.target.getBoundingClientRect();
    var touch = event.touches[0];
    var {clientX, clientY} = touch;
    draw({
      nativeEvent: {
        offsetX: clientX - bcr.x,
        offsetY: clientY - bcr.y,
      },
    });
  }

  const draw = ({nativeEvent}) => {
    if (!isDrawing) {
      return;
    }
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bgImage, 0, 0, canvas.width / 2, canvas.height / 2);
  };

  const submitDesign = async (base64Img) => {
    setSubmitting(true);
    try {
      const settings = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Img,
          name,
        }),
      };
      const fetchResponse = await fetch(`/api/submitDesign`, settings);
      if (fetchResponse.ok) {
        setSubmitting(false);
        clearCanvas();
      } else {
        throw new Error();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const submitDisabled = name.length < 3 || submitting;

  return (
    <div className="container mx-auto">
      <Head>
        <title>Yeasty Boys Bread Machine</title>
      </Head>

      <main className="mt-40 text-center">
        <canvas
          ref={canvasRef}
          style={{
            cursor: 'crosshair',
          }}
          className="m-auto w-full max-w-2xl border-2"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onMouseOut={finishDrawing}
          onTouchStart={startTouch}
          onTouchMove={handleTouchMove}
          onTouchEnd={finishDrawing}
        ></canvas>
        <div className="m-8 mx-auto max-w-xl text-left">
          <label className="block text-sm font-medium text-gray-700">
            Your name:
            <input
              value={name}
              type="text"
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red focus:ring-red sm:text-sm"
            ></input>
          </label>
        </div>
        <div>
          <button
            className="m-8 justify-center rounded-md border border-transparent bg-red px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red focus:outline-none focus:ring-2 focus:ring-red focus:ring-offset-2"
            onClick={clearCanvas}
          >
            Clear
          </button>
          <button
            disabled={submitDisabled}
            className={`m-8 justify-center rounded-md border border-transparent bg-red px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-offset-2 ${
              submitDisabled
                ? 'cursor-default bg-gray-400'
                : 'hover:bg-red focus:ring-2 focus:ring-red'
            }`}
            onClick={() => submitDesign(getDataURL())}
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  );

  function resizeCanvasToDisplaySize(canvas) {
    const {width, height} = canvas.getBoundingClientRect();

    if (canvas.width !== width || canvas.height !== height) {
      // const { devicePixelRatio: ratio = 1 } = window;
      canvas.width = width * 2;
      canvas.height = width * 2;
      const context = canvas.getContext('2d');
      context.scale(2, 2);
      return true;
    }

    return false;
  }

  /**
   * Combination of work by Ernie Arrowsmith and emizz
   * References:
   * https://stackoverflow.com/questions/32160098/change-html-canvas-black-background-to-white-background-when-creating-jpg-image
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
   * This function will export the canvas to a data URL, which can subsequently be used to share or manipulate the image file.
   * @param {string} fileType Specifies the file format to export to. Note: should only be the file type, not the "image/" prefix.
   *  For supported types see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
   * @param {bool} useBgImage Specifies whether the canvas' current background image should also be exported. Default is false.
   * @param {string} backgroundColour The desired background colour hex code, e.g. "#ffffff" for white.
   */
  function getDataURL(fileType) {
    // Get a reference to the "drawing" layer of the canvas
    let canvasToExport = canvasRef.current;

    let context = canvasToExport.getContext('2d');

    //cache height and width
    let width = canvasToExport.width;
    let height = canvasToExport.height;

    //get the current ImageData for the canvas
    let storedImageData = context.getImageData(0, 0, width, height);

    //store the current globalCompositeOperation
    var compositeOperation = context.globalCompositeOperation;

    //set to draw behind current content
    context.globalCompositeOperation = 'destination-over';

    // If the file type has not been specified, default to PNG
    if (!fileType) fileType = 'png';

    // Export the canvas to data URL
    let imageData = canvasToExport.toDataURL(`image/${fileType}`);

    //clear the canvas
    context.clearRect(0, 0, width, height);

    //restore it with original / cached ImageData
    context.putImageData(storedImageData, 0, 0);

    //reset the globalCompositeOperation to what it was
    context.globalCompositeOperation = compositeOperation;

    return imageData;
  }
}
