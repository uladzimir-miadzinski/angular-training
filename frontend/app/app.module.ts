import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, AppRoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule, MatSelectModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import { UserInfoComponent } from './user-info/user-info.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserTabsComponent } from './user-tabs/user-tabs.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpInterceptorProviders } from './http-interceptors';
import { LoadingComponent } from './loading/loading.component';
import { DialogLogoutComponent } from './dialogs/dialog-logout/dialog-logout.component';
import { UserService } from './services/user.service';
import { DialogUserSavedComponent } from './dialogs/dialog-user-saved/dialog-user-saved.component';
import { DialogLoginErrComponent } from './dialogs/dialog-login-err/dialog-login-err.component';
import { DialogPasswordAssignComponent } from './dialogs/dialog-password-assign/dialog-password-assign.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { UserListModule } from './user-list/user-list.module';
import { HttpLoaderFactory } from './http-loader.factory';

import { StoreModule } from '@ngrx/store';
import { dataReducers, sessionReducers } from './redux/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './redux/effects/user/user.effects';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { UserAdminEditorComponent } from './admin-panel/user-admin-editor/user-admin-editor.component';
import { SharedService } from './shared.service';

@NgModule({
  declarations: [
    AppComponent,
    AppRoutingComponents,
    UserEditorComponent,
    UserInfoComponent,
    LoginComponent,
    ForgotPasswordComponent,
    UserTabsComponent,
    LoadingComponent,
    DialogLogoutComponent,
    DialogUserSavedComponent,
    DialogLoginErrComponent,
    DialogPasswordAssignComponent,
    AdminPanelComponent,
    UserAdminEditorComponent
  ],
  entryComponents: [
    DialogLoginErrComponent,
    DialogLogoutComponent,
    DialogUserSavedComponent,
    DialogPasswordAssignComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([
      UserEffects
    ]),
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatListModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature('Data', dataReducers),
    StoreModule.forFeature('Session', sessionReducers),
    StoreDevtoolsModule.instrument(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    UserListModule
  ],
  providers: [
    HttpInterceptorProviders,
    AuthService,
    UserService,
    SharedService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
