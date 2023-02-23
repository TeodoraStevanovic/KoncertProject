import { Component, Input, OnInit } from '@angular/core';
import { Koncert } from '../model/koncert.model';
import { NgForm } from '@angular/forms';
import { Zona } from '../model/zona.model';
import { KoncertService } from '../koncert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ZonaService } from '../zona.service';
import { Subscription } from 'rxjs';
import { RezervacijaService } from '../rezervacija.service';
import { Rezervacija } from '../model/rezervacija.model';
import { Korisnik } from '../model/korisnik.model';
import { KartaService } from '../karta.service';
import { ZonaPK } from '../model/ZonaPK.model';

@Component({
  selector: 'app-rezervacija',
  templateUrl: './rezervacija.component.html',
  styleUrls: ['./rezervacija.component.css'],
})
export class RezervacijaComponent implements OnInit {
  zone: Zona[] = []; //sluzi za ucitavanje padajuceg menija
  koncert: Koncert;
  zona: Zona; //da znamo koji je koncert izabran
  koncertId: number = -1; //da znamo id koncerta
  sub: Subscription;
  poruka: string = 'nepoznato';
  @Input() brojKarata: number = 0;
  @Input() selectedZona: number = -1;
  slobodanBrojKarti: number = 0;
  porukaDovoljnoKarti: string = 'nepoznato';
  porukaNijeSelektovanaZonaIBrojKarti: string = 'nepoznato';
  prikaziDeoZaInformacijeOKorisniku: boolean;
  prikaziDeoZaInformacijeOKartama: boolean;
  porukaKarta: string = 'karta';
  porukaEarlyBird: string = 'nepoznato';
  popust: number = 0;

  modelKorisnik = new Korisnik(-1, '', '', '', '', '', '', '', '', '', '');
  model = new Rezervacija(
    -1,
    new Date(),
    new Korisnik(-1, '', '', '', '', '', '', '', '', '', ''),
    0,
    0
  );

  constructor(
    private zonaService: ZonaService,
    private koncertService: KoncertService,
    private rezervacijaService: RezervacijaService,
    private kartaService: KartaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.sub = this.activatedRoute.queryParams.subscribe((params) => {
      this.koncertId = +params['id'];
    });
    this.prikaziDeoZaInformacijeOKartama = true;
    this.prikaziDeoZaInformacijeOKorisniku = false;
    this.koncert = new Koncert(this.koncertId, new Date(), '', '', '');
    this.zona = new Zona(
      new ZonaPK(this.selectedZona, this.koncertId),
      '',
      0,
      0,
      0,
      this.koncert
    );
  }

  ngOnInit(): void {
    this.getKoncert();
    this.populateDropDownZonaForKoncert();
  }

  private populateDropDownZonaForKoncert() {
    this.zonaService
      .retrieveAllZoneForKoncert(this.koncertId)
      .subscribe((response) => {
        if (response.length == 0) {
          this.poruka = 'TRENUTNO NEMA DOSTUPNIH KARTI ZA OVAJ KONCERT!';
        } else {
          this.zone = response;
        }
        console.log(response);
      });
  }

  private getKoncert() {
    //kad se otvori strana da odmah imamo id koncerta
    if (this.koncertId != -1) {
      this.koncertService
        .retrieveKoncert(this.koncertId)
        .subscribe((data) => (this.koncert = data));
    }
  }

  MakeRezervation(RezForm: NgForm) {
    this.emailValid(RezForm);
    console.log(RezForm);
    if (RezForm.valid) {
      this.modelKorisnik = this.model.korisnik;
      console.log(this.modelKorisnik);
      console.log(this.model);
      console.log(this.selectedZona);
      this.model.placedAt = new Date();
      this.model.brojKarata = this.brojKarata;
      this.rezervacijaService
        .createReservationWithCards(this.model, this.selectedZona)
        .subscribe(() => {
          console.log('Prijava je uspesno izvrsena!');
        });
    } else {
      console.log(RezForm);
    }
  }

  private proveriBrojSlobodnihKarti() {
    this.getZona();
    this.zonaService
      .returnBrojSlobodnihKartiUZoni(this.selectedZona)
      .subscribe((response) => {
        if (response - this.brojKarata >= 0) {
          this.slobodanBrojKarti = response - this.brojKarata;
          this.porukaDovoljnoKarti = 'ima';
        } else {
          this.slobodanBrojKarti = response;
          this.porukaDovoljnoKarti =
            'Nema dovoljno karti u ovoj zoni, ostalo je jos: ' +
            this.slobodanBrojKarti +
            '. Rezervisite manje karti ili odaberite drugu zonu!';
        }
      });
  }

