import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent implements OnInit {
  updatePasswordForm!: FormGroup;
  errorMsg!: string;
  newPassword: string = '';
  confirmNewPassword: string = '';
  user: any | undefined;
  id!: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.getByID(this.id);
    this.updatePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validator: this.matchPassword });
  }

  getByID(id: any): void {
    this.userService.getUserById(id)
      .subscribe(
        data => {
          this.user = data;
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
  }

  matchPassword(group: FormGroup) {
    let newPassword = group.get('newPassword')?.value;
    let confirmNewPassword = group.get('confirmNewPassword')?.value;

    if (newPassword !== confirmNewPassword) {
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  onSubmit() {
    this.userService.changePassword(
      this.user?._id || '',
      this.updatePasswordForm.value.oldPassword,
      this.updatePasswordForm.value.newPassword
    ).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/home']);
      },
      error => {
        console.log(error);
        this.errorMsg = error.error.msg;
      }
    );
  }

}
