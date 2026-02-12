# Employee Management UI - Angular Frontend

A complete, production-ready Angular 21+ standalone components application for employee management with JWT authentication, role-based access control, leave management, holiday management, and modern responsive UI.

## Features

✅ **Authentication System**
- User registration with profile image upload
- JWT-based login with secure token storage
- Role-based access control (ADMIN / EMPLOYEE)
- Auto-logout and permission redirects
- JWT interceptor for automatic token injection

✅ **Employee Management**
- Paginated employee list (converts 0-based backend to 1-based UI)
- Search functionality with debounce (300ms)
- Create employee with multi-image upload (ADMIN only)
- Edit employee profile (ADMIN PUT / EMPLOYEE PATCH)
- Delete employee (ADMIN only)
- Employee profile view with image carousel
- Status badges (APPROVED, PENDING, REJECTED)
- Lazy image loading with caching for performance

✅ **Department Management** (ADMIN only)
- List all departments
- Create new department
- Delete department with confirmation

✅ **Leave Management** (Unified System)
- Apply for leave (All authenticated users)
- View personal leave history
- Edit pending leaves
- Leave status badges (PENDING, APPROVED, REJECTED, REVOKED)
- **Admin features:**
  - View and approve/reject pending leave requests
  - Revoke approved leaves (before start date)
  - Filter processed leaves by status

✅ **Holiday Management**
- View company holidays (All users)
- Create/edit/delete holidays (ADMIN only)
- Holiday calendar view
- Holiday status management

✅ **User Experience**
- Beautiful gradient-based SaaS UI design
- Responsive layout (desktop, tablet, mobile)
- Modal dialogs for actions
- Error and success notifications
- Loading states and spinners
- Backdrop blur effects
- Lazy loading images
- Optimized performance

## Technology Stack

