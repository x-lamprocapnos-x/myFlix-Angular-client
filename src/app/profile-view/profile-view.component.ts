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
  userDetails: any = {};
  FavoriteMovies: any[] = [];

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog
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
        this.FavoriteMovies = result.filter((movie: any) => {
          return this.userDetails.FavoriteMovies.includes(movie._id)
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
          Password: this.userDetails.Password, // Keep existing data from local storage
          Email: this.userDetails.Email,
          Birthday: this.userDetails.Birthday,
          token: this.userDetails.token,
          FavoriteMovies: result.FavoriteMovies || [] // Ensure FavoriteMovies is not null
        };
        localStorage.setItem('user', JSON.stringify(this.userDetails));
        this.getFavoriteMovies();
      }, (error: any) => {
        console.error(error);
      });
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

  deleteFavoriteMovie(movie: any): void {
    this.fetchApiData.deleteFavoriteMovie(this.userDetails.id, movie._id).subscribe(
      (result: any) => {
        this.userDetails.FavoriteMovies = result.FavoriteMovies || [];
        this.getFavoriteMovies();
      }, (error: any) => {
        console.error(error)
      });
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
  }

}
