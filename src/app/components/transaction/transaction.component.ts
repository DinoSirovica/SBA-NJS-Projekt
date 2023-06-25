import {Component, OnInit} from '@angular/core';
import {Payment, Payout} from "../../models/transaction.model";
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  payments: Payment[] = [];
  payouts: Payout[] = [];
  isPayouts: boolean = false;
  isAdmin = false;
  protected readonly console = console;
  protected readonly Date = Date;

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    const user = sessionStorage.getItem('user');
    this.isAdmin = sessionStorage.getItem('admin') === 'true';
    if (user != null) {
      this.accountService.getPayments().subscribe({
        next: payments => {
          this.payments = payments;
          if (!this.isAdmin)
            this.payments = this.payments.filter(p => p.receiverId == JSON.parse(user).id);
        },
        error: err => {
          console.log(err);
        }
      });

      this.accountService.getPayouts().subscribe({
        next: payouts => {
          this.payouts = payouts;
          if (!this.isAdmin)
            this.payouts = this.payouts.filter(p => p.senderId == JSON.parse(user).id)
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

  changeStatus() {
    this.isPayouts = !this.isPayouts;

  }

  getDateFromString(date: string) {
    return new Date(date).toDateString();
  }

  getTimeFromString(date: string) {
    return new Date(date).toLocaleTimeString();
  }

  deletePayment(id: string) {
    this.accountService.deletePayment(id).subscribe({
      next: () => {
        this.payments = this.payments.filter(p => p.id != id);
      }
    });
  }

  deletePayout(id: string) {
    this.accountService.deletePayout(id).subscribe({
      next: () => {
        this.payouts = this.payouts.filter(p => p.id != id);
      }
    });
  }
}
