import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: [
  ]
})
export class FormComponent implements OnInit {

  public titulo: string = 'Crear';
  public cliente: Cliente =  new Cliente();
  public loading: boolean = false;
  private id: number;

  constructor(private clienteService: ClienteService,
      private router: Router,
      private activatedRoute: ActivatedRoute) {
        this.id = this.activatedRoute.snapshot.params['id'];
      }

  ngOnInit(): void {
    if (this.id) {
      this.titulo = 'Editar';
      this.cargarCliente();
    }
  }

  cargarCliente(): void {
    this.loading = true;
    this.clienteService.getCliente(this.id)
    .subscribe({
      next: (cliente) => {
        this.loading = false;
        this.cliente = cliente
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/clientes']);
      }
    });
  }

  create(): void {

    if (this.id) {
      this.update();
      return;
    }

    this.loading = true;

    this.clienteService.create(this.cliente)
    .subscribe({
      next: (cliente) => {
        this.loading = false;
        const { nombre, apellido, } = cliente;
        swal.fire({
          icon: 'success',
          title: 'Cliente creado',
          text: `Se registro el cliente ${ nombre} ${ apellido } con éxito.`
        }).then(() => {
          this.router.navigate(['/clientes']);
        });
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  update(): void {
    this.loading = true;
    this.clienteService.update(this.cliente)
    .subscribe({
      next: (cliente) => {
        this.loading = false;
        const { nombre, apellido, } = cliente;
        swal.fire({
          icon: 'success',
          title: 'Cliente actualizado',
          text: `Se actualizo el cliente ${ nombre} ${ apellido } con éxito.`
        }).then(() => {
          this.router.navigate(['/clientes']);
        });
      },
      error: () => {
        this.loading = false;
      }
    });
  }

}
