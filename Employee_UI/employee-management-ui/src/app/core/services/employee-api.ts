import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeApiService {

  private BASE_URL = 'http://localhost:8080/api/employees';
  private ADMIN_EMP_URL = 'http://localhost:8080/api/admin/employees';

  constructor(private http: HttpClient) {}

  // ======================
  // EMPLOYEE LIST
  // ======================
  fetchEmployees(page: number, size: number, search?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (search) params = params.set('search', search);
    return this.http.get<any>(this.BASE_URL, { params });
  }

  // ======================
  // EMPLOYEE PROFILE
  // ======================
  getEmployeeById(empId: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${empId}`);
  }

  getMyProfile(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/me`);
  }

  updateMyProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/me`, data);
  }

  // ======================
  // ADMIN APIs
  // ======================
  getAllUsersForAdmin(): Observable<any[]> {
    return this.http.get<any[]>(this.ADMIN_EMP_URL);
  }

 getUserForAdmin(userId: number) {
  return this.http.get<any>(
    `http://localhost:8080/api/admin/employees/user/${userId}`
  );
}


adminUpdateUser(userId: number, data: any) {
  return this.http.put(
    `http://localhost:8080/api/admin/employees/user/${userId}`,
    data
  );
}


  deleteEmployee(empId: number): Observable<void> {
    return this.http.delete<void>(`${this.ADMIN_EMP_URL}/${empId}`);
  }



}
