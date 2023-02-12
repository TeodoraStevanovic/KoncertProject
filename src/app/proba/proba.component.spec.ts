import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbaComponent } from './proba.component';

describe('ProbaComponent', () => {
  let component: ProbaComponent;
  let fixture: ComponentFixture<ProbaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProbaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProbaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
