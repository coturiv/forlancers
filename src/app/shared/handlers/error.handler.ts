import { Injectable, ErrorHandler as BaseErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandler extends BaseErrorHandler {

  constructor() {
    super();
  }

  handleError(error: Error | HttpErrorResponse | any) {
    error = error.rejection || error;

    console.log(error);
  }
}
