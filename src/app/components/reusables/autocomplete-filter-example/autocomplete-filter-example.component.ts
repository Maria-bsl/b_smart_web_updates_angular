import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, of, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-autocomplete-filter-example',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './autocomplete-filter-example.component.html',
  styleUrl: './autocomplete-filter-example.component.scss',
})
export class AutocompleteFilterExampleComponent implements OnInit {
  @Input() formControl = new FormControl('', []);
  @Input() options: string[] = [];
  @Input() placeholderText: string = '';
  @Input() errorMessage: string = '';
  filteredOptions: Observable<string[]> = of([]);
  constructor() {}
  // private _filter(value: string): string[] {
  //   let filterValue = value.toLowerCase();

  //   return this.options.filter((option) =>
  //     option.toLowerCase().includes(filterValue)
  //   );
  // }
  ngOnInit(): void {
    // if (this.options.length > 0) {
    //   this.filteredOptions = this.formControl.valueChanges.pipe(
    //     startWith(''),
    //     map((value) => this._filter(value || ''))
    //   );
    // }
  }
}
