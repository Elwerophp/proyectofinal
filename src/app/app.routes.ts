import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
    ,canActivate: [authGuard]
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup.page').then(m => m.SignupPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
  },
  {
    path: 'pet-select',
    loadComponent: () => import('./pet-select/pet-select.page').then(m => m.PetSelectPage)
    ,canActivate: [authGuard]
  },
  {
    path: 'user-profile',
    loadComponent: () => import('./user-profile/user-profile.page').then(m => m.UserProfilePage)
    ,canActivate: [authGuard]
  },
  {
    path: 'store',
    loadComponent: () => import('./store/store.page').then(m => m.StorePage)
    ,canActivate: [authGuard]
  },
  {
    path: 'tests-tasks',
    loadComponent: () => import('./tests-tasks/tests-tasks.page').then(m => m.TestsTasksPage)
    ,canActivate: [authGuard]
  },
  {
    path: 'name-select',
    loadComponent: () => import('./name-select/name-select.page').then( m => m.NameSelectPage)
  },


];