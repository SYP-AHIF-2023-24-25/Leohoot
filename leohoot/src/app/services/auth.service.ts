import { Injectable } from "@angular/core";
import { User } from "../model/user";
import { BlobOptions } from "buffer";
import { KeycloakService } from "keycloak-angular";
import { RestService } from "./rest.service";
import { lastValueFrom } from 'rxjs';
import { AuthResponse } from "../model/auth-response";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../model/jwt-payload";
import { Router } from "@angular/router";
import * as bcrypt from 'bcryptjs';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private isLoggedInIntern = () => !this.isInternTokenExpired();
    private isLoggedInKeycloak = () => this.keycloakService.isLoggedIn();

    isLoggedIn = () => this.isLoggedInIntern() || this.isLoggedInKeycloak();

    constructor(private keycloakService: KeycloakService, private restService: RestService, private router: Router)
    {

    }

    async login(loginWithKeycloak: boolean, user?: User)
    {
        if (loginWithKeycloak && !this.isLoggedInKeycloak())
        {
            await this.router.navigate(['/quizOverview']);
            await this.keycloakService.login();
        } else if (!loginWithKeycloak && !this.isLoggedInIntern()) {
            this.restService.getUser(user!.username).subscribe(async data => {
                const isAuthorized = await bcrypt.compare(user!.password, data.password);
                if (!isAuthorized)
                {
                    alert("Password or Username are wrong!");
                } else {
                    const response: AuthResponse = await lastValueFrom(this.restService.login(user!.username, user!.password));
                    localStorage.setItem('token', response.token);
                    await this.router.navigate(['/quizOverview']);
                }
            });
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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        const response: AuthResponse = await lastValueFrom(this.restService.signup(user.username, hashedPassword));
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

    getUserName(): string {
        let token: string | null | undefined = "";
        if (this.isLoggedInIntern())
        {
            token = localStorage.getItem('token');
        } else if (this.isLoggedInKeycloak())
        {
            token = this.keycloakService.getKeycloakInstance().token;
        }
        const decoded: JwtPayload = jwtDecode<JwtPayload>(token!);
        var username = this.isLoggedInIntern() ? decoded.username : decoded.preferred_username;
        return username
    }
}