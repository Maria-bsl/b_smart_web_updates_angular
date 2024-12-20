import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteFilterExampleComponent } from './autocomplete-filter-example.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('AutocompleteFilterExampleComponent', () => {
  let component: AutocompleteFilterExampleComponent;
  let fixture: ComponentFixture<AutocompleteFilterExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteFilterExampleComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteFilterExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
