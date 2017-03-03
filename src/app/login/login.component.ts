import {Component} from '@angular/core';
import {APIService} from '../API/api.service';
import {Router} from '@angular/router';
import 'rxjs/add/operator/toPromise';

@Component({
  moduleId: module.id,
  selector: 'login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginPageComponent {
  private username: string;

  constructor(private apiService: APIService, private router: Router) {
    if(localStorage.getItem('userName') && localStorage.getItem('id')) {
      this.router.navigate(['users']);
    }
  }

  createUser() {
    this.apiService.login(this.username).then((response) => {
      let user = JSON.parse(response['_body']);
      localStorage.setItem('userName', user.username);
      localStorage.setItem('id', user._id);
      this.router.navigate(['users']);
    });
  }
}
