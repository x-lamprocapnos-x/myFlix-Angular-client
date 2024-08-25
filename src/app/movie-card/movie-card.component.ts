import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {
  movies: any[] = [];

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((result: any) => {
      this.movies = result;
      console.log(this.movies);

      let user = JSON.parse(localStorage.getItem("user") || "");
      this.movies.forEach((movie: any) => {
        movie.isFavorite = user.favoriteMovies.includes(movie._id)
      })
    }, error => {
      console.error(error)
    })
  }

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

  redirectProfile(): void {
    this.router.navigate(['profile']);
  }


  toggleFavorite(movie: any): void {
    const user = JSON.parse(localStorage.getItem('user') || '');
    const isFavorite = user.favoriteMovies.includes(movie._id);

    if (isFavorite) {
      this.fetchApiData.deleteFavoriteMovie(user.userName, movie._id).subscribe(
        (result: any) => {
          // update local storage and ui
          user.favoriteMovies = result.favoriteMovies;
          localStorage.setItem('user', JSON.stringify(user));
          movie.isFavorite = false;
        }, (error: any) => {
          console.error('Error removing favorite movie:', error);
        });
    } else {
      this.fetchApiData.addFavoriteMovie(user.userName, movie._id).subscribe(
        (result: any) => {
          // update local storage and ui
          user.favoriteMovies = result.favoriteMovies;
          localStorage.setItem('user', JSON.stringify(user));
          movie.isFavorite = true;
        }, (error: any) => {
          console.error('Error adding favorite movie:', error);
        });
    }
  }
}
