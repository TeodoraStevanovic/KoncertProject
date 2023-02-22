import {Koncert} from "./koncert.model";

export class Zona {

  constructor(
    public idzona:number,
    public  naziv:string,
    public kapacitet:number,
    public  cena:number,
    public  preostaoBrKarata:number,

    public  koncert:Koncert
  ) {
  }

}
