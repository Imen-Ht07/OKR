import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamService } from 'src/app/services/team.service';
import { AddEditTeamComponent } from '../add-edit-team/add-edit-team.component';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent  implements OnInit {

displayedColumns: string[] = ['name', 'manager', 'employees', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private teamService: TeamService,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadTeams();

  }
  loadTeams(): void {
    this.teamService.getTeams().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des teams', err);
      }
    });
  }

  openAddTeamDialog(): void {
    const dialogRef = this.dialog.open(AddEditTeamComponent);
     dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadTeams();
        }
      },
    });
  }
  getTeamByID(id: string): void {
    this.teamService.getTeamById(id).subscribe({
      next: (team) => {
        if (team) {
          this.openUpdateTeamDialog(team);
        } else {
          console.error('Aucun team trouvé avec cet ID');
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'team à modifier', err);
      },
    });
  }
  openUpdateTeamDialog(team: any): void {
    const dialogRef = this.dialog.open(AddEditTeamComponent, {
      data: team,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadTeams();
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
  deleteteam(id: string,name:string): void {
    if (confirm(`Souhaitez-vous confirmer la suppression de l'equipe "${name}"?`)) {
    this.teamService.deleteTeam(id).subscribe({
      next: () => {
        this.loadTeams();
        this.snackBar.open('team supprimé avec succès!', 'Fermer', {
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l\'team', err);
      }
    });
  }}
  isADmin(): boolean {
    return this.userService.isAdmin();
  }
}
