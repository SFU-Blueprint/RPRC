import { inter } from '@/app/fonts';
import { ApplicationStatus, ReviewDecision } from '@/lib/constants';

type StatusChipType = {
  color: string;
  label: string;
  theme: ApplicationStatus | ReviewDecision;
};

const STATUS_CHIPS: StatusChipType[] = [
  { color: '#00519F', label: 'To Review', theme: ApplicationStatus.TO_REVIEW },
  { color: '#393533', label: 'Rejected', theme: ApplicationStatus.REJECTED },
  { color: '#393533', label: 'Rejected', theme: ReviewDecision.REJECT },
  { color: '#C67D38', label: 'Payment Pending', theme: ApplicationStatus.PAYMENT_PENDING },
  { color: '#5EB42D', label: 'Active', theme: ApplicationStatus.ACTIVE },
  { color: '#2B8100', label: 'Approved', theme: ReviewDecision.APPROVE },
  { color: '#BE282B', label: 'Expired', theme: ApplicationStatus.EXPIRED },
];

type StatusChipProps = {
  theme: ApplicationStatus | ReviewDecision;
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
