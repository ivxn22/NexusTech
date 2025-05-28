import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  searchControl = new FormControl('');
  productosFiltrados: any[] = [];
  mostrarResultados: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Suscripciones a estado de usuario
    this.authService.loggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loggedIn => this.isLoggedIn = loggedIn);

    this.authService.isAdmin$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAdmin => this.isAdmin = isAdmin);

    // Lógica de búsqueda
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(valor => {
        const termino = valor?.trim().toLowerCase();

        if (termino && termino.length > 0) {
          this.authService.filtrarProductosPorTermino(termino).subscribe({
            next: (res) => {
              console.log('Valor buscado:', termino);
              if (res.success && Array.isArray(res.productos) && res.productos.length > 0) {
                this.productosFiltrados = res.productos;
                this.mostrarResultados = true;
              } else {
                this.resetResultados();
              }
            },
            error: (err) => {
              console.error('Error en búsqueda:', err);
              this.resetResultados();
            }
          });
        } else {
          this.resetResultados();
        }
      });
  }

  irAlProducto(id: number): void {
    this.resetResultados();
    this.searchControl.setValue('');
    this.router.navigate(['/producto', id]);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  resetResultados(): void {
    this.productosFiltrados = [];
    this.mostrarResultados = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
