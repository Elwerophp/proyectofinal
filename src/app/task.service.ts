import { Injectable } from '@angular/core';
import {runTransaction, Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { query, where, orderBy, limit, getDocs} from '@angular/fire/firestore';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksCollection = collection(this.firestore, 'tasks');

  constructor(private firestore: Firestore, private auth: Auth, private authService: AuthService) { }

  getTasks(): Observable<Task[]> {
    return collectionData(this.tasksCollection, { idField: 'id' }) as Observable<Task[]>;
  }

  addTask(task: Task) {
    return addDoc(this.tasksCollection, task);
  }

  updateTask(id: string, data: Partial<Task>) {
    const taskDoc = doc(this.firestore, `tasks/${id}`);
    return updateDoc(taskDoc, data);
  }

  deleteTask(id: string) {
    const taskDoc = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(taskDoc);
  }

  getUserCoins(userId: string) {
  const userRef = doc(this.firestore, `users/${userId}`);
  return getDoc(userRef).then(docSnap => {
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  });
  }

  async setUserPet(petName: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userDocRef, { selectedPet: petName }, { merge: true });
  }

  async getUserPet(): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      const selectedPet = data['selectedPet'];
      if (typeof selectedPet === 'string') {
        return selectedPet;
      } else {
        throw new Error('selectedPet is missing or not a string');
      }
    }

    throw new Error('User document does not exist');
  }


  async setPetName(petName: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userDocRef, { petName }, { merge: true });
  }

  async getPetName(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data['petName'] || null;
    }
    return null;
  }

  async setDailyTestResult(data: {
    puntos: number;
    estado: string;
    fecha: string;
    moods: { morning: string[]; afternoon: string[] };
    }) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const fechaId = data.fecha.slice(0, 10); // YYYY-MM-DD

    const testDocRef = doc(this.firestore, `users/${user.uid}/dailyTests/${fechaId}`);

    const dataToSave = {
      ...data,
      uid: user.uid,
      fecha: fechaId
    };

    await setDoc(testDocRef, dataToSave, { merge: true });
  }

  async getLatestDailyTestResult(): Promise<any | null> {
    const user = this.auth.currentUser;
    if (!user) return null;

    const dailyTestCollection = collection(this.firestore, `users/${user.uid}/dailyTests`);

    const q = query(dailyTestCollection, orderBy('fecha', 'desc'), limit(1));

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data();
    } else {
      return null;
    }
  }

  async getAllDailyTestResults(): Promise<any[]> {
  const user = this.auth.currentUser;
  if (!user) throw new Error('No authenticated user');

  const dailyTestsCollection = collection(this.firestore, `users/${user.uid}/dailyTests`);
  const snapshot = await getDocs(dailyTestsCollection);
  return snapshot.docs.map(doc => doc.data());

  
  }

  async getUserNickname(): Promise<string | null> {
      const user = this.auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        return data['nickname'] || null;
      }

      return null;
    }

    async setMissionStatus(fecha: string, missionData: { 
      playWithPet?: boolean; 
      dailyTestDone?: boolean; 
      boughtItem?: boolean;
      allMissionsCompleted?: boolean ;
    }) {
      const user = this.auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const missionDocRef = doc(this.firestore, `users/${user.uid}/missions/${fecha}`);
      
      console.log('🔥 Guardando misión en Firestore:', {
        uid: user.uid,
        fecha,
        missionData,
      });

      await setDoc(missionDocRef, missionData, { merge: true });

      console.log('✅ Misión guardada exitosamente.');
    }


    async getMissionStatus(fecha: string): Promise<any> {
      const user = this.auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const missionDocRef = doc(this.firestore, `users/${user.uid}/missions/${fecha}`);
      const missionSnap = await getDoc(missionDocRef);

      const data = missionSnap.exists() ? missionSnap.data() : null;
      console.log('📥 Estado de misión recuperado:', data);

      return data;
    }

    async addCoinsToUser(userId: string, coins: number): Promise<void> {
      const userRef = doc(this.firestore, `users/${userId}`);

      await runTransaction(this.firestore, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const currentCoins = userDoc.exists() && userDoc.data()['coins'] ? userDoc.data()['coins'] : 0;
        const newCoins = currentCoins + coins;

        console.log(`🪙 Monedas actuales de ${userId}: ${currentCoins}`);
        console.log(`➕ Añadiendo: ${coins} monedas`);
        console.log(`💰 Nuevo total: ${newCoins} monedas`);

        transaction.update(userRef, { coins: newCoins });
      });
    }


   

} 





export interface Task {
  id?: string;
  name: string;
  typeM: string
}