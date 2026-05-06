import { HttpInterceptorFn, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, filter, take, switchMap, throwError, BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

/**
 * Intercepteur HTTP pour JWT basé sur les fonctions
 * Ajoute le token à chaque requête et gère le rafraîchissement automatique
 */
export const jwtHttpInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  // Ajouter le token à la requête
  const token = tokenService.getAccessToken();
  if (token && !tokenService.isTokenExpired(token)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(req, next, authService, tokenService) as Observable<HttpEvent<unknown>>;
      }
      return throwError(() => error);
    })
  );
};

/**
 * Gérer l'erreur 401 (token expiré)
 */
function handle401Error(
  request: any,
  next: any,
  authService: AuthService,
  tokenService: TokenService
): any {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshAccessToken().pipe(
      switchMap((response) => {
        isRefreshing = false;

        if (response.success && response.tokens) {
          const newToken = response.tokens.accessToken;
          refreshTokenSubject.next(newToken);

          const clonedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`,
            },
          });

          return next(clonedRequest);
        } else {
          authService.logout();
          return throwError(() => new Error('Token refresh failed'));
        }
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    // Attendre que le token soit rafraîchi
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        if (!token) {
          return throwError(() => new Error('Token refresh failed'));
        }

        const clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        return next(clonedRequest);
      })
    );
  }
}
