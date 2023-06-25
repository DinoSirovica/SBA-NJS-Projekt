export class Card {
  cardNumber: string;
  cvv: number;
  expirationYear: string;
  expirationMonth: string;
  type: string;
  userId: string;
  id: string;


  constructor(cardNumber: string, cvv: number, expirationYear: string, expirationMonth: string, type: string, userId: string) {
    this.cardNumber = cardNumber;
    this.cvv = cvv;
    this.expirationYear = expirationYear;
    this.expirationMonth = expirationMonth;
    this.type = type;
    this.userId = userId;
    this.id = "";
  }
}
