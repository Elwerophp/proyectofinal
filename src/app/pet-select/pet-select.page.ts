import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonItem, IonList, IonLabel, IonButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-pet-select',
  templateUrl: './pet-select.page.html',
  styleUrls: ['./pet-select.page.scss'],
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
export class PetSelectPage implements OnInit {
  selectedPet: string | null = null; // Para almacenar la mascota seleccionada

  constructor(
    private alertController: AlertController,
    private firestore: Firestore,
    private auth: Auth,
    private router: Router // Agregado para redirección
  ) {}

  ngOnInit() {
    this.loadSelectedPet(); // Cargar la mascota seleccionada al iniciar la página
  }

  async loadSelectedPet() {
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
        this.selectedPet = userData['selectedPet'] || null; // Cargar la mascota seleccionada
        console.log(`Mascota cargada: ${this.selectedPet}`);
      } else {
        console.log('No se encontró un documento para este usuario.');
      }
    } catch (error) {
      console.error('Error al cargar la mascota seleccionada:', error);
    }
  }

  async selectPet(petName: string) {
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
      // Guardar la mascota seleccionada en Firestore
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, { selectedPet: petName }, { merge: true });

      this.selectedPet = petName; // Actualizar la mascota seleccionada localmente

      const alert = await this.alertController.create({
        header: 'Mascota seleccionada',
        message: `Has seleccionado: ${petName}. Se ha guardado en tu cuenta.`,
        buttons: ['OK'],
      });
      await alert.present();

      // Redirigir a la página name-select
      this.router.navigate(['/name-select']);
    } catch (error) {
      console.error('Error al guardar la mascota:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al guardar la mascota. Inténtalo de nuevo.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
