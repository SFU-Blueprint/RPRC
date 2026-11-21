import { inter } from '@/app/fonts';
import { Input } from '@/components/ui/input';

type AdminSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
};

export default function AdminSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search by name...',
}: AdminSearchBarProps) {
  return (
    <div className="w-full mt-6 flex flex-row gap-3 items-stretch">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
        className={`${inter.className} w-140 h-auto px-4 py-4 rounded-lg border-2 border-gray-400 bg-white placeholder:text-[#A9A295] text-[16px] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none`}
      />
    </div>
  );
}
