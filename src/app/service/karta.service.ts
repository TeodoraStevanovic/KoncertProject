import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Karta } from '../model/karta.model';

@Injectable({
  providedIn: 'root',
})
export class KartaService {
  constructor(public http: HttpClient) {}

  retrieveAllKarte() {
    return this.http.get<Karta[]>('http://localhost:8080/api/karte');
  }
}
