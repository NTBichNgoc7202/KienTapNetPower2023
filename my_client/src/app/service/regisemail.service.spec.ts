import { TestBed } from '@angular/core/testing';

import { RegisemailService } from './regisemail.service';

describe('RegisemailService', () => {
  let service: RegisemailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisemailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
