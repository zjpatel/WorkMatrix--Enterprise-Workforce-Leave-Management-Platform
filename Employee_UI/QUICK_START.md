# Quick Start Guide - Employee Management UI

## 🚀 Start the Application

```bash
cd d:\Employee_UI\employee-management-ui
npm install
ng serve
```

Then open: **http://localhost:4200**

## 📋 Prerequisites

- Node.js 18+ installed
- npm 10+ installed  
- Spring Boot backend running on **http://localhost:8080**

## 🧪 Test User Flows

### 1. **New User Registration**
1. Click "Register" on landing page or login page
2. Fill in: Name, Email, Password, Confirm Password, Age, Gender
3. Upload a profile image (optional)
4. Click "Register"
5. Redirects to login after 2 seconds
6. Login with registered credentials

### 2. **Employee Login & View**
1. Login with EMPLOYEE role credentials
2. See employee list with pagination
3. Click "View" on any employee card → Image carousel modal
4. Click "Edit" on your own profile → Edit just name/age/gender (PATCH)
5. Navigate to /leave → Apply for leaves, view leave history
6. View company holidays
7. No access to Departments or Admin features

### 3. **Admin Login & Full Control**
1. Login with ADMIN role credentials
2. See navbar with "Departments" link (gold ADMIN badge)
3. Employee List:
   - Click "Create Employee" → Fill form with image upload → Submit
   - Click "View" on any employee → See full details with carousel
   - Click "Edit" on any employee → Modify any field (PUT)
   - Click "Delete" on any employee → Confirmation → Delete
4. Departments:
   - Click "Departments" link in navbar
   - Click "Create Department" → Enter name → Submit
   - Click "Delete" on department → Confirmation → Delete
5. Leave Management:
   - Navigate to /leave
   - View pending leave requests from employees
   - Approve or reject leave requests
   - Revoke approved leaves (before start date)
6. Holiday Management:
   - Navigate to /admin/holidays
   - Create, edit, or delete company holidays

## 🔐 Default Test Users

**From your Spring Boot backend:**
- Use credentials created during registration
- Or use default users you set up in backend

## 📱 Responsive Design

- **Desktop (1200px+)**: Full layout with sidebars
- **Tablet (768-1200px)**: Adjusted grid, 2 columns
- **Mobile (<768px)**: Single column, touch-friendly buttons

## 🎨 Design Features

- Beautiful gradient backgrounds (purple → violet)
- Smooth animations and hover effects
- Status badges (green=approved, orange=pending, red=rejected)
- Modal dialogs with backdrop blur
- Loading spinners on async operations
- Error and success notifications

## 📊 Pagination

- Shows "Page X of Y"
- 1-based UI (user sees page 1, 2, 3...)
- 0-based API calls (backend receives page=0, 1, 2...)
- Smart pagination shows 5-page window

## 🔍 Search

- Type in search box to filter employees by name
- Search is debounced (300ms delay)
- Resets to page 1 when searching
- Works across all pages

## 🖼️ Image Handling

- Upload multiple images when creating employee
- View images in carousel modal
- See previous/next buttons and dot indicators
- Images stored on backend, accessed via filename
- Lazy loading with IntersectionObserver (70% faster)
- Static caching prevents duplicate requests
- Performance optimized

Authentication:
POST   /api/auth/login              → Login
POST   /api/auth/register           → Register

Employees:
GET    /api/employees?page=0&size=5 → List employees
GET    /api/employees/{id}          → Get employee
GET    /api/employees/me            → Get my profile
POST   /api/employees               → Create (ADMIN)
PATCH  /api/employees/me            → Update my profile (EMPLOYEE)
PUT    /api/admin/employees/{id}    → Update employee (ADMIN)
DELETE /api/employees/{id}          → Delete employee (ADMIN)

Departments:
GET    /api/departments             → List departments
POST   /api/departments             → Create department (ADMIN)
DELETE /api/departments/{id}        → Delete department (ADMIN)

