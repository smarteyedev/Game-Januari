export interface IRadioUi {
  color?: string
}

export interface IRadioProps {
  value: string | number | boolean
  label?: string
  disabled?: boolean
  readonly?: boolean
  inputProps?: Record<string, any>
  ui?: IRadioUi
}
