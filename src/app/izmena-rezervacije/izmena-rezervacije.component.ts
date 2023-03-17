import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Zona } from '../model/zona.model';
import { ZonaPK } from '../model/ZonaPK.model';
import { Koncert } from '../model/koncert.model';
import { Rezervacija } from '../model/rezervacija.model';
import { Korisnik } from '../model/korisnik.model';
import { Karta } from '../model/karta.model';
import { MatDialog } from '@angular/material/dialog';
import { RezervacijaService } from '../service/rezervacija.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ZonaService } from '../service/zona.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { RequestRezervacijaZona } from '../model/RequestRezervacijaZona';
import { Location } from '@angular/common';

@Component({
  selector: 'app-izmena-rezervacije',
  templateUrl: './izmena-rezervacije.component.html',
  styleUrls: ['./izmena-rezervacije.component.css'],
})
export class IzmenaRezervacijeComponent implements OnInit {
  prethodnaCenaBezPopusta: number = 0;
  panelOpenState = false;
  zona: Zona = new Zona(
    new ZonaPK(-1, -1),
    '',
    0,
    0,
    0,
    new Koncert(-1, new Date(), '', '', '')
  );
  token: string = '';
  rezervacija: Rezervacija = new Rezervacija(
    -1,
    new Date(),
    new Korisnik(-1, '', '', '', '', '', '', '', '', '', ''),
    0,
    0
  );
  karte: Array<Karta> = [];
  sub: Subscription;
  @Input() dodajBrojKarata: number = 0;
  slobodanBrojKarti: number = 0;
  poruka: string = 'nepoznato';
  primenjenEarlyBird: boolean = false;
  primenjenKupon: boolean = false;
  constructor(
    private location: Location,
    public dialog: MatDialog,
    private rezervacijaService: RezervacijaService,
    private zonaService: ZonaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.sub = this.activatedRoute.queryParams.subscribe((params) => {
      if (params['rezervacija'] == undefined) {
        this.router.navigate(['mojeRezervacije']);
      }
      this.rezervacija = JSON.parse(params['rezervacija']);
      this.token = params['token'];
      this.karte = JSON.parse(params['karte']);
      this.zona = JSON.parse(params['zona']);
      console.log(this.token, this.rezervacija.ukupno);
    });
  }

  ngOnInit(): void {
    this.location.replaceState('/izmenaRezervacije');
  }

  onKey(value: string) {
    this.dodajBrojKarata = +value;
    if (this.dodajBrojKarata > -1 && this.dodajBrojKarata != 0) {
      this.proveriBrojSlobodnihKarti();
    }
  }
  // @ts-ignore

  DodajKarteNaRezervaciju() {
    if (this.poruka == 'ima') {
      // obracunavanje popusta
      this.izracunajPonovoUkupnuCenu();
      //i posalji zahtev da se to sacuva u bazi
      let rezervacijaZona = new RequestRezervacijaZona(
        this.rezervacija,
        this.zona
      );
      this.rezervacijaService
        .updateReservation(rezervacijaZona, this.token)
        .subscribe(() => {
          console.log('Izmena je uspesno izvrsena!');
          this.router.navigate(['mojeRezervacije']);
        });
    } else {
      //vidi da li treba nes u ovom slucaju
    }
  }

  private proveriBrojSlobodnihKarti() {
    this.zonaService
      .returnBrojSlobodnihKartiUZoni(this.zona.zonaPK.idzona)
      .subscribe((response) => {
        if (response - this.dodajBrojKarata >= 0) {
          this.slobodanBrojKarti = response - this.dodajBrojKarata;
          this.poruka = 'ima';
        } else {
          this.slobodanBrojKarti = response;
          this.poruka =
            'Nema dovoljno karti u ovoj zoni, ostalo je jos: ' +
            this.slobodanBrojKarti +
            '. Rezervisite manje karti!';
        }
      });
  }

  private izracunajPonovoUkupnuCenu() {
    this.izracunajPopuste();
    let ukupanBrojKarti;
    ukupanBrojKarti = this.rezervacija.brojKarata + this.dodajBrojKarata;
    let ukupno = 0;
    //prvo da li treba popust na svaku petu

    if (ukupanBrojKarti > 4) {
      let karte: number[] = new Array(ukupanBrojKarti);
      let karteSaUmanjenomCenom: number[];
      for (let i = 0; i < karte.length; i++) {
        karte[i] = this.zona.cena;
      }
      karteSaUmanjenomCenom = this.getEvery5th(karte);
      for (let i = 0; i < karteSaUmanjenomCenom.length; i++) {
        ukupno = ukupno + karteSaUmanjenomCenom[i];
      }
      console.log(ukupno + ' ako je primenjen popust na svaki peti');
    } else {
      ukupno = ukupanBrojKarti * this.zona.cena;
      console.log(ukupno + ' ako ne treba primeniti popust na svaki peti ');
    }

    if (this.primenjenEarlyBird == true) {
      ukupno = ukupno * 0.9;
      console.log(ukupno + ' nako primenjenog early birda');
    }
    if (this.primenjenKupon == true) {
      ukupno = ukupno * 0.95;
      console.log(ukupno + ' nako primenjenog kupona');
    }
    //sada su primenjeni svi popusti koji treba da se primene
    console.log(ukupno + ' na kraju metode');
    //treba promeniti na rezervaciji ukupan broj karti i ukupnu cenu
    this.rezervacija.ukupno = ukupno;
    this.rezervacija.brojKarata = ukupanBrojKarti;
  }

  private izracunajPopuste() {
    this.primenjenEarlyBird = false;
    this.primenjenKupon = false;
    //
    let broj = this.rezervacija.brojKarata;
    if (broj > 4) {
      let karte: number[] = new Array(broj);
      let karteUmanjenaCena: number[];
      for (let i = 0; i < karte.length; i++) {
        karte[i] = this.zona.cena;
      }
      karteUmanjenaCena = this.getEvery5th(karte);
      for (let i = 0; i < karteUmanjenaCena.length; i++) {
        this.prethodnaCenaBezPopusta =
          this.prethodnaCenaBezPopusta + karteUmanjenaCena[i];
      }
    } else {
      this.prethodnaCenaBezPopusta =
        this.zona.cena * this.rezervacija.brojKarata;
    }

    let popust = this.prethodnaCenaBezPopusta - this.rezervacija.ukupno;
    console.log(this.prethodnaCenaBezPopusta);

    if (this.prethodnaCenaBezPopusta / popust > 10) {
      this.primenjenKupon = true;
      this.primenjenEarlyBird = true;
    } else {
      if (this.prethodnaCenaBezPopusta / popust == 10) {
        this.primenjenKupon = false;
        this.primenjenEarlyBird = true;
      } else {
        if (this.prethodnaCenaBezPopusta / popust == 5) {
          this.primenjenKupon = true;
          this.primenjenEarlyBird = false;
        }
      }
    }
    console.log(this.primenjenEarlyBird, this.primenjenKupon);
  }

  public getEvery5th(arr: number[]) {
    let result = arr;

    for (let index = 0; index < arr.length; index++) {
      if ((index + 1) % 5 == 0) {
        result[index] = result[index] * 0.5;
      }
    }
    return result;
  }
}
