import { Component, OnInit, Input } from '@angular/core';
// this brings in the api calls
import { FetchApiDataService } from '../fetch-api-data.service';
// this is the display notifications "alerts"
import { MatSnackBar } from '@angular/material/snack-bar';
// this is used to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss'
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  // Responsible for sending the form inputs to the backend
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
      // Logic for a successful user registation goes here ( coming soon )
      this.dialogRef.close(); // This will close the modal on success
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
