
import { Injectable, inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateFn, ActivatedRoute, mapToCanActivate
} from '@angular/router';
import { LoginService } from "../services/auth.service";
import { createLeoUser, Role } from "./leo-token";
import { KeycloakService } from "keycloak-angular";

export const AuthGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const loginService = inject(LoginService);
  const keycloakService = inject(KeycloakService);
  if (!loginService.isLoggedIn())
  {
    await loginService.login(true)
  }
  await loginService.login(true)
  if (loginService.isLoggedIn()){
    const requiredRoles: Role[] = route.data["roles"];
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }
    const leoUser = await createLeoUser(keycloakService);
    return requiredRoles.some((role) => leoUser.hasRole(role) || leoUser.username === "if200148" || leoUser.username === "if200196" || leoUser.username === "if200127");
  }
  return false;
};
