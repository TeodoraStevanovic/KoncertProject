import { Korisnik } from './korisnik.model';
import { Rezervacija } from './rezervacija.model';
import { Karta } from './karta.model';
import { Zona } from './zona.model';

export class ResponseRezervacijaKarte {
  constructor(
    public rezervacija: Rezervacija,
    public karte: Array<Karta>,
    public zona: Zona
  ) {}
}
