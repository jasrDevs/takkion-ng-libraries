/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OverlayModule } from '@takkion/ng-cdk/overlay';
import { A11yModule } from '@takkion/ng-cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TakCommonModule } from '@takkion/ng-material/core';
import { CdkScrollableModule } from '@takkion/ng-cdk/scrolling';
import {
  TakTooltip,
  TooltipComponent,
  TAK_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './tooltip';
import * as i0 from '@angular/core';
export class TakTooltipModule {}
TakTooltipModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTooltipModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
TakTooltipModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTooltipModule,
  declarations: [TakTooltip, TooltipComponent],
  imports: [A11yModule, CommonModule, OverlayModule, TakCommonModule],
  exports: [TakTooltip, TooltipComponent, TakCommonModule, CdkScrollableModule],
});
TakTooltipModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTooltipModule,
  providers: [TAK_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
  imports: [
    A11yModule,
    CommonModule,
    OverlayModule,
    TakCommonModule,
    TakCommonModule,
    CdkScrollableModule,
  ],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTooltipModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          imports: [A11yModule, CommonModule, OverlayModule, TakCommonModule],
          exports: [TakTooltip, TooltipComponent, TakCommonModule, CdkScrollableModule],
          declarations: [TakTooltip, TooltipComponent],
          providers: [TAK_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
        },
      ],
    },
  ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdG9vbHRpcC90b29sdGlwLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRCxPQUFPLEVBQ0wsVUFBVSxFQUNWLGdCQUFnQixFQUNoQiw0Q0FBNEMsR0FDN0MsTUFBTSxXQUFXLENBQUM7O0FBUW5CLE1BQU0sT0FBTyxnQkFBZ0I7OzZHQUFoQixnQkFBZ0I7OEdBQWhCLGdCQUFnQixpQkFIWixVQUFVLEVBQUUsZ0JBQWdCLGFBRmpDLFVBQVUsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGVBQWUsYUFDeEQsVUFBVSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxtQkFBbUI7OEdBSWpFLGdCQUFnQixhQUZoQixDQUFDLDRDQUE0QyxDQUFDLFlBSC9DLFVBQVUsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFDMUIsZUFBZSxFQUFFLG1CQUFtQjsyRkFJakUsZ0JBQWdCO2tCQU41QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBQztvQkFDbkUsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxtQkFBbUIsQ0FBQztvQkFDN0UsWUFBWSxFQUFFLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDO29CQUM1QyxTQUFTLEVBQUUsQ0FBQyw0Q0FBNEMsQ0FBQztpQkFDMUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPdmVybGF5TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0ExMXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0Nka1Njcm9sbGFibGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgTWF0VG9vbHRpcCxcbiAgVG9vbHRpcENvbXBvbmVudCxcbiAgTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIsXG59IGZyb20gJy4vdG9vbHRpcCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtBMTF5TW9kdWxlLCBDb21tb25Nb2R1bGUsIE92ZXJsYXlNb2R1bGUsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRUb29sdGlwLCBUb29sdGlwQ29tcG9uZW50LCBNYXRDb21tb25Nb2R1bGUsIENka1Njcm9sbGFibGVNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRUb29sdGlwLCBUb29sdGlwQ29tcG9uZW50XSxcbiAgcHJvdmlkZXJzOiBbTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVJdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUb29sdGlwTW9kdWxlIHt9XG4iXX0=
