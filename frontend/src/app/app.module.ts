import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ✅ Añadido ReactiveFormsModule

// Componentes
import { IndexComponent } from './components/index/index.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { AdminComponent } from './components/admin/admin.component';
import { NewProdComponent } from './components/new-prod/new-prod.component';
import { GestionUsuarioComponent } from './components/gestion-usuario/gestion-usuario.component';
import { ProductoComponent } from './components/producto/producto.component';
import { SbnosotrosComponent } from './components/sbnosotros/sbnosotros.component';
import { RegistroComponent } from './components/registro/registro.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { PasarelaPagoComponent } from './components/pasarela-pago/pasarela-pago.component';
import { DatosEnvioComponent } from './components/datos-envio/datos-envio.component';
import { ClickOutsideDirective } from './directives/directives/click-outside.directive';
import { PedidosComponent } from './components/pedidos/pedidos.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ContactoComponent,
    HeaderComponent,
    FooterComponent,
    CatalogoComponent,
    IniciarSesionComponent,
    AdminComponent,
    NewProdComponent,
    GestionUsuarioComponent,
    ProductoComponent,
    SbnosotrosComponent,
    RegistroComponent,
    CarritoComponent,
    DatosEnvioComponent,
    PasarelaPagoComponent,
    ClickOutsideDirective,
    PedidosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
