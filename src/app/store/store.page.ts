import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class StorePage implements OnInit {
  coins: number = 0;

  constructor(private router: Router, private firestore: Firestore, private auth: Auth) { }

  async ngOnInit() {
    await this.loadCoins();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  async loadCoins() {
    const user = this.auth.currentUser;
    if (!user) return;
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      this.coins = data['coins'] || 0;
    }
  }
}
