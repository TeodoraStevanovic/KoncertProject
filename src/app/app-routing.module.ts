import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {FooterComponent} from "./footer/footer.component";
import {HomeComponent} from "./home/home.component";
import {ProbaComponent} from "./proba/proba.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'proba', component: ProbaComponent },
  { path: 'footer', component: FooterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})


export class AppRoutingModule { }



