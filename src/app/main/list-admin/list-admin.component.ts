import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Admin } from './models/admin.model';
import { AddAdminDialogComponent } from './components/add-admin-dialog/add-admin-dialog.component';
import { EditAdminDialogComponent } from './components/edit-admin-dialog/edit-admin-dialog.component';
import { AdminRole } from './models/admin-role.model';

@Component({
  selector: 'app-list-admin',
  templateUrl: './list-admin.component.html',
  styleUrls: ['./list-admin.component.scss']
})
export class ListAdminComponent implements OnInit {

  displayedColumns: string[] = ['adminId', 'adminName', 'adminEmail', 'adminCode', 'adminRole', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Admin>();
  adminRoles: AdminRole[] = [];
  private readonly baseUrl = 'https://dia.ideaco.co.id:8787/api/v1';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAdmins();
    this.getAdminRoles();
  }

  getAdmins(): void {
    const url = `${this.baseUrl}/admins`;
    this.http.get<Admin[]>(url).subscribe((admins) => {
      this.dataSource.data = admins;
    });
  }

  getAdminRoles(): void {
    const url = `${this.baseUrl}/admins/roles`;
    this.http.get<AdminRole[]>(url).subscribe((roles) => {
      this.adminRoles = roles;
    });
  }

  openAddAdminDialog(): void {
    const dialogRef = this.dialog.open(AddAdminDialogComponent, {
      width: '500px',
      data: { adminRoles: this.adminRoles }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addAdmin(result);
      }
    });
  }

  addAdmin(admin: Admin): void {
    const url = `${this.baseUrl}/admins`;
    this.http.post<Admin>(url, admin).subscribe((newAdmin) => {
      this.dataSource.data = [newAdmin, ...this.dataSource.data];
    });
  }

  openEditAdminDialog(admin: Admin): void {
    const dialogRef = this.dialog.open(EditAdminDialogComponent, {
      width: '500px',
      data: { admin, adminRoles: this.adminRoles }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editAdmin(result);
      }
    });
  }

  editAdmin(admin: Admin): void {
    const url = `${this.baseUrl}/admins/${admin.adminId}`;
    this.http.put<Admin>(url, admin).subscribe((updatedAdmin) => {
      const index = this.dataSource.data.findIndex((a) => a.adminId === updatedAdmin.adminId);
      this.dataSource.data[index] = updatedAdmin;
    });
  }

  deleteAdmin(admin: Admin): void {
    const url = `${this.baseUrl}/admins/${admin.adminId}`;
    this.http.delete<void>(url).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter((a) => a.adminId !== admin.adminId);
    });
  }
}
