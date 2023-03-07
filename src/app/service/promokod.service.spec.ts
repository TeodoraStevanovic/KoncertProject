import { TestBed } from '@angular/core/testing';

import { PromokodService } from './promokod.service';

describe('PromokodService', () => {
  let service: PromokodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromokodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
