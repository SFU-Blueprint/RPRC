type IconButtonAdditionalClassesPropTypes = {
  button: string[];
};

type ButtonComponentPropTypes = {
  children: React.ReactNode;
  name?: string;
  value?: string;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  additionalClasses?: IconButtonAdditionalClassesPropTypes;
  isActive?: boolean;
  disabled?: boolean;
};

export const Button = ({
  children,
  name,
  value,
  handleClick,
  disabled = false,
  additionalClasses,
  isActive = false,
}: Readonly<ButtonComponentPropTypes>) => {
  return (
    <button
      onClick={handleClick}
      name={name}
      value={value}
      disabled={disabled}
      className={`${additionalClasses?.button.join('')} flex items-center justify-center rounded-xl transition-all px-4.5 py-2.5 border-2 border-[#BAB7B2] cursor-pointer ${isActive ? 'bg-[#5EB42D] text-[#FFFDFA] border-transparent' : ''} disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-[16px] hover:bg-[#2B8100] hover:text-[#FFFDFA] hover:border-transparent`}
    >
      {children}
    </button>
  );
};
