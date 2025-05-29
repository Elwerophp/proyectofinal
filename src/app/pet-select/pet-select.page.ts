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
  selectedPet: string | null = null; 
  petName: string = ''; 

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
      const pet = await this.taskService.getUserPet();
      if (pet) {
        
        this.router.navigate(['/dashboard']);
        return;
      }
      this.selectedPet = null; 
    } catch (error) {
      console.error('Error al cargar la mascota seleccionada:', error);
    }
  }

  async selectPet(pet: string) {
    if (!this.petName.trim()) {
      const alert = await this.alertController.create({
        header: 'Nombre requerido',
        message: 'Por favor ingresa un nombre para tu mascota antes de seleccionarla.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    try {
      
      await this.taskService.setUserPet(pet);
      await this.taskService.setPetName(this.petName);
      this.selectedPet = pet;
  
      const alert = await this.alertController.create({
        header: 'Mascota seleccionada',
        message: `Has seleccionado: ${pet}. Se ha guardado con el nombre ${this.petName}.`,
        buttons: ['OK'],
      });
      await alert.present();
  
      
  
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
  


  onDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
