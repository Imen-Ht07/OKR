import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObjectifService } from '../../../../services/objectif.service';
import { TeamService } from 'src/app/services/team.service';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'app-obj-add-edit',
  templateUrl: './obj-add-edit.component.html',
  styleUrls: ['./obj-add-edit.component.css'],
})
export class ObjAddEditComponent implements OnInit {
  objectifForm!: FormGroup;
  selectedEquipeID: any = '';
  etat_avancement: string[] = ['Non commencé', 'En cours', 'Terminé'];
  teams: Team[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private objectifService: ObjectifService,
    private teamService: TeamService,
    private dialogRef: MatDialogRef<ObjAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadTeams();
  }

  private initializeForm(): void {
    this.objectifForm = this.formBuilder.group({
      description: [this.data?.description || '', Validators.required],
      date_limite: [this.data?.date_limite || '', [Validators.required, this.validateDateLimite]],
      etat_avancement: [this.data?.etat_avancement || 'Non commencé'],
      equipeId: [this.data?.equipeId || ''],
    });
    this.selectedEquipeID = this.data?.equipeId || '';
  }

  // Fonction de validation personnalisée pour la date limite
  validateDateLimite(control: any) {
    const selectedDate = new Date(control.value);
    const currentDate =new Date;
    if (selectedDate < currentDate || selectedDate === currentDate) {
      return { dateLimiteInvalide: true }; 
    }
    return null; 
  }

  onFormSubmit(): void {
    if (this.objectifForm.valid && this.selectedEquipeID) {
      const formData = this.objectifForm.value;
      const operation = this.data ?
        this.objectifService.updateObjectif(this.data._id, formData) :
        this.objectifService.addObjectif(this.selectedEquipeID, formData);
      operation.subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: any) => console.error(err),
      });
    }
  }

  loadTeams(): void {
    this.teamService.getTeams().subscribe({
      next: (teams) => this.teams = teams,
      error: (err) => console.error('Erreur de chargement des teams', err)
    });
  }

  onSelectEquipe(equipeId: string): void {
    this.selectedEquipeID = equipeId;
  }

  // Fonction pour actualiser la page
  refresh(): void {
    window.location.reload();
  }
}
