import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
// import { MElementPair } from '../../core/types/login-form-fields';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { HtmlSelectOption } from '../../interfaces/helpers/data/html-select-option';
import { UnsubscribeService } from '../unsubscribe-service/unsubscribe.service';

export type MElementPair = Map<number, Element | null>;

@Injectable({
  providedIn: 'root',
})
export class ElementDomManipulationService {
  ids$!: Observable<MElementPair>;
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
  parseDocumentKeys(documentIds: string, LENGTH: number) {
    const keys = this.getCSVFromString(documentIds, LENGTH);

    const getDocumentById = (id: string): Element | null => {
      const found = document.querySelector(`#${id}`);
      const isValid = found !== null && found !== undefined;
      !isValid && console.error(`Failed to find document id`, id);
      return isValid ? found : null;
    };

    const elements = keys.map((key) => getDocumentById(key));
    const ids = new Map<number, Element | null>(elements.entries());
    this.ids$ = new Observable((subscriber) => {
      subscriber.next(ids);
      subscriber.complete();
    });
  }
  getElementAtIndex<T>(index: number) {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(index) as T)
    );
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
