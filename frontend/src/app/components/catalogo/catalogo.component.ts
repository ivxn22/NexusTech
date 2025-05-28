import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string | null;
  id_categoria: number; // ✅ Corregido: debe coincidir con el nombre del backend
}

interface Categoria {
  id_categoria: number;
  categoria_nombre: string;
  categoria_descripcion: string;
  imagen_representativa: string | null;
}

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  productosDestacados: Producto[] = [];
  productos: Producto[] = []; // Todos los productos, para filtrar
  categorias: Categoria[] = [];
  productosFiltrados: Producto[] = [];
  categoriaSeleccionada: Categoria | null = null;
  pestanaActiva: 'inicio' | 'categorias' | 'productos' = 'inicio';
  loading: boolean = true;
  error: string = '';
  indiceCategoriaActual = 0;

  private backendUrl = 'http://nexustech.gal/backend/index.php';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get<any>(this.backendUrl).subscribe({
      next: data => {
        if (data.success) {
          this.productosDestacados = data.productos_destacados;
          this.productos = data.productos || []; // ✅ asegúrate que llegan todos los productos
          this.categorias = data.categorias;
          this.loading = false;
          this.pestanaActiva = 'categorias';
        } else {
          this.error = 'Error al cargar datos.';
          this.loading = false;
        }
      },
      error: err => {
        this.error = 'Error de conexión con el servidor.';
        this.loading = false;
      }
    });
  }

  avanzarCategoria() {
    if (this.indiceCategoriaActual < this.categorias.length - 1) {
      this.indiceCategoriaActual++;
    } else {
      this.indiceCategoriaActual = 0; // carrusel infinito
    }
  }

  retrocederCategoria() {
    if (this.indiceCategoriaActual > 0) {
      this.indiceCategoriaActual--;
    } else {
      this.indiceCategoriaActual = this.categorias.length - 1; // carrusel infinito
    }
  }

  mostrarProductosCategoria(categoria: Categoria) {
    this.categoriaSeleccionada = categoria;
    this.productosFiltrados = this.productos.filter(
      p => p.id_categoria === categoria.id_categoria
    );
    this.pestanaActiva = 'productos';
  }

  volverCategorias() {
    this.pestanaActiva = 'categorias';
    this.categoriaSeleccionada = null;
    this.productosFiltrados = [];
  }

  productoSeleccionado: any = null; // para guardar producto clicado

  // En tu función para mostrar detalle producto:
  mostrarProductoDetalle(id_producto: number) {
    this.router.navigate(['/producto', id_producto]);
  }

}
