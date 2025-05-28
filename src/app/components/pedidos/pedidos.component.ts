import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  pedidos: any[] = [];
  cargando: boolean = true;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerPedidos();
  }

  obtenerPedidos(): void {
    this.authService.obtenerPedidos().subscribe({
      next: (data) => {
        console.log("Respuesta del backend:", data); // ⬅️ Añade esto
        if (data.success) {
          this.pedidos = data.pedidos;
        } else {
          console.error("Error al obtener pedidos:", data.error);
        }
      },
      error: (err) => {
        console.error("Error en la petición:", err);
      }
    });
  }


  volver(): void {
    this.router.navigate(['/admin']);
    console.log("Volver al panel anterior");
  }

  cambiarEstado(pedido: any, nuevoEstado: string): void {
    this.authService.actualizarEstadoPedido(pedido.id_pedido, nuevoEstado).subscribe({
      next: (response) => {
        if (response.success) {
          pedido.estado = nuevoEstado; // Actualiza en la vista sin recargar
        } else {
          console.error("Error al actualizar el estado:", response.error);
        }
      },
      error: (err) => {
        console.error("Error en la petición:", err);
      }
    });
  }

  onEstadoChange(event: Event, pedido: any): void {
    const selectElement = event.target as HTMLSelectElement;
    const nuevoEstado = selectElement.value;
    this.cambiarEstado(pedido, nuevoEstado);
  }

}
