import { Injectable } from '@angular/core';
import { Koncert } from '../model/koncert.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class KoncertService {
  constructor(public http: HttpClient) {}

  retrieveAllKoncerte() {
    return this.http.get<Koncert[]>('http://localhost:8080/api/koncerti');
  }
  retrieveKoncert(id: number) {
    return this.http.get<Koncert>(`http://localhost:8080/api/koncerti/${id}`);
  }
}
