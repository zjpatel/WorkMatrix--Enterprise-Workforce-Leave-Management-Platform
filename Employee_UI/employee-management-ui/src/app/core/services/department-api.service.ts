import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentApiService {

  private BASE_URL = 'http://localhost:8080/api/departments';

  constructor(private http: HttpClient) {}

  // 🔹 Get all departments
  fetchAllDepartments(): Observable<any[]> {
    return this.http.get<any[]>(this.BASE_URL);
  }

  // 🔹 Get single department by id
  getDepartmentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`);
  }

  // 🔹 Get employees under a department
  fetchEmployeesByDepartment(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/${id}/employees`);
  }

  // 🔹 Admin: create department
  createDepartment(payload: any): Observable<any> {
    return this.http.post(this.BASE_URL, payload);
  }

  // 🔹 Admin: delete department
deleteDepartment(deptId: number) {
  return this.http.delete(
    `${this.BASE_URL}/${deptId}`,
    {
      observe: 'response',   // ✅ IMPORTANT
      responseType: 'text'   // ✅ IMPORTANT
    }
  );
}


}
