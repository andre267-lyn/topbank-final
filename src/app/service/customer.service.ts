import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Customer } from '../model/customers/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'https://dia.ideaco.co.id:8787/api/v1/customers';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Error fetching customers:', error);
          return throwError(error);
        })
      );
  }

  updateCustomer(customerId: string, data: any): Observable<any> {
    const updateUrl = `${this.apiUrl}/${customerId}`;
    return this.http.put(updateUrl, data).pipe(
      catchError((error) => {
        console.error('Error updating customer:', error);
        return throwError(error);
      })
    );
  }

  exportCustomersToCSV(): Observable<any> {
    const exportUrl = `${this.apiUrl}/export`;
    return this.http.get(exportUrl, { responseType: 'text' });
  }
}
