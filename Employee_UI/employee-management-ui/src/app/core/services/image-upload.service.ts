import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private BASE_URL = 'http://localhost:8080/api/images';

  constructor(private http: HttpClient) {}

  uploadImages(empId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return this.http.post(`${this.BASE_URL}/upload/${empId}`, formData);
  }

  deleteImage(imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${imageId}`);
  }

 uploadUserImages(userId: number, files: File[]) {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));

  return this.http.post(
    `http://localhost:8080/api/images/upload/user/${userId}`,
    formData
  );
}


}
