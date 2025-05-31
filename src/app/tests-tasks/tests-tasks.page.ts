
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonButton, IonInput } from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TaskService } from '../task.service';


@Component({
  selector: 'app-tests-tasks',
  templateUrl: './tests-tasks.page.html',
  styleUrls: ['./tests-tasks.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonButton,
    IonInput,
    FormsModule,
    CommonModule
  ]
})
export class TestsTasksPage implements OnInit {
  answers = {
    happyActivity: '1',
    energy: 0,
    motivation: 0,
    dayRating: 0,
    morningMoods: [] as string[],
    afternoonMoods: [] as string[]
  };

  moodOptions: string[] = [
    'Cansado', 'Feliz', 'Ansioso', 'Nervioso', 'Triste', 'Irritable', 'Molesto', 'Enojado',
    'Abrumado', 'Culpable', 'Aburrido', 'Inseguro', 'Pacífico', 'Optimista', 'Motivado', 'Desmotivado'
  ];

  validationErrors: string[] = [];


  resultado = 0;
  mensajeEstado = '';
  enviado = false;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {}


  toggleMood(period: 'morning' | 'afternoon', event: Event) {
    const input = event.target as HTMLInputElement;
    const mood = input.value;
    const list = period === 'morning' ? this.answers.morningMoods : this.answers.afternoonMoods;

    const index = list.indexOf(mood);
    if (input.checked) {
      if (index === -1 && list.length < 5) list.push(mood);
      else if (index === -1 && list.length >= 5) input.checked = false; 
    } else {
      if (index !== -1) list.splice(index, 1); 
    }
  }

  
  async submitTest() {
  this.validationErrors = [];

  if (!this.answers.happyActivity) {
    this.validationErrors.push('La pregunta 1 es obligatoria.');
  }

  if (this.answers.energy < 1 || this.answers.energy > 6) {
    this.validationErrors.push('La energía (pregunta 2) debe ser entre 1 y 5.');
  }

  if (this.answers.morningMoods.length === 0) {
    this.validationErrors.push('Selecciona al menos un estado de ánimo en la mañana (pregunta 3).');
  }

  if (this.answers.afternoonMoods.length === 0) {
    this.validationErrors.push('Selecciona al menos un estado de ánimo en la tarde (pregunta 4).');
  }

  if (this.answers.motivation < 1 || this.answers.motivation > 6) {
    this.validationErrors.push('La motivación (pregunta 5) debe ser entre 1 y 5.');
  }

  if (this.answers.dayRating < 1 || this.answers.dayRating > 6) {
    this.validationErrors.push('La calificación del día (pregunta 6) debe ser entre 1 y 5.');
  }

  if (this.validationErrors.length > 0) return;

  const puntos = Number(this.answers.happyActivity) +
                 Number(this.answers.energy) +
                 Number(this.answers.motivation) +
                 Number(this.answers.dayRating);


  console.log('=== DEPURACIÓN DAILY TEST ===');
  console.log('Puntos individuales:');
  console.log('Actividad feliz:', this.answers.happyActivity);
  console.log('Energía:', this.answers.energy);
  console.log('Motivación:', this.answers.motivation);
  console.log('Calificación del día:', this.answers.dayRating);
  console.log('Total de puntos:', puntos);

  // Estado del gato ajustado a nuevos valores de puntaje
  this.resultado = puntos;
  this.enviado = true;

  if (puntos <= 9) {
    this.mensajeEstado = 'sad';
  } else if (puntos <= 14) {
    this.mensajeEstado = 'weird';
  } else {
    this.mensajeEstado = 'happy';
  }

  console.log('Estado emocional del gato asignado:', this.mensajeEstado);

  try {
    await this.taskService.setDailyTestResult({
      puntos,
      estado: this.mensajeEstado,
      fecha: new Date().toISOString(),
      moods: {
        morning: this.answers.morningMoods,
        afternoon: this.answers.afternoonMoods
      }
    });

     console.log('Resultado guardado exitosamente en Firestore.');

    this.router.navigate(['/dashboard']);
  } catch (error) {
    console.error('Error al guardar el resultado del test diario:', error);
  }
}


}
