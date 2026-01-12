import { inter } from '@/app/fonts';

type StatusChipType = {
  color: string;
  label: string;
  theme: string;
};

const STATUS_CHIPS: StatusChipType[] = [
  { color: '#00519F', label: 'To Review', theme: 'toReview' },
  { color: '#393533', label: 'Rejected', theme: 'rejected' },
  { color: '#C67D38', label: 'Payment Pending', theme: 'paymentPending' },
  { color: '#3FA104', label: 'Complete', theme: 'complete' },
];

type StatusChipProps = {
  theme: 'toReview' | 'rejected' | 'paymentPending' | 'complete';
};

export default function StatusChip({ theme }: StatusChipProps) {
  const status = STATUS_CHIPS.find((s) => s.theme === theme);

  if (!status) return null;

  return (
    <div className={`flex items-center gap-x-3.75 ${inter.className}`}>
      <div
        className="rounded-full w-5.5 h-5.5"
        style={{ backgroundColor: status.color }}
      ></div>

      <p className="text-[24px] font-normal" style={{ color: status.color }}>
        {status.label}
      </p>
    </div>
  );
}
