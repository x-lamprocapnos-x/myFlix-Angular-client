/**
 * This component provides a form for user registration. It handles input,
 * sends registration data to the backend, 
 * and handles successful or failed registeration attempts.
 */
import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss'
})
export class UserRegistrationFormComponent implements OnInit {
  /**
   * Object to capture the user's registraion details, 
   * including the username, password, email, and birthday.
   * Initialized with empty strings.
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * Constructor for UserRegistrationFormComponent.
   * @param fetchApiData - The service used to make API calls for user registration. 
   * @param dialogRef - Reference to the dialog, allowing it to be closed upon successful registration.
   * @param snackBar - Angular's Material service to display alerts/snack bars for user notifications.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

  /** Angular lifecycle hood that is called after component's view has been fully initialized. */
  ngOnInit(): void {
  }

  /**
   * Registers the user by sending the data entered into the form to the backend via the API.
   * On success, the modal closes, and a success message is displayed.
   * On failure, an error message is displayed.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
      this.dialogRef.close();
      console.log(result);
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    }, (result) => {
      console.log(result);
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }

}
