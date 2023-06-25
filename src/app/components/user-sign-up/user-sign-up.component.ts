import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user.model";
import {AccountService} from "../../services/account.service";
import {CardService} from "../../services/card.service";

@Component({
  selector: 'app-user-sign-up',
  templateUrl: './user-sign-up.component.html',
  styleUrls: ['./user-sign-up.component.css']
})
export class UserSignUpComponent implements OnInit {
  registerForm!: FormGroup;
  passwordMismatch: boolean = false;
  showPassword: boolean = false;
  showPassword2: boolean = false;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private userService: UserService,
              private accountService: AccountService, private cardService: CardService) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      personalId: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), this.numericValidator]],
      dateOfBirth: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, this.numericValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });

    this.registerForm.get('confirmPassword')?.setValidators([Validators.required, this.passwordMatchValidator.bind(this)]);
    this.registerForm.get('password')?.setValidators([Validators.required, Validators.minLength(8), this.passwordComplexityValidator.bind(this)]);
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const userExists = await this.checkIfUserExists();
    if (userExists !== '') {
      this.errorMessage = userExists;
      return;
    }

    this.userService.addUser(this.registerForm).subscribe({
      next: (res) => {
        this.accountService.createAccount(res.id, "Main account").subscribe(
          (res2) => {
            this.cardService.createCard(res.id).subscribe(
              res => {
                location.href = '/login'
              }
            )
          }
        );
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  async checkIfUserExists() {
    try {
      const users: User[] | undefined = await this.userService.getUsers().toPromise();
      if (users)
        for (let user of users) {
          if (user.personalId === this.registerForm.get('personalId')?.value) {
            return 'User with this personal ID number already exists';
          }
          if (user.email === this.registerForm.get('email')?.value) {
            return 'User with this email already exists';
          }
        }
      return '';
    } catch (err) {
      console.log(err);
      return '';
    }
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmVisibility() {
    this.showPassword2 = !this.showPassword2;
  }

  numericValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    const numericPattern = /^\d+$/;

    if (value && !value.match(numericPattern)) {
      return {numeric: true};
    }

    return null;
  }


  passwordMatchValidator(control: AbstractControl) {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = control.value;

    if (password === confirmPassword) {
      this.passwordMismatch = false;
      return null;
    } else {
      this.passwordMismatch = true;
      return {mismatch: true};
    }
  }

  passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;

    if (!/[!@#$%^&*]/.test(password) || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return {complexity: true};
    }
    return null;
  }
}
