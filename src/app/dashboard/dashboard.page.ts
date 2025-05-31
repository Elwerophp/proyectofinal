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

    this.checkIfDailyTestDone();
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

  checkIfDailyTestDone() {
    const lastTestDate = localStorage.getItem('lastDailyTestDate');
    const today = new Date().toISOString().slice(0, 10); // Formato: YYYY-MM-DD

    // --- LOGS DE DEPURACIÓN ---
    console.log('--- Verificando Daily Test en Dashboard ---');
    console.log('lastDailyTestDate (desde localStorage):', lastTestDate);
    console.log('today (fecha actual generada):', today);
    console.log('¿Son las fechas iguales (lastDailyTestDate === today)?', lastTestDate === today);
    // --- FIN LOGS DE DEPURACIÓN ---

    this.hasDoneTestToday = lastTestDate === today;
    console.log(`Estado final de hasDoneTestToday: ${this.hasDoneTestToday}`);
    console.log('------------------------------------------');
  }


  markDailyTestAsDone() {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('lastDailyTestDate', today);
    this.hasDoneTestToday = true;
    console.log('Test diario marcado como completado para hoy (desde DashboardPage).');
  }
}
