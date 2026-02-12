import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-view-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-view-modal.component.html',
  styleUrls: ['./employee-view-modal.component.css']
})
export class EmployeeViewModalComponent implements OnInit, OnChanges {

  @Input() employee: any;
  @Input() isAdmin = false;

  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  currentImageIndex = 0;
  imageTransitioning = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.currentImageIndex = 0;
    this.imageTransitioning = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee']) {
      this.currentImageIndex = 0;
      this.imageTransitioning = false;
      this.cdr.detectChanges();
    }
  }

  // =====================
  // Keyboard shortcuts
  // =====================
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onClose();
    }
    if (event.key === 'ArrowLeft') {
      this.prevImage();
    }
    if (event.key === 'ArrowRight') {
      this.nextImage();
    }
  }

  // =====================
  // Image helpers
  // =====================
  get images(): any[] {
    return this.employee?.images ?? [];
  }

  nextImage(): void {
    if (this.images.length <= 1 || this.imageTransitioning) return;

    this.imageTransitioning = true;
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.images.length;

    setTimeout(() => {
      this.imageTransitioning = false;
      this.cdr.detectChanges();
    }, 300);
  }

  prevImage(): void {
    if (this.images.length <= 1 || this.imageTransitioning) return;

    this.imageTransitioning = true;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.images.length) % this.images.length;

    setTimeout(() => {
      this.imageTransitioning = false;
      this.cdr.detectChanges();
    }, 300);
  }

  goToImage(index: number): void {
    if (this.imageTransitioning || index === this.currentImageIndex) return;

    this.imageTransitioning = true;
    this.currentImageIndex = index;

    setTimeout(() => {
      this.imageTransitioning = false;
      this.cdr.detectChanges();
    }, 300);
  }

  // =====================
  // Actions
  // =====================
  onClose(): void {
    this.close.emit();
  }

  onEdit(): void {
    console.log('onEdit called, employee:', this.employee);
    if (this.employee) {
      // For admin, we need userId to edit user profile
      // For employees, empId is sufficient
      const id = this.employee.userId || this.employee.empId;
      console.log('Emitting edit with ID:', id);
      if (id) {
        this.edit.emit(id);
      }
    }
  }

  onDelete(): void {
    if (!this.employee?.empId) return;

    if (confirm('Are you sure you want to delete this employee?')) {
      this.delete.emit(this.employee.empId);
      this.onClose();
    }
  }

  // =====================
  // Utils
  // =====================
  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getImageUrl(fileName: string): string {
    if (!fileName) return '';
    return `http://localhost:8080/api/images/by-name/${fileName}`;
  }
}
