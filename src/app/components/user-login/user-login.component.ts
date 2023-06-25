import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  loginForm!: FormGroup;
  wrongCredentials: boolean = false;
  showPassword: boolean = false

  constructor(private formBuilder: FormBuilder, private userService: UserService, private authService: AuthService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const userId = await this.checkIfUserExists();
    if (userId === '') {
      this.wrongCredentials = true;
      return;
    }
    const user: User = await this.userService.getUser(userId).toPromise();
    if (user) {
      this.authService.login(user);
    }
  }

  async checkIfUserExists() {
    try {
      const users: User[] | undefined = await this.userService.getUsers().toPromise();
      if (users)
        for (let user of users) {
          if (user.email === this.loginForm.get('email')?.value && user.password === this.userService.encryptPassword(this.loginForm.get('password')?.value)) {
            return user.id;
          }
        }

      return '';
    } catch (err) {
      console.log(err);
      return '';
    }
  }
}
