export interface Alert {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}