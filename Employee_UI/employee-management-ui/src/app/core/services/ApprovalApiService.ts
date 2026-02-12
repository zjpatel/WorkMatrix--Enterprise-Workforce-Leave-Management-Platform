import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApprovalApiService {

  private BASE_URL = 'http://localhost:8080/api/admin/approval';

  constructor(private http: HttpClient) {}

 approve(userId: number) {
  return this.http.post(`${this.BASE_URL}/approve`, { userId });
}


  reject(userId: number) {
    return this.http.post(`${this.BASE_URL}/reject/${userId}`, {});
  }

  reopen(userId: number) {
    return this.http.post(`${this.BASE_URL}/reopen/${userId}`, {});
  }
}
