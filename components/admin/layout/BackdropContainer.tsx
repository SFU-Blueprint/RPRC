import { cn } from '@/lib/utils';

type BackdropContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function BackdropContainer({
  children,
  className,
}: BackdropContainerProps) {
  return (
    <div
      className={cn(
        'bg-card-background-gray rounded-4xl p-6 md:p-8 lg:p-10',
        'shadow-[0_2px_8px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
