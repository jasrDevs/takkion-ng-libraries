import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { TakDividerModule } from '@takkion/ng-material/divider';
import { TakCardModule } from '@takkion/ng-material/card';
import { TakFormFieldModule } from '@takkion/ng-material/form-field';
import { TakInputModule } from '@takkion/ng-material/input';
import { TakBoxFormModule } from '@takkion/ng-components/box-form';
import { TakCapsuleModule } from '@takkion/ng-components/capsule';
import { ReactiveFormsModule } from '@angular/forms';
import { TakButtonModule } from '@takkion/ng-material/button';
import { TakFieldsModule } from '@takkion/ng-components/fields';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    TakCardModule,
    TakBoxFormModule,
    TakButtonModule,
    TakFormFieldModule,
    TakInputModule,
    TakDividerModule,
    TakFieldsModule,
    TakCapsuleModule,
  ],
})
export class HomeModule {}
