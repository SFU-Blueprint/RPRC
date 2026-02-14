import { inter } from '@/app/fonts';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
        className={`${inter.className} w-96 h-auto px-4 py-4 rounded-lg border-2 border-gray-400 bg-white placeholder:text-[#A9A295] text-[16px] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none`}
      />
      <Button
        type="button"
        onClick={onSearch}
        className={`${inter.className} rounded-lg px-7 py-4 h-auto text-[17px] bg-primary-black text-primary-foreground hover:bg-primary-black/90 shrink-0`}
      >
        <Search size={20} strokeWidth={2} />
        Search
      </Button>
    </div>
  );
}
