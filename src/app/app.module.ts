import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { RezervacijaComponent } from './rezervacija/rezervacija.component';
import { BiografijaComponent } from './biografija/biografija.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MojeRezervacijeComponent } from './moje-rezervacije/moje-rezervacije.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './popup-dialogs/dialog/dialog.component';
import { PromptComponent } from './popup-dialogs/prompt/prompt.component';
import { IzmenaRezervacijeComponent } from './izmena-rezervacije/izmena-rezervacije.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HomeComponent,
    HeaderComponent,
    RezervacijaComponent,
    BiografijaComponent,
    MojeRezervacijeComponent,
    DialogComponent,
    PromptComponent,
    IzmenaRezervacijeComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatStepperModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
