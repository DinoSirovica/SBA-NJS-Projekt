import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";
import {CardService} from "../../services/card.service";
import {AccountService} from "../../services/account.service";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isEditing: boolean = false;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  dateOfBirth: string = '';
  phoneNumber: string = '';
  personalId: string = '';
  user: User | undefined;

  constructor(private userService: UserService, private cardService: CardService,
              private accountService: AccountService, private authService: AuthService) {
  }

  toggleEditing() {
    if (this.isEditing) {
      let temp = {
        dateOfBirth: this.dateOfBirth,
        firstName: this.firstName,
        lastName: this.lastName,
        personalId: this.personalId,
        phoneNumber: this.phoneNumber,
        email: this.email
      }
      const userId = this.user?.id
      if (userId)
        this.userService.updateUser(userId, temp).subscribe({
            next: () => {
              if (this.user) {
                this.userService.getUser(this.user.id).subscribe(
                  (res: User) => {
                    this.user = res;
                  }
                )
              }
            }
          }
        );
    }
    this.isEditing = !this.isEditing;

  }

  ngOnInit() {
    const user = sessionStorage.getItem('user');
    if (user != null) {
      this.userService.getUser(JSON.parse(user).id).subscribe(
        (res: User) => {
          this.user = res;

          this.firstName = this.user.firstName
          this.lastName = this.user.lastName
          this.phoneNumber = this.user.phoneNumber
          this.email = this.user.email
          this.personalId = this.user.personalId
          this.dateOfBirth = this.user.dateOfBirth
        }
      )
    }
  }

  deleteProfile() {
    const id = this.user?.id
    if (id) {
      this.cardService.getCards().subscribe({
        next: cards => {
          for (let card of cards) {
            if (card.userId === id) {
              this.cardService.deleteAllCards(card.id, card.type).subscribe();
            }
          }
        }
      });
      this.accountService.getAccounts().subscribe({
        next: accounts => {
          for (let account of accounts) {
            if (account.userId === id) {
              this.accountService.deleteAccount(account.id).subscribe();
            }
          }
        }
      });
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.authService.logout();
        }
      });
    }
  }
}
