export class Productos {
  id?: string;
  titulo: string = "";
  descripcion?: string;
  precio: number = 0;
  ano: string = "";
  marca: string = "";
  tramision: string = "";
  categoria: string = "";
  imageUrl: string = ""; 

  constructor(titulo: string, descripcion: string, precio: number, ano: string, marca: string, tramision: string, categoria: string, imageUrl: string = "", id?: string) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.precio = precio;
    this.ano = ano;
    this.marca = marca
    this.tramision = tramision;
    this.categoria = categoria;
    this.imageUrl = imageUrl;
    this.id = id;
  }
}