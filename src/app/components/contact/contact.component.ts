import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup ;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm && this.contactForm.valid) {
      const formData = this.contactForm.value;
      console.log('Email sent successfully', formData);

      // this.sendEmail(formData).subscribe(response => {
      //   console.log('Email sent successfully', response);
      // }, error => {
      //   console.error('Error sending email', error);
      // });
    }
  }

  // sendEmail(formData: any) {
  //   const emailData = {
  //     to: 'your-email@gmail.com',
  //     subject: 'Contact Form Submission',
  //     text: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`
  //   };
  //   return this.http.post('https://your-email-api-endpoint', emailData);
  // }
}
