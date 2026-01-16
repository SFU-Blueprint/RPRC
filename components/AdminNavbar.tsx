import { robotoCondensed, inter } from '@/app/fonts';

type AdminNavbarProps = {
  adminName: string;
  profilePictureUrl?: string;
};

export default function AdminNavbar({
  adminName,
  profilePictureUrl,
}: AdminNavbarProps) {
  return (
    <div
      className="
          px-10 md:px-17.5 h-24 md:h-35 bg-[#393533]  
          flex items-center gap-x-3 md:gap-x-12
          sticky top-0 z-50 w-full 
        "
    >
      <p
        className={`
            ${robotoCondensed.className}
            font-black text-[#89CC62]
            text-[20px] md:text-[36px] lg:text-[48px]
            leading-[90%]
          `}
      >
        Richmond Poverty <br />
        Reduction Coalition
      </p>

      <div className="ml-auto flex items-center gap-1.5 md:gap-4">
        <p
          className={`
              ${inter.className}
              text-[#89CC62]
              font-semibold
              text-[16px] md:text-[28px] lg:text-[32px]
            `}
        >
          {adminName}
        </p>

        {profilePictureUrl ? (
          <img
            src={profilePictureUrl}
            alt=""
            className="h-14 w-14 md:h-22.5 md:w-22.5 rounded-full object-cover"
          />
        ) : (
          <div className="h-14 w-14 md:h-22.5 md:w-22.5 rounded-full bg-[#7C7C7C]" />
        )}
      </div>
    </div>
  );
}
