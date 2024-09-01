import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManagerService } from '../../../../services/manager.service'; 
import { ManagerAddComponent } from '../manager-add/manager-add.component'; 
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  displayedColumns: string[] = 
  ['cin','nom', 'prenom', 'tel', 'email', 'departement', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private managerService: ManagerService, 
    private snackBar: MatSnackBar,
    private userService: UserService , 
  ) {}

  ngOnInit(): void {
    this.loadManagers();
    this.userService.signout();
  }

  loadManagers(): void {
    this.managerService.getAllManagers().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des managers', err);
      }
    });
  }

  openAddManagerDialog(): void {
    const dialogRef = this.dialog.open(ManagerAddComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadManagers();
        }
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteManager(id: string , nom:string): void {
    if (confirm(`Souhaitez-vous confirmer la suppression de l'employé "${nom}"?`)) {
    this.managerService.deleteManager(id).subscribe({
      next: () => {
        this.loadManagers();
        this.snackBar.open('Manager supprimé avec succès!', 'Fermer', {
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du manager', err);
      }
    });
  }
}
  async logOut() {
    if (confirm("Do you want to log out?")) {
      await this.userService.signout()
    }
  }
}

