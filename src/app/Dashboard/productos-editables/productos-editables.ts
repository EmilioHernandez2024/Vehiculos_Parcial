import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Productos } from '../../../producto.model';
import { ProductosService } from '../../productos.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-productos-editables',
  standalone: true,
  imports: [CommonModule, FormsModule, ], 
  templateUrl: './productos-editables.html',
  styleUrl: './productos-editables.css',
})
export class ProductosEditables implements OnInit {
  private productosService = inject(ProductosService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient); 

  producto: Productos = new Productos('', '', 0, '', '', '','');
  categorias = ['Minivan', 'Familiar', 'Convertible', 'Deportivo', 'SUV', 'Hatchback'];
  marca = ['Marca A', 'Marca B', 'Marca C'];
  ano= ['2020', '2021', '2022', '2023'];
  transmisione = ['Manual', 'Automática', 'Semi-automática'];
  idProducto: string = '';
  
  // Nuevo estado para manejar la nueva imagen seleccionada y la carga
  selectedFile: File | null = null;
  isUploading: boolean = false;
  
 
  private readonly UPLOAD_URL = 'http://localhost:3000/upload-local'; // URL para el servidor Node.js
  private readonly ASSET_BASE_URL = 'http://localhost:3000/assets-local/';

  ngOnInit(): void {
    this.idProducto = this.route.snapshot.paramMap.get('id') || '';

    if (this.idProducto) {
      this.productosService.cargar_productos().subscribe({
        next: (data: any) => {
          if (data && data[this.idProducto]) {
            this.producto = { ...data[this.idProducto], id: this.idProducto };
          }
        },
        error: err => console.error('Error al cargar producto:', err)
      });
    }
  }
  
  // Maneja la selección de un nuevo archivo de imagen
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
        this.selectedFile = file;
        // Usa una URL temporal para la previsualización inmediata en el form
        this.producto.imageUrl = URL.createObjectURL(file); 
    }
  }

  // Convierte la ruta de Firebase ('assets/images/X') a la URL de Node.js ('http://localhost:3000/assets-local/X')
  getImageUrl(relativePath: string | undefined): string {
    if (!relativePath) {
      return '';
    }
    // Si la imagen es una URL blob temporal (cuando se selecciona un nuevo archivo), la devuelve
    if (relativePath.startsWith('blob:')) {
        return relativePath;
    }
    
    // Si es la ruta guardada en Firebase, la transforma para Node.js
    const fileName = relativePath.split('/').pop();
    
    return this.ASSET_BASE_URL + fileName;
  }

  async guardarCambios() {
    this.isUploading = true;
    
    try {
        if (this.selectedFile) {
            //  Si hay un nuevo archivo, subirlo a Node.js
            const formData = new FormData();
            formData.append('image', this.selectedFile, this.selectedFile.name);
            
            // Usamos .toPromise() para esperar la subida
            const response: any = await this.http.post(this.UPLOAD_URL, formData).toPromise();
            this.producto.imageUrl = response.filePath; // Guardamos la nueva ruta relativa de Firebase
        }

        //  Actualizar el producto en Firebase
        this.productosService.actualizar_producto(this.idProducto, this.producto).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Producto actualizado',
                    text: 'Los cambios se guardaron correctamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    this.router.navigate(['/Dashboard/listado']);
                });
            },
            error: (err) => {
                console.error('Error al actualizar en Firebase:', err);
                Swal.fire('Error', 'No se pudo actualizar el producto en Firebase.', 'error');
            }
        });

    } catch (error) {
        console.error('Error en la subida local o actualización:', error);
        Swal.fire('Error', 'Hubo un error al subir la imagen o guardar los cambios.', 'error');
    } finally {
        this.isUploading = false;
    }
  }

  eliminarProducto() {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (res.isConfirmed) {
        this.productosService.eliminar_producto(this.idProducto).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El producto fue eliminado correctamente.',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this.router.navigate(['/Dashboard/listado']);
            });
          },
          error: err => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
          }
        });
      }
    });
  }

  cancelar() {
    this.router.navigate(['/Dashboard/listado']);
  }
}