import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms'; // Import Validators and ValidatorFn
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeService } from '../../../../services/employe.service';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employe-add.component.html',
  styleUrls: ['./employe-add.component.css'],
})
export class EmployeAddComponent implements OnInit {
  employeeForm!: FormGroup;
  defaultPhotoUrl: string = 'assets/photo.png';
  selectedPhoto?: File;
  departement: string[] =  ['Développement Produit', 'Commercial et Marketing', 'Support et Service Client','Implémentation et Projets', 
    'Ressources Humaines', 'Finance et Administration','International et Expansion'];
  constructor(
    private formBuilder: FormBuilder,
    private employeService: EmployeService,
    private dialogRef: MatDialogRef<EmployeAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadDefaultPhoto();
  }

  private initializeForm(): void {
    //email ends with "@iajt.com"
    const emailValidator: ValidatorFn = (control: AbstractControl) => {
      const email: string = control.value;
      if (!email.endsWith('@iajt.com')) {
        return { invalidEmail: true };
      }
      return null;
    };

    this.employeeForm = this.formBuilder.group({
      nom: [this.data?.nom || '', Validators.required],
      prenom: [this.data?.prenom || '', Validators.required],
      cin: [this.data?.cin || '',[Validators.required, Validators.pattern('^[0-9]{8}$')]],
      tel: [this.data?.tel || '', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email: [this.data?.email || '', [Validators.required, Validators.email, emailValidator]],
      dateEmbauche: [this.data?.dateEmbauche || '', Validators.required],
      departement: [this.data?.departement || '', Validators.required],
      password: [this.data?.password || '', Validators.required],
      role: [this.data?.role || 'Employe'],
    });
  }

  private loadDefaultPhoto(): void {
    fetch(this.defaultPhotoUrl).then(res => res.blob()).then(blob => {
      this.selectedPhoto = new File([blob], "photo.png", { type: 'image/png' });
    });
  }

  onPhotoSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedPhoto = event.target.files[0];
    }
  }

  onFormSubmit(): void {
    if (this.employeeForm.valid && this.selectedPhoto) {
      const employeData = this.employeeForm.value;
      const operation = this.employeService.addEmploye(employeData, this.selectedPhoto);
      operation.subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: any) => console.error(err),
      });
    } else {
      alert("Please ensure the form is filled out correctly.");
    }
  }
}
