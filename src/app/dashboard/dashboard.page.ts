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
  hasDoneTestToday = false; 
  moodTimeoutActive = false;


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

  await this.checkIfDailyTestDone();

  const result = await this.taskService.getLatestDailyTestResult();
  const today = new Date().toISOString().slice(0, 10);
  const resultDate = result?.fecha?.slice(0, 10);

  if (result && resultDate === today) {
    const moodSetAt = localStorage.getItem('moodSetAt');
    const moodPoints = localStorage.getItem('moodPoints');
    
    if (moodSetAt && moodPoints) {
      const now = new Date().getTime();
      const moodTime = parseInt(moodSetAt, 10);
      const elapsed = now - moodTime;

      if (elapsed < 1 * 60 * 1000) {
        // Aún está dentro del tiempo de ánimo temporal
        this.updateMood(parseInt(moodPoints, 10));

        // Solo reiniciamos el temporizador si no está activo
        if (!this.moodTimeoutActive) {
          this.moodTimeoutActive = true;
          setTimeout(() => {
            this.petMood = 'normal';
            this.moodTimeoutActive = false;
          }, 1 * 60 * 1000 - elapsed); // Esperar el tiempo restante
        }

      } else {
        this.petMood = 'normal';
        localStorage.removeItem('moodSetAt');
        localStorage.removeItem('moodPoints');
      }

    } else {
      // No se había guardado el estado temporal
      this.setTemporaryMood(result.puntos);
    }

  } else {
    this.petMood = 'normal';
  }
  }

  updateMood(puntos: number) {
  if (puntos <= 9) {
    this.petMood = 'sad';
  } else if (puntos <= 14) {
    this.petMood = 'weird';
  } else {
    this.petMood = 'happy';
  }
}


  setTemporaryMood(puntos: number) {
  const now = new Date().getTime();
  localStorage.setItem('moodSetAt', now.toString());
  localStorage.setItem('moodPoints', puntos.toString());

  this.updateMood(puntos);

  // Solo ponemos el temporizador si aún no existe
  if (!this.moodTimeoutActive) {
    this.moodTimeoutActive = true;
    setTimeout(() => {
      this.petMood = 'normal';
      this.moodTimeoutActive = false;
    }, 1 * 60 * 1000); // 2 minutos
  }
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

    if (puntos <= 9) return 'sad';
    else if (puntos <= 14) return 'weird';
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
