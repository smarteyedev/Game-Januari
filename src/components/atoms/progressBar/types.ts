export interface IProgressBarUi {
  backgroundColor?: string
  color?: string
}

export type ProgressBarVariant = 'default' | 'with-icon' | 'with-outline'

export interface IProgressBarProps {
  progress?: number
  max?: number
  showLabel?: boolean
  showCounter?: boolean
  variant?: ProgressBarVariant
  ui?: IProgressBarUi
}
