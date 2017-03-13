import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import {APIService} from '../API/api.service';
import {Router} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'game',
  templateUrl: 'game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent {
  private userId: string = localStorage.getItem('id');
  private gameId: string = localStorage.getItem('gameId');
  private shipsCoords: Array<{x: number, y: number}>;

  constructor(private apiService: APIService, private router : Router, private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.getFleet();
  }

  getFleet() {
    this.apiService.getFleet(this.gameId, this.userId).then((res) => {
      this.shipsCoords = JSON.parse(res['_body']).shipsCellsCoords;
    })
  }

}
