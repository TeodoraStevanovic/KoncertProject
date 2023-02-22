import { Injectable } from '@angular/core';
import {Zona} from './model/zona.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {

  constructor(public http: HttpClient) { }

  retrieveAllZone() {
    return this.http.get<Zona[]>('http://localhost:8080/zone');
  }
  retrieveZona(id:number) {
    return this.http.get<Zona>(`http://localhost:8080/zone/${id}`);
  }
  retrieveAllZoneForKoncert(id:number) {
    return this.http.get<Zona[]>(`http://localhost:8080/koncerti/${id}/zone`);
  }
  returnBrojSlobodnihKartiUZoni(id:number){
    return this.http.get<number>(`http://localhost:8080/zone/${id}/slobodnaMesta`);
  }

}
