import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  gmail: string = '';
  estrellas: number | null = null;
  opinion: string = '';

  nombre: string = '';
  email: string = '';
  mensaje: string = '';
  mensajeEnviado = false;

  constructor(private authService: AuthService, private http: HttpClient) {}

  valoracionExitosa = false;

  enviarValoracion() {
    if (!this.gmail || !this.estrellas || !this.opinion) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const valoracion = {
      gmail: this.gmail,
      estrellas: this.estrellas,
      opinion: this.opinion
    };

    this.authService.insertarValoracion(valoracion).subscribe({
      next: (res) => {
        if (res.success) {
          this.valoracionExitosa = true;
          this.gmail = '';
          this.estrellas = null;
          this.opinion = '';
        } else {
          alert('Error: ' + res.error);
        }
      },
      error: (err) => {
        alert('Error en la comunicación con el servidor.');
      }
    });
  }

  enviarMensaje() {
    if (!this.nombre || !this.email || !this.mensaje) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const datos = {
      nombre: this.nombre,
      email: this.email,
      mensaje: this.mensaje
    };

    this.authService.enviarContacto(datos).subscribe({
      next: (res: any) => {
        console.log('Respuesta del servidor:', res); // útil para depuración

        if (res && res.success === true) {
          this.mensajeEnviado = true;
          alert('Mensaje enviado correctamente.');
          this.nombre = '';
          this.email = '';
          this.mensaje = '';
        } else {
          alert('Error del servidor: ' + (res?.message || 'Respuesta inválida.'));
        }
      },
      error: (err) => {
        console.error('Error del servidor:', err);
        alert('Error al enviar el mensaje.');
      }
    });
  }
}
