import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'; // this is used to close the dialog on success
import { FetchApiDataService } from '../fetch-api-data.service';// this imports the api
import { MatSnackBar } from '@angular/material/snack-bar'; // this is used to 'alert' the user
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.css'
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' }

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  // Function responsible for sending the form inputs to the backend
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      this.dialogRef.close(); // This will close the modal on success
      console.log(result);

      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);

      this.snackBar.open('Login Successful', 'OK', {
        duration: 2000
      });

      this.router.navigate(['movies']);
    }, (error) => {
      console.error(error);
      this.snackBar.open(error.error.message, 'OK', {
        duration: 2000
      });
    });
  }

}
