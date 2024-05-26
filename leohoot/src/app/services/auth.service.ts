import { Injectable } from "@angular/core";
import { User } from "../model/user";
import { BlobOptions } from "buffer";
import { KeycloakService } from "keycloak-angular";
import { RestService } from "./rest.service";
import { lastValueFrom } from 'rxjs';
import { AuthResponse } from "../model/AuthResponse";
import { JwtPayload, jwtDecode } from "jwt-decode";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private isLoggedInIntern = () => !this.isInternTokenExpired();
    private isLoggedInKeycloak = () => this.keycloakService.isLoggedIn();

    isLoggedIn = () => this.isLoggedInIntern() || this.isLoggedInKeycloak();

    constructor(private keycloakService: KeycloakService, private restService: RestService)
    {

    }

    async login(loginWithKeycloak: boolean, user?: User)
    {
        if (loginWithKeycloak && !this.isLoggedInKeycloak())
        {
            await this.keycloakService.login();
        } else if (!loginWithKeycloak && !this.isLoggedInIntern()) {
            const response: AuthResponse = await lastValueFrom(this.restService.login(user!.username, user!.password));
            if (!response.isAuthSuccessful) {
                alert(response.errorMessage);
            } else {
                localStorage.setItem('token', response.token);
            }
        }
    }

    async logout()
    {
        if(this.isLoggedInKeycloak())
        {
            await this.keycloakService.logout()
        } else if (this.isLoggedInIntern())
        {
            localStorage.removeItem('token');
            window.location.reload();
        }
    }

    async signup(user: User): Promise<void>
    {
        const response: AuthResponse = await lastValueFrom(this.restService.signup(user.username, user.password));
        if (!response.isAuthSuccessful) {
            alert("Username already exists");
        } else {
            localStorage.setItem('token', response.token);
        }
    }

    public isInternTokenExpired(): boolean {
        var token = localStorage.getItem('token');
        if (!token) {
          return true;
        }
    
        const decoded: JwtPayload = jwtDecode(token);
        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decoded.exp!);
    
        return expirationDate < new Date();
    }
}