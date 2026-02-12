export type TButtonSizes = 'xl' | 'lg' | 'md' | 'sm' | 'xs'
export type TButtonColors =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
export type TButtonVariants = 'solid' | 'outline' | 'soft' | 'transparent'

export interface IButtonUi {
  borderColor?: string
  hoverBorderColor?: string
  activeBorderColor?: string
  backgroundColor?: string
  hoverBackgroundColor?: string
  activeBackgroundColor?: string
  color?: string
  hoverColor?: string
  activeColor?: string
}

export interface IButtonProps {
  size?: TButtonSizes
  color?: TButtonColors
  variant?: TButtonVariants
  disabled?: boolean
  loading?: boolean
  trailing?: boolean
  square?: boolean
  icon?: string
  iconAppend?: string
  tag?: any
  ui?: IButtonUi

  [key: string]: any
}