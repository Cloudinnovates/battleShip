import {Component} from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/toPromise';

import {APIService} from '../API/api.service';

@Component({
  moduleId: module.id,
  selector: 'login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginPageComponent {
  private username: string;

  constructor(private apiService: APIService, private router: Router) {

  }

  createUser() {
    this.apiService.login(this.username).then((response) => {
      let user = JSON.parse(response['_body']);
      localStorage.setItem('userName', user.username);
      localStorage.setItem('id', user._id);
      localStorage.setItem('status', 'free');
      this.router.navigate(['users']);
    });
  }
}
