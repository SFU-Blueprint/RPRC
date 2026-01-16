import { inter } from '@/app/fonts';

type StatCardProps = {
  label: string;
  value: number;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      className={`min-w-30 md:min-w-50 lg:min-w-70 h-36 md:h-62.5 bg-[#D4D0CA] rounded-[25px] border-4 border-[#CEC8B9] ${inter.className} flex flex-col items-center justify-center text-center gap-x-2`}
    >
      <p className="font-bold text-[32px] md:text-[60px] lg:text-[80px] xl:text-[100px] ">
        {value}
      </p>
      <p className="font-normal text-[14px] md:text-[20px] lg:text-[24px] px-4 lg:px-12 lg:pb-6 leading-4 md:leading-normal">
        {label}
      </p>
    </div>
  );
}
