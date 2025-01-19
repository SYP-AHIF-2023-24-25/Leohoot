import { Component } from '@angular/core';
import { LoginService } from "../../../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  username: string;
  isDropdownOpen = false;

  constructor(private loginService: LoginService) {
    this.username = loginService.getUserName()
  }
  async logout() {
    await this.loginService.logout();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
