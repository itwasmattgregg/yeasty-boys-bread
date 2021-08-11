import Image from "next/image";
import Link from "next/link";

import logo from "../images/logo.png";

function Nav() {
  return (
    <>
      <div className="z-10 fixed p-6">
        <Link href="/">
          <Image src={logo} height={70} width={126} alt="Logo" />
        </Link>
      </div>
      <div className="z-10 absolute right-10 top-10 grid gap-5 sm:flex sm:gap-10">
        <Link href="/breadmachine">
          <a className="font-bold flex p-3 items-center justify-center no-underline relative">
            <div className="bg-white transform skew-x-12 h-full w-full absolute -z-10 border-black border"></div>
            The Bread Machine
          </a>
        </Link>
        <Link href="/shop">
          <a className="font-bold flex p-3 items-center justify-center no-underline relative">
            <div className="bg-white transform skew-x-12 h-full w-full absolute -z-10 border-black border"></div>
            Shop
          </a>
        </Link>
      </div>
    </>
  );
}

export default Nav;
