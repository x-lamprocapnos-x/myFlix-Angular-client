/**
* Service to handle all API calls for the movie selector application.
* This service interacts with the backend API to manage user registration,
* login, movies, directors, genres, and user details (including favorite movies).
*/
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

  /**
  * Retrieves the authentication token from local storage.
  * @returns The authentication token or null if not found.
  */
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
  * Registers a new user.
  * @param userDetails - The details of the user to be registered.
  * @returns An Observable with the server response.
  */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Logs in an existing user.
  * @param userDetails - The login credentials (Username and Password).
  * @returns An Observable with the server response, including user and token.
  */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Retrieves all movies from the API.
  * @returns An Observable with a list of all movies.
  */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      }),
    }).pipe(
      catchError(this.handleError));
  }

  /**
  * Retrieves details for a single movie by title.
  * @param title - The title of the movie to retrieve.
  * @returns An Observable with the movie details.
  */
  public getMovie(title: string): Observable<any> {
    return this.http.get(apiUrl + `movies/${title}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Retrieves details about a director.
  * @param directorName - The name of the director.
  * @returns An Observable with the director details.
  */
  public getDirector(directorName: string): Observable<any> {
    return this.http.get(apiUrl + `directors/${directorName}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Retrieves details about a genre.
  * @param genreName - The name of the genre.
  * @returns An Observable with the genre details.
  */
  public getGenre(genreName: string): Observable<any> {
    return this.http.get(apiUrl + `genres/${genreName}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Retrieves details about the logged-in user.
  * @param Username - The username of the user.
  * @returns An Observable with the user details.
  */
  public getUser(Username: string): Observable<any> {
    return this.http.get(apiUrl + `users/${Username}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Retrieves a user's favorite movies.
  * @param Username - The username of the user.
  * @returns An Observable with a list of the user's favorite movies.
  */
  public getFavoriteMovies(Username: string): Observable<any> {
    return this.http.get(apiUrl + `users/${Username}/movies`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Adds a movie to the user's list of favorite movies.
  * @param Username - The username of the user.
  * @param movieID - The ID of the movie to add.
  * @returns An Observable with the updated list of favorite movies.
  */
  public addFavoriteMovie(Username: string, movieID: string): Observable<any> {
    return this.http.post(apiUrl + `users/${Username}/movies/${movieID}`, {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Updates the details of an existing user.
  * @param Username - The username of the user to update.
  * @param userDetails - The new user details.
  * @returns An Observable with the updated user information.
  */
  public editUser(Username: string, userDetails: any): Observable<any> {
    return this.http.put(apiUrl + `users/${Username}`, userDetails, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Deletes the user's account.
  * @param Username - The username of the user to delete.
  * @returns An Observable confirming the account deletion.
  */
  public deleteUser(Username: string): Observable<any> {
    return this.http.delete(apiUrl + `users/${Username}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Removes a movie from the user's list of favorite movies.
  * @param Username - The username of the user.
  * @param movieID - The ID of the movie to remove.
  * @returns An Observable with the updated list of favorite movies.
  */
  public deleteFavoriteMovie(Username: string, movieID: string): Observable<any> {
    return this.http.delete(apiUrl + `users/${Username}/movies/${movieID}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Handles errors that may occur during HTTP requests.
  * @param error - The HTTP error response. 
  * @returns A formatted error message.
  */
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
