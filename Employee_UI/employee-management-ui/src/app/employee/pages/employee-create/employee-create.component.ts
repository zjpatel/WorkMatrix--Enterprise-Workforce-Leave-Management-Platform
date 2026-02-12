import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EmployeeApiService } from '../../../core/services/employee-api';
import { DepartmentApiService } from '../../../core/services/department-api.service';
import { AuthApiService } from '../../../core/services/auth-api';
import { ImageUploadService } from '../../../core/services/image-upload.service';

@Component({
  selector: 'app-employee-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent implements OnInit {

  isEdit = false;

  // 🔑 CORRECT IDENTIFIERS
  userId?: number;   // used for admin APIs
  empId?: number;    // used for employee & images

  loading = false;
  error = '';
  errorMessages: string[] = [];
  success = '';

  // =========================
  form = {
    name: '',
    email: '',
    password: '',
    age: null as number | null,
    gender: '',
    deptId: null as number | null,
    status: 'PENDING'
  };

  statusOptions = ['APPROVED', 'PENDING', 'REJECTED'];

  departments: any[] = [];
  profile: any = null;

  imageFiles: File[] = [];
  imagePreviews: string[] = [];
  existingImages: any[] = [];
  private originalDeptId: number | null = null;

  constructor(
    private empApi: EmployeeApiService,
    private deptApi: DepartmentApiService,
    public authApi: AuthApiService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private imageUploadService: ImageUploadService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.userId = id ? Number(id) : undefined;
    this.isEdit = !!this.userId;

    this.loadDepartments();

    if (this.isEdit) {
      this.loadEmployee();
    }
  }

  // =========================
  // LOAD DEPARTMENTS
  // =========================
  loadDepartments(): void {
    this.deptApi.fetchAllDepartments().subscribe({
      next: res => {
        this.departments = res ?? [];
        this.cdr.detectChanges();
      },
      error: err => {
        this.setBackendError(err, 'Failed to load departments');
        this.cdr.detectChanges();
      }
    });
  }

  // =========================
  // LOAD EMPLOYEE / USER
  // =========================
  loadEmployee(): void {
    if (!this.userId) return;

    if (this.authApi.isAdmin()) {
      this.empApi.getUserForAdmin(this.userId).subscribe({
        next: user => {
          this.profile = user;

          this.form.name = user.name ?? '';
          this.form.email = user.email ?? '';
          this.form.age = user.age ?? null;
          this.form.gender = user.gender ?? '';
          this.form.status = user.status ?? 'PENDING';
          this.form.deptId = user.deptId ?? null;

          this.empId = user.empId ?? undefined;
          this.existingImages = user.images ?? [];

          if (this.empId) {
            this.empApi.getEmployeeById(this.empId).subscribe({
              next: emp => {
                this.form.deptId = emp.deptId ?? null;
                this.originalDeptId = this.form.deptId;
                this.existingImages = emp.images ?? [];
                this.cdr.detectChanges();
              }
            });
          }

          this.cdr.detectChanges();
        },
        error: err => {
          this.setBackendError(err, 'Failed to load user');
          this.cdr.detectChanges();
        }
      });
      return;
    }

    // EMPLOYEE SELF PROFILE
    this.empApi.getMyProfile().subscribe({
      next: emp => {
        this.profile = emp;
        this.empId = emp.empId;
        this.form.name = emp.name;
        this.form.email = emp.email;
        this.form.age = emp.age;
        this.form.gender = emp.gender;
        this.form.status = emp.status;
        this.form.deptId = emp.deptId ?? null;
        this.existingImages = emp.images ?? [];
        this.cdr.detectChanges();
      }
    });
  }

  // =========================
  // SUBMIT
  // =========================
  submit(): void {
    this.clearErrors();
    this.success = '';

    if (!this.form.name || !this.form.email || !this.form.age || !this.form.gender) {
      this.setFormError('All required fields must be filled');
      return;
    }

    if (
      this.authApi.isAdmin() &&
      this.form.status === 'APPROVED' &&
      !this.form.deptId
    ) {
      this.setFormError('Please select a department before approving');
      return;
    }

    this.loading = true;

    if (this.isEdit) {
      this.updateEmployee();
    } else {
      this.registerUser();
    }
  }

  // =========================
  // REGISTER USER
  // =========================
  registerUser(): void {
    const formData = new FormData();

    const payload = {
      name: this.form.name,
      age: this.form.age,
      gender: this.form.gender,
      status: this.form.status
    };

    formData.append(
      'data',
      new Blob([JSON.stringify(payload)], { type: 'application/json' })
    );

    this.authApi.register(formData).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Employee registered successfully';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/employees']), 1200);
      },
      error: err => {
        this.loading = false;
        this.setBackendError(err, 'Failed to register employee');
        this.cdr.detectChanges();
      }
    });
  }

  // =========================
  // UPDATE
  // =========================
  updateEmployee(): void {
    if (!this.profile) return;

    if (this.authApi.isAdmin()) {
      const payload = {
        name: this.form.name,
        age: this.form.age,
        gender: this.form.gender,
        deptId: this.form.deptId,
        status: this.form.status
      };

      this.empApi.adminUpdateUser(this.profile.userId, payload).subscribe({
        next: () => this.handleAdminUpdateSuccess(),
        error: err => {
          this.loading = false;
          this.setBackendError(err, 'Update failed');
          this.cdr.detectChanges();
        }
      });
      return;
    }

    const payload = {
      name: this.form.name,
      age: this.form.age,
      gender: this.form.gender
    };

    this.empApi.updateMyProfile(payload).subscribe({
      next: () => this.uploadImagesIfNeeded(),
      error: err => {
        this.loading = false;
        this.setBackendError(err, 'Update failed');
        this.cdr.detectChanges();
      }
    });
  }

