import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/router";

import logo from "../images/logo.png";

function Nav() {
  // const router = useRouter();
  return (
    <>
      <div className="z-10 fixed p-6">
        <Link href="/">
          <Image src={logo} height={70} width={126} alt="Logo" />
        </Link>
      </div>
      <div className="z-10 absolute right-10 top-10 sm:text-left text-right">
        <Link href="/guide">
          <a className="block sm:inline-block text-white font-bold text-shadow text-lg">
            Guide
          </a>
        </Link>
        <Link href="/breadmachine">
          <a className="text-white font-bold text-shadow text-lg ml-6">
            The Bread Machine
          </a>
        </Link>
      </div>
    </>
  );
}

export default Nav;
