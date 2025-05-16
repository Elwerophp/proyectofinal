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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonButton,
    IonInput,
    FormsModule, CommonModule
  ],
})
export class HomePage implements OnInit{

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onSignUp() {
    this.router.navigate(['/signup']);
  }

  /*

  Esto esta comentado porque no se usa, pero lo dejo por si acaso, y lo ocuparemos en el futuro capaz :D

  tasks$!: Observable<Task[]>;
  newTaskName: string = '';
  newAuthorName: string = '';
  newLinkName: string = '';


  //almacenes temporales para las variables que se van a editarr
  editingTaskId: string | null = null;
  editedTaskName: string = '';
  editedAuthorName: string = '';
  editedLinkName: string = '';

  constructor(private taskService: TaskService, private router: Router, private authService: AuthService, private alertController: AlertController) { }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks$ = this.taskService.getTasks();
  }

  addTask() {
    const name = this.newTaskName.trim();
    const author = this.newAuthorName.trim();
    const link = this.newLinkName.trim();

    if (!name) {
      alert('El nombre de cancion es obligatorio');
      return;
    }

    if (!author) {
      alert('El nombre del autor es obligatorio');
      return;
    }

    if (!link) {
      alert('El enlace de la canción es obligatorio');
      return;
    }

    const newTask: Task = { name, author, link };

    this.taskService.addTask(newTask)
      .then(() => {
        console.log('Cancion agregada');
        this.newTaskName = '';
        this.newAuthorName = '';
      })
      .catch((err: unknown) => console.error('Error al agregar cancion:', err));
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id)
      .then(() => console.log('Cancion eliminada'))
      .catch((err: unknown) => console.error('Error al eliminar la cancion:', err));
  }

  //edicion de tareas inicia ;D

  startEdit(task: Task) {
    this.editingTaskId = task.id!;
    this.editedTaskName = task.name;
    this.editedAuthorName = task.author;
    this.editedLinkName = task.link; // Agregar el campo 'link'
  }

  //guardar los cambios de la edicion

  saveEdit(taskId: string) {
    const name = this.editedTaskName.trim();
    const author = this.editedAuthorName.trim();
    const link = this.editedLinkName.trim();

    if (!name || !author || !link) {
      alert('Todos los campos son obligatorios');
      return;
    }

    this.taskService.updateTask(taskId, { name, author, link })
      .then(() => {
        console.log('Canción actualizada');
        this.editingTaskId = null;
        this.editedTaskName = '';
        this.editedAuthorName = '';
        this.editedLinkName = ''; // Limpiar el campo 'link'
      })
      .catch((err: unknown) => console.error('Error al actualizar canción:', err));
  }

  async onLogout() {
    try {
      await this.authService.logout(); 
      this.router.navigate(['/login']); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo cerrar sesión. Inténtalo de nuevo.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }*/
}