- **Framework**: Angular 21+ (Standalone Components)
- **HTTP Client**: HttpClient with JwtInterceptor for automatic token injection
- **Routing**: Standalone route-based with lazy loading and guards (AuthGuard, RoleGuard, PublicGuard)
- **Forms**: FormsModule for template-driven forms and ReactiveFormsModule for complex forms
- **Styling**: Pure CSS with CSS variables, animations, and responsive breakpoints (no external UI framework)
- **State Management**: localStorage for JWT token, user role, and session data
- **Testing**: Vitest for unit tests
- **Package Manager**: npm 11.6.2

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   ├── login.ts (component logic)
│   │   │   ├── login.html (template)
│   │   │   └── login.css (styling)
│   │   └── register/
│   │       ├── register.ts
│   │       ├── register.html
│   │       └── register.css
│   ├── core/
│   │   ├── services/
│   │   │   ├── auth-api.ts (login, register, token management)
│   │   │   ├── employee-api.ts (CRUD operations)
│   │   │   ├── department-api.service.ts (department CRUD)
│   │   │   ├── image-api.ts (image handling)
│   │   │   ├── image-upload.service.ts (image upload/delete)
│   │   │   ├── holiday.service.ts (holiday management)
│   │   │   ├── admin-profile-api.service.ts (admin profile operations)
│   │   │   └── ApprovalApiService.ts (approval workflows)
│   │   ├── guards/
│   │   │   ├── auth-guard.ts (login check)
│   │   │   ├── role-guard.ts (ADMIN check)
│   │   │   └── public-guard-guard.ts (redirect if logged in)
│   │   ├── interceptors/
│   │   │   └── jwt-interceptor.ts (Bearer token injection)
│   │   └── models/
│   │       └── holiday.model.ts (holiday data models)
│   ├── employee/
│   │   ├── employee.routes.ts (child routes)
│   │   └── pages/
│   │       ├── employee-list/
│   │       │   ├── employee-list.component.ts (pagination, search, delete)
│   │       │   ├── employee-list.component.html
│   │       │   ├── employee-list.component.css
│   │       │   └── employee-view-modal/ (image carousel modal)
│   │       ├── employee-create/
│   │       │   ├── employee-create.component.ts (create & edit with role-based behavior)
│   │       │   ├── employee-create.component.html
│   │       │   └── employee-create.component.css
│   │       ├── employee-profile/ (profile management)
│   │       ├── employee-holidays/ (view holidays)
│   │       └── manage-holidays/ (ADMIN only)
│   ├── admin/
│   │   ├── admin.routes.ts (admin-only routes)
│   │   └── pages/
│   │       ├── admin-home/ (dashboard)
│   │       ├── department-list/ (CRUD operations)
│   │       └── admin-holidays/ (holiday management)
│   ├── leave/
│   │   ├── leave.routes.ts (leave module routes)
│   │   ├── models/
│   │   │   ├── apply-leave.model.ts (apply leave DTO)
│   │   │   ├── edit-leave.model.ts (edit leave DTO)
│   │   │   ├── leave-response.model.ts (leave response DTO)
│   │   │   └── leave.model.ts (leave interfaces)
│   │   ├── services/
│   │   │   ├── leave-api.service.ts (leave API calls)
│   │   │   └── leave.service.ts (leave business logic)
│   │   └── pages/
│   │       ├── employee/
│   │       │   ├── apply-leave/ (apply for leave)
│   │       │   ├── my-leaves/ (personal leave history)
│   │       │   └── edit-leave/ (edit pending leaves)
│   │       ├── admin/
│   │       │   ├── pending-leaves/ (approve/reject)
│   │       │   └── leave-actions/ (manage all leaves)
│   │       └── leave-management/ (unified leave component)
│   ├── shared/
│   │   ├── navbar/ (sticky navigation with role badges)
│   │   ├── unauthorized.component.ts (access denied page)
│   │   └── directives/
│   │       └── lazy-image.directive.ts (lazy loading images)
│   ├── app.component.ts (root component)
│   ├── app.routes.ts (main routing config)
│   ├── landing.component.ts (public home page)
│   ├── landing.html
│   └── landing.css
├── styles.css (global CSS variables, base styles, animations)
├── environments/
│   └── environments.ts (API base URL configuration)
└── main.ts (bootstrap with HTTP client & interceptors)
```

## Key Implementation Details

### Authentication Flow
1. User registers with email, password, name, age, gender, and optional profile image
2. Backend returns JWT token and user role (ADMIN/EMPLOYEE)
3. AuthApiService stores token and role in localStorage
4. JwtInterceptor automatically adds "Authorization: Bearer {token}" to all HTTP requests
5. AuthGuard protects authenticated routes (/employees, /leave, /admin)
6. RoleGuard protects ADMIN-only routes (/admin/**)
7. PublicGuard redirects authenticated users from login/register pages

### Pagination (0-based ↔ 1-based Conversion)
- Backend uses 0-based pagination: `page=0, 1, 2...`
- UI displays 1-based: `Page 1, 2, 3...`
- EmployeeListComponent converts: `const backendPage = currentPage - 1`
- Smart pagination shows 5-page window (e.g., pages 8-12 when viewing page 10)

### PATCH vs PUT Behavior
- **PATCH /api/employees/me**: Used by employees to update only their own profile with partial data
- **PUT /api/admin/employees/{id}**: Used by admins to fully update any employee with all required fields
- EmployeeCreateComponent detects user role and uses correct HTTP method

### Image Handling
- Profile images stored as files during registration and employee creation
- Images displayed via carousel in employee view modal
- Image URL format: `http://localhost:8080/api/images/by-name/{fileName}`
- Multiple images supported per employee
- **LazyImageDirective**: Implements lazy loading with IntersectionObserver
- **Static Caching**: Prevents duplicate API calls for same image
- **Performance**: Images load only when scrolled into view
- Image upload service handles FormData multipart uploads
- Delete existing images with confirmation

### Design System
- **Primary Gradient**: #667eea → #764ba2 (purple to violet)
- **Success**: #22c55e (green)
- **Danger**: #ef4444 (red)
- **Warning**: #f59e0b (amber)
- **Border Radius**: 12px on cards, 8-10px on buttons
- **Shadows**: Soft shadows with hover elevation effects
- **Animations**: 0.3s smooth transitions, modal slide-in animations

## Backend API Integration

The frontend consumes the following Spring Boot APIs:

### Authentication APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login with email/password |
| POST | /api/auth/register | Register with profile image |

### Employee APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | List employees (paginated, searchable) |
| GET | /api/employees/{id} | Get single employee by ID |
| GET | /api/employees/me | Get logged-in user's profile |
| POST | /api/employees | Create new employee (ADMIN + images) |
| PATCH | /api/employees/me | Update own profile |
| PUT | /api/admin/employees/{id} | Update any employee (ADMIN) |
| DELETE | /api/employees/{id} | Delete employee |

### Department APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/departments | List all departments |
| POST | /api/departments | Create department (ADMIN) |
| DELETE | /api/departments/{id} | Delete department (ADMIN) |

