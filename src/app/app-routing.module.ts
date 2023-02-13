import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {FooterComponent} from "./footer/footer.component";
import {HomeComponent} from "./home/home.component";
import {RezervacijaComponent} from "./rezervacija/rezervacija.component";
import {HeaderComponent} from "./header/header.component";
import {BiografijaComponent} from "./biografija/biografija.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'reservation', component: RezervacijaComponent },

  { path: 'reservation/:concertId', component: RezervacijaComponent },
  { path: 'biografija', component: BiografijaComponent }

  //{ path: 'footer', component: FooterComponent },
  //{ path: 'header', component: HeaderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})


export class AppRoutingModule { }



