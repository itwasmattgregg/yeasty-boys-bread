import Layout from "components/Layout";
import BreadImg from "../images/IMG_3664-2.jpg";
import Image from "next/image";

export default function Guide() {
  return (
    <Layout>
      <div className="absolute h-96 w-full z-0 flex">
        <Image
          src={BreadImg}
          alt="Bread"
          layout="fill"
          objectFit="cover"
          objectPosition="bottom center"
          placeholder="blur"
          className="z-0"
        />
      </div>
      <div
        className="h-96 flex items-center justify-start relative
            bg-gradient-to-t from-gray-800 to-transparent mb-12"
      >
        <h1
          className="mx-6 md:mx-16
           relative text-3xl md:text-5xl tracking-tight 
              leading-tight md:leading-tight font-extrabold text-white text-shadow"
        >
          Matt&lsquo;s bread guide
        </h1>
      </div>
      <div className="container mx-auto">
        <h2
          className="text-xl md:text-3xl tracking-tight 
              leading-tight md:leading-tight font-bold"
        >
          Tips and tricks for eating sourdough:
        </h2>
        <p></p>
      </div>
    </Layout>
  );
}
