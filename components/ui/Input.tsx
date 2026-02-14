import { inter } from '@/app/fonts';

type InputAdditionalClassesPropTypes = {
  wrapper?: string;
  label?: string;
  input?: string;
};

type InputComponentPropTypes = {
  label?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  additionalClasses?: InputAdditionalClassesPropTypes;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
};

export const Input = ({
  label,
  value,
  onChange,
  disabled = false,
  additionalClasses,
  type = 'text',
  placeholder,
}: Readonly<InputComponentPropTypes>) => {
  return (
    <div className={`${additionalClasses?.wrapper} ${inter.className}`}>
      {label && (
        <label
          className={`block mb-2 font-medium ${additionalClasses?.label ?? ''}`}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${additionalClasses?.input} border-2 border-[#D4D0C5] rounded-xl pl-4 py-3.5`}
      />
    </div>
  );
};
