import { Zona } from './zona.model';
import { Koncert } from './koncert.model';
import { Rezervacija } from './rezervacija.model';

export class Karta {
  constructor(
    public idkarta: number,
    zona: Zona,
    koncert: Koncert,
    rezervacija: Rezervacija
  ) {}
}
