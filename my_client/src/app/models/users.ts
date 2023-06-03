export class User{
    phone: string;
    pass: string;
    username: string;
    useremail: string;
    address: string;
    unique_id: string;
    image: string;
  public _id: any;
    // salt:string;
    constructor(){
        this.phone="";
        this.pass="";
        this.username="";
        this.useremail="";
        this.address="";
        this.unique_id="";
        this.image="";
        // this.salt="";
    }
}
