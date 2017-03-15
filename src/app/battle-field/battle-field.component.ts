import {Component, ElementRef, Renderer, Input, OnChanges, SimpleChanges} from "@angular/core";
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import * as io from "socket.io-client";

import {APIService} from '../API/api.service';

@Component({
  moduleId: module.id,
  selector: 'battle-field',
  templateUrl: 'battle-field.component.html',
  styleUrls: ['./battle-field.component.css']
})

export class BattleField implements OnChanges {
  private battleCoords: {top: number, left: number};
  private componentElement: ElementRef;
  private renderer: Renderer;
  private battleField: any;
  private userId: string = localStorage.getItem('id');
  private opponentId: string = localStorage.getItem('opponentId');
  private gameId: string = localStorage.getItem('gameId');
  private url: string = 'http://localhost:3000';
  private socket: any = null;

  @Input()
  coordsdata: Array<{x: number, y: number}>;

  @Input()
  fieldtype: string;

  constructor(private router: Router, componentElement: ElementRef, renderer: Renderer, private apiService: APIService, private toastrService: ToastrService) {
    this.componentElement = componentElement;
    this.renderer = renderer;
  }

  ngOnInit() {
    this.createBattleField();
    this.renderer.listen(this.battleField, 'click', (event: MouseEvent) => {
      this.fireCoords(event);
    });
    this.socket = io.connect(this.url);
    this.socket.on('connect', () => {
      this.saveUsersSession();
    });
    if (this.fieldtype == 'user') {
      this.battleProgressLoad();
    }
    this.socket.on('gameLose', () => {
      this.apiService.setUserStatus(this.userId, 'free').then((res) => {
      });
      this.toastrService.info('You lose!');
      localStorage.removeItem('gameId');
      localStorage.removeItem('opponentId');
      localStorage.removeItem('opponentName');
      this.router.navigate(['users']);
    });
    this.socket.on('opponentShoot', (data: any) => {
      console.log(this);
      this.opponentShootDraw(data.shootInfo);
    });
  }

  ngAfterViewInit() {
    this.setBattleFieldCoords();
  }

  private opponentShootDraw(data: any) {
    if (this.fieldtype == 'opponent') {
      console.log('drawShoot');
      this.drawShoots(data);
    }
  }

  private saveUsersSession(): void {
    this.apiService.saveUserSession({id: this.userId, sessionId: this.socket.id});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.coordsdata) {
      let newCoords = changes['coordsdata'].currentValue;
      if (newCoords && newCoords.length > 0) {
        this.drawShips(newCoords);
      }
    }
  }

  private battleProgressLoad() {
    this.apiService.getBattleProgress(this.gameId, this.userId).then((res: any) => {
      let data = JSON.parse(res['_body']).user;
      data.pureShots.forEach((item: {x: number, y: number}, key: number) => {
        this.drawPass(item);
      });
      data.shipCellsDestroyed.forEach((item: {x: number, y: number}, key: number) => {
        this.drawHit(item);
      });
    })
  }

  private fireCoords(event: MouseEvent) {
    if (this.fieldtype == 'user') {
      let pageX = Math.floor((event.pageX - this.battleCoords.left) / 30);
      let pageY = Math.floor((event.pageY - this.battleCoords.top) / 30);
      this.apiService.shoot(this.gameId, this.userId, {x: pageX, y: pageY}).then((res) => {
        let response = JSON.parse(res['_body']);
        if (response['result'] == 'wait') {
          this.toastrService.info(response['message']);
        } else if (response['result'] == 'end') {
          this.drawHit(response['message']);
          this.toastrService.info('You win!');
          this.endGame();
        } else {
          this.drawShoots(response);
          this.apiService.getUserSession(this.opponentId).then((res: any) => {
            this.socket.emit('opponentShootAction', {id: res._body, shootInfo: response});
          });
        }
      })
    }
  }

  private endGame() {
    this.apiService.setUserStatus(this.userId, 'free').then((res) => {
    });
    localStorage.removeItem('gameId');
    localStorage.removeItem('opponentId');
    localStorage.removeItem('opponentName');
    this.apiService.getUserSession(this.opponentId).then((res: any) => {
      this.socket.emit('endGame', {id: res._body});
    });
    this.router.navigate(['users']);
  }

  private drawShoots(res: {}) {
    let coords = res['message'];
    console.log(coords);
    console.log(res['result']);
    if (res['result'] == 'pass') {
      this.drawPass(coords);
    } else {
      this.drawHit(coords);
    }
  }

  private drawPass(coords: {x: number, y: number}): void {
    let ctx = this.battleField.getContext('2d');
    let startX: number = 43 + (coords.x * 30);
    let startY: number = 43 + (coords.y * 30);
    ctx.fillRect(startX, startY, 6, 6);
  }

  private drawHit(coords: {x: number, y: number}): void {
    let ctx = this.battleField.getContext('2d');
    ctx.lineWidth = .7;
    ctx.strokeStyle = "#ef2b2b";
    let startX: number = 30 + (coords.x * 30);
    let startY: number = 30 + (coords.y * 30);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + 30, startY + 30);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(startX + 30, startY);
    ctx.lineTo(startX, startY + 30);
    ctx.stroke();
  }

  private createBattleField() {
    this.battleField = document.createElement('canvas');
    let ctx = this.battleField.getContext('2d');
    this.battleField.width = 330;
    this.battleField.height = 330;
    ctx.lineWidth = .3;
    ctx.strokeStyle = "#6f00ff";
    for (let i = 1; i <= 11; i++) {
      ctx.beginPath();
      ctx.moveTo(30 * i, 30);
      ctx.lineTo(30 * i, 330);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(30, 30 * i);
      ctx.lineTo(330, 30 * i);
      ctx.stroke();
    }
    this.componentElement.nativeElement.appendChild(this.battleField);
  }

  private drawShips(coords: Array<{x: number, y: number}>) {
    let ctx = this.battleField.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#6f00ff";
    coords.forEach(function (item, key) {
      let startX: number = 30 + (item.x * 30);
      let startY: number = 30 + (item.y * 30);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + 30, startY);
      ctx.lineTo(startX + 30, startY + 30);
      ctx.lineTo(startX, startY + 30);
      ctx.lineTo(startX, startY);
      ctx.stroke();
    });
  }

  private setBattleFieldCoords(): void {
    this.battleCoords = this.getCoords(this.battleField);
    this.battleCoords.left = this.battleCoords.left + 30;
    this.battleCoords.top = this.battleCoords.top + 30;
  }

  private getCoords(elem: HTMLElement): {top: number, left: number} {
    let box = elem.getBoundingClientRect();
    let body = document.body;
    let docEl = document.documentElement;
    let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    let clientTop = docEl.clientTop || body.clientTop || 0;
    let clientLeft = docEl.clientLeft || body.clientLeft || 0;
    let top = box.top + scrollTop - clientTop;
    let left = box.left + scrollLeft - clientLeft;
    return {top: Math.round(top), left: Math.round(left)};
  }
}
