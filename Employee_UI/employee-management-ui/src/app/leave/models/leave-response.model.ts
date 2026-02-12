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
  approvedAt?: string;
  approvedBy?: string;
}
