import {NgModule}             from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginPageComponent}  from './login/login.component';
import {UsersListComponent}  from './users-list/users-list.component';
import {GamePrepareComponent}  from './game-prepare/game-prepare.component';
import {GameComponent}  from './game/game.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginPageComponent},
  {path: 'users', component: UsersListComponent},
  {path: 'game-prepare', component: GamePrepareComponent},
  {path: 'game', component: GameComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
