import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-new-prod',
  templateUrl: './new-prod.component.html',
  styleUrls: ['./new-prod.component.css']
})
export class NewProdComponent implements OnInit {
  formularioProducto: FormGroup;
  imagenes: File[] = [];
  categorias: any[] = [];
  isAdmin: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.formularioProducto = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      id_categoria: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Combinamos las suscripciones para manejar el estado de login y rol admin
    this.authService.loggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.authService.isAdmin$.subscribe(isAdmin => {
          this.isAdmin = isAdmin;
        });
      }
    });

    // Obtener categorías para el formulario
    this.authService.obtenerCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files) {
      this.imagenes = Array.from(event.target.files);
    }
  }

  agregarProducto(): void {
    // Verificar que el usuario tenga permisos de administrador
    if (!this.isAdmin) {
      alert('Acceso denegado. Se requiere rol de administrador.');
      return;
    }

    // Validación del formulario
    if (this.formularioProducto.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    // Crear FormData para enviar los datos del formulario y las imágenes
    const formData = new FormData();
    Object.entries(this.formularioProducto.value).forEach(([key, value]) => {
      // Asegurarse de que value es un string primitivo antes de usarlo
      formData.append(key, String(value)); // Convertir value a string primitivo
    });

    // Añadir imágenes al FormData
    this.imagenes.forEach(imagen => {
      formData.append('imagenes[]', imagen);
    });

    // Llamar al servicio para añadir el producto
    this.authService.añadirProducto(formData).subscribe(
      respuesta => {
        if (respuesta.success) {
          alert('Producto añadido correctamente');
          this.formularioProducto.reset();
          this.imagenes = [];
        } else {
          // Manejo del error si la respuesta tiene un error
          alert('Error al añadir el producto: ' + (respuesta.error || 'Desconocido'));
        }
      },
      error => {
        console.error(error);
        alert('Error en el servidor: ' + (error?.message || 'Desconocido'));
      }
    );
  }

  // Getters para acceder a los controles del formulario
  get nombre() { return this.formularioProducto.get('nombre'); }
  get descripcion() { return this.formularioProducto.get('descripcion'); }
  get precio() { return this.formularioProducto.get('precio'); }
  get stock() { return this.formularioProducto.get('stock'); }
  get id_categoria() { return this.formularioProducto.get('id_categoria'); }

  volverAdministracion(): void {
    this.router.navigate(['/admin']);  // Redirige a la vista de administración
  }
}
