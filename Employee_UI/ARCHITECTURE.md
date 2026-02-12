# Component Architecture Overview

## Project Structure

```
employee-management-ui/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   ├── login.ts                 → Login component (email + password)
│   │   │   │   ├── login.html               → Login form template
│   │   │   │   ├── login.css                → Login styling (250+ lines)
│   │   │   │   └── login.spec.ts            → Tests
│   │   │   └── register/
│   │   │       ├── register.ts              → Register component (multi-field + image)
│   │   │       ├── register.html            → Registration form template
│   │   │       ├── register.css             → Register styling (300+ lines)
│   │   │       └── register.spec.ts         → Tests
│   │   │
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── auth-api.ts              → Auth service (login, register, token)
│   │   │   │   ├── employee-api.ts          → Employee CRUD service
│   │   │   │   ├── department-api.service.ts → Department CRUD service
│   │   │   │   ├── image-api.ts             → Image handling service
│   │   │   │   ├── image-upload.service.ts  → Image upload/delete service
│   │   │   │   ├── holiday.service.ts       → Holiday management service
│   │   │   │   ├── admin-profile-api.service.ts → Admin profile operations
│   │   │   │   └── ApprovalApiService.ts    → Approval workflows
│   │   │   │
│   │   │   ├── guards/
│   │   │   │   ├── auth-guard.ts            → Login required guard
│   │   │   │   ├── auth-guard.spec.ts       → Tests
│   │   │   │   ├── role-guard.ts            → Admin role guard
│   │   │   │   ├── role-guard.spec.ts       → Tests
│   │   │   │   ├── public-guard-guard.ts    → Redirect if logged in
│   │   │   │   └── public-guard-guard.spec.ts → Tests
│   │   │   │
│   │   │   ├── interceptors/
│   │   │   │   └── jwt-interceptor.ts       → Bearer token injection
│   │   │   │
│   │   │   ├── models/
│   │   │   │   └── holiday.model.ts         → Holiday data models
│   │   │   │
│   │   │   └── auth/
│   │   │       ├── auth.ts
│   │   │       └── auth-state.ts
│   │   │
│   │   ├── employee/
│   │   │   ├── employee.routes.ts           → Child routes (/employees, /create, /edit/:id)
│   │   │   └── pages/
│   │   │       ├── employee-list/
│   │   │       │   ├── employee-list.component.ts       → List with pagination & search
│   │   │       │   ├── employee-list.component.html     → List template
│   │   │       │   ├── employee-list.component.css      → List styling (450+ lines)
│   │   │       │   └── employee-view-modal/
│   │   │       │       ├── employee-view-modal.component.ts   → Image carousel modal
│   │   │       │       ├── employee-view-modal.component.html → Modal template
│   │   │       │       └── employee-view-modal.component.css  → Modal styling (300+ lines)
│   │   │       │
│   │   │       ├── employee-create/
│   │   │       │   ├── employee-create.component.ts     → Create/Edit component
│   │   │       │   ├── employee-create.component.html   → Create/Edit form
│   │   │       │   └── employee-create.component.css    → Form styling (280+ lines)
│   │   │       │
│   │   │       ├── employee-profile/
│   │   │       │   ├── employee-profile.component.ts    → Profile view/edit
│   │   │       │   ├── employee-profile.component.html  → Profile template
│   │   │       │   └── employee-profile.component.css   → Profile styling
│   │   │       │
│   │   │       ├── employee-holidays/
│   │   │       │   ├── employee-holidays.component.ts   → View holidays
│   │   │       │   ├── employee-holidays.component.html → Holidays template
│   │   │       │   └── employee-holidays.component.css  → Holidays styling
│   │   │       │
│   │   │       └── manage-holidays/
│   │   │           ├── manage-holidays.component.ts     → Manage holidays (ADMIN)
│   │   │           ├── manage-holidays.component.html   → Manage template
│   │   │           └── manage-holidays.component.css    → Manage styling
│   │   │
│   │   ├── admin/
│   │   │   ├── admin.routes.ts              → Child routes (/admin/*)
│   │   │   └── pages/
│   │   │       ├── admin-home/
│   │   │       │   ├── admin-home.component.ts         → Dashboard
│   │   │       │   ├── admin-home.component.html       → Dashboard template
│   │   │       │   └── admin-home.component.css        → Dashboard styling
│   │   │       │
│   │   │       ├── department-list/
│   │   │       │   ├── department-list.component.ts    → Department CRUD
│   │   │       │   ├── department-list.component.html  → Department template
│   │   │       │   └── department-list.component.css   → Department styling (350+ lines)
│   │   │       │
│   │   │       └── admin-holidays/
│   │   │           ├── admin-holidays.component.ts     → Holiday management
│   │   │           ├── admin-holidays.component.html   → Holiday template
│   │   │           └── admin-holidays.component.css    → Holiday styling
│   │   │
│   │   ├── leave/
│   │   │   ├── leave.routes.ts              → Leave module routes
│   │   │   ├── models/
│   │   │   │   ├── apply-leave.model.ts     → Apply leave DTO
│   │   │   │   ├── edit-leave.model.ts      → Edit leave DTO
│   │   │   │   ├── leave-response.model.ts  → Leave response DTO
│   │   │   │   └── leave.model.ts           → Leave interfaces
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── leave-api.service.ts     → Leave API calls (7+ methods)
│   │   │   │   └── leave.service.ts         → Leave business logic
│   │   │   │
│   │   │   └── pages/
│   │   │       ├── employee/
│   │   │       │   ├── apply-leave/
│   │   │       │   │   ├── apply-leave.component.ts    → Apply for leave
│   │   │       │   │   ├── apply-leave.component.html  → Apply template
│   │   │       │   │   └── apply-leave.component.css   → Apply styling
│   │   │       │   │
│   │   │       │   ├── my-leaves/
│   │   │       │   │   ├── my-leaves.component.ts      → Personal leave history
│   │   │       │   │   ├── my-leaves.component.html    → My leaves template
│   │   │       │   │   └── my-leaves.component.css     → My leaves styling
│   │   │       │   │
│   │   │       │   └── edit-leave/
│   │   │       │       ├── edit-leave.component.ts     → Edit pending leaves
│   │   │       │       ├── edit-leave.component.html   → Edit template
│   │   │       │       └── edit-leave.component.css    → Edit styling
│   │   │       │
│   │   │       ├── admin/
│   │   │       │   ├── pending-leaves/
│   │   │       │   │   ├── pending-leaves.component.ts → Approve/reject leaves
│   │   │       │   │   ├── pending-leaves.component.html → Pending template
│   │   │       │   │   └── pending-leaves.component.css → Pending styling
│   │   │       │   │
│   │   │       │   └── leave-actions/
│   │   │       │       ├── leave-actions.component.ts  → Manage all leaves
│   │   │       │       ├── leave-actions.component.html → Actions template
│   │   │       │       └── leave-actions.component.css → Actions styling
│   │   │       │
│   │   │       └── leave-management/
│   │   │           ├── leave-management.component.ts   → Unified leave component
│   │   │           ├── leave-management.component.html → Unified template
│   │   │           └── leave-management.component.css  → Unified styling
│   │   │
│   │   ├── shared/
│   │   │   ├── navbar/
│   │   │   │   ├── navbar.component.ts      → Sticky navbar with role badge
│   │   │   │   ├── navbar.component.html    → Navbar template
│   │   │   │   └── navbar.component.css     → Navbar styling (250+ lines)
│   │   │   │
│   │   │   ├── directives/
│   │   │   │   └── lazy-image.directive.ts  → Lazy loading images with caching
│   │   │   │
│   │   │   └── unauthorized.component.ts    → Access denied page
│   │   │
│   │   ├── app.component.ts                 → Root component with navbar outlet
│   │   ├── app.routes.ts                    → Main routing config
│   │   ├── landing.component.ts             → Public landing page
│   │   ├── landing.html                     → Landing template
│   │   └── landing.css                      → Landing styling (400+ lines)
│   │
│   ├── index.html                           → HTML entry point
│   ├── main.ts                              → Application bootstrap
│   ├── styles.css                           → Global styles & design system (600+ lines)
│   └── environments/
│       └── environments.ts                  → Environment config (API base URL)
│
├── angular.json                             → Angular CLI config
├── package.json                             → Dependencies (Angular 21+)
├── tsconfig.json                            → TypeScript config
├── tsconfig.app.json                        → App TypeScript config
├── tsconfig.spec.json                       → Test TypeScript config
├── README.md                                → Project documentation
└── public/                                  → Static assets
```

