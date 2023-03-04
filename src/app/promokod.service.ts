import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PromokodService {
  constructor(public http: HttpClient) {}

  checkIfExistAndIfValid(kod: string) {
    return this.http.get<boolean>(`http://localhost:8080/promokod/${kod}`);
  }
}
