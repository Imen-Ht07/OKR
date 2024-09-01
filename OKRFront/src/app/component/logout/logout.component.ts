import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  constructor ( private userService: UserService){}
  async logOut() {
    if (confirm("Do you want to log out?")) {
      await this.userService.signout()
    }
  }
}
