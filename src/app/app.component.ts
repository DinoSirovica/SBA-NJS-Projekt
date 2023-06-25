import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'JSProject';
  isDarkModeOn: boolean = false
  isAdmin: boolean = false
  username: string = '';
  isDropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {
    document.body.classList.toggle('dark-theme');
    this.isDarkModeOn = true
  }

  ngOnInit() {
    this.isAdmin = sessionStorage.getItem('admin') === 'true';
  }

  toggleTheme(): void {
    this.isDarkModeOn = !this.isDarkModeOn
    document.body.classList.toggle('dark-theme');
  }

  isUserLogedIn() {
    if (this.authService.isAuthenticated()) {
      const userJson = sessionStorage.getItem('user');
      if (userJson) {
        this.username = JSON.parse(userJson).firstName + ' ' + JSON.parse(userJson).lastName;
        this.isAdmin = sessionStorage.getItem('admin') === 'true';
        return true;
      }
    }
    return false;
  }

  logout() {
    this.isAdmin = sessionStorage.getItem('admin') === 'true';
    this.authService.logout();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}
