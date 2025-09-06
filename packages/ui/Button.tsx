// packages/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors" {...props}>
    {children}
  </button>
);

export const Button = ({children, ...props}) => (
  <button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600" {...props}>
    {children}
  </button>
);