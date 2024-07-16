import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import usePlacesAutocomplete from "use-places-autocomplete";
import BreadImg from "../images/IMG_4261-2.jpg";
import { connectToDatabase } from "../util/mongodb";
import Script from "next/script";

const SubmitStateEnum = {
  WAITING: "waiting",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export default function Home({ lotteryBreads, totalBreads }) {
  const [submitState, setSubmitState] = useState(SubmitStateEnum.WAITING);
  const [error, setError] = useState("");

  const {
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "initMap",
    requestOptions: {
      fields: ["address_components"],
      componentRestrictions: { country: "us" },
      types: ["address"],
    },
    debounce: 300,
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }) =>
    () => {
      setValue(description, false);
      clearSuggestions();
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={handleSelect(suggestion)}
          className="py-2 cursor-pointer"
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  const submitForm = async (e) => {
    e.preventDefault();
    setSubmitState(SubmitStateEnum.LOADING);
    setError("");

    const data = new FormData(e.target);
    const body = JSON.stringify({
      email: data.get("email"),
      name: data.get("name"),
      address: data.get("address"),
    });
    try {
      const settings = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body,
      };
      const fetchResponse = await fetch(`/api/addRequest`, settings);
      if (fetchResponse.ok) {
        setSubmitState(SubmitStateEnum.SUCCESS);
      } else {
        const text = await fetchResponse.text();
        throw new Error(text);
      }
    } catch (e) {
      setError(e.message);
      setSubmitState(SubmitStateEnum.ERROR);
    }
  };

  const getSubmitButtonText = () => {
    switch (submitState) {
      case SubmitStateEnum.LOADING:
        return "Submitting";
      case SubmitStateEnum.SUCCESS:
        return "Success!";
      case SubmitStateEnum.ERROR:
        return "There was an error!";
      default:
        return "Submit";
    }
  };

  const buttonDisabled = () => {
    if (
      submitState === SubmitStateEnum.LOADING ||
      submitState === SubmitStateEnum.SUCCESS
    ) {
      return true;
    }
    return false;
  };

  const renderRandomGif = () => {
    const gifs = [
      "https://i.giphy.com/media/3o7ZeFpK0qqSpsWNsA/giphy.webp",
      "https://i.giphy.com/media/Y7O3LHmhllEk/giphy.webp",
      "https://i.giphy.com/media/YOI55oGPCfife/giphy.webp",
    ];
    return (
      <Image
        src={gifs[Math.floor(Math.random() * gifs.length)]}
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    );
  };

  return (
    <>
      <Script
        strategy="lazyOnload"
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDX6Ox-aNWq-VGn84ZRI82VbrKmlBMuypo&libraries=places&callback=initMap"
      />
      <div>
        <main>
          <div className="absolute z-0 flex w-full h-screen">
            <Image
              src={BreadImg}
              alt="Bread"
              placeholder="blur"
              className="z-0"
              fill
              sizes="100vw"
              style={{
                objectFit: "cover",
              }}
            />
          </div>
          <div className="relative flex items-center justify-start h-screen bg-gradient-to-t from-gray-800 to-transparent">
            <h1 className="relative mx-6 text-3xl font-bold leading-tight text-white md:mx-16 md:text-5xl md:leading-tight text-shadow">
              The Yeasty Boys
              <br /> Sourdough Bread Lottery
            </h1>
          </div>

          <div className="container items-center max-w-3xl px-6 mx-auto my-10">
            <h2 className="mb-12 text-2xl">What the fuck is this?</h2>
            <p>
              This is the official waiting list for Matt Gregg&lsquo;s
              sourdough. I generally make one loaf to give away for free every
              week to friends and family. If you live in the Twin Cities area of
              Minnesota, you know me, and you love bread, you are eligible to
              enter this lottery. Please fill out your name, email and full
              address below and I will notify you if you&lsquo;ve won a loaf and
              have become a Breadwinner.
            </p>
          </div>

          <div className="container max-w-3xl px-6 mx-auto my-10">
            <p>
              If you would like to submit a design for me to attempt to score
              into the top of a loaf of bread please use this awesome{" "}
              <Link href="/design">tool</Link> I made!
            </p>
          </div>

          <div className="container grid max-w-3xl gap-10 px-6 pb-10 mx-auto sm:grid-cols-3">
            <div className="text-center">
              <p className="font-semibold">Lottery winners</p>
              <p className="mt-4 text-4xl text-red">{lotteryBreads}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">Total loaves made</p>
              <p className="mt-4 text-4xl text-red">{totalBreads}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">Flour used</p>
              <p className="mt-4 text-4xl text-red">{totalBreads * 440}g</p>
              <p>({Math.floor((totalBreads * 440) / 453.59)}lbs)</p>
            </div>
          </div>

          <div className="container flex justify-center max-w-3xl px-6 pb-10 mx-auto">
            <a
              href="https://shop.yeastyboysbread.com/products/whole-sourdough-loaf"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-red hover:bg-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red disabled:opacity-50"
            >
              Order sourdough for pickup
            </a>
          </div>

          <div className="max-w-3xl px-6 mx-auto mb-10">
            <div className="p-6 bg-white rounded-md shadow">
              <h3 className="mb-6 text-xl">Lottery signup form</h3>
              {submitState !== SubmitStateEnum.SUCCESS && (
                <form
                  onSubmit={submitForm}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Name:
                    <input
                      name="name"
                      type="text"
                      required
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-red focus:border-red sm:text-sm"
                    />
                  </label>

                  <label className="block text-sm font-medium text-gray-700">
                    Email:
                    <input
                      type="email"
                      name="email"
                      required
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-red focus:border-red sm:text-sm"
                    />
                  </label>
                  <label className="relative block text-sm font-medium text-gray-700 sm:col-span-2">
                    Address:
                    <input
                      value={value}
                      onChange={handleInput}
                      type="text"
                      name="address"
                      required
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-red focus:border-red sm:text-sm"
                    />
                    {status === "OK" && (
                      <ul className="absolute w-full px-4 py-2 bg-gray-100 rounded-md radius-4">
                        {renderSuggestions()}
                      </ul>
                    )}
                  </label>

                  <p className="text-center sm:col-span-2">
                    <small>
                      This probably goes without saying, but I will never sell
                      or distribute any of your information to anyone.
                    </small>
                  </p>

                  <div className="text-center sm:col-span-2">
                    <button
                      disabled={buttonDisabled()}
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-red hover:bg-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red disabled:opacity-50"
                    >
                      {getSubmitButtonText()}
                    </button>
                    {error.length > 0 && <p>{error}</p>}
                  </div>
                </form>
              )}
              {submitState === SubmitStateEnum.SUCCESS && (
                <div>
                  <p className="mb-4 text-xl">
                    Congrats!!! You&lsquo;re one step closer to bread!
                  </p>
                  <p>
                    You should receive a welcome email in your inbox shortly. If
                    you don&lsquo;t, check your spam folder and mark it as not
                    spam.
                  </p>
                  <div className="flex justify-center my-4">
                    {renderRandomGif()}
                  </div>
                  <div className="text-center">
                    <Link href="/breadmachine" className="font-bold">
                      While you&lsquo;re waiting... check out the Bread Machine
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="text-center">
            {submitState !== SubmitStateEnum.SUCCESS && (
              <p>
                <small>
                  I&lsquo;m not interested in becoming a Breadwinner, I&lsquo;m
                  just here for the{" "}
                  <Link href="/breadmachine">bread machine</Link>.
                </small>
              </p>
            )}
            <small>
              Made by <a href="https://codegregg.com">CodeGregg</a>
            </small>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getStaticProps() {
  let db;
  try {
    const dbConnection = await connectToDatabase();
    db = dbConnection.db;
  } catch (e) {
    console.error(e);
    return { props: {} };
  }
  let totalBreadCount = 0;
  let lotteryBreads = 0;
  let archivedBreads = 0;

  try {
    const response = await db
      .collection("sourdough")
      .aggregate([{ $group: { _id: 1, count: { $sum: "$numberOfBreads" } } }]);
    [lotteryBreads] = await response.toArray();
    const archivedResponse = await db
      .collection("archived")
      .aggregate([{ $group: { _id: 1, count: { $sum: "$numberOfBreads" } } }]);
    [archivedBreads] = await archivedResponse.toArray();
    const stats = await db.collection("otherBread").findOne({});
    const meta = await stats;
    totalBreadCount =
      lotteryBreads.count +
      archivedBreads.count +
      meta.donated +
      meta.sold +
      meta.kept;
  } catch (e) {
    console.error(e);
    return { props: {} };
  }
  return {
    props: {
      lotteryBreads: lotteryBreads.count + archivedBreads.count,
      totalBreads: totalBreadCount,
    },
    revalidate: 120,
  };
}
