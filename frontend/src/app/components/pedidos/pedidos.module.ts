import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de importarlo
import { PedidosComponent } from './pedidos.component';

@NgModule({
  declarations: [PedidosComponent],
  imports: [
    CommonModule,  // Aquí se debe importar CommonModule
  ]
})
export class PedidosModule { }
