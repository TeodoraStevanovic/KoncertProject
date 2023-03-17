import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RezervacijaComponent } from './rezervacija/rezervacija.component';
import { BiografijaComponent } from './biografija/biografija.component';
import { MojeRezervacijeComponent } from './moje-rezervacije/moje-rezervacije.component';
import { DialogComponent } from './popup-dialogs/dialog/dialog.component';
import { IzmenaRezervacijeComponent } from './izmena-rezervacije/izmena-rezervacije.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'reservation', component: RezervacijaComponent },
  { path: 'mojeRezervacije', component: MojeRezervacijeComponent },
  { path: 'izmenaRezervacije', component: IzmenaRezervacijeComponent },
  { path: 'biografija', component: BiografijaComponent },

  //{ path: 'footer', component: FooterComponent },
  //{ path: 'header', component: HeaderComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
