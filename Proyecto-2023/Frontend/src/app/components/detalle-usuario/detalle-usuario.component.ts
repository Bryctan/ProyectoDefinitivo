import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent implements OnInit {

  idUsuario: number;
  valorIdUsuario: number;
  usuario: any;

  contador: number;

  constructor(private routeActivate: ActivatedRoute, private client: ClientService, private router: Router) {
    this.contador = 10;
  }

  ngOnInit(): void {
    this.idUsuario = this.routeActivate.snapshot.params["id"];
    this.client.getRequest(`http://localhost:10101/detalle-usuario/${this.idUsuario}`).subscribe(
      ((response: any) => {
        // console.log(response);
        this.usuario = response.usuario;

        const interval = setInterval(() => {
          this.contador--;
          if (this.contador === 0) {
            this.router.navigate(['']);
            clearInterval(interval);
          }
        }, 1000);
      }),
      ((error: any) => {
        console.log(error.error.Status);

      })
    );
  }

}
