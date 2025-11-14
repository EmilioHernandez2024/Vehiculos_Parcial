import { Routes } from '@angular/router';
import { Producto } from './Dashboard/productos/productos';
import { Menu } from './menu/menu';
import { Error } from './Dashboard/error/error';
import { ProductosEditables } from './Dashboard/productos-editables/productos-editables';
import { Listados } from './Dashboard/listados/listados';
import { DasboardMenu } from './Dashboard/dasboard-menu/dasboard-menu';
import { Bienvenido } from './Dashboard/bienvenido/bienvenido';
import { Contacto } from './contacto/contacto';
import { Nosotros } from './nosotros/nosotros';



export const routes: Routes = [
  { path: "", component: Menu },
  { path: "Nosotros", component: Nosotros },
  { path: "Contacto", component: Contacto },

  {
    path: "Dashboard",component: DasboardMenu,children: [
      { path: '', component: Bienvenido }, 
      { path: "productos", component: Producto },
      { path: "listado", component: Listados },
      { path: "editar/:id", component: ProductosEditables },
      { path: "", redirectTo: "listado", pathMatch: "full" },
      { path: '**', redirectTo: '' } 
    ]
  },

  { path: "**", component: Error }
];
