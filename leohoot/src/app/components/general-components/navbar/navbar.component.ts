import { Component } from '@angular/core';
import { LoginService } from "../../../services/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(private loginService: LoginService) { }

  async logout() {
    await this.loginService.logout();
  }
}
