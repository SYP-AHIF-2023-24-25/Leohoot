
import { Injectable, inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateFn, ActivatedRoute, mapToCanActivate
} from '@angular/router';
import { LoginService } from "../services/auth.service";

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const loginService = inject(LoginService);

  if (loginService.isLoggedIn())
  {
    return true;
  } else {
    loginService.login(true)
    if (loginService.isLoggedIn()){
      return true
    }
  }
  return false;
};
