import { inter } from '@/app/fonts';

type Option = {
  label: string;
  value: string;
};

type RadioGroupProps = {
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
  name: string;
  label?: string;
  additionalClasses?: {
    wrapper?: string;
    optionsContainer?: string;
    option?: string;
    radioInput?: string;
    radioLabel?: string;
  };
};

export const RadioGroup = ({
  options,
  selectedValue,
  onChange,
  name,
  label,
  additionalClasses,
}: RadioGroupProps) => {
  return (
    <div className={`${additionalClasses?.wrapper} ${inter.className}`}>
      {label && <label className={`block mb-2 font-medium`}>{label}</label>}
      <div
        className={`flex flex-row gap-x-4 ${additionalClasses?.optionsContainer ?? ''}`}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center justify-center cursor-pointer font-semibold transition-colors ${
              selectedValue === option.value
                ? 'bg-[#3283c1] text-[#FFFDFA] border-transparent'
                : ''
            } ${additionalClasses?.option ?? ''}`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <span className={additionalClasses?.radioLabel ?? ''}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
