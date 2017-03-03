import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {Fleet} from '../fleet/fleet';
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

  saveUserSession(data: {}):Promise<string> {
    return this.http
      .post(this.APIUrl + 'session', data, {headers: this.headers})
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  getUserSession(userId: string):Promise<string> {
    return this.http
      .get(this.APIUrl + 'session/?userId=' + userId, {headers: this.headers})
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  setFleet(obj: Fleet) {
    this.fleet = obj;
    console.log(this.fleet);
  }

  getFleet() {
    console.log(this.fleet);
    return this.fleet;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