### Image APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/images/by-name/{fileName} | Get image by filename |
| POST | /api/images/upload/{empId} | Upload multiple images |
| DELETE | /api/images/{imageId} | Delete image |

### Leave Management APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/leaves | Apply for new leave |
| GET | /api/leaves/my | Get personal leave history |
| PATCH | /api/leaves/{leaveId} | Edit pending leave |
| GET | /api/leaves/pending | Get pending leaves (ADMIN) |
| GET | /api/leaves | Get all leaves (ADMIN) |
| PUT | /api/leaves/{leaveId}/decision | Approve/Reject leave (ADMIN) |
| PUT | /api/leaves/{leaveId}/revoke | Revoke approved leave (ADMIN) |

### Holiday APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/holidays | List all holidays |
| POST | /api/holidays | Create holiday (ADMIN) |
| PUT | /api/holidays/{id} | Update holiday (ADMIN) |
| DELETE | /api/holidays/{id} | Delete holiday (ADMIN) |

## Running the Application

### Prerequisites
- Node.js 18+ and npm 10+
- Angular CLI 21+ installed globally
- Backend Spring Boot server running on http://localhost:8080

### Start Development Server
```bash
npm install
ng serve
```
Application will be available at `http://localhost:4200/`

### Build for Production
```bash
ng build
```
Output files will be in `dist/` directory.

### User Flows

**1. Public User (New)**
```
Landing Page → Register → Login → Employee List (view mode) → View Employee Modal
```

**2. EMPLOYEE (Authenticated)**
```
Login → Employee List (view only) → View Profile → Edit Profile (PATCH /employees/me)
      → Leave Management (apply, view, edit pending)
      → View Holidays
```

**3. ADMIN (Authenticated with ADMIN role)**
```
Login → Employee List (view/edit/create/delete) → Create Employee → Upload Images
      → Departments (CRUD) → Edit Department → Delete Department
      → Leave Management (approve/reject/revoke leaves)
      → Holiday Management (create/edit/delete holidays)
```

## Responsive Design Breakpoints

- **Desktop**: > 1200px (full layout)
- **Tablet**: 768px - 1200px (adjusted grid columns)
- **Mobile**: < 768px (single column, touch-friendly)

## Error Handling

- HTTP errors display user-friendly messages
- Form validation prevents submission of incomplete data
- 401/403 responses redirect to login or unauthorized page
- Delete confirmations prevent accidental data loss
- Network errors show retry options

## State Management Strategy

- **Authentication State**: AuthApiService (localStorage-backed)
- **Component State**: Local to each component
- **HTTP State**: RxJS Observables with proper subscription cleanup
- No external state management library (Redux, NgRx) - kept minimal for focused scope

## Performance Optimizations

- Lazy-loaded child routes (employees, admin sections)
- Debounced search input (300ms)
- Image preview created client-side (FileReader API)
- OnPush change detection compatible architecture
- Minimal bundle size with tree-shakeable imports

## Known Limitations & Future Enhancements

1. **Token Expiration**: No refresh token handling - implement with refresh token rotation
2. **Offline Support**: No service workers - can add PWA support
3. **Caching**: HTTP caching via LazyImageDirective - can extend to other resources
4. **Accessibility**: Basic ARIA labels - can improve WCAG 2.1 AA compliance
5. **Form Validation**: Mix of template-driven and reactive forms - standardize approach
6. **i18n**: Only English - can add internationalization with @angular/localize
7. **Calendar View**: Leave calendar view for better visualization
8. **Dashboard**: Enhanced admin dashboard with analytics and charts
9. **Notifications**: Real-time notifications for leave approvals/rejections
10. **Export**: Export employee/leave data to CSV/PDF

## Troubleshooting

**CORS Errors**: Ensure Spring Boot backend has CORS enabled for http://localhost:4200
**401 Unauthorized**: Token may have expired, logout and login again
**Image Not Loading**: Verify image files exist on backend and endpoint is accessible
**Department Not in Dropdown**: Clear browser cache or refresh page

## Code Quality

- Standalone components architecture (no NgModules)
- Type-safe HTTP services with Observable returns
- Consistent naming conventions (camelCase, PascalCase)
- Descriptive comments for complex logic
- Responsive CSS without framework dependencies
- Lazy loading for routes and images
- Performance optimizations with caching
- Separation of concerns (services, components, models)
- Unit tests with Vitest
- Guards for route protection

---

**Built with Angular 21+ • JWT Authentication • Role-Based Access Control • Leave Management • Holiday Management • Beautiful Responsive UI**


For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
