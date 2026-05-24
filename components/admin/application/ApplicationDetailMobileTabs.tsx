import { headerStyles } from "@/app/fonts"
import { MOBILE_TABS } from "@/lib/constants"

export default function ApplicationDetailMobileTabs({
    currentTab,
    setCurrentTab
}: {
    currentTab: {
        label: string;
        value: string
    }
    setCurrentTab: (tab: {
        label: string;
        value: string
    }) => void
}) {
    return (
        <>
            <div className={`flex items-center justify-center w-full`}>
                {MOBILE_TABS.map((tab, idx) => (
                    <p
                        key={idx}
                        onClick={() => setCurrentTab(tab)}
                        className={`${currentTab.value === tab.value ? 'text-signup-primary-green-700 border-b border-signup-primary-green-700' : 'border-b border-transparent'} ${headerStyles.xsResponsive} text-nowrap flex-1 text-center pb-3 transition-all duration-200`}
                    >
                        {tab.label}
                    </p>
                ))}
            </div>
        </>
    )
}