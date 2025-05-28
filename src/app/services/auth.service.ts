import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://nexustech.gal/backend/login.php';
  private registerUrl = 'http://nexustech.gal/backend/registro.php';
  private actualizarUrl = 'http://nexustech.gal/backend/actualizar-usuario.php';
  private apiUrl = 'http://nexustech.gal/backend/pedidos.php';

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private adminSubject = new BehaviorSubject<boolean>(false);

  loggedIn$ = this.loggedInSubject.asObservable();
  isAdmin$ = this.adminSubject.asObservable();

  // Clave para carrito localStorage
  private carritoLocalKey = 'carrito';
  private carritoSubject = new BehaviorSubject<any[]>(this.obtenerCarritoLocal());
  carrito$ = this.carritoSubject.asObservable();

  constructor(private http: HttpClient) {
    // Revisar si hay usuario guardado en localStorage al iniciar la app
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      this.loggedInSubject.next(true);
      this.adminSubject.next(usuario.rol === 'admin');
    }
  }

  // Login con backend
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(this.loginUrl, body, { withCredentials: true });
  }

  // Registro de usuario
  registrar(usuario: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, usuario, {
      responseType: 'json' as const
    });
  }

  // Actualizar el estado de login
  setLoginState(loggedIn: boolean, isAdmin: boolean): void {
    this.loggedInSubject.next(loggedIn);
    this.adminSubject.next(isAdmin);
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('usuario');
    this.setLoginState(false, false);
    this.limpiarCarritoLocal(); // Opcional: limpiar carrito local al cerrar sesión
  }

  // Obtener todos los usuarios
  getTodosLosUsuarios(): Observable<any> {
    return this.http.get<any>('http://nexustech.gal/backend/usuarios.php');
  }

  // Cambiar el rol de un usuario
  actualizarRol(id_usuario: number, rol: string): Observable<any> {
    const body = { id_usuario, rol };
    return this.http.post<any>('http://nexustech.gal/backend/actualizar-rol.php', body);
  }

  // Actualizar datos de usuario
  actualizarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.actualizarUrl, usuario);
  }

  // Obtener pedidos
  obtenerPedidos(): Observable<any> {
    return this.http.get<any>('http://nexustech.gal/backend/pedidos.php');
  }

  añadirProducto(formData: FormData): Observable<any> {
    return this.http.post<any>(
      'http://nexustech.gal/backend/anadir-producto.php',
      formData,
      { withCredentials: true }
    );
  }

  // Obtener categorías de productos
  obtenerCategorias(): Observable<any> {
    return this.http.get<any>('http://nexustech.gal/backend/categorias.php');
  }

  insertarValoracion(valoracion: any): Observable<any> {
    return this.http.post('http://nexustech.gal/backend/insertar-valoracion.php', valoracion);
  }

  obtenerProductoPorId(id: number): Observable<any> {
    return this.http.get(`http://nexustech.gal/backend/obtener-productos.php?id=${id}`);
  }

  // --- Métodos para carrito backend (usuarios logueados) ---
  añadirAlCarrito(id_producto: number, cantidad: number = 1): Observable<any> {
    return this.http.post<any>(
      'http://nexustech.gal/backend/anadir-carrito.php',
      { id_producto, cantidad },
      { withCredentials: true }
    );
  }

  obtenerCarrito(id_usuario: number): Observable<any[]> {
    return this.http.get<any>(`http://nexustech.gal/backend/obtener-carrito.php?id_usuario=${id_usuario}`, {
      withCredentials: true
    }).pipe(
      map(res => res.carrito || []) 
    );
  }

  actualizarCarrito(id_usuario: number, id_producto: number, cantidad: number): Observable<any> {
    const body = { id_usuario, id_producto, cantidad };
    return this.http.post<any>('http://nexustech.gal/backend/actualizar-carrito.php', body);
  }

  // --- Métodos para carrito local (usuarios NO logueados) ---
  obtenerCarritoLocal(): any[] {
    const carrito = localStorage.getItem(this.carritoLocalKey);
    return carrito ? JSON.parse(carrito) : [];
  }

  guardarCarritoLocal(carrito: any[]): void {
    localStorage.setItem(this.carritoLocalKey, JSON.stringify(carrito));
    this.carritoSubject.next(carrito);
  }

  agregarAlCarritoLocal(producto: any, cantidad: number): void {
    const carrito = this.obtenerCarritoLocal();
    const index = carrito.findIndex(item => item.id_producto === producto.id_producto);

    if (index !== -1) {
      carrito[index].cantidad += cantidad;
    } else {
      carrito.push({ ...producto, cantidad });
    }

    this.guardarCarritoLocal(carrito);
  }

  limpiarCarritoLocal(): void {
    localStorage.removeItem(this.carritoLocalKey);
    this.carritoSubject.next([]);
  }

  crearPedido(payload: { id_usuario: number; carrito: any[]; total: number }): Observable<any> {
    return this.http.post<any>(
      'http://nexustech.gal/backend/crear-pedidos.php',
      payload,
      { withCredentials: true }
    );
  }

  enviarContacto(datos: any) {
    return this.http.post<any>('http://nexustech.gal/backend/enviar-contacto.php', datos, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  filtrarProductosPorTermino(termino: string) {
    return this.http.get<any>(`http://nexustech.gal/backend/filtrar-productos.php`, {
      params: { termino }
    });
  }

  editarProducto(formData: FormData) {
    return this.http.post<any>('http://nexustech.gal/backend/editar-producto.php', formData, { withCredentials: true });
  }

  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>('http://nexustech.gal/backend/listar-productos.php', { withCredentials: true });
  }

  actualizarEstadoPedido(id_pedido: number, nuevoEstado: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      id_pedido,
      estado: nuevoEstado
    });
  }

}
