export class Payment {
  senderAccountNumber: string;
  reciverAccountNumber: string;
  amount: number;
  id: string;
  description: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  date: string;


  constructor(senderAccountNumber: string, reciverAccountNumber: string, amount: number, id: string, description: string, senderId: string,
              receiverId: string, senderName: string, receiverName: string, date: string) {
    this.senderAccountNumber = senderAccountNumber;
    this.reciverAccountNumber = reciverAccountNumber;
    this.amount = amount;
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.senderName = senderName;
    this.receiverName = receiverName;
    this.date = date;
    this.description = description;
  }
}

export class Payout {

  senderAccountNumber: string;
  reciverAccountNumber: string;
  amount: number;
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  date: string;
  description: string;


  constructor(senderAccountNumber: string, reciverAccountNumber: string, amount: number, id: string, description: string,
              senderId: string, receiverId: string, senderName: string, receiverName: string, date: string) {
    this.senderAccountNumber = senderAccountNumber;
    this.reciverAccountNumber = reciverAccountNumber;
    this.amount = amount;
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.senderName = senderName;
    this.receiverName = receiverName;
    this.date = date;
    this.description = description;
  }
}
