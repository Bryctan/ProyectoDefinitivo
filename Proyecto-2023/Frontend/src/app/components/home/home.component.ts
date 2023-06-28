import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  prendas: any;
  dama: string = "dama";
  caballero: string = "caballero";
  ninos: string = "niños";
  prendasDama: any;
  prendasCaballero: any;
  prendasNinos: any;

  constructor(private client: ClientService, private router: Router) {

  }

  ngOnInit(): void {
    this.client.getRequest("http://localhost:10101/productos").subscribe(
      ((response: any) => {
        this.prendas = response.prendas;

      }),
      ((error: any) => {
        console.log(error);

      })
    );

    this.client.getRequest(`http://localhost:10101/categoria/${this.dama}`).subscribe(
      ((response: any) => {
        this.prendasDama = response.prendas;
        console.log(response);

      }),
      ((error: any) => {
        console.log(error.error.Status);

      })
    );

    this.client.getRequest(`http://localhost:10101/categoria/${this.caballero}`).subscribe(
      ((response: any) => {
        this.prendasCaballero = response.prendas;
        console.log(response);

      }),
      ((error: any) => {
        console.log(error.error.Status);

      })
    );

    this.client.getRequest(`http://localhost:10101/categoria/${this.ninos}`).subscribe(
      ((response: any) => {
        this.prendasNinos = response.prendas;
        console.log(response);

      }),
      ((error: any) => {
        console.log(error.error.Status);

      })
    );

  }

  verPrenda(id_prenda: number) {
    console.log(id_prenda);
    this.router.navigate(['/detalle-prenda', id_prenda]);
  }

  categoria(categoria: string) {
    console.log(categoria);

    this.router.navigate(['/categorias', categoria]);
  }
}