## Component Dependency Graph

```
AppComponent (root)
├── NavbarComponent (sticky, shows if logged in)
└── RouterOutlet
    ├── LandingComponent (/)
    ├── LoginComponent (/login - PublicGuard)
    ├── RegisterComponent (/register - PublicGuard)
    │
    ├── EmployeeRoutes (/employees - AuthGuard)
    │   ├── EmployeeListComponent (list with pagination & search)
    │   │   └── EmployeeViewModalComponent (image carousel modal)
    │   ├── EmployeeCreateComponent (create & edit with role-based logic)
    │   ├── EmployeeProfileComponent (view/edit profile)
    │   ├── EmployeeHolidaysComponent (view holidays)
    │   └── ManageHolidaysComponent (manage holidays - ADMIN only)
    │
    ├── AdminRoutes (/admin - RoleGuard + ADMIN)
    │   ├── AdminHomeComponent (dashboard)
    │   ├── DepartmentListComponent (department CRUD)
    │   └── AdminHolidaysComponent (holiday management)
    │
    ├── LeaveRoutes (/leave - AuthGuard)
    │   ├── LeaveManagementComponent (unified component - role-based UI)
    │   ├── ApplyLeaveComponent (apply for leave)
    │   ├── MyLeavesComponent (personal leave history)
    │   ├── EditLeaveComponent (edit pending leaves)
    │   ├── PendingLeavesComponent (admin: approve/reject - RoleGuard)
    │   └── LeaveActionsComponent (admin: manage all leaves - RoleGuard)
    │
    └── UnauthorizedComponent (/unauthorized)
```

