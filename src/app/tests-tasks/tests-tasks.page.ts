
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
    energy: 5,
    motivation: 5,
    dayRating: 5,
    morningMoods: [] as string[],
    afternoonMoods: [] as string[]
  };

  moodOptions: string[] = [
    'Cansado', 'Feliz', 'Ansioso', 'Nervioso', 'Triste', 'Irritable', 'Molesto', 'Enojado',
    'Abrumado', 'Culpable', 'Aburrido', 'Inseguro', 'Pacífico', 'Optimista', 'Motivado', 'Desmotivado'
  ];

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
   
    const puntos =
      Number(this.answers.happyActivity) +
      Number(this.answers.energy) +
      Number(this.answers.motivation) +
      Number(this.answers.dayRating);

    console.log('Valores individuales:', {
      happyActivity: this.answers.happyActivity,
      energy: this.answers.energy,
      motivation: this.answers.motivation,
      dayRating: this.answers.dayRating,
    });

    console.log('Puntos totales:', puntos);

    this.resultado = puntos;
    this.enviado = true;

    
    if (puntos <= 13) {
      this.mensajeEstado = 'sad';
    } else if (puntos <= 23) {
      this.mensajeEstado = 'normal'; 
    } else {
      this.mensajeEstado = 'happy';
    }

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

      console.log('Resultado del test diario guardado');


      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem('lastDailyTestDate', today);
      console.log('Test diario marcado como completado en localStorage.');


      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error al guardar el resultado del test diario:', error);
    }
  }
}
