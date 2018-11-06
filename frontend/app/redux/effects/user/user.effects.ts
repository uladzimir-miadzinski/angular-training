import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {
  UsersActions,
  LOAD_USERS,
  LoadUsersSuccess,
  LoadUsersFail,
  LoadUsers,
  LOAD_CURRENT_USER,
  LoadCurrentUserSuccess,
  LoadCurrentUserFail,
  LOGIN_USER,
  LoginUser,
  LoginUserSuccess,
  LoginUserFail,
  LogoutUserSuccess,
  LogoutUserFail,
  LOGOUT_USER,
  LoadCurrentUser,
  UPDATE_CURRENT_USER,
  UpdateCurrentUser,
  UpdateCurrentUserSuccess,
  UpdateCurrentUserFail,
  CREATE_USER,
  CreateUser,
  CreateUserSuccess,
  CreateUserFail,
  UPDATE_USER,
  UpdateUserSuccess,
  UpdateUserFail,
  DELETE_USER,
  DeleteUser,
  DeleteUserSuccess,
  DeleteUserFail, ASSIGN_USER_PASSWORD, AssignUserPassword, AssignUserPasswordSuccess, AssignUserPasswordFail,
} from '../../actions/user/user.actions';
import { catchError, map, mapTo, mergeMap, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
import { User, UserCredentials } from '../../../user-list/user-service.interface';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { STATUS } from '../../../login/login.component';
import { DialogUserSavedComponent } from '../../../dialogs/dialog-user-saved/dialog-user-saved.component';
import { MatDialog } from '@angular/material';
import { DialogPasswordAssignComponent } from '../../../dialogs/dialog-password-assign/dialog-password-assign.component';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {
  }

  @Effect()
  loadUsers$: Observable<UsersActions> = this.actions$.pipe(
    ofType(LOAD_USERS),
    switchMap(() => {
      return this.userService.getUsers()
        .pipe(
          map((users: User[]) => {
            return new LoadUsersSuccess(users);
          }),
          catchError((error: string) => of(new LoadUsersFail(error)))
        );
    })
  );

  @Effect()
  loadCurrentUser$: Observable<UsersActions> = this.actions$.pipe(
    ofType(LOAD_CURRENT_USER),
    switchMap(() => {
      return this.userService.getCurrentUser()
        .pipe(
          map((user: User) => {
            return new LoadCurrentUserSuccess(user);
          }),
          catchError((error: string) => of(new LoadCurrentUserFail(error)))
        );
    })
  );

  @Effect()
  createUser$: Observable<UsersActions> = this.actions$.pipe(
    ofType(CREATE_USER),
    mergeMap((action: CreateUser) => {
      return this.userService.createUser(action.payload as User)
        .pipe(
          map((user: User) => {
            return new CreateUserSuccess(user);
          }),
          tap(() => {
            this.dialogSuccess();
          }),
          mapTo(new LoadUsers()),
          catchError((error: string) => {
            this.dialogError();
            return of(new CreateUserFail(error));
          })
        );
    })
  );

  @Effect()
  updateCurrentUser$: Observable<UsersActions> = this.actions$.pipe(
    ofType(UPDATE_CURRENT_USER),
    mergeMap((action: UpdateCurrentUser) => {
      return this.userService.updateCurrentUser(action.payload as User)
        .pipe(
          map((user: User) => {
            return new UpdateCurrentUserSuccess(user);
          }),
          tap(() => {
            this.dialogSuccess();
          }),
          switchMap(() => [
            new LoadCurrentUser(),
            new LoadUsers()
          ]),
          catchError((error: string) => {
            this.dialogError();
            return of(new UpdateCurrentUserFail(error));
          })
        );
    })
  );

  @Effect()
  updateUser$: Observable<UsersActions> = this.actions$.pipe(
    ofType(UPDATE_USER),
    mergeMap((action: UpdateCurrentUser) => {
      return this.userService.updateUser(action.payload as User)
        .pipe(
          map((user: User) => {
            return new UpdateUserSuccess(user);
          }),
          tap(() => {
            this.dialogSuccess();
          }),
          switchMap(() => [
            new LoadCurrentUser(),
            new LoadUsers()
          ]),
          catchError((error: string) => {
            this.dialogError();
            return of(new UpdateUserFail(error));
          })
        );
    })
  );

  @Effect()
  assignUserPassword$: Observable<UsersActions> = this.actions$.pipe(
    ofType(ASSIGN_USER_PASSWORD),
    mergeMap((action: AssignUserPassword) => {
      const {name, password} = action.payload as UserCredentials;
      return this.authService.assignNewPassword(name, password)
        .pipe(
          map(() => {
            return new AssignUserPasswordSuccess();
          }),
          tap(() => {
            this.dialogAssignPasswordSuccess();
          }),
          catchError((error: string) => {
            this.dialogAssignPasswordFail(error);
            return of(new AssignUserPasswordFail(error));
          })
        );
    })
  );

  @Effect()
  deleteUser$: Observable<UsersActions> = this.actions$.pipe(
    ofType(DELETE_USER),
    mergeMap((action: DeleteUser) => {
      return this.userService.deleteUser(action.payload as number)
        .pipe(
          map((user: User) => {
            return new DeleteUserSuccess(user);
          }),
          tap(() => {
            this.dialogSuccess();
          }),
          switchMap(() => [
            new LoadCurrentUser(),
            new LoadUsers()
          ]),
          catchError((error: string) => {
            this.dialogError();
            return of(new DeleteUserFail(error));
          })
        );
    })
  );

  @Effect()
  loginUser$: Observable<UsersActions> = this.actions$.pipe(
    ofType(LOGIN_USER),
    mergeMap((action: LoginUser) => {
      return this.authService.login(action.payload as UserCredentials)
        .pipe(
          map((user: User) => new LoginUserSuccess(user)),
          catchError((error: HttpErrorResponse) => {
            return of(new LoginUserFail(error.status === STATUS.UNAUTHORIZED
              ? STATUS.UNAUTHORIZED
              : error.message));
          })
        );
    })
  );

  @Effect()
  logoutUser$: Observable<UsersActions> = this.actions$.pipe(
    ofType(LOGOUT_USER),
    mergeMap(() => {
      return this.authService.logout()
        .pipe(
          map(() => new LogoutUserSuccess()),
          catchError((error: HttpErrorResponse) => of(new LogoutUserFail(error.message)))
        );
    })
  );

  dialogSuccess() {
    this.dialog.open(DialogUserSavedComponent, {
      data: {
        success: true
      }
    });
  }

  dialogError() {
    this.dialog.open(DialogUserSavedComponent, {
      data: {
        success: false
      }
    });
  }

  dialogAssignPasswordSuccess() {
    const dialogRef = this.dialog.open(DialogPasswordAssignComponent, {
      data: {
        success: true
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['login']);
    });
  }

  dialogAssignPasswordFail(err: string) {
    this.dialog.open(DialogPasswordAssignComponent, {
      data: {
        success: false,
        error: err
      }
    });
  }
}

