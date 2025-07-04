import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from '../auth.service';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

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
  clickCount = 0;
  clickTimerActive = false;
  isPetPressed = false;
  isHoveringPet = false;
  
  playMissionCompleted = false;
  dailyTestDone = false;
  boughtItem = false;
  allMissionsCompleted = false;
  coins: number = 0;
  equippedItem: string = '';
  equippedItems: string[] = []; // array de ids de cosméticos equipados

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private firestore: Firestore,
    private auth: Auth
  ) { }

 
  async ngOnInit() {
    await this.loadDashboardData();
    await this.loadCoins();
    await this.loadUserData();
  }


  async ionViewWillEnter() {
  await this.loadDashboardData();
  await this.loadCoins();
  await this.loadUserData();
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
  await this.loadMissionStatus();
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

  async onPetClick() {
  if (this.clickTimerActive) return;
  this.isPetPressed = true;
  setTimeout(() => { this.isPetPressed = false; }, 150);
  this.clickCount++;
  if (this.clickCount >= 10) {
    this.petMood = 'happy';
    this.clickTimerActive = true;
    if (!this.playMissionCompleted) {
      this.playMissionCompleted = true;
      // Marca la misión como completada y da monedas
      await this.taskService.setMissionStatus(this.today, { playWithPet: true });
      await this.checkAllMissions?.();
    }
    setTimeout(() => {
      this.petMood = 'normal';
      this.clickCount = 0;
      this.clickTimerActive = false;
    }, 30000);
  }
}

   async loadMissionStatus() {
    const status = await this.taskService.getMissionStatus(this.today);
     console.log('📘 Estado de misiones del día:', status);
    this.playMissionCompleted = !!status?.playWithPet;
    this.dailyTestDone = !!status?.dailyTestDone;
    this.boughtItem = !!status?.boughtItem;
    this.allMissionsCompleted = !!status?.allMissionsCompleted;
  }

  get today(): string {
      return new Date().toISOString().slice(0, 10);
  }

  async checkAllMissions() {
  if (
    this.playMissionCompleted &&
    this.dailyTestDone &&
    this.boughtItem &&
    !this.allMissionsCompleted
  ) {
    console.log('🎯 ¡Todas las misiones completadas! Guardando en Firestore...');
    this.allMissionsCompleted = true;
    await this.taskService.setMissionStatus(this.today, {
      allMissionsCompleted: true,
    });
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

  // ✅ Si ya hizo el test hoy, guarda eso como misión completada
  if (this.hasDoneTestToday) {
    await this.taskService.setMissionStatus(today, {
      dailyTestDone: true
    });

    // Opcional: recarga estado de misiones
    await this.loadMissionStatus();

    // También podrías verificar si ya se completaron todas las misiones
    await this.checkAllMissions();
  }
}

async loadCoins() {
  const user = this.auth.currentUser;
  if (!user) return;
  const userDocRef = doc(this.firestore, `users/${user.uid}`);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const data = userDoc.data();
    this.coins = data['coins'] || 0;
  }
}

// Cargar los cosméticos equipados desde Firestore
async loadUserData() {
  const user = this.auth.currentUser;
  if (!user) return;
  const userDocRef = doc(this.firestore, `users/${user.uid}`);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const data = userDoc.data();
    this.equippedItems = data['equippedItems'] || [];
    // ...otros datos...
  }
}

// Devuelve la clase CSS para cada asset según el tipo
getAssetClass(assetId: string): string {
  switch (assetId) {
    case 'crown':
      return 'top-0 left-1/2 transform -translate-x-1/2 w-32 h-32';
    case 'strawberryhat':
      return 'top-2 left-1/2 transform -translate-x-1/2 w-28 h-28';
    case 'sunglasses':
      return 'top-16 left-1/2 transform -translate-x-1/2 w-24 h-12';
    case 'tophat':
      return 'top-0 left-1/2 transform -translate-x-1/2 w-32 h-32';
    default:
      return 'top-0 left-1/2 transform -translate-x-1/2 w-32 h-32';
  }
}
async setMissionStatus(date: string, status: any) {
  const user = this.auth.currentUser;
  if (!user) throw new Error('No authenticated user');

  const missionDocRef = doc(this.firestore, `users/${user.uid}/missions/${date}`);
  const missionSnap = await getDoc(missionDocRef);
  const prevData = missionSnap.exists() ? missionSnap.data() : {};

  // Por cada misión, si se completa por primera vez, suma monedas
  if (status['playWithPet'] && !prevData['playWithPet']) {
    await this.addCoins(user.uid, 15);
  }
  if (status['dailyTestDone'] && !prevData['dailyTestDone']) {
    await this.addCoins(user.uid, 15);
  }
  if (status['boughtItem'] && !prevData['boughtItem']) {
    await this.addCoins(user.uid, 15);
  }

  // Lógica para completar la cuarta misión automáticamente
  const completedPlay = status['playWithPet'] || prevData['playWithPet'];
  const completedTest = status['dailyTestDone'] || prevData['dailyTestDone'];
  const completedBuy = status['boughtItem'] || prevData['boughtItem'];
  const alreadyAllDone = status['allMissionsCompleted'] || prevData['allMissionsCompleted'];

  if (completedPlay && completedTest && completedBuy && !alreadyAllDone) {
    // Marca la cuarta misión y da 15 monedas
    await setDoc(missionDocRef, { ...prevData, ...status, allMissionsCompleted: true }, { merge: true });
    await this.addCoins(user.uid, 15);
    return;
  }

  // Actualiza el estado de la misión normalmente
  await setDoc(missionDocRef, { ...prevData, ...status }, { merge: true });
}

// Suma monedas al usuario
async addCoins(uid: string, amount: number) {
  const userDocRef = doc(this.firestore, `users/${uid}`);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const data = userDoc.data();
    const currentCoins = data['coins'] || 0;
    await updateDoc(userDocRef, { coins: currentCoins + amount });
  }
} }


