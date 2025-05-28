import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  password: string = '';
  direccion: string = '';
  localidad: string = '';
  telefono: string = '';
  mensajeError: string = '';
  mensajeExito: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  registrarUsuario() {
    if (!this.nombre || !this.apellidos || !this.email || !this.password || !this.direccion || !this.localidad || !this.telefono) {
      this.mensajeError = "Todos los campos son obligatorios.";
      return;
    }

    this.isLoading = true;
    const usuario = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      email: this.email,
      password: this.password,
      direccion: this.direccion,
      localidad: this.localidad,
      telefono: this.telefono
    };

    this.authService.registrar(usuario)
      .subscribe(
        (response: any) => {
          console.log("Respuesta del servidor:", response);
          if (response.success) {
            this.mensajeExito = "Usuario registrado exitosamente.";
          } else {
            this.mensajeError = response.error || "Hubo un problema al registrar el usuario.";
          }
        },
        (error: any) => {
          console.error("Error de conexión:", error);
          this.mensajeError = "Error en la conexión. Intenta nuevamente.";
        }
      )
      .add(() => {
        this.isLoading = false;
      });
  }

  irAIniciarSesion() {
    this.router.navigate(['/IniciarSesion']);
  }
}
