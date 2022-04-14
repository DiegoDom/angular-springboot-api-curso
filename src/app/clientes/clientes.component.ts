import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];

  public loading: boolean = false;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading = true;
    this.clientes = [];
    this.clienteService.getClientes()
    .subscribe({
      next: (clientes) => {
        this.loading = false;
        this.clientes = clientes
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }
    });
  }

  delete(cliente: Cliente): void {

    const { id, nombre, apellido } = cliente;

    swal.fire({
      title: '¿Estas seguro?',
      text: `No podras recuperar los datos del cliente ${nombre} ${apellido}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(id)
        .subscribe({
          next: () => {
            this.loading = false;
            swal.fire({
              icon: 'success',
              title: 'Cliente eliminado',
              text: `Se elimino el cliente ${ nombre} ${ apellido } con éxito.`
            }).then(() => {
              this.cargarClientes();
            });
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    })
  }

}
