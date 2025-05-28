import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = localStorage.getItem('usuario');
    if (user) {
      return true; // Usuario autenticado
    }
    this.router.navigate(['/Iniciar-Sesion']); // Redirigir a login si no está autenticado
    return false;
  }
}
