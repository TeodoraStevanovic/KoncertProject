import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class RezervacijaService {
  constructor(public http: HttpClient) {}
  //sacuvaj rezervaciju
  createReservation(rezervacija: any) {
    return this.http.post('http://localhost:8080/rezervacije', rezervacija);
  }

  createReservationWithCards(rezervacija: any, selectedZona: number) {
    return this.http.post(
      `http://localhost:8080/rezervacije/${selectedZona}`,
      rezervacija
    );
  }
  createReservationWithCardsPromoCode(
    rezervacija: any,
    selectedZona: number,
    promokod: any
  ) {
    return this.http.post(
      `http://localhost:8080/rezervacije/${selectedZona}/${promokod}`,
      rezervacija,
      promokod
    );
  }
}
