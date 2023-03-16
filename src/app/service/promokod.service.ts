import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PromokodService {
  constructor(public http: HttpClient) {}

  checkIfExistAndIfValid(kod: string) {
    return this.http.get<boolean>(`http://localhost:8080/api/promokod/${kod}`);
  }

  ponistiPromokod(id: number, token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ID: '002',
      'Access-Control-Allow-Origin': '*',
    });
    const requestOptions = { headers: headers };
    return this.http.put(
      `http://localhost:8080/api/promokod/${id}`,
      requestOptions
    );
  }
}
