import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tests-tasks',
  templateUrl: './tests-tasks.page.html',
  styleUrls: ['./tests-tasks.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TestsTasksPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
