import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import logo from "../images/logo.png";

function Nav() {
  const router = useRouter();
  return (
    <>
      <div className="z-10 fixed p-5">
        <Link href="/">
          <Image src={logo} height={70} width={126} alt="Logo" />
        </Link>
      </div>
      <div className="z-10 absolute right-10 top-10">
        {router.pathname !== "/breadmachine" && (
          <Link href="/breadmachine">
            <a className="text-white font-bold">The Bread Machine</a>
          </Link>
        )}
      </div>
    </>
  );
}

export default Nav;
