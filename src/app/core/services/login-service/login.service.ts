import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UnsubscribeService } from '../unsubscribe-service/unsubscribe.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private _http: HttpClient,
    private _unsubscribe: UnsubscribeService
  ) {}
  loginClick(body: {}) {
    this._http
      .post('Default.aspx/Login_Click', body)
      .pipe(this._unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => console.log(value),
        error: (e) => console.error(e),
      });
  }
}
