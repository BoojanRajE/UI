import { ReactNode } from 'react';

export interface ResponsiveButtonProps {
  sm?: ReactNode;
  md?: ReactNode;
  lg?: ReactNode;
  [key: string]: any;
}
