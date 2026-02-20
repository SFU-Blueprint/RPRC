import Image from 'next/image';
import { robotoCondensed } from '@/app/fonts';

export default function AdminNavbar() {
  return (
    <div
      className="
          h-14.5 md:h-17 bg-application-rejected sticky top-0 z-50 w-full 
          flex items-center justify-center gap-3 
        "
    >
      <Image
        src="/Adminpage/RPRC Logo.png"
        alt="RPRC Logo"
        width={49}
        height={36}
        className="shrink-0"
      />
      <p
        className={`
            ${robotoCondensed.className} 
            font-medium text-signup-primary-green-500
            text-lg md:text-xl leading-[1.1]
          `}
      >
        Membership Admin Portal
      </p>
    </div>
  );
}
