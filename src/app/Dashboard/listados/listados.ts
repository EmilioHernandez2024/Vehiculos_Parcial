import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductosService } from '../../productos.service';
import { Productos } from '../../../producto.model';

@Component({
  selector: 'app-listados',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './listados.html',
  styleUrls: ['./listados.css']
})
export class Listados implements OnInit {

  private productosService = inject(ProductosService);
  private http = inject(HttpClient);

  productos: Productos[] = [];
  productoSeleccionado: Productos | null = null;

  private readonly ASSET_BASE_URL = 'http://localhost:3000/assets-local/';

  ngOnInit(): void {
    this.cargarLista();
  }

  cargarLista() {
    this.productosService.cargar_productos().subscribe({
      next: (data: any) => {
        if (!data) { this.productos = []; return; }

        this.productos = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value
        }));
      },
      error: err => console.error('Error al cargar productos:', err)
    });
  }

  getImageUrl(relativePath: string | undefined): string {
    if (!relativePath) return '';
    const fileName = relativePath.split('/').pop();
    return this.ASSET_BASE_URL + fileName;
  }

  refrescarLista() {
    this.cargarLista();
  }
}
