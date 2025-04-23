export interface Alert {
  type: 'success' | 'error' | 'info' | 'warning' | 'confirm';
  message: string;
  confirmCallback?: (confirmed: boolean) => void;
}