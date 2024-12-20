import { Injectable } from '@angular/core';
import * as Logger from 'tracer';

export type ConsoleLog = { component: string; method: string; message: string };

@Injectable({
  providedIn: 'root',
})
export class ErrorTracerService {
  constructor() {}
}
