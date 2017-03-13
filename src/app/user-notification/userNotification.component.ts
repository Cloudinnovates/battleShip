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
  answerready = new EventEmitter<{}>();

  constructor() {}

  createAnswer(answer: boolean) {
    console.log(this.notificationdata);
    this.answerready.emit({answer: answer, users : this.notificationdata});
  }
}
