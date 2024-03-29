/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import {
  HeaderRowOutlet,
  DataRowOutlet,
  CdkTable,
  CdkRecycleRows,
  FooterRowOutlet,
  NoDataRowOutlet,
} from './table';
import {
  CdkCellOutlet,
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkNoDataRow,
} from './row';
import {
  CdkColumnDef,
  CdkHeaderCellDef,
  CdkHeaderCell,
  CdkCell,
  CdkCellDef,
  CdkFooterCellDef,
  CdkFooterCell,
} from './cell';
import { CdkTextColumn } from './text-column';
import { ScrollingModule } from '@takkion/ng-cdk/scrolling';
import * as i0 from '@angular/core';
const EXPORTED_DECLARATIONS = [
  CdkTable,
  CdkRowDef,
  CdkCellDef,
  CdkCellOutlet,
  CdkHeaderCellDef,
  CdkFooterCellDef,
  CdkColumnDef,
  CdkCell,
  CdkRow,
  CdkHeaderCell,
  CdkFooterCell,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkFooterRow,
  CdkFooterRowDef,
  DataRowOutlet,
  HeaderRowOutlet,
  FooterRowOutlet,
  CdkTextColumn,
  CdkNoDataRow,
  CdkRecycleRows,
  NoDataRowOutlet,
];
export class CdkTableModule {}
CdkTableModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkTableModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
CdkTableModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkTableModule,
  declarations: [
    CdkTable,
    CdkRowDef,
    CdkCellDef,
    CdkCellOutlet,
    CdkHeaderCellDef,
    CdkFooterCellDef,
    CdkColumnDef,
    CdkCell,
    CdkRow,
    CdkHeaderCell,
    CdkFooterCell,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkFooterRow,
    CdkFooterRowDef,
    DataRowOutlet,
    HeaderRowOutlet,
    FooterRowOutlet,
    CdkTextColumn,
    CdkNoDataRow,
    CdkRecycleRows,
    NoDataRowOutlet,
  ],
  imports: [ScrollingModule],
  exports: [
    CdkTable,
    CdkRowDef,
    CdkCellDef,
    CdkCellOutlet,
    CdkHeaderCellDef,
    CdkFooterCellDef,
    CdkColumnDef,
    CdkCell,
    CdkRow,
    CdkHeaderCell,
    CdkFooterCell,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkFooterRow,
    CdkFooterRowDef,
    DataRowOutlet,
    HeaderRowOutlet,
    FooterRowOutlet,
    CdkTextColumn,
    CdkNoDataRow,
    CdkRecycleRows,
    NoDataRowOutlet,
  ],
});
CdkTableModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkTableModule,
  imports: [ScrollingModule],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkTableModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          exports: EXPORTED_DECLARATIONS,
          declarations: EXPORTED_DECLARATIONS,
          imports: [ScrollingModule],
        },
      ],
    },
  ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay90YWJsZS90YWJsZS1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQ0wsZUFBZSxFQUNmLGFBQWEsRUFDYixRQUFRLEVBQ1IsY0FBYyxFQUNkLGVBQWUsRUFDZixlQUFlLEdBQ2hCLE1BQU0sU0FBUyxDQUFDO0FBQ2pCLE9BQU8sRUFDTCxhQUFhLEVBQ2IsWUFBWSxFQUNaLGVBQWUsRUFDZixZQUFZLEVBQ1osZUFBZSxFQUNmLE1BQU0sRUFDTixTQUFTLEVBQ1QsWUFBWSxHQUNiLE1BQU0sT0FBTyxDQUFDO0FBQ2YsT0FBTyxFQUNMLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLE9BQU8sRUFDUCxVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2hCLGFBQWEsR0FDZCxNQUFNLFFBQVEsQ0FBQztBQUNoQixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQzs7QUFFdkQsTUFBTSxxQkFBcUIsR0FBRztJQUM1QixRQUFRO0lBQ1IsU0FBUztJQUNULFVBQVU7SUFDVixhQUFhO0lBQ2IsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixZQUFZO0lBQ1osT0FBTztJQUNQLE1BQU07SUFDTixhQUFhO0lBQ2IsYUFBYTtJQUNiLFlBQVk7SUFDWixlQUFlO0lBQ2YsWUFBWTtJQUNaLGVBQWU7SUFDZixhQUFhO0lBQ2IsZUFBZTtJQUNmLGVBQWU7SUFDZixhQUFhO0lBQ2IsWUFBWTtJQUNaLGNBQWM7SUFDZCxlQUFlO0NBQ2hCLENBQUM7QUFPRixNQUFNLE9BQU8sY0FBYzs7MkdBQWQsY0FBYzs0R0FBZCxjQUFjLGlCQTdCekIsUUFBUTtRQUNSLFNBQVM7UUFDVCxVQUFVO1FBQ1YsYUFBYTtRQUNiLGdCQUFnQjtRQUNoQixnQkFBZ0I7UUFDaEIsWUFBWTtRQUNaLE9BQU87UUFDUCxNQUFNO1FBQ04sYUFBYTtRQUNiLGFBQWE7UUFDYixZQUFZO1FBQ1osZUFBZTtRQUNmLFlBQVk7UUFDWixlQUFlO1FBQ2YsYUFBYTtRQUNiLGVBQWU7UUFDZixlQUFlO1FBQ2YsYUFBYTtRQUNiLFlBQVk7UUFDWixjQUFjO1FBQ2QsZUFBZSxhQU1MLGVBQWUsYUEzQnpCLFFBQVE7UUFDUixTQUFTO1FBQ1QsVUFBVTtRQUNWLGFBQWE7UUFDYixnQkFBZ0I7UUFDaEIsZ0JBQWdCO1FBQ2hCLFlBQVk7UUFDWixPQUFPO1FBQ1AsTUFBTTtRQUNOLGFBQWE7UUFDYixhQUFhO1FBQ2IsWUFBWTtRQUNaLGVBQWU7UUFDZixZQUFZO1FBQ1osZUFBZTtRQUNmLGFBQWE7UUFDYixlQUFlO1FBQ2YsZUFBZTtRQUNmLGFBQWE7UUFDYixZQUFZO1FBQ1osY0FBYztRQUNkLGVBQWU7NEdBUUosY0FBYyxZQUZmLGVBQWU7MkZBRWQsY0FBYztrQkFMMUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUscUJBQXFCO29CQUM5QixZQUFZLEVBQUUscUJBQXFCO29CQUNuQyxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7aUJBQzNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgSGVhZGVyUm93T3V0bGV0LFxuICBEYXRhUm93T3V0bGV0LFxuICBDZGtUYWJsZSxcbiAgQ2RrUmVjeWNsZVJvd3MsXG4gIEZvb3RlclJvd091dGxldCxcbiAgTm9EYXRhUm93T3V0bGV0LFxufSBmcm9tICcuL3RhYmxlJztcbmltcG9ydCB7XG4gIENka0NlbGxPdXRsZXQsXG4gIENka0Zvb3RlclJvdyxcbiAgQ2RrRm9vdGVyUm93RGVmLFxuICBDZGtIZWFkZXJSb3csXG4gIENka0hlYWRlclJvd0RlZixcbiAgQ2RrUm93LFxuICBDZGtSb3dEZWYsXG4gIENka05vRGF0YVJvdyxcbn0gZnJvbSAnLi9yb3cnO1xuaW1wb3J0IHtcbiAgQ2RrQ29sdW1uRGVmLFxuICBDZGtIZWFkZXJDZWxsRGVmLFxuICBDZGtIZWFkZXJDZWxsLFxuICBDZGtDZWxsLFxuICBDZGtDZWxsRGVmLFxuICBDZGtGb290ZXJDZWxsRGVmLFxuICBDZGtGb290ZXJDZWxsLFxufSBmcm9tICcuL2NlbGwnO1xuaW1wb3J0IHtDZGtUZXh0Q29sdW1ufSBmcm9tICcuL3RleHQtY29sdW1uJztcbmltcG9ydCB7U2Nyb2xsaW5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcblxuY29uc3QgRVhQT1JURURfREVDTEFSQVRJT05TID0gW1xuICBDZGtUYWJsZSxcbiAgQ2RrUm93RGVmLFxuICBDZGtDZWxsRGVmLFxuICBDZGtDZWxsT3V0bGV0LFxuICBDZGtIZWFkZXJDZWxsRGVmLFxuICBDZGtGb290ZXJDZWxsRGVmLFxuICBDZGtDb2x1bW5EZWYsXG4gIENka0NlbGwsXG4gIENka1JvdyxcbiAgQ2RrSGVhZGVyQ2VsbCxcbiAgQ2RrRm9vdGVyQ2VsbCxcbiAgQ2RrSGVhZGVyUm93LFxuICBDZGtIZWFkZXJSb3dEZWYsXG4gIENka0Zvb3RlclJvdyxcbiAgQ2RrRm9vdGVyUm93RGVmLFxuICBEYXRhUm93T3V0bGV0LFxuICBIZWFkZXJSb3dPdXRsZXQsXG4gIEZvb3RlclJvd091dGxldCxcbiAgQ2RrVGV4dENvbHVtbixcbiAgQ2RrTm9EYXRhUm93LFxuICBDZGtSZWN5Y2xlUm93cyxcbiAgTm9EYXRhUm93T3V0bGV0LFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgZXhwb3J0czogRVhQT1JURURfREVDTEFSQVRJT05TLFxuICBkZWNsYXJhdGlvbnM6IEVYUE9SVEVEX0RFQ0xBUkFUSU9OUyxcbiAgaW1wb3J0czogW1Njcm9sbGluZ01vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIENka1RhYmxlTW9kdWxlIHt9XG4iXX0=
