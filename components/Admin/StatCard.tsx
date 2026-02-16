import Image from 'next/image';
import { inter } from '@/app/fonts';
import { BackdropContainer } from '@/components/ui/BackdropContainer';
import { type StatCardType, type StatCardsData } from '@/lib/constants/admin/dashboard';

export type { StatCardsData };

const STAT_CARD_CONFIG: Record<StatCardType, { label: string; image: string }> = {
  independent: {
    label: 'Independent Members',
    image: '/Adminpage/AdminIndependentMemebers.png',
  },
  organization: {
    label: 'Organization Members',
    image: '/Adminpage/AdminOrganiziationMembers.png',
  },
  applications: {
    label: 'New Applications',
    image: '/Adminpage/AdminNewApplicationsIcon.png',
  },
};

type StatCardProps = {
  type: StatCardType;
  value: number;
};

function StatCard({ type, value }: StatCardProps) {
  const { label, image: iconSrc } =
    STAT_CARD_CONFIG[type] ?? STAT_CARD_CONFIG.independent;

  return (
    <BackdropContainer
      className="flex-1 min-w-0 flex flex-col items-center justify-center text-center
        border-2 border-primary-black rounded-[16px] p-4 md:p-5 lg:p-6"
    >
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <span className="text-primary-black shrink-0 [&>svg]:w-8 [&>svg]:h-8 [&>img]:w-8 [&>img]:h-8 md:[&>svg]:w-9 md:[&>svg]:h-9 md:[&>img]:w-9 md:[&>img]:h-9">
          <Image src={iconSrc} alt={label} width={36} height={36} />
        </span>
        <span
          className={`${inter.className} font-bold text-[28px] md:text-[40px] lg:text-[52px] text-primary-black`}
        >
          {value}
        </span>
      </div>
      <p
        className={`${inter.className} font-normal text-[14px] md:text-[16px] leading-normal text-primary-black tracking-[-0.45px]`}
      >
        {label}
      </p>
    </BackdropContainer>
  );
}

type StatCardsProps = {
  /** When provided, used instead of mock data */
  stats?: StatCardsData;
};

export function StatCards({ stats }: StatCardsProps) {
  const cards = stats ?? [];
  return (
    <div className="mb-16 md:mb-24 flex w-full gap-x-4 md:gap-x-6">
      {cards.map((card) => (
        <StatCard key={card.type} type={card.type} value={card.value} />
      ))}
    </div>
  );
}

export default StatCard;
