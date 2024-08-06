import { Component, OnInit } from '@angular/core';
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
      return this.movies;
    }, error => {
      console.error(error)
    })
  }

  openMoviesDialog(): void {
    this.dialog.open(MovieCardComponent, {
      width: '600px'
    });
  }

}
