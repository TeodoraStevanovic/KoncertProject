import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Koncert } from '../model/koncert.model';
import { NgForm } from '@angular/forms';
import { Zona } from '../model/zona.model';
import { KoncertService } from '../service/koncert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ZonaService } from '../service/zona.service';
import { map, Subscription } from 'rxjs';
import { RezervacijaService } from '../service/rezervacija.service';
import { Rezervacija } from '../model/rezervacija.model';
import { Korisnik } from '../model/korisnik.model';
import { KartaService } from '../service/karta.service';
import { ZonaPK } from '../model/ZonaPK.model';
import { PromokodService } from '../service/promokod.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../popup-dialogs/dialog/dialog.component';

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
  promokod: string = '';
  validanPromokod: boolean = false;
  porukaPromokod: string = 'nepoznato';
  popustPromokod: number = 0;
  primenjenPromokod: boolean = false;
  porukaPromokodPopust: string = 'nepoznato';
  isVisible: boolean = true;
  token: string = '';
  generisanPromokod: string = '';
  modelKorisnik = new Korisnik(-1, '', '', '', '', '', '', '', '', '', '');
  model = new Rezervacija(
    -1,
    new Date(),
    new Korisnik(-1, '', '', '', '', '', '', '', '', '', ''),
    0,
    0
  );

  constructor(
    public dialog: MatDialog,
    private zonaService: ZonaService,
    private koncertService: KoncertService,
    private rezervacijaService: RezervacijaService,
    private kartaService: KartaService,
    private promokodService: PromokodService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
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
    this.location.replaceState('/reservation');
    this.getKoncert();
    this.populateDropDownZonaForKoncert();
    this.validanPromokod = false;
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
        .createReservationWithCardsPromoCode(
          this.model,
          this.selectedZona,
          this.promokod
        )
        .subscribe((value) => {
          console.log('Prijava je uspesno izvrsena!');
          const values = Object.values(value);
          this.token = values[0];
          this.generisanPromokod = values[1];
          this.openDialog(
            this.model,
            this.koncert,
            this.zona,
            this.token,
            this.generisanPromokod
          );
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
      });
    }
  }

  getSelectedValue(idzona: number) {
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

  CheckAndApplyPromocode() {
    if (this.promokod != '') {
      this.daLiJePromokodValidan();
      setTimeout(() => {
        console.log('Async Task Calling Callback');
        if (this.validanPromokod == true) {
          //ako je validan potrebno je primeniti popust na ukupnu cenu i onemoguciti
          this.promokodPopust();
          this.isVisible = false;
        } else {
          this.porukaPromokod = 'Uneti promokod nije validan!';
        }
      }, 500);
    }
  }

  private daLiJePromokodValidan() {
    this.promokodService
      .checkIfExistAndIfValid(this.promokod)
      .subscribe((value) => {
        this.validanPromokod = value;
      });
  }

  onKeyKod(value: string) {
    this.porukaPromokod = 'nepoznato';
  }

  private promokodPopust() {
    //5% popusta
    this.popustPromokod = this.model.ukupno - this.model.ukupno * 0.95;
    this.model.ukupno = this.model.ukupno * 0.95;
    this.porukaPromokodPopust = 'Ostvarili ste promokod popust od 5%';
    this.primenjenPromokod = true;
  }

  private openDialog(
    model: Rezervacija,
    koncert: Koncert,
    zona: Zona,
    token: string,
    promokod: string
  ) {
    //
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = true;

    let dialogRef = this.dialog.open(DialogComponent, {
      height: '70%',
      width: '70%',

      data: {
        datum: koncert.datum,
        grad: koncert.grad,
        naziv: koncert.naziv,
        lokacija: koncert.lokacija,
        zona: zona.naziv,
        brojKarata: model.brojKarata,
        ukupno: model.ukupno,
        ime: model.korisnik.ime,
        prezime: model.korisnik.prezime,
        email: model.korisnik.email,
        adresa: model.korisnik.adresa1,
        token: token,
        kupon: promokod,
      },
    });

    //this.dialog.afterAllClosed.subscribe(() => {
    // console.log('zatvoren dialog');
    // });
    dialogRef.afterClosed().subscribe(() => {
      console.log('zatvoren dijalog');
      this.router.navigate(['mojeRezervacije']);
    });
    //dialogRef.backdropClick().subscribe(() => {
    //console.log('zatvoren dijalog pomocu kliktanja na pozadinu');
    //  this.router.navigate(['mojeRezervacije']);
    // });
  }
}

export interface DialogData {
  datum: any;
  grad: any;
  naziv: any;
  lokacija: any;
  zona: any;
  brojKarata: any;
  ukupno: any;
  ime: any;
  prezime: any;
  email: any;
  adresa: any;
  token: any;
  kupon: any;
}
