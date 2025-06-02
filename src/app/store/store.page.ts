import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';

interface StoreItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class StorePage implements OnInit {
  coins: number = 0;
  ownedItems: string[] = [];
  equippedItem: string = '';
  items: StoreItem[] = [
    { id: 'crown', name: 'Crown', price: 50, image: 'assets/Shop/crown.png' },
    { id: 'strawberryhat', name: 'Strawberry Hat', price: 35, image: 'assets/Shop/strawberryhat.png' },
    { id: 'sunglasses', name: 'Sunglasses', price: 40, image: 'assets/Shop/sunglasses.png' },
    { id: 'tophat', name: 'Top Hat', price: 45, image: 'assets/Shop/tophat.png' }
  ];

  constructor(
    private router: Router,
    private firestore: Firestore,
    private auth: Auth,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    const user = this.auth.currentUser;
    if (!user) return;
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      this.coins = data['coins'] || 0;
      this.ownedItems = data['items'] || [];
      this.equippedItem = data['equippedItem'] || '';
    }
  }

  async buyItem(item: StoreItem) {
    const user = this.auth.currentUser;
    if (!user) return;

    if (this.ownedItems.includes(item.id)) {
      const alert = await this.alertController.create({
        header: 'Ya comprado',
        message: 'Ya tienes este ítem.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (this.coins < item.price) {
      const alert = await this.alertController.create({
        header: 'Monedas insuficientes',
        message: 'No tienes suficientes monedas para comprar este ítem.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Actualiza monedas e ítems en Firestore
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await updateDoc(userDocRef, {
      coins: this.coins - item.price,
      items: arrayUnion(item.id)
    });

    this.coins -= item.price;
    this.ownedItems.push(item.id);

    const alert = await this.alertController.create({
      header: '¡Compra exitosa!',
      message: `Has comprado ${item.name}.`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async equipItem(item: StoreItem) {
    const user = this.auth.currentUser;
    if (!user) return;
    if (!this.ownedItems.includes(item.id)) return;

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await updateDoc(userDocRef, {
      equippedItem: item.id
    });

    this.equippedItem = item.id;

    const alert = await this.alertController.create({
      header: '¡Equipado!',
      message: `Has equipado ${item.name}.`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
