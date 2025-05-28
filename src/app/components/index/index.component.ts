import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string | null;
}

interface Categoria {
  id_categoria: number;
  categoria_nombre: string;
  categoria_descripcion: string;
  imagen_representativa: string | null;
}

interface Valoracion {
  gmail: string;
  estrellas: number;
  opinion: string;
  fecha: string;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  productosDestacados: Producto[] = [];
  categorias: Categoria[] = [];
  valoraciones: Valoracion[] = [];
  gruposValoraciones: Valoracion[][] = [];
  indiceActual: number = 0;
  loading: boolean = true;
  error: string = '';
  animando: boolean = false;
  numeroSlides: number = 0;

  private backendUrl = 'http://nexustech.gal/backend/index.php';
  private valoracionesUrl = 'http://nexustech.gal/backend/obtener-valoraciones.php';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.cargarProductosYCategorias();
    this.cargarValoraciones();
  }

  cargarProductosYCategorias(): void {
    this.http.get<any>(this.backendUrl).subscribe({
      next: data => {
        if (data.success) {
          this.productosDestacados = data.productos_destacados;
          this.categorias = data.categorias;
          this.loading = false;
        } else {
          this.error = 'Error al cargar datos.';
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'Error de conexión con el servidor.';
        this.loading = false;
      }
    });
  }

  cargarValoraciones(): void {
    this.http.get<any>(this.valoracionesUrl).subscribe({
      next: data => {
        if (data.success) {
          this.valoraciones = data.valoraciones;
          this.crearGruposValoraciones();
        } else {
          console.warn('No se pudieron cargar las valoraciones');
        }
      },
      error: err => {
        console.error('Error al cargar valoraciones', err);
      }
    });
  }

  crearGruposValoraciones(): void {
    // Generamos un array infinito de valoraciones aleatorias agrupadas de 5 en 5
    const gruposTemp: Valoracion[][] = [];
    const totalValoraciones = this.valoraciones.length;

    if (totalValoraciones === 0) {
      this.gruposValoraciones = [];
      this.numeroSlides = 0;
      return;
    }

    // Vamos a crear al menos 10 grupos (puedes aumentar)
    const cantidadGrupos = 10;

    for (let i = 0; i < cantidadGrupos; i++) {
      const grupo: Valoracion[] = [];
      const copia = [...this.valoraciones];
      for (let j = 0; j < 4; j++) {
        if (copia.length === 0) {
          copia.push(...this.valoraciones);
        }
        const index = Math.floor(Math.random() * copia.length);
        grupo.push(copia.splice(index, 1)[0]);
      }
      gruposTemp.push(grupo);
    }

    this.gruposValoraciones = gruposTemp;
    this.numeroSlides = gruposTemp.length;
  }

  cambiarSlide(direccion: number): void {
    if (this.animando) return;

    this.animando = true;
    this.indiceActual = (this.indiceActual + direccion + this.numeroSlides) % this.numeroSlides;

    // Esperamos a que termine la animación para permitir otro cambio
    setTimeout(() => {
      this.animando = false;
    }, 500); // duración debe coincidir con el CSS
  }

  productoSeleccionado: any = null; // para guardar producto clicado

  // En tu función para mostrar detalle producto:
  mostrarProductoDetalle(id_producto: number) {
    this.router.navigate(['/producto', id_producto]);
  }
}
