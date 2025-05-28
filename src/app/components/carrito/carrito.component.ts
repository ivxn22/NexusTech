import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];
  mostrarModalInvitado = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuario');

    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      const idUsuario = usuario.id_usuario || usuario.id;

      this.authService.obtenerCarrito(idUsuario).subscribe(carrito => {
        this.carrito = carrito;
      });
    } else {
      // Usuario no logueado → usar carrito local
      this.authService.carrito$.subscribe(carrito => {
        this.carrito = carrito;
      });
    }
  }

  cargarCarritoLocal() {
    this.authService.carrito$.subscribe(carrito => {
      this.carrito = carrito;
    });
  }

  cambiarCantidad(producto: any, cantidad: number) {
    if (cantidad < 1) return;

    const index = this.carrito.findIndex(p => p.id_producto === producto.id_producto);
    if (index !== -1) {
      this.carrito[index].cantidad = cantidad;

      const usuarioStr = localStorage.getItem('usuario');
      if (usuarioStr) {
        const usuario = JSON.parse(usuarioStr);
        const idUsuario = usuario.id_usuario || usuario.id;
        this.authService.actualizarCarrito(idUsuario, producto.id_producto, cantidad).subscribe();
      } else {
        this.authService.guardarCarritoLocal(this.carrito);
      }
    }
  }

  eliminarProducto(producto: any) {
    const nuevoCarrito = this.carrito.filter(p => p.id_producto !== producto.id_producto);

    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      const idUsuario = usuario.id_usuario || usuario.id;

      this.authService.actualizarCarrito(idUsuario, producto.id_producto, 0).subscribe(() => {
        this.carrito = nuevoCarrito;
      });
    } else {
      this.authService.guardarCarritoLocal(nuevoCarrito);
      this.carrito = nuevoCarrito;
    }
  }

  getTotal(): number {
    return this.carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  getValueAsNumber(event: Event): number {
    const input = event.target as HTMLInputElement | null;
    return input ? input.valueAsNumber : 0;
  }

  finalizarCompra() {
    const usuarioStr = localStorage.getItem('usuario');
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
    const idUsuario = usuario?.id_usuario || usuario?.id;

    if (!idUsuario) {
      this.mostrarModalInvitado = true;
      return;
    }

    // Usuario logueado: continuar al paso de envío
    this.router.navigate(['/datos-envio']);
  }

  continuarComoInvitado() {
    this.mostrarModalInvitado = false;
    this.router.navigate(['/datos-envio'], { state: { invitado: true } });
  }

  iniciarSesion() {
    this.mostrarModalInvitado = false;
    this.router.navigate(['/IniciarSesion']);
  }
}
