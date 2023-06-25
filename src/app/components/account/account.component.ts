import {Component, OnInit} from '@angular/core';
import {Account} from "../../models/account.model";
import {AccountService} from "../../services/account.service";
import {User} from "../../models/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  accounts: Account[] = [];
  userOb: User = new User('', '', '', '', '', '', '', '', '');
  addNewAcc: boolean = false;
  newAccountName: string = '';

  constructor(private accountService: AccountService, private router: Router) {
  }

  accountClick(acc: Account) {
    this.router.navigate(['transfer/', acc.accountNumber]);
  }

  ngOnInit() {
    const user = sessionStorage.getItem('user');
    if (user != null) {
      this.userOb = new User(
        JSON.parse(user).dateOfBirth, JSON.parse(user).email, JSON.parse(user).firstName,
        JSON.parse(user).lastName, JSON.parse(user).password, JSON.parse(user).personalId, JSON.parse(user).phoneNumber, JSON.parse(user).role, JSON.parse(user).id,);
      this.accountService.getAccountsForUser(JSON.parse(user).id).subscribe((res: Account[]) => {
        this.accounts = res;
      });
    }
  }

  addNewAccount() {
    if (this.accounts.length < 3) {
      this.accountService.createAccount(this.userOb.id, this.newAccountName).subscribe(
        (res) => {
          const account = new Account(res.accountName, res.accountNumber.toString(), res.balance, res.currency, res.id, res.userId);
          this.accounts.push(account);
          this.addNewAcc = false;
          this.newAccountName = '';
        }
      );
    } else {
      alert("You already have 3 accounts!");
    }
  }

  deleteAccount(accountNumber: string) {
    let mainIndex = -1;
    let deleteIndex = -1;
    this.accounts.forEach((account, index) => {
      if (account.accountName === 'Main account') {
        mainIndex = index;
      }
      if (account.accountNumber === accountNumber) {
        deleteIndex = index;
      }
    });

    this.accounts[mainIndex].balance += this.accounts[deleteIndex].balance;
    this.accountService.deleteAccount(this.accounts[deleteIndex].id).subscribe(
      () => {
        this.accounts.splice(deleteIndex, 1);
      }
    );
  }
}
