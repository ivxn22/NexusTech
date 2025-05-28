import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-gestion-usuario',
  templateUrl: './gestion-usuario.component.html',
  styleUrls: ['./gestion-usuario.component.css']
})
export class GestionUsuarioComponent implements OnInit {
  usuarios: any[] = [];
  usuario: any = {}; // Para almacenar el usuario que se está editando
  modalVisible: boolean = false; // Para controlar la visibilidad del modal

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuario.rol !== 'admin') {
      // Redirigir o mostrar mensaje si no es admin
      alert('Acceso denegado');
      return;
    }

    this.authService.getTodosLosUsuarios().subscribe({
      next: (res) => {
        if (res.success) {
          this.usuarios = res.usuarios;
        } else {
          console.error('Error al obtener usuarios');
        }
      },
      error: (err) => console.error(err)
    });
  }

  // Función para abrir el modal y cargar los datos del usuario
  abrirModal(usuario: any): void {
    this.usuario = { ...usuario }; // Hacer una copia de los datos del usuario
    this.modalVisible = true; // Mostrar el modal
  }

  // Cerrar el modal
  closeModal(): void {
    this.modalVisible = false; // Ocultar el modal
  }

  // Función para guardar los cambios en el backend
  guardarCambios(): void {
    this.authService.actualizarUsuario(this.usuario).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Usuario actualizado correctamente');
          this.closeModal(); // Cerrar el modal después de guardar
          // Actualizar la lista de usuarios en la vista
          const index = this.usuarios.findIndex(u => u.id_usuario === this.usuario.id_usuario);
          if (index !== -1) {
            this.usuarios[index] = { ...this.usuario }; // Actualizar el usuario en la lista
          }
        } else {
          alert('Error al guardar los cambios');
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error en la conexión con el servidor');
      }
    });
  }

  volverAdministracion(): void {
    this.router.navigate(['/admin']);  // Redirige a la vista de administración
  }
}
