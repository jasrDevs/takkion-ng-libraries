/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@takkion/ng-cdk/bidi';
import { ViewportRuler } from '@takkion/ng-cdk/scrolling';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  NgZone,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  Input,
  Inject,
  Directive,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { coerceBooleanProperty } from '@takkion/ng-cdk/coercion';
import { TakInkBar } from './ink-bar';
import { TakTabLabelWrapper } from './tab-label-wrapper';
import { Platform } from '@takkion/ng-cdk/platform';
import { TakPaginatedTabHeader } from './paginated-tab-header';
import * as i0 from '@angular/core';
import * as i1 from '@takkion/ng-cdk/scrolling';
import * as i2 from '@takkion/ng-cdk/bidi';
import * as i3 from '@takkion/ng-cdk/platform';
import * as i4 from '@takkion/ng-material/core';
import * as i5 from '@takkion/ng-cdk/observers';
import * as i6 from './ink-bar';
/**
 * Base class with all of the `TakTabHeader` functionality.
 * @docs-private
 */
export class _TakTabHeaderBase extends TakPaginatedTabHeader {
  constructor(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode) {
    super(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode);
    this._disableRipple = false;
  }
  /** Whether the ripple effect is disabled or not. */
  get disableRipple() {
    return this._disableRipple;
  }
  set disableRipple(value) {
    this._disableRipple = coerceBooleanProperty(value);
  }
  _itemSelected(event) {
    event.preventDefault();
  }
}
_TakTabHeaderBase.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakTabHeaderBase,
  deps: [
    { token: i0.ElementRef },
    { token: i0.ChangeDetectorRef },
    { token: i1.ViewportRuler },
    { token: i2.Directionality, optional: true },
    { token: i0.NgZone },
    { token: i3.Platform },
    { token: ANIMATION_MODULE_TYPE, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Directive,
});
_TakTabHeaderBase.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: _TakTabHeaderBase,
  inputs: { disableRipple: 'disableRipple' },
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakTabHeaderBase,
  decorators: [
    {
      type: Directive,
    },
  ],
  ctorParameters: function () {
    return [
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
    ];
  },
  propDecorators: {
    disableRipple: [
      {
        type: Input,
      },
    ],
  },
});
/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 * @docs-private
 */
