import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-datos-envio',
  templateUrl: './datos-envio.component.html',
  styleUrls: ['./datos-envio.component.css']
})
export class DatosEnvioComponent implements OnInit {
  datosEnvio = {
    nombre: '',
    apellidos: '',
    email: '',
    direccion: '',
    localidad: '',
    telefono: ''
  };

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    const usuario = this.obtenerUsuarioLogueado();
    if (usuario) {
      this.datosEnvio.nombre = usuario.nombre || '';
      this.datosEnvio.apellidos = usuario.apellidos || '';
      this.datosEnvio.email = usuario.email || '';
      this.datosEnvio.direccion = usuario.direccion || '';
      this.datosEnvio.localidad = usuario.localidad || '';
      this.datosEnvio.telefono = usuario.telefono || '';
    }
  }

  obtenerUsuarioLogueado() {
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      return JSON.parse(usuarioJSON);
    }
    return null;
  }

  continuar(formulario: NgForm) {
    if (formulario.valid) {
      localStorage.setItem('datosEnvio', JSON.stringify(this.datosEnvio));
      this.router.navigate(['/pasarela-pago']);
    } else {
      alert('Por favor, rellena todos los campos obligatorios correctamente.');
    }
  }


  volverAtras() {
    window.history.back();
  }
}
