import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  producto: any = null;
  error: string = '';
  loading: boolean = true;
  imagenPrincipal: string = '';
  cantidadSeleccionada: number = 1;
  mostrarDescripcionCompleta: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loading = true;
        this.authService.obtenerProductoPorId(id).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.producto = res.producto;
              this.imagenPrincipal = this.producto.imagenes?.[0] || '';
              this.loading = false;
            } else {
              this.error = 'Error al cargar el producto.';
              this.loading = false;
            }
          },
          error: () => {
            this.error = 'Error al conectar con el servidor.';
            this.loading = false;
          }
        });
      } else {
        this.error = 'ID de producto inválido.';
        this.loading = false;
      }
    });
  }

  volver() {
    window.history.back();
  }

  cambiarImagenPrincipal(img: string) {
    this.imagenPrincipal = img;
  }

  agregarAlCarrito(producto: any, cantidad: number = 1): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    if (usuario && (usuario.id_usuario || usuario.id)) {
      const idUsuario = usuario.id_usuario || usuario.id;

      this.authService.añadirAlCarrito(producto.id_producto, cantidad).subscribe(
        res => {
          console.log('Añadido al carrito del backend', res);
          alert('Producto añadido al carrito correctamente');
        },
        error => {
          console.error('Error al añadir al carrito del backend', error);
        }
      );
    } else {
      this.authService.agregarAlCarritoLocal(producto, cantidad);
      alert('Producto añadido al carrito correctamente');
    }
  }

  comprarAhora(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const cantidad = this.cantidadSeleccionada;

    if (usuario && (usuario.id_usuario || usuario.id)) {
      this.authService.añadirAlCarrito(this.producto.id_producto, cantidad).subscribe({
        next: () => {
          this.router.navigate(['/carrito']);
        },
        error: err => {
          console.error('Error al añadir al carrito', err);
        }
      });
    } else {
      this.authService.agregarAlCarritoLocal(this.producto, cantidad);
      this.router.navigate(['/carrito']);
    }
  }
}
