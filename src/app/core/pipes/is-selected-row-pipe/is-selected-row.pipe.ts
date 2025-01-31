import { Pipe, PipeTransform } from '@angular/core';
import {
  AcademicSetupTableItem,
  DesignationSetupTableItem,
} from '../../interfaces/admin/setup/academic.setup';

@Pipe({
  name: 'isSelectedRow',
  standalone: true,
})
export class IsSelectedRowPipe implements PipeTransform {
  transform(value: AcademicSetupTableItem, ...args: any[]): boolean {
    if (value.radioButton) return value.radioButton.checked;
    return false;
  }
}

@Pipe({
  name: 'isSelectedItem',
  standalone: true,
})
export class IsSelectedItemPipe implements PipeTransform {
  transform(value: any, ...args: any[]): boolean {
    if (value.selector) return value.selector.checked;
    return false;
  }
}
