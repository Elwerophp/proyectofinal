import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  //Registro de usuario
  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
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
}