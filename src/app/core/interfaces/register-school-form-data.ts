import { Observable } from 'rxjs';
import { HtmlSelectOption } from './helpers/data/html-select-option';

export interface RegisterSchoolFormData {
  branchesList$: Observable<HtmlSelectOption[]>;
  countriesList$: Observable<HtmlSelectOption[]>;
  regionsList$: Observable<HtmlSelectOption[]>;
  districtsList$: Observable<HtmlSelectOption[]>;
  wardsList$: Observable<HtmlSelectOption[]>;
  currencies$?: Observable<HtmlSelectOption[]>;
  schoolNames$?: Observable<HtmlSelectOption[]>;
}
