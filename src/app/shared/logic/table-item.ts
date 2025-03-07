import { Observable, filter, map } from 'rxjs';
import { filterNotNull } from 'src/app/components/forms/admin/login-form/login-form.component';

export class TableItem {
  private tableItem$!: Observable<string>;
  constructor(values: string[]) {
    this.tableItem$ = new Observable<string>((subs) => {
      values.forEach((value) => subs.next(value));
      subs.complete();
    });
  }
  getTableItem$<T>(index: number, func: (value: string) => T): Observable<T> {
    return this.tableItem$.pipe(
      filter((_, i) => i === index),
      filterNotNull(),
      map(func)
    );
  }
}
