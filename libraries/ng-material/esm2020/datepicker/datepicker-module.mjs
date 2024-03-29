/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { A11yModule } from '@takkion/ng-cdk/a11y';
import { OverlayModule } from '@takkion/ng-cdk/overlay';
import { PortalModule } from '@takkion/ng-cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TakButtonModule } from '@takkion/ng-material/button';
import { CdkScrollableModule } from '@takkion/ng-cdk/scrolling';
import { TakCommonModule } from '@takkion/ng-material/core';
import { TakCalendar, TakCalendarHeader } from './calendar';
import { TakCalendarBody } from './calendar-body';
import { TakDatepicker } from './datepicker';
import {
  TakDatepickerContent,
  TAK_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './datepicker-base';
import { TakDatepickerInput } from './datepicker-input';
import { TakDatepickerIntl } from './datepicker-intl';
import { TakDatepickerToggle, TakDatepickerToggleIcon } from './datepicker-toggle';
import { TakMonthView } from './month-view';
import { TakMultiYearView } from './multi-year-view';
import { TakYearView } from './year-view';
import { TakDateRangeInput } from './date-range-input';
import { TakStartDate, TakEndDate } from './date-range-input-parts';
import { TakDateRangePicker } from './date-range-picker';
import {
  TakDatepickerActions,
  TakDatepickerApply,
  TakDatepickerCancel,
} from './datepicker-actions';
import * as i0 from '@angular/core';
export class TakDatepickerModule {}
TakDatepickerModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakDatepickerModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
TakDatepickerModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakDatepickerModule,
  declarations: [
    TakCalendar,
    TakCalendarBody,
    TakDatepicker,
    TakDatepickerContent,
    TakDatepickerInput,
    TakDatepickerToggle,
    TakDatepickerToggleIcon,
    TakMonthView,
    TakYearView,
    TakMultiYearView,
    TakCalendarHeader,
    TakDateRangeInput,
    TakStartDate,
    TakEndDate,
    TakDateRangePicker,
    TakDatepickerActions,
    TakDatepickerCancel,
    TakDatepickerApply,
  ],
  imports: [
    CommonModule,
    TakButtonModule,
    OverlayModule,
    A11yModule,
    PortalModule,
    TakCommonModule,
  ],
  exports: [
    CdkScrollableModule,
    TakCalendar,
    TakCalendarBody,
    TakDatepicker,
    TakDatepickerContent,
    TakDatepickerInput,
    TakDatepickerToggle,
    TakDatepickerToggleIcon,
    TakMonthView,
    TakYearView,
    TakMultiYearView,
    TakCalendarHeader,
    TakDateRangeInput,
    TakStartDate,
    TakEndDate,
    TakDateRangePicker,
    TakDatepickerActions,
    TakDatepickerCancel,
    TakDatepickerApply,
  ],
});
TakDatepickerModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakDatepickerModule,
  providers: [TakDatepickerIntl, TAK_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER],
  imports: [
    CommonModule,
    TakButtonModule,
    OverlayModule,
    A11yModule,
    PortalModule,
    TakCommonModule,
    CdkScrollableModule,
  ],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakDatepickerModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          imports: [
            CommonModule,
            TakButtonModule,
            OverlayModule,
            A11yModule,
            PortalModule,
            TakCommonModule,
          ],
          exports: [
            CdkScrollableModule,
            TakCalendar,
            TakCalendarBody,
            TakDatepicker,
            TakDatepickerContent,
            TakDatepickerInput,
            TakDatepickerToggle,
            TakDatepickerToggleIcon,
            TakMonthView,
            TakYearView,
            TakMultiYearView,
            TakCalendarHeader,
            TakDateRangeInput,
            TakStartDate,
            TakEndDate,
            TakDateRangePicker,
            TakDatepickerActions,
            TakDatepickerCancel,
            TakDatepickerApply,
          ],
          declarations: [
            TakCalendar,
            TakCalendarBody,
            TakDatepicker,
            TakDatepickerContent,
            TakDatepickerInput,
            TakDatepickerToggle,
            TakDatepickerToggleIcon,
            TakMonthView,
            TakYearView,
            TakMultiYearView,
            TakCalendarHeader,
            TakDateRangeInput,
            TakStartDate,
            TakEndDate,
            TakDateRangePicker,
            TakDatepickerActions,
            TakDatepickerCancel,
            TakDatepickerApply,
          ],
          providers: [TakDatepickerIntl, TAK_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER],
        },
      ],
    },
  ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlcGlja2VyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxXQUFXLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDMUQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDM0MsT0FBTyxFQUNMLG9CQUFvQixFQUNwQiwrQ0FBK0MsR0FDaEQsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUUsdUJBQXVCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFDLFlBQVksRUFBRSxVQUFVLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNsRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7QUFzRG5HLE1BQU0sT0FBTyxtQkFBbUI7O2dIQUFuQixtQkFBbUI7aUhBQW5CLG1CQUFtQixpQkFyQjVCLFdBQVc7UUFDWCxlQUFlO1FBQ2YsYUFBYTtRQUNiLG9CQUFvQjtRQUNwQixrQkFBa0I7UUFDbEIsbUJBQW1CO1FBQ25CLHVCQUF1QjtRQUN2QixZQUFZO1FBQ1osV0FBVztRQUNYLGdCQUFnQjtRQUNoQixpQkFBaUI7UUFDakIsaUJBQWlCO1FBQ2pCLFlBQVk7UUFDWixVQUFVO1FBQ1Ysa0JBQWtCO1FBQ2xCLG9CQUFvQjtRQUNwQixtQkFBbUI7UUFDbkIsa0JBQWtCLGFBOUNsQixZQUFZO1FBQ1osZUFBZTtRQUNmLGFBQWE7UUFDYixVQUFVO1FBQ1YsWUFBWTtRQUNaLGVBQWUsYUFHZixtQkFBbUI7UUFDbkIsV0FBVztRQUNYLGVBQWU7UUFDZixhQUFhO1FBQ2Isb0JBQW9CO1FBQ3BCLGtCQUFrQjtRQUNsQixtQkFBbUI7UUFDbkIsdUJBQXVCO1FBQ3ZCLFlBQVk7UUFDWixXQUFXO1FBQ1gsZ0JBQWdCO1FBQ2hCLGlCQUFpQjtRQUNqQixpQkFBaUI7UUFDakIsWUFBWTtRQUNaLFVBQVU7UUFDVixrQkFBa0I7UUFDbEIsb0JBQW9CO1FBQ3BCLG1CQUFtQjtRQUNuQixrQkFBa0I7aUhBd0JULG1CQUFtQixhQUZuQixDQUFDLGlCQUFpQixFQUFFLCtDQUErQyxDQUFDLFlBaEQ3RSxZQUFZO1FBQ1osZUFBZTtRQUNmLGFBQWE7UUFDYixVQUFVO1FBQ1YsWUFBWTtRQUNaLGVBQWUsRUFHZixtQkFBbUI7MkZBMENWLG1CQUFtQjtrQkFwRC9CLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixhQUFhO3dCQUNiLFVBQVU7d0JBQ1YsWUFBWTt3QkFDWixlQUFlO3FCQUNoQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsbUJBQW1CO3dCQUNuQixXQUFXO3dCQUNYLGVBQWU7d0JBQ2YsYUFBYTt3QkFDYixvQkFBb0I7d0JBQ3BCLGtCQUFrQjt3QkFDbEIsbUJBQW1CO3dCQUNuQix1QkFBdUI7d0JBQ3ZCLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxnQkFBZ0I7d0JBQ2hCLGlCQUFpQjt3QkFDakIsaUJBQWlCO3dCQUNqQixZQUFZO3dCQUNaLFVBQVU7d0JBQ1Ysa0JBQWtCO3dCQUNsQixvQkFBb0I7d0JBQ3BCLG1CQUFtQjt3QkFDbkIsa0JBQWtCO3FCQUNuQjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osV0FBVzt3QkFDWCxlQUFlO3dCQUNmLGFBQWE7d0JBQ2Isb0JBQW9CO3dCQUNwQixrQkFBa0I7d0JBQ2xCLG1CQUFtQjt3QkFDbkIsdUJBQXVCO3dCQUN2QixZQUFZO3dCQUNaLFdBQVc7d0JBQ1gsZ0JBQWdCO3dCQUNoQixpQkFBaUI7d0JBQ2pCLGlCQUFpQjt3QkFDakIsWUFBWTt3QkFDWixVQUFVO3dCQUNWLGtCQUFrQjt3QkFDbEIsb0JBQW9CO3dCQUNwQixtQkFBbUI7d0JBQ25CLGtCQUFrQjtxQkFDbkI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsK0NBQStDLENBQUM7aUJBQ2hGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QTExeU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtPdmVybGF5TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge1BvcnRhbE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRCdXR0b25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XG5pbXBvcnQge0Nka1Njcm9sbGFibGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRDYWxlbmRhciwgTWF0Q2FsZW5kYXJIZWFkZXJ9IGZyb20gJy4vY2FsZW5kYXInO1xuaW1wb3J0IHtNYXRDYWxlbmRhckJvZHl9IGZyb20gJy4vY2FsZW5kYXItYm9keSc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJ9IGZyb20gJy4vZGF0ZXBpY2tlcic7XG5pbXBvcnQge1xuICBNYXREYXRlcGlja2VyQ29udGVudCxcbiAgTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIsXG59IGZyb20gJy4vZGF0ZXBpY2tlci1iYXNlJztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlcklucHV0fSBmcm9tICcuL2RhdGVwaWNrZXItaW5wdXQnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW50bH0gZnJvbSAnLi9kYXRlcGlja2VyLWludGwnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VyVG9nZ2xlLCBNYXREYXRlcGlja2VyVG9nZ2xlSWNvbn0gZnJvbSAnLi9kYXRlcGlja2VyLXRvZ2dsZSc7XG5pbXBvcnQge01hdE1vbnRoVmlld30gZnJvbSAnLi9tb250aC12aWV3JztcbmltcG9ydCB7TWF0TXVsdGlZZWFyVmlld30gZnJvbSAnLi9tdWx0aS15ZWFyLXZpZXcnO1xuaW1wb3J0IHtNYXRZZWFyVmlld30gZnJvbSAnLi95ZWFyLXZpZXcnO1xuaW1wb3J0IHtNYXREYXRlUmFuZ2VJbnB1dH0gZnJvbSAnLi9kYXRlLXJhbmdlLWlucHV0JztcbmltcG9ydCB7TWF0U3RhcnREYXRlLCBNYXRFbmREYXRlfSBmcm9tICcuL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMnO1xuaW1wb3J0IHtNYXREYXRlUmFuZ2VQaWNrZXJ9IGZyb20gJy4vZGF0ZS1yYW5nZS1waWNrZXInO1xuaW1wb3J0IHtNYXREYXRlcGlja2VyQWN0aW9ucywgTWF0RGF0ZXBpY2tlckFwcGx5LCBNYXREYXRlcGlja2VyQ2FuY2VsfSBmcm9tICcuL2RhdGVwaWNrZXItYWN0aW9ucyc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxuICAgIE92ZXJsYXlNb2R1bGUsXG4gICAgQTExeU1vZHVsZSxcbiAgICBQb3J0YWxNb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgQ2RrU2Nyb2xsYWJsZU1vZHVsZSxcbiAgICBNYXRDYWxlbmRhcixcbiAgICBNYXRDYWxlbmRhckJvZHksXG4gICAgTWF0RGF0ZXBpY2tlcixcbiAgICBNYXREYXRlcGlja2VyQ29udGVudCxcbiAgICBNYXREYXRlcGlja2VySW5wdXQsXG4gICAgTWF0RGF0ZXBpY2tlclRvZ2dsZSxcbiAgICBNYXREYXRlcGlja2VyVG9nZ2xlSWNvbixcbiAgICBNYXRNb250aFZpZXcsXG4gICAgTWF0WWVhclZpZXcsXG4gICAgTWF0TXVsdGlZZWFyVmlldyxcbiAgICBNYXRDYWxlbmRhckhlYWRlcixcbiAgICBNYXREYXRlUmFuZ2VJbnB1dCxcbiAgICBNYXRTdGFydERhdGUsXG4gICAgTWF0RW5kRGF0ZSxcbiAgICBNYXREYXRlUmFuZ2VQaWNrZXIsXG4gICAgTWF0RGF0ZXBpY2tlckFjdGlvbnMsXG4gICAgTWF0RGF0ZXBpY2tlckNhbmNlbCxcbiAgICBNYXREYXRlcGlja2VyQXBwbHksXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE1hdENhbGVuZGFyLFxuICAgIE1hdENhbGVuZGFyQm9keSxcbiAgICBNYXREYXRlcGlja2VyLFxuICAgIE1hdERhdGVwaWNrZXJDb250ZW50LFxuICAgIE1hdERhdGVwaWNrZXJJbnB1dCxcbiAgICBNYXREYXRlcGlja2VyVG9nZ2xlLFxuICAgIE1hdERhdGVwaWNrZXJUb2dnbGVJY29uLFxuICAgIE1hdE1vbnRoVmlldyxcbiAgICBNYXRZZWFyVmlldyxcbiAgICBNYXRNdWx0aVllYXJWaWV3LFxuICAgIE1hdENhbGVuZGFySGVhZGVyLFxuICAgIE1hdERhdGVSYW5nZUlucHV0LFxuICAgIE1hdFN0YXJ0RGF0ZSxcbiAgICBNYXRFbmREYXRlLFxuICAgIE1hdERhdGVSYW5nZVBpY2tlcixcbiAgICBNYXREYXRlcGlja2VyQWN0aW9ucyxcbiAgICBNYXREYXRlcGlja2VyQ2FuY2VsLFxuICAgIE1hdERhdGVwaWNrZXJBcHBseSxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbTWF0RGF0ZXBpY2tlckludGwsIE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXBpY2tlck1vZHVsZSB7fVxuIl19
