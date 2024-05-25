import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-signup-view',
  templateUrl: './signup-view.component.html',
})
export class SignupViewComponent {
  username: string = "";
  password: string = "";
  confirmPassword: string = "";

  constructor(private loginService: LoginService) { 

  }

  async signup()
  {
    await this.loginService.signup({username: this.username, password: this.password});
  }

}
