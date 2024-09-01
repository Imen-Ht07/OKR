import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResultatService } from '../../../../services/resultat.service';
import { AddResultatComponent } from '../add-resultat/add-resultat.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Resultat } from 'src/app/models/resultat';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-resultat',
  templateUrl: './resultat.component.html',
  styleUrls: ['./resultat.component.css']
})
export class ResultatComponent implements OnInit {
  displayedColumns: string[] = ['titre', 'description', 'avancement','etat_avancement', 'actions'];
  dataSource!: MatTableDataSource<any>;
  objectifID!: string
  resultat !: Resultat 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private resultatService: ResultatService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private userService: UserService
   
  ) {}

  ngOnInit(): void {
    const  objectifID = this.route.snapshot.paramMap.get('id');
    this.loadResultats(objectifID!);

  }
  isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  loadResultats(objectifID: string): void {
    this.resultatService.getAllResultats(objectifID).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des résultats', err);
      }
    });
  }

  openAddResultatDialog(): void {
    const dialogRef = this.dialog.open(AddResultatComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadResultats(this.objectifID!);
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

  deleteResultat(id: string, titre: string): void {
    if (confirm(`Souhaitez-vous confirmer la suppression du résultat "${titre}"?`)) {
      this.resultatService.deleteResultat(id).subscribe({
        next: () => {
          this.loadResultats(this.objectifID);
          this.snackBar.open('Résultat supprimé avec succès!', 'Fermer', {
            duration: 3000
          });
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du résultat', err);
        }
      });
    }
  }
 //Pour utiliser la modification je dois modifier le fichier add result avant de l'utiliser
  openUpdate(data: any) {
    const dialogRef = this.dialog.open(AddResultatComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadResultats(this.objectifID!);
        }
      },
    });
  }
  // Determine color class based on avancement value
  getColorClass(avancement: number): string {
    if (avancement <= 25) {
      return 'red';
    } else if (avancement <= 50) {
      return 'orange';
    } else if (avancement <= 75) {
      return 'light-green';
    } else {
      return 'dark-green';
    }
  }
}