## Service Dependency Graph

```
AuthApiService (root-provided)
├── login() → Observable<LoginResponse>
├── register() → Observable<UserResponse>
├── saveToken/getToken
├── saveRole/getRole
├── saveUserEmail/getUserEmail
├── isLoggedIn() → boolean
├── isAdmin() → boolean
└── logout()

EmployeeApiService (root-provided)
├── fetchEmployees(page, size, search) → Observable<Page>
├── getEmployeeById(empId) → Observable<Employee>
├── createEmployee(formData) → Observable<Employee>
├── getMyProfile() → Observable<Employee>
├── updateMyProfile(data) → Observable<Employee>
├── adminUpdateEmployee(empId, data) → Observable<Employee>
└── deleteEmployee(empId) → Observable<void>

DepartmentApiService (root-provided)
├── fetchAllDepartments() → Observable<Department[]>
├── getDepartmentById(id) → Observable<Department>
├── fetchEmployeesByDepartment(id) → Observable<Employee[]>
├── createDepartment(payload) → Observable<Department>
└── deleteDepartment(id) → Observable<void>

ImageUploadService (root-provided)
├── uploadImages(empId, files) → Observable<any>
└── deleteImage(imageId) → Observable<void>

HolidayService (root-provided)
├── getHolidays() → Observable<Holiday[]>
├── getHolidayById(id) → Observable<Holiday>
├── createHoliday(holiday) → Observable<Holiday>
├── updateHoliday(id, holiday) → Observable<Holiday>
└── deleteHoliday(id) → Observable<void>

LeaveApiService (root-provided)
├── applyLeave(request) → Observable<LeaveResponse>
├── getMyLeaves() → Observable<LeaveResponse[]>
├── editLeave(leaveId, request) → Observable<LeaveResponse>
├── getPendingLeaves() → Observable<LeaveResponse[]>
├── getAllLeaves() → Observable<LeaveResponse[]>
├── approveRejectLeave(leaveId, decision) → Observable<LeaveResponse>
└── revokeLeave(leaveId) → Observable<LeaveResponse>

AdminProfileApiService (root-provided)
└── (admin-specific profile operations)

ApprovalApiService (root-provided)
└── (approval workflow operations)

JwtInterceptor (HTTP_INTERCEPTORS provider)
└── intercept() → Adds Bearer token to all requests

LazyImageDirective (standalone directive)
├── Uses IntersectionObserver for lazy loading
├── Static cache (Map) for loaded images
└── Prevents duplicate API calls
```

