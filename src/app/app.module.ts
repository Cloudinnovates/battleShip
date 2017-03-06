import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';
import {HttpModule}    from '@angular/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent}     from './app.component';

import {APIService}                 from './API/api.service';
import {LoginPageComponent}         from './login/login.component';
import {UsersListComponent}         from './users-list/users-list.component';
import {GamePrepareComponent}       from './game-prepare/game-prepare.component';
import {GameComponent}              from './game/game.component';
import {BattleField}                from './battle-field/battle-field.component';
import {ChangeNameComponent}        from './logout/changeName.component';
import {UserNotificationComponent}  from './user-notification/userNotification.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    LoginPageComponent,
    UsersListComponent,
    GamePrepareComponent,
    GameComponent,
    BattleField,
    ChangeNameComponent,
    UserNotificationComponent
  ],
  providers: [
    APIService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
