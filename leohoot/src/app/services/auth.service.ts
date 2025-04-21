import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { KeycloakService } from 'keycloak-angular';
import { RestService } from './rest.service';
import { lastValueFrom } from 'rxjs';
import { AuthResponse } from '../model/auth-response';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../model/jwt-payload';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private isLoggedInIntern = () => !this.isInternTokenExpired();
  private isLoggedInKeycloak = () => this.keycloakService.isLoggedIn();

  isLoggedIn = () => this.isLoggedInIntern() || this.isLoggedInKeycloak();

  constructor(
    private keycloakService: KeycloakService,
    private restService: RestService,
    private alertService: AlertService,
  ) {}

  async login(loginWithKeycloak: boolean, user?: User) {
    if (loginWithKeycloak && !this.isLoggedInKeycloak()) {
      await this.keycloakService.login();
    } else if (!loginWithKeycloak && !this.isLoggedInIntern()) {
      const response: AuthResponse = await lastValueFrom(
        this.restService.login(user!.username, user!.password),
      );
      if (!response.isAuthSuccessful) {
        this.alertService.show('error', response.errorMessage);
      } else {
        localStorage.setItem('token', response.token);
      }
    }
  }

  async logout() {
    if (this.isLoggedInKeycloak()) {
      await this.keycloakService.logout();
    } else if (this.isLoggedInIntern()) {
      localStorage.removeItem('token');
      window.location.reload();
    }
  }

  async signup(user: User): Promise<void> {
    const response: AuthResponse = await lastValueFrom(
      this.restService.signup(user.username, user.password),
    );
    if (!response.isAuthSuccessful) {
      this.alertService.show('error', "Username already exists.");
    } else {
      localStorage.setItem('token', response.token);
    }
  }

  public isInternTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return true;
    }

    const decoded: JwtPayload = jwtDecode(token);
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decoded.exp!);

    return expirationDate < new Date();
  }

  getToken(): string | null | undefined {
    if (this.isLoggedInIntern()) {
      return localStorage.getItem('token');
    } else if (this.isLoggedInKeycloak()) {
      return this.keycloakService.getKeycloakInstance().token;
    }
    return null;
  }

  getUserName(): string {
    let token: string | null | undefined = this.getToken();
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token!);
    return this.isLoggedInIntern()
      ? decoded.username
      : decoded.preferred_username;
  }
}
