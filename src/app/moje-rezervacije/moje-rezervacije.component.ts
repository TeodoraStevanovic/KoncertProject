import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RezervacijaService } from '../service/rezervacija.service';
import { NavigationExtras, Router } from '@angular/router';
import { Rezervacija } from '../model/rezervacija.model';
import { Korisnik } from '../model/korisnik.model';
import { Zona } from '../model/zona.model';
import { Karta } from '../model/karta.model';
import { ZonaPK } from '../model/ZonaPK.model';
import { Koncert } from '../model/koncert.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../popup-dialogs/dialog/dialog.component';
import { PromptComponent } from '../popup-dialogs/prompt/prompt.component';
@Component({
  selector: 'app-moje-rezervacije',
  templateUrl: './moje-rezervacije.component.html',
  styleUrls: ['./moje-rezervacije.component.css'],
})
export class MojeRezervacijeComponent implements OnInit {
  poruka: string = 'nepoznato';
  zona: Zona = new Zona(
    new ZonaPK(-1, -1),
    '',
    0,
    0,
    0,
    new Koncert(-1, new Date(), '', '', '')
  );
  token: string = '';
  email: string = '';
  prikazi: boolean = false;
  rezervacija: Rezervacija = new Rezervacija(
    -1,
    new Date(),
    new Korisnik(-1, '', '', '', '', '', '', '', '', '', ''),
    0,
    0
  );

  karte: Array<Karta> = [];
  constructor(
    public dialog: MatDialog,
    private rezervacijaService: RezervacijaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.prikazi = false;
  }

  FindRezervation(ProveraForm: NgForm) {
    this.rezervacija = new Rezervacija(
      -1,
      new Date(),
      new Korisnik(-1, '', '', '', '', '', '', '', '', '', ''),
      0,
      0
    );
    this.zona = new Zona(
      new ZonaPK(-1, -1),
      '',
      0,
      0,
      0,
      new Koncert(-1, new Date(), '', '', '')
    );
    this.karte = [];
    this.poruka = 'nepoznato';
    //  console.log(this.karte.length);
    if (ProveraForm.valid) {
      //  console.log(this.email);
      // console.log(this.token);
      this.rezervacijaService.findRezervacija(this.email, this.token).subscribe(
        (value) => {
          console.log('ovde smo');
          console.log(value);
          if (value.rezervacija != null && value.zona != null) {
            this.rezervacija = value.rezervacija;
            this.karte = value.karte;
            this.zona = value.zona;
            this.prikazi = true;
          } else {
            this.poruka = 'nema odgovora';
            this.prikazi = false;
          }
        },
        (error) => {
          console.log('desila se greska');
          this.poruka = 'nema odgovora';
          this.prikazi = false;
        }
      );
    } else {
      console.log(ProveraForm);
    }
  }

  OpenDialog(rezervacijaId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = true;

    let dialogRef = this.dialog.open(PromptComponent, {
      height: '40%',
      width: '40%',
      data: {
        idRezervacija: rezervacijaId,
        token: this.token,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('zatvoren dijalog');

      //this.router.navigate(['mojeRezervacije']);
    });
  }

  OpenPageForAlterReservation() {
    console.log(`izmeni rezervaciju ${this.rezervacija.idrezervacija}`);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        rezervacija: JSON.stringify(this.rezervacija),
        karte: JSON.stringify(this.karte),
        zona: JSON.stringify(this.zona),
        token: this.token,
      },
      //skipLocationChange: true,
    };
    //the skipLocationChange property is set to true to skip updating the browser's URL, preventing the parameters from being visible in the URL.
    this.router.navigate(['izmenaRezervacije'], navigationExtras);
  }
}
export interface PromptData {
  idRezervacija: number;
  token: string;
}
