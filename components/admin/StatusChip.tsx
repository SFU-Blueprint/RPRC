import { inter } from '@/app/fonts';
import { ApplicationStatus, ReviewDecision } from '@/lib/constants';
import { STATUS_CHIPS } from '@/lib/constants/admin';

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

      <p className="text-xs text-white">{status.label}</p>
    </div>
  );
}
