import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent {
  email: string = '';
  pass: string = '';
  isLoading: boolean = false;
  mensajeError: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  // Método para iniciar sesión
  iniciarSesion() {
    this.isLoading = true;
    this.authService.login(this.email, this.pass)
      .subscribe(
        (response: any) => {
          if (response.success) {
            const usuario = response.user;
            console.log('Usuario:', usuario);
            localStorage.setItem('usuario', JSON.stringify(usuario));
            this.mensajeError = '';  // Reiniciar mensaje de error en caso de éxito

            // Actualizamos el estado en AuthService
            this.authService.setLoginState(true, usuario.rol === 'admin');

            // Redirigimos según el rol del usuario
            if (usuario.rol === 'admin') {
              this.router.navigate(['/admin']); // Redirigir a admin en lugar de home
            } else {
              this.router.navigate(['/home']);
            }
          } else {
            this.mensajeError = response.error; // Mostrar error si la autenticación falla
          }
        },
        (error: any) => {
          this.mensajeError = 'Hubo un problema con la conexión. Intenta de nuevo.';
          console.error('Error de autenticación:', error);
        }
      )
      .add(() => {
        this.isLoading = false; // Ocultar el indicador de carga
      });
  }

  // Método para redirigir a la página de registro
  irARegistro() {
    this.router.navigate(['/registro']);
  }
}
