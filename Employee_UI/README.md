# Employee Management System - Frontend (Angular UI)

[![Angular](https://img.shields.io/badge/Angular-21+-red?logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, production-ready Angular application providing a complete employee management system with authentication, leave management, holiday management, and role-based access control.

## 🚀 Quick Start

```bash
cd employee-management-ui
npm install
ng serve
```

Visit: **http://localhost:4200**

## 📦 What's Inside

This workspace contains:
- **Angular 21+ Application** (`employee-management-ui/`)
- **Comprehensive Documentation** (this directory)
- **Setup Guides & Architecture Docs**

## 📚 Documentation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **[QUICK_START.md](QUICK_START.md)** | Get running in 5 minutes | 5 min |
| **[SETUP_GUIDE.md](SETUP_GUIDE.md)** | Full installation & deployment | 15 min |
| **[INDEX.md](INDEX.md)** | Project overview & navigation | 10 min |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Technical architecture details | 20 min |
| **[COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)** | Feature inventory & deliverables | 20 min |
| **[LEAVE_MODULE_DOCUMENTATION.md](LEAVE_MODULE_DOCUMENTATION.md)** | Leave management system | 15 min |
| **[UNIFIED_LEAVE_MANAGEMENT.md](UNIFIED_LEAVE_MANAGEMENT.md)** | Unified leave component | 10 min |
| **[IMAGE_FIXES_DOCUMENTATION.md](IMAGE_FIXES_DOCUMENTATION.md)** | Image upload & optimization | 10 min |
| **[BACKEND_API_REQUIREMENTS.md](BACKEND_API_REQUIREMENTS.md)** | Required backend endpoints | 10 min |

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN / EMPLOYEE)
- Secure token management
- Auto-redirect based on authentication state

### 👥 Employee Management
- Paginated employee listing with search
- Create, read, update, delete operations
- Multi-image upload with lazy loading
- Profile management
- Status tracking (APPROVED, PENDING, REJECTED)

### 🏢 Department Management
- Department CRUD operations (ADMIN only)
- Employee-department relationships
- Department-based filtering

### 🏖️ Leave Management
- Apply for leaves with multiple types
- View personal leave history
- Edit pending leave requests
- Admin approval/rejection workflow
- Revoke approved leaves (before start date)
- Status tracking (PENDING, APPROVED, REJECTED, REVOKED)

### 📅 Holiday Management
- View company holidays
- Create/edit/delete holidays (ADMIN)
- Holiday calendar visualization
- Year-based filtering

### 🎨 Modern UI/UX
- Beautiful gradient-based design
- Fully responsive (mobile, tablet, desktop)
- Loading states & error handling
- Modal dialogs & confirmations
- Image carousel with lazy loading
- Performance optimizations

## 🛠️ Technical Stack

- **Framework**: Angular 21+ (Standalone Components)
- **Language**: TypeScript 5.9+
- **HTTP Client**: Angular HttpClient with JWT interceptor
- **Routing**: Angular Router with lazy loading
- **Forms**: Template-driven & Reactive Forms
- **Styling**: Pure CSS (no framework dependencies)
- **Testing**: Vitest
- **Package Manager**: npm 11.6.2

## 📂 Project Structure

```
Employee_UI/
├── employee-management-ui/     # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/           # Login & Registration
│   │   │   ├── core/           # Services, Guards, Interceptors
│   │   │   ├── employee/       # Employee management pages
│   │   │   ├── admin/          # Admin-only pages
│   │   │   ├── leave/          # Leave management module
│   │   │   └── shared/         # Shared components & directives
│   │   ├── styles.css          # Global styles
│   │   └── environments/       # Environment configuration
│   ├── package.json
│   └── angular.json
│
├── README.md                   # This file
├── QUICK_START.md              # Quick start guide
├── SETUP_GUIDE.md              # Detailed setup instructions
├── INDEX.md                    # Complete project overview
├── ARCHITECTURE.md             # Architecture documentation
├── COMPLETION_SUMMARY.md       # What's been built
├── LEAVE_MODULE_DOCUMENTATION.md
├── UNIFIED_LEAVE_MANAGEMENT.md
├── IMAGE_FIXES_DOCUMENTATION.md
├── BACKEND_API_REQUIREMENTS.md
├── QUICK_REFERENCE.md
├── CHECKLIST.md
└── DELIVERY.md
```

## 🎯 User Roles & Permissions

### EMPLOYEE Role
- ✅ View all employees
- ✅ View and edit own profile
- ✅ Apply for leaves
- ✅ View and edit own leaves
- ✅ View company holidays
- ❌ Cannot manage departments
- ❌ Cannot create/delete employees
- ❌ Cannot approve/reject leaves
- ❌ Cannot manage holidays

### ADMIN Role
- ✅ All EMPLOYEE permissions
- ✅ Create, edit, delete employees
- ✅ Manage departments (CRUD)
- ✅ Approve/reject leave requests
- ✅ Revoke approved leaves
- ✅ Create, edit, delete holidays
- ✅ Full system access

## 🌐 Backend API Integration

This frontend requires a Spring Boot backend running on `http://localhost:8080`.

**Required API Categories:**
- Authentication APIs (`/api/auth/*`)
- Employee APIs (`/api/employees/*`)
- Department APIs (`/api/departments/*`)
- Leave APIs (`/api/leaves/*`)
- Holiday APIs (`/api/holidays/*`)
- Image APIs (`/api/images/*`)

See [BACKEND_API_REQUIREMENTS.md](BACKEND_API_REQUIREMENTS.md) for complete endpoint specifications.

## 🔧 Prerequisites

- **Node.js**: 18+ (recommended: 20 LTS)
- **npm**: 10+ (included with Node.js)
- **Angular CLI**: 21+ (`npm install -g @angular/cli`)
- **Backend**: Spring Boot server running on port 8080

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd Employee_UI/employee-management-ui

# Install dependencies
npm install

# Start development server
ng serve

# Open browser
# Navigate to http://localhost:4200
```

## 🏗️ Build for Production

```bash
# Build optimized production bundle
ng build

# Output will be in dist/ directory
# Serve with nginx, apache, or any static file server
```

## 🧪 Testing

```bash
# Run unit tests
ng test

# Run tests in watch mode
ng test --watch

# Run tests with coverage
ng test --coverage
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (single column, touch-friendly)
- **Tablet**: 768px - 1200px (2 columns, optimized layout)
- **Desktop**: > 1200px (full multi-column layout)

## 🔒 Security Features

- JWT token-based authentication
- HTTP-only token storage (localStorage)
- Automatic token injection via interceptor
- Route guards for protected pages
- Role-based component rendering
- XSS protection through Angular sanitization
- CORS configuration requirements documented

## 🚦 Troubleshooting

### CORS Errors
Ensure your Spring Boot backend has CORS enabled for `http://localhost:4200`

```java
@CrossOrigin(origins = "http://localhost:4200")
```

### Token Issues
- Clear localStorage if token is expired
- Logout and login again
- Check backend token generation

### Image Loading Issues
- Verify backend image endpoints are accessible
- Check image file paths in database
- Ensure CORS allows image requests

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for more troubleshooting tips.

## 📈 Performance Optimizations

- **Lazy Loading**: Routes and images load on demand
- **Image Caching**: Static cache prevents duplicate requests
- **Debounced Search**: 300ms delay reduces API calls
- **OnPush Change Detection**: Compatible architecture
- **Tree-Shakeable Imports**: Minimal bundle size
- **AOT Compilation**: Faster runtime performance

## 🎨 Design System

- **Primary Gradient**: #667eea → #764ba2 (purple to violet)
- **Success**: #22c55e (green)
- **Danger**: #ef4444 (red)
- **Warning**: #f59e0b (amber)
- **Info**: #3b82f6 (blue)
- **Border Radius**: 12px (cards), 8px (buttons)
- **Shadows**: Soft elevation effects
- **Animations**: 0.3s smooth transitions

## 📊 Project Statistics

- **Total Files**: 60+ TypeScript/CSS/HTML files
- **TypeScript Lines**: 2000+ lines of component logic
- **CSS Lines**: 4000+ lines of custom styling
- **Components**: 15+ standalone components
- **Services**: 8+ injectable services
- **Guards**: 3 route guards
- **API Endpoints**: 30+ integrated endpoints

## 🤝 Contributing

1. Follow Angular style guide
2. Use meaningful commit messages
3. Write unit tests for new features
4. Update documentation for API changes
5. Ensure responsive design for new components

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions:
1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) troubleshooting section
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
3. Consult [BACKEND_API_REQUIREMENTS.md](BACKEND_API_REQUIREMENTS.md) for API issues

## 🗺️ Roadmap

- [ ] PWA support with service workers
- [ ] Advanced reporting & analytics dashboard
- [ ] Real-time notifications (WebSockets)
- [ ] Calendar view for leaves & holidays
- [ ] Export functionality (CSV/PDF)
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] Enhanced accessibility (WCAG 2.1 AA)
- [ ] Advanced filtering & sorting

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Angular Version**: 21.1.0
