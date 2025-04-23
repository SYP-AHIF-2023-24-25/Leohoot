import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Alert } from '../model/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  private alertSubject = new Subject<Alert>();
  alert$ = this.alertSubject.asObservable();

  show(type: Alert['type'], message: string) {
    this.alertSubject.next({ type, message });
  }

  confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.alertSubject.next({
        type: 'confirm',
        message,
        confirmCallback: resolve,
      });
    });
  }
}
