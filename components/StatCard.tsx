import { inter, robotoCondensed } from '@/app/fonts';

type StatCardProps = {
  label: string;
  value: number;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      className={`flex-1 h-36 md:h-62.5 bg-[#D9E7F4] rounded-4xl flex flex-col items-center justify-center text-center py-6`}
    >
      <p className="font-bold text-[32px] md:text-[60px] lg:text-[80px] xl:text-[100px]">
        <span className={`${robotoCondensed.className} md:hidden`}>
          {value}
        </span>
        <span className={`${inter.className} hidden md:inline`}>{value}</span>
      </p>
      <p className="font-normal text-[16px] md:text-[20px] leading-normal md:leading-7.5 tracking-[-0.45px] px-2">
        {label}
      </p>
    </div>
  );
}
