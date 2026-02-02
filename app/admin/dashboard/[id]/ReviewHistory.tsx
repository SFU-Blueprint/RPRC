import { inter, robotoCondensed } from '@/app/fonts';

type ReviewHistoryProps = {};

export default function ReviewHistory({}) {
  return (
    <div className="flex-1">
      <p className={`${robotoCondensed.className} text-[32px] font-bold`}>
        Review History
      </p>
      <div
        className={`rounded-4xl border-2 border-[#E6E3DA] py-10.75 px-8.5 mt-6 ${inter.className}`}
      >
        No Recent Reviews...
      </div>
    </div>
  );
}
