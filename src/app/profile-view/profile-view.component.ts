/**
 * This component is responsible for displaying the user's profile,
 * including favorite movies and user details. It also allows the user
 * to update their information and interact with favorite movies.
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css'
})
export class ProfileViewComponent implements OnInit {

  /** Stores user details fetched from the API or local storage. */
  userDetails: any = {};

  /** Stores the list of user's favorite movies. */
  FavoriteMovies: any[] = [];

  /** Template reference for the dialog to display movie details. */
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  /**
 * Constructor for the ProfileViewComponent.
 * @param fetchApiData The service to fetch data from the API.
 * @param router The Angular Router to handle navigation.
 * @param dialog The Angular Material Dialog service to open dialogs.
 */
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog
  ) { }

  /** Lifecycle hook that runs when the component is initialized. */
  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    console.log('Stored user data:', storedUser);

    if (storedUser) {
      try {
        this.userDetails = JSON.parse(storedUser);

        if (this.userDetails && this.userDetails.Username) {
          this.getUser();
        } else {
          console.error('User name is missing, cannot fetch user details.')
          this.router.navigate(['welcome']);
        }
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        this.router.navigate(['welcome']);
      }
    }
  }

  /** Updates the user information in the API and local storage. */
  updateUser(): void {
    this.fetchApiData.editUser(this.userDetails.Username, this.userDetails).subscribe(
      (result: any) => {
        this.userDetails = {
          ...result,
          Username: this.userDetails.Username,
          Password: this.userDetails.Password,
          Email: this.userDetails.Email,
          Birthday: this.userDetails.Birthday,
          token: this.userDetails.token
        };
        localStorage.setItem('user', JSON.stringify(this.userDetails));
        this.getFavoriteMovies();
      }, (error: any) => {
        console.error(error)
      })
  }

  /** Resets the user information by reloading data from local storage. */
  resetUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userDetails = JSON.parse(storedUser);
    }
  }


  /** Redirects the user back to the movies list. */
  returnToMovies(): void {
    this.router.navigate(['movies']);
  }

  /** Fetches the user's favorite movies from the API. */
  getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (result: any) => {
        this.FavoriteMovies = result.filter((movie: any) => {
          return this.userDetails.FavoriteMovies.includes(movie._id)
        });
      }, (error: any) => {
        console.error(error)
      });
  }

  /** Fetches the user details from the API. */
  getUser(): void {
    this.fetchApiData.getUser(this.userDetails.Username).subscribe(
      (result: any) => {
        this.userDetails = {
          ...result,
          Username: result.Username,
          Password: this.userDetails.Password,
          Email: this.userDetails.Email,
          Birthday: this.userDetails.Birthday,
          token: this.userDetails.token,
          FavoriteMovies: result.FavoriteMovies || []
        };
        localStorage.setItem('user', JSON.stringify(this.userDetails));
        this.getFavoriteMovies();
      }, (error: any) => {
        console.error(error);
      });
  }

  /**
  * Opens a dialog to display additional details about a movie (genre, director, description).
  * @param movie The movie to display details for.
  * @param type The type of information to display ('genre', 'director', or 'description').
  */
  openMoviesDialog(movie: any, type: string): void {
    console.log('Genre', movie.Genre.Name);
    const data = {
      title: movie.Title,
      type: type,
      content: type === 'genre' ? movie.Genre.Name
        : type === 'director' ? movie.Director.map((director: any) => director.Name).join(', ')
          : movie.Description
    };
    console.log('Opening dialog with data:', data);
    this.dialog.open(this.dialogTemplate, {
      width: '600px',
      data: data
    });
  }

  /**
  * Removes a movie from the user's list of favorite movies.
  * @param movie The movie to remove from favorites.
  */
  deleteFavoriteMovie(movie: any): void {
    console.log('Deleting favorite for user:', this.userDetails.Username, 'Movie ID:', movie._id);

    this.fetchApiData.deleteFavoriteMovie(this.userDetails.Username, movie._id).subscribe(
      (result: any) => {
        this.userDetails.FavoriteMovies = result.FavoriteMovies || [];
        localStorage.setItem('user', JSON.stringify(this.userDetails));
        this.getFavoriteMovies();
      }, (error: any) => {
        console.error(error)
      });
  }
  /** Logs the user out, clears local storage, and redirects to the welcome page. */
  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
  }

}
