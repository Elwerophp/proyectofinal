import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonItem, IonList, IonLabel, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonItem, IonList, IonLabel, IonButton]
})
export class ForgotPasswordPage implements OnInit {

  email: string = '';

  constructor(private authService: AuthService, private alertController: AlertController, private router: Router) { }

  ngOnInit() {
  }

  async onSubmit() {
    if (!this.validateEmail(this.email)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, ingresa un correo válido.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    try {
      await this.authService.resetPassword(this.email);
      const alert = await this.alertController.create({
        header: 'Correo Enviado',
        message: 'Revisa tu correo para restablecer tu contraseña.',
        buttons: ['OK'],
      });
      await alert.present();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al enviar correo de restablecimiento:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo enviar el correo. Verifica que el email esté registrado.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

}
