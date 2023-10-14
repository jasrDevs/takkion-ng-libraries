import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TakExpansionPanelHeader } from './sidebar/sidenav/expansion/expansion-panel-header.component';
import { TakExpansionPanel } from './sidebar/sidenav/expansion/expansion-panel.component';
import { TakAccordion } from './sidebar/sidenav/expansion/accordion.component';
import { TakBreadcrumb } from './breadcrumb/breadcrumb.component';
import { TakSidenav } from './sidebar/sidenav/sidenav.component';
import { TakSidebar } from './sidebar/sidebar.component';
import { TakHeader } from './header/header.component';
import { TakFooter } from './footer/footer.component';
import { TakLayout, TakLoader } from './layout.component';
import { ValidateAccessPipe } from './services/validate-access.pipe';
import { RoutePartsService } from './services';

@NgModule({
  declarations: [
    ValidateAccessPipe,
    TakExpansionPanelHeader,
    TakExpansionPanel,
    TakBreadcrumb,
    TakAccordion,
    TakSidebar,
    TakSidenav,
    TakLayout,
    TakHeader,
    TakFooter,
    TakLoader,
  ],

  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  exports: [TakLayout, TakLoader],
  providers: [RoutePartsService],
})
export class TakLayoutModule {}
