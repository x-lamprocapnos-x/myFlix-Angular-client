/** 
 * This component provides a form for user login. It handles user input,
 * sends login data to the backend, and handles successful or failed logins.
 */
import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.css'
})
export class UserLoginFormComponent implements OnInit {
  /**
   * Object to store the user's login, including the username and password.
   * Initialized with empty strings.
   */
  @Input() userData = { Username: '', Password: '' }

  /**
   * Constructor for UserLoginFormComponent
   * @param fetchApiData - The service to make API calls.
   * @param dialogRef - Reference to the dialog, allowing it to be closed upon success.
   * @param snackBar - The Angular Material service used to display alerts/snakc bars.
   * @param router - The Angular Router for navigation.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  /** Angular lifecycle hook that gets called after the component's view has been fully initialized. */
  ngOnInit(): void {

  }

  /**
  * Logs in the user by sending the form inputs to the backend via the API.
  * On success, the modal is closed, the user is notified, and the user is navigated to the movie list.
  * On failure, an error message is displayed.
  */
  loginUser(): void {
    console.log(this.userData);
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      this.dialogRef.close();

      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);

      this.snackBar.open('Login Successful', 'Ok', {
        duration: 2000
      });

      this.router.navigate(['movies']);
    }, (error) => {
      console.error(error);

      this.snackBar.open(error.error, 'Login Failed', {
        duration: 2000
      });
    });
  }

}
