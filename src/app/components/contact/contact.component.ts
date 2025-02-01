import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../service/email.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  isMailSending: boolean = false;
  uploadMessage: string = '';
  isError: boolean = false;
  constructor(private fb: FormBuilder, private emailService: EmailService) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm && this.contactForm.valid) {
      this.isMailSending = true;
      this.emailService.sebdEmail(this.contactForm.value).subscribe({
        next: (data) => {
          this.uploadMessage = data.message;
        },
        error: (error) => {
          this.isError = true;
          this.isMailSending = false;
          this.uploadMessage = error.message ?? 'Something went wrong, please try again later';
        },
        complete: () => {
          this.isMailSending = false;
          this.contactForm.reset();
          setTimeout(() => {
            this.uploadMessage = '';
          }, 5000);
        }
      });
    }
  }
}
