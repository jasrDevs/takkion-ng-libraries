/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Inject,
  Input,
  NgZone,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  ANIMATION_MODULE_TYPE,
} from '@angular/core';
import { ViewportRuler } from '@takkion/cdk/scrolling';
import { Platform } from '@takkion/cdk/platform';
import { Directionality } from '@takkion/cdk/bidi';
import { MatTabLabelWrapper } from './tab-label-wrapper';
import { MatInkBar } from './ink-bar';
import { MatPaginatedTabHeader } from './paginated-tab-header';
import { CdkObserveContent } from '@takkion/cdk/observers';
import { MatRipple } from '@takkion/material/core';
import * as i0 from '@angular/core';
import * as i1 from '@takkion/cdk/scrolling';
import * as i2 from '@takkion/cdk/bidi';
import * as i3 from '@takkion/cdk/platform';
/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 * @docs-private
 */
export class MatTabHeader extends MatPaginatedTabHeader {
  constructor(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode) {
    super(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode);
    /** Whether the ripple effect is disabled or not. */
    this.disableRipple = false;
  }
  ngAfterContentInit() {
    this._inkBar = new MatInkBar(this._items);
    super.ngAfterContentInit();
  }
  _itemSelected(event) {
    event.preventDefault();
  }
  static {
    this.ɵfac = i0.ɵɵngDeclareFactory({
      minVersion: '12.0.0',
      version: '17.2.0',
      ngImport: i0,
      type: MatTabHeader,
      deps: [
        { token: i0.ElementRef },
        { token: i0.ChangeDetectorRef },
        { token: i1.ViewportRuler },
        { token: i2.Directionality, optional: true },
        { token: i0.NgZone },
        { token: i3.Platform },
        { token: ANIMATION_MODULE_TYPE, optional: true },
      ],
      target: i0.ɵɵFactoryTarget.Component,
    });
  }
  static {
    this.ɵcmp = i0.ɵɵngDeclareComponent({
      minVersion: '16.1.0',
      version: '17.2.0',
      type: MatTabHeader,
      isStandalone: true,
      selector: 'mat-tab-header',
      inputs: { disableRipple: ['disableRipple', 'disableRipple', booleanAttribute] },
      host: {
        properties: {
          'class.mat-mdc-tab-header-pagination-controls-enabled': '_showPaginationControls',
          'class.mat-mdc-tab-header-rtl': "_getLayoutDirection() == 'rtl'",
        },
        classAttribute: 'mat-mdc-tab-header',
      },
      queries: [{ propertyName: '_items', predicate: MatTabLabelWrapper }],
      viewQueries: [
        {
          propertyName: '_tabListContainer',
          first: true,
          predicate: ['tabListContainer'],
          descendants: true,
          static: true,
        },
        {
          propertyName: '_tabList',
          first: true,
          predicate: ['tabList'],
          descendants: true,
          static: true,
        },
        {
          propertyName: '_tabListInner',
          first: true,
          predicate: ['tabListInner'],
          descendants: true,
          static: true,
        },
        {
          propertyName: '_nextPaginator',
          first: true,
          predicate: ['nextPaginator'],
          descendants: true,
        },
        {
          propertyName: '_previousPaginator',
          first: true,
          predicate: ['previousPaginator'],
          descendants: true,
        },
      ],
      usesInheritance: true,
      ngImport: i0,
      template:
        '<!-- TODO: this also had `mat-elevation-z4`. Figure out what we should do with it. -->\n<button class="mat-mdc-tab-header-pagination mat-mdc-tab-header-pagination-before"\n     #previousPaginator\n     aria-hidden="true"\n     type="button"\n     mat-ripple\n     tabindex="-1"\n     [matRippleDisabled]="_disableScrollBefore || disableRipple"\n     [class.mat-mdc-tab-header-pagination-disabled]="_disableScrollBefore"\n     [disabled]="_disableScrollBefore || null"\n     (click)="_handlePaginatorClick(\'before\')"\n     (mousedown)="_handlePaginatorPress(\'before\', $event)"\n     (touchend)="_stopInterval()">\n  <div class="mat-mdc-tab-header-pagination-chevron"></div>\n</button>\n\n<div\n  class="mat-mdc-tab-label-container"\n  #tabListContainer\n  (keydown)="_handleKeydown($event)"\n  [class._mat-animation-noopable]="_animationMode === \'NoopAnimations\'">\n  <div\n    #tabList\n    class="mat-mdc-tab-list"\n    role="tablist"\n    (cdkObserveContent)="_onContentChanges()">\n    <div class="mat-mdc-tab-labels" #tabListInner>\n      <ng-content></ng-content>\n    </div>\n  </div>\n</div>\n\n<!-- TODO: this also had `mat-elevation-z4`. Figure out what we should do with it. -->\n<button class="mat-mdc-tab-header-pagination mat-mdc-tab-header-pagination-after"\n     #nextPaginator\n     aria-hidden="true"\n     type="button"\n     mat-ripple\n     [matRippleDisabled]="_disableScrollAfter || disableRipple"\n     [class.mat-mdc-tab-header-pagination-disabled]="_disableScrollAfter"\n     [disabled]="_disableScrollAfter || null"\n     tabindex="-1"\n     (mousedown)="_handlePaginatorPress(\'after\', $event)"\n     (click)="_handlePaginatorClick(\'after\')"\n     (touchend)="_stopInterval()">\n  <div class="mat-mdc-tab-header-pagination-chevron"></div>\n</button>\n',
      styles: [
        '.mat-mdc-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mdc-tab-indicator .mdc-tab-indicator__content{transition-duration:var(--mat-tab-animation-duration, 250ms)}.mat-mdc-tab-header-pagination{-webkit-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:none;box-sizing:content-box;background:none;border:none;outline:0;padding:0}.mat-mdc-tab-header-pagination::-moz-focus-inner{border:0}.mat-mdc-tab-header-pagination .mat-ripple-element{opacity:.12;background-color:var(--mat-tab-header-inactive-ripple-color)}.mat-mdc-tab-header-pagination-controls-enabled .mat-mdc-tab-header-pagination{display:flex}.mat-mdc-tab-header-pagination-before,.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after{padding-left:4px}.mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before,.mat-mdc-tab-header-pagination-after{padding-right:4px}.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-mdc-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;height:8px;width:8px;border-color:var(--mat-tab-header-pagination-icon-color)}.mat-mdc-tab-header-pagination-disabled{box-shadow:none;cursor:default;pointer-events:none}.mat-mdc-tab-header-pagination-disabled .mat-mdc-tab-header-pagination-chevron{opacity:.4}.mat-mdc-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable .mat-mdc-tab-list{transition:none}._mat-animation-noopable span.mdc-tab-indicator__content,._mat-animation-noopable span.mdc-tab__text-label{transition:none}.mat-mdc-tab-label-container{display:flex;flex-grow:1;overflow:hidden;z-index:1;border-bottom-style:solid;border-bottom-width:var(--mat-tab-header-divider-height);border-bottom-color:var(--mat-tab-header-divider-color)}.mat-mdc-tab-group-inverted-header .mat-mdc-tab-label-container{border-bottom:none;border-top-style:solid;border-top-width:var(--mat-tab-header-divider-height);border-top-color:var(--mat-tab-header-divider-color)}.mat-mdc-tab-labels{display:flex;flex:1 0 auto}[mat-align-tabs=center]>.mat-mdc-tab-header .mat-mdc-tab-labels{justify-content:center}[mat-align-tabs=end]>.mat-mdc-tab-header .mat-mdc-tab-labels{justify-content:flex-end}.mat-mdc-tab::before{margin:5px}.cdk-high-contrast-active .mat-mdc-tab[aria-disabled=true]{color:GrayText}',
      ],
      dependencies: [
        {
          kind: 'directive',
          type: MatRipple,
          selector: '[mat-ripple], [matRipple]',
          inputs: [
            'matRippleColor',
            'matRippleUnbounded',
            'matRippleCentered',
            'matRippleRadius',
            'matRippleAnimation',
            'matRippleDisabled',
            'matRippleTrigger',
          ],
          exportAs: ['matRipple'],
        },
        {
          kind: 'directive',
          type: CdkObserveContent,
          selector: '[cdkObserveContent]',
          inputs: ['cdkObserveContentDisabled', 'debounce'],
          outputs: ['cdkObserveContent'],
          exportAs: ['cdkObserveContent'],
        },
      ],
      changeDetection: i0.ChangeDetectionStrategy.Default,
      encapsulation: i0.ViewEncapsulation.None,
    });
  }
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '17.2.0',
  ngImport: i0,
  type: MatTabHeader,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-tab-header',
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.Default,
          host: {
            class: 'mat-mdc-tab-header',
            '[class.mat-mdc-tab-header-pagination-controls-enabled]': '_showPaginationControls',
            '[class.mat-mdc-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
          },
          standalone: true,
          imports: [MatRipple, CdkObserveContent],
          template:
            '<!-- TODO: this also had `mat-elevation-z4`. Figure out what we should do with it. -->\n<button class="mat-mdc-tab-header-pagination mat-mdc-tab-header-pagination-before"\n     #previousPaginator\n     aria-hidden="true"\n     type="button"\n     mat-ripple\n     tabindex="-1"\n     [matRippleDisabled]="_disableScrollBefore || disableRipple"\n     [class.mat-mdc-tab-header-pagination-disabled]="_disableScrollBefore"\n     [disabled]="_disableScrollBefore || null"\n     (click)="_handlePaginatorClick(\'before\')"\n     (mousedown)="_handlePaginatorPress(\'before\', $event)"\n     (touchend)="_stopInterval()">\n  <div class="mat-mdc-tab-header-pagination-chevron"></div>\n</button>\n\n<div\n  class="mat-mdc-tab-label-container"\n  #tabListContainer\n  (keydown)="_handleKeydown($event)"\n  [class._mat-animation-noopable]="_animationMode === \'NoopAnimations\'">\n  <div\n    #tabList\n    class="mat-mdc-tab-list"\n    role="tablist"\n    (cdkObserveContent)="_onContentChanges()">\n    <div class="mat-mdc-tab-labels" #tabListInner>\n      <ng-content></ng-content>\n    </div>\n  </div>\n</div>\n\n<!-- TODO: this also had `mat-elevation-z4`. Figure out what we should do with it. -->\n<button class="mat-mdc-tab-header-pagination mat-mdc-tab-header-pagination-after"\n     #nextPaginator\n     aria-hidden="true"\n     type="button"\n     mat-ripple\n     [matRippleDisabled]="_disableScrollAfter || disableRipple"\n     [class.mat-mdc-tab-header-pagination-disabled]="_disableScrollAfter"\n     [disabled]="_disableScrollAfter || null"\n     tabindex="-1"\n     (mousedown)="_handlePaginatorPress(\'after\', $event)"\n     (click)="_handlePaginatorClick(\'after\')"\n     (touchend)="_stopInterval()">\n  <div class="mat-mdc-tab-header-pagination-chevron"></div>\n</button>\n',
          styles: [
            '.mat-mdc-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mdc-tab-indicator .mdc-tab-indicator__content{transition-duration:var(--mat-tab-animation-duration, 250ms)}.mat-mdc-tab-header-pagination{-webkit-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:none;box-sizing:content-box;background:none;border:none;outline:0;padding:0}.mat-mdc-tab-header-pagination::-moz-focus-inner{border:0}.mat-mdc-tab-header-pagination .mat-ripple-element{opacity:.12;background-color:var(--mat-tab-header-inactive-ripple-color)}.mat-mdc-tab-header-pagination-controls-enabled .mat-mdc-tab-header-pagination{display:flex}.mat-mdc-tab-header-pagination-before,.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after{padding-left:4px}.mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before,.mat-mdc-tab-header-pagination-after{padding-right:4px}.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-mdc-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;height:8px;width:8px;border-color:var(--mat-tab-header-pagination-icon-color)}.mat-mdc-tab-header-pagination-disabled{box-shadow:none;cursor:default;pointer-events:none}.mat-mdc-tab-header-pagination-disabled .mat-mdc-tab-header-pagination-chevron{opacity:.4}.mat-mdc-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable .mat-mdc-tab-list{transition:none}._mat-animation-noopable span.mdc-tab-indicator__content,._mat-animation-noopable span.mdc-tab__text-label{transition:none}.mat-mdc-tab-label-container{display:flex;flex-grow:1;overflow:hidden;z-index:1;border-bottom-style:solid;border-bottom-width:var(--mat-tab-header-divider-height);border-bottom-color:var(--mat-tab-header-divider-color)}.mat-mdc-tab-group-inverted-header .mat-mdc-tab-label-container{border-bottom:none;border-top-style:solid;border-top-width:var(--mat-tab-header-divider-height);border-top-color:var(--mat-tab-header-divider-color)}.mat-mdc-tab-labels{display:flex;flex:1 0 auto}[mat-align-tabs=center]>.mat-mdc-tab-header .mat-mdc-tab-labels{justify-content:center}[mat-align-tabs=end]>.mat-mdc-tab-header .mat-mdc-tab-labels{justify-content:flex-end}.mat-mdc-tab::before{margin:5px}.cdk-high-contrast-active .mat-mdc-tab[aria-disabled=true]{color:GrayText}',
          ],
        },
      ],
    },
  ],
  ctorParameters: () => [
    { type: i0.ElementRef },
    { type: i0.ChangeDetectorRef },
    { type: i1.ViewportRuler },
    {
      type: i2.Directionality,
      decorators: [
        {
          type: Optional,
        },
      ],
    },
    { type: i0.NgZone },
    { type: i3.Platform },
    {
      type: undefined,
      decorators: [
        {
          type: Optional,
        },
        {
          type: Inject,
          args: [ANIMATION_MODULE_TYPE],
        },
      ],
    },
  ],
  propDecorators: {
    _items: [
      {
        type: ContentChildren,
        args: [MatTabLabelWrapper, { descendants: false }],
      },
    ],
    _tabListContainer: [
      {
        type: ViewChild,
        args: ['tabListContainer', { static: true }],
      },
    ],
    _tabList: [
      {
        type: ViewChild,
        args: ['tabList', { static: true }],
      },
    ],
    _tabListInner: [
      {
        type: ViewChild,
        args: ['tabListInner', { static: true }],
      },
    ],
    _nextPaginator: [
      {
        type: ViewChild,
        args: ['nextPaginator'],
      },
    ],
    _previousPaginator: [
      {
        type: ViewChild,
        args: ['previousPaginator'],
      },
    ],
    disableRipple: [
      {
        type: Input,
        args: [{ transform: booleanAttribute }],
      },
    ],
  },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL3RhYi1oZWFkZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItaGVhZGVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUlMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFDZixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLGdCQUFnQixFQUNoQixxQkFBcUIsR0FDdEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNwQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM3RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7Ozs7O0FBRWpEOzs7Ozs7R0FNRztBQWdCSCxNQUFNLE9BQU8sWUFDWCxTQUFRLHFCQUFxQjtJQWU3QixZQUNFLFVBQXNCLEVBQ3RCLGlCQUFvQyxFQUNwQyxhQUE0QixFQUNoQixHQUFtQixFQUMvQixNQUFjLEVBQ2QsUUFBa0IsRUFDeUIsYUFBc0I7UUFFakUsS0FBSyxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFiNUYsb0RBQW9EO1FBRXBELGtCQUFhLEdBQVksS0FBSyxDQUFDO0lBWS9CLENBQUM7SUFFUSxrQkFBa0I7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVTLGFBQWEsQ0FBQyxLQUFvQjtRQUMxQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekIsQ0FBQzs4R0FuQ1UsWUFBWSxzTUF1QkQscUJBQXFCO2tHQXZCaEMsWUFBWSw4R0FhSixnQkFBZ0IseVFBVGxCLGtCQUFrQix1bEJDL0RyQyw2eURBK0NBLCt5RkRVWSxTQUFTLHdQQUFFLGlCQUFpQjs7MkZBRTNCLFlBQVk7a0JBZnhCLFNBQVM7K0JBQ0UsZ0JBQWdCLGlCQUdYLGlCQUFpQixDQUFDLElBQUksbUJBRXBCLHVCQUF1QixDQUFDLE9BQU8sUUFDMUM7d0JBQ0osT0FBTyxFQUFFLG9CQUFvQjt3QkFDN0Isd0RBQXdELEVBQUUseUJBQXlCO3dCQUNuRixnQ0FBZ0MsRUFBRSxnQ0FBZ0M7cUJBQ25FLGNBQ1csSUFBSSxXQUNQLENBQUMsU0FBUyxFQUFFLGlCQUFpQixDQUFDOzswQkFzQnBDLFFBQVE7OzBCQUdSLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCO3lDQW5CZ0IsTUFBTTtzQkFBaEUsZUFBZTt1QkFBQyxrQkFBa0IsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUM7Z0JBQ1YsaUJBQWlCO3NCQUEvRCxTQUFTO3VCQUFDLGtCQUFrQixFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztnQkFDUCxRQUFRO3NCQUE3QyxTQUFTO3VCQUFDLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7Z0JBQ08sYUFBYTtzQkFBdkQsU0FBUzt1QkFBQyxjQUFjLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2dCQUNiLGNBQWM7c0JBQXpDLFNBQVM7dUJBQUMsZUFBZTtnQkFDTSxrQkFBa0I7c0JBQWpELFNBQVM7dUJBQUMsbUJBQW1CO2dCQUs5QixhQUFhO3NCQURaLEtBQUs7dUJBQUMsRUFBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG4gIEFOSU1BVElPTl9NT0RVTEVfVFlQRSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7TWF0VGFiTGFiZWxXcmFwcGVyfSBmcm9tICcuL3RhYi1sYWJlbC13cmFwcGVyJztcbmltcG9ydCB7TWF0SW5rQmFyfSBmcm9tICcuL2luay1iYXInO1xuaW1wb3J0IHtNYXRQYWdpbmF0ZWRUYWJIZWFkZXJ9IGZyb20gJy4vcGFnaW5hdGVkLXRhYi1oZWFkZXInO1xuaW1wb3J0IHtDZGtPYnNlcnZlQ29udGVudH0gZnJvbSAnQGFuZ3VsYXIvY2RrL29ic2VydmVycyc7XG5pbXBvcnQge01hdFJpcHBsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cbi8qKlxuICogVGhlIGhlYWRlciBvZiB0aGUgdGFiIGdyb3VwIHdoaWNoIGRpc3BsYXlzIGEgbGlzdCBvZiBhbGwgdGhlIHRhYnMgaW4gdGhlIHRhYiBncm91cC4gSW5jbHVkZXNcbiAqIGFuIGluayBiYXIgdGhhdCBmb2xsb3dzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgdGFiLiBXaGVuIHRoZSB0YWJzIGxpc3QncyB3aWR0aCBleGNlZWRzIHRoZVxuICogd2lkdGggb2YgdGhlIGhlYWRlciBjb250YWluZXIsIHRoZW4gYXJyb3dzIHdpbGwgYmUgZGlzcGxheWVkIHRvIGFsbG93IHRoZSB1c2VyIHRvIHNjcm9sbFxuICogbGVmdCBhbmQgcmlnaHQgYWNyb3NzIHRoZSBoZWFkZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWItaGVhZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICd0YWItaGVhZGVyLmh0bWwnLFxuICBzdHlsZVVybDogJ3RhYi1oZWFkZXIuY3NzJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtdGFiLWhlYWRlcicsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLXRhYi1oZWFkZXItcGFnaW5hdGlvbi1jb250cm9scy1lbmFibGVkXSc6ICdfc2hvd1BhZ2luYXRpb25Db250cm9scycsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLXRhYi1oZWFkZXItcnRsXSc6IFwiX2dldExheW91dERpcmVjdGlvbigpID09ICdydGwnXCIsXG4gIH0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtNYXRSaXBwbGUsIENka09ic2VydmVDb250ZW50XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiSGVhZGVyXG4gIGV4dGVuZHMgTWF0UGFnaW5hdGVkVGFiSGVhZGVyXG4gIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95XG57XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0VGFiTGFiZWxXcmFwcGVyLCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgX2l0ZW1zOiBRdWVyeUxpc3Q8TWF0VGFiTGFiZWxXcmFwcGVyPjtcbiAgQFZpZXdDaGlsZCgndGFiTGlzdENvbnRhaW5lcicsIHtzdGF0aWM6IHRydWV9KSBfdGFiTGlzdENvbnRhaW5lcjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgndGFiTGlzdCcsIHtzdGF0aWM6IHRydWV9KSBfdGFiTGlzdDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgndGFiTGlzdElubmVyJywge3N0YXRpYzogdHJ1ZX0pIF90YWJMaXN0SW5uZXI6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ25leHRQYWdpbmF0b3InKSBfbmV4dFBhZ2luYXRvcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3ByZXZpb3VzUGFnaW5hdG9yJykgX3ByZXZpb3VzUGFnaW5hdG9yOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgX2lua0JhcjogTWF0SW5rQmFyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByaXBwbGUgZWZmZWN0IGlzIGRpc2FibGVkIG9yIG5vdC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBkaXNhYmxlUmlwcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgY2hhbmdlRGV0ZWN0b3JSZWYsIHZpZXdwb3J0UnVsZXIsIGRpciwgbmdab25lLCBwbGF0Zm9ybSwgYW5pbWF0aW9uTW9kZSk7XG4gIH1cblxuICBvdmVycmlkZSBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5faW5rQmFyID0gbmV3IE1hdElua0Jhcih0aGlzLl9pdGVtcyk7XG4gICAgc3VwZXIubmdBZnRlckNvbnRlbnRJbml0KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2l0ZW1TZWxlY3RlZChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbn1cbiIsIjwhLS0gVE9ETzogdGhpcyBhbHNvIGhhZCBgbWF0LWVsZXZhdGlvbi16NGAuIEZpZ3VyZSBvdXQgd2hhdCB3ZSBzaG91bGQgZG8gd2l0aCBpdC4gLS0+XG48YnV0dG9uIGNsYXNzPVwibWF0LW1kYy10YWItaGVhZGVyLXBhZ2luYXRpb24gbWF0LW1kYy10YWItaGVhZGVyLXBhZ2luYXRpb24tYmVmb3JlXCJcbiAgICAgI3ByZXZpb3VzUGFnaW5hdG9yXG4gICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgIHR5cGU9XCJidXR0b25cIlxuICAgICBtYXQtcmlwcGxlXG4gICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICBbbWF0UmlwcGxlRGlzYWJsZWRdPVwiX2Rpc2FibGVTY3JvbGxCZWZvcmUgfHwgZGlzYWJsZVJpcHBsZVwiXG4gICAgIFtjbGFzcy5tYXQtbWRjLXRhYi1oZWFkZXItcGFnaW5hdGlvbi1kaXNhYmxlZF09XCJfZGlzYWJsZVNjcm9sbEJlZm9yZVwiXG4gICAgIFtkaXNhYmxlZF09XCJfZGlzYWJsZVNjcm9sbEJlZm9yZSB8fCBudWxsXCJcbiAgICAgKGNsaWNrKT1cIl9oYW5kbGVQYWdpbmF0b3JDbGljaygnYmVmb3JlJylcIlxuICAgICAobW91c2Vkb3duKT1cIl9oYW5kbGVQYWdpbmF0b3JQcmVzcygnYmVmb3JlJywgJGV2ZW50KVwiXG4gICAgICh0b3VjaGVuZCk9XCJfc3RvcEludGVydmFsKClcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtdGFiLWhlYWRlci1wYWdpbmF0aW9uLWNoZXZyb25cIj48L2Rpdj5cbjwvYnV0dG9uPlxuXG48ZGl2XG4gIGNsYXNzPVwibWF0LW1kYy10YWItbGFiZWwtY29udGFpbmVyXCJcbiAgI3RhYkxpc3RDb250YWluZXJcbiAgKGtleWRvd24pPVwiX2hhbmRsZUtleWRvd24oJGV2ZW50KVwiXG4gIFtjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV09XCJfYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJ1wiPlxuICA8ZGl2XG4gICAgI3RhYkxpc3RcbiAgICBjbGFzcz1cIm1hdC1tZGMtdGFiLWxpc3RcIlxuICAgIHJvbGU9XCJ0YWJsaXN0XCJcbiAgICAoY2RrT2JzZXJ2ZUNvbnRlbnQpPVwiX29uQ29udGVudENoYW5nZXMoKVwiPlxuICAgIDxkaXYgY2xhc3M9XCJtYXQtbWRjLXRhYi1sYWJlbHNcIiAjdGFiTGlzdElubmVyPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuXG48IS0tIFRPRE86IHRoaXMgYWxzbyBoYWQgYG1hdC1lbGV2YXRpb24tejRgLiBGaWd1cmUgb3V0IHdoYXQgd2Ugc2hvdWxkIGRvIHdpdGggaXQuIC0tPlxuPGJ1dHRvbiBjbGFzcz1cIm1hdC1tZGMtdGFiLWhlYWRlci1wYWdpbmF0aW9uIG1hdC1tZGMtdGFiLWhlYWRlci1wYWdpbmF0aW9uLWFmdGVyXCJcbiAgICAgI25leHRQYWdpbmF0b3JcbiAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgIG1hdC1yaXBwbGVcbiAgICAgW21hdFJpcHBsZURpc2FibGVkXT1cIl9kaXNhYmxlU2Nyb2xsQWZ0ZXIgfHwgZGlzYWJsZVJpcHBsZVwiXG4gICAgIFtjbGFzcy5tYXQtbWRjLXRhYi1oZWFkZXItcGFnaW5hdGlvbi1kaXNhYmxlZF09XCJfZGlzYWJsZVNjcm9sbEFmdGVyXCJcbiAgICAgW2Rpc2FibGVkXT1cIl9kaXNhYmxlU2Nyb2xsQWZ0ZXIgfHwgbnVsbFwiXG4gICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAobW91c2Vkb3duKT1cIl9oYW5kbGVQYWdpbmF0b3JQcmVzcygnYWZ0ZXInLCAkZXZlbnQpXCJcbiAgICAgKGNsaWNrKT1cIl9oYW5kbGVQYWdpbmF0b3JDbGljaygnYWZ0ZXInKVwiXG4gICAgICh0b3VjaGVuZCk9XCJfc3RvcEludGVydmFsKClcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtdGFiLWhlYWRlci1wYWdpbmF0aW9uLWNoZXZyb25cIj48L2Rpdj5cbjwvYnV0dG9uPlxuIl19
