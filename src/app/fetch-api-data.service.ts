import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Declaring the api url that will funnel data for the client app
const apiUrl = 'https://movie-selector.onrender.com/';

@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  constructor(private http: HttpClient) { }

  // get token
  private getToken(): string {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).token : '';
  }

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

  // Get all movies with token attached for access
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      }),
    }).pipe(
      catchError(this.handleError));
  }

  // Get one movie with token attached for access
  public getMovie(title: string): Observable<any> {
    return this.http.get(apiUrl + `movies/${title}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get Director with token attached for access
  public getDirector(directorName: string): Observable<any> {
    return this.http.get(apiUrl + `directors/${directorName}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get genre with token attached for access
  public getGenre(genreName: string): Observable<any> {
    return this.http.get(apiUrl + `genres/${genreName}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get user with token attached for access
  public getUser(userName: string): Observable<any> {
    return this.http.get(apiUrl + `users/${userName}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }
  // Get Favorite Movies with token attached for access
  public getFavoriteMovies(userName: string): Observable<any> {
    return this.http.get(apiUrl + `users/${userName}/movies`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Add to Favorite Movies with token attached for access
  public addFavoriteMovie(userName: string, movieID: string): Observable<any> {
    return this.http.post(apiUrl + `users/${userName}/movies/${movieID}`, {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Edit User with token attached for access
  public editUser(userName: string, userDetails: any): Observable<any> {
    return this.http.put(apiUrl + `users/${userName}`, userDetails, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete User with token attached for access
  public deleteUser(userName: string): Observable<any> {
    return this.http.delete(apiUrl + `users/${userName}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Remove a movie from favorite movies with token attached for access
  public deleteFavoriteMovie(userName: string, movieID: string): Observable<any> {
    return this.http.delete(apiUrl + `users/${userName}/movies/${movieID}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status},` +
        `Error body is: ${JSON.stringify(error.error)}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
