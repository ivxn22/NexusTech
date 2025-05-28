import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { AdminComponent } from './components/admin/admin.component';
import { GestionUsuarioComponent } from './components/gestion-usuario/gestion-usuario.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { NewProdComponent } from './components/new-prod/new-prod.component';
import { ProductoComponent } from './components/producto/producto.component';
import { RegistroComponent } from './components/registro/registro.component';
import { SbnosotrosComponent } from './components/sbnosotros/sbnosotros.component';
import { AuthGuard } from './guards/auth.guard';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { DatosEnvioComponent } from './components/datos-envio/datos-envio.component';
import { PasarelaPagoComponent } from './components/pasarela-pago/pasarela-pago.component';

const routes: Routes = [
  { path: '', component: IndexComponent, title: 'Inicio' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto' },
  { path: 'catalogo', component: CatalogoComponent, title: 'Catalogo' },
  { path: 'IniciarSesion', component: IniciarSesionComponent, title: 'Iniciar Sesión' },
  { path: 'registro', component: RegistroComponent, title: 'Registro' },
  { path: 'sbnosotros', component: SbnosotrosComponent, title: 'Sobre nosotros' },
  { path: 'newProduct', component: NewProdComponent, title: 'Nuevo Producto' },
  { path: 'producto/:id', component: ProductoComponent, title: 'Producto' },
  { path: 'carrito', component: CarritoComponent, title: 'Carrito' },
  { path: 'datos-envio', component: DatosEnvioComponent, title: 'Datos de envio' },
  { path: 'pasarela-pago', component: PasarelaPagoComponent, title: 'Pasarela de Pago' },
  
  // Rutas protegidas por AuthGuard
  { path: 'admin', component: AdminComponent, title: 'Administrador', canActivate: [AuthGuard] },
  { path: 'Gestion-de-usuarios', component: GestionUsuarioComponent, title: 'Gestión de usuarios', canActivate: [AuthGuard] },
  { path: 'newProduct', component: NewProdComponent, title: 'Nuevo Producto', canActivate: [AuthGuard] },
  { path: 'Pedidos', component: PedidosComponent, title: 'Pedidos', canActivate: [AuthGuard] },


  // Redirección por defecto
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
