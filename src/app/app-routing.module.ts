/**
* This module is responsible for defining and configuring the application's routes.
* It imports Angular's RouterModule and sets up routing for the application.
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
