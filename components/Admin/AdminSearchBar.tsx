import { inter } from '@/app/fonts';
import { Search } from 'lucide-react';

type AdminSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function AdminSearchBar({
  value,
  onChange,
  placeholder = 'Search by name...',
}: AdminSearchBarProps) {
  return (
    <div
      className="
          w-full md:w-[80%] mt-6 flex flex-row gap-x-3 rounded-2xl border-2 border-[#BAB7B2] p-4 items-center
        "
    >
      <Search size={20} className="text-[#74654C]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          ${inter.className} 
          w-full placeholder:text-[#A9A295] placeholder:text-[16px] focus:outline-none
        `}
      />
    </div>
  );
}
