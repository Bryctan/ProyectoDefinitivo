import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  form: FormGroup;
  spinner: boolean = false;
  formulario: boolean = true;

  mensaje: string;

  constructor(private fb: FormBuilder, private client: ClientService, private router: Router) {

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      correo: ['', Validators.required],
      clave: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.spinner = true;
      this.formulario = false
      this.client.postRequest('http://localhost:10101/login',
        {
          correo: this.form.value.correo,
          clave: this.form.value.clave
        }, undefined, undefined).subscribe(
          (response: any) => {
            // console.log(response);

            // this.mensaje = response.Status;
            // console.log(this.mensaje);
            // this.router.navigate(['']);

            let id: number;

            id = response.id;

            setTimeout(() => {
              Swal.fire({
                icon: 'success',
                title: '¡Inicio de sesión exitoso!',
                width: '300px',
                showConfirmButton: false,
                timer: 1500
              })
              this.router.navigate(['/detalle-usuario', id]);
            }, 3000)

            // console.log("aaa" + id);

          },
          (error: any) => {

            setTimeout(() => {
              this.formulario = true;
              this.spinner = false;
              this.mensaje = error.error.Status;
              console.log(this.mensaje);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: '¡Credenciales incorrectas!',
                width: '300px',
              })
            }, 5000)
          }
        );
    } else {
      // console.log('Verifique sus datos');
      this.mensaje = "Verifique sus datos";
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '¡Verifique sus datos!',
        width: '300px',
      })
    }
  }

  obtenerEmail() {
    console.log(this.form.value.email);

  }

}
