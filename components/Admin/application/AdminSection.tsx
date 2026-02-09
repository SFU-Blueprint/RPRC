import { inter, robotoCondensed } from '@/app/fonts';

type AdminSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function AdminSection({
  title,
  children,
  className,
}: AdminSectionProps) {
  return (
    <div className={className ?? 'flex-1'}>
      <p className={`${robotoCondensed.className} text-[32px] font-bold`}>
        {title}
      </p>
      <div
        className={`rounded-4xl border-2 border-[#E6E3DA] py-10.75 px-8.5 mt-6 ${inter.className}`}
      >
        {children}
      </div>
    </div>
  );
}
