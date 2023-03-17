import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzmenaRezervacijeComponent } from './izmena-rezervacije.component';

describe('IzmenaRezervacijeComponent', () => {
  let component: IzmenaRezervacijeComponent;
  let fixture: ComponentFixture<IzmenaRezervacijeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IzmenaRezervacijeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IzmenaRezervacijeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
