import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'notification',
  templateUrl: './userNotification.component.html',
  styleUrls: ['./userNotification.component.css']
})

export class UserNotificationComponent {
  @Input()
  notificationdata: Object = {};
  @Output()
  answerready = new EventEmitter<boolean>();

  constructor() {}

  acceptRequest() {
    this.answerready.emit(true);
  }

  rejectRequest() {
    this.answerready.emit(false);
  }
}
