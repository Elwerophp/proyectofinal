import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonItem, IonList, IonLabel, IonButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
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

  constructor(
    private alertController: AlertController,
    private taskService: TaskService,
    private router: Router // Agregado para redirección
  ) {}

  ngOnInit() {
    this.loadSelectedPet(); // Cargar la mascota seleccionada al iniciar la página
  }

  async loadSelectedPet() {
    try {
      this.selectedPet = await this.taskService.getUserPet();
      console.log(`Mascota cargada: ${this.selectedPet}`);
    } catch (error) {
      console.error('Error al cargar la mascota seleccionada:', error);
    }
  }

  async selectPet(petName: string) {
    try {
      await this.taskService.setUserPet(petName);
      this.selectedPet = petName;

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
   onDasboard() {
    this.router.navigate(['/dashboard']); // Redirige a la página de dashboard
  }

}
