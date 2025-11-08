import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-dasboard-menu',
  imports: [CommonModule,RouterLink,RouterOutlet],
  templateUrl: './dasboard-menu.html',
  styleUrl: './dasboard-menu.css',
})
export class DasboardMenu {

}
