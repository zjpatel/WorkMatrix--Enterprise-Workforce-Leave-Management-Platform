import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { LeaveResponse, ApplyLeaveRequest, EditLeaveRequest, DecisionType } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveApiService {
  private readonly BASE_URL = `${environment.apiUrl}/leaves`;

  constructor(private http: HttpClient) {}

  // ==================== EMPLOYEE APIs ====================

  applyLeave(request: ApplyLeaveRequest): Observable<LeaveResponse> {
    return this.http.post<LeaveResponse>(this.BASE_URL, request);
  }

  getMyLeaves(): Observable<LeaveResponse[]> {
    return this.http.get<LeaveResponse[]>(`${this.BASE_URL}/my`);
  }

  editLeave(leaveId: number, request: EditLeaveRequest): Observable<LeaveResponse> {
    return this.http.patch<LeaveResponse>(`${this.BASE_URL}/${leaveId}`, request);
  }

  deleteLeave(leaveId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${leaveId}`);
  }

  // ==================== ADMIN APIs ====================

  searchLeaves(params: {
    empId?: number;
    status?: string;
    leaveType?: string;
    year?: number;
    fromDate?: string;
    toDate?: string;
  }): Observable<LeaveResponse[]> {
    let queryParams = new URLSearchParams();
    if (params.empId) queryParams.append('empId', params.empId.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.leaveType) queryParams.append('leaveType', params.leaveType);
    if (params.year) queryParams.append('year', params.year.toString());
    if (params.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params.toDate) queryParams.append('toDate', params.toDate);
    
    return this.http.get<LeaveResponse[]>(`${this.BASE_URL}/admin/search?${queryParams.toString()}`);
  }

  getAllLeaves(): Observable<LeaveResponse[]> {
    return this.http.get<LeaveResponse[]>(`${this.BASE_URL}`);
  }

  makeDecision(leaveId: number, decision: DecisionType): Observable<LeaveResponse> {
    return this.http.put<LeaveResponse>(
      `${this.BASE_URL}/${leaveId}/decision?decision=${decision}`,
      {}
    );
  }

  revokeLeave(leaveId: number): Observable<LeaveResponse> {
    return this.http.put<LeaveResponse>(
      `${this.BASE_URL}/${leaveId}/revoke`,
      {}
    );
  }
}
