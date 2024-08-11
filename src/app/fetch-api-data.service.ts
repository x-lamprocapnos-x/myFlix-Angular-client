import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, map } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from
  '@angular/common/http';

// Declaring the api url that will funnel data for the client app
const apiUrl = 'https://movie-selector.onrender.com/';

@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  constructor(private http: HttpClient) { }

  // User registration
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // User  login
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Get all movies
  public getAllMovies(): Observable<any> {
    return this.http.get(apiUrl + 'movies').pipe(
      catchError(this.handleError)
    );
  }

  // Get one movie
  public getMovie(title: string): Observable<any> {
    return this.http.get(apiUrl + `movies/${title}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get Director
  public getDirector(directorName: string): Observable<any> {
    return this.http.get(apiUrl + `directors/${directorName}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get genre
  public getGenre(genreName: string): Observable<any> {
    return this.http.get(apiUrl + `genres/${genreName}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get user
  public getUser(userName: string): Observable<any> {
    return this.http.get(apiUrl + `users/${userName}`).pipe(
      catchError(this.handleError)
    );
  }
  // Get Favorite Movies
  public getFavoriteMovies(userName: string): Observable<any> {
    return this.http.get(apiUrl + `users/${userName}/movies`).pipe(
      catchError(this.handleError)
    );
  }

  // Add to Favorite Movies
  public addFavoriteMovie(userName: string, movieID: string): Observable<any> {
    return this.http.post(apiUrl + `users/${userName}/movies/${movieID}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Edit User
  public editUser(userName: string, userDetails: any): Observable<any> {
    return this.http.put(apiUrl + `users/${userName}`, userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Delete User
  public deleteUser(userName: string): Observable<any> {
    return this.http.delete(apiUrl + `users/${userName}`).pipe(
      catchError(this.handleError)
    );
  }

  // Remove a movie from favorite movies
  public deleteFavoriteMovie(userName: string, movieID: string): Observable<any> {
    return this.http.delete(apiUrl + `users/${userName}/movies/${movieID}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status},` +
        `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
