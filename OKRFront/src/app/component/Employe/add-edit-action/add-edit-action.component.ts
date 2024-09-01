import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActionService } from '../../../services/action.service';
import { ResultatService } from 'src/app/services/resultat.service';
import { Resultat } from 'src/app/models/resultat';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-edit-action',
  templateUrl: './add-edit-action.component.html',
  styleUrls: ['./add-edit-action.component.css']
})
export class AddEditActionComponent implements OnInit {
  actionForm!: FormGroup;
  resultats: Resultat[] = [];
  selectedResultatID: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private resultatService: ResultatService,
    private actionService: ActionService,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<AddEditActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getAllResultats();
  }

  private initializeForm(): void {
    this.actionForm = this.formBuilder.group({
      title: [this.data?.title || '', Validators.required],
      completed: [this.data?.completed || false],
      resultatId: [this.data?.resultatId || '', Validators.required],
    });
    this.selectedResultatID = this.data?.resultatId || '';
  }

  onFormSubmit(): void {
    if (this.actionForm.valid && typeof this.selectedResultatID === 'string' && this.selectedResultatID) {
      const formData = this.actionForm.value;
      const operation = this.data
        ? this.actionService.updateAction(this.data._id, formData)
        : this.actionService.createAction(formData, this.selectedResultatID); // Inversez les arguments
  
      operation.subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.refresh(); // Vous pouvez remplacer cela par une méthode d'actualisation plus efficace si nécessaire
        },
        error: (err: any) => console.error(err),
      });
    } else {
      alert("Veuillez remplir tous les champs du formulaire correctement.");
    }
  }
  
  getAllResultats(): void {
    this.resultatService.getAll().subscribe(
      (resultats) => {
        this.resultats = resultats;
      },
      (error) => {
        console.error('Erreur lors de la récupération de résultats : ', error);
      }
    );
  }

  onSelectResultat(resultatId: string): void {
    this.selectedResultatID = resultatId;
  }

 // actualiser
 refresh(): void {
  window.location.reload();
}
}