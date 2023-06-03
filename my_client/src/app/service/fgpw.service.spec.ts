import { TestBed } from '@angular/core/testing';

import { FgpwService } from './fgpw.service';

describe('FgpwService', () => {
  let service: FgpwService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FgpwService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
