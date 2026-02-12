# Leave Management Module - Documentation

## Overview
This is a complete Leave Management system integrated into your Angular Employee Management application. It includes full CRUD operations for leave requests with role-based access control.

---

## 📁 Module Structure

```
leave/
├── models/
│   ├── apply-leave.model.ts          # Request DTO for creating leave
│   ├── edit-leave.model.ts           # Request DTO for updating leave
│   └── leave-response.model.ts       # Response DTO from backend
├── services/
│   └── leave.service.ts              # Service with 7 API methods
├── pages/
│   ├── employee/
│   │   ├── apply-leave/              # Form to apply for new leave
│   │   ├── my-leaves/                # View all personal leaves
│   │   └── edit-leave/               # Edit pending leaves only
│   └── admin/
│       ├── pending-leaves/           # View & approve/reject pending requests
│       └── leave-actions/            # Manage approved leaves & revoke
└── leave.routes.ts                   # Module routing configuration
```

---

## 🔐 Authentication & Authorization

### JWT Integration
- JWT token automatically attached via existing `HttpInterceptor`
- Token stored in `localStorage` as `token`
- All API calls include `Authorization: Bearer <token>` header

### Role-Based Access
- **EMPLOYEE** role can:
  - Apply for leave
  - View own leaves
  - Edit pending leaves only

- **ADMIN** role can:
  - View pending leave requests
  - Approve/reject pending leaves
  - Revoke approved leaves (before start date)

### Guards Applied
- `AuthGuard`: All routes require authentication
- `RoleGuard`: Admin routes restricted to ADMIN role

---

## 🌐 API Endpoints

### Employee APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/leaves` | Apply for new leave |
| GET | `/api/leaves/my` | Get all personal leaves |
| PATCH | `/api/leaves/{leaveId}` | Edit pending leave |

### Admin APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaves/pending` | Get all pending leaves |
| PUT | `/api/leaves/{leaveId}/decision?decision=APPROVED` | Approve leave |
| PUT | `/api/leaves/{leaveId}/decision?decision=REJECTED` | Reject leave |
| PUT | `/api/leaves/{leaveId}/revoke` | Revoke approved leave |
| GET | `/api/leaves` | Get all leaves (for admin actions page) |

**Base URL**: `http://localhost:8080/api` (configured in `environments.ts`)

---

## 📊 Data Models

### LeaveResponse
```typescript
{
  leaveId: number;
  empId: number;
  employeeName: string;
  leaveType: string;              // SICK_LEAVE, CASUAL_LEAVE, etc.
  startDate: string;              // ISO date string
  endDate: string;                // ISO date string
  totalDays: number;
  paidDays: number;
  unpaidDays: number;
  year: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';
  reason: string;
  appliedAt: string;              // ISO date string
  approvedAt?: string;            // Optional
  approvedBy?: string;            // Optional
}
```

### ApplyLeaveRequest
```typescript
{
  leaveType: string;              // Required
  startDate: string;              // Required, ISO format
  endDate: string;                // Required, ISO format
  reason: string;                 // Required, min 10 chars
}
```

### EditLeaveRequest
```typescript
{
  leaveType?: string;             // Optional
  startDate?: string;             // Optional
  endDate?: string;               // Optional
  reason?: string;                // Optional
}
```

---

## 🎨 UI Features

### Forms & Validation
- **Reactive Forms** with Angular FormBuilder
- **Client-side validation**:
  - All fields required
  - Start date ≤ End date
  - Reason minimum 10 characters
- **Real-time error messages**
- **Disabled submit** when form invalid

### Status Badges
Color-coded status indicators:
- 🟡 **PENDING**: Yellow
- 🟢 **APPROVED**: Green
- 🔴 **REJECTED**: Red
- ⚪ **REVOKED**: Gray

### User Experience
- Loading spinners during API calls
- Success/error toast messages
- Confirmation modals for critical actions
- Responsive tables with horizontal scroll
- Empty states with helpful messages
- Disabled buttons with tooltips

---

## 🧠 Business Rules

### Employee Rules
1. Can apply for leave anytime
2. Can view all personal leave history
3. Can **only edit PENDING** leaves
4. Edit button disabled for non-pending statuses
5. Uses **PATCH** for partial updates

### Admin Rules
1. Can view all pending leave requests
2. Can approve/reject pending leaves
3. Can **only revoke APPROVED** leaves
4. Revoke disabled if:
   - Status ≠ APPROVED
   - Today ≥ startDate (leave already started)
5. Confirmation modal required for:
   - Approve
   - Reject
   - Revoke

---

## 🗺️ Routing

### Routes Added to App
```typescript
{
  path: 'leave',
  canActivate: [AuthGuard],
  loadChildren: () => import('./leave/leave.routes')
}
```

### Leave Module Routes
| Path | Component | Access | Description |
|------|-----------|--------|-------------|
| `/leave/apply` | ApplyLeaveComponent | All authenticated | Apply new leave |
| `/leave/my-leaves` | MyLeavesComponent | All authenticated | View personal leaves |
| `/leave/edit/:id` | EditLeaveComponent | All authenticated | Edit pending leave |
| `/leave/admin/pending` | PendingLeavesComponent | ADMIN only | Manage pending requests |
| `/leave/admin/actions` | LeaveActionsComponent | ADMIN only | Manage processed leaves |

---

## 🧭 Navbar Integration

### Employee View
- 📝 Apply Leave
- 📋 My Leaves
- 🗓️ Manage Holidays (existing)

