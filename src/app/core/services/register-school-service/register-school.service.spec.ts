import { TestBed } from '@angular/core/testing';

import { RegisterSchoolService } from './register-school.service';

describe('RegisterSchoolService', () => {
  let service: RegisterSchoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterSchoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
