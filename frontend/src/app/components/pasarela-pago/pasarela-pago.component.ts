import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago',
  templateUrl: './pasarela-pago.component.html',
  styleUrls: ['./pasarela-pago.component.css']
})
export class PasarelaPagoComponent {
  datosTarjeta = {
    numero: '',
    nombre: '',
    vencimiento: '',
    cvv: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  pagar() {
    const datosEnvio = JSON.parse(localStorage.getItem('datosEnvio') || '{}');
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
    const esLogueado = !!usuarioGuardado?.id_usuario;
    const id_usuario = esLogueado ? usuarioGuardado.id_usuario : 11;

    if (!esLogueado) {
      const carritoLocal = this.authService.obtenerCarritoLocal();
      this.crearPedidoYGenerarFactura(id_usuario, carritoLocal, datosEnvio);
    } else {
      this.authService.obtenerCarrito(id_usuario).subscribe((carritoBackend) => {
        this.crearPedidoYGenerarFactura(id_usuario, carritoBackend, datosEnvio);
      });
    }
  }

  private crearPedidoYGenerarFactura(id_usuario: number, carrito: any[], datosEnvio: any) {
    // Asegurarse de que el carrito esté en el formato correcto
    const carritoFormateado = carrito.map(item => ({
      id_producto: item.id_producto,
      cantidad: item.cantidad,
      precio: item.precio // IMPORTANTE: debe estar definido
    }));

    const total = carritoFormateado.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );

    this.authService.crearPedido({
      id_usuario,
      carrito: carritoFormateado,
      total
    }).subscribe({
      next: (res) => {
        if (res.success) {
          if (id_usuario === 11) {
            this.authService.limpiarCarritoLocal();
          }

          // Generar factura PDF
          const doc = new jsPDF();
          doc.setFontSize(16);
          doc.text('Factura - NexusTech', 20, 20);

          doc.setFontSize(12);
          doc.text(`Cliente: ${datosEnvio.nombre || 'Invitado'}`, 20, 30);
          doc.text(`Dirección: ${datosEnvio.direccion || '-'}`, 20, 38);
          doc.text(`Ciudad: ${datosEnvio.localidad || '-'}`, 20, 46);
          doc.text(`Teléfono: ${datosEnvio.telefono || '-'}`, 20, 54);
          doc.text(`Fecha: ${new Date().toLocaleString()}`, 20, 62);

          let y = 75;
          doc.text('Productos:', 20, y);

          carritoFormateado.forEach(item => {
            y += 10;
            const linea = `Producto #${item.id_producto} - ${item.cantidad} x ${Number(item.precio).toFixed(2)} € = ${(item.cantidad * Number(item.precio)).toFixed(2)} €`;
            doc.text(linea, 20, y);
          });

          y += 15;
          doc.setFontSize(14);
          doc.text(`Total: ${total.toFixed(2)} €`, 20, y);

          doc.save('factura.pdf');
          alert('¡Pago exitoso! Factura descargada.');

          setTimeout(() => {
            this.router.navigate(['/']); 
          }, 1000);
        } else {
          console.error('Respuesta del backend:', res);
          alert('Error al procesar el pedido: ' + (res.error || 'Respuesta inválida del servidor.'));
        }
      },
      error: (err) => {
        console.error('Error de red o conexión:', err);
        alert('No se pudo conectar con el servidor.');
      }
    });
  }

  volverAtras() {
    window.history.back();
  }
}
