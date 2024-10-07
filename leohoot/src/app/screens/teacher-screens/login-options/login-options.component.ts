import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-options',
  templateUrl: './login-options.component.html',
})
export class LoginOptionsComponent {
  constructor(private loginService: LoginService, private router: Router) {
    if (this.loginService.isLoggedIn()){
      this.router.navigate(["/quizOverview"])
    }
  }
  
  async login(loginWithKeycloak: boolean) {
    await this.loginService.login(loginWithKeycloak);
  }
}
