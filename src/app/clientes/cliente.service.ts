import { formatDate } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Cliente } from './cliente';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private BE_URL: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    //return of (CLIENTES);
    /* return this.http.get<Cliente[]>(this.BE_URL); */
    return this.http.get(this.BE_URL)
    .pipe(
      tap(response => {
        let clientes = response as Cliente[];
        clientes.forEach(cliente => {
          console.log(cliente.email);
        });
      }),
      map(response => {
        let clientes = response as Cliente[];
        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          // cliente.createdAt = formatDate(cliente.createdAt, 'fullDate', 'es-MX');
          return cliente;
        });
      }),
      tap(response => {
        response.forEach(cliente => {
          console.log(cliente.nombre);
        });
      }),
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.BE_URL}/${id}`)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        this.handleError(err);
        return throwError(() => err);
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.BE_URL, cliente, { headers: this.httpHeaders })
    .pipe(
      catchError((err: HttpErrorResponse) => {
        this.handleError(err);
        return throwError(() => err);
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.BE_URL}/${cliente.id}`, cliente, { headers: this.httpHeaders })
    .pipe(
      catchError((err: HttpErrorResponse) => {
        this.handleError(err);
        return throwError(() => err);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.BE_URL}/${id}`, { headers: this.httpHeaders })
    .pipe(
      catchError((err: HttpErrorResponse) => {
        this.handleError(err);
        return throwError(() => err);
      })
    );
  }

  handleError(err: any) {
    console.log(err.error);
    const title = err.error.message || 'Lo sentimos...';
    const text =  err.error.error || '';
    swal.fire({
      icon: 'error',
      title,
      text
    });
  }

}
