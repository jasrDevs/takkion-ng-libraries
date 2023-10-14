import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakButtonModule } from '@takkion/ng-material/button';
import { TakIconModule } from '@takkion/ng-material/icon';
import { TakModalComponent } from './modal.component';
import { TakDialogModule } from '@takkion/ng-material/dialog';
import { TakDividerModule } from '@takkion/ng-material/divider';

@NgModule({
  declarations: [TakModalComponent],
  imports: [CommonModule, TakButtonModule, TakDialogModule, TakDividerModule, TakIconModule],
  exports: [TakModalComponent],
})
export class TakModalModule {}
