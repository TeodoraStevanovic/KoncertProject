import { Koncert } from './koncert.model';
import { ZonaPK } from './ZonaPK.model';

export class Zona {
  constructor(
    public zonaPK: ZonaPK,
    public naziv: string,
    public kapacitet: number,
    public cena: number,
    public preostaoBrKarata: number,

    public koncert: Koncert
  ) {}
}
