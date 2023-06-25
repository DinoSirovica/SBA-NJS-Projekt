import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, map} from "rxjs";
import {Card} from "../models/card.model";

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) {
  }

  createCard(userId: string) {
    let cardNumber;
    do {
      cardNumber = Math.floor(Math.random() * 9000000000000000) + 1000000000000000;
    }
    while (this.checkIfCardNumExists(cardNumber));
    const cvv = Math.floor(Math.random() * 900) + 100;
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getFullYear() + 5, currentDate.getMonth(), currentDate.getDate());

    const card = {
      cardNumber: cardNumber,
      cvv: cvv,
      expirationYear: expirationDate.getFullYear().toString(),
      expirationMonth: expirationDate.getMonth().toString(),
      userId: userId,
      type: "long term"
    };
    return this.http.post('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/cards.json', card).pipe(
      map((res: any) => {
          return {...card, id: res.name};
        }
      ));
  }

  getCards() {
    const cardsUrl = 'https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/cards.json';
    const tempCardsUrl = 'https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/tempcards.json';

    return forkJoin([
      this.http.get<CardResponse>(cardsUrl),
      this.http.get<CardResponse>(tempCardsUrl)
    ]).pipe(
      map(([cardsRes, tempCardsRes]) => {
        const cards = [];

        for (let key in cardsRes) {
          cards.push({...cardsRes[key], id: key});
        }

        for (let key in tempCardsRes) {
          cards.push({...tempCardsRes[key], id: key});
        }

        return cards;
      })
    );
  }

  checkIfCardNumExists(cardNumber: number): boolean {
    let cardNumbers: string[] = [];
    this.getCards().subscribe({
      next: card => {
        card.forEach((c: Card) => {
          cardNumbers.push(c.cardNumber);
        });
      },
      error: err => {
        console.log(err)
      }
    });

    return cardNumbers.includes(cardNumbers.toString());
  }

  getCardsForUser(userId: string): any {
    let userCards: Card[] = [];
    this.getCards().subscribe({
      next: cards => {
        cards.forEach((c: Card) => {
          if (c.userId === userId) {
            userCards.push(c);
          }
        });
      },
      error: err => {
        console.log(err)
      }
    });
    return userCards;
  }

  generateTempCard(userId: string) {
    let tempCardNumber;
    do {
      tempCardNumber = Math.floor(Math.random() * 9000000000000000) + 1000000000000000;
    }
    while (this.checkIfCardNumExists(tempCardNumber));
    const cvv = Math.floor(Math.random() * 900) + 100;
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getFullYear() + 5, currentDate.getMonth(), currentDate.getDate());

    const card = {
      cardNumber: tempCardNumber,
      cvv: cvv,
      expirationYear: expirationDate.getFullYear().toString(),
      expirationMonth: expirationDate.getMonth().toString(),
      userId: userId,
      type: "temporary"
    };
    return this.http.post('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/tempcards.json', card).pipe(
      map((res: any) => {
          return {...card, id: res.name};
        }
      ));
  }

  deleteCard(cardNumber: string) {
    return this.http.delete('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/tempcards/' + cardNumber + '.json');
  }

  deleteAllCards(cardNumber: string, cartType: string) {
    if (cartType == "long term")
      return this.http.delete('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/cards/' + cardNumber + '.json');
    else
      return this.http.delete('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/tempcards/' + cardNumber + '.json');
  }

  getIndex(cardNumber: string) {
    return this.getCards().subscribe({
      next: cards => {
        // @ts-ignore
        cards.forEach((c: Card, i) => {
          if (c.cardNumber == cardNumber) {
            return i;
          }
        });
      }
    });
  }
}

interface CardResponse {
  [key: string]: any;
}
