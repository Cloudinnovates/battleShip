import {Component} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import * as io from "socket.io-client";

import {APIService} from '../API/api.service';
import {FieldCoords} from '../models/FieldCoords';

@Component({
  moduleId: module.id,
  selector: 'game',
  templateUrl: 'game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent {
  private userId: string = localStorage.getItem('id');
  private gameId: string = localStorage.getItem('gameId');
  private userName: string = localStorage.getItem('userName');
  private shipsCoords: Array<{x: number, y: number}>;
  private opponentName: string = localStorage.getItem('opponentName');
  private opponentId: string = localStorage.getItem('opponentId');
  private url: string = 'http://localhost:3000';
  private socket: any = null;
  private userCoords: FieldCoords = {};
  private coordsForUser: FieldCoords = {};
  private opponentCoords: FieldCoords = {};
  private coordsForOpponent: FieldCoords = {};
  private isOpponentReady: boolean = false;
  private canFire: boolean = false;

  constructor(private apiService: APIService, private router: Router, private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.checkOpponentStatus();
    this.setPlayingStatus();
    this.socket = io.connect(this.url);
    this.socket.on('connect', () => {
      this.saveUsersSession();
    });
    this.socket.on('gameLose', () => {
      this.toastrService.info('You lose!');
      this.onGameEnd();
    });
    this.socket.on('opponentShoot', () => {
      this.battleProgressLoad();
    });
    this.socket.on('opponentReady', () => {
      this.setOpponentReady();
    });
  }

  ngAfterViewInit() {
    this.getFleet();
    this.battleProgressLoad();
  }

  private getFleet(): void {
    this.apiService.getFleet(this.gameId, this.userId).then((res) => {
      let data = JSON.parse(res['_body']).shipsCellsCoords;
      this.coordsForUser.shipCoords = data;
      this.userCoords = this.coordsForUser;
    });
  }

  private battleProgressLoad() {
    this.apiService.getBattleProgress(this.gameId, this.userId).then((res: any) => {
      let response = JSON.parse(res['_body']);
      let user = response.user;
      let opponent = response.opponent;
      this.canFire = response.canFire;

      this.coordsForOpponent.passCoords = user.pureShots;
      this.coordsForOpponent.hitCoords = user.shipCellsDestroyed;

      this.coordsForUser.passCoords = opponent.pureShots;
      this.coordsForUser.hitCoords = opponent.shipCellsDestroyed;

      this.userCoords = this.coordsForUser;
      this.opponentCoords = this.coordsForOpponent;
    });
  }

  private saveUsersSession(): void {
    this.apiService.saveUserSession({id: this.userId, sessionId: this.socket.id});
  }

  private checkShoot(coords: {x: number, y: number}) {
    if(this.isOpponentReady) {
      this.apiService.shoot(this.gameId, this.userId, coords).then((res) => {
        let response = JSON.parse(res['_body']);
        if (response['result'] == 'wait') {
          this.toastrService.info(response['message']);
        } else if (response['result'] == 'end') {
          this.battleProgressLoad();
          this.toastrService.info('You win!');
          this.endGame();
        } else {
          this.apiService.getUserSession(this.opponentId).then((res: any) => {
            this.socket.emit('opponentShootAction', {id: res._body});
          });
          this.battleProgressLoad();
        }
      });
    } else {
      this.toastrService.info(this.opponentName + ' is preparing for battle.');
    }

  }

  private endGame() {
    this.apiService.getUserSession(this.opponentId).then((res: any) => {
      this.socket.emit('endGame', {id: res._body});
    });
    this.onGameEnd();
  }

  private setPlayingStatus() {
    this.apiService.getUserSession(this.opponentId).then((res: any) => {
      this.socket.emit('opponentReadyAction', {id: res._body});
    });
  }

  private checkOpponentStatus() {
    this.apiService.getUserStatus(this.opponentId).then((res: any) => {
      if(res._body === 'ready') {
        this.isOpponentReady = true;
      }
    })
  }

  private setOpponentReady() {
    this.isOpponentReady = true;
  }

  private onGameEnd() {
    this.apiService.setUserStatus(this.userId, 'free').then((res) => {
      localStorage.setItem('status', 'free');
      localStorage.removeItem('gameId');
      localStorage.removeItem('opponentId');
      localStorage.removeItem('opponentName');
      this.router.navigate(['users']);
    });

  }
}
