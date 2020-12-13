import { HttpService, Injectable, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { map, catchError } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class ProxyService {
  constructor(private httpService: HttpService) {}

  makeRequest(url: string, { method, body }): Observable<AxiosResponse<any>> {
    return this.httpService
      .request({
        url,
        method,
        ...(Object.keys(body).length && { data: body }),
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log(error);
          throw new HttpException(error.response.data, error.response.status);
        }),
      );
  }
}
