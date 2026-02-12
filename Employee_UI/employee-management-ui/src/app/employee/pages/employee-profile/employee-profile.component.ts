import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeApiService } from '../../../core/services/employee-api';
import { AuthApiService } from '../../../core/services/auth-api';
import { AdminProfileApiService } from '../../../core/services/admin-profile-api.service';
import { ImageUploadService } from '../../../core/services/image-upload.service';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {

  profile: any = null;
  loading = false;
  error = '';
  success = '';

  isEditing = false;

  editForm = {
    name: '',
    age: null as number | null,
    gender: ''
  };

  newImageFiles: File[] = [];
  imagePreviews: string[] = [];

  constructor(
    private empApi: EmployeeApiService,
    public authApi: AuthApiService,
    private router: Router,
    private adminProfileApi: AdminProfileApiService,
    private imageUploadService: ImageUploadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  // =========================
  // LOAD PROFILE
  // =========================
  loadProfile(): void {
    this.loading = true;
    this.error = '';

    // 🔥 ADMIN PROFILE
    if (this.authApi.isAdmin()) {
      this.adminProfileApi.getMyProfile().subscribe({
        next: data => {
          console.log('Admin profile data:', data);
          this.profile = data;

          this.editForm = {
            name: data.name,
            age: data.age,
            gender: data.gender
          };

          // ✅ IMAGES ALREADY COME FROM BACKEND
          this.profile.images = data.images ?? [];
          console.log('Admin profile images:', this.profile.images);

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          this.error = err?.error?.message || 'Failed to load admin profile';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
      return;
    }

    // 👤 EMPLOYEE PROFILE
    this.empApi.getMyProfile().subscribe({
      next: data => {
        this.profile = data;

        this.editForm = {
          name: data.name,
          age: data.age,
          gender: data.gender
        };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        this.error = err?.error?.message || 'Failed to load profile';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // =========================
  // EDIT TOGGLE
  // =========================
  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (!this.isEditing && this.profile) {
      this.editForm = {
        name: this.profile.name,
        age: this.profile.age,
        gender: this.profile.gender
      };
      this.newImageFiles = [];
      this.imagePreviews = [];
    }
  }

  // =========================
  // IMAGE HANDLING
  // =========================
  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      this.newImageFiles.push(file);

      const reader = new FileReader();
      reader.onload = e => {
        this.imagePreviews.push(e.target?.result as string);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    });
  }

  removeNewImage(index: number): void {
    this.newImageFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
    this.cdr.detectChanges();
  }

  // =========================
  // SAVE PROFILE
  // =========================
  saveProfile(): void {
    this.error = '';
    this.success = '';

    if (!this.editForm.name || !this.editForm.age || !this.editForm.gender) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;

    const payload = {
      name: this.editForm.name,
      age: this.editForm.age,
      gender: this.editForm.gender
    };

    // 🔥 ADMIN UPDATE
    if (this.authApi.isAdmin()) {
      this.adminProfileApi.updateMyProfile(payload).subscribe({
        next: () => this.uploadImagesIfNeeded(),
        error: err => {
          this.error = err?.error?.message || 'Failed to update admin profile';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
      return;
    }

    // 👤 EMPLOYEE UPDATE
    this.empApi.updateMyProfile(payload).subscribe({
      next: () => this.uploadImagesIfNeeded(),
      error: err => {
        this.error = err?.error?.message || 'Failed to update profile';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // =========================
  // IMAGE UPLOAD (FIXED)
  // =========================
  private uploadImagesIfNeeded(): void {
    if (this.newImageFiles.length === 0) {
      this.finishSave();
      return;
    }

    // 🔥 ADMIN → upload by USER ID
    if (this.authApi.isAdmin()) {
      this.imageUploadService
        .uploadUserImages(this.profile.userId, this.newImageFiles)
        .subscribe({
          next: () => this.finishSave(),
          error: () => {
            this.error = 'Profile updated but image upload failed';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      return;
    }

    // 👤 EMPLOYEE → upload by EMP ID
    if (!this.profile?.empId) {
      this.finishSave();
      return;
    }

    this.imageUploadService
      .uploadImages(this.profile.empId, this.newImageFiles)
      .subscribe({
        next: () => this.finishSave(),
        error: () => {
          this.error = 'Profile updated but image upload failed';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  // =========================
  // FINALIZE
  // =========================
  private finishSave(): void {
    this.success = 'Profile updated successfully!';
    this.isEditing = false;
    this.newImageFiles = [];
    this.imagePreviews = [];
    this.loadProfile();
  }

  // =========================
  // HELPERS
  // =========================
  getImageUrl(fileName: string): string {
    // fileName format: '/api/images/uuid_filename.jpg'
    // Extract just the filename part and use it directly
    if (fileName.startsWith('/api/')) {
      return `http://localhost:8080${fileName}`;
    }
    return `http://localhost:8080/api/images/${fileName}`;
  }

  getImageUrlById(imageId: number): string {
    return `http://localhost:8080/api/images/${imageId}`;
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByImage(index: number, img: any): any {
    return img?.imageId ?? img?.fileName ?? index;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
