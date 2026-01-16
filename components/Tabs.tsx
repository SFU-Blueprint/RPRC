import { inter } from '@/app/fonts';

type Tab = {
  label: string;
  value: string;
};

type TabsProps = {
  tabs: Tab[];
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
  additionalClasses?: {
    wrapper: string;
  };
};

export default function Tabs({
  tabs,
  currentTab,
  setCurrentTab,
  additionalClasses,
}: TabsProps) {
  return (
    <div
      className={`${inter.className} ${additionalClasses?.wrapper} flex gap-x-4 md:gap-x-8 lg:gap-x-16 pl-4 md:pl-7.5`}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === currentTab.value;

        return (
          <button
            key={tab.value}
            onClick={() => setCurrentTab(tab)}
            className={`
							cursor-pointer font-medium text-[12px] md:text-[14px] lg:text-[16px] leading-[160%] tracking-[-0.03em] underline underline-offset-[3px]
							${isActive ? 'inline-flex items-center px-2 md:px-6 py-1 md:py-2 bg-[#00519F54] rounded-[30px] border-4 border-[#00519F]' : ''}
						`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
