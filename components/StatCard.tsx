import { inter } from '@/app/fonts';

type StatCardProps = {
  label: string;
  value: number;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      className={`w-113.75 h-62.5 bg-[#D4D0CA] rounded-[25px] border-4 border-[#CEC8B9] ${inter.className} flex flex-col items-center justify-center`}
    >
      <p className="font-bold text-[100px] ">{value}</p>
      <p className="font-normal text-[24px]">{label}</p>
    </div>
  );
}
