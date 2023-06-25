export class User {
  dateOfBirth: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  personalId: string;
  phoneNumber: string;
  role: string;
  id: string;

  constructor(dateOfBirth: string,
              email: string,
              firstName: string,
              lastName: string,
              password: string,
              personalId: string,
              phoneNumber: string,
              role: string,
              id: string) {
    this.dateOfBirth = dateOfBirth;
    this.email = email;
    this.firstName = firstName
    this.lastName = lastName;
    this.password = password;
    this.personalId = personalId;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.id = id;
  }
}
