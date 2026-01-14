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
    <div className="sticky top-0 z-50 w-full bg-[#393533]">
      <div
        className="
          mx-auto
          max-w-[120rem]
          min-w-[30rem]
          px-6 md:px-10 xl:px-16
          h-[8.75rem]
          flex items-center justify-between
        "
      >
        <p
          className={`
            ${robotoCondensed.className}
            font-black text-[#89CC62]
            text-[2rem] sm:text-[2.5rem] xl:text-[3rem]
            leading-[90%]
          `}
        >
          Richmond Poverty <br />
          Reduction Coalition
        </p>

        <div className="flex items-center gap-4">
          <p
            className={`
              ${inter.className}
              text-[#89CC62]
              font-semibold
              text-[1.25rem] sm:text-[1.5rem] xl:text-[2rem]
            `}
          >
            {adminName}
          </p>

          {profilePictureUrl ? (
            <img
              src={profilePictureUrl}
              alt=""
              className="h-22.5 w-22.5 rounded-full object-cover"
            />
          ) : (
            <div className="h-22.5 w-22.5 rounded-full bg-[#7C7C7C]" />
          )}
        </div>
      </div>
    </div>
  );
}
