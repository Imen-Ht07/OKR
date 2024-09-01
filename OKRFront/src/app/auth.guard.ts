import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkUserLogin(route, url);
  }

  private checkUserLogin(route: ActivatedRouteSnapshot, url: string): boolean {
    if (this.userService.isLoggedIn()) {
      const userRole = this.userService.getRole();
      const roles = route.data['roles'] as Array<string>;

      if (userRole && roles.indexOf(userRole) !== -1) {
        return true; // User is authenticated and authorized for this route
      } else {
     
        this.router.navigate(['/notfound']);
        return false;
      }
    }
    // User is not authenticated, redirect to the login page
    this.router.navigate(['/']);
    return false;
  }
}