## Guard Logic Flow

```
User Navigation
    ↓
Router checks guards
    ↓
AuthGuard checks isLoggedIn()
├─ YES → Continue
└─ NO → Redirect to /login

RoleGuard checks role against route.data.roles
├─ ADMIN in roles[] → Continue
└─ NOT ADMIN → Redirect to /unauthorized

PublicGuard checks isLoggedIn()
├─ YES → Redirect to /employees
└─ NO → Continue (allow access)
```

## Authentication Flow

```
User Registration
    ↓
POST /api/auth/register (FormData)
    ↓
Backend creates user with image
    ↓
Redirect to /login after 2 seconds

User Login
    ↓
POST /api/auth/login {email, password}
    ↓
Backend returns {token, role}
    ↓
AuthApiService.saveToken() → localStorage
AuthApiService.saveRole() → localStorage
AuthApiService.saveUserEmail() → localStorage
    ↓
Navigate to /employees
    ↓
Navbar appears (isLoggedIn() checks token)
```

## HTTP Request Flow with Interceptor

```
Component calls: this.empApi.fetchEmployees(0, 5, 'john')
    ↓
HttpClient.get('/api/employees', {params: ...})
    ↓
JwtInterceptor intercepts
    ↓
Gets token from AuthApiService.getToken()
    ↓
Clones request and adds:
  Authorization: Bearer {token}
    ↓
Sends to backend
    ↓
Backend validates token
    ↓
Returns response
    ↓
Component receives Observable
    ↓
subscribe() updates component state
```

## Data Flow: Employee List

```
EmployeeListComponent.ngOnInit()
    ↓
loadDepartments() - for dropdown
loadEmployees(currentPage: 1, pageSize: 5)
    ↓
Convert 1-based page to 0-based:
  const backendPage = currentPage - 1
    ↓
this.empApi.fetchEmployees(backendPage, 5, searchTerm)
    ↓
GET /api/employees?page=0&size=5&search=
    ↓
Backend returns:
  {
    content: [...employees],
    totalPages: 10,
    totalElements: 50
  }
    ↓
Component processes:
  this.employees = response.content
  this.totalPages = response.totalPages
  this.totalElements = response.totalElements
    ↓
Template renders *ngFor loop over employees
    ↓
User clicks next button
    ↓
currentPage++ → triggers loadEmployees again
```

## Data Flow: Create Employee (ADMIN)

```
User clicks "Create Employee"
    ↓
Navigate to /employees/create
    ↓
EmployeeCreateComponent.ngOnInit()
  - isEdit = false (no :id param)
  - Loads departments for dropdown
    ↓
User fills form:
  - name, email, age, gender, deptId
  - Uploads images → onImageChange()
    ↓
FileReader.readAsDataURL() creates previews
    ↓
User clicks Submit
    ↓
submitCreate() creates FormData:
  - Blob with JSON: {name, email, age, gender, deptId}
  - Appends each image file
    ↓
POST /api/employees (multipart/form-data)
    ↓
Backend creates employee with images
    ↓
Success message displays
    ↓
Navigate to /employees after 1.5 seconds
```

## Data Flow: Edit Employee (ADMIN)

```
User clicks "Edit" on employee card
    ↓
Navigate to /employees/edit/5
    ↓
EmployeeCreateComponent.ngOnInit()
  - empId = 5 (from :id param)
  - isEdit = true
  - Loads departments
  - Calls loadEmployee()
    ↓
getEmployeeById(5) loads existing data
    ↓
Form pre-fills with:
  - name, email, age, gender, deptId
  - existingImages populated
    ↓
User modifies fields
    ↓
User clicks Submit
    ↓
submitEdit() detects isAdmin = true
    ↓
Creates JSON object: {name, email, age, gender, deptId}
    ↓
PUT /api/admin/employees/5 (JSON)
    ↓
Backend updates employee
    ↓
Success message displays
    ↓
Navigate to /employees after 1.5 seconds
```

## Data Flow: Edit Profile (EMPLOYEE)

