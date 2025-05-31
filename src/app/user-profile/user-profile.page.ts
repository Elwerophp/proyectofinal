import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class UserProfilePage implements OnInit {

  profileIcon: string = '';
  nickname: string = '';
  streakDays: number = 1;

  constructor(private taskService: TaskService, private router: Router) {}

  async ngOnInit() {
    const pet = await this.taskService.getUserPet();
    const name = await this.taskService.getUserNickname();
    this.nickname = name || 'Tu Mascota';

    this.profileIcon = this.getProfileIcon(pet);

    this.streakDays = await this.getLoginStreak();
  }

  getProfileIcon(pet: string): string {
    switch (pet) {
      case 'Gato negro': return 'assets/profileIcon_blackCat.png';
      case 'Gato gris': return 'assets/profileIcon_grayCat.png';
      case 'Gato naranja': return 'assets/profileIcon_orangeCat.png';
      default: return 'assets/profileIcon_grayCat.png';
    }
  }

  async getLoginStreak(): Promise<number> {
    const testCollection = await this.taskService.getAllDailyTestResults(); // deberás crear este método si aún no existe
    const uniqueDates = new Set(testCollection.map(t => t.fecha.slice(0, 10)));
    return uniqueDates.size;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getStreakProgress(): number {
  const maxStreak = 7; // o el número máximo que quieras usar como meta
  return Math.min((this.streakDays / maxStreak) * 100, 100);
}

}
