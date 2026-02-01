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
      className={`${inter.className} ${additionalClasses?.wrapper} flex gap-x-2`}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === currentTab.value;

        return (
          <button
            key={tab.value}
            onClick={() => setCurrentTab(tab)}
            className={`
							cursor-pointer font-semibold text-[16px] px-6.75 py-3.5 rounded-2xl border-2 border-[#BAB7B2]
							${isActive ? 'bg-[#5EB42D] border-none text-[#FFFDFA] shadow-[0px_2px_4px_-2px_#0000001A,0px_4px_6px_-1px_#0000001A]' : ''}
						`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
