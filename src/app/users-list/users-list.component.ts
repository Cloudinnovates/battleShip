import {Component} from '@angular/core';
import {Router} from '@angular/router';
import * as io from "socket.io-client";
import {APIService} from '../API/api.service';
import {User}        from '../user';

@Component({
  moduleId: module.id,
  selector: 'users',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})

export class UsersListComponent {
  private users: User[] = [];
  private userId: string = localStorage.getItem('id');
  private userName: string = localStorage.getItem('userName');
  private url: string = 'http://localhost:3000';
  private socket: any = null;
  private notificationShow: boolean = false;
  private notificationData: Object = {};

  constructor(private router: Router, private apiService: APIService) {
    this.apiService.getUsersList().then((res) => {
      this.users = JSON.parse(res['_body']);
    });
  }

  ngOnInit() {
    this.socket = io.connect(this.url);
    this.socket.on('connect', () => {
      this.saveUsersSession();
    });
    this.socket.on('playRequest', (data: {}) => {
      this.notificationData = data;
      this.notificationShow = true;
    });
  }

  saveUsersSession(): void {
    this.apiService.saveUserSession({id: this.userId, sessionId: this.socket.id});
  }

  getUserSession(id: string, callback: Function):void {
    this.apiService.getUserSession(id).then((res) => {
      callback(res);
    });
  }

  chooseOpponent(id: string): void {
    this.getUserSession(id, (res:any) => {
      this.socket.emit('askToPlay', {id : res._body, senderId: this.userId, senderName: this.userName}, (data: any) => {
        console.log('client on chooseOpponent');
        console.log(data);
      });
    });
  }

  playRequestAnswer(answer: boolean): void {
    console.log('answer ' + answer);
  }
}
