import { Injectable } from '@angular/core';
import {Rezervacija} from './model/rezervacija.model';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RezervacijaService {

  constructor(public http:HttpClient) { }
  //sacuvaj rezervaciju
  createTodo(rezervacija:any){
    return this.http.post(
     'http://localhost:8080/rezervacije', rezervacija);
  }

}
