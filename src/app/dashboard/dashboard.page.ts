import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from '../auth.service';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DashboardPage implements OnInit {

  userPet: string = '';


  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    const pet = await this.taskService.getUserPet();
    if (!pet) {
      this.router.navigate(['/pet-select']);
      return;
    }
    this.userPet = pet;
  }

  getPetImageUrl(pet: string): string {
    const file = this.mapPetNameToFile(pet);
    return `assets/Dashboard/${file}.png`;
  }

  getProfileIcon(pet: string): string {
    const file = this.mapPetNameToFile(pet);
    return `assets/profileIcon_${file}.png`;
  }

  goToProfile() {
    this.router.navigate(['/user-profile']);
  }

  goToShop() {
    this.router.navigate(['/store']);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  mapPetNameToFile(selectedPet: string): string {
    switch (selectedPet) {
      case 'Gato negro':
        return 'blackCat_normal';
      case 'Gato gris':
        return 'grayCat_normal';
      case 'Gato naranja':
        return 'orangeCat_normal';
      default:
        return 'grayCat_normal';
    }
  }


}
