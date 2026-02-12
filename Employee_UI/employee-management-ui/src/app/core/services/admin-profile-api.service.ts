import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AdminProfileApiService {

  private BASE = 'http://localhost:8080/api/admin/profile';

  constructor(private http: HttpClient) {}

  getMyProfile() {
    return this.http.get<any>(this.BASE);
  }

  updateMyProfile(payload: any) {
    return this.http.put<any>(this.BASE, payload);
  }
}
