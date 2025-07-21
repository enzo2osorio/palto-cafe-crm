import React from 'react'

type ButtonCustomProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    children?: React.ReactNode;
};

export const ButtonCustom = ({ className, children, ...props }: ButtonCustomProps) => {
  return (
    <button 
    className={`bg-success 
      ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      hover:bg-success/50 text-white transition-colors px-5 py-3 rounded-4xl flex items-center justify-center 
    ${className}`} 
    {...props}>
      {children}
    </button>
  )
}

export const ButtonCustomSecondary = ({ className, children, ...props }: ButtonCustomProps) => {
  return (
    <button
    disabled={props.disabled}
    type={props.type || 'button'} 
    className={`bg-none hover:bg-success 
      ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      dark:text-white dark:border-white dark:hover:border-transparent dark:hover:bg-white dark:hover:text-black text-success border-2 border-success hover:text-white transition-colors px-5 py-3 rounded-4xl flex items-center justify-center 
    ${className}`} 
    {...props}>
      {children}
    </button>
  )
}
