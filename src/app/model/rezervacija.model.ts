import { Korisnik } from './korisnik.model';

export class Rezervacija {
  constructor(
    public idrezervacija: number,
    public placedAt: Date,

    public korisnik: Korisnik,
    public brojKarata: number,
    public ukupno: number
  ) {}
}
