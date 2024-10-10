/**
 * This component serves as the default page without authorization for the application.
 * The welcome-page component provides options for registration and login,
 * by openeing respective dialog components.
 */
import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css'
})
export class WelcomePageComponent implements OnInit {

  /** 
   * Constructor for WelcomePageComponent.
   * @param dialog - Angular Material's service to handle opening dialogs.
   */
  constructor(public dialog: MatDialog) { }

  /** Angular lifecycle hook that is called after the component's view has been fully initialized. */
  ngOnInit(): void {
  }

  /**
  * Opens the user registration dialog when the signup button is clicked.
  * Uses the UserRegistrationFormComponent in the dialog.
  * Adds a custom panel class for styling.
  */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      panelClass: 'dialogContainer'
    });
  }

  /**
  * Opens the user login dialog when the login button is clicked.
  * Uses the UserLoginFormComponent in the dialog.
  * Adds a custom panel class for styling.
  */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      panelClass: 'dialogContainer'
    })
  }

}


