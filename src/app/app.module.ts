import { NgModule, ErrorHandler as BaseErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ErrorHandler } from './shared/handlers/error.handler';
import { HttpInterceptor } from './shared/interceptors/http.interceptor';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md'
    }),
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: BaseErrorHandler, useClass: ErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
