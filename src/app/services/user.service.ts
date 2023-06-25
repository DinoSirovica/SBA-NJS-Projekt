import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SHA256} from "crypto-js";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  addUser(userForm: any) {
    const encryptedPassword = this.encryptPassword(userForm.get('password')?.value);
    let newUser = {
      dateOfBirth: userForm.get('dateOfBirth')?.value,
      email: userForm.get('email')?.value,
      firstName: userForm.get('firstName')?.value,
      lastName: userForm.get('lastName')?.value,
      password: encryptedPassword,
      personalId: userForm.get('personalId')?.value,
      phoneNumber: userForm.get('phoneNumber')?.value,
      role: 'USER'
    }
    return this.http.post('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/users.json', newUser).pipe(
      map((res: any) => {
          return {...newUser, id: res.name};
        }
      ));
  }

  getUsers() {
    return this.http.get('https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/users.json')
      .pipe(map((res: any) => {
        const users = [];
        for (let key in res) {
          users.push({...res[key], id: key});
        }
        return users;
      }));
  }

  getUser(id: string) {
    return this.http.get(`https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`)
      .pipe(map((res: any) => {
        return {...res, id};
      }));
  }

  encryptPassword(password: string) {
    return SHA256(password).toString()
  }

  deleteUser(id: string) {
    return this.http.delete(`https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`);
  }

  changeUserRole(id: string, role: string) {
    return this.http.patch(`https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`, {role});
  }

  updateUser(id: string, temp: {
    firstName: string;
    lastName: string;
    personalId: string;
    phoneNumber: string;
    dateOfBirth: string
  }) {
    return this.http.patch(`https://njs-projekt-sba-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`, temp).pipe(
      map((res: any) => {
        return {...res, id};
      })
    );
  }
}
