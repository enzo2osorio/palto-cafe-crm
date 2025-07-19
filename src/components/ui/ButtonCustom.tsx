import React from 'react'

type ButtonCustomProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    children?: React.ReactNode;
};

export const ButtonCustom = ({ className, children, ...props }: ButtonCustomProps) => {
  return (
    <button 
    className={`bg-primary px-5 py-3 rounded-4xl flex items-center justify-center cursor-pointer 
    ${className}`} 
    {...props}>
      {children}
    </button>
  )
}
