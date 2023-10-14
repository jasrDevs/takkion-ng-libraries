import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialComponent } from './material.component';
import { RouterModule } from '@angular/router';
import { TakButtonModule } from '@takkion/ng-material/button';
import { TakIconModule } from '@takkion/ng-material/icon';
import { TakSidenavModule } from '@takkion/ng-material/sidenav';
import { TakToolbarModule } from '@takkion/ng-material/toolbar';

@NgModule({
  declarations: [MaterialComponent],
  imports: [
    CommonModule,
    RouterModule,
    TakSidenavModule,
    TakIconModule,
    TakButtonModule,
    TakToolbarModule,
  ],
})
export class MaterialModule {}
