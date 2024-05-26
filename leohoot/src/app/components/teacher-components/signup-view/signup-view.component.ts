import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup-view',
  templateUrl: './signup-view.component.html',
})
export class SignupViewComponent {
  username: string = "";
  password: string = "";
  confirmPassword: string = "";

  constructor(private loginService: LoginService, private router: Router) { 

  }

  async signup()
  {
    await this.loginService.signup({username: this.username, password: this.password});
    if (this.loginService.isLoggedIn())
    {
      this.router.navigate(['/quizOverview']);
    }
  }

}