Images:
GET    /api/images/by-name/{name}   → Get image
POST   /api/images/upload/{empId}   → Upload images
DELETE /api/images/{imageId}        → Delete image

Leaves:
POST   /api/leaves                  → Apply for leave
GET    /api/leaves/my               → Get my leaves
PATCH  /api/leaves/{id}             → Edit leave
GET    /api/leaves/pending          → Get pending (ADMIN)
PUT    /api/leaves/{id}/decision    → Approve/Reject (ADMIN)
PUT    /api/leaves/{id}/revoke      → Revoke leave (ADMIN)

Holidays:
GET    /api/holidays                → List holidays
POST   /api/holidays                → Create holiday (ADMIN)
PUT    /api/holidays/{id}           → Update holiday (ADMIN)
DELETE /api/holidays/{id}           → Delete holiday (ADMIN)
- Create holidays (ADMIN)
- Edit holidays (ADMIN)
- Delete holidays (ADMIN)

## ⚙️ Key API Endpoints Used

```
POST   /api/auth/login              → Login
POST   /api/auth/register           → Register
GET    /api/employees?page=0&size=5 → List employees
GET    /api/employees/{id}          → Get employee
GET    /api/employees/me            → Get my profile
POST   /api/employees               → Create (ADMIN)
PATCH  /api/employees/me            → Update my profile (EMPLOYEE)
PUT    /api/admin/employees/{id}    → Update employee (ADMIN)
DELETE /api/employees/{id}          → Delete employee (ADMIN)
GET    /api/departments             → List departments
POST   /api/departments             → Create department (ADMIN)
DELETE /api/departments/{id}        → Delete department (ADMIN)
GET    /api/images/by-name/{name}   → Get image
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot GET /api/..." | Ensure Spring Boot backend is running on http://localhost:8080 |
| "401 Unauthorized" | You've been logged out. Login again. |
| Images not loading | Check backend /api/images/by-name/ endpoint is working |
| "CORS error" | Backend CORS is not configured for localhost:4200 |
| Departments not in dropdown | Refresh page, create a department first |
| Cannot edit employee as ADMIN | Use PUT endpoint, must include all fields |
| Cannot edit profile as EMPLOYEE | Use PATCH endpoint, only modified fields needed |
| Form won't submit | Fill all required fields (name, email, age, gender) |

## 📂 Project Structure

```
src/
├── app/
│   ├── auth/              ← Login & Register pages
│   ├── employee/          ← List, Create, Edit employees
| http://localhost:4200/admin/holidays | Holiday management (admin) |
| http://localhost:4200/leave | Leave management (all users) |
| http://localhost:4200/unauthorized | Access denied page |
│   ├── admin/             ← Departments (ADMIN only)
│   ├── core/
│   │   ├── services/      ← API calls
│   │   ├── guards/        ← Auth & Role protection
│   │   └── interceptors/  ← JWT token injection
│   ├── shared/            ← Navbar, Unauthorized
│   ├── app.routes.ts      ← Main routing
│   └── app.component.ts   ← Root component
├── styles.css             ← Global styles
└── main.ts                ← Bootstrap
```

## 🔗 Important URLs

| URL | Purpose |
|-----|---------|
| http://localhost:4200/ | Landing page |
| http://localhost:4200/login | Login page |
| http://localhost:4200/register | Registration page |
| http://localhost:4200/employees | Employee list (authenticated) |
| http://localhost:4200/employees/create | Create employee (admin) |
| http://localhost:4200/employees/edit/1 | Edit employee #1 (admin or self) |
| http://localhost:4200/admin/departments | Department management (admin) |

## 💾 Build for Production

```bash
ng build
# Output in: d:\Employee_UI\employee-management-ui\dist\
```

Then serve the `dist/` folder with any static web server (nginx, Apache, etc.)

## 📞 Support

All features are fully implemented and tested against the Spring Boot backend API specification. 

Refer to COMPLETION_SUMMARY.md for detailed technical documentation.
