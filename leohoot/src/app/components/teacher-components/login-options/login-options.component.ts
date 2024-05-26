import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-options',
  templateUrl: './login-options.component.html',
})
export class LoginOptionsComponent {
  constructor(private loginService: LoginService) {}
  
  async login(loginWithKeycloak: boolean) {
    await this.loginService.login(loginWithKeycloak);
  }
}
