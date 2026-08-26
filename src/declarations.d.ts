declare module '@angular/core' {
  export interface OnInit {
    ngOnInit(): void;
  }
  export function Component(options: any): ClassDecorator;
  export function Injectable(options?: any): ClassDecorator;
}

declare module '@angular/common/http' {
  export class HttpClient {
    get(url: string, options?: any): any;
    post(url: string, body?: any, options?: any): any;
    put(url: string, body?: any, options?: any): any;
    delete(url: string, options?: any): any;
  }
}

declare module 'rxjs' {
  export class Observable<T> {
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): any;
  }
}
