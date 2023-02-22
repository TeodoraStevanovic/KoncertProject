import { Injectable } from '@angular/core';
import {Koncert} from './model/koncert.model';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, take, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class KoncertService {

  constructor(public http: HttpClient) { }


  retrieveAllKoncerte() {
      return this.http.get<Koncert[]>('http://localhost:8080/koncerti');
      //console.log("Execute Hello World Bean Service")
    }
  retrieveKoncert(id: number){
    return this.http.get<Koncert>(`http://localhost:8080/koncerti/${id}`);
    console.log(id+"ovo je id");
  }
}