### Admin View
- 🏢 Departments (existing)
- 🗓️ Holiday Management (existing)
- ⏳ Pending Leaves (new)
- 🔧 Leave Actions (new)

**Role-based visibility**: Links shown/hidden based on `auth.isAdmin()`

---

## 🛠️ Service Methods

### LeaveService Methods
```typescript
// Employee APIs
applyLeave(data: ApplyLeaveRequest): Observable<LeaveResponse>
getMyLeaves(): Observable<LeaveResponse[]>
editLeave(leaveId: number, data: EditLeaveRequest): Observable<LeaveResponse>

// Admin APIs
getPendingLeaves(): Observable<LeaveResponse[]>
getAllLeaves(): Observable<LeaveResponse[]>
approveLeave(leaveId: number): Observable<LeaveResponse>
rejectLeave(leaveId: number): Observable<LeaveResponse>
revokeLeave(leaveId: number): Observable<LeaveResponse>
```

---

## ⚠️ Error Handling

### HTTP Error Responses
- **401 Unauthorized**: Token expired/invalid → Redirect to login
- **403 Forbidden**: Insufficient permissions → Show unauthorized page
- **400 Bad Request**: Validation errors → Display error message
- **500 Server Error**: Backend issue → Display generic error

### Error Display
```typescript
errorMessage = err.error?.message || 'Default error message';
```

---

## 🚀 Testing & Usage

### As Employee
1. Login as employee
2. Navigate to "Apply Leave"
3. Fill form and submit
4. View status in "My Leaves"
5. Edit pending leaves if needed

### As Admin
1. Login as admin
2. Navigate to "Pending Leaves"
3. Review and approve/reject requests
4. Navigate to "Leave Actions"
5. Revoke approved leaves if needed (before start date)

---

## 📦 Dependencies

### Required Imports
- `@angular/common` - CommonModule
- `@angular/forms` - ReactiveFormsModule, FormsModule
- `@angular/router` - Router, RouterModule
- `@angular/common/http` - HttpClient (already configured)

### Existing Infrastructure Used
- `HttpInterceptor` for JWT
- `AuthGuard` for authentication
- `RoleGuard` for authorization
- `AuthApiService` for role checking
- `environment.apiUrl` for base URL

---

## ✅ Production Ready Features

### Code Quality
✓ Strict TypeScript typing
✓ No console logs
✓ No mock data
✓ Clean separation of concerns
✓ Reusable models
✓ Single responsibility per component

### Security
✓ JWT token authentication
✓ Role-based authorization
✓ Route guards
✓ Input validation
✓ CSRF protection via HttpInterceptor

### UX/UI
✓ Loading states
✓ Error handling
✓ Success feedback
✓ Responsive design
✓ Accessible forms
✓ Professional styling

---

## 🔧 Configuration

### Environment Variables
Located in `src/environments/environments.ts`:
```typescript
export const environment = {
  apiUrl: 'http://localhost:8080/api'
};
```

Change for production:
```typescript
export const environment = {
  apiUrl: 'https://your-production-domain.com/api'
};
```

---

## 📝 Notes

1. **Backend Compatibility**: This module expects exact API endpoints and response formats as specified in requirements
2. **Date Format**: All dates in ISO format (`YYYY-MM-DD`)
3. **Leave Types**: Backend should support the leave types defined in components
4. **Pagination**: Not implemented - assumes reasonable data volumes
5. **Search/Filter**: Only status filter in admin actions page

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Routes not working
- **Solution**: Ensure `leave.routes.ts` is imported in `app.routes.ts`

**Issue**: 401 errors on all requests
- **Solution**: Check JWT token in localStorage, verify interceptor is configured

**Issue**: Edit button always disabled
- **Solution**: Verify leave status is "PENDING" in response

**Issue**: Admin can't access admin routes
- **Solution**: Check role in localStorage is exactly "ADMIN" (case-sensitive)

---

## 📄 File Checklist

✅ **Models** (3 files)
  - `apply-leave.model.ts`
  - `edit-leave.model.ts`
  - `leave-response.model.ts`

✅ **Service** (1 file)
  - `leave.service.ts`

✅ **Employee Components** (9 files - 3 components × 3 files each)
  - `apply-leave.component.ts/html/css`
  - `my-leaves.component.ts/html/css`
  - `edit-leave.component.ts/html/css`

✅ **Admin Components** (6 files - 2 components × 3 files each)
  - `pending-leaves.component.ts/html/css`
  - `leave-actions.component.ts/html/css`

✅ **Routing** (1 file)
  - `leave.routes.ts`

✅ **Integration** (2 files modified)
  - `app.routes.ts` - Added leave route
  - `navbar.component.html` - Added leave links

**Total**: 22 files created/modified

---

## 🎯 Success Criteria

✓ Employees can apply for leaves
✓ Employees can view their leave history
✓ Employees can edit pending leaves only
✓ Admins can view pending requests
✓ Admins can approve/reject leaves
✓ Admins can revoke approved leaves
✓ Status badges display correctly
✓ Role-based navigation works
✓ All forms validate properly
✓ Error messages display
✓ Success messages display
✓ Confirmation modals work
✓ Responsive design
✓ No console errors
✓ Clean, production-quality code

---

**Module Created By**: GitHub Copilot
**Date**: February 3, 2026
**Version**: 1.0.0
**Status**: ✅ Complete & Production Ready
