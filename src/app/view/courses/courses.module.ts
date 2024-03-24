import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'ngx-bootstrap/rating';
import { SharedModule } from "../../shared/shared.module";
import { DropdownModule } from 'primeng/dropdown';
import { HomeModule } from '../home/home.module';
@NgModule({
  declarations: [
    CoursesComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HomeModule,
    DropdownModule
  ]
})
export class CoursesModule { }
