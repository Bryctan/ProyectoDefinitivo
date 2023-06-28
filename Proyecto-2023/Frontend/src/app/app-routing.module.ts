import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { HomeComponent } from './components/home/home.component';
import { DetallePrendaComponent } from './components/detalle-prenda/detalle-prenda.component';
import { DetalleCompraComponent } from './components/detalle-compra/detalle-compra.component';
import { DetalleUsuarioComponent } from './components/detalle-usuario/detalle-usuario.component';
import { CategoriaComponent } from './components/categoria/categoria.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegistroComponent },
  { path: 'login', component: InicioComponent },
  { path: 'detalle-prenda/:id', component: DetallePrendaComponent },
  { path: 'detalle-compra', component: DetalleCompraComponent },
  { path: 'detalle-usuario/:id', component: DetalleUsuarioComponent },
  { path: 'categorias/:categoria', component: CategoriaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
