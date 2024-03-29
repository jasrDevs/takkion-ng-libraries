/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input } from '@angular/core';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCell,
  CdkFooterCellDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
} from '@takkion/ng-cdk/table';
import * as i0 from '@angular/core';
/**
 * Cell definition for the tak-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
export class TakCellDef extends CdkCellDef {}
TakCellDef.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakCellDef,
  deps: null,
  target: i0.ɵɵFactoryTarget.Directive,
});
TakCellDef.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakCellDef,
  selector: '[takCellDef]',
  providers: [{ provide: CdkCellDef, useExisting: TakCellDef }],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakCellDef,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[takCellDef]',
          providers: [{ provide: CdkCellDef, useExisting: TakCellDef }],
        },
      ],
    },
  ],
});
/**
 * Header cell definition for the tak-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
export class TakHeaderCellDef extends CdkHeaderCellDef {}
TakHeaderCellDef.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakHeaderCellDef,
  deps: null,
  target: i0.ɵɵFactoryTarget.Directive,
});
TakHeaderCellDef.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakHeaderCellDef,
  selector: '[takHeaderCellDef]',
  providers: [{ provide: CdkHeaderCellDef, useExisting: TakHeaderCellDef }],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakHeaderCellDef,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[takHeaderCellDef]',
          providers: [{ provide: CdkHeaderCellDef, useExisting: TakHeaderCellDef }],
        },
      ],
    },
  ],
});
/**
 * Footer cell definition for the tak-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
export class TakFooterCellDef extends CdkFooterCellDef {}
TakFooterCellDef.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakFooterCellDef,
  deps: null,
  target: i0.ɵɵFactoryTarget.Directive,
});
TakFooterCellDef.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakFooterCellDef,
  selector: '[takFooterCellDef]',
  providers: [{ provide: CdkFooterCellDef, useExisting: TakFooterCellDef }],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakFooterCellDef,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[takFooterCellDef]',
          providers: [{ provide: CdkFooterCellDef, useExisting: TakFooterCellDef }],
        },
      ],
    },
  ],
});
/**
 * Column definition for the tak-table.
 * Defines a set of cells available for a table column.
 */
