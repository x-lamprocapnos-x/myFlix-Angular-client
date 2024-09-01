import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css'
})
export class ProfileViewComponent implements OnInit {
  userDetails: any = {};
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router
  ) { }



  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    console.log('Stored user data:', storedUser);

    if (storedUser) {
      try {
        this.userDetails = JSON.parse(storedUser);

        if (this.userDetails && this.userDetails.Username) {
          this.getUser(); // Fetch user details
        } else {
          console.error('User name is missing, cannot fetch user details.')
          this.router.navigate(['welcome']); // Redirect if user details are invalid
        }
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        this.router.navigate(['welcome']); // Redirect if parsing fails
      }
    }
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userDetails.Username, this.userDetails).subscribe(
      (result: any) => {
        this.userDetails = {
          ...result,
          Username: this.userDetails.Username,
          password: this.userDetails.password,
          token: this.userDetails.token
        };
        localStorage.setItem('user', JSON.stringify(this.userDetails));
        this.getFavoriteMovies();
      }, (error: any) => {
        console.error(error)
      })
  }

  resetUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userDetails = JSON.parse(storedUser);
    }
  }

  returnToMovies(): void {
    this.router.navigate(['movies']);
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (result: any) => {
        this.favoriteMovies = result.filter((movie: any) => {
          return this.userDetails.favoriteMovies.includes(movie._id)
        });
      }, (error: any) => {
        console.error(error)
      });
  }

  getUser(): void {
    this.fetchApiData.getUser(this.userDetails.Username).subscribe(
      (result: any) => {
        this.userDetails = {
          ...result,
          Username: result.Username,
          password: this.userDetails.password,
          token: this.userDetails.token
        };
        localStorage.setItem('user', JSON.stringify(this.userDetails));
        this.getFavoriteMovies();
      }, (error: any) => {
        console.error(error);
      });
  }

  removeFavoriteMovie(movie: any): void {
    this.fetchApiData.deleteFavoriteMovie(this.userDetails.id, movie._id).subscribe(
      (result: any) => {
        this.userDetails.favoriteMovies = result.favoriteMovies;
        this.getFavoriteMovies();
      }, (error: any) => {
        console.error(error)
      });
  }
}
