export class Account {
  accountName: string;
  accountNumber: string;
  balance: number;
  currency: string;
  id: string;
  userId: string;

  constructor(accountName: string, accountNumber: string, balance: number, currency: string, id: string, userId: string) {
    this.accountName = accountName;
    this.accountNumber = accountNumber;
    this.balance = balance;
    this.currency = currency;
    this.id = id;
    this.userId = userId;
  }

}
