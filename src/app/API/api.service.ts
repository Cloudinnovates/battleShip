import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {Fleet} from '../fleet/fleet';
import {ShipCell} from '../ship/shipCell';
import {User} from  '../user';

@Injectable()
export class APIService {
  private fleet: Fleet;
  private APIUrl = 'http://127.0.0.1:3000/';
  private headers = new Headers({'Content-Type': 'application/json;charset=utf-8'});

  constructor(private http: Http) {
  }

  login(username: string): Promise<User[]> {
    return this.http
      .post(this.APIUrl + 'login', {username: username}, {headers: this.headers})
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  logout(id: string): Promise<any> {
    return this.http
      .delete(this.APIUrl + 'login/?id=' + id, {headers: this.headers})
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  getUsersList(): Promise<User[]> {
    return this.http
      .get(this.APIUrl + 'users', {headers: this.headers})
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  saveUserSession(data: {}): Promise<string> {
    return this.http
      .post(this.APIUrl + 'session', data, {headers: this.headers})
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  getUserSession(userId: string): Promise<string> {
    return this.http
      .get(this.APIUrl + 'session/?userId=' + userId, {headers: this.headers})
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  setUserStatus(userId: string, status: string): Promise<string> {
    return this.http
      .post(this.APIUrl + 'users/set-status', {id: userId, status: status}, {headers: this.headers})
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  getUserStatus(userId: string): Promise<string> {
    return this.http
      .post(this.APIUrl + 'users/get-status', {id: userId}, {headers: this.headers})
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  createNewGame(player1Id: string, player2Id: string): Promise<string> {
    return this.http
      .post(this.APIUrl + 'game', {player1Id: player1Id, player2Id: player2Id}, {headers: this.headers})
      .toPromise()
      .then((res) => {
        let userId = JSON.parse(res['_body'])['_id'];
        return userId;
      })
      .catch(this.handleError);
  }

  setFleet(gameId: string, userId: string, fleet: ShipCell[]): Promise<string> {
    return this.http
      .post(this.APIUrl + 'game/set-fleet', {gameId: gameId, userId: userId, fleet: fleet}, {headers: this.headers})
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  getFleet(gameId: string, userId: string): Promise<string> {
    return this.http
      .post(this.APIUrl + 'game/get-fleet', {gameId: gameId, userId: userId}, {headers: this.headers})
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  shoot(gameId: string, userId: string, coords: {x: number, y: number}): Promise<string> {
    return this.http
      .post(this.APIUrl + 'game/shoot', {gameId, userId, coords}, {headers: this.headers})
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  getBattleProgress(gameId: string, userId: string): Promise<string> {
    return this.http
      .post(this.APIUrl + 'game/get-data', {gameId, userId}, {headers: this.headers})
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