export class TakTabHeader extends _TakTabHeaderBase {
  constructor(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode) {
    super(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode);
  }
}
TakTabHeader.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabHeader,
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
TakTabHeader.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakTabHeader,
  selector: 'tak-tab-header',
  inputs: { selectedIndex: 'selectedIndex' },
  outputs: { selectFocusedIndex: 'selectFocusedIndex', indexFocused: 'indexFocused' },
  host: {
    properties: {
      'class.tak-tab-header-pagination-controls-enabled': '_showPaginationControls',
      'class.tak-tab-header-rtl': "_getLayoutDirection() == 'rtl'",
    },
    classAttribute: 'tak-tab-header',
  },
  queries: [{ propertyName: '_items', predicate: TakTabLabelWrapper }],
  viewQueries: [
    { propertyName: '_inkBar', first: true, predicate: TakInkBar, descendants: true, static: true },
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
    '<button class="tak-tab-header-pagination tak-tab-header-pagination-before tak-elevation-z4"\n     #previousPaginator\n     aria-hidden="true"\n     type="button"\n     tak-ripple\n     tabindex="-1"\n     [takRippleDisabled]="_disableScrollBefore || disableRipple"\n     [class.tak-tab-header-pagination-disabled]="_disableScrollBefore"\n     [disabled]="_disableScrollBefore || null"\n     (click)="_handlePaginatorClick(\'before\')"\n     (mousedown)="_handlePaginatorPress(\'before\', $event)"\n     (touchend)="_stopInterval()">\n  <div class="tak-tab-header-pagination-chevron"></div>\n</button>\n\n<div class="tak-tab-label-container" #tabListContainer (keydown)="_handleKeydown($event)">\n  <div\n    #tabList\n    class="tak-tab-list"\n    [class._tak-animation-noopable]="_animationMode === \'NoopAnimations\'"\n    role="tablist"\n    (cdkObserveContent)="_onContentChanges()">\n    <div class="tak-tab-labels" #tabListInner>\n      <ng-content></ng-content>\n    </div>\n    <tak-ink-bar></tak-ink-bar>\n  </div>\n</div>\n\n<button class="tak-tab-header-pagination tak-tab-header-pagination-after tak-elevation-z4"\n     #nextPaginator\n     aria-hidden="true"\n     type="button"\n     tak-ripple\n     [takRippleDisabled]="_disableScrollAfter || disableRipple"\n     [class.tak-tab-header-pagination-disabled]="_disableScrollAfter"\n     [disabled]="_disableScrollAfter || null"\n     tabindex="-1"\n     (mousedown)="_handlePaginatorPress(\'after\', $event)"\n     (click)="_handlePaginatorClick(\'after\')"\n     (touchend)="_stopInterval()">\n  <div class="tak-tab-header-pagination-chevron"></div>\n</button>\n',
  styles: [
    '.tak-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.tak-tab-header-pagination{-webkit-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:none;box-sizing:content-box;background:none;border:none;outline:0;padding:0}.tak-tab-header-pagination::-moz-focus-inner{border:0}.tak-tab-header-pagination-controls-enabled .tak-tab-header-pagination{display:flex}.tak-tab-header-pagination-before,.tak-tab-header-rtl .tak-tab-header-pagination-after{padding-left:4px}.tak-tab-header-pagination-before .tak-tab-header-pagination-chevron,.tak-tab-header-rtl .tak-tab-header-pagination-after .tak-tab-header-pagination-chevron{transform:rotate(-135deg)}.tak-tab-header-rtl .tak-tab-header-pagination-before,.tak-tab-header-pagination-after{padding-right:4px}.tak-tab-header-rtl .tak-tab-header-pagination-before .tak-tab-header-pagination-chevron,.tak-tab-header-pagination-after .tak-tab-header-pagination-chevron{transform:rotate(45deg)}.tak-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;height:8px;width:8px}.tak-tab-header-pagination-disabled{box-shadow:none;cursor:default}.tak-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.tak-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}.tak-ink-bar._tak-animation-noopable{transition:none !important;animation:none !important}.tak-tab-group-inverted-header .tak-ink-bar{bottom:auto;top:0}.cdk-high-contrast-active .tak-ink-bar{outline:solid 2px;height:0}.tak-tab-labels{display:flex}[tak-align-tabs=center]>.tak-tab-header .tak-tab-labels{justify-content:center}[tak-align-tabs=end]>.tak-tab-header .tak-tab-labels{justify-content:flex-end}.tak-tab-label-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.tak-tab-list._tak-animation-noopable{transition:none !important;animation:none !important}.tak-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.tak-tab-label:focus{outline:none}.tak-tab-label:focus:not(.tak-tab-disabled){opacity:1}.tak-tab-label.tak-tab-disabled{cursor:default}.cdk-high-contrast-active .tak-tab-label.tak-tab-disabled{opacity:.5}.tak-tab-label .tak-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .tak-tab-label{opacity:1}.tak-tab-label::before{margin:5px}@media(max-width: 599px){.tak-tab-label{min-width:72px}}',
  ],
  dependencies: [
    {
      kind: 'directive',
      type: i4.TakRipple,
      selector: '[tak-ripple], [takRipple]',
      inputs: [
        'takRippleColor',
        'takRippleUnbounded',
        'takRippleCentered',
        'takRippleRadius',
        'takRippleAnimation',
        'takRippleDisabled',
        'takRippleTrigger',
      ],
      exportAs: ['takRipple'],
    },
    {
      kind: 'directive',
      type: i5.CdkObserveContent,
      selector: '[cdkObserveContent]',
      inputs: ['cdkObserveContentDisabled', 'debounce'],
      outputs: ['cdkObserveContent'],
      exportAs: ['cdkObserveContent'],
    },
    { kind: 'directive', type: i6.TakInkBar, selector: 'tak-ink-bar' },
  ],
  changeDetection: i0.ChangeDetectionStrategy.Default,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabHeader,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'tak-tab-header',
          inputs: ['selectedIndex'],
          outputs: ['selectFocusedIndex', 'indexFocused'],
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.Default,
          host: {
            class: 'tak-tab-header',
            '[class.tak-tab-header-pagination-controls-enabled]': '_showPaginationControls',
            '[class.tak-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
          },
          template:
            '<button class="tak-tab-header-pagination tak-tab-header-pagination-before tak-elevation-z4"\n     #previousPaginator\n     aria-hidden="true"\n     type="button"\n     tak-ripple\n     tabindex="-1"\n     [takRippleDisabled]="_disableScrollBefore || disableRipple"\n     [class.tak-tab-header-pagination-disabled]="_disableScrollBefore"\n     [disabled]="_disableScrollBefore || null"\n     (click)="_handlePaginatorClick(\'before\')"\n     (mousedown)="_handlePaginatorPress(\'before\', $event)"\n     (touchend)="_stopInterval()">\n  <div class="tak-tab-header-pagination-chevron"></div>\n</button>\n\n<div class="tak-tab-label-container" #tabListContainer (keydown)="_handleKeydown($event)">\n  <div\n    #tabList\n    class="tak-tab-list"\n    [class._tak-animation-noopable]="_animationMode === \'NoopAnimations\'"\n    role="tablist"\n    (cdkObserveContent)="_onContentChanges()">\n    <div class="tak-tab-labels" #tabListInner>\n      <ng-content></ng-content>\n    </div>\n    <tak-ink-bar></tak-ink-bar>\n  </div>\n</div>\n\n<button class="tak-tab-header-pagination tak-tab-header-pagination-after tak-elevation-z4"\n     #nextPaginator\n     aria-hidden="true"\n     type="button"\n     tak-ripple\n     [takRippleDisabled]="_disableScrollAfter || disableRipple"\n     [class.tak-tab-header-pagination-disabled]="_disableScrollAfter"\n     [disabled]="_disableScrollAfter || null"\n     tabindex="-1"\n     (mousedown)="_handlePaginatorPress(\'after\', $event)"\n     (click)="_handlePaginatorClick(\'after\')"\n     (touchend)="_stopInterval()">\n  <div class="tak-tab-header-pagination-chevron"></div>\n</button>\n',
          styles: [
            '.tak-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.tak-tab-header-pagination{-webkit-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:none;box-sizing:content-box;background:none;border:none;outline:0;padding:0}.tak-tab-header-pagination::-moz-focus-inner{border:0}.tak-tab-header-pagination-controls-enabled .tak-tab-header-pagination{display:flex}.tak-tab-header-pagination-before,.tak-tab-header-rtl .tak-tab-header-pagination-after{padding-left:4px}.tak-tab-header-pagination-before .tak-tab-header-pagination-chevron,.tak-tab-header-rtl .tak-tab-header-pagination-after .tak-tab-header-pagination-chevron{transform:rotate(-135deg)}.tak-tab-header-rtl .tak-tab-header-pagination-before,.tak-tab-header-pagination-after{padding-right:4px}.tak-tab-header-rtl .tak-tab-header-pagination-before .tak-tab-header-pagination-chevron,.tak-tab-header-pagination-after .tak-tab-header-pagination-chevron{transform:rotate(45deg)}.tak-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;height:8px;width:8px}.tak-tab-header-pagination-disabled{box-shadow:none;cursor:default}.tak-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.tak-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}.tak-ink-bar._tak-animation-noopable{transition:none !important;animation:none !important}.tak-tab-group-inverted-header .tak-ink-bar{bottom:auto;top:0}.cdk-high-contrast-active .tak-ink-bar{outline:solid 2px;height:0}.tak-tab-labels{display:flex}[tak-align-tabs=center]>.tak-tab-header .tak-tab-labels{justify-content:center}[tak-align-tabs=end]>.tak-tab-header .tak-tab-labels{justify-content:flex-end}.tak-tab-label-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.tak-tab-list._tak-animation-noopable{transition:none !important;animation:none !important}.tak-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.tak-tab-label:focus{outline:none}.tak-tab-label:focus:not(.tak-tab-disabled){opacity:1}.tak-tab-label.tak-tab-disabled{cursor:default}.cdk-high-contrast-active .tak-tab-label.tak-tab-disabled{opacity:.5}.tak-tab-label .tak-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .tak-tab-label{opacity:1}.tak-tab-label::before{margin:5px}@media(max-width: 599px){.tak-tab-label{min-width:72px}}',
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
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
    ];
  },
  propDecorators: {
    _items: [
      {
        type: ContentChildren,
        args: [TakTabLabelWrapper, { descendants: false }],
      },
    ],
    _inkBar: [
      {
        type: ViewChild,
        args: [TakInkBar, { static: true }],
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
  },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL3RhYi1oZWFkZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItaGVhZGVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBR0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixNQUFNLEVBRU4sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEVBRWpCLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDcEMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDOzs7Ozs7OztBQUU3RDs7O0dBR0c7QUFFSCxNQUFNLE9BQWdCLGlCQUNwQixTQUFRLHFCQUFxQjtJQWE3QixZQUNFLFVBQXNCLEVBQ3RCLGlCQUFvQyxFQUNwQyxhQUE0QixFQUNoQixHQUFtQixFQUMvQixNQUFjLEVBQ2QsUUFBa0IsRUFDeUIsYUFBc0I7UUFFakUsS0FBSyxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFYcEYsbUJBQWMsR0FBWSxLQUFLLENBQUM7SUFZeEMsQ0FBQztJQXBCRCxvREFBb0Q7SUFDcEQsSUFDSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFDRCxJQUFJLGFBQWEsQ0FBQyxLQUFtQjtRQUNuQyxJQUFJLENBQUMsY0FBYyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFlUyxhQUFhLENBQUMsS0FBb0I7UUFDMUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3pCLENBQUM7OzhHQTVCbUIsaUJBQWlCLHNNQXFCZixxQkFBcUI7a0dBckJ2QixpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFEdEMsU0FBUzs7MEJBbUJMLFFBQVE7OzBCQUdSLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzRDQWZ2QyxhQUFhO3NCQURoQixLQUFLOztBQTBCUjs7Ozs7O0dBTUc7QUFnQkgsTUFBTSxPQUFPLFlBQWEsU0FBUSxpQkFBaUI7SUFTakQsWUFDRSxVQUFzQixFQUN0QixpQkFBb0MsRUFDcEMsYUFBNEIsRUFDaEIsR0FBbUIsRUFDL0IsTUFBYyxFQUNkLFFBQWtCLEVBQ3lCLGFBQXNCO1FBRWpFLEtBQUssQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzVGLENBQUM7O3lHQW5CVSxZQUFZLHNNQWdCRCxxQkFBcUI7NkZBaEJoQyxZQUFZLHVaQUNOLGtCQUFrQixzRUFDeEIsU0FBUyx5bUJDaEd0Qiw2b0RBMkNBOzJGRG1EYSxZQUFZO2tCQWZ4QixTQUFTOytCQUNFLGdCQUFnQixVQUdsQixDQUFDLGVBQWUsQ0FBQyxXQUNoQixDQUFDLG9CQUFvQixFQUFFLGNBQWMsQ0FBQyxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSSxtQkFFcEIsdUJBQXVCLENBQUMsT0FBTyxRQUMxQzt3QkFDSixPQUFPLEVBQUUsZ0JBQWdCO3dCQUN6QixvREFBb0QsRUFBRSx5QkFBeUI7d0JBQy9FLDRCQUE0QixFQUFFLGdDQUFnQztxQkFDL0Q7OzBCQWVFLFFBQVE7OzBCQUdSLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzRDQWZnQixNQUFNO3NCQUFoRSxlQUFlO3VCQUFDLGtCQUFrQixFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQztnQkFDbkIsT0FBTztzQkFBNUMsU0FBUzt1QkFBQyxTQUFTLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2dCQUNXLGlCQUFpQjtzQkFBL0QsU0FBUzt1QkFBQyxrQkFBa0IsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7Z0JBQ1AsUUFBUTtzQkFBN0MsU0FBUzt1QkFBQyxTQUFTLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2dCQUNPLGFBQWE7c0JBQXZELFNBQVM7dUJBQUMsY0FBYyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztnQkFDYixjQUFjO3NCQUF6QyxTQUFTO3VCQUFDLGVBQWU7Z0JBQ00sa0JBQWtCO3NCQUFqRCxTQUFTO3VCQUFDLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEFmdGVyVmlld0luaXQsXG4gIElucHV0LFxuICBJbmplY3QsXG4gIERpcmVjdGl2ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge01hdElua0Jhcn0gZnJvbSAnLi9pbmstYmFyJztcbmltcG9ydCB7TWF0VGFiTGFiZWxXcmFwcGVyfSBmcm9tICcuL3RhYi1sYWJlbC13cmFwcGVyJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge01hdFBhZ2luYXRlZFRhYkhlYWRlcn0gZnJvbSAnLi9wYWdpbmF0ZWQtdGFiLWhlYWRlcic7XG5cbi8qKlxuICogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdFRhYkhlYWRlcmAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFRhYkhlYWRlckJhc2VcbiAgZXh0ZW5kcyBNYXRQYWdpbmF0ZWRUYWJIZWFkZXJcbiAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRDaGVja2VkLCBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3lcbntcbiAgLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBlZmZlY3QgaXMgZGlzYWJsZWQgb3Igbm90LiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZVJpcHBsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZVJpcHBsZTtcbiAgfVxuICBzZXQgZGlzYWJsZVJpcHBsZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZVJpcHBsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZVJpcHBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgQE9wdGlvbmFsKCkgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGNoYW5nZURldGVjdG9yUmVmLCB2aWV3cG9ydFJ1bGVyLCBkaXIsIG5nWm9uZSwgcGxhdGZvcm0sIGFuaW1hdGlvbk1vZGUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9pdGVtU2VsZWN0ZWQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGhlYWRlciBvZiB0aGUgdGFiIGdyb3VwIHdoaWNoIGRpc3BsYXlzIGEgbGlzdCBvZiBhbGwgdGhlIHRhYnMgaW4gdGhlIHRhYiBncm91cC4gSW5jbHVkZXNcbiAqIGFuIGluayBiYXIgdGhhdCBmb2xsb3dzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgdGFiLiBXaGVuIHRoZSB0YWJzIGxpc3QncyB3aWR0aCBleGNlZWRzIHRoZVxuICogd2lkdGggb2YgdGhlIGhlYWRlciBjb250YWluZXIsIHRoZW4gYXJyb3dzIHdpbGwgYmUgZGlzcGxheWVkIHRvIGFsbG93IHRoZSB1c2VyIHRvIHNjcm9sbFxuICogbGVmdCBhbmQgcmlnaHQgYWNyb3NzIHRoZSBoZWFkZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWItaGVhZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICd0YWItaGVhZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsndGFiLWhlYWRlci5jc3MnXSxcbiAgaW5wdXRzOiBbJ3NlbGVjdGVkSW5kZXgnXSxcbiAgb3V0cHV0czogWydzZWxlY3RGb2N1c2VkSW5kZXgnLCAnaW5kZXhGb2N1c2VkJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtdGFiLWhlYWRlcicsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWhlYWRlci1wYWdpbmF0aW9uLWNvbnRyb2xzLWVuYWJsZWRdJzogJ19zaG93UGFnaW5hdGlvbkNvbnRyb2xzJyxcbiAgICAnW2NsYXNzLm1hdC10YWItaGVhZGVyLXJ0bF0nOiBcIl9nZXRMYXlvdXREaXJlY3Rpb24oKSA9PSAncnRsJ1wiLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWJIZWFkZXIgZXh0ZW5kcyBfTWF0VGFiSGVhZGVyQmFzZSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0VGFiTGFiZWxXcmFwcGVyLCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgX2l0ZW1zOiBRdWVyeUxpc3Q8TWF0VGFiTGFiZWxXcmFwcGVyPjtcbiAgQFZpZXdDaGlsZChNYXRJbmtCYXIsIHtzdGF0aWM6IHRydWV9KSBfaW5rQmFyOiBNYXRJbmtCYXI7XG4gIEBWaWV3Q2hpbGQoJ3RhYkxpc3RDb250YWluZXInLCB7c3RhdGljOiB0cnVlfSkgX3RhYkxpc3RDb250YWluZXI6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3RhYkxpc3QnLCB7c3RhdGljOiB0cnVlfSkgX3RhYkxpc3Q6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3RhYkxpc3RJbm5lcicsIHtzdGF0aWM6IHRydWV9KSBfdGFiTGlzdElubmVyOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCduZXh0UGFnaW5hdG9yJykgX25leHRQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdwcmV2aW91c1BhZ2luYXRvcicpIF9wcmV2aW91c1BhZ2luYXRvcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgY2hhbmdlRGV0ZWN0b3JSZWYsIHZpZXdwb3J0UnVsZXIsIGRpciwgbmdab25lLCBwbGF0Zm9ybSwgYW5pbWF0aW9uTW9kZSk7XG4gIH1cbn1cbiIsIjxidXR0b24gY2xhc3M9XCJtYXQtdGFiLWhlYWRlci1wYWdpbmF0aW9uIG1hdC10YWItaGVhZGVyLXBhZ2luYXRpb24tYmVmb3JlIG1hdC1lbGV2YXRpb24tejRcIlxuICAgICAjcHJldmlvdXNQYWdpbmF0b3JcbiAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgIG1hdC1yaXBwbGVcbiAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgIFttYXRSaXBwbGVEaXNhYmxlZF09XCJfZGlzYWJsZVNjcm9sbEJlZm9yZSB8fCBkaXNhYmxlUmlwcGxlXCJcbiAgICAgW2NsYXNzLm1hdC10YWItaGVhZGVyLXBhZ2luYXRpb24tZGlzYWJsZWRdPVwiX2Rpc2FibGVTY3JvbGxCZWZvcmVcIlxuICAgICBbZGlzYWJsZWRdPVwiX2Rpc2FibGVTY3JvbGxCZWZvcmUgfHwgbnVsbFwiXG4gICAgIChjbGljayk9XCJfaGFuZGxlUGFnaW5hdG9yQ2xpY2soJ2JlZm9yZScpXCJcbiAgICAgKG1vdXNlZG93bik9XCJfaGFuZGxlUGFnaW5hdG9yUHJlc3MoJ2JlZm9yZScsICRldmVudClcIlxuICAgICAodG91Y2hlbmQpPVwiX3N0b3BJbnRlcnZhbCgpXCI+XG4gIDxkaXYgY2xhc3M9XCJtYXQtdGFiLWhlYWRlci1wYWdpbmF0aW9uLWNoZXZyb25cIj48L2Rpdj5cbjwvYnV0dG9uPlxuXG48ZGl2IGNsYXNzPVwibWF0LXRhYi1sYWJlbC1jb250YWluZXJcIiAjdGFiTGlzdENvbnRhaW5lciAoa2V5ZG93bik9XCJfaGFuZGxlS2V5ZG93bigkZXZlbnQpXCI+XG4gIDxkaXZcbiAgICAjdGFiTGlzdFxuICAgIGNsYXNzPVwibWF0LXRhYi1saXN0XCJcbiAgICBbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdPVwiX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucydcIlxuICAgIHJvbGU9XCJ0YWJsaXN0XCJcbiAgICAoY2RrT2JzZXJ2ZUNvbnRlbnQpPVwiX29uQ29udGVudENoYW5nZXMoKVwiPlxuICAgIDxkaXYgY2xhc3M9XCJtYXQtdGFiLWxhYmVsc1wiICN0YWJMaXN0SW5uZXI+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gICAgPG1hdC1pbmstYmFyPjwvbWF0LWluay1iYXI+XG4gIDwvZGl2PlxuPC9kaXY+XG5cbjxidXR0b24gY2xhc3M9XCJtYXQtdGFiLWhlYWRlci1wYWdpbmF0aW9uIG1hdC10YWItaGVhZGVyLXBhZ2luYXRpb24tYWZ0ZXIgbWF0LWVsZXZhdGlvbi16NFwiXG4gICAgICNuZXh0UGFnaW5hdG9yXG4gICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgIHR5cGU9XCJidXR0b25cIlxuICAgICBtYXQtcmlwcGxlXG4gICAgIFttYXRSaXBwbGVEaXNhYmxlZF09XCJfZGlzYWJsZVNjcm9sbEFmdGVyIHx8IGRpc2FibGVSaXBwbGVcIlxuICAgICBbY2xhc3MubWF0LXRhYi1oZWFkZXItcGFnaW5hdGlvbi1kaXNhYmxlZF09XCJfZGlzYWJsZVNjcm9sbEFmdGVyXCJcbiAgICAgW2Rpc2FibGVkXT1cIl9kaXNhYmxlU2Nyb2xsQWZ0ZXIgfHwgbnVsbFwiXG4gICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAobW91c2Vkb3duKT1cIl9oYW5kbGVQYWdpbmF0b3JQcmVzcygnYWZ0ZXInLCAkZXZlbnQpXCJcbiAgICAgKGNsaWNrKT1cIl9oYW5kbGVQYWdpbmF0b3JDbGljaygnYWZ0ZXInKVwiXG4gICAgICh0b3VjaGVuZCk9XCJfc3RvcEludGVydmFsKClcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC10YWItaGVhZGVyLXBhZ2luYXRpb24tY2hldnJvblwiPjwvZGl2PlxuPC9idXR0b24+XG4iXX0=
