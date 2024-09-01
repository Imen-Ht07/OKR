import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResultatService } from '../../../../services/resultat.service';
import { ObjectifService } from 'src/app/services/objectif.service';
import { Objectif } from '../../../../models/objectif';
import { rangeValidator } from '../../../../range.validator';

@Component({
  selector: 'app-add-resultat',
  templateUrl: './add-resultat.component.html',
  styleUrls: ['./add-resultat.component.css']
})
export class AddResultatComponent implements OnInit {
  resultatForm!: FormGroup;
  objectifs: Objectif[] = [];
  selectedObjectifID: any = '';
  etat_avancement: string[] = ['Non commencé', 'En cours', 'Terminé'];

  constructor(
    private formBuilder: FormBuilder,
    private resultatService: ResultatService,
    private objectifService: ObjectifService,
    private dialogRef: MatDialogRef<AddResultatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAllObjectifs();
  }

  private initializeForm(): void {
    this.resultatForm = this.formBuilder.group({
      titre: [this.data?.titre || '', Validators.required],
      description: [this.data?.description || '', Validators.required],
      avancement: [this.data?.avancement || 0],
      etat_avancement: this.data?.etat_avancement || 'Non commencé',
      objectifID: [this.data?.objectifID || '', Validators.required],
    });
    this.selectedObjectifID = this.data?.objectifID || '';
  }

  onFormSubmit(): void {
    if (this.resultatForm.valid && this.selectedObjectifID) {
      const formData = this.resultatForm.value;
      const operation = this.data 
        ? this.resultatService.updateResultat(this.data._id, formData) 
        : this.resultatService.createResultat(this.selectedObjectifID, formData);
      operation.subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: any) => console.error(err),
      });
    } else {
      alert("Veuillez remplir tous les champs du formulaire correctement.");
    }
  }

  // OBJECTIF
  getAllObjectifs(): void {
    this.objectifService.getAllObjectifs().subscribe(
      (objectifs) => {
        this.objectifs = objectifs;
      },
      (error) => {
        console.error('Erreur lors de la récupération des objectifs : ', error);
      }
    );
  }

  onSelectObjectif(objectifID: string): void {
    this.selectedObjectifID = objectifID;
  }

  // actualiser
  refresh(): void {
    window.location.reload();
  }
}
