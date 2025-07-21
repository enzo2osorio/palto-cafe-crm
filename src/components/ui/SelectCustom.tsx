import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
type SelectCustomProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string;
  options?: { value: string; label: string }[];
};

export interface Option {
  value: string;
  label: string;
}

export const SelectCustom = ({
  className,
  options,
  ...props
}: SelectCustomProps) => {
  const [isSelectActive, setSelectActive] = useState(false);
  const handleSelectClick = () => {
    setSelectActive(!isSelectActive);
  };
  return (
    <div className="relative w-max h-max">
      <select
        onClick={() => handleSelectClick()}
        className={`bg-accent px-5 py-3 outline-2 transition-colors cursor-pointer focus:outline-white pr-12 rounded-2xl text-base font-body ${className}`}
        {...props}
      >
        {options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-muted-foreground font-body w-full border-none"
          >
            {option.label}
          </option>
        ))}
      </select>
      {isSelectActive ? (
        <ChevronRight className="w-4 absolute right-4 top-1/2 transform -translate-y-1/2" />
      ) : (
        <ChevronDown className="w-4 absolute right-4 top-1/2 transform -translate-y-1/2" />
      )}
    </div>
  );
};
