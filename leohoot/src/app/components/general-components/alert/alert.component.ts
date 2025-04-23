import { Component } from '@angular/core';
import { Alert } from 'src/app/model/alert';
import { AlertService } from 'src/app/services/alert.service';
import {
  trigger,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  animations: [
    trigger('alertAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translate(-50%, -2rem)' 
        }),
        animate('400ms ease-out', style({
          opacity: 1,
          transform: 'translate(-50%, 0)' 
        }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({
          opacity: 0,
          transform: 'translate(-50%, -1rem)' 
        }))
      ])
    ])
  ]
})
export class AlertComponent {
  alert: Alert | undefined = undefined;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.alert$.subscribe(alert => {
      this.alert = alert;
    });
  }

  closeAlert() {
    this.alert = undefined;
  }

  handleConfirm(result: boolean) {
    if (this.alert?.confirmCallback) {
      this.alert.confirmCallback(result);
    }
    this.alert = undefined;
  }
  
}
