import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Koncert} from "../model/koncert.model";
import {NgForm} from "@angular/forms";
import {Zona} from "../model/zona.model";
import {KoncertService} from "../koncert.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ZonaService} from "../zona.service";
import {Subscription} from "rxjs";
import {RezervacijaService} from "../rezervacija.service";
import {Rezervacija} from "../model/rezervacija.model";
import {Karta} from "../model/karta.model";
import {Korisnik} from "../model/korisnik.model";


@Component({
  selector: 'app-rezervacija',
  templateUrl: './rezervacija.component.html',
  styleUrls: ['./rezervacija.component.css']
})
export class RezervacijaComponent implements OnInit, OnChanges {
  zone: Zona[] = [];
  koncert: Koncert;
  rezervacija: Rezervacija;
  koncertId: number = -1;
  @Input()zonaId: number = -1;//ovo se trenutno nigde ne koristi vidi sta si htela sa ovim
  sub: Subscription;
  poruka: string = 'nepoznato';
  //
  @Input() brojKarti: number = 0;
  @Input() selectedZona:number=-1;
  slobodanBrojKarti:number=0;
  porukaDovoljnoKarti: string = 'nepoznato';
  porukaNijeSelektovanaZonaIBrojKarti: string='nepoznato';
  //
  constructor(private zonaService: ZonaService,
              private koncertService: KoncertService,
              private rezervacijaService: RezervacijaService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

    this.sub = this.activatedRoute.queryParams.subscribe(params => {
      this.koncertId = +params['id'];
    });
    this.koncert = new Koncert(this.koncertId, new Date(), "", "", "");
    this.rezervacija = new Rezervacija(-1, new Date(),
      new Korisnik(-1, "", "", "", "", "", "", "", "", "", "",)
      , new Karta(-1))
  }

  ngOnChanges(changes: SimpleChanges): void {
  /*  console.log("ovde ovde");
    if ('brojKarti' in changes) {
      console.log(changes);
      console.log("ovde iiiii ovde");
    this.proveriBrojSlobodnihKarti();
    }
    if('selectedZona' in changes){
      console.log(this.selectedZona);

    }*/
    }

  ngOnInit(): void {
    this.getKoncert();
    this.populateDropDownZonaForKoncert();
  }

  private populateDropDownZonaForKoncert() {
    this.zonaService.retrieveAllZoneForKoncert(this.koncertId).subscribe(
      response => {
        if(response.length==0){this.poruka="TRENUTNO NEMA DOSTUPNIH KARTI ZA OVAJ KONCERT!"}
        else{ this.zone= response;}})
  }


  private getKoncert() {
    //kad se otvori strana da odmah imamo id koncerta
    if(this.koncertId!=-1) {
      this.koncertService.retrieveKoncert( this.koncertId)
        .subscribe (
          data => this.koncert = data
        )}
  }
  MakeRezervation(RezForm: NgForm) {
    console.log(RezForm);
  if (RezForm.valid) {console.log('Prijava je uspesno izvrsena!');
    // @ts-ignore
    // @ts-ignore
   // this.rezervacijaService.createTodo(this.rezervacija).subscribe(resData=>{

     // console.log(resData);  })

  }}

  private proveriBrojSlobodnihKarti() {
    this.zonaService.returnBrojSlobodnihKartiUZoni(this.selectedZona).subscribe(
      response => {
        if (response-this.brojKarti>=0) {
          this.slobodanBrojKarti= response-this.brojKarti;
          this.porukaDovoljnoKarti='nepoznato';}
        else{
          this.slobodanBrojKarti=response;
          this.porukaDovoljnoKarti='Nema dovoljno karti u ovoj zoni, ostalo je jos: '+this.slobodanBrojKarti+'. Rezervisite manje karti ili odaberite drugu zonu!';}
      })
  }
  onKey(value: string) {
  this.brojKarti=+value;}

  AddCardsToRezervation() {

if (this.selectedZona==-1 && (this.brojKarti ==-1 || this.brojKarti==0)){  this.porukaNijeSelektovanaZonaIBrojKarti="Selektujte zonu i upisite broj karti!!";}
else if(this.selectedZona==-1 && this.brojKarti !=-1 && this.brojKarti!=0){
  this.porukaNijeSelektovanaZonaIBrojKarti="Selektujte zonu! Trenutno nije selektovana ni jedna zona!";
}else if (this.brojKarti ==-1 || this.brojKarti ==0){this.porukaNijeSelektovanaZonaIBrojKarti='Upisite broj karti koji zelite u ovoj zoni!';}
else{
  this.porukaNijeSelektovanaZonaIBrojKarti='nepoznato';
  //sada treba proveriti da li ima slobodan broj karti i sta ako nema

  this.proveriBrojSlobodnihKarti();
  if (this.porukaDovoljnoKarti=='nepoznato'){
    //ako ima dovoljno karti
    this.dodajKarteURezervaciju(this.koncertId,this.selectedZona,this.brojKarti);
  }
  else{
//ako dodje u ovaj slucaj prikazace se poruka i nista se nece desiti
  }}}

  private dodajKarteURezervaciju(koncertId: number, selectedZona: number, brojKarti: number) {

  }
}
