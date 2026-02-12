export interface LeaveResponse {
  leaveId: number;
  empId: number;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  paidDays: number;
  unpaidDays: number;
  year: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';
  reason: string;
  appliedAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
}

export interface ApplyLeaveRequest {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface EditLeaveRequest {
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
}

export type LeaveType = 'SICK' | 'CASUAL' | 'EARNED' | 'OPTIONAL' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';
export type DecisionType = 'APPROVED' | 'REJECTED';

export interface LeaveSummary {
  leaveType: LeaveType;
  totalUsed: number;
  totalAllowed: number;
  remaining: number;
}
