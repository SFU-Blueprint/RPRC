import { inter } from '@/app/fonts';

type StatusChipType = {
  color: string;
  label: string;
  theme: string;
};

const STATUS_CHIPS: StatusChipType[] = [
  { color: '#00519F', label: 'To Review', theme: 'to_review' },
  { color: '#393533', label: 'Rejected', theme: 'rejected' },
  { color: '#C67D38', label: 'Payment Pending', theme: 'payment_pending' },
  { color: '#5EB42D', label: 'Active', theme: 'active' },
  { color: '#2B8100', label: 'Approved', theme: 'approved' },
  { color: '#BE282B', label: 'Expired', theme: 'expired' },
];

type StatusChipProps = {
  theme: string;
};

export default function StatusChip({ theme }: StatusChipProps) {
  const status = STATUS_CHIPS.find((s) => s.theme === theme);

  if (!status) return null;

  return (
    <div
      className={`${inter.className} rounded-full flex justify-center items-center gap-x-2 py-1 px-2.75 w-fit`}
      style={{ backgroundColor: status.color }}
    >
      <div className="rounded-full w-2 h-2 bg-white"></div>

      <p className="text-[10px] sm:text-[14px] text-white">{status.label}</p>
    </div>
  );
}
