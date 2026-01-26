export type TBadgeColor = 'primary' | 'secondary' | 'ghost' | 'success' | 'info' | 'warning' | 'error';
export type TBadgeVariant = 'soft' | 'outline';
export type TBadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type TBadgeType = 'badge' | 'pill';

export interface IBadgeUi {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  iconColor?: string;
}

export interface IBadgeProps {
  color?: TBadgeColor;
  variant?: TBadgeVariant;
  size?: TBadgeSize;
  type?: TBadgeType;
  square?: boolean;
  icon?: string;
  iconAppend?: string;
  ui?: IBadgeUi;
}
