import { TestBed } from '@angular/core/testing';

import { HttpInterceptor } from './http.interceptor';

describe('HttpInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpInterceptor = TestBed.get(HttpInterceptor);
    expect(service).toBeTruthy();
  });
});
