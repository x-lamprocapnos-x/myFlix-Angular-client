/**
 * This component is responsible for displaying movie cards
 * and handling interactions like adding/removing favorites.
 */
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent implements OnInit {
  /** Array to hold the movie data. */
  movies: any[] = [];

  /** Template reference for the dialog to display movie details. */
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  /**
   * Constructor for the MovieCardComponent.
   * @param fetchApiData - The service to fetch API data.
   * @param router - The Angular Router to handle navigation.
   * @param dialog - The Angular Material Dialog service to open dialogs.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog
  ) { }

  /** Lifecycle hook that runs when the component is initialized. */
  ngOnInit(): void {
    this.getMovies();
  }

  /** Fetches all movies from the API and checks if they are marked as favorites.*/
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((result: any) => {
      this.movies = result;

      let user = JSON.parse(localStorage.getItem("user") || "null");

      if (!user || !user.FavoriteMovies) {
        console.warn('User or FavoriteMovies not found');
        return;
      }

      this.movies.forEach((movie: any) => {
        movie.isFavorite = user.FavoriteMovies.includes(movie._id)
      })
      return this.movies;
    }, error => {
      console.error(error)
    })
  }

  /** Logs out user, clears local storage, and navigates to the welcome page. */
  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
  }

  /**
   * Opens dialog with additional movie details based on the type (genre, director, or description).
   * @param movie - The movie to display details for.
   * @param type - The type of information to display ('genre', 'director', or 'description').
   */
  openMoviesDialog(movie: any, type: string): void {
    let title = '';
    let content = '';

    switch (type) {
      case 'genre':
        title = `Genre: ${movie.Genre.Name}`;
        content = movie.Genre.Description;
        console.log('Genre:', movie.Genre.Name);
        break;

      case 'director':
        title = `Director: ${movie.Director.Name}`;
        content = movie.Director.map((dir:any) => dir.Bio).join(', ');
        console.log('Director:', movie.Director.Name);
        break;

      case 'synopsis':
        title = `Synopsis of ${movie.Title}`;
        content = movie.Description;
        console.log('Synopsis:', movie.Description);
        break;

      default:
        console.warn('Unknown dialog type:', type);
        return;
    }

    this.dialog.open(this.dialogTemplate, {
      width: '600px',
      data: { title, content, type }
    });
  }

  /** Redirects the user to their profile page. */
  redirectProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Toggles the favorite status of a movie for the logged-in user.
   * @param movie - The movie to toggle as favorite.
   */
  toggleFavorite(movie: any): void {
    const user = JSON.parse(localStorage.getItem('user') || '');
    const isFavorite = user.FavoriteMovies.includes(movie._id);

    if (isFavorite) {
      this.fetchApiData.deleteFavoriteMovie(user.Username, movie._id).subscribe(
        (result: any) => {
          // update local storage and ui
          user.FavoriteMovies = result.FavoriteMovies;
          localStorage.setItem('user', JSON.stringify(user));
          movie.isFavorite = false;
        }, (error: any) => {
          console.error('Error removing favorite movie:', error);
        });
    } else {
      this.fetchApiData.addFavoriteMovie(user.Username, movie._id).subscribe(
        (result: any) => {
          // update local storage and ui
          user.FavoriteMovies = result.FavoriteMovies;
          localStorage.setItem('user', JSON.stringify(user));
          movie.isFavorite = true;
        }, (error: any) => {
          console.error('Error adding favorite movie:', error);
        });
    }
  }
}
