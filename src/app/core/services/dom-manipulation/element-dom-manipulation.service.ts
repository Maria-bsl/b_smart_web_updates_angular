import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
// import { MElementPair } from '../../core/types/login-form-fields';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { HtmlSelectOption } from '../../interfaces/helpers/data/html-select-option';
import { UnsubscribeService } from '../unsubscribe-service/unsubscribe.service';
import { AppUtilities } from 'src/app/utilities/app-utilities';

export type MElementPair = Map<number, Element | null>;

@Injectable({
  providedIn: 'root',
})
export class ElementDomManipulationService {
  //ids$!: Observable<MElementPair>;
  constructor(private unsubscribe: UnsubscribeService) {}
  private getCSVFromString(csvString: string, LENGTH: number) {
    return (() => {
      try {
        if (!csvString) {
          throw Error('Unexpected: Document ids are empty.');
        }
        const regex = /^([^,\n\r"]+|"[^"]*")(,([^,\n\r"]+|"[^"]*"))*$/;
        if (regex.test(csvString)) {
          const ids = csvString.split(',');
          if (ids.length !== LENGTH) {
            throw new Error('Missing document ids.');
          } else {
            return ids.map((id) => id.trim());
          }
        }
        throw new Error('Invalid document id format.');
      } catch (err: any) {
        console.error(err.message);
        return [];
      }
    })();
  }
  getDocumentElements(documentIds: string, LENGTH: number) {
    const keys = this.getCSVFromString(documentIds, LENGTH);
    const getDocumentById = (id: string): Element | null => {
      const found = document.querySelector(`#${id}`);
      const isValid = found !== null && found !== undefined;
      !isValid && console.warn(`Failed to find document id`, id);
      return isValid ? found : null;
    };
    const elements = keys.map((key) => getDocumentById(key));
    return new Map<number, Element | null>(elements.entries());
  }
  getSelectOptionsAsArray(select: HTMLSelectElement): HtmlSelectOption[] {
    const selectOptions: HtmlSelectOption[] = [];
    for (let i = 0; i < select.options.length; i++) {
      const optionTag = select.options[i] as HTMLOptionElement;
      const option = {
        value: optionTag?.value,
        text: optionTag?.text,
        selected: optionTag?.selected,
      } as unknown as HtmlSelectOption;
      selectOptions.push(option);
    }
    return selectOptions;
  }
  htmlInputFormControlPhoneNumberValueChanges(
    prefix: string,
    input$: Observable<HTMLInputElement>,
    control: FormControl<string | null>
  ) {
    if (input$ && control) {
      control.valueChanges
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          switchMap((value) =>
            value
              ? input$.pipe(
                  map((userInput) => {
                    userInput.value = `${
                      prefix.startsWith('+') ? prefix.substring(1) : prefix
                    }${value}`;
                    return userInput;
                  })
                )
              : []
          )
        )
        .subscribe({ error: (e) => console.error(e) });
    }
  }
  htmlInputFormControlValueChanges(
    input$: Observable<HTMLInputElement>,
    control: FormControl<string | null>
  ) {
    if (input$ && control) {
      control.valueChanges
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          switchMap((value) =>
            value
              ? input$.pipe(
                  map((userInput) => {
                    userInput.value = value;
                    return userInput;
                  })
                )
              : []
          )
        )
        .subscribe({ error: (e) => console.error(e) });
    }
  }
  htmlSelectFormControlValueChanges(
    select$: Observable<HTMLSelectElement>,
    control: FormControl<string | null>
  ) {
    if (select$ && control) {
      control.valueChanges
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          switchMap((value) =>
            value
              ? select$.pipe(
                  map((select) => {
                    select.value = value;
                    this.dispatchSelectElementChangeEvent(select);
                    return select;
                  })
                )
              : []
          )
        )
        .subscribe({ error: (e) => console.error(e) });
    }
  }
  initHtmlInputFormControl(
    input$: Observable<HTMLInputElement>,
    control: FormControl
  ) {
    input$.subscribe({
      next: (input) => input.value && control.setValue(input.value),
      error: (err) => console.error(err.message),
    });
  }
  initHtmlSelectFormControl(
    input$: Observable<HTMLSelectElement>,
    control: FormControl
  ) {
    input$.subscribe({
      next: (select) =>
        select &&
        !AppUtilities.isValueEmptyElement(select) &&
        control.setValue(select.value),
      error: (err) => console.error(err.message),
    });
  }
  setHtmlElementValue(
    input$: Observable<HTMLInputElement | HTMLSelectElement>,
    value: string
  ) {
    input$.subscribe({
      next: (input) => (input.value = value),
      error: (err) => console.error(err.message),
    });
  }
  dispatchSelectElementChangeEvent(selectElement: HTMLSelectElement) {
    if (selectElement) {
      let event = new Event('change', { bubbles: true });
      selectElement.dispatchEvent(event);
    }
  }
  getDomElement$<T>(ids$: Observable<MElementPair>, index: number) {
    return ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      filter((el) => el.get(index) !== null && el.get(index) !== undefined),
      map((el) => el.get(index) as T)
    );
  }
  clickButton(button: HTMLButtonElement | HTMLInputElement) {
    try {
      if (!button) throw new Error('Button is undefined.');
      button.click();
    } catch (err: any) {}
  }
  clickAnchorHref(anchor: HTMLAnchorElement) {
    try {
      if (!anchor) throw new Error('Anchor is undefined.');
      anchor.click();
    } catch (err: any) {
      console.error(err.message);
    }
  }
}
