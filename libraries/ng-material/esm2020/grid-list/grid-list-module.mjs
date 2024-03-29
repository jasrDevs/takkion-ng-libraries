/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { TakLineModule, TakCommonModule } from '@takkion/ng-material/core';
import {
  TakGridTile,
  TakGridTileText,
  TakGridTileFooterCssTakStyler,
  TakGridTileHeaderCssTakStyler,
  TakGridAvatarCssTakStyler,
} from './grid-tile';
import { TakGridList } from './grid-list';
import * as i0 from '@angular/core';
export class TakGridListModule {}
TakGridListModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakGridListModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
TakGridListModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakGridListModule,
  declarations: [
    TakGridList,
    TakGridTile,
    TakGridTileText,
    TakGridTileHeaderCssTakStyler,
    TakGridTileFooterCssTakStyler,
    TakGridAvatarCssTakStyler,
  ],
  imports: [TakLineModule, TakCommonModule],
  exports: [
    TakGridList,
    TakGridTile,
    TakGridTileText,
    TakLineModule,
    TakCommonModule,
    TakGridTileHeaderCssTakStyler,
    TakGridTileFooterCssTakStyler,
    TakGridAvatarCssTakStyler,
  ],
});
TakGridListModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakGridListModule,
  imports: [TakLineModule, TakCommonModule, TakLineModule, TakCommonModule],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakGridListModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          imports: [TakLineModule, TakCommonModule],
          exports: [
            TakGridList,
            TakGridTile,
            TakGridTileText,
            TakLineModule,
            TakCommonModule,
            TakGridTileHeaderCssTakStyler,
            TakGridTileFooterCssTakStyler,
            TakGridAvatarCssTakStyler,
          ],
          declarations: [
            TakGridList,
            TakGridTile,
            TakGridTileText,
            TakGridTileHeaderCssTakStyler,
            TakGridTileFooterCssTakStyler,
            TakGridAvatarCssTakStyler,
          ],
        },
      ],
    },
  ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ncmlkLWxpc3QvZ3JpZC1saXN0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxhQUFhLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdEUsT0FBTyxFQUNMLFdBQVcsRUFDWCxlQUFlLEVBQ2YsNkJBQTZCLEVBQzdCLDZCQUE2QixFQUM3Qix5QkFBeUIsR0FDMUIsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQzs7QUF1QnhDLE1BQU0sT0FBTyxpQkFBaUI7OzhHQUFqQixpQkFBaUI7K0dBQWpCLGlCQUFpQixpQkFSMUIsV0FBVztRQUNYLFdBQVc7UUFDWCxlQUFlO1FBQ2YsNkJBQTZCO1FBQzdCLDZCQUE2QjtRQUM3Qix5QkFBeUIsYUFqQmpCLGFBQWEsRUFBRSxlQUFlLGFBRXRDLFdBQVc7UUFDWCxXQUFXO1FBQ1gsZUFBZTtRQUNmLGFBQWE7UUFDYixlQUFlO1FBQ2YsNkJBQTZCO1FBQzdCLDZCQUE2QjtRQUM3Qix5QkFBeUI7K0dBV2hCLGlCQUFpQixZQXBCbEIsYUFBYSxFQUFFLGVBQWUsRUFLdEMsYUFBYTtRQUNiLGVBQWU7MkZBY04saUJBQWlCO2tCQXJCN0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDO29CQUN6QyxPQUFPLEVBQUU7d0JBQ1AsV0FBVzt3QkFDWCxXQUFXO3dCQUNYLGVBQWU7d0JBQ2YsYUFBYTt3QkFDYixlQUFlO3dCQUNmLDZCQUE2Qjt3QkFDN0IsNkJBQTZCO3dCQUM3Qix5QkFBeUI7cUJBQzFCO29CQUNELFlBQVksRUFBRTt3QkFDWixXQUFXO3dCQUNYLFdBQVc7d0JBQ1gsZUFBZTt3QkFDZiw2QkFBNkI7d0JBQzdCLDZCQUE2Qjt3QkFDN0IseUJBQXlCO3FCQUMxQjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0TGluZU1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7XG4gIE1hdEdyaWRUaWxlLFxuICBNYXRHcmlkVGlsZVRleHQsXG4gIE1hdEdyaWRUaWxlRm9vdGVyQ3NzTWF0U3R5bGVyLFxuICBNYXRHcmlkVGlsZUhlYWRlckNzc01hdFN0eWxlcixcbiAgTWF0R3JpZEF2YXRhckNzc01hdFN0eWxlcixcbn0gZnJvbSAnLi9ncmlkLXRpbGUnO1xuaW1wb3J0IHtNYXRHcmlkTGlzdH0gZnJvbSAnLi9ncmlkLWxpc3QnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0TGluZU1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIE1hdEdyaWRMaXN0LFxuICAgIE1hdEdyaWRUaWxlLFxuICAgIE1hdEdyaWRUaWxlVGV4dCxcbiAgICBNYXRMaW5lTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXRHcmlkVGlsZUhlYWRlckNzc01hdFN0eWxlcixcbiAgICBNYXRHcmlkVGlsZUZvb3RlckNzc01hdFN0eWxlcixcbiAgICBNYXRHcmlkQXZhdGFyQ3NzTWF0U3R5bGVyLFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRHcmlkTGlzdCxcbiAgICBNYXRHcmlkVGlsZSxcbiAgICBNYXRHcmlkVGlsZVRleHQsXG4gICAgTWF0R3JpZFRpbGVIZWFkZXJDc3NNYXRTdHlsZXIsXG4gICAgTWF0R3JpZFRpbGVGb290ZXJDc3NNYXRTdHlsZXIsXG4gICAgTWF0R3JpZEF2YXRhckNzc01hdFN0eWxlcixcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZExpc3RNb2R1bGUge31cbiJdfQ==
