import {Korisnik} from "./korisnik.model";
import {Karta} from "./karta.model";

export class Rezervacija {

  constructor(
    public idrezervacija:number,
    public placedAt: Date,

    public korisnik:Korisnik,
    public karta:Karta
  ) {
  }

}
