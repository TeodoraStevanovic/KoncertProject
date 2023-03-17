import { Rezervacija } from './rezervacija.model';
import { Zona } from './zona.model';

export class RequestRezervacijaZona {
  constructor(public rezervacija: Rezervacija, public zona: Zona) {}
}