```
Employee sees /employees/edit/me (or auto-routed)
    ↓
EmployeeCreateComponent.ngOnInit()
  - Checks authApi.isAdmin() = false
  - Loads current employee data via getMyProfile()
    ↓
Form shows: name, age, gender (email disabled)
    ↓
User modifies fields
    ↓
User clicks Submit
    ↓
submitEdit() detects isAdmin = false
    ↓
Creates partial JSON: {name, age, gender} (only changed)
    ↓
PATCH /api/employees/me (JSON)
    ↓
Backend updates only provided fields
    ↓
Success message displays
    ↓
Navigate to /employees after 1.5 seconds
```

## Data Flow: Leave Management

### Employee Applies for Leave
```
User navigates to /leave
    ↓
LeaveManagementComponent (unified) loads
    ↓
Role check: EMPLOYEE
    ↓
Shows: Apply Leave Form + My Leaves Table
    ↓
User fills form:
  - Leave Type: SICK, CASUAL, EARNED, OPTIONAL, UNPAID
  - Start Date, End Date
  - Reason (min 10 chars)
    ↓
Form validation checks:
  - All fields required
  - Start Date ≤ End Date
  - Reason length ≥ 10
    ↓
User clicks Submit
    ↓
POST /api/leaves
  {leaveType, startDate, endDate, reason}
    ↓
Backend creates leave with status: PENDING
    ↓
Success message displays
    ↓
Refresh My Leaves table
```

### Admin Approves/Rejects Leave
```
Admin navigates to /leave
    ↓
LeaveManagementComponent (unified) loads
    ↓
Role check: ADMIN
    ↓
Shows: Apply Form + My Leaves + Pending Leaves + Processed Leaves
    ↓
GET /api/leaves/pending
    ↓
Displays pending leaves table with Approve/Reject buttons
    ↓
Admin clicks "Approve" on leaveId: 10
    ↓
Confirmation modal shows
    ↓
PUT /api/leaves/10/decision?decision=APPROVED
    ↓
Backend updates leave status
    ↓
Success message displays
    ↓
Refresh pending leaves table
```

### Admin Revokes Approved Leave
```
Admin in Processed Leaves section
    ↓
Selects filter: APPROVED
    ↓
GET /api/leaves (filtered client-side)
    ↓
Displays approved leaves
    ↓
"Revoke" button enabled only when:
  - Status = APPROVED
  - Today < Start Date
    ↓
Admin clicks "Revoke" on leaveId: 15
    ↓
Confirmation modal shows
    ↓
PUT /api/leaves/15/revoke
    ↓
Backend updates status to REVOKED
    ↓
Success message displays
    ↓
Refresh processed leaves table
```

## Data Flow: Holiday Management

### View Holidays (All Users)
```
User navigates to /holidays
    ↓
EmployeeHolidaysComponent loads
    ↓
GET /api/holidays
    ↓
Backend returns all holidays
    ↓
Component filters by year (optional)
    ↓
Displays holiday cards with:
  - Holiday name, Date, Description
    ↓
Calendar-like view (optional)
```

### Manage Holidays (ADMIN)
```
Admin navigates to /admin/holidays
    ↓
AdminHolidaysComponent loads
    ↓
GET /api/holidays
    ↓
Admin clicks "Create Holiday"
    ↓
Modal shows form: Name, Date, Description
    ↓
POST /api/holidays
  {name, date, description}
    ↓
Backend creates holiday
    ↓
Success message displays
    ↓
Refresh holiday list
    ↓
Admin can Edit or Delete holidays
```

## Data Flow: Image Management

### Upload Images (During Employee Creation)
```
User selects multiple images in form
    ↓
onImageChange(event) in EmployeeCreateComponent
    ↓
For each file:
  - FileReader.readAsDataURL()
  - Creates preview
  - Stores in imageFiles[]
    ↓
User submits form
    ↓
Employee data saved first → Backend returns empId
    ↓
uploadImagesIfNeeded(empId)
    ↓
POST /api/images/upload/{empId}
  FormData with multiple files
    ↓
Backend stores images
    ↓
Success message displays
```

