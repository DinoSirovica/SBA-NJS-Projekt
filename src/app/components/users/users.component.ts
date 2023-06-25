import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";
import {CardService} from "../../services/card.service";
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  isAdmin: boolean = false
  allUsers: User[] = [];

  constructor(private userService: UserService, private cardService: CardService, private accountService: AccountService) {
  }

  ngOnInit() {
    this.isAdmin = sessionStorage.getItem('admin') === 'true';
    if (!this.isAdmin) {
      window.location.href = '/home';
    }
    this.userService.getUsers().subscribe({
      next: users => {
        this.allUsers = users;
      }
    });
  }

  deleteUser(id: string) {
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
        this.allUsers = this.allUsers.filter(u => u.id != id);
      }
    });
  }

  changeUserRole(id: string, role: string) {
    if (role === 'USER')
      role = 'ADMIN';
    else
      role = 'USER';
    this.userService.changeUserRole(id, role).subscribe({
      next: () => {
        // @ts-ignore
        this.allUsers.find(u => u.id == id).role = role;
      }
    });
  }
}
