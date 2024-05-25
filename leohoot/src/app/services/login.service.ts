import { Injectable } from "@angular/core";
import { User } from "../model/user";
import { BlobOptions } from "buffer";
import { KeycloakService } from "keycloak-angular";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private isLoggedInIntern:boolean = false;
    private isLoggedInKeycloak = () => this.keycloakService.isLoggedIn();

    isLoggedIn = () => this.isLoggedInIntern || this.isLoggedInKeycloak();

    constructor(private keycloakService: KeycloakService)
    {
        
    }


    async login(loginWithKeycloak: boolean, user?: User)
    {
        if (loginWithKeycloak && !this.isLoggedInKeycloak())
        {
            await this.keycloakService.login();
        } else {
            
        }
    }

    async logout()
    {
        if(this.isLoggedInKeycloak())
        {
            await this.keycloakService.logout()
        }
    }

    async signup(user: User) : Promise<void>
    {

    }
}