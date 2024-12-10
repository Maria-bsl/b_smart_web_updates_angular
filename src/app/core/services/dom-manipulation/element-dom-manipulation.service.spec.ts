import { TestBed } from '@angular/core/testing';

import { ElementDomManipulationService } from './element-dom-manipulation.service';

describe('ElementDomManipulationService', () => {
  let service: ElementDomManipulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementDomManipulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
