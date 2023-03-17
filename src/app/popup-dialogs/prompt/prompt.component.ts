import { Component, Inject, OnInit } from '@angular/core';
import { RezervacijaService } from '../../service/rezervacija.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MojeRezervacijeComponent,
  PromptData,
} from '../../moje-rezervacije/moje-rezervacije.component';
import { PromokodService } from '../../service/promokod.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.css'],
})
export class PromptComponent implements OnInit {
  constructor(
    private rezervacijaService: RezervacijaService,
    private promokodService: PromokodService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: PromptData
  ) {}

  ngOnInit(): void {}

  ObrisiRezervaciju(idRezervacija: number, token: string) {
    console.log('Brisanje rezervacije...');
    this.promokodService
      .ponistiPromokod(idRezervacija, token)
      .subscribe(() => {});

    this.rezervacijaService
      .deleteReservation(idRezervacija, token)
      .subscribe(() => {});

    //sta nakon toga treba uraditi na stranicii
    window.location.reload();
  }
}
