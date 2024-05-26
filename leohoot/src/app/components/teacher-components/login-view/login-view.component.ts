import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
})
export class LoginViewComponent {
  username: string = "";
  password: string = "";

  constructor(private loginService: LoginService, private router: Router) { 

  }

  async login()
  {
    let user: User =
    {
      username: this.username,
      password: this.password
    }
    await this.loginService.login(false, user);
    if (this.loginService.isLoggedIn())
      {
        this.router.navigate(['/quizOverview']);
      }
  }
}
