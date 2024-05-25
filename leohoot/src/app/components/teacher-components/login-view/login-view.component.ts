import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
})
export class LoginViewComponent {
  username: string = "";
  password: string = "";

  constructor(private loginService: LoginService) { 

  }

  async login()
  {
    let user: User =
    {
      username: this.username,
      password: this.password
    }
    await this.loginService.login(false, user);
  }
}
