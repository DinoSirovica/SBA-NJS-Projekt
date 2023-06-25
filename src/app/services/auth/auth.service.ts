import {Injectable} from '@angular/core';
import {User} from "../../models/user.model";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {
  }

  login(user: User) {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('authenticated', "true");
    if (user.role.toLowerCase() === 'admin') {
      sessionStorage.setItem('admin', "true");
    }
    this.router.navigate(['/']);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  isAuthenticated() {
    return !!sessionStorage.getItem('authenticated');
  }
}
