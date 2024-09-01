import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ObjectifService } from '../../../../services/objectif.service';
import { ObjAddEditComponent } from 'src/app/component/Admin/Objectifs/obj-add-edit/obj-add-edit.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-objectif',
  templateUrl: './objectif.component.html',
  styleUrls: ['./objectif.component.css']
})
export class ObjectifComponent implements OnInit {

  displayedColumns: string[] = 
  ['description', 'date_limite', 'etat_avancement', 'equipeId', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private objectifService: ObjectifService,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadObjectifs();

  }
  isEmploye(): boolean {
    return this.userService.isEmploye();
  }
  isADmin(): boolean {
    return this.userService.isAdmin();
  }
  loadObjectifs(): void {
    this.objectifService.getAllObjectifs().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des objectifs', err);
      }
    });
  }

  openAddObjectifDialog(): void {
    const dialogRef = this.dialog.open(ObjAddEditComponent);
     dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadObjectifs();
        }
      },
    });
  }
  getObjectifByID(id: string): void {
    this.objectifService.getObjectifByID(id).subscribe({
      next: (objectif) => {
        if (objectif) {
          this.openUpdateObjectifDialog(objectif);
        } else {
          console.error('Aucun objectif trouvé avec cet ID');
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'objectif à modifier', err);
      },
    });
  }
  openUpdateObjectifDialog(objectif: any): void {
    const dialogRef = this.dialog.open(ObjAddEditComponent, {
      data: objectif,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadObjectifs();
        }
      },
    });
  }
//search
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteObjectif(id: string): void {
    this.objectifService.deleteObjectif(id).subscribe({
      next: () => {
        this.loadObjectifs();
        this.snackBar.open('Objectif supprimé avec succès!', 'Fermer', {
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l\'objectif', err);
      }
    });
  }
}
