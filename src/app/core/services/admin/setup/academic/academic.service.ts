import { Injectable, input } from '@angular/core';
import {
  combineLatest,
  concat,
  defer,
  endWith,
  filter,
  from,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
  zip,
} from 'rxjs';
import {
  ElementDomManipulationService,
  MElementPair,
} from '../../../dom-manipulation/element-dom-manipulation.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  EAcademicSetup,
  EAcademicSetupItem,
} from 'src/app/core/enums/admin/setup/academic-setup.enum';
import { UnsubscribeService } from '../../../unsubscribe-service/unsubscribe.service';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
import { TableItem } from 'src/app/shared/logic/table-item';
import { AcademicSetupTableItem } from 'src/app/core/interfaces/admin/setup/academic.setup';
import { MatTableDataSource } from '@angular/material/table';
import { filterNotNull } from 'src/app/components/forms/admin/login-form/login-form.component';

type TControls =
  | HTMLInputElement
  | HTMLSelectElement
  | NodeListOf<HTMLInputElement>;

export type THtmlElementControls = [Observable<TControls>, FormControl<any>];

@Injectable({
  providedIn: 'root',
})
export class AcademicService {
  // private _formGroup!: FormGroup;
  // private _copyFormGroup!: FormGroup;
  // private _ids$!: Observable<MElementPair>;
  // constructor(
  //   private _dom: ElementDomManipulationService,
  //   private unsubscribe: UnsubscribeService,
  //   private _fb: FormBuilder
  // ) {
  //   this.createFormGroup();
  // }
  // private createFormGroup() {
  //   const formGroup = () => {
  //     return this._fb.group({
  //       academicYear: this._fb.control('', [Validators.required]),
  //       academicStatus: this._fb.control('', [Validators.required]),
  //     });
  //   };
  //   this._formGroup = formGroup();
  //   this._copyFormGroup = formGroup();
  // }
  // registerFormControls(controls: THtmlElementControls[]) {
  //   const elements$ = from(controls);
  //   const filterControl$ = <T>(
  //     el: THtmlElementControls,
  //     controlType: new () => T
  //   ) => {
  //     return el[0].pipe(
  //       filter((control) => control instanceof controlType),
  //       map(() => el as [Observable<T>, FormControl])
  //     );
  //   };
  //   const htmlInput$ = () => {
  //     return elements$.pipe(
  //       switchMap((el) => filterControl$(el, HTMLInputElement)),
  //       tap(([input$, control]) => {
  //         const updateInput = (input: HTMLInputElement) =>
  //           input && control.setValue(input.value);
  //         input$.subscribe(updateInput);
  //       }),
  //       tap(([input$, control]) => {
  //         const updateInput = (value: string) =>
  //           input$.subscribe((input) => (input.value = value));
  //         control.valueChanges
  //           .pipe(this.unsubscribe.takeUntilDestroy)
  //           .subscribe(updateInput);
  //       })
  //     );
  //   };
  //   const htmlSelect$ = () => {
  //     return elements$.pipe(
  //       switchMap((el) => filterControl$(el, HTMLSelectElement)),
  //       tap(([select$, control]) => {
  //         const updateInput = (input: HTMLSelectElement) =>
  //           input && control.setValue(input.value);
  //         select$.subscribe(updateInput);
  //       }),
  //       tap(([select$, control]) => {
  //         const updateSelect = (value: string) =>
  //           select$.subscribe(
  //             (select) =>
  //               (select.value = value) &&
  //               this._dom.dispatchSelectElementChangeEvent(select)
  //           );
  //         control.valueChanges
  //           .pipe(this.unsubscribe.takeUntilDestroy)
  //           .subscribe(updateSelect);
  //       })
  //     );
  //   };
  //   const htmlRadioGroup$ = () => {
  //     return elements$.pipe(
  //       switchMap((el) => filterControl$(el, NodeList)),
  //       tap(([nodeList$, control]) =>
  //         nodeList$
  //           .pipe(
  //             map((inputs) =>
  //               Array.from<HTMLInputElement>(
  //                 inputs as NodeListOf<HTMLInputElement>
  //               ).filter((input) => input.checked)
  //             ),
  //             filter((e) => e.length === 1),
  //             tap((e) => control.setValue(e[0].value))
  //           )
  //           .subscribe()
  //       ),
  //       tap(([nodeList$, control]) =>
  //         control.valueChanges
  //           .pipe(
  //             switchMap((value) =>
  //               nodeList$.pipe(
  //                 map(
  //                   (inputs) =>
  //                     Array.from<HTMLInputElement>(
  //                       inputs as NodeListOf<HTMLInputElement>
  //                     ).find((input) => input.value === value) ?? null
  //                 ),
  //                 filterNotNull(),
  //                 tap((radio) => (radio.checked = true))
  //               )
  //             )
  //           )
  //           .subscribe()
  //       )
  //     );
  //   };
  //   merge(htmlInput$(), htmlSelect$(), htmlRadioGroup$())
  //     .pipe(this.unsubscribe.takeUntilDestroy)
  //     .subscribe({
  //       error: (e) => console.error(e),
  //       complete: () => this._copyFormGroup.setValue(this.formGroup.value),
  //     });
  // }
  // init() {
  //   const initFormControls = () => {
  //     this._dom.initHtmlInputFormControl(this.academicYear$, this.academicYear);
  //     this._dom.initHtmlRadioButtonGroup(
  //       this.academicRadioButtons$,
  //       this.academicStatus
  //     );
  //   };
  //   const valueChanges = () => {
  //     this._dom.htmlInputFormControlValueChanges(
  //       this.academicYear$,
  //       this.academicYear
  //     );
  //     this._dom.htmlRadioButtonGroupValueChanges(
  //       this.academicRadioButtons$,
  //       this.academicStatus
  //     );
  //   };
  //   concat(
  //     defer(() => {
  //       initFormControls();
  //       return [];
  //     }),
  //     defer(() => {
  //       valueChanges();
  //       return [];
  //     })
  //   )
  //     .pipe(this.unsubscribe.takeUntilDestroy)
  //     .subscribe({
  //       complete: () => this._copyFormGroup.setValue(this.formGroup.value),
  //     });
  // }
  // setIds(keys: string) {
  //   this.ids$ = new Observable((subscriber) => {
  //     const ids = this._dom.getDocumentElements(
  //       keys,
  //       Object.keys(EAcademicSetup).filter((key) => isNaN(Number(key))).length
  //     );
  //     ids.size > 0 && subscriber.next(ids);
  //     subscriber.complete();
  //   });
  // }
  // resetForm(event: MouseEvent) {
  //   this._formGroup.setValue(this._copyFormGroup.value);
  // }
  // set ids$(ids: Observable<MElementPair>) {
  //   this._ids$ = ids;
  // }
  // get ids$() {
  //   return this._ids$;
  // }
  // get academicYear$() {
  //   return this._dom.getDomElement$<HTMLInputElement>(
  //     this.ids$,
  //     EAcademicSetup.ACADEMIC_TEXTFIELD
  //   );
  // }
  // get academicRadioButtons$(): Observable<NodeListOf<HTMLInputElement>> {
  //   return this._dom
  //     .getDomElement$<HTMLSpanElement>(
  //       this.ids$,
  //       EAcademicSetup.ACADEMIC_STATUS_RADIO_GROUP
  //     )
  //     .pipe(
  //       this.unsubscribe.takeUntilDestroy,
  //       map((el) => el.querySelectorAll('input[type="radio"]'))
  //     );
  // }
  // get cancelButton$() {
  //   return this._dom.getDomElement$<HTMLInputElement>(
  //     this.ids$,
  //     EAcademicSetup.CANCEL_BUTTON
  //   );
  // }
  // get createButton$() {
  //   return this._dom.getDomElement$<HTMLInputElement>(
  //     this.ids$,
  //     EAcademicSetup.CREATE_BUTTON
  //   );
  // }
  // get updateButton$() {
  //   return this._dom.getDomElement$<HTMLInputElement>(
  //     this.ids$,
  //     EAcademicSetup.UPDATE_BUTTON
  //   );
  // }
  // get deleteButton$() {
  //   return this._dom.getDomElement$<HTMLInputElement>(
  //     this.ids$,
  //     EAcademicSetup.DELETE_BUTTON
  //   );
  // }
  // get formGroup() {
  //   return this._formGroup;
  // }
  // get academicYear() {
  //   return this._formGroup.get('academicYear') as FormControl;
  // }
  // get academicStatus() {
  //   return this._formGroup.get('academicStatus') as FormControl;
  // }
}
