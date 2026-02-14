import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Admin } from './pages/admin/admin';
import { Customer } from './pages/customer/customer';
import { Profile } from './pages/profile/profile';
import { adminGuard, authGuard, noAuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
    data: { title: 'Home' },
  },
  {
    path: 'dashboard',
    component: Dashboard,
    data: { title: 'Dashboard' },
  },
  {
    path: 'login',
    component: Login,
    canActivate: [noAuthGuard],
    data: { title: 'Login' },
  },
  {
    path: 'register',
    component: Register,
    canActivate: [noAuthGuard],
    data: { title: 'Register' },
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [adminGuard],
    data: { title: 'Admin Dashboard' },
  },
  {
    path: 'customer',
    component: Customer,
    canActivate: [authGuard],
    data: { title: 'Customers' },
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
    data: { title: 'My Profile' },
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
