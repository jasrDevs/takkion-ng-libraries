import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './layout.component';
import { TakLayoutModule } from '@takkion/ng-components/layout';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TakButtonModule } from '@takkion/ng-material/button';
import { TakIconModule } from '@takkion/ng-material/icon';
import { TakMenuModule } from '@takkion/ng-material/menu';

@NgModule({
  declarations: [AdminLayoutComponent, HeaderComponent, FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    TakButtonModule,
    TakIconModule,
    TakMenuModule,
    TakLayoutModule,
  ],
})
export class AdminLayoutModule {}
