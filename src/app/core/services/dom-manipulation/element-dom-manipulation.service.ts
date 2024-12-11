import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
// import { MElementPair } from '../../core/types/login-form-fields';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HtmlSelectOption } from '../../interfaces/helpers/data/html-select-option';

export type MElementPair = Map<number, Element | null>;

@Injectable({
  providedIn: 'root',
})
export class ElementDomManipulationService {
  ids$!: Observable<MElementPair>;
  constructor() {}
  getCommaSeperatedValuesFromString(csvString: string) {
    const keys = (() => {
      try {
        if (!csvString) {
          return [];
        }
        const regex = /^([^,\n\r"]+|"[^"]*")(,([^,\n\r"]+|"[^"]*"))*$/;
        if (regex.test(csvString)) {
          const ids = csvString.split(',');
          return ids.map((id) => id.trim());
        }
        return [];
      } catch (err: any) {
        console.error(err.message);
        return [];
      }
    })();
    return keys;
  }
  parseDocumentKeys(documentIds: string, LENGTH: number) {
    const loginPageKeys = (() => {
      try {
        if (!documentIds) {
          throw Error('Unexpected: Document ids are empty.');
        }
        const regex = /^([^,\n\r"]+|"[^"]*")(,([^,\n\r"]+|"[^"]*"))*$/;
        if (regex.test(documentIds)) {
          const ids = documentIds.split(',');
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

    const getDocumentById = (id: string): Element | null => {
      const found = document.querySelector(`#${id}`);
      const isValid = found !== null && found !== undefined;
      !isValid && console.error(`Failed to find document id`, id);
      return isValid ? found : null;
    };

    const create$ = (ids: MElementPair) => {
      this.ids$ = new Observable((subscriber) => {
        subscriber.next(ids);
        subscriber.complete();
      });
    };

    ((ids: string[]) => {
      const documentIds = new Map<number, Element | null>();
      ids.forEach((id, index) => {
        const element = getDocumentById(id);
        documentIds.set(index, element);
      });
      create$(documentIds);
    })(loginPageKeys);
  }
  getSelectOptionsAsArray(select: HTMLSelectElement) {
    let selectOptions: HtmlSelectOption[] = [];
    for (let i = 0; i < select.options.length; i++) {
      let optionTag = select.options[i] as HTMLOptionElement;
      let option = {
        value: optionTag?.value,
        text: optionTag?.text,
        selected: optionTag?.selected,
      } as unknown as HtmlSelectOption;
      selectOptions.push(option);
    }
    return selectOptions;
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
