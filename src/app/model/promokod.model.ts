import { Korisnik } from './korisnik.model';
import { Rezervacija } from './rezervacija.model';

export class Promokod {
  constructor(
    public idpromokod: number,
    public kod: string,
    public iskoriscen: number,
    public upotrebljiv: number,
    public Korisnik: Korisnik,
    public Rezervacija: Rezervacija
  ) {}
}
