import {Component} from '@angular/core';
import {Router} from '@angular/router';
import * as io from "socket.io-client";
import {ToastrService} from 'ngx-toastr';
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

  constructor(private router: Router, private apiService: APIService, private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.apiService.getUsersList().then((res) => {
      this.users = JSON.parse(res['_body']);
    });
    this.socket = io.connect(this.url);
    this.socket.on('connect', () => {
      this.saveUsersSession();
    });
    this.socket.on('playRequest', (data: {}) => {
      this.notificationData = data;
      this.notificationShow = true;
    });
    this.socket.on('playRequestRejected', (data: string) => {
      this.toastrService.info(`${data} rejected your request!`);
    });
    this.socket.on('playRequestAccepted', (data: {}) => {
      this.apiService.setUserStatus(this.userId, 'prepare').then((res) => {
        localStorage.setItem('gameId', data['newGameId']);
        localStorage.setItem('opponentId', data['opponentId']);
        localStorage.setItem('opponentName', data['opponentName']);
        this.router.navigate(['game-prepare']);
      });
    });
  }

  private saveUsersSession(): void {
    this.apiService.saveUserSession({id: this.userId, sessionId: this.socket.id});
  }

  private getUserSession(id: string, callback: Function): void {
    this.apiService.getUserSession(id).then((res) => {
      callback(res);
    });
  }

  private chooseOpponent(id: string): void {
    this.getUserSession(id, (res: any) => {
      this.socket.emit('askToPlay', {id: res._body, senderId: this.userId, senderName: this.userName}, (data: any) => {});
    });
  }

  private playRequestAnswer(data: {}): void {
    if (data['answer']) {
      this.setPositiveAnswer(data['users'].senderId, this.userName);
      localStorage.setItem('opponentId', data['users'].senderId);
      localStorage.setItem('opponentName', data['users'].senderName);
    } else {
      this.setNegativeAnswer(data['users'].senderId, this.userName);
    }
    this.notificationShow = false;
  }

  private setPositiveAnswer(id: string, userName: string) {
    this.apiService.getUserStatus(id).then((res) => {
      if (res['_body'] == 'free') {
        this.apiService.setUserStatus(this.userId, 'prepare').then((res) => {
        });
        this.getUserSession(id, (res: string) => {
          this.createNewGame(id, this.userId, (newGameId: string) => {
            localStorage.setItem('gameId', newGameId);
            this.socket.emit('positiveAnswer', {id: res['_body'], userName: userName, newGameId: newGameId, userId : localStorage.getItem('id')});
            this.router.navigate(['game-prepare']);
          });
        })
      } else {
        this.toastrService.info('The user is playing already!');
        this.apiService.setUserStatus(this.userId, 'free').then((res) => {});
      }
    });
  }

  private createNewGame(id1: string, id2: string, callback: Function) {
    this.apiService.createNewGame(id1, id2).then((newGame) => {
      callback(newGame);
    });
  };

  private setNegativeAnswer(id: string, userName: string) {
    this.getUserSession(id, (res: string) => {
      this.socket.emit('negativeAnswer', {id: res['_body'], userName: userName}, (data: any) => {
      });
    })
  }
}
