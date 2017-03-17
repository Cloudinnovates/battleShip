import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CanActivateRoutes} from './routeAccess/CanActivateRoutes';
import {LoginPageComponent} from './login/login.component';
import {UsersListComponent}  from './users-list/users-list.component';
import {GamePrepareComponent}  from './game-prepare/game-prepare.component';
import {GameComponent}  from './game/game.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [CanActivateRoutes]
  },
  {
    path: 'users',
    component: UsersListComponent,
    canActivate: [CanActivateRoutes]
  },
  {
    path: 'game-prepare',
    component: GamePrepareComponent,
    canActivate: [CanActivateRoutes]
  },
  {
    path: 'game',
    component: GameComponent,
    canActivate: [CanActivateRoutes]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
