import Image from 'next/image';
import Link from 'next/link';

import logo from '../images/logo.png';

function Nav() {
  return (
    <>
      <div className="fixed z-10 p-6">
        <Link href="/">
          <Image
            src={logo}
            className="cursor-pointer"
            height={70}
            width={126}
            alt="Logo"
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </Link>
      </div>
      <div className="absolute right-10 top-10 z-10 grid gap-4 sm:flex sm:gap-10">
        <Link
          href="/breadmachine"
          className="relative flex items-center justify-center p-2 font-bold no-underline sm:p-3"
        >
          <div className="absolute -z-10 h-full w-full skew-x-12 transform border border-black bg-white"></div>
          The Bread Machine
        </Link>
        <Link
          href="https://shop.yeastyboysbread.com"
          className="relative flex items-center justify-center p-2 font-bold no-underline sm:p-3"
        >
          <div className="absolute -z-10 h-full w-full skew-x-12 transform border border-black bg-white"></div>
          Shop
        </Link>
      </div>
    </>
  );
}

export default Nav;
