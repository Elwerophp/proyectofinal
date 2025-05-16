import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonItem, IonList, IonLabel, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Task } from '../task.service';
import { TaskService } from '../task.service';
import { Observable, of } from 'rxjs';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonItem, IonList, IonLabel, IonButton]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private alertController: AlertController, private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  async onSubmit() {
    if (!this.validateEmail(this.email) || !this.password) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, ingresa un correo y una contraseña válidos.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      const alert = await this.alertController.create({
        header: 'Inicio de Sesión Exitoso',
        message: '¡Bienvenido!',
        buttons: ['OK'],
      });
      await alert.present();
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error en login:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Correo o contraseña incorrectos. Verifica tus credenciales.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }


  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-0.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  onSignup() {
    this.router.navigate(['/signup']);
  }

  onReset() {
    this.router.navigate(['/forgot-password']);
  }
}