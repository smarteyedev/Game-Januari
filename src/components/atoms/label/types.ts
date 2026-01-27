export interface ILabelUi {
  color?: string
}

export interface ILabelProps {
  name?: string
  label?: string
  tooltip?: string
  ui?: ILabelUi
  floatingVueConfig?: Record<string, any>
}
