import { robotoCondensed } from '@/app/fonts';

export default function AdminNavbar() {
  return (
    <div
      className="
          h-17 bg-[#393533]
          sticky top-0 z-50 w-full flex items-center
        "
    >
      <p
        className={`
            ${robotoCondensed.className} pl-8
            font-medium text-[#89CC62]
            text-[28px] leading-[1.1]
          `}
      >
        RPRC Membership Management
      </p>
    </div>
  );
}
