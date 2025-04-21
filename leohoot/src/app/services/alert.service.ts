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
}
