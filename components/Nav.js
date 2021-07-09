import Image from "next/image";
import Link from "next/link";

import logo from "../images/logo.png";

function Nav() {
  return (
    <div className="z-10 fixed p-5">
      <Link href="/">
        <Image src={logo} height={70} width={126} alt="Logo" />
      </Link>
    </div>
  );
}

export default Nav;
