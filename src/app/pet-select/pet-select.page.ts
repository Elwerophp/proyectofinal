import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
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
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { TaskService } from '../task.service';

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
  petName: string = ''; // Aquí agregamos la propiedad para el nombre de la mascota

  constructor(
    private alertController: AlertController,
    private taskService: TaskService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadSelectedPet();
  }

  async loadSelectedPet() {
    try {
      this.selectedPet = await this.taskService.getUserPet();
      console.log(`Mascota cargada: ${this.selectedPet}`);
    } catch (error) {
      console.error('Error al cargar la mascota seleccionada:', error);
    }
  }

<<<<<<< HEAD
  async selectPet(pet: string) {
    if (!this.petName.trim()) {
      const alert = await this.alertController.create({
        header: 'Nombre requerido',
        message: 'Por favor ingresa un nombre para tu mascota antes de seleccionarla.',
        buttons: ['OK'],
      });
      await alert.present();
      return; // Salimos de la función sin guardar ni redirigir
    }

    try {
      await this.taskService.setUserPet(pet); // Guardar tipo de mascota
      this.selectedPet = pet;

      const alert = await this.alertController.create({
        header: 'Mascota seleccionada',
        message: `Has seleccionado: ${pet}. Se ha guardado en tu cuenta con el nombre ${this.petName}.`,
        buttons: ['OK'],
      });
      await alert.present();

=======
  async selectPet(pettype: string) {
    try {
      await this.taskService.setUserPet(pettype);
      this.selectedPet = pettype;

      const alert = await this.alertController.create({
        header: 'Mascota seleccionada',
        message: `Has seleccionado: ${pettype}. Se ha guardado en tu cuenta.`,
        buttons: ['OK'],
      });
      await alert.present();
      // Redirigir a la página name-select
>>>>>>> 9f0133b484ecf8083258a3c7e42379632996d519
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
<<<<<<< HEAD


  onDasboard() {
    this.router.navigate(['/dashboard']);
  }
=======
>>>>>>> 9f0133b484ecf8083258a3c7e42379632996d519
}
