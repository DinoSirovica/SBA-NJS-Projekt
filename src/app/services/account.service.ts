import {Injectable} from '@angular/core';
import {Account} from "../models/account.model";
import {Payment, Payout} from "../models/transaction.model";
import {map} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private http: HttpClient, private router:Router) {
  }

  createAccount(userId: string, accountName: string) {
    let accNum;
    do {
      accNum = Math.floor(Math.random() * 900000000000000000000) + 100000000000000000000;
    }
    while (this.checkIfAccNUmExists(accNum));
    console.log("accNum", accNum);
    const account = {
      accountName: accountName,
      accountNumber: accNum,
      balance: 0,
      currency: "EUR",
      userId: userId
    };
    console.log("account", account);
    return this.http.post('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/accounts.json', {...account}).pipe(
      map((res: any) => {
          return {...account, id: res.name};
        }
      ));
  }

  getAccountsForUser(userId: string) {
    return this.http.get('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/accounts.json')
      .pipe(map((res: any) => {
        const accounts = [];
        for (let key in res) {
          if (res[key].userId === userId) {
            accounts.push({...res[key], id: key});
          }
        }
        return accounts;
      }));
  }

  getAccounts() {
    return this.http.get('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/accounts.json')
      .pipe(map((res: any) => {
        const accounts = [];
        for (let key in res) {
          accounts.push({...res[key], id: key});
        }
        return accounts;
      }));
  }

  checkIfAccNUmExists(accNum: number): boolean {
    let accNums: string[] = [];
    this.getAccounts().subscribe({
      next: acc => {
        acc.forEach((a: Account) => {
          accNums.push(a.accountNumber);
        });
      },
      error: err => {
        console.log(err)
      }
    });

    return accNums.includes(accNum.toString());
  }

  deleteAccount(accountId: string) {
    return this.http.delete('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/accounts/' + accountId + '.json');
  }

  makeTransactions(information: {
    date: string;
    amount: any;
    senderName: string;
    senderId: string | undefined;
    receiverId: string;
    receiverName: string;
    description: any;
    accountNumber: any;
    senderAccountNumber: any
  }) {
    const senderAccNum = information['senderAccountNumber'];
    const receiverAccNum = information['accountNumber'];
    const amount = information['amount'];
    const description = information['description'];
    const senderName = information['senderName'];
    const receiverName = information['receiverName'];
    const senderId = information['senderId'];
    const receiverId = information['receiverId'];
    const date = information['date'];
    if (senderId) {
      console.log("senderId", senderId);
      const payment: Payment = new Payment(senderAccNum, receiverAccNum, amount, "", description, senderId, receiverId, senderName, receiverName, date);
      const payout: Payout = new Payout(senderAccNum, receiverAccNum, amount, "", description, senderId, receiverId, senderName, receiverName, date);

      this.getAccountsForUser(senderId).subscribe({
        next: acc => {
          acc.forEach((a: Account) => {
            if (a.accountNumber == senderAccNum) {
              a.balance -= amount;
              this.http.put('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/accounts/' + a.id + '.json', {...a}).subscribe();
            }
          });
        }
      });
      this.getAccountsForUser(receiverId).subscribe({
        next: acc => {
          console.log("a", acc);
          console.log("r", receiverAccNum);
          acc.forEach((a: Account) => {
            if (a.accountNumber == receiverAccNum) {
              a.balance += amount;
              this.http.put('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/accounts/' + a.id + '.json', {...a}).subscribe();
            }
          });
        }
      });

      this.http.post('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/payments.json', {...payment}).subscribe();
      this.http.post('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/payouts.json', {...payout}).subscribe(
        () => {
          this.router.navigate(['/account']);
        }
      );
    }
  }

  getPayments() {
    return this.http.get('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/payments.json')
      .pipe(map((res: any) => {
        const payments = [];
        for (let key in res) {
          payments.push({...res[key], id: key});
        }
        return payments;
      }));
  }

  getPayouts() {
    return this.http.get('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/payouts.json')
      .pipe(map((res: any) => {
        const payouts = [];
        for (let key in res) {
          payouts.push({...res[key], id: key});
        }
        return payouts;
      }));
  }

  deletePayment(id: string) {
    return this.http.delete('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/payments/' + id + '.json').pipe(
      map((res: any) => {
        return {...res, id: id};
      }));
  }

  deletePayout(id: string) {
    return this.http.delete('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/payouts/' + id + '.json').pipe(
      map((res: any) => {
        return {...res, id: id};
      })
    );
  }
}
