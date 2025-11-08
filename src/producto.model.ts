export class Productos {
  id?: string;
  titulo: string = "";
  descripcion?: string;
  precio: number = 0;
  categoria: string = "";
  imageUrl: string = ""; 

  constructor(titulo: string, descripcion: string, precio: number, categoria: string, imageUrl: string = "", id?: string) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.precio = precio;
    this.categoria = categoria;
    this.imageUrl = imageUrl;
    this.id = id;
  }
}