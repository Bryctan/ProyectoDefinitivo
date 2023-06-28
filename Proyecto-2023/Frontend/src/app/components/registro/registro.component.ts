import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  form: FormGroup;
  spinner: boolean = false;
  formulario: boolean = true;
  mensaje: string;

  constructor(private fb: FormBuilder, private client: ClientService, private router: Router) { }

  ngOnInit(): void {
    localStorage.setItem("token", "ahsdgjfdagjsdfasgdjsadgsa");
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.email],
      clave: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.spinner = true;
      this.formulario = false
      this.client.postRequest("http://localhost:10101/register",
        {
          nombre: this.form.value.nombre,
          correo: this.form.value.correo,
          clave: this.form.value.clave
        }, undefined, { "Authorization": `Bearer ${localStorage.getItem("token")}` }).subscribe(
          ((response: any) => {
            // console.log(response);
            // this.mensaje = response.Status;
            // console.log(this.mensaje)
            setTimeout(() => {
              Swal.fire({
                icon: 'success',
                title: 'Registro Exitoso',
                width:'300px',
                showConfirmButton: false,
                timer: 1500

              })
              this.router.navigate(['login']);
            }, 2000)

           

          }),
          ((error: any) => {
            // console.log("error");
            this.mensaje = error.error.Status;


            setTimeout(() => {
              this.formulario = true;
              this.spinner = false;
              console.log(this.mensaje);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error, correo ya existente.',
                width:'300px',
              })
              
            }, 3000)

          })
        )

    } else {
      // console.log("Verifique sus datos");
      this.mensaje = "Verifique sus datos";
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Verifique sus datos',
        width:'300px',
      })
    }
  }

}
