import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonButton, IonInput } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Task } from '../task.service';
import { TaskService } from '../task.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonButton,
    IonInput,
    FormsModule, CommonModule]
})
export class SignupPage implements OnInit {
  email: string = ''; // Declare the email property
  password: string = ''; // Declare the password property
  nickname: string = ''; // Declare the nickname property

  constructor(private router: Router, private alertController: AlertController, private authService: AuthService) { }

  ngOnInit() {
  }
  
  async onSubmit() {
    // Validación básica email y nickname
    if (!this.validateEmail(this.email)) {
      const alert = await this.alertController.create({
        header: 'Invalid Email',
        message: 'Please enter a valid email address.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    if (!this.nickname.trim()) {
      const alert = await this.alertController.create({
        header: 'Nickname Required',
        message: 'Please enter a nickname.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    try {
      // Ahora pasamos el nickname a register
      await this.authService.register(this.email, this.password, this.nickname);
  
      const alert = await this.alertController.create({
        header: 'Signup Success',
        message: 'You have signed up successfully!',
        buttons: ['OK'],
      });
      await alert.present();
  
      // Redirige a la selección de mascota después del registro exitoso
      this.router.navigate(['/pet-select']);
    } catch (error: any) {
      console.error('Firebase Error:', error);
      let message = 'An error ocurred during signup.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please use another email or log in.';
      }
      const alert = await this.alertController.create({
        header: 'Error',
        message,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email.trim());
  }
  onPetSelect() {
    this.router.navigate(['/pet-select']); 
  }

}
