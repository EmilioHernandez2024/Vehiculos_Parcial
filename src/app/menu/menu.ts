import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../productos.service';
import { Productos } from '../../producto.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  standalone: true,
  // Asegúrate de importar HttpClientModule, aunque no se use directamente para cargar, es una buena práctica
  imports: [CommonModule, HttpClientModule], 
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {
  private productosService = inject(ProductosService);

  productos: Productos[] = [];
  categorias: string[] = [];

  // CONSTANTE CRÍTICA para construir la URL local
  private readonly ASSET_BASE_URL = 'http://localhost:3000/assets-local/';

  ngOnInit(): void {
    this.cargarProductos();
  }

  // FUNCIÓN CLAVE: Convierte la ruta de Firebase ('assets/images/X') a la URL de Node.js ('http://localhost:3000/assets-local/X')
  getImageUrl(relativePath: string | undefined): string {
    if (!relativePath) {
      return '';
    }
    // Asumiendo que relativePath es 'assets/images/nombre_archivo.jpg', solo necesitamos el nombre del archivo
    const fileName = relativePath.split('/').pop();
    
    return this.ASSET_BASE_URL + fileName;
  }

  cargarProductos() {
    this.productosService.cargar_productos().subscribe({
      next: (data: any) => {
        if (!data) return;
        const productosArray = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value
        }));
        this.productos = productosArray;
        this.categorias = [...new Set(this.productos.map(p => p.categoria))].filter(Boolean); // Filtrar vacíos por si acaso
      },
      error: err => console.error('Error al cargar productos:', err)
    });
  }

  productosPorCategoria(categoria: string) {
    return this.productos.filter(p => p.categoria === categoria);
  }
}