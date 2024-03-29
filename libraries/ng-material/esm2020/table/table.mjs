/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  CDK_TABLE_TEMPLATE,
  CdkTable,
  CDK_TABLE,
  _CoalescedStyleScheduler,
  _COALESCED_STYLE_SCHEDULER,
  STICKY_POSITIONING_LISTENER,
} from '@takkion/ng-cdk/table';
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';
import {
  _DisposeViewRepeaterStrategy,
  _RecycleViewRepeaterStrategy,
  _VIEW_REPEATER_STRATEGY,
} from '@takkion/ng-cdk/collections';
import * as i0 from '@angular/core';
import * as i1 from '@takkion/ng-cdk/table';
/**
 * Enables the recycle view repeater strategy, which reduces rendering latency. Not compatible with
 * tables that animate rows.
 */
export class TakRecycleRows {}
TakRecycleRows.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakRecycleRows,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakRecycleRows.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakRecycleRows,
  selector: 'tak-table[recycleRows], table[tak-table][recycleRows]',
  providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }],
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakRecycleRows,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: 'tak-table[recycleRows], table[tak-table][recycleRows]',
          providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }],
        },
      ],
    },
  ],
});
/**
 * Wrapper for the CdkTable with Material design styles.
 */
export class TakTable extends CdkTable {
  constructor() {
    super(...arguments);
    /** Overrides the sticky CSS class set by the `CdkTable`. */
    this.stickyCssClass = 'tak-table-sticky';
    /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
    this.needsPositionStickyOnElement = false;
  }
}
TakTable.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTable,
  deps: null,
  target: i0.ɵɵFactoryTarget.Component,
});
TakTable.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakTable,
  selector: 'tak-table, table[tak-table]',
  host: {
    properties: { 'class.tak-table-fixed-layout': 'fixedLayout' },
    classAttribute: 'tak-table',
  },
  providers: [
    // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
    //  is only included in the build if used.
    { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
    { provide: CdkTable, useExisting: TakTable },
    { provide: CDK_TABLE, useExisting: TakTable },
    { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
    // Prevent nested tables from seeing this table's StickyPositioningListener.
    { provide: STICKY_POSITIONING_LISTENER, useValue: null },
  ],
  exportAs: ['takTable'],
  usesInheritance: true,
  ngImport: i0,
  template:
    '\n  <ng-content select="caption"></ng-content>\n  <ng-content select="colgroup, col"></ng-content>\n  <ng-container headerRowOutlet></ng-container>\n  <ng-container rowOutlet></ng-container>\n  <ng-container noDataRowOutlet></ng-container>\n  <ng-container footerRowOutlet></ng-container>\n',
  isInline: true,
  styles: [
    'tak-table{display:block}tak-header-row{min-height:56px}tak-row,tak-footer-row{min-height:48px}tak-row,tak-header-row,tak-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}tak-cell:first-of-type,tak-header-cell:first-of-type,tak-footer-cell:first-of-type{padding-left:24px}[dir=rtl] tak-cell:first-of-type:not(:only-of-type),[dir=rtl] tak-header-cell:first-of-type:not(:only-of-type),[dir=rtl] tak-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}tak-cell:last-of-type,tak-header-cell:last-of-type,tak-footer-cell:last-of-type{padding-right:24px}[dir=rtl] tak-cell:last-of-type:not(:only-of-type),[dir=rtl] tak-header-cell:last-of-type:not(:only-of-type),[dir=rtl] tak-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}tak-cell,tak-header-cell,tak-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}table.tak-table{border-spacing:0}tr.tak-header-row{height:56px}tr.tak-row,tr.tak-footer-row{height:48px}th.tak-header-cell{text-align:left}[dir=rtl] th.tak-header-cell{text-align:right}th.tak-header-cell,td.tak-cell,td.tak-footer-cell{padding:0;border-bottom-width:1px;border-bottom-style:solid}th.tak-header-cell:first-of-type,td.tak-cell:first-of-type,td.tak-footer-cell:first-of-type{padding-left:24px}[dir=rtl] th.tak-header-cell:first-of-type:not(:only-of-type),[dir=rtl] td.tak-cell:first-of-type:not(:only-of-type),[dir=rtl] td.tak-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}th.tak-header-cell:last-of-type,td.tak-cell:last-of-type,td.tak-footer-cell:last-of-type{padding-right:24px}[dir=rtl] th.tak-header-cell:last-of-type:not(:only-of-type),[dir=rtl] td.tak-cell:last-of-type:not(:only-of-type),[dir=rtl] td.tak-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}.tak-table-sticky{position:sticky !important}.tak-table-fixed-layout{table-layout:fixed}',
  ],
  dependencies: [
    { kind: 'directive', type: i1.DataRowOutlet, selector: '[rowOutlet]' },
    { kind: 'directive', type: i1.HeaderRowOutlet, selector: '[headerRowOutlet]' },
    { kind: 'directive', type: i1.FooterRowOutlet, selector: '[footerRowOutlet]' },
    { kind: 'directive', type: i1.NoDataRowOutlet, selector: '[noDataRowOutlet]' },
  ],
  changeDetection: i0.ChangeDetectionStrategy.Default,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTable,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'tak-table, table[tak-table]',
          exportAs: 'takTable',
          template: CDK_TABLE_TEMPLATE,
          host: {
            class: 'tak-table',
            '[class.tak-table-fixed-layout]': 'fixedLayout',
          },
          providers: [
            // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
            //  is only included in the build if used.
            { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
            { provide: CdkTable, useExisting: TakTable },
            { provide: CDK_TABLE, useExisting: TakTable },
            { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
            // Prevent nested tables from seeing this table's StickyPositioningListener.
            { provide: STICKY_POSITIONING_LISTENER, useValue: null },
          ],
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.Default,
          styles: [
            'tak-table{display:block}tak-header-row{min-height:56px}tak-row,tak-footer-row{min-height:48px}tak-row,tak-header-row,tak-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}tak-cell:first-of-type,tak-header-cell:first-of-type,tak-footer-cell:first-of-type{padding-left:24px}[dir=rtl] tak-cell:first-of-type:not(:only-of-type),[dir=rtl] tak-header-cell:first-of-type:not(:only-of-type),[dir=rtl] tak-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}tak-cell:last-of-type,tak-header-cell:last-of-type,tak-footer-cell:last-of-type{padding-right:24px}[dir=rtl] tak-cell:last-of-type:not(:only-of-type),[dir=rtl] tak-header-cell:last-of-type:not(:only-of-type),[dir=rtl] tak-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}tak-cell,tak-header-cell,tak-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}table.tak-table{border-spacing:0}tr.tak-header-row{height:56px}tr.tak-row,tr.tak-footer-row{height:48px}th.tak-header-cell{text-align:left}[dir=rtl] th.tak-header-cell{text-align:right}th.tak-header-cell,td.tak-cell,td.tak-footer-cell{padding:0;border-bottom-width:1px;border-bottom-style:solid}th.tak-header-cell:first-of-type,td.tak-cell:first-of-type,td.tak-footer-cell:first-of-type{padding-left:24px}[dir=rtl] th.tak-header-cell:first-of-type:not(:only-of-type),[dir=rtl] td.tak-cell:first-of-type:not(:only-of-type),[dir=rtl] td.tak-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}th.tak-header-cell:last-of-type,td.tak-cell:last-of-type,td.tak-footer-cell:last-of-type{padding-right:24px}[dir=rtl] th.tak-header-cell:last-of-type:not(:only-of-type),[dir=rtl] td.tak-cell:last-of-type:not(:only-of-type),[dir=rtl] td.tak-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}.tak-table-sticky{position:sticky !important}.tak-table-fixed-layout{table-layout:fixed}',
          ],
        },
      ],
    },
  ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFibGUvdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLGtCQUFrQixFQUNsQixRQUFRLEVBQ1IsU0FBUyxFQUNULHdCQUF3QixFQUN4QiwwQkFBMEIsRUFDMUIsMkJBQTJCLEdBQzVCLE1BQU0sb0JBQW9CLENBQUM7QUFDNUIsT0FBTyxFQUFDLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDL0YsT0FBTyxFQUNMLDRCQUE0QixFQUM1Qiw0QkFBNEIsRUFDNUIsdUJBQXVCLEdBQ3hCLE1BQU0sMEJBQTBCLENBQUM7OztBQUVsQzs7O0dBR0c7QUFLSCxNQUFNLE9BQU8sY0FBYzs7MkdBQWQsY0FBYzsrRkFBZCxjQUFjLGdGQUZkLENBQUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLDRCQUE0QixFQUFDLENBQUM7MkZBRTVFLGNBQWM7a0JBSjFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHVEQUF1RDtvQkFDakUsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLDRCQUE0QixFQUFDLENBQUM7aUJBQ3hGOztBQUdEOztHQUVHO0FBeUJILE1BQU0sT0FBTyxRQUFZLFNBQVEsUUFBVztJQXhCNUM7O1FBeUJFLDREQUE0RDtRQUN6QyxtQkFBYyxHQUFHLGtCQUFrQixDQUFDO1FBRXZELDZGQUE2RjtRQUMxRSxpQ0FBNEIsR0FBRyxLQUFLLENBQUM7S0FDekQ7O3FHQU5ZLFFBQVE7eUZBQVIsUUFBUSw0SkFmUjtRQUNULGdHQUFnRztRQUNoRywwQ0FBMEM7UUFDMUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLDRCQUE0QixFQUFDO1FBQzFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFDO1FBQzFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFDO1FBQzNDLEVBQUMsT0FBTyxFQUFFLDBCQUEwQixFQUFFLFFBQVEsRUFBRSx3QkFBd0IsRUFBQztRQUN6RSw0RUFBNEU7UUFDNUUsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztLQUN2RDsyRkFNVSxRQUFRO2tCQXhCcEIsU0FBUzsrQkFDRSw2QkFBNkIsWUFDN0IsVUFBVSxZQUNWLGtCQUFrQixRQUV0Qjt3QkFDSixPQUFPLEVBQUUsV0FBVzt3QkFDcEIsZ0NBQWdDLEVBQUUsYUFBYTtxQkFDaEQsYUFDVTt3QkFDVCxnR0FBZ0c7d0JBQ2hHLDBDQUEwQzt3QkFDMUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLDRCQUE0QixFQUFDO3dCQUMxRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxVQUFVLEVBQUM7d0JBQzFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLFVBQVUsRUFBQzt3QkFDM0MsRUFBQyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsUUFBUSxFQUFFLHdCQUF3QixFQUFDO3dCQUN6RSw0RUFBNEU7d0JBQzVFLEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7cUJBQ3ZELGlCQUNjLGlCQUFpQixDQUFDLElBQUksbUJBR3BCLHVCQUF1QixDQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ0RLX1RBQkxFX1RFTVBMQVRFLFxuICBDZGtUYWJsZSxcbiAgQ0RLX1RBQkxFLFxuICBfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXIsXG4gIF9DT0FMRVNDRURfU1RZTEVfU0NIRURVTEVSLFxuICBTVElDS1lfUE9TSVRJT05JTkdfTElTVEVORVIsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90YWJsZSc7XG5pbXBvcnQge0NoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIERpcmVjdGl2ZSwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgX0Rpc3Bvc2VWaWV3UmVwZWF0ZXJTdHJhdGVneSxcbiAgX1JlY3ljbGVWaWV3UmVwZWF0ZXJTdHJhdGVneSxcbiAgX1ZJRVdfUkVQRUFURVJfU1RSQVRFR1ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5cbi8qKlxuICogRW5hYmxlcyB0aGUgcmVjeWNsZSB2aWV3IHJlcGVhdGVyIHN0cmF0ZWd5LCB3aGljaCByZWR1Y2VzIHJlbmRlcmluZyBsYXRlbmN5LiBOb3QgY29tcGF0aWJsZSB3aXRoXG4gKiB0YWJsZXMgdGhhdCBhbmltYXRlIHJvd3MuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC10YWJsZVtyZWN5Y2xlUm93c10sIHRhYmxlW21hdC10YWJsZV1bcmVjeWNsZVJvd3NdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IF9WSUVXX1JFUEVBVEVSX1NUUkFURUdZLCB1c2VDbGFzczogX1JlY3ljbGVWaWV3UmVwZWF0ZXJTdHJhdGVneX1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRSZWN5Y2xlUm93cyB7fVxuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUYWJsZSB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWJsZSwgdGFibGVbbWF0LXRhYmxlXScsXG4gIGV4cG9ydEFzOiAnbWF0VGFibGUnLFxuICB0ZW1wbGF0ZTogQ0RLX1RBQkxFX1RFTVBMQVRFLFxuICBzdHlsZVVybHM6IFsndGFibGUuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRhYmxlJyxcbiAgICAnW2NsYXNzLm1hdC10YWJsZS1maXhlZC1sYXlvdXRdJzogJ2ZpeGVkTGF5b3V0JyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgLy8gVE9ETyhtaWNoYWVsamFtZXNwYXJzb25zKSBBYnN0cmFjdCB0aGUgdmlldyByZXBlYXRlciBzdHJhdGVneSB0byBhIGRpcmVjdGl2ZSBBUEkgc28gdGhpcyBjb2RlXG4gICAgLy8gIGlzIG9ubHkgaW5jbHVkZWQgaW4gdGhlIGJ1aWxkIGlmIHVzZWQuXG4gICAge3Byb3ZpZGU6IF9WSUVXX1JFUEVBVEVSX1NUUkFURUdZLCB1c2VDbGFzczogX0Rpc3Bvc2VWaWV3UmVwZWF0ZXJTdHJhdGVneX0sXG4gICAge3Byb3ZpZGU6IENka1RhYmxlLCB1c2VFeGlzdGluZzogTWF0VGFibGV9LFxuICAgIHtwcm92aWRlOiBDREtfVEFCTEUsIHVzZUV4aXN0aW5nOiBNYXRUYWJsZX0sXG4gICAge3Byb3ZpZGU6IF9DT0FMRVNDRURfU1RZTEVfU0NIRURVTEVSLCB1c2VDbGFzczogX0NvYWxlc2NlZFN0eWxlU2NoZWR1bGVyfSxcbiAgICAvLyBQcmV2ZW50IG5lc3RlZCB0YWJsZXMgZnJvbSBzZWVpbmcgdGhpcyB0YWJsZSdzIFN0aWNreVBvc2l0aW9uaW5nTGlzdGVuZXIuXG4gICAge3Byb3ZpZGU6IFNUSUNLWV9QT1NJVElPTklOR19MSVNURU5FUiwgdXNlVmFsdWU6IG51bGx9LFxuICBdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAvLyBTZWUgbm90ZSBvbiBDZGtUYWJsZSBmb3IgZXhwbGFuYXRpb24gb24gd2h5IHRoaXMgdXNlcyB0aGUgZGVmYXVsdCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYmxlPFQ+IGV4dGVuZHMgQ2RrVGFibGU8VD4ge1xuICAvKiogT3ZlcnJpZGVzIHRoZSBzdGlja3kgQ1NTIGNsYXNzIHNldCBieSB0aGUgYENka1RhYmxlYC4gKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHN0aWNreUNzc0NsYXNzID0gJ21hdC10YWJsZS1zdGlja3knO1xuXG4gIC8qKiBPdmVycmlkZXMgdGhlIG5lZWQgdG8gYWRkIHBvc2l0aW9uOiBzdGlja3kgb24gZXZlcnkgc3RpY2t5IGNlbGwgZWxlbWVudCBpbiBgQ2RrVGFibGVgLiAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgbmVlZHNQb3NpdGlvblN0aWNreU9uRWxlbWVudCA9IGZhbHNlO1xufVxuIl19
