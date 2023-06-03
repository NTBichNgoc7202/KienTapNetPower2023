export class Product {
  _id: any;
  name: string;
  categoryId: string;
  price: number;
  note: string;
  quantity: number;
  image: string;
  createdAt: string;
  modifiedAt: string;
  description: string;
  constructor() {
    this._id = '';
    this.name = '';
    this.price = 0;
    this.note = '';
    this.categoryId = '';
    this.quantity = 1;
    this.image = '';
    this.createdAt = '';
    this.modifiedAt = '';
    this.description = '';
  }
}
