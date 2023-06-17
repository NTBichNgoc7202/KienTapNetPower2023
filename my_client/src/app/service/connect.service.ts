import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Connect {
  public url: BehaviorSubject<string> = new BehaviorSubject<string>('https://us-central1-ueldaily-hubing.cloudfunctions.net/app');
  constructor(private _http: HttpClient) {
    this.setUrl();
  }
  getServerUrl() {
    if (environment.production) {
      return this._http.get('https://bhshopadminserver.onrender.com/glowy', {
        params: new HttpParams().set('title', 'https://glowy.web.app'),
      });
    } else {
      return this._http.get('http://localhost:3100/glowy', {
        params: new HttpParams().set('title', 'https://localhost:4300'),
      });
    }
  }
  setUrl() {
    this.getServerUrl().subscribe({
      next: (res) => {
        let data = res as any;
        this.url.next(data.link);
      },
    });
  }
}

// This is server url for production
// baseUrl = 'https://c927-2001-ee1-d702-f800-cdc6-e799-d55a-770c.ngrok-free.app';

// This is server url for production but it is not working
// baseUrl = 'https://us-central1-ueldaily-hubing.cloudfunctions.net/app';

// This is only for Production Build Locally
// baseUrl = 'http://localhost:3000';
