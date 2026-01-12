import { robotoCondensed, inter } from '@/app/fonts';

type AdminNavbarProps = {
  adminName: string;
  profilePictureUrl?: string;
};

export default function AdminNavbar({
  adminName = 'Admin Name',
  profilePictureUrl,
}: AdminNavbarProps) {
  return (
    <div className="h-34.5 bg-[#393533]">
      <div className="flex items-center h-full justify-between ml-17.5 mr-17.5">
        <p
          className={`font-black text-[#89CC62] text-[48px] leading-[90%] ${robotoCondensed.className}`}
        >
          Richmond Poverty <br />
          Reduction Coalition
        </p>
        <div className="flex items-center gap-x-4">
          <p
            className={`${inter.className} text-[#89CC62] font-semibold text-[32px]`}
          >
            {adminName}
          </p>
          {profilePictureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profilePictureUrl} alt="" className="h-22.5 w-22.5" />
          ) : (
            <div className="h-22.5 w-22.5 rounded-full bg-[#7C7C7C]" />
          )}
        </div>
      </div>
    </div>
  );
}
