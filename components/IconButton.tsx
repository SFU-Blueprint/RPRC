type IconButtonAdditionalClassesPropTypes = {
  button: string[];
};

type IconButtonComponentPropTypes = {
  children: React.ReactNode;
  name?: string;
  value?: string;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  additionalClasses?: IconButtonAdditionalClassesPropTypes;
  disabled?: boolean;
};

export const IconButton = ({
  children,
  name,
  value,
  handleClick,
  disabled = false,
  additionalClasses,
}: Readonly<IconButtonComponentPropTypes>) => {
  return (
    <button
      onClick={handleClick}
      name={name}
      value={value}
      disabled={disabled}
      className={`${additionalClasses?.button.join('')} flex items-center justify-center w-10 h-10 rounded-xl transition-all`}
    >
      {children}
    </button>
  );
};
