import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component(

  {

    selector: 'app-detalle-prenda',
    templateUrl: './detalle-prenda.component.html',
    styleUrls: ['./detalle-prenda.component.css'],

  }

)
export class DetallePrendaComponent implements OnInit {


  idPrenda: number;
  prenda: any;
  idCategoria: any;
  correo: any;
  nombreCategoria: any;
  recomendadas: any;

  constructor(private routeActivate: ActivatedRoute, private client: ClientService, private router: Router) {

  }

  ngOnInit(): void {
    this.idPrenda = this.routeActivate.snapshot.params["id"];
    console.log("ID" + this.idPrenda);

    this.client.getRequest(`http://localhost:10101/detalle-prenda/${this.idPrenda}`).subscribe(
      ((response: any) => {
        // console.log(response);
        this.prenda = response.prendas;
        this.correo = response.correo
        this.idCategoria = response.prendas[0].idCategoria;
        this.nombreCategoria = response.prendas[0].nombreCategoria;

        this.client.postRequest(`http://localhost:10101/prendas-recomendadas`,
          {
            idCategoria: this.idCategoria,
            nombreCategoria: this.nombreCategoria,
            idPrenda: this.idPrenda
          }
        ).subscribe(
          ((response: any) => {
            this.recomendadas = response.recomendadas;

          }),
          ((error: any) => {
            console.log(error.error.Status);
            console.log(error);
          })
        );

      }),
      ((error: any) => {
        console.log(error.error.Status);
        console.log(error);

      })
    );

  }


  verPrenda(id_prenda: number) {
    this.router.navigate(['/detalle-prenda', id_prenda]);
  }

  comprar() {
    if (this.correo) {
      this.idPrenda = this.routeActivate.snapshot.params["id"];
      this.client.postRequest(`http://localhost:10101/detalle-prenda/${this.idPrenda}`).subscribe(
        ((response: any) => {
            Swal.fire({
              icon: 'success',
              title: '¡Compra exitosa!',
              width:'300px',
              showConfirmButton: false,
              timer: 1500

            })
            this.router.navigate(['detalle-compra']);
          

        }),
        ((error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡Error en la compra!.',
            width:'300px',
          })

        })
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '¡Por favor inicie sesion para comprar!.',
        width:'300px',
      })
    }
  }


}

