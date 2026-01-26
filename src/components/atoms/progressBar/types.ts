export interface IProgressBarUi {
  backgroundColor?: string;
  color?: string;
}

export interface IProgressBarProps {
  progress?: number;
  max?: number;
  showLabel?: boolean;
  ui?: IProgressBarUi;
}
