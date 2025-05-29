import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private auth: Auth, private firestore: Firestore) {}

  async register(email: string, password: string, nickname: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = userCredential.user?.uid;
    if (uid) {
      // Guardar nickname en Firestore, en colección 'users' con doc id = uid
      await setDoc(doc(this.firestore, 'users', uid), {
        email: email,
        nickname: nickname,
        createdAt: new Date()
      });
    }
    return userCredential;
  }

  //Inicio de sesión
  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  //Restablecer contraseña
  async resetPassword(email: string) {
    return await sendPasswordResetEmail(this.auth, email);
  }

  //Cierre de sesion
  async logout() {
    return await signOut(this.auth);
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }
}
