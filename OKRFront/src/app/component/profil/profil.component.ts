import { Component,OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  userProfile: any;
  error: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.userService.getCurrentUserProfile().subscribe(
      (response) => {
        this.userProfile = response;
      },
      (error) => {
        this.error = error;
      }
    );
  }
}