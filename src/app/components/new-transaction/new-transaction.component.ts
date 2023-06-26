import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "../../services/account.service";
import {Account} from "../../models/account.model";
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";


@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {
  transactionForm!: FormGroup;
  accounts: Account[] = [];
  user: User | undefined;
  selectedAccNumber: string | undefined;
  errorMessages: string = ''

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private accountService: AccountService,
              private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.transactionForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(0), this.numericValidator]],
      description: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.minLength(21), Validators.maxLength(21), this.numericValidator]],
      senderAccountNumber: ['', [Validators.required, Validators.minLength(21), Validators.maxLength(21), this.numericValidator]],
    });
    const user = sessionStorage.getItem('user');
    if (user != null) {
      this.user = new User(
        JSON.parse(user).dateOfBirth, JSON.parse(user).email, JSON.parse(user).firstName,
        JSON.parse(user).lastName, JSON.parse(user).password, JSON.parse(user).personalId, JSON.parse(user).phoneNumber, JSON.parse(user).role, JSON.parse(user).id,);
      this.accountService.getAccountsForUser(JSON.parse(user).id).subscribe((res: Account[]) => {
        this.accounts = res;
        this.selectedAccNumber = this.route.snapshot.params['accountId'];
        if (this.selectedAccNumber) {
          if (this.selectedAccNumber.length === 21)
            this.transactionForm.controls['senderAccountNumber'].setValue(this.selectedAccNumber);
        }
      });
    }
  }

  numericValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    if (isNaN(value)) {
      return {'numeric': true};
    }
    return null;
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const amount = this.transactionForm.get('amount')?.value;
      const accNum = this.transactionForm.get('accountNumber')?.value;
      const holderName = this.transactionForm.get('accountHolderName')?.value;
      const senderAccNum = this.transactionForm.get('senderAccountNumber')?.value;
      if (this.selectedAccNumber) {
        const onAccountBalance = this.accounts.find(x => x.accountNumber == this.selectedAccNumber)?.balance;
        if (this.isValidSenderAccountNumber(senderAccNum, this.accounts)) {
        if (onAccountBalance) {
          if (amount <= onAccountBalance) {
            this.accountService.getAccounts().subscribe(
              (res: Account[]) => {
                const account = res.find(a => a.accountNumber == accNum);
                if (account) {
                  this.userService.getUser(account.userId).subscribe(
                    (res: User) => {
                      if (((res.firstName + res.lastName).replace(/\s+/g, '')) == (holderName.replace(/\s+/g, ''))) {
                        this.accountService.makeTransactions({
                          amount: amount,
                          description: this.transactionForm.get('description')?.value,
                          accountNumber: accNum,
                          senderAccountNumber: this.transactionForm.get('senderAccountNumber')?.value,
                          senderName: this.user?.firstName + ' ' + this.user?.lastName,
                          receiverName: res.firstName + ' ' + res.lastName,
                          senderId: this.user?.id,
                          receiverId: res.id,
                          date: new Date().toString(),
                        });
                      } else {
                        this.errorMessages = 'Account holder name does not match';
                        return;
                      }
                    }
                  );
                } else {
                  this.errorMessages = 'Account number does not exist';
                  return;
                }
              }
            );
          } else {
            this.errorMessages = 'Not enough money on account';
            return;
          }
        } else {
          this.errorMessages = 'Not enough money on account';
          return;
        }
      }
        else {
          this.errorMessages = 'Sender account number is invalid';
          return;
        }
      }
    }

  }

  isValidSenderAccountNumber(senderAccNum: any, accounts: Account[]) {
    console.log(senderAccNum);
    const account = accounts.find(x => x.accountNumber == senderAccNum);
    console.log(account);
    return !!account;
  }
}

