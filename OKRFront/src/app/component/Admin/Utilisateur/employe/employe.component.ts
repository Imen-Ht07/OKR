import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeService } from '../../../../services/employe.service';
import { EmployeAddComponent } from 'src/app/component/Admin/Utilisateur/employe-add/employe-add.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css']
})
export class EmployeComponent implements OnInit {
  displayedColumns: string[] = 
  ['cin','nom', 'prenom', 'tel','email', 'departement', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private employeService: EmployeService,
    private snackBar: MatSnackBar,
    private userService: UserService , 
  ) {}

  ngOnInit(): void {
    this.loadEmployes();
    this.userService.signout();
  }

  loadEmployes(): void {
    this.employeService.getAllEmployes().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des employés', err);
      }
    });
  }

  openAddEmployeDialog(): void {
    const dialogRef = this.dialog.open(EmployeAddComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadEmployes();
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
  deleteEmploye(id: string , nom: string): void {
    if (confirm(`Souhaitez-vous confirmer la suppression de l'employé "${nom}"?`)) {
    this.employeService.deleteEmploye(id).subscribe({
      next: () => {
        this.loadEmployes();
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
