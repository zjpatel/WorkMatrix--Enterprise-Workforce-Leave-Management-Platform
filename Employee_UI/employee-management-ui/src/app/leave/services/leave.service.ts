import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environments';
import { ApplyLeaveRequest } from '../models/apply-leave.model';
import { EditLeaveRequest } from '../models/edit-leave.model';
import { LeaveResponse } from '../models/leave-response.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private readonly BASE_URL = `${environment.apiUrl}/leaves`;
  // Cache and stream for employee leaves
  private myLeavesSubject = new BehaviorSubject<LeaveResponse[]>([]);

  constructor(private http: HttpClient) {}

  // ==================== EMPLOYEE APIs ====================

  applyLeave(data: ApplyLeaveRequest): Observable<LeaveResponse> {
    return this.http.post<LeaveResponse>(this.BASE_URL, data).pipe(
      tap(() => {
        this.refreshMyLeaves().subscribe();
      })
    );
  }

  // One-shot fetch
  getMyLeaves(): Observable<LeaveResponse[]> {
    return this.http.get<LeaveResponse[]>(`${this.BASE_URL}/my`);
  }

  // Stream (preferred): subscribe for near real-time updates
  getMyLeaves$(): Observable<LeaveResponse[]> {
    return this.myLeavesSubject.asObservable();
  }

  // Refresh and push into stream
  refreshMyLeaves(): Observable<LeaveResponse[]> {
    return this.http.get<LeaveResponse[]>(`${this.BASE_URL}/my`).pipe(
      tap((list) => this.myLeavesSubject.next(list))
    );
  }

  editLeave(leaveId: number, data: EditLeaveRequest): Observable<LeaveResponse> {
    return this.http.patch<LeaveResponse>(`${this.BASE_URL}/${leaveId}`, data).pipe(
      tap(() => {
        this.refreshMyLeaves().subscribe();
      })
    );
  }

  deleteLeave(leaveId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${leaveId}`).pipe(
      tap(() => {
        this.refreshMyLeaves().subscribe();
      })
    );
  }

  // ==================== ADMIN APIs ====================

  getPendingLeaves(): Observable<LeaveResponse[]> {
    return this.http.get<LeaveResponse[]>(`${this.BASE_URL}/pending`);
  }

  getAllLeaves(): Observable<LeaveResponse[]> {
    return this.http.get<LeaveResponse[]>(`${this.BASE_URL}`);
  }

  approveLeave(leaveId: number): Observable<LeaveResponse> {
    return this.http.put<LeaveResponse>(
      `${this.BASE_URL}/${leaveId}/decision?decision=APPROVED`,
      {}
    );
  }

  rejectLeave(leaveId: number): Observable<LeaveResponse> {
    return this.http.put<LeaveResponse>(
      `${this.BASE_URL}/${leaveId}/decision?decision=REJECTED`,
      {}
    );
  }

  revokeLeave(leaveId: number): Observable<LeaveResponse> {
    return this.http.put<LeaveResponse>(
      `${this.BASE_URL}/${leaveId}/revoke`,
      {}
    );
  }

  // ==================== ADMIN SEARCH ====================
  searchLeaves(params: {
    empId?: number;
    status?: string;
    leaveType?: string;
    year?: number;
    fromDate?: string;
    toDate?: string;
  }): Observable<LeaveResponse[]> {
    const queryParams = new URLSearchParams();
    if (params.empId !== undefined) queryParams.append('empId', String(params.empId));
    if (params.status) queryParams.append('status', params.status);
    if (params.leaveType) queryParams.append('leaveType', params.leaveType);
    if (params.year !== undefined) queryParams.append('year', String(params.year));
    if (params.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params.toDate) queryParams.append('toDate', params.toDate);

    return this.http.get<LeaveResponse[]>(`${this.BASE_URL}/admin/search?${queryParams.toString()}`);
  }
}
