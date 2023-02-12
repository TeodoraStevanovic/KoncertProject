export class Koncert {

  constructor(
    public _id:number,
    public _datum: Date,
              public _grad:string,
              public _lokacija: string,
              public _nazivKoncerta: string,
              public _dodatneInformacije: string) {
  }


  get datum(): Date {
    return this._datum;
  }

  set datum(value: Date) {
    this._datum = value;
  }

  get grad(): string {
    return this._grad;
  }

  set grad(value: string) {
    this._grad = value;
  }

  get lokacija(): string {
    return this._lokacija;
  }

  set lokacija(value: string) {
    this._lokacija = value;
  }

  get nazivKoncerta(): string {
    return this._nazivKoncerta;
  }

  set nazivKoncerta(value: string) {
    this._nazivKoncerta = value;
  }

  get dodatneInformacije(): string {
    return this._dodatneInformacije;
  }

  set dodatneInformacije(value: string) {
    this._dodatneInformacije = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }
}
