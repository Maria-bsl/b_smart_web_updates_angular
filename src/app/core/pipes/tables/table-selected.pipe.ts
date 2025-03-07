import { Pipe, PipeTransform } from '@angular/core';
import { HtmlSelectOption } from '../../interfaces/helpers/data/html-select-option';

@Pipe({
  name: 'tableSelected',
  standalone: true,
})
export class TableSelectedPipe implements PipeTransform {
  transform(values: any[], ...args: unknown[]): boolean {
    type TableElement = { selector?: HTMLInputElement };
    return values.some((value) => (value as TableElement)?.selector?.checked);
  }
}

@Pipe({
  name: 'listCheckboxes',
  standalone: true,
})
export class ListCheckboxesPipe implements PipeTransform {
  transform(values: HTMLInputElement[] | null, ...args: unknown[]): any[] {
    return [];
  }
}

//hehehe chatgpt
@Pipe({
  name: 'boldify',
  standalone: true,
})
export class BoldifyPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Regular expression to find {+...+} and replace with <b>...</b>
    return value.replace(/\{\+([^+]+)\+\}/g, '<b>{+$1+}</b>');
  }
}
