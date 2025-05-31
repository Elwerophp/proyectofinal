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
  petName: string = '';
  doorIsOpen: boolean = false;
  petMood: string = 'normal';
  hasDoneTestToday = false; // Inicializamos a falso


  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) { }

 
  async ngOnInit() {
    await this.loadDashboardData();
  }


  async ionViewWillEnter() {
  await this.loadDashboardData();
  }


  async loadDashboardData() {
  const pet = await this.taskService.getUserPet();
  if (!pet) {
    this.router.navigate(['/pet-select']); 
  }
  this.userPet = pet;

  const name = await this.taskService.getPetName();
  this.petName = name || 'Your Pet';

  this.petMood = await this.calculatePetMood();

  await this.checkIfDailyTestDone(); // AHORA ES ASÍ: async y esperando Firestore
  }

  
  getPetImageUrl(pet: string): string {
    const baseFile = this.mapPetNameToFile(pet);
    return `assets/Dashboard/${baseFile}_${this.petMood}.png`;
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
        return 'blackCat';
      case 'Gato gris':
        return 'grayCat';
      case 'Gato naranja':
        return 'orangeCat';
      default:
        return 'grayCat';
    }
  }

  async calculatePetMood(): Promise<string> {
    const result = await this.taskService.getLatestDailyTestResult();
    console.log('Último resultado test:', result);
    if (!result) return 'normal';

    const puntos = result.puntos;
    console.log('Puntos obtenidos:', puntos);

    if (puntos <= 13) return 'sad';
    else if (puntos <= 23) return 'weird';
    else return 'happy';
  }

  goToDailyTest() {
  if (this.hasDoneTestToday) {
    alert('¡Ya has completado el test diario hoy. Vuelve mañana!');
    return;
  }
  this.router.navigate(['/tests-tasks']);
  }

  async checkIfDailyTestDone() {
    const result = await this.taskService.getLatestDailyTestResult();
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    if (!result || !result.fecha) {
      this.hasDoneTestToday = false;
      return;
    }

    const resultDate = result.fecha.slice(0, 10); // Asegura comparar solo el día
    this.hasDoneTestToday = resultDate === today;

    console.log('Fecha del último test:', resultDate);
    console.log('¿Test hecho hoy?:', this.hasDoneTestToday);
  }
}
