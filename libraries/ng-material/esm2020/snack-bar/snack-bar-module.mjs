/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OverlayModule } from '@takkion/ng-cdk/overlay';
import { PortalModule } from '@takkion/ng-cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TakCommonModule } from '@takkion/ng-material/core';
import { TakButtonModule } from '@takkion/ng-material/button';
import { SimpleSnackBar } from './simple-snack-bar';
import { TakSnackBarContainer } from './snack-bar-container';
import * as i0 from '@angular/core';
export class TakSnackBarModule {}
TakSnackBarModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakSnackBarModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
TakSnackBarModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakSnackBarModule,
  declarations: [TakSnackBarContainer, SimpleSnackBar],
  imports: [OverlayModule, PortalModule, CommonModule, TakButtonModule, TakCommonModule],
  exports: [TakSnackBarContainer, TakCommonModule],
});
TakSnackBarModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakSnackBarModule,
  imports: [
    OverlayModule,
    PortalModule,
    CommonModule,
    TakButtonModule,
    TakCommonModule,
    TakCommonModule,
  ],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakSnackBarModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          imports: [OverlayModule, PortalModule, CommonModule, TakButtonModule, TakCommonModule],
          exports: [TakSnackBarContainer, TakCommonModule],
          declarations: [TakSnackBarContainer, SimpleSnackBar],
        },
      ],
    },
  ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc25hY2stYmFyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDOztBQU8zRCxNQUFNLE9BQU8saUJBQWlCOzs4R0FBakIsaUJBQWlCOytHQUFqQixpQkFBaUIsaUJBRmIsb0JBQW9CLEVBQUUsY0FBYyxhQUZ6QyxhQUFhLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsZUFBZSxhQUMzRSxvQkFBb0IsRUFBRSxlQUFlOytHQUdwQyxpQkFBaUIsWUFKbEIsYUFBYSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFDckQsZUFBZTsyRkFHcEMsaUJBQWlCO2tCQUw3QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUM7b0JBQ3RGLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixFQUFFLGVBQWUsQ0FBQztvQkFDaEQsWUFBWSxFQUFFLENBQUMsb0JBQW9CLEVBQUUsY0FBYyxDQUFDO2lCQUNyRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge092ZXJsYXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7UG9ydGFsTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdEJ1dHRvbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcbmltcG9ydCB7U2ltcGxlU25hY2tCYXJ9IGZyb20gJy4vc2ltcGxlLXNuYWNrLWJhcic7XG5pbXBvcnQge01hdFNuYWNrQmFyQ29udGFpbmVyfSBmcm9tICcuL3NuYWNrLWJhci1jb250YWluZXInO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbT3ZlcmxheU1vZHVsZSwgUG9ydGFsTW9kdWxlLCBDb21tb25Nb2R1bGUsIE1hdEJ1dHRvbk1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdFNuYWNrQmFyQ29udGFpbmVyLCBNYXRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRTbmFja0JhckNvbnRhaW5lciwgU2ltcGxlU25hY2tCYXJdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbmFja0Jhck1vZHVsZSB7fVxuIl19
