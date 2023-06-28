import { Component } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-compra',
  templateUrl: './detalle-compra.component.html',
  styleUrls: ['./detalle-compra.component.css']
})
export class DetalleCompraComponent {


  constructor(private client: ClientService) { }

  generarPDF() {
    this.client.getRequest(`http://localhost:10101/generar-pdf`).subscribe(
      ((response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'PDF enviado al correo',
            width:'300px',
            showConfirmButton: false,
            timer: 1500
          })
      }),
      ((error: any) => {
        console.log(error);

      })
    );

  }
}
