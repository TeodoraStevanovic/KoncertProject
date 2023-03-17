import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseRezervacijaKarte } from '../model/responseRezervacijaKarte';
import { Rezervacija } from '../model/rezervacija.model';
import { Zona } from '../model/zona.model';
import { RequestRezervacijaZona } from '../model/RequestRezervacijaZona';
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
      `http://localhost:8080/api/rezervacije/${selectedZona}/${promokod}`,
      rezervacija,
      promokod
    );
  }

  findRezervacija(email: string, token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ID: '001',
      'Access-Control-Allow-Origin': '*',
    });
    const requestOptions = { headers: headers };
    return this.http.get<ResponseRezervacijaKarte>(
      `http://localhost:8080/auth/rezervacija/${token}/${email}`,
      requestOptions
    );
  }

  deleteReservation(id: number, token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ID: '001',
      'Access-Control-Allow-Origin': '*',
    });
    const requestOptions = { headers: headers };
    return this.http.delete(
      `http://localhost:8080/auth/rezervacija/${id}`,
      requestOptions
    );
  }

  updateReservation(rezervacijaZona: RequestRezervacijaZona, token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ID: '002',
      'Access-Control-Allow-Origin': '*',
    });
    const requestOptions = { headers: headers };
    return this.http.put(
      `http://localhost:8080/auth/rezervacija`,
      rezervacijaZona,
      requestOptions
    );
  }
}
