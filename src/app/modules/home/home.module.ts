import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@takkion/ng-material/autocomplete';
import { MatInputModule } from '@takkion/ng-material/input';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    MatAutocompleteModule,
    MatInputModule,
  ],
})
export class HomeModule {}
