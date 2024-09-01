import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    public formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.error = '';
    this.userService.signin(this.loginForm.value).subscribe(
      data => {
        if (!data || !data.token) {
          this.error = 'Email or password is incorrect';
          this.loading = false;
        } else {
          console.log('Login successful');
          const role = data.role;
          switch (role) {
            case 'Admin':
            case 'Employee':
            case 'Manager':
              this.router.navigate(['/home']);
              break;
            default:
              console.log('Unknown role:', data);
              this.error = 'Unknown user role';
              break;
          }
        }
      },
      err => {
        this.error = 'Login failed';
        this.loading = false;
      }
    );
  }
}