### Lazy Load Images (Display)
```
Template: <img [appLazyImage]="imageUrl" />
    ↓
LazyImageDirective attached
    ↓
IntersectionObserver created
    ↓
Image element scrolls into viewport
    ↓
Check static cache: Has imageUrl been loaded?
├─ YES → Use cached blob URL
└─ NO → Fetch from backend
    ↓
GET /api/images/by-name/{fileName}
    ↓
Convert response to Blob
    ↓
Create object URL: blob:http://...
    ↓
Store in static cache
    ↓
Set img.src = blobUrl
    ↓
Image displays
    ↓
Next time same image needed → Use cached URL
```

### Delete Image
```
User in edit mode
    ↓
Clicks "X" on existing image
    ↓
Confirmation modal shows
    ↓
removeExistingImage(imageId)
    ↓
DELETE /api/images/{imageId}
    ↓
Backend deletes image
    ↓
Remove from existingImages array
    ↓
Update UI
```

## Pagination Logic

```
User on Page 5 (UI display)
    ↓
currentPage = 5 (1-based in component)
    ↓
loadEmployees() called
    ↓
const backendPage = currentPage - 1 = 4
    ↓
API call: GET /api/employees?page=4&size=5
    ↓
Backend returns items 20-24 (0-indexed)
    ↓
Template shows: "Page 5 of 10"
    ↓
getPaginationPages() calculates:
  startPage = max(1, 5-2) = 3
  endPage = min(10, 3+4) = 7
  displayPages = [3, 4, 5, 6, 7]
    ↓
Renders 5 page buttons (smart window)
```

## State Management Strategy

```
Authentication State:
  - AuthApiService (singleton, root-provided)
  - localStorage for persistence
  - Used by: AuthGuard, RoleGuard, AppComponent, Navbar

Component Local State:
  - EmployeeListComponent: employees[], currentPage, searchTerm
  - EmployeeCreateComponent: form{}, imageFiles[], existingImages[]
  - DepartmentListComponent: departments[], showCreateModal, newDeptName

HTTP State:
  - Observable streams with subscribe()
  - No global state management (Redux/NgRx)
  - Error/loading/success handled per component
  - localStorage cleared on logout
```

## File Statistics

| Category | Files | Lines | Purpose |
|----------|-------|-------|---------|
| Services | 8+ | 400+ | API calls, token mgmt, image/leave/holiday handling |
| Guards | 3 | 100+ | Route protection (Auth/Role/Public) |
| Components (TS) | 15+ | 2000+ | Logic & templates |
| Components (HTML) | 15+ | 800+ | UI templates |
| Components (CSS) | 15+ | 4000+ | Styling |
| Models | 10+ | 200+ | TypeScript interfaces |
| Directives | 1 | 50+ | Lazy image loading |
| Routing | 4 | 150+ | Route configuration |
| Global | 1 | 600+ | CSS variables & base |
| Bootstrap | 1 | 20 | App init |
| Total | 60+ | 8000+ | Complete app |

## Key Technologies

- **Framework**: Angular 21+ (standalone components)
- **HTTP**: HttpClient with JwtInterceptor
- **Routing**: provideRouter with lazy loading
- **Forms**: FormsModule (template-driven) & ReactiveFormsModule
- **Styling**: Pure CSS (no external UI framework)
- **State**: localStorage + component state
- **Async**: RxJS Observables
- **Build**: Angular CLI 21+
- **Testing**: Vitest
- **Package Manager**: npm 11.6.2

## Testing Files Present

- login.spec.ts
- register.spec.ts
- auth-guard.spec.ts
- role-guard.spec.ts
- public-guard-guard.spec.ts
- auth-state.spec.ts
- auth.spec.ts

(Ready for unit tests with ng test)

## Development Commands

```bash
# Start dev server
ng serve

# Build for prod
ng build

# Run tests
ng test

# Lint code (if configured)
ng lint
```

---

**Total Components**: 15+ (all standalone)  
**Total Services**: 8+ (all root-provided)  
**Total Guards**: 3 (all injectable)  
**Total Routes**: 12+ (with lazy loading)  
**Total Models**: 10+ (TypeScript interfaces)  
**Total CSS**: 4000+ lines (no external framework)  
**Total TS**: 2000+ lines of logic  
**Angular Version**: 21.1.0  
**TypeScript Version**: 5.9.2
