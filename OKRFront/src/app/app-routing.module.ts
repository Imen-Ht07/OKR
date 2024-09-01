import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
// Components
import { ObjectifComponent } from 'src/app/component/Admin/Objectifs/objectif/objectif.component';

import { LoginComponent } from './component/login/login.component';
import { NotfoundComponent } from './component/notfound/notfound.component';
import { EmployeComponent } from './component/Admin/Utilisateur/employe/employe.component';
import { ManagerComponent } from './component/Admin/Utilisateur/manager/manager.component';
import { ProfilComponent } from './component/profil/profil.component';
import { ChangePassComponent } from './component/change-pass/change-pass.component';
import { DashboardComponent } from './component/Admin/dashboard/dashboard.component';
import { ResultatComponent } from './component/Admin/ResultatCle/resultat/resultat.component';
import { CalenderComponent } from './component/Admin/calender/calender.component';
import { TeamComponent } from './component/Admin/Utilisateur/team/team.component';
import { ActionComponent } from './component/Employe/action/action.component';
import { AllResultatComponent } from './component/Admin/ResultatCle/all-resultat/all-resultat.component';
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'notfound', component: NotfoundComponent },
  { path: 'profile/:id', component: ProfilComponent },
  { path: 'changepass/:id', component: ChangePassComponent },
  { path: 'home', component: DashboardComponent},
  // EMPLOYE MANAGER
  { path: 'objectif', component: ObjectifComponent, canActivate: [AuthGuard], data: { roles: ['Manager', 'Employee','Admin'] } },
  { path: 'resultat/:id', component: ResultatComponent, canActivate: [AuthGuard], data: { roles: ['Manager', 'Employee','Admin'] } },
  { path: 'action/:id', component: ActionComponent, canActivate: [AuthGuard], data: { roles: ['Manager', 'Employee','Admin'] }},
  { path: 'allresultat', component: AllResultatComponent, canActivate: [AuthGuard], data: { roles: ['Manager', 'Employee','Admin'] }},
  // Admin
  { path: 'employe', component: EmployeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'manager', component: ManagerComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'team', component: TeamComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'calender', component: CalenderComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },



  { path: '**', redirectTo: 'notfound' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
