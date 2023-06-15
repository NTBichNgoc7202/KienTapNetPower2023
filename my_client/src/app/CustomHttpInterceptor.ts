import { HttpInterceptor, HttpXsrfTokenExtractor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

    constructor(private tokenExtractor: HttpXsrfTokenExtractor) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // send request with credential options in order to be able to read cross-origin cookies
        req = req.clone({ withCredentials: true ,setHeaders:{
            "ngrok-skip-browser-warning": "69420",
        }});
        // return XSRF-TOKEN in each request's header (anti-CSRF security)
        const headerName = 'X-XSRF-TOKEN';
        let token = this.tokenExtractor.getToken() as string;
        // This token is null and I don't know why. I have tried but it doesn't work. So another time.
        if (token !== null && !req.headers.has(headerName)) {
            req = req.clone({ headers: req.headers.set(headerName, token) });
        }
        return next.handle(req);
    }
}