export class TakColumnDef extends CdkColumnDef {
  /** Unique name for this column. */
  get name() {
    return this._name;
  }
  set name(name) {
    this._setNameInput(name);
  }
  /**
   * Add "tak-column-" prefix in addition to "cdk-column-" prefix.
   * In the future, this will only add "tak-column-" and columnCssClassName
   * will change from type string[] to string.
   * @docs-private
   */
  _updateColumnCssClassName() {
    super._updateColumnCssClassName();
    this._columnCssClassName.push(`tak-column-${this.cssClassFriendlyName}`);
  }
}
TakColumnDef.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakColumnDef,
  deps: null,
  target: i0.ɵɵFactoryTarget.Directive,
});
TakColumnDef.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakColumnDef,
  selector: '[takColumnDef]',
  inputs: { sticky: 'sticky', name: ['takColumnDef', 'name'] },
  providers: [
    { provide: CdkColumnDef, useExisting: TakColumnDef },
    { provide: 'TAK_SORT_HEADER_COLUMN_DEF', useExisting: TakColumnDef },
  ],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakColumnDef,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[takColumnDef]',
          inputs: ['sticky'],
          providers: [
            { provide: CdkColumnDef, useExisting: TakColumnDef },
            { provide: 'TAK_SORT_HEADER_COLUMN_DEF', useExisting: TakColumnDef },
          ],
        },
      ],
    },
  ],
  propDecorators: {
    name: [
      {
        type: Input,
        args: ['takColumnDef'],
      },
    ],
  },
});
/** Header cell template container that adds the right classes and role. */
export class TakHeaderCell extends CdkHeaderCell {}
TakHeaderCell.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakHeaderCell,
  deps: null,
  target: i0.ɵɵFactoryTarget.Directive,
});
TakHeaderCell.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakHeaderCell,
  selector: 'tak-header-cell, th[tak-header-cell]',
  host: { attributes: { role: 'columnheader' }, classAttribute: 'tak-header-cell' },
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakHeaderCell,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: 'tak-header-cell, th[tak-header-cell]',
          host: {
            class: 'tak-header-cell',
            role: 'columnheader',
          },
        },
      ],
    },
  ],
});
/** Footer cell template container that adds the right classes and role. */
export class TakFooterCell extends CdkFooterCell {}
TakFooterCell.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakFooterCell,
  deps: null,
  target: i0.ɵɵFactoryTarget.Directive,
});
TakFooterCell.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakFooterCell,
  selector: 'tak-footer-cell, td[tak-footer-cell]',
  host: { attributes: { role: 'gridcell' }, classAttribute: 'tak-footer-cell' },
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakFooterCell,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: 'tak-footer-cell, td[tak-footer-cell]',
          host: {
            class: 'tak-footer-cell',
            role: 'gridcell',
          },
        },
      ],
    },
  ],
});
/** Cell template container that adds the right classes and role. */
export class TakCell extends CdkCell {}
TakCell.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakCell,
  deps: null,
  target: i0.ɵɵFactoryTarget.Directive,
});
TakCell.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakCell,
  selector: 'tak-cell, td[tak-cell]',
  host: { attributes: { role: 'gridcell' }, classAttribute: 'tak-cell' },
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakCell,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: 'tak-cell, td[tak-cell]',
          host: {
            class: 'tak-cell',
            role: 'gridcell',
          },
        },
      ],
    },
  ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJsZS9jZWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9DLE9BQU8sRUFDTCxPQUFPLEVBQ1AsVUFBVSxFQUNWLFlBQVksRUFDWixhQUFhLEVBQ2IsZ0JBQWdCLEVBQ2hCLGFBQWEsRUFDYixnQkFBZ0IsR0FDakIsTUFBTSxvQkFBb0IsQ0FBQzs7QUFFNUI7OztHQUdHO0FBS0gsTUFBTSxPQUFPLFVBQVcsU0FBUSxVQUFVOzt1R0FBN0IsVUFBVTsyRkFBVixVQUFVLHVDQUZWLENBQUMsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUMsQ0FBQzsyRkFFaEQsVUFBVTtrQkFKdEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsWUFBWSxFQUFDLENBQUM7aUJBQzVEOztBQUdEOzs7R0FHRztBQUtILE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxnQkFBZ0I7OzZHQUF6QyxnQkFBZ0I7aUdBQWhCLGdCQUFnQiw2Q0FGaEIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQzsyRkFFNUQsZ0JBQWdCO2tCQUo1QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFdBQVcsa0JBQWtCLEVBQUMsQ0FBQztpQkFDeEU7O0FBR0Q7OztHQUdHO0FBS0gsTUFBTSxPQUFPLGdCQUFpQixTQUFRLGdCQUFnQjs7NkdBQXpDLGdCQUFnQjtpR0FBaEIsZ0JBQWdCLDZDQUZoQixDQUFDLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDOzJGQUU1RCxnQkFBZ0I7a0JBSjVCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtvQkFDOUIsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxrQkFBa0IsRUFBQyxDQUFDO2lCQUN4RTs7QUFHRDs7O0dBR0c7QUFTSCxNQUFNLE9BQU8sWUFBYSxTQUFRLFlBQVk7SUFDNUMsbUNBQW1DO0lBQ25DLElBQ2EsSUFBSTtRQUNmLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBQ0QsSUFBYSxJQUFJLENBQUMsSUFBWTtRQUM1QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNnQix5QkFBeUI7UUFDMUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLG1CQUFvQixDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7SUFDNUUsQ0FBQzs7eUdBbkJVLFlBQVk7NkZBQVosWUFBWSx1R0FMWjtRQUNULEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFDO1FBQ2xELEVBQUMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUM7S0FDbkU7MkZBRVUsWUFBWTtrQkFSeEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7b0JBQ2xCLFNBQVMsRUFBRTt3QkFDVCxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxjQUFjLEVBQUM7d0JBQ2xELEVBQUMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLFdBQVcsY0FBYyxFQUFDO3FCQUNuRTtpQkFDRjs4QkFJYyxJQUFJO3NCQURoQixLQUFLO3VCQUFDLGNBQWM7O0FBb0J2QiwyRUFBMkU7QUFRM0UsTUFBTSxPQUFPLGFBQWMsU0FBUSxhQUFhOzswR0FBbkMsYUFBYTs4RkFBYixhQUFhOzJGQUFiLGFBQWE7a0JBUHpCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHNDQUFzQztvQkFDaEQsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxpQkFBaUI7d0JBQzFCLE1BQU0sRUFBRSxjQUFjO3FCQUN2QjtpQkFDRjs7QUFHRCwyRUFBMkU7QUFRM0UsTUFBTSxPQUFPLGFBQWMsU0FBUSxhQUFhOzswR0FBbkMsYUFBYTs4RkFBYixhQUFhOzJGQUFiLGFBQWE7a0JBUHpCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHNDQUFzQztvQkFDaEQsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxpQkFBaUI7d0JBQzFCLE1BQU0sRUFBRSxVQUFVO3FCQUNuQjtpQkFDRjs7QUFHRCxvRUFBb0U7QUFRcEUsTUFBTSxPQUFPLE9BQVEsU0FBUSxPQUFPOztvR0FBdkIsT0FBTzt3RkFBUCxPQUFPOzJGQUFQLE9BQU87a0JBUG5CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtvQkFDbEMsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxVQUFVO3dCQUNuQixNQUFNLEVBQUUsVUFBVTtxQkFDbkI7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENka0NlbGwsXG4gIENka0NlbGxEZWYsXG4gIENka0NvbHVtbkRlZixcbiAgQ2RrRm9vdGVyQ2VsbCxcbiAgQ2RrRm9vdGVyQ2VsbERlZixcbiAgQ2RrSGVhZGVyQ2VsbCxcbiAgQ2RrSGVhZGVyQ2VsbERlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcblxuLyoqXG4gKiBDZWxsIGRlZmluaXRpb24gZm9yIHRoZSBtYXQtdGFibGUuXG4gKiBDYXB0dXJlcyB0aGUgdGVtcGxhdGUgb2YgYSBjb2x1bW4ncyBkYXRhIHJvdyBjZWxsIGFzIHdlbGwgYXMgY2VsbC1zcGVjaWZpYyBwcm9wZXJ0aWVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0Q2VsbERlZl0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrQ2VsbERlZiwgdXNlRXhpc3Rpbmc6IE1hdENlbGxEZWZ9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2VsbERlZiBleHRlbmRzIENka0NlbGxEZWYge31cblxuLyoqXG4gKiBIZWFkZXIgY2VsbCBkZWZpbml0aW9uIGZvciB0aGUgbWF0LXRhYmxlLlxuICogQ2FwdHVyZXMgdGhlIHRlbXBsYXRlIG9mIGEgY29sdW1uJ3MgaGVhZGVyIGNlbGwgYW5kIGFzIHdlbGwgYXMgY2VsbC1zcGVjaWZpYyBwcm9wZXJ0aWVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0SGVhZGVyQ2VsbERlZl0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrSGVhZGVyQ2VsbERlZiwgdXNlRXhpc3Rpbmc6IE1hdEhlYWRlckNlbGxEZWZ9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SGVhZGVyQ2VsbERlZiBleHRlbmRzIENka0hlYWRlckNlbGxEZWYge31cblxuLyoqXG4gKiBGb290ZXIgY2VsbCBkZWZpbml0aW9uIGZvciB0aGUgbWF0LXRhYmxlLlxuICogQ2FwdHVyZXMgdGhlIHRlbXBsYXRlIG9mIGEgY29sdW1uJ3MgZm9vdGVyIGNlbGwgYW5kIGFzIHdlbGwgYXMgY2VsbC1zcGVjaWZpYyBwcm9wZXJ0aWVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0Rm9vdGVyQ2VsbERlZl0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrRm9vdGVyQ2VsbERlZiwgdXNlRXhpc3Rpbmc6IE1hdEZvb3RlckNlbGxEZWZ9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Rm9vdGVyQ2VsbERlZiBleHRlbmRzIENka0Zvb3RlckNlbGxEZWYge31cblxuLyoqXG4gKiBDb2x1bW4gZGVmaW5pdGlvbiBmb3IgdGhlIG1hdC10YWJsZS5cbiAqIERlZmluZXMgYSBzZXQgb2YgY2VsbHMgYXZhaWxhYmxlIGZvciBhIHRhYmxlIGNvbHVtbi5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdENvbHVtbkRlZl0nLFxuICBpbnB1dHM6IFsnc3RpY2t5J10sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBDZGtDb2x1bW5EZWYsIHVzZUV4aXN0aW5nOiBNYXRDb2x1bW5EZWZ9LFxuICAgIHtwcm92aWRlOiAnTUFUX1NPUlRfSEVBREVSX0NPTFVNTl9ERUYnLCB1c2VFeGlzdGluZzogTWF0Q29sdW1uRGVmfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q29sdW1uRGVmIGV4dGVuZHMgQ2RrQ29sdW1uRGVmIHtcbiAgLyoqIFVuaXF1ZSBuYW1lIGZvciB0aGlzIGNvbHVtbi4gKi9cbiAgQElucHV0KCdtYXRDb2x1bW5EZWYnKVxuICBvdmVycmlkZSBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG4gIG92ZXJyaWRlIHNldCBuYW1lKG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuX3NldE5hbWVJbnB1dChuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgXCJtYXQtY29sdW1uLVwiIHByZWZpeCBpbiBhZGRpdGlvbiB0byBcImNkay1jb2x1bW4tXCIgcHJlZml4LlxuICAgKiBJbiB0aGUgZnV0dXJlLCB0aGlzIHdpbGwgb25seSBhZGQgXCJtYXQtY29sdW1uLVwiIGFuZCBjb2x1bW5Dc3NDbGFzc05hbWVcbiAgICogd2lsbCBjaGFuZ2UgZnJvbSB0eXBlIHN0cmluZ1tdIHRvIHN0cmluZy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF91cGRhdGVDb2x1bW5Dc3NDbGFzc05hbWUoKSB7XG4gICAgc3VwZXIuX3VwZGF0ZUNvbHVtbkNzc0NsYXNzTmFtZSgpO1xuICAgIHRoaXMuX2NvbHVtbkNzc0NsYXNzTmFtZSEucHVzaChgbWF0LWNvbHVtbi0ke3RoaXMuY3NzQ2xhc3NGcmllbmRseU5hbWV9YCk7XG4gIH1cbn1cblxuLyoqIEhlYWRlciBjZWxsIHRlbXBsYXRlIGNvbnRhaW5lciB0aGF0IGFkZHMgdGhlIHJpZ2h0IGNsYXNzZXMgYW5kIHJvbGUuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtaGVhZGVyLWNlbGwsIHRoW21hdC1oZWFkZXItY2VsbF0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1oZWFkZXItY2VsbCcsXG4gICAgJ3JvbGUnOiAnY29sdW1uaGVhZGVyJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SGVhZGVyQ2VsbCBleHRlbmRzIENka0hlYWRlckNlbGwge31cblxuLyoqIEZvb3RlciBjZWxsIHRlbXBsYXRlIGNvbnRhaW5lciB0aGF0IGFkZHMgdGhlIHJpZ2h0IGNsYXNzZXMgYW5kIHJvbGUuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtZm9vdGVyLWNlbGwsIHRkW21hdC1mb290ZXItY2VsbF0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1mb290ZXItY2VsbCcsXG4gICAgJ3JvbGUnOiAnZ3JpZGNlbGwnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRGb290ZXJDZWxsIGV4dGVuZHMgQ2RrRm9vdGVyQ2VsbCB7fVxuXG4vKiogQ2VsbCB0ZW1wbGF0ZSBjb250YWluZXIgdGhhdCBhZGRzIHRoZSByaWdodCBjbGFzc2VzIGFuZCByb2xlLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWNlbGwsIHRkW21hdC1jZWxsXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNlbGwnLFxuICAgICdyb2xlJzogJ2dyaWRjZWxsJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2VsbCBleHRlbmRzIENka0NlbGwge31cbiJdfQ==
