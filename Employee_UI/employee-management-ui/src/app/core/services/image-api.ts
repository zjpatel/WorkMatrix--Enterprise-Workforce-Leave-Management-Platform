import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageApiService {

  private BASE_URL = 'http://localhost:8080/api/images';

  constructor(private http: HttpClient) {}

  getImage(imageId: number): Observable<Blob> {
    return this.http.get(`${this.BASE_URL}/${imageId}`, {
      responseType: 'blob'
    });
  }
}
