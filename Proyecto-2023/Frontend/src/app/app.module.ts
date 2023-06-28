import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroComponent } from './components/registro/registro.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { DetallePrendaComponent } from './components/detalle-prenda/detalle-prenda.component';
import { DetalleCompraComponent } from './components/detalle-compra/detalle-compra.component';
import { DetalleUsuarioComponent } from './components/detalle-usuario/detalle-usuario.component';
import { CategoriaComponent } from './components/categoria/categoria.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    InicioComponent,
    HomeComponent,
    NavComponent,
    FooterComponent,
    DetallePrendaComponent,
    DetalleCompraComponent,
    DetalleUsuarioComponent,
    CategoriaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxImageZoomModule,
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
