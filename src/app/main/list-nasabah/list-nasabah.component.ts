import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/service/customer.service';
import { Customer } from 'src/app/model/customers/customer.model';
import { map } from 'rxjs/operators';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-list-nasabah',
  templateUrl: './list-nasabah.component.html',
  styleUrls: ['./list-nasabah.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListNasabahComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'customerId',
    'name',
    'accountNumber',
    'email',
    'phoneNumber',
    'debitCardType',
    'motherMaidenName',
    'accountCreationTime',
    'actions',
  ];
  dataSource: MatTableDataSource<Customer>;
  editForm: FormGroup;
  row: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.dataSource = new MatTableDataSource<Customer>([]);
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.maxLength(20)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      motherMaidenName: ['', [Validators.maxLength(20)]],
    });
  }

  ngAfterViewInit() {
    this.customerService.getCustomers().pipe(
      map((response) => {
        console.log('API Response:', response);
        if ('success' in response && response.success) {
          const responseData = ('data' in response) ? response['data'] : [];
          const customers = Array.isArray(responseData) ? responseData : [];
          console.log('Processed Customers:', customers);
          return customers.map((customer) => {
            return {
              ...customer,
              accountCreationTime: this.formatDate(customer.createdAt),
              debitCardType: customer.customerCard?.cardName || 'N/A',
            };
          });
        } else {
          const errorMessage = ('message' in response) ? response.message : 'Failed to get customers';
          console.error('Failed to get customers. Error message:', errorMessage);
          alert('Failed to get customers. Please try again.');
          return [];
        }
      })
    ).subscribe((customers) => {
      console.log('Customers:', customers);
      this.dataSource.data = customers;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  editUser(customer: Customer) {
    this.row = customer;
    console.log('Editing customer:', customer);
    this.editForm.patchValue({
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      motherMaidenName: customer.motherMaidenName,
    });
    this.showEditModal();
  }

  saveChanges() {
    const customerId = this.row.customerId;
    if (this.editForm.valid) {
      const editedData = this.editForm.value;
      this.customerService.updateCustomer(customerId, editedData).subscribe(
        () => {
          console.log('Changes saved successfully');
          this.reloadData();
          this.hideEditModal();
        },
        (error) => {
          console.error('Error saving changes:', error);
          alert('Error saving changes. Please try again.');
        }
      );
    } else {
      console.warn('Form is not valid. Please check your input.');
      alert('Invalid input. Please check your input.');
    }
  }

  reloadData() {
    this.customerService.getCustomers().pipe(
      map((customers) => {
        return customers.map((customer) => {
          return {
            ...customer,
            accountCreationTime: this.formatDate(customer.accountCreationTime),
          };
        });
      })
    ).subscribe((customers) => {
      this.dataSource.data = customers;
    });
  }

  exportDataToCSV() {
    this.customerService.exportCustomersToCSV().subscribe(
      (csvData) => {
        this.downloadFile(csvData, 'customers.csv');
      },
      (error) => {
        console.error('Error exporting data to CSV:', error);
        alert('Error exporting data to CSV. Please try again.');
      }
    );
  }

  private downloadFile(data: any, filename: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private formatDate(date: string | undefined): string {
    if (date) {
      const parts = date.split(' ');
      const datePart = parts[0];
      const timePart = parts[1];

      const [day, month, year] = datePart.split('-');
      const [hours, minutes, seconds] = timePart.split(':');

      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    } else {
      return '';
    }
  }

  private showEditModal() {
    const modal = this.el.nativeElement.querySelector('#editModal');
    this.renderer.addClass(modal, 'show');
  }

  private hideEditModal() {
    const modal = this.el.nativeElement.querySelector('#editModal');
    this.renderer.removeClass(modal, 'show');
  }
}
