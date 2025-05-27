import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksCollection = collection(this.firestore, 'tasks');

  constructor(private firestore: Firestore, private auth: Auth) { }

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

  async setUserPet(petName: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userDocRef, { selectedPet: petName }, { merge: true });
  }

  async getUserPet(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data['selectedPet'] || null;
    }
    return null;
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
}

export interface Task {
  id?: string;
  name: string;
  typeM: string
}