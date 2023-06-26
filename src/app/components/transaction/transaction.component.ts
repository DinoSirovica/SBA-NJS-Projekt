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
  search: string = '';
  newSearch: string = '';

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
  getPaymentText(payment: Payment){
    return "Payment recived from <b>"+payment.senderName + " - " + payment.senderAccountNumber +
    "</b> to your account " + payment.receiverName + " - " + payment.reciverAccountNumber + " on day " +
    this.getDateFromString(payment.date) + " at " + this.getTimeFromString(payment.date) + " with description: " + payment.description;
  }
  getPayoutText(payout: Payout) {

    return "Payout from your account "+payout.senderName + " - " + payout.senderAccountNumber + " to account <b>" +
      payout.reciverAccountNumber + " owned by " + payout.receiverName + "</b> on day " + this.getDateFromString(payout.date) +
      " at " + this.getTimeFromString(payout.date) + " with description: " + payout.description;
  }
  searchTransaction(){
    if(this.newSearch.length == 0){
      this.ngOnInit();
    }
    else {
      if(this.search.length > this.newSearch.length){
        this.ngOnInit();
        this.search = this.newSearch;
      }
      else{
        this.search = this.newSearch;
        this.payouts = this.payouts.filter(p => this.getPayoutText(p).toLowerCase().includes(this.newSearch.toLowerCase()));
        this.payments = this.payments.filter(p => this.getPaymentText(p).toLowerCase().includes(this.newSearch.toLowerCase()));
      }
    }
  }
}
