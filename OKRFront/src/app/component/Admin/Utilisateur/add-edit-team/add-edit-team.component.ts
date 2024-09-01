import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeamService } from 'src/app/services/team.service';
import { ManagerService } from '../../../../services/manager.service';
import { EmployeService } from '../../../../services/employe.service';
import { Manager } from '../../../../models/manager';
import { Employe } from '../../../../models/employe';

@Component({
  selector: 'app-add-edit-team',
  templateUrl: './add-edit-team.component.html',
  styleUrls: ['./add-edit-team.component.css']
})
export class AddEditTeamComponent implements OnInit {
  teamForm!: FormGroup;
  managers: Manager[] = [];
  employees: Employe[] = [];
  selectedManagerID : any = ''; 
  selectedEmployeeIDs: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    private managerService: ManagerService,
    private employeService: EmployeService,
    private dialogRef: MatDialogRef<AddEditTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.loadManagers();
    this.loadEmployees();
    this.initializeForm();
  }

  onSelectManager(managerId: string): void {
    this.selectedManagerID = managerId;
  }

  onSelectEmployee(employeeIds: string): void {
    const index = this.selectedEmployeeIDs.indexOf(employeeIds);
    if (index !== -1) {
      this.selectedEmployeeIDs.splice(index, 1);
    } else {
      this.selectedEmployeeIDs.push(employeeIds);
    }
  }

  loadEmployees(): void {
    this.employeService.getAllEmployes().subscribe({
      next: (employees) => this.employees = employees,
      error: (err) => console.error('Erreur de chargement des employés', err)
    });
  }

  loadManagers(): void {
    this.managerService.getAllManagers().subscribe({
      next: (managers) => this.managers = managers,
      error: (err) => console.error('Erreur de chargement des managers', err)
    });
  }

  private initializeForm(): void {
    this.teamForm = this.formBuilder.group({
      name: [this.data?.name || '', Validators.required],
      managerId: [this.data?.managerId|| '', Validators.required],
      employeeIds: [this.data?.employeeIds || '', Validators.required]
    });
    this.selectedManagerID = this.data?.managerId || '';
    this.selectedEmployeeIDs = this.data?.employeeIds || '';
  }

  onFormSubmit(): void {
    if (this.teamForm.valid) {
      const formData = this.teamForm.value;
      const operation = this.data 
        ? this.teamService.updateTeam(this.data._id, this.selectedManagerID,this.selectedEmployeeIDs, formData)
        : this.teamService.addTeam(formData);

      operation.subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.refresh();
        },
        error: (err) => console.error('Erreur lors de l\'enregistrement de l\'équipe', err),
      });
    }
  }

  // Actualiser la page
  refresh(): void {
    window.location.reload();
  }
}
