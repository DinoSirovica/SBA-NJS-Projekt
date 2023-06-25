import {Component} from '@angular/core';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  protected readonly sessionStorage = sessionStorage;

  constructor(private userService: UserService) {
  }

  getFromDB() {
    this.userService.getUsers().subscribe({
      next: user => {
        console.log(user[2].id)
      },
      error: err => {
        console.log(err)
      }
    });
  }

}
