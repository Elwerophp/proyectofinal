import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonItem, IonList, IonLabel, IonButton } from '@ionic/angular/standalone';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-name-select',
  templateUrl: './name-select.page.html',
  styleUrls: ['./name-select.page.scss'],
  standalone: true,
  imports: [IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonItem, IonList, IonLabel, IonButton]
})
export class NameSelectPage implements OnInit {
  petName: string = ''; // Nombre de la mascota

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadPetName(); // Cargar el nombre de la mascota al iniciar la página
  }

  async loadPetName() {
    const user = this.auth.currentUser; // Obtener el usuario actual
    if (!user) {
      console.error('No se encontró un usuario autenticado.');
      return;
    }

    try {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.petName = userData['petName'] || ''; // Cargar el nombre de la mascota
        console.log(`Nombre de la mascota cargado: ${this.petName}`);
      } else {
        console.log('No se encontró un documento para este usuario.');
      }
    } catch (error) {
      console.error('Error al cargar el nombre de la mascota:', error);
    }
  }

  async savePetName() {
    const user = this.auth.currentUser; // Obtener el usuario actual
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
    } catch (error) {
      console.error('Error al guardar el nombre de la mascota:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al guardar el nombre. Inténtalo de nuevo.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