  onKey(value: string) {
    this.brojKarata = +value;
    if (
      this.selectedZona != -1 &&
      this.brojKarata != -1 &&
      this.brojKarata != 0
    ) {
      if (this.brojKarata == 1) {
        this.porukaKarta = 'kartu';
      } else if (this.brojKarata < 5) {
        this.porukaKarta = 'karte';
      } else {
        this.porukaKarta = 'karti';
      }
      this.proveriBrojSlobodnihKarti();
    }
  }

  AddCardsToRezervation() {
    this.model.ukupno = 0;
    this.porukaEarlyBird = 'nepoznato';
    if (
      this.selectedZona == -1 &&
      (this.brojKarata == -1 || this.brojKarata == 0)
    ) {
      this.porukaNijeSelektovanaZonaIBrojKarti =
        'Selektujte zonu i upisite broj karti!!';
    } else if (
      this.selectedZona == -1 &&
      this.brojKarata != -1 &&
      this.brojKarata != 0
    ) {
      this.porukaNijeSelektovanaZonaIBrojKarti =
        'Selektujte zonu! Trenutno nije selektovana ni jedna zona!';
    } else if (this.brojKarata == -1 || this.brojKarata == 0) {
      this.porukaNijeSelektovanaZonaIBrojKarti =
        'Upisite broj karti koji zelite u ovoj zoni!';
    } else {
      this.porukaNijeSelektovanaZonaIBrojKarti = 'nepoznato';
      // this.proveriBrojSlobodnihKarti();

      if (this.porukaDovoljnoKarti == 'ima') {
        this.model.brojKarata = this.brojKarata;

        this.showNext();
        this.izracunajUkupnuVrednostRezervacije();
      } else {
        //ako dodje u ovaj slucaj prikazace se poruka i nista se nece desiti
        //this.goBack();
      }
    }
  }

  private showNext() {
    this.prikaziDeoZaInformacijeOKorisniku = true;
    this.prikaziDeoZaInformacijeOKartama = false;
  }

  goBack() {
    this.prikaziDeoZaInformacijeOKorisniku = false;
    this.prikaziDeoZaInformacijeOKartama = true;
  }

  private getZona() {
    if (this.selectedZona != -1) {
      this.zonaService.retrieveZona(this.selectedZona).subscribe((data) => {
        this.zona = data;
        //  console.log(data);
        //  console.log(this.zona);
      });
    }
  }

  getSelectedValue(idzona: number) {
    console.log('koristili smo ovo');
    this.selectedZona = idzona;
  }

  goToAllConcerts() {
    this.router.navigate(['home']);
  }

  private izracunajUkupnuVrednostRezervacije() {
    //this.model.ukupno = this.brojKarata * this.zona.cena;
    let broj = this.brojKarata;
    let karte: number[] = new Array(broj);
    let karteUmanjenaCena: number[];
    for (let i = 0; i < karte.length; i++) {
      karte[i] = this.zona.cena;
    }
    karteUmanjenaCena = this.getEvery5th(karte);
    for (let i = 0; i < karteUmanjenaCena.length; i++) {
      this.model.ukupno = this.model.ukupno + karteUmanjenaCena[i];
    }
    this.earlyBirdPopust();
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

  private earlyBirdPopust() {
    //early bird
    const earlyBirdDate = new Date('2023-04-01');

    if (this.model.placedAt <= earlyBirdDate) {
      this.popust = this.model.ukupno - this.model.ukupno * 0.9;
      this.model.ukupno = this.model.ukupno * 0.9;
      this.porukaEarlyBird = 'Ostvarili ste early bird popust od 10%';
    } else {
      console.log('nije ostvaren popust');
    }
  }
  ///
  emailValid(form: NgForm) {
    let potvrda = form.value.potvrdaemail;
    if (this.model.korisnik.email != potvrda) {
      form.form.controls['potvrdaemail'].setErrors({ incorrect: false });
      //  formData.form.controls['email'].setErrors({ incorrect: true });
    } else {
      form.form.controls['potvrdaemail'].setErrors(null);
    }
  }
}
