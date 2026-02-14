import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  successMessage = '';
  passwordStrength = 0;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.minLength(12), this.strongPasswordValidator.bind(this)],
        ],
        confirmPassword: ['', [Validators.required]],
        agreeTerms: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );

    // Update password strength on password changes
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.updatePasswordStrength();
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  /*
    Strong password validator
    - At least 12 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
   */
  private strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const password = control.value;
    const errors: ValidationErrors = {};

    if (!/[A-Z]/.test(password)) {
      errors['noUppercase'] = true;
    }
    if (!/[a-z]/.test(password)) {
      errors['noLowercase'] = true;
    }
    if (!/[0-9]/.test(password)) {
      errors['noNumber'] = true;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors['noSpecialChar'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Password match validator
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Update password strength indicator
  private updatePasswordStrength(): void {
    const password = this.registerForm.get('password')?.value;
    if (!password) {
      this.passwordStrength = 0;
      return;
    }

    let strength = 0;

    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

    this.passwordStrength = Math.min(strength, 5);
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulate network delay
    setTimeout(() => {
      const { name, email, password } = this.registerForm.value;

      if (this.authService.register(email, password, name)) {
        this.successMessage = `Welcome ${name}! Redirecting to dashboard...`;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      } else {
        this.errorMessage = 'This email is already registered. Please try another email or login.';
      }

      this.loading = false;
    }, 500);
  }

  // Get error message for a form field
  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);

    if (!control || !control.errors || !this.submitted) {
      return '';
    }

    if (control.hasError('required')) {
      return `${this.formatFieldName(fieldName)} is required`;
    }

    if (control.hasError('minlength')) {
      return `${this.formatFieldName(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (fieldName === 'password') {
      if (control.hasError('noUppercase')) {
        return 'Password must include at least one uppercase letter';
      }
      if (control.hasError('noLowercase')) {
        return 'Password must include at least one lowercase letter';
      }
      if (control.hasError('noNumber')) {
        return 'Password must include at least one number';
      }
      if (control.hasError('noSpecialChar')) {
        return 'Password must include at least one special character';
      }
    }

    return '';
  }

  // Get form-level error message
  getFormErrorMessage(): string {
    if (this.registerForm.hasError('passwordMismatch') && this.submitted) {
      return 'Passwords do not match';
    }
    return '';
  }

  private formatFieldName(name: string): string {
    return (
      name
        .replace(/([A-Z])/g, ' $1')
        .charAt(0)
        .toUpperCase() + name.slice(1)
    );
  }

  // Get password strength label
  getPasswordStrengthLabel(): string {
    switch (this.passwordStrength) {
      case 1:
      case 2:
        return 'Weak';
      case 3:
        return 'Fair';
      case 4:
        return 'Good';
      case 5:
        return 'Strong';
      default:
        return '';
    }
  }

  // password strength color
  getPasswordStrengthColor(): string {
    switch (this.passwordStrength) {
      case 1:
      case 2:
        return '#d32f2f';
      case 3:
        return '#f57c00';
      case 4:
      case 5:
        return '#388e3c';
      default:
        return '#ccc';
    }
  }
}
