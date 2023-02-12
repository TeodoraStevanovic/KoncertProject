
import {Component, HostListener, OnInit} from '@angular/core';
import {Koncert} from "../koncert.model";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  koncert1:Koncert= new Koncert(1 ,(new Date(2023, 6, 12)),"Beograd","Stark Arena"," Last Battle ","");
  koncert2:Koncert= new Koncert(2 ,(new Date(2023, 2, 18)),"Milano","Duomo","Nothing like home","");
  koncert3:Koncert= new Koncert(3 ,(new Date(2023, 3, 14)),"Barcelona","Torre Glores","Sagrada musica","");
  koncert4:Koncert= new Koncert(4 ,(new Date(2023, 3, 3)),"Paris","Accor arena", "Love light","");
  koncert5:Koncert= new Koncert(5 ,(new Date(2023, 4, 11)),"Madrid","Arena center","Churros Madrid","");
  koncert6:Koncert= new Koncert(6 ,(new Date(2023, 5, 5)),"Sofia","Hall Empire","Hagia Sophia","");
  koncert7:Koncert= new Koncert(7 ,(new Date(2023, 2, 18)),"Istanbul","Besiktas Hall","2 worlds","");

   koncerti = [this.koncert1,this.koncert2,this.koncert3,this.koncert4,
     this.koncert5,this.koncert6,this.koncert7];

  constructor() { }

  ngOnInit(): void {
  }


}
