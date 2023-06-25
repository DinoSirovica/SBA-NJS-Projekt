import {Component, OnInit} from '@angular/core';
import {CardService} from "../../services/card.service";
import {Card} from "../../models/card.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  cards: Card[] = [];

  constructor(private cardService: CardService, private router: Router) {
  }

  ngOnInit() {
    const user = sessionStorage.getItem('user');
    if (user != null) {
      this.cards = this.cardService.getCardsForUser(JSON.parse(user).id);
      console.log(this.cards);
    }
  }

  generateTempCard() {
    let tempCounter = 0
    this.cards.forEach(card => {
      if (card.type === 'temporary')
        tempCounter++;
    })
    console.log(tempCounter);
    if (tempCounter < 3) {
      const user = sessionStorage.getItem('user');
      if (user != null) {
        this.cardService.generateTempCard(JSON.parse(user).id).subscribe(
          (res: any) => {
            const card = new Card(res.cardNumber, res.cvv, res.expirationYear, res.expirationMonth, res.type, res.userId);
            this.cards.push(card);
          }
        );
      }
    } else {
      alert("You already have 3 temporary cards!");
    }

  }

  deleteCard(card: Card) {
    console.log(card.id);
    this.cardService.deleteCard(card.id).subscribe(
      (res) => {
        this.cards = this.cards.filter(obj => obj !== card);
      }
    );
  }
}
