export class Order {
  _id: any;
  username: string;
  totalPrice: number;
  phone: string;
  address: string;
  payment: string;
  unique_id: string;
  createdAt: string;
  modifiedAt: string;

  constructor() {
      this.username = "";
      this.phone = "";
      this.totalPrice = 0;
      this.address = "";
      this.payment ="";
      this.unique_id = "";
      this.createdAt = "";
      this.modifiedAt = "";

  }
}
