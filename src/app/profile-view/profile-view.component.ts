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
    if (storedUser) {
      this.userDetails = JSON.parse(storedUser);
      if (this.userDetails && this.userDetails.username) {
        this.getUser();
      } else {
        console.error('User name is missing, cannot fetch user details.')
        this.router.navigate(['welcome']); // Redirect if user details are invalid
      }
    } else {
      console.error('No user found in localStorage')
      this.router.navigate(['welcome']); // Redirect if no user data is found
    }
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userDetails.username, this.userDetails).subscribe(
      (result: any) => {
        this.userDetails = {
          ...result,
          username: this.userDetails.username,
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
    this.fetchApiData.getUser(this.userDetails.username).subscribe(
      (result: any) => {
        this.userDetails = {
          ...result,
          username: result.username,
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
