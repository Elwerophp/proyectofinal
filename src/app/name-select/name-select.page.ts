import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonItem, IonList, IonLabel, IonButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-name-select',
  templateUrl: './name-select.page.html',
  styleUrls: ['./name-select.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonInput,
    IonItem,
    IonList,
    IonLabel,
    IonButton,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class NameSelectPage implements OnInit {
  petName: string = ''; // Nombre de la mascota

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPetName(); // Cargar el nombre de la mascota al iniciar la página
  }

  async loadPetName() {
    const user = this.auth.currentUser;
    if (!user) return;
    try {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.petName = userData['petName'] || ''; // Cargar el nombre de la mascota
      }
    } catch (error) {
      console.error('Error al cargar el nombre de la mascota:', error);
    }
  }

  async savePetName() {
    const user = this.auth.currentUser;
    if (!user) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se encontró un usuario autenticado.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    try {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, { petName: this.petName }, { merge: true });

      const alert = await this.alertController.create({
        header: 'Nombre guardado',
        message: `El nombre de tu mascota (${this.petName}) se ha guardado correctamente.`,
        buttons: ['OK'],
      });
      await alert.present();

      // Redirigir al dashboard después de guardar el nombre
      this.router.navigate(['/dashboard']);
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al guardar el nombre. Inténtalo de nuevo.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
