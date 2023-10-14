import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakCardModule } from '@takkion/ng-material/card';
import { TakBoxForm } from './box-form.component';
import { TakIconModule } from '@takkion/ng-material/icon';
import { TakProgressBarModule } from '@takkion/ng-material/progress-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { TakButtonModule } from '@takkion/ng-material/button';
import { TakDividerModule } from '@takkion/ng-material/divider';

@NgModule({
  declarations: [TakBoxForm],
  imports: [
    CommonModule,
    TakCardModule,
    ReactiveFormsModule,
    TakIconModule,
    TakButtonModule,
    TakDividerModule,
    TakProgressBarModule,
  ],
  exports: [TakBoxForm],
})
export class TakBoxFormModule {}
