import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductosService } from '../../productos.service';
import { Productos } from '../../../producto.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Producto {

  private productosService = inject(ProductosService);
  private http = inject(HttpClient);

  producto: Productos = new Productos('', '', 0, '');
  categorias = ['Aperitivos / Entrantes', 'Ensaladas', 'Platos Principales', 'Pastas', 'Postres', 'Bebidas'];
  selectedFile: File | null = null;
  isUploading: boolean = false;

  private readonly UPLOAD_URL = 'http://localhost:3000/upload-local';

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.producto.imageUrl = URL.createObjectURL(file);
    }
  }

  async onSubmit(form: any) {
    if (form.invalid || !this.selectedFile) {
      if (!this.selectedFile)
        Swal.fire('Atención', 'Por favor, selecciona una imagen.', 'warning');
      return;
    }

    this.isUploading = true;

    try {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);
      const response: any = await this.http.post(this.UPLOAD_URL, formData).toPromise();
      this.producto.imageUrl = response.filePath;

      this.productosService.agregar_producto(this.producto).subscribe({
        next: () => {
          Swal.fire('¡Guardado!', 'El producto se agregó correctamente.', 'success');
          form.resetForm();
          this.producto = new Productos('', '', 0, '');
          this.selectedFile = null;
        },
        error: erro => {
          console.error('Error al guardar en Firebase:', erro);
          Swal.fire('Error', 'No se pudo guardar el producto en Firebase.', 'error');
        }
      });
    } catch (error) {
      console.error('Error en la subida local:', error);
      Swal.fire('Error', 'No se pudo subir la imagen al servidor local.', 'error');
    } finally {
      this.isUploading = false;
    }
  }
}
