# Setup & Deployment Guide

## System Requirements

- **Node.js**: 18.x or higher
- **npm**: 10.x or higher (comes with Node.js)
- **Angular CLI**: 21.x or higher (installed globally)
- **Spring Boot Backend**: Running on http://localhost:8080

### Check Installed Versions

```bash
node --version      # Should be v18.0.0 or higher
npm --version       # Should be 10.0.0 or higher
ng version          # Should be Angular 21.1.1 or higher
```

## Installation Steps

### 1. Install Angular CLI Globally (if not already installed)

```bash
npm install -g @angular/cli@latest
```

### 2. Navigate to Project Directory

```bash
cd d:\Employee_UI\employee-management-ui
```

### 3. Install Project Dependencies

```bash
npm install
```

This will install:
- @angular/core@21.1.0
- @angular/common@21.1.0
- @angular/forms@21.1.0
- @angular/router@21.1.0
- @angular/platform-browser@21.1.0
- rxjs@7.8.0
- typescript@5.9.2
- And other dev dependencies

### 4. Verify Installation

```bash
npm list @angular/core
```

Should show: `@angular/core@21.1.0`

## Running the Application

### Development Mode

```bash
# Option 1: Using Angular CLI
ng serve

# Option 2: Using npm script
npm start
```

The application will:
- Start on http://localhost:4200
- Auto-reload when files change
- Provide verbose console output
- Show compilation errors in browser

### Production Mode (Build)

```bash
ng build --prod
```

Output will be in: `d:\Employee_UI\employee-management-ui\dist\`

## Backend Configuration

The application expects the Spring Boot backend on **http://localhost:8080**

If your backend is on a different URL, update `src/environments/environments.ts`:

**File**: `src/environments/environments.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://your-backend-url/api'
};
```

Or update each service individually:

**File**: `src/app/core/services/auth-api.ts`
```typescript
private BASE_URL = 'http://your-backend-url/api/auth';
```

**File**: `src/app/core/services/employee-api.ts`
```typescript
private BASE_URL = 'http://your-backend-url/api/employees';
```

**File**: `src/app/core/services/department-api.service.ts`
```typescript
private BASE_URL = 'http://your-backend-url/api/departments';
```

**File**: `src/app/core/services/holiday.service.ts`
```typescript
private BASE_URL = 'http://your-backend-url/api/holidays';
```

**File**: `src/app/leave/services/leave-api.service.ts`
```typescript
private BASE_URL = 'http://your-backend-url/api/leaves';
```

**File**: `src/app/core/services/image-upload.service.ts`
```typescript
private BASE_URL = 'http://your-backend-url/api/images';
```

## CORS Configuration (Spring Boot Backend)

Ensure your backend allows CORS for http://localhost:4200:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:4200")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

## Testing the Application

### 1. Test User Registration

1. Open http://localhost:4200
2. Click "Register"
3. Fill in: Name, Email, Password, Confirm Password, Age, Gender
4. Upload a profile image (optional)
5. Click "Register"
6. Redirects to login after 2 seconds

### 2. Test Login

1. Enter registered email and password
2. Click "Login"
3. Redirects to /employees on success
4. Navbar appears with user email and role badge

### 3. Test Employee List (All Users)

1. View employee list
2. Try search by employee name
3. Click "View" on any employee → Opens image carousel
4. Navigate carousel with next/previous buttons
5. Click close button to close modal

### 4. Test Employee Features (ADMIN Only)

1. Login with ADMIN role
2. Click "Create Employee" button
3. Fill form: Name, Email, Age, Gender, Department
4. Upload images (drag & drop or click)
5. Click "Create"
6. Verify new employee appears in list
7. Click "Edit" on any employee
8. Modify fields and click "Update"
9. Click "Delete" on any employee → Confirmation → Delete

### 5. Test Department Management (ADMIN Only)

1. Click "Departments" link in navbar
2. Click "Create Department"
3. Enter department name → Submit
4. Verify department appears in list
5. Click "Delete" on department → Confirmation → Delete
6. Verify department removed from list

### 6. Test Leave Management (All Users)

**Employee:**
1. Navigate to /leave
2. Fill leave application form:
   - Select leave type (SICK, CASUAL, EARNED, etc.)
   - Choose start and end dates
   - Enter reason (min 10 characters)
3. Click "Apply Leave"
4. View personal leave history table
5. Edit pending leaves
6. View status badges (PENDING, APPROVED, REJECTED)

**Admin:**
1. Navigate to /leave
2. See all employee features PLUS:
3. View "Pending Leaves" section
4. Click "Approve" or "Reject" on pending requests
5. View "Processed Leaves" section
6. Filter by status (APPROVED/REJECTED/REVOKED)
7. Revoke approved leaves (only before start date)

### 7. Test Holiday Management

**Employee:**
1. Navigate to holidays view
2. See list of company holidays
3. View holiday details (name, date, description)
4. Filter by year (optional)

**Admin:**
1. Navigate to /admin/holidays
2. Click "Create Holiday"
3. Fill form: Name, Date, Description
4. Click "Create"
5. Edit existing holidays
6. Delete holidays with confirmation

### 8. Test Role-Based Access

1. Login as EMPLOYEE
2. Try to navigate to /admin/departments (should redirect to /unauthorized)
3. Navbar should NOT show "Departments" link
4. Can only edit own profile (name, age, gender - no email/department)

### 9. Test Logout

1. Click "Logout" button in navbar
2. Redirects to login page
3. localStorage is cleared (token, role, email)
4. Refresh page → still on login page

### 10. Test Auto-Redirect

1. If logged in and visit landing page → Auto-redirects to /employees
2. If not logged in and visit /employees → Auto-redirects to /login
3. If EMPLOYEE visits /admin → Auto-redirects to /unauthorized

## Performance Testing

### Bundle Size

```bash
ng build --prod --analyze
```

This will show bundle size breakdown in browser.

### Dev Tools Performance

1. Open Chrome DevTools → Network tab
2. Refresh page
3. Check:
   - Initial load time < 3 seconds
   - HTML < 50KB
   - JS bundle < 500KB
   - CSS < 100KB
   - Total < 1MB

### Memory Usage

1. Open Chrome DevTools → Memory tab
2. Take heap snapshot
3. Check for memory leaks:
   - Navigate to different routes
   - Take another snapshot
   - Compare heap sizes

## Troubleshooting

### Issue: "Cannot find module '@angular/...'"

**Solution**: Reinstall dependencies
```bash
rm -r node_modules
npm install
```

### Issue: "Port 4200 is already in use"

**Solution**: Use different port
```bash
ng serve --port 4201
```

### Issue: "ng: command not found"

**Solution**: Install Angular CLI globally
```bash
npm install -g @angular/cli
```

### Issue: CORS errors in browser console

**Solution**: 
1. Check Spring Boot CORS configuration
2. Ensure backend is running on http://localhost:8080
3. Backend must allow Origin: http://localhost:4200

### Issue: "401 Unauthorized" errors

**Solution**:
1. Token may have expired - login again
2. Check browser localStorage for 'token' key
3. Verify JwtInterceptor is added to HttpClient config

### Issue: Images not loading

**Solution**:
1. Check backend /api/images/by-name/{fileName} endpoint
2. Verify image files are saved on backend
3. Check file permissions on server
4. Verify image URL in getImageUrl() method

### Issue: Department dropdown empty

**Solution**:
1. Ensure DepartmentApiService.fetchAllDepartments() is called
2. Create a department first via admin panel
3. Refresh the page
4. Check browser console for errors

### Issue: Form won't submit

**Solution**:
1. Verify all required fields are filled
2. Check browser console for validation errors
3. Ensure age is between 18-120
4. Ensure email format is valid

## Deployment to Production

### 1. Build Production Bundle

```bash
ng build --prod --source-map=false
```

### 2. Optimize Bundle

```bash
ng build --prod --optimization=true
```

This enables:
- Tree shaking (removes unused code)
- Minification (reduces file size)
- AOT compilation (faster runtime)

### 3. Deploy to Web Server

Copy contents of `dist/employee-management-ui/` to your web server:

**nginx Example:**
```nginx
server {
    listen 80;
    server_name example.com;
    
    root /var/www/html/employee-management-ui;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Apache Example:**
```apache
<Directory /var/www/html/employee-management-ui>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</Directory>
```

### 4. Update Backend URL

Before building, update API URLs in services to point to production backend:

```typescript
// production-urls.ts
export const API_CONFIG = {
  baseUrl: 'https://api.example.com'
};
```

Then import in services:
```typescript
import { API_CONFIG } from './production-urls';

private BASE_URL = API_CONFIG.baseUrl + '/api/employees';
```

## Environment Configuration

### Development Environment

**File**: `src/environments/environments.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### Production Environment

**File**: `src/environments/environments.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com/api'
};
```

## Monitoring & Logging

### Enable Production Logging

In `main.ts`:
```typescript
import { enableDebugTools } from '@angular/platform-browser';

if (!environment.production) {
  enableDebugTools(componentRef);
}
```

### Browser Console Monitoring

1. Open Chrome DevTools → Console
2. All API calls logged automatically
3. Errors show request/response details
4. Performance metrics available

## Security Checklist

- ✅ JWT token stored in localStorage
- ✅ Bearer token injected automatically via interceptor
- ✅ HTTPS recommended for production
- ✅ CORS properly configured
- ✅ No sensitive data in localStorage besides token
- ✅ Logout clears localStorage
- ✅ Routes protected with guards
- ✅ Role-based access control implemented
- ✅ Email field disabled in edit forms
- ✅ Password confirmation in registration

## Performance Checklist

- ✅ Lazy loading for feature routes
- ✅ Debounced search (300ms)
- ✅ OnPush change detection compatible
- ✅ Pure CSS (no heavy framework)
- ✅ Standalone components (tree-shakeable)
- ✅ No external animation libraries
- ✅ Image previews created client-side
- ✅ Modal backdrop blur (CSS filter)
- ✅ Responsive grid with auto-fit

## Maintenance Tasks

### Monthly

- [ ] Update Angular CLI: `npm update -g @angular/cli`
- [ ] Update dependencies: `npm update`
- [ ] Review error logs
- [ ] Check for security advisories: `npm audit`

### Quarterly

- [ ] Performance audit: `ng build --stats-json`
- [ ] Bundle analysis
- [ ] Test user flows end-to-end
- [ ] Update documentation

### Annually

- [ ] Major version upgrade planning
- [ ] Security compliance review
- [ ] Code refactoring review
- [ ] Backup and disaster recovery test

---

**Installation Complete!**
Your Angular Employee Management UI is ready to use. Start with:

```bash
ng serve
```

Then open http://localhost:4200 in your browser.
