import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Router} from '@angular/router';

@Injectable()
export class CanActivateRoutes implements CanActivate {
  constructor(private router: Router) {}

  canActivate(ActivatedRouteSnapshot: any, RouterStateSnapshot: any) {
    let url = RouterStateSnapshot.url;
    let status = localStorage.getItem('status');
    if(status) {
      if(status == 'free' && url != '/users') {
        this.router.navigate(['users']);
        return false;
      } else if(status == 'prepare' && url != '/game-prepare') {
        this.router.navigate(['game-prepare']);
        return false;
      } else if(status == 'ready' && url != '/game') {
        this.router.navigate(['game']);
        return false;
      } else {
        return true;
      }
    } else {
      if(url != '/login') {
        this.router.navigate(['login']);
        return false;
      } else {
        return true;
      }
    }
  }

}
