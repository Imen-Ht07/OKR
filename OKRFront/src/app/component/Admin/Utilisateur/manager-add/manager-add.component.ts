import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManagerService } from '../../../../services/manager.service';

@Component({
  selector: 'app-manager-add',
  templateUrl: './manager-add.component.html',
  styleUrls: ['./manager-add.component.css']
})
export class ManagerAddComponent implements OnInit {
  managerForm!: FormGroup;
  defaultPhotoUrl: string = 'assets/photo.png';
  selectedPhoto?: File;
  departement: string[] =  ['Développement Produit', 'Commercial et Marketing', 'Support et Service Client','Implémentation et Projets', 
    'Ressources Humaines', 'Finance et Administration','International et Expansion'];
  constructor(
    private formBuilder: FormBuilder,
    private managerService: ManagerService,
    private dialogRef: MatDialogRef<ManagerAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadDefaultPhoto();
  }

  private initializeForm(): void {
    // Custom validator function for telephone number
    const telephoneValidator: ValidatorFn = (control: AbstractControl) => {
      const tel: string = control.value;
      if (!/^\d{8}$/.test(tel)) {
        return { invalidTelephone: true };
      }
      return null;
    };
      //email ends with "@iajt.com"
      const emailValidator: ValidatorFn = (control: AbstractControl) => {
        const email: string = control.value;
        if (!email.endsWith('@iajt.com')) {
          return { invalidEmail: true };
        }
        return null;
      };

    this.managerForm = this.formBuilder.group({
      nom: [this.data?.nom || '', Validators.required],
      prenom: [this.data?.prenom || '', Validators.required],
      cin: [this.data?.cin || '', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      tel: [this.data?.tel || '', [Validators.required, telephoneValidator]], // Apply telephone validator
      email: [this.data?.email || '', [Validators.required, Validators.email, emailValidator]], // Email validation remains the same
      dateEmbauche: [this.data?.dateEmbauche || '', [Validators.required]], // Apply date format validator
      departement: [this.data?.departement || '', Validators.required],
      password: [this.data?.password || '', Validators.required],
      role: [this.data?.role || 'Manager'],
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
    if (this.managerForm.valid && this.selectedPhoto) {
      const managerData = this.managerForm.value;
      const operation = this.managerService.addManager(managerData,this.selectedPhoto);
      operation.subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: any) => console.error(err),
      });
    } else {
      alert("Please ensure the form is filled out correctly.");
    }
  }
}
