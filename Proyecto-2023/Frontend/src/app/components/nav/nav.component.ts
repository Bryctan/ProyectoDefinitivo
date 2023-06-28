import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  scrolled: boolean = false;
  nombre: string;
  correo: string;

  constructor(private client: ClientService) {

  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrolled = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > 0;
  }

  ngOnInit(): void {
    console.log(this.nombre);

    this.client.getRequest(`http://localhost:10101/nav`).subscribe(
      ((response: any) => {

        this.nombre = response.usuario[0].nombre;

        // console.log("aa" + this.nombre);

      }),
      ((error: any) => {
        // console.log(error.error.Status);
        console.log(error);

      })
    );
  }

  cerrarSesion() {
    this.client.getRequest(`http://localhost:10101/salir`).subscribe(
      ((response: any) => {

        // console.log("aa" + this.nombre);

        console.log(response);

      }),
      ((error: any) => {
        console.log(error.error.Status);
        console.log(error);

      })
    );
  }
}
