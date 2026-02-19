export type TModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'full'
export type TModalFooterPosition = 'left' | 'center' | 'right'
export type TModalPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface IModalFooter {
  cancel?: string
  ok?: string
  position?: TModalFooterPosition
  cancelDisabled?: boolean
  okDisabled?: boolean
}

export interface IModalUi {
  contentGap?: string
  padding?: string
  offset?: string
  minHeight?: string
  maxHeight?: string
  contentMinHeight?: string
  contentMaxHeight?: string
}

export type TModalScrollMode = 'root' | 'modal' | 'content'
export type TContainerPosition = 'fixed' | 'absolute' | 'relative'

export interface IModalProps {
  title?: string
  size?: TModalSize
  position?: TModalPosition
  preventClose?: boolean
  footer?: IModalFooter
  divider?: boolean
  overlay?: boolean
  scrollMode?: TModalScrollMode
  ui?: IModalUi
  contentStyle?: Record<string, string>
  containerPosition?: TContainerPosition
}
