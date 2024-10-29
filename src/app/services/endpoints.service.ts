import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class EndpointsService {
  public url = ' http://localhost:4300/create-charge';    


  constructor( 
    private _http: HttpClient
  ) { }

  makeStripePayment (params): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
   
    return this._http.post(this.url, params, {headers: headers});
  }
}
