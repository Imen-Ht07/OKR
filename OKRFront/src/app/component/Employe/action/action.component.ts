import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Resultat } from 'src/app/models/resultat';
import { ActionService } from '../../../services/action.service';
import { Action } from '../../../models/action';
import { AddEditActionComponent } from '../add-edit-action/add-edit-action.component';
import { ResultatService } from 'src/app/services/resultat.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {
  displayedColumns: string[] = ['title', 'completed', 'check','actions'];
  dataSource!: MatTableDataSource<any>;
  resultatId!: string;
  resultats: Resultat[] = [];
  actions: Action[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private ActionService : ActionService,
    private resultatService : ResultatService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private userService: UserService
   
  ) {}
  ngOnInit(): void {
    this.resultatId = this.route.snapshot.paramMap.get('id') || '';
    if (this.resultatId) {
      this.loadActions(this.resultatId);
    } else {
      console.error('resultatId est indéfini');
    }
    this.loadResultats();
  }
  
  isAdmin(): boolean {
    return this.userService.isAdmin();
  }
isEmploye(): boolean {
  return this.userService.isEmploye();
}
  //Resultat
  loadResultats(): void {
    this.resultatService.getAll().subscribe(
      (resultats) => {
        this.resultats = resultats;
      },
      (error) => {
        console.error('Erreur lors de la récupération de resultat : ', error);
      }
    );
  }

  loadActions(resultatId:string): void {
    this.ActionService.getActions(this.resultatId).subscribe({
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

  openAddActionDialog(): void {
    const dialogRef = this.dialog.open(AddEditActionComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadActions(this.resultatId!);
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

  deleteAction(id: string, title: string): void {
    if (confirm(`Souhaitez-vous confirmer la suppression du résultat "${title}"?`)) {
      this.ActionService.deleteAction(id).subscribe({
        next: () => {
          this.loadActions(this.resultatId);
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
    const dialogRef = this.dialog.open(AddEditActionComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadActions(this.resultatId);
        }
      },
    });
  }
  toggleCompletion(action: Action): void {
    this.ActionService.Complete(action).subscribe(updatedAction => {
      // Mettre à jour l'action dans la liste affichée
      const index = this.dataSource.data.findIndex(a => a._id === updatedAction._id);
      if (index !== -1) {
        this.dataSource.data[index] = updatedAction;
        this.dataSource = new MatTableDataSource<Action>(this.dataSource.data); 
        this.dataSource.paginator = this.paginator; 
      }
    });
  }
}
