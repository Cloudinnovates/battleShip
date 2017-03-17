import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {APIService} from '../API/api.service';

@Component({
  moduleId: module.id,
  selector: 'change-name',
  templateUrl: './changeName.component.html',
  styleUrls: ['./changeName.component.css']
})

export class ChangeNameComponent {
  private username: string;
  private id: string;

  constructor(private apiService: APIService, private router: Router) {
    this.username = localStorage.getItem('userName');
    this.id = localStorage.getItem('id');
  }

  changeName() {
    this.apiService.logout(this.id).then((response) => {
      if (response.status == 200) {
        localStorage.removeItem('userName');
        localStorage.removeItem('id');
        localStorage.removeItem('status');
        localStorage.removeItem('gameId');
        localStorage.removeItem('opponentId');
        localStorage.removeItem('opponentName');
        this.router.navigate(['login']);
      }
    });
  }
}