private handleAdminUpdateSuccess(): void {

  if (this.imageFiles.length === 0) {
    this.finishUpdate();
    return;
  }

  // 🔥 ALWAYS upload by USER ID (works for PENDING / REJECTED)
  this.imageUploadService
    .uploadUserImages(this.profile.userId, this.imageFiles)
    .subscribe({
      next: () => this.finishUpdate(),
      error: () => {
        this.error = 'Profile updated but image upload failed';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
}


  private uploadImagesIfNeeded(): void {
    if (!this.empId || this.imageFiles.length === 0) {
      this.finishUpdate();
      return;
    }
    this.uploadImagesForEmployee(this.empId);
  }

  private uploadImagesForEmployee(empId: number): void {
    this.imageUploadService.uploadImages(empId, this.imageFiles).subscribe({
      next: () => this.finishUpdate(),
      error: () => {
        this.error = 'Profile updated but image upload failed';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private finishUpdate(): void {
    this.loading = false;
    this.success = 'Employee updated successfully';
    this.cdr.detectChanges();
    setTimeout(() => this.router.navigate(['/employees']), 1200);
  }

  // =========================
  // IMAGE HANDLING
  // =========================
  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      this.imageFiles.push(file);

      const reader = new FileReader();
      reader.onload = e => {
        this.imagePreviews.push(e.target?.result as string);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    });
  }

  removeNewImage(index: number): void {
    this.imageFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
    this.cdr.detectChanges();
  }

  removeExistingImage(img: any): void {
    if (!img.imageId) return;

    this.imageUploadService.deleteImage(img.imageId).subscribe({
      next: () => {
        this.existingImages = this.existingImages.filter(i => i.imageId !== img.imageId);
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to delete image';
        this.cdr.detectChanges();
      }
    });
  }

  getImageUrl(fileName: string): string {
    return `http://localhost:8080/api/images/by-name/${fileName}`;
  }

  private setFormError(msg: string): void {
    this.error = msg;
    this.errorMessages = [msg];
  }

  private clearErrors(): void {
    this.error = '';
    this.errorMessages = [];
  }

  private setBackendError(err: any, fallback: string): void {
    this.errorMessages = [fallback];
    this.error = fallback;
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByImage(index: number, img: any): any {
    return img?.imageId ?? img?.fileName ?? index;
  }
}
