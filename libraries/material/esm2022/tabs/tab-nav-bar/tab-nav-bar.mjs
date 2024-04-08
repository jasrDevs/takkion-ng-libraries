/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Attribute,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  NgZone,
  numberAttribute,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  ANIMATION_MODULE_TYPE,
} from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, MatRipple } from '@takkion/material/core';
import { FocusMonitor } from '@takkion/cdk/a11y';
import { Directionality } from '@takkion/cdk/bidi';
import { ViewportRuler } from '@takkion/cdk/scrolling';
import { Platform } from '@takkion/cdk/platform';
import { MatInkBar, InkBarItem } from '../ink-bar';
import { BehaviorSubject, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { ENTER, SPACE } from '@takkion/cdk/keycodes';
import { MAT_TABS_CONFIG } from '../tab-config';
import { MatPaginatedTabHeader } from '../paginated-tab-header';
import { CdkObserveContent } from '@takkion/cdk/observers';
import * as i0 from '@angular/core';
import * as i1 from '@takkion/cdk/bidi';
import * as i2 from '@takkion/cdk/scrolling';
import * as i3 from '@takkion/cdk/platform';
import * as i4 from '@takkion/cdk/a11y';
// Increasing integer for generating unique ids for tab nav components.
let nextUniqueId = 0;
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
export class MatTabNav extends MatPaginatedTabHeader {
  /** Whether the ink bar should fit its width to the size of the tab label content. */
  get fitInkBarToContent() {
    return this._fitInkBarToContent.value;
  }
  set fitInkBarToContent(value) {
    this._fitInkBarToContent.next(value);
    this._changeDetectorRef.markForCheck();
  }
  get animationDuration() {
    return this._animationDuration;
  }
  set animationDuration(value) {
    const stringValue = value + '';
    this._animationDuration = /^\d+$/.test(stringValue) ? value + 'ms' : stringValue;
  }
  /** Background color of the tab nav. */
  get backgroundColor() {
    return this._backgroundColor;
  }
  set backgroundColor(value) {
    const classList = this._elementRef.nativeElement.classList;
    classList.remove('mat-tabs-with-background', `mat-background-${this.backgroundColor}`);
    if (value) {
      classList.add('mat-tabs-with-background', `mat-background-${value}`);
    }
    this._backgroundColor = value;
  }
  constructor(
    elementRef,
    dir,
    ngZone,
    changeDetectorRef,
    viewportRuler,
    platform,
    animationMode,
    defaultConfig
  ) {
    super(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode);
    this._fitInkBarToContent = new BehaviorSubject(false);
    /** Whether tabs should be stretched to fill the header. */
    this.stretchTabs = true;
    /** Whether the ripple effect is disabled or not. */
    this.disableRipple = false;
    /** Theme color of the nav bar. */
    this.color = 'primary';
    this.disablePagination =
      defaultConfig && defaultConfig.disablePagination != null
        ? defaultConfig.disablePagination
        : false;
    this.fitInkBarToContent =
      defaultConfig && defaultConfig.fitInkBarToContent != null
        ? defaultConfig.fitInkBarToContent
        : false;
    this.stretchTabs =
      defaultConfig && defaultConfig.stretchTabs != null ? defaultConfig.stretchTabs : true;
  }
  _itemSelected() {
    // noop
  }
  ngAfterContentInit() {
    this._inkBar = new MatInkBar(this._items);
    // We need this to run before the `changes` subscription in parent to ensure that the
    // selectedIndex is up-to-date by the time the super class starts looking for it.
    this._items.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
      this.updateActiveLink();
    });
    super.ngAfterContentInit();
  }
  ngAfterViewInit() {
    if (!this.tabPanel && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw new Error('A mat-tab-nav-panel must be specified via [tabPanel].');
    }
    super.ngAfterViewInit();
  }
  /** Notifies the component that the active link has been changed. */
  updateActiveLink() {
    if (!this._items) {
      return;
    }
    const items = this._items.toArray();
    for (let i = 0; i < items.length; i++) {
      if (items[i].active) {
        this.selectedIndex = i;
        this._changeDetectorRef.markForCheck();
        if (this.tabPanel) {
          this.tabPanel._activeTabId = items[i].id;
        }
        return;
      }
    }
    // The ink bar should hide itself if no items are active.
    this.selectedIndex = -1;
    this._inkBar.hide();
  }
  _getRole() {
    return this.tabPanel ? 'tablist' : this._elementRef.nativeElement.getAttribute('role');
  }
  static {
    this.ɵfac = i0.ɵɵngDeclareFactory({
      minVersion: '12.0.0',
      version: '17.2.0',
      ngImport: i0,
      type: MatTabNav,
      deps: [
        { token: i0.ElementRef },
        { token: i1.Directionality, optional: true },
        { token: i0.NgZone },
        { token: i0.ChangeDetectorRef },
        { token: i2.ViewportRuler },
        { token: i3.Platform },
        { token: ANIMATION_MODULE_TYPE, optional: true },
        { token: MAT_TABS_CONFIG, optional: true },
      ],
      target: i0.ɵɵFactoryTarget.Component,
    });
  }
  static {
    this.ɵcmp = i0.ɵɵngDeclareComponent({
      minVersion: '16.1.0',
      version: '17.2.0',
      type: MatTabNav,
      isStandalone: true,
      selector: '[mat-tab-nav-bar]',
      inputs: {
        fitInkBarToContent: ['fitInkBarToContent', 'fitInkBarToContent', booleanAttribute],
        stretchTabs: ['mat-stretch-tabs', 'stretchTabs', booleanAttribute],
        animationDuration: 'animationDuration',
        backgroundColor: 'backgroundColor',
        disableRipple: ['disableRipple', 'disableRipple', booleanAttribute],
        color: 'color',
        tabPanel: 'tabPanel',
      },
      host: {
        properties: {
          'attr.role': '_getRole()',
          'class.mat-mdc-tab-header-pagination-controls-enabled': '_showPaginationControls',
          'class.mat-mdc-tab-header-rtl': "_getLayoutDirection() == 'rtl'",
          'class.mat-mdc-tab-nav-bar-stretch-tabs': 'stretchTabs',
          'class.mat-primary': 'color !== "warn" && color !== "accent"',
          'class.mat-accent': 'color === "accent"',
          'class.mat-warn': 'color === "warn"',
          'class._mat-animation-noopable': '_animationMode === "NoopAnimations"',
          'style.--mat-tab-animation-duration': 'animationDuration',
        },
        classAttribute: 'mat-mdc-tab-nav-bar mat-mdc-tab-header',
      },
      queries: [
        { propertyName: '_items', predicate: i0.forwardRef(() => MatTabLink), descendants: true },
      ],
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
      exportAs: ['matTabNavBar', 'matTabNav'],
      usesInheritance: true,
      ngImport: i0,
      template:
        '<!-- TODO: this also had `mat-elevation-z4`. Figure out what we should do with it. -->\n<button class="mat-mdc-tab-header-pagination mat-mdc-tab-header-pagination-before"\n     #previousPaginator\n     aria-hidden="true"\n     type="button"\n     mat-ripple\n     tabindex="-1"\n     [matRippleDisabled]="_disableScrollBefore || disableRipple"\n     [class.mat-mdc-tab-header-pagination-disabled]="_disableScrollBefore"\n     [disabled]="_disableScrollBefore || null"\n     (click)="_handlePaginatorClick(\'before\')"\n     (mousedown)="_handlePaginatorPress(\'before\', $event)"\n     (touchend)="_stopInterval()">\n  <div class="mat-mdc-tab-header-pagination-chevron"></div>\n</button>\n\n<div class="mat-mdc-tab-link-container" #tabListContainer (keydown)="_handleKeydown($event)">\n  <div class="mat-mdc-tab-list" #tabList (cdkObserveContent)="_onContentChanges()">\n    <div class="mat-mdc-tab-links" #tabListInner>\n      <ng-content></ng-content>\n    </div>\n  </div>\n</div>\n\n<!-- TODO: this also had `mat-elevation-z4`. Figure out what we should do with it. -->\n<button class="mat-mdc-tab-header-pagination mat-mdc-tab-header-pagination-after"\n     #nextPaginator\n     aria-hidden="true"\n     type="button"\n     mat-ripple\n     [matRippleDisabled]="_disableScrollAfter || disableRipple"\n     [class.mat-mdc-tab-header-pagination-disabled]="_disableScrollAfter"\n     [disabled]="_disableScrollAfter || null"\n     tabindex="-1"\n     (mousedown)="_handlePaginatorPress(\'after\', $event)"\n     (click)="_handlePaginatorClick(\'after\')"\n     (touchend)="_stopInterval()">\n  <div class="mat-mdc-tab-header-pagination-chevron"></div>\n</button>\n',
      styles: [
        '.mdc-tab{min-width:90px;padding-right:24px;padding-left:24px;display:flex;flex:1 0 auto;justify-content:center;box-sizing:border-box;margin:0;padding-top:0;padding-bottom:0;border:none;outline:none;text-align:center;white-space:nowrap;cursor:pointer;-webkit-appearance:none;z-index:1}.mdc-tab::-moz-focus-inner{padding:0;border:0}.mdc-tab[hidden]{display:none}.mdc-tab--min-width{flex:0 1 auto}.mdc-tab__content{display:flex;align-items:center;justify-content:center;height:inherit;pointer-events:none}.mdc-tab__text-label{transition:150ms color linear;display:inline-block;line-height:1;z-index:2}.mdc-tab__icon{transition:150ms color linear;z-index:2}.mdc-tab--stacked .mdc-tab__content{flex-direction:column;align-items:center;justify-content:center}.mdc-tab--stacked .mdc-tab__text-label{padding-top:6px;padding-bottom:4px}.mdc-tab--active .mdc-tab__text-label,.mdc-tab--active .mdc-tab__icon{transition-delay:100ms}.mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label{padding-left:8px;padding-right:0}[dir=rtl] .mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label,.mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label[dir=rtl]{padding-left:0;padding-right:8px}.mdc-tab-indicator{display:flex;position:absolute;top:0;left:0;justify-content:center;width:100%;height:100%;pointer-events:none;z-index:1}.mdc-tab-indicator__content{transform-origin:left;opacity:0}.mdc-tab-indicator__content--underline{align-self:flex-end;box-sizing:border-box;width:100%;border-top-style:solid}.mdc-tab-indicator__content--icon{align-self:center;margin:0 auto}.mdc-tab-indicator--active .mdc-tab-indicator__content{opacity:1}.mdc-tab-indicator .mdc-tab-indicator__content{transition:250ms transform cubic-bezier(0.4, 0, 0.2, 1)}.mdc-tab-indicator--no-transition .mdc-tab-indicator__content{transition:none}.mdc-tab-indicator--fade .mdc-tab-indicator__content{transition:150ms opacity linear}.mdc-tab-indicator--active.mdc-tab-indicator--fade .mdc-tab-indicator__content{transition-delay:100ms}.mat-mdc-tab-ripple{position:absolute;top:0;left:0;bottom:0;right:0;pointer-events:none}.mat-mdc-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mdc-tab-indicator .mdc-tab-indicator__content{transition-duration:var(--mat-tab-animation-duration, 250ms)}.mat-mdc-tab-header-pagination{-webkit-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:none;box-sizing:content-box;background:none;border:none;outline:0;padding:0}.mat-mdc-tab-header-pagination::-moz-focus-inner{border:0}.mat-mdc-tab-header-pagination .mat-ripple-element{opacity:.12;background-color:var(--mat-tab-header-inactive-ripple-color)}.mat-mdc-tab-header-pagination-controls-enabled .mat-mdc-tab-header-pagination{display:flex}.mat-mdc-tab-header-pagination-before,.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after{padding-left:4px}.mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before,.mat-mdc-tab-header-pagination-after{padding-right:4px}.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-mdc-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;height:8px;width:8px;border-color:var(--mat-tab-header-pagination-icon-color)}.mat-mdc-tab-header-pagination-disabled{box-shadow:none;cursor:default;pointer-events:none}.mat-mdc-tab-header-pagination-disabled .mat-mdc-tab-header-pagination-chevron{opacity:.4}.mat-mdc-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable .mat-mdc-tab-list{transition:none}._mat-animation-noopable span.mdc-tab-indicator__content,._mat-animation-noopable span.mdc-tab__text-label{transition:none}.mat-mdc-tab-links{display:flex;flex:1 0 auto}[mat-align-tabs=center]>.mat-mdc-tab-link-container .mat-mdc-tab-links{justify-content:center}[mat-align-tabs=end]>.mat-mdc-tab-link-container .mat-mdc-tab-links{justify-content:flex-end}.mat-mdc-tab-link-container{display:flex;flex-grow:1;overflow:hidden;z-index:1;border-bottom-style:solid;border-bottom-width:var(--mat-tab-header-divider-height);border-bottom-color:var(--mat-tab-header-divider-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination{background-color:var(--mat-tab-header-with-background-background-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background.mat-primary>.mat-mdc-tab-link-container .mat-mdc-tab-link .mdc-tab__text-label{color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background.mat-primary>.mat-mdc-tab-link-container .mdc-tab-indicator__content--underline{border-color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background:not(.mat-primary)>.mat-mdc-tab-link-container .mat-mdc-tab-link:not(.mdc-tab--active) .mdc-tab__text-label{color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background:not(.mat-primary)>.mat-mdc-tab-link-container .mat-mdc-tab-link:not(.mdc-tab--active) .mdc-tab-indicator__content--underline{border-color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-focus-indicator::before,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-mdc-focus-indicator::before{border-color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-ripple-element,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mdc-tab__ripple::before,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-ripple-element,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mdc-tab__ripple::before{background-color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-mdc-tab-header-pagination-chevron{color:var(--mat-tab-header-with-background-foreground-color)}',
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
  type: MatTabNav,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: '[mat-tab-nav-bar]',
          exportAs: 'matTabNavBar, matTabNav',
          host: {
            '[attr.role]': '_getRole()',
            class: 'mat-mdc-tab-nav-bar mat-mdc-tab-header',
            '[class.mat-mdc-tab-header-pagination-controls-enabled]': '_showPaginationControls',
            '[class.mat-mdc-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
            '[class.mat-mdc-tab-nav-bar-stretch-tabs]': 'stretchTabs',
            '[class.mat-primary]': 'color !== "warn" && color !== "accent"',
            '[class.mat-accent]': 'color === "accent"',
            '[class.mat-warn]': 'color === "warn"',
            '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
            '[style.--mat-tab-animation-duration]': 'animationDuration',
          },
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.Default,
          standalone: true,
          imports: [MatRipple, CdkObserveContent],
          template:
            '<!-- TODO: this also had `mat-elevation-z4`. Figure out what we should do with it. -->\n<button class="mat-mdc-tab-header-pagination mat-mdc-tab-header-pagination-before"\n     #previousPaginator\n     aria-hidden="true"\n     type="button"\n     mat-ripple\n     tabindex="-1"\n     [matRippleDisabled]="_disableScrollBefore || disableRipple"\n     [class.mat-mdc-tab-header-pagination-disabled]="_disableScrollBefore"\n     [disabled]="_disableScrollBefore || null"\n     (click)="_handlePaginatorClick(\'before\')"\n     (mousedown)="_handlePaginatorPress(\'before\', $event)"\n     (touchend)="_stopInterval()">\n  <div class="mat-mdc-tab-header-pagination-chevron"></div>\n</button>\n\n<div class="mat-mdc-tab-link-container" #tabListContainer (keydown)="_handleKeydown($event)">\n  <div class="mat-mdc-tab-list" #tabList (cdkObserveContent)="_onContentChanges()">\n    <div class="mat-mdc-tab-links" #tabListInner>\n      <ng-content></ng-content>\n    </div>\n  </div>\n</div>\n\n<!-- TODO: this also had `mat-elevation-z4`. Figure out what we should do with it. -->\n<button class="mat-mdc-tab-header-pagination mat-mdc-tab-header-pagination-after"\n     #nextPaginator\n     aria-hidden="true"\n     type="button"\n     mat-ripple\n     [matRippleDisabled]="_disableScrollAfter || disableRipple"\n     [class.mat-mdc-tab-header-pagination-disabled]="_disableScrollAfter"\n     [disabled]="_disableScrollAfter || null"\n     tabindex="-1"\n     (mousedown)="_handlePaginatorPress(\'after\', $event)"\n     (click)="_handlePaginatorClick(\'after\')"\n     (touchend)="_stopInterval()">\n  <div class="mat-mdc-tab-header-pagination-chevron"></div>\n</button>\n',
          styles: [
            '.mdc-tab{min-width:90px;padding-right:24px;padding-left:24px;display:flex;flex:1 0 auto;justify-content:center;box-sizing:border-box;margin:0;padding-top:0;padding-bottom:0;border:none;outline:none;text-align:center;white-space:nowrap;cursor:pointer;-webkit-appearance:none;z-index:1}.mdc-tab::-moz-focus-inner{padding:0;border:0}.mdc-tab[hidden]{display:none}.mdc-tab--min-width{flex:0 1 auto}.mdc-tab__content{display:flex;align-items:center;justify-content:center;height:inherit;pointer-events:none}.mdc-tab__text-label{transition:150ms color linear;display:inline-block;line-height:1;z-index:2}.mdc-tab__icon{transition:150ms color linear;z-index:2}.mdc-tab--stacked .mdc-tab__content{flex-direction:column;align-items:center;justify-content:center}.mdc-tab--stacked .mdc-tab__text-label{padding-top:6px;padding-bottom:4px}.mdc-tab--active .mdc-tab__text-label,.mdc-tab--active .mdc-tab__icon{transition-delay:100ms}.mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label{padding-left:8px;padding-right:0}[dir=rtl] .mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label,.mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label[dir=rtl]{padding-left:0;padding-right:8px}.mdc-tab-indicator{display:flex;position:absolute;top:0;left:0;justify-content:center;width:100%;height:100%;pointer-events:none;z-index:1}.mdc-tab-indicator__content{transform-origin:left;opacity:0}.mdc-tab-indicator__content--underline{align-self:flex-end;box-sizing:border-box;width:100%;border-top-style:solid}.mdc-tab-indicator__content--icon{align-self:center;margin:0 auto}.mdc-tab-indicator--active .mdc-tab-indicator__content{opacity:1}.mdc-tab-indicator .mdc-tab-indicator__content{transition:250ms transform cubic-bezier(0.4, 0, 0.2, 1)}.mdc-tab-indicator--no-transition .mdc-tab-indicator__content{transition:none}.mdc-tab-indicator--fade .mdc-tab-indicator__content{transition:150ms opacity linear}.mdc-tab-indicator--active.mdc-tab-indicator--fade .mdc-tab-indicator__content{transition-delay:100ms}.mat-mdc-tab-ripple{position:absolute;top:0;left:0;bottom:0;right:0;pointer-events:none}.mat-mdc-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mdc-tab-indicator .mdc-tab-indicator__content{transition-duration:var(--mat-tab-animation-duration, 250ms)}.mat-mdc-tab-header-pagination{-webkit-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:none;box-sizing:content-box;background:none;border:none;outline:0;padding:0}.mat-mdc-tab-header-pagination::-moz-focus-inner{border:0}.mat-mdc-tab-header-pagination .mat-ripple-element{opacity:.12;background-color:var(--mat-tab-header-inactive-ripple-color)}.mat-mdc-tab-header-pagination-controls-enabled .mat-mdc-tab-header-pagination{display:flex}.mat-mdc-tab-header-pagination-before,.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after{padding-left:4px}.mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before,.mat-mdc-tab-header-pagination-after{padding-right:4px}.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-mdc-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;height:8px;width:8px;border-color:var(--mat-tab-header-pagination-icon-color)}.mat-mdc-tab-header-pagination-disabled{box-shadow:none;cursor:default;pointer-events:none}.mat-mdc-tab-header-pagination-disabled .mat-mdc-tab-header-pagination-chevron{opacity:.4}.mat-mdc-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable .mat-mdc-tab-list{transition:none}._mat-animation-noopable span.mdc-tab-indicator__content,._mat-animation-noopable span.mdc-tab__text-label{transition:none}.mat-mdc-tab-links{display:flex;flex:1 0 auto}[mat-align-tabs=center]>.mat-mdc-tab-link-container .mat-mdc-tab-links{justify-content:center}[mat-align-tabs=end]>.mat-mdc-tab-link-container .mat-mdc-tab-links{justify-content:flex-end}.mat-mdc-tab-link-container{display:flex;flex-grow:1;overflow:hidden;z-index:1;border-bottom-style:solid;border-bottom-width:var(--mat-tab-header-divider-height);border-bottom-color:var(--mat-tab-header-divider-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination{background-color:var(--mat-tab-header-with-background-background-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background.mat-primary>.mat-mdc-tab-link-container .mat-mdc-tab-link .mdc-tab__text-label{color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background.mat-primary>.mat-mdc-tab-link-container .mdc-tab-indicator__content--underline{border-color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background:not(.mat-primary)>.mat-mdc-tab-link-container .mat-mdc-tab-link:not(.mdc-tab--active) .mdc-tab__text-label{color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background:not(.mat-primary)>.mat-mdc-tab-link-container .mat-mdc-tab-link:not(.mdc-tab--active) .mdc-tab-indicator__content--underline{border-color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-focus-indicator::before,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-mdc-focus-indicator::before{border-color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-ripple-element,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mdc-tab__ripple::before,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-ripple-element,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mdc-tab__ripple::before{background-color:var(--mat-tab-header-with-background-foreground-color)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-mdc-tab-header-pagination-chevron{color:var(--mat-tab-header-with-background-foreground-color)}',
          ],
        },
      ],
    },
  ],
  ctorParameters: () => [
    { type: i0.ElementRef },
    {
      type: i1.Directionality,
      decorators: [
        {
          type: Optional,
        },
      ],
    },
    { type: i0.NgZone },
    { type: i0.ChangeDetectorRef },
    { type: i2.ViewportRuler },
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
    {
      type: undefined,
      decorators: [
        {
          type: Optional,
        },
        {
          type: Inject,
          args: [MAT_TABS_CONFIG],
        },
      ],
    },
  ],
  propDecorators: {
    fitInkBarToContent: [
      {
        type: Input,
        args: [{ transform: booleanAttribute }],
      },
    ],
    stretchTabs: [
      {
        type: Input,
        args: [{ alias: 'mat-stretch-tabs', transform: booleanAttribute }],
      },
    ],
    animationDuration: [
      {
        type: Input,
      },
    ],
    _items: [
      {
        type: ContentChildren,
        args: [forwardRef(() => MatTabLink), { descendants: true }],
      },
    ],
    backgroundColor: [
      {
        type: Input,
      },
    ],
    disableRipple: [
      {
        type: Input,
        args: [{ transform: booleanAttribute }],
      },
    ],
    color: [
      {
        type: Input,
      },
    ],
    tabPanel: [
      {
        type: Input,
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
/**
 * Link inside a `mat-tab-nav-bar`.
 */
export class MatTabLink extends InkBarItem {
  /** Whether the link is active. */
  get active() {
    return this._isActive;
  }
  set active(value) {
    if (value !== this._isActive) {
      this._isActive = value;
      this._tabNavBar.updateActiveLink();
    }
  }
  /**
   * Whether ripples are disabled on interaction.
   * @docs-private
   */
  get rippleDisabled() {
    return (
      this.disabled ||
      this.disableRipple ||
      this._tabNavBar.disableRipple ||
      !!this.rippleConfig.disabled
    );
  }
  constructor(
    _tabNavBar,
    /** @docs-private */ elementRef,
    globalRippleOptions,
    tabIndex,
    _focusMonitor,
    animationMode
  ) {
    super();
    this._tabNavBar = _tabNavBar;
    this.elementRef = elementRef;
    this._focusMonitor = _focusMonitor;
    this._destroyed = new Subject();
    /** Whether the tab link is active or not. */
    this._isActive = false;
    /** Whether the tab link is disabled. */
    this.disabled = false;
    /** Whether ripples are disabled on the tab link. */
    this.disableRipple = false;
    this.tabIndex = 0;
    /** Unique id for the tab. */
    this.id = `mat-tab-link-${nextUniqueId++}`;
    this.rippleConfig = globalRippleOptions || {};
    this.tabIndex = parseInt(tabIndex) || 0;
    if (animationMode === 'NoopAnimations') {
      this.rippleConfig.animation = { enterDuration: 0, exitDuration: 0 };
    }
    _tabNavBar._fitInkBarToContent
      .pipe(takeUntil(this._destroyed))
      .subscribe(fitInkBarToContent => {
        this.fitInkBarToContent = fitInkBarToContent;
      });
  }
  /** Focuses the tab link. */
  focus() {
    this.elementRef.nativeElement.focus();
  }
  ngAfterViewInit() {
    this._focusMonitor.monitor(this.elementRef);
  }
  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
    super.ngOnDestroy();
    this._focusMonitor.stopMonitoring(this.elementRef);
  }
  _handleFocus() {
    // Since we allow navigation through tabbing in the nav bar, we
    // have to update the focused index whenever the link receives focus.
    this._tabNavBar.focusIndex = this._tabNavBar._items.toArray().indexOf(this);
  }
  _handleKeydown(event) {
    if (event.keyCode === SPACE || event.keyCode === ENTER) {
      if (this.disabled) {
        event.preventDefault();
      } else if (this._tabNavBar.tabPanel) {
        // Only prevent the default action on space since it can scroll the page.
        // Don't prevent enter since it can break link navigation.
        if (event.keyCode === SPACE) {
          event.preventDefault();
        }
        this.elementRef.nativeElement.click();
      }
    }
  }
  _getAriaControls() {
    return this._tabNavBar.tabPanel
      ? this._tabNavBar.tabPanel?.id
      : this.elementRef.nativeElement.getAttribute('aria-controls');
  }
  _getAriaSelected() {
    if (this._tabNavBar.tabPanel) {
      return this.active ? 'true' : 'false';
    } else {
      return this.elementRef.nativeElement.getAttribute('aria-selected');
    }
  }
  _getAriaCurrent() {
    return this.active && !this._tabNavBar.tabPanel ? 'page' : null;
  }
  _getRole() {
    return this._tabNavBar.tabPanel ? 'tab' : this.elementRef.nativeElement.getAttribute('role');
  }
  _getTabIndex() {
    if (this._tabNavBar.tabPanel) {
      return this._isActive && !this.disabled ? 0 : -1;
    } else {
      return this.disabled ? -1 : this.tabIndex;
    }
  }
  static {
    this.ɵfac = i0.ɵɵngDeclareFactory({
      minVersion: '12.0.0',
      version: '17.2.0',
      ngImport: i0,
      type: MatTabLink,
      deps: [
        { token: MatTabNav },
        { token: i0.ElementRef },
        { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true },
        { token: 'tabindex', attribute: true },
        { token: i4.FocusMonitor },
        { token: ANIMATION_MODULE_TYPE, optional: true },
      ],
      target: i0.ɵɵFactoryTarget.Component,
    });
  }
  static {
    this.ɵcmp = i0.ɵɵngDeclareComponent({
      minVersion: '16.1.0',
      version: '17.2.0',
      type: MatTabLink,
      isStandalone: true,
      selector: '[mat-tab-link], [matTabLink]',
      inputs: {
        active: ['active', 'active', booleanAttribute],
        disabled: ['disabled', 'disabled', booleanAttribute],
        disableRipple: ['disableRipple', 'disableRipple', booleanAttribute],
        tabIndex: ['tabIndex', 'tabIndex', value => (value == null ? 0 : numberAttribute(value))],
        id: 'id',
      },
      host: {
        listeners: { focus: '_handleFocus()', keydown: '_handleKeydown($event)' },
        properties: {
          'attr.aria-controls': '_getAriaControls()',
          'attr.aria-current': '_getAriaCurrent()',
          'attr.aria-disabled': 'disabled',
          'attr.aria-selected': '_getAriaSelected()',
          'attr.id': 'id',
          'attr.tabIndex': '_getTabIndex()',
          'attr.role': '_getRole()',
          'class.mat-mdc-tab-disabled': 'disabled',
          'class.mdc-tab--active': 'active',
        },
        classAttribute: 'mdc-tab mat-mdc-tab-link mat-mdc-focus-indicator',
      },
      exportAs: ['matTabLink'],
      usesInheritance: true,
      ngImport: i0,
      template:
        '<span class="mdc-tab__ripple"></span>\n\n<div\n  class="mat-mdc-tab-ripple"\n  mat-ripple\n  [matRippleTrigger]="elementRef.nativeElement"\n  [matRippleDisabled]="rippleDisabled"></div>\n\n<span class="mdc-tab__content">\n  <span class="mdc-tab__text-label">\n    <ng-content></ng-content>\n  </span>\n</span>\n\n',
      styles: [
        '.mat-mdc-tab-link{-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-decoration:none;background:none;font-family:var(--mat-tab-header-label-text-font);font-size:var(--mat-tab-header-label-text-size);letter-spacing:var(--mat-tab-header-label-text-tracking);line-height:var(--mat-tab-header-label-text-line-height);font-weight:var(--mat-tab-header-label-text-weight)}.mat-mdc-tab-link .mdc-tab-indicator__content--underline{border-color:var(--mdc-tab-indicator-active-indicator-color)}.mat-mdc-tab-link .mdc-tab-indicator__content--underline{border-top-width:var(--mdc-tab-indicator-active-indicator-height)}.mat-mdc-tab-link .mdc-tab-indicator__content--underline{border-radius:var(--mdc-tab-indicator-active-indicator-shape)}.mat-mdc-tab-link:not(.mdc-tab--stacked){height:var(--mdc-secondary-navigation-tab-container-height)}.mat-mdc-tab-link:not(:disabled).mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):hover.mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):focus.mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):active.mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:disabled.mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):hover:not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):focus:not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):active:not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:disabled:not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link.mdc-tab{flex-grow:0}.mat-mdc-tab-link:hover .mdc-tab__text-label{color:var(--mat-tab-header-inactive-hover-label-text-color)}.mat-mdc-tab-link:focus .mdc-tab__text-label{color:var(--mat-tab-header-inactive-focus-label-text-color)}.mat-mdc-tab-link.mdc-tab--active .mdc-tab__text-label{color:var(--mat-tab-header-active-label-text-color)}.mat-mdc-tab-link.mdc-tab--active .mdc-tab__ripple::before,.mat-mdc-tab-link.mdc-tab--active .mat-ripple-element{background-color:var(--mat-tab-header-active-ripple-color)}.mat-mdc-tab-link.mdc-tab--active:hover .mdc-tab__text-label{color:var(--mat-tab-header-active-hover-label-text-color)}.mat-mdc-tab-link.mdc-tab--active:hover .mdc-tab-indicator__content--underline{border-color:var(--mat-tab-header-active-hover-indicator-color)}.mat-mdc-tab-link.mdc-tab--active:focus .mdc-tab__text-label{color:var(--mat-tab-header-active-focus-label-text-color)}.mat-mdc-tab-link.mdc-tab--active:focus .mdc-tab-indicator__content--underline{border-color:var(--mat-tab-header-active-focus-indicator-color)}.mat-mdc-tab-link.mat-mdc-tab-disabled{opacity:.4;pointer-events:none}.mat-mdc-tab-link.mat-mdc-tab-disabled .mdc-tab__content{pointer-events:none}.mat-mdc-tab-link.mat-mdc-tab-disabled .mdc-tab__ripple::before,.mat-mdc-tab-link.mat-mdc-tab-disabled .mat-ripple-element{background-color:var(--mat-tab-header-disabled-ripple-color)}.mat-mdc-tab-link .mdc-tab__ripple::before{content:"";display:block;position:absolute;top:0;left:0;right:0;bottom:0;opacity:0;pointer-events:none;background-color:var(--mat-tab-header-inactive-ripple-color)}.mat-mdc-tab-link .mdc-tab__text-label{color:var(--mat-tab-header-inactive-label-text-color);display:inline-flex;align-items:center}.mat-mdc-tab-link .mdc-tab__content{position:relative;pointer-events:auto}.mat-mdc-tab-link:hover .mdc-tab__ripple::before{opacity:.04}.mat-mdc-tab-link.cdk-program-focused .mdc-tab__ripple::before,.mat-mdc-tab-link.cdk-keyboard-focused .mdc-tab__ripple::before{opacity:.12}.mat-mdc-tab-link .mat-ripple-element{opacity:.12;background-color:var(--mat-tab-header-inactive-ripple-color)}.mat-mdc-tab-header.mat-mdc-tab-nav-bar-stretch-tabs .mat-mdc-tab-link{flex-grow:1}.mat-mdc-tab-link::before{margin:5px}@media(max-width: 599px){.mat-mdc-tab-link{min-width:72px}}',
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
      ],
      changeDetection: i0.ChangeDetectionStrategy.OnPush,
      encapsulation: i0.ViewEncapsulation.None,
    });
  }
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '17.2.0',
  ngImport: i0,
  type: MatTabLink,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: '[mat-tab-link], [matTabLink]',
          exportAs: 'matTabLink',
          changeDetection: ChangeDetectionStrategy.OnPush,
          encapsulation: ViewEncapsulation.None,
          host: {
            class: 'mdc-tab mat-mdc-tab-link mat-mdc-focus-indicator',
            '[attr.aria-controls]': '_getAriaControls()',
            '[attr.aria-current]': '_getAriaCurrent()',
            '[attr.aria-disabled]': 'disabled',
            '[attr.aria-selected]': '_getAriaSelected()',
            '[attr.id]': 'id',
            '[attr.tabIndex]': '_getTabIndex()',
            '[attr.role]': '_getRole()',
            '[class.mat-mdc-tab-disabled]': 'disabled',
            '[class.mdc-tab--active]': 'active',
            '(focus)': '_handleFocus()',
            '(keydown)': '_handleKeydown($event)',
          },
          standalone: true,
          imports: [MatRipple],
          template:
            '<span class="mdc-tab__ripple"></span>\n\n<div\n  class="mat-mdc-tab-ripple"\n  mat-ripple\n  [matRippleTrigger]="elementRef.nativeElement"\n  [matRippleDisabled]="rippleDisabled"></div>\n\n<span class="mdc-tab__content">\n  <span class="mdc-tab__text-label">\n    <ng-content></ng-content>\n  </span>\n</span>\n\n',
          styles: [
            '.mat-mdc-tab-link{-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-decoration:none;background:none;font-family:var(--mat-tab-header-label-text-font);font-size:var(--mat-tab-header-label-text-size);letter-spacing:var(--mat-tab-header-label-text-tracking);line-height:var(--mat-tab-header-label-text-line-height);font-weight:var(--mat-tab-header-label-text-weight)}.mat-mdc-tab-link .mdc-tab-indicator__content--underline{border-color:var(--mdc-tab-indicator-active-indicator-color)}.mat-mdc-tab-link .mdc-tab-indicator__content--underline{border-top-width:var(--mdc-tab-indicator-active-indicator-height)}.mat-mdc-tab-link .mdc-tab-indicator__content--underline{border-radius:var(--mdc-tab-indicator-active-indicator-shape)}.mat-mdc-tab-link:not(.mdc-tab--stacked){height:var(--mdc-secondary-navigation-tab-container-height)}.mat-mdc-tab-link:not(:disabled).mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):hover.mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):focus.mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):active.mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:disabled.mdc-tab--active .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):hover:not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):focus:not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:not(:disabled):active:not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link:disabled:not(.mdc-tab--active) .mdc-tab__icon{fill:currentColor}.mat-mdc-tab-link.mdc-tab{flex-grow:0}.mat-mdc-tab-link:hover .mdc-tab__text-label{color:var(--mat-tab-header-inactive-hover-label-text-color)}.mat-mdc-tab-link:focus .mdc-tab__text-label{color:var(--mat-tab-header-inactive-focus-label-text-color)}.mat-mdc-tab-link.mdc-tab--active .mdc-tab__text-label{color:var(--mat-tab-header-active-label-text-color)}.mat-mdc-tab-link.mdc-tab--active .mdc-tab__ripple::before,.mat-mdc-tab-link.mdc-tab--active .mat-ripple-element{background-color:var(--mat-tab-header-active-ripple-color)}.mat-mdc-tab-link.mdc-tab--active:hover .mdc-tab__text-label{color:var(--mat-tab-header-active-hover-label-text-color)}.mat-mdc-tab-link.mdc-tab--active:hover .mdc-tab-indicator__content--underline{border-color:var(--mat-tab-header-active-hover-indicator-color)}.mat-mdc-tab-link.mdc-tab--active:focus .mdc-tab__text-label{color:var(--mat-tab-header-active-focus-label-text-color)}.mat-mdc-tab-link.mdc-tab--active:focus .mdc-tab-indicator__content--underline{border-color:var(--mat-tab-header-active-focus-indicator-color)}.mat-mdc-tab-link.mat-mdc-tab-disabled{opacity:.4;pointer-events:none}.mat-mdc-tab-link.mat-mdc-tab-disabled .mdc-tab__content{pointer-events:none}.mat-mdc-tab-link.mat-mdc-tab-disabled .mdc-tab__ripple::before,.mat-mdc-tab-link.mat-mdc-tab-disabled .mat-ripple-element{background-color:var(--mat-tab-header-disabled-ripple-color)}.mat-mdc-tab-link .mdc-tab__ripple::before{content:"";display:block;position:absolute;top:0;left:0;right:0;bottom:0;opacity:0;pointer-events:none;background-color:var(--mat-tab-header-inactive-ripple-color)}.mat-mdc-tab-link .mdc-tab__text-label{color:var(--mat-tab-header-inactive-label-text-color);display:inline-flex;align-items:center}.mat-mdc-tab-link .mdc-tab__content{position:relative;pointer-events:auto}.mat-mdc-tab-link:hover .mdc-tab__ripple::before{opacity:.04}.mat-mdc-tab-link.cdk-program-focused .mdc-tab__ripple::before,.mat-mdc-tab-link.cdk-keyboard-focused .mdc-tab__ripple::before{opacity:.12}.mat-mdc-tab-link .mat-ripple-element{opacity:.12;background-color:var(--mat-tab-header-inactive-ripple-color)}.mat-mdc-tab-header.mat-mdc-tab-nav-bar-stretch-tabs .mat-mdc-tab-link{flex-grow:1}.mat-mdc-tab-link::before{margin:5px}@media(max-width: 599px){.mat-mdc-tab-link{min-width:72px}}',
          ],
        },
      ],
    },
  ],
  ctorParameters: () => [
    { type: MatTabNav },
    { type: i0.ElementRef },
    {
      type: undefined,
      decorators: [
        {
          type: Optional,
        },
        {
          type: Inject,
          args: [MAT_RIPPLE_GLOBAL_OPTIONS],
        },
      ],
    },
    {
      type: undefined,
      decorators: [
        {
          type: Attribute,
          args: ['tabindex'],
        },
      ],
    },
    { type: i4.FocusMonitor },
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
    active: [
      {
        type: Input,
        args: [{ transform: booleanAttribute }],
      },
    ],
    disabled: [
      {
        type: Input,
        args: [{ transform: booleanAttribute }],
      },
    ],
    disableRipple: [
      {
        type: Input,
        args: [{ transform: booleanAttribute }],
      },
    ],
    tabIndex: [
      {
        type: Input,
        args: [
          {
            transform: value => (value == null ? 0 : numberAttribute(value)),
          },
        ],
      },
    ],
    id: [
      {
        type: Input,
      },
    ],
  },
});
/**
 * Tab panel component associated with MatTabNav.
 */
export class MatTabNavPanel {
  constructor() {
    /** Unique id for the tab panel. */
    this.id = `mat-tab-nav-panel-${nextUniqueId++}`;
  }
  static {
    this.ɵfac = i0.ɵɵngDeclareFactory({
      minVersion: '12.0.0',
      version: '17.2.0',
      ngImport: i0,
      type: MatTabNavPanel,
      deps: [],
      target: i0.ɵɵFactoryTarget.Component,
    });
  }
  static {
    this.ɵcmp = i0.ɵɵngDeclareComponent({
      minVersion: '14.0.0',
      version: '17.2.0',
      type: MatTabNavPanel,
      isStandalone: true,
      selector: 'mat-tab-nav-panel',
      inputs: { id: 'id' },
      host: {
        attributes: { role: 'tabpanel' },
        properties: { 'attr.aria-labelledby': '_activeTabId', 'attr.id': 'id' },
        classAttribute: 'mat-mdc-tab-nav-panel',
      },
      exportAs: ['matTabNavPanel'],
      ngImport: i0,
      template: '<ng-content></ng-content>',
      isInline: true,
      changeDetection: i0.ChangeDetectionStrategy.OnPush,
      encapsulation: i0.ViewEncapsulation.None,
    });
  }
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '17.2.0',
  ngImport: i0,
  type: MatTabNavPanel,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-tab-nav-panel',
          exportAs: 'matTabNavPanel',
          template: '<ng-content></ng-content>',
          host: {
            '[attr.aria-labelledby]': '_activeTabId',
            '[attr.id]': 'id',
            class: 'mat-mdc-tab-nav-panel',
            role: 'tabpanel',
          },
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          standalone: true,
        },
      ],
    },
  ],
  propDecorators: {
    id: [
      {
        type: Input,
      },
    ],
  },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLW5hdi1iYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItbmF2LWJhci90YWItbmF2LWJhci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL3RhYi1uYXYtYmFyL3RhYi1uYXYtYmFyLmh0bWwiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItbmF2LWJhci90YWItbGluay5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFJTCxTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFDZixVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLGVBQWUsRUFFZixRQUFRLEVBQ1IsU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsRUFDakIscUJBQXFCLEdBQ3RCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCx5QkFBeUIsRUFDekIsU0FBUyxHQUtWLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFrQixZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNqRCxPQUFPLEVBQUMsZUFBZSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM5QyxPQUFPLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFn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bUJBQW1CO29CQUM3QixRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0osd0JBQXdCLEVBQUUsY0FBYzt3QkFDeEMsV0FBVyxFQUFFLElBQUk7d0JBQ2pCLE9BQU8sRUFBRSx1QkFBdUI7d0JBQ2hDLE1BQU0sRUFBRSxVQUFVO3FCQUNuQjtvQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjs4QkFHVSxFQUFFO3NCQUFWLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIEF0dHJpYnV0ZSxcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBudW1iZXJBdHRyaWJ1dGUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQU5JTUFUSU9OX01PRFVMRV9UWVBFLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsXG4gIE1hdFJpcHBsZSxcbiAgUmlwcGxlQ29uZmlnLFxuICBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICBSaXBwbGVUYXJnZXQsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0ZvY3VzYWJsZU9wdGlvbiwgRm9jdXNNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7TWF0SW5rQmFyLCBJbmtCYXJJdGVtfSBmcm9tICcuLi9pbmstYmFyJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRoLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7RU5URVIsIFNQQUNFfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtNQVRfVEFCU19DT05GSUcsIE1hdFRhYnNDb25maWd9IGZyb20gJy4uL3RhYi1jb25maWcnO1xuaW1wb3J0IHtNYXRQYWdpbmF0ZWRUYWJIZWFkZXJ9IGZyb20gJy4uL3BhZ2luYXRlZC10YWItaGVhZGVyJztcbmltcG9ydCB7Q2RrT2JzZXJ2ZUNvbnRlbnR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vYnNlcnZlcnMnO1xuXG4vLyBJbmNyZWFzaW5nIGludGVnZXIgZm9yIGdlbmVyYXRpbmcgdW5pcXVlIGlkcyBmb3IgdGFiIG5hdiBjb21wb25lbnRzLlxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8qKlxuICogTmF2aWdhdGlvbiBjb21wb25lbnQgbWF0Y2hpbmcgdGhlIHN0eWxlcyBvZiB0aGUgdGFiIGdyb3VwIGhlYWRlci5cbiAqIFByb3ZpZGVzIGFuY2hvcmVkIG5hdmlnYXRpb24gd2l0aCBhbmltYXRlZCBpbmsgYmFyLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbWF0LXRhYi1uYXYtYmFyXScsXG4gIGV4cG9ydEFzOiAnbWF0VGFiTmF2QmFyLCBtYXRUYWJOYXYnLFxuICB0ZW1wbGF0ZVVybDogJ3RhYi1uYXYtYmFyLmh0bWwnLFxuICBzdHlsZVVybDogJ3RhYi1uYXYtYmFyLmNzcycsXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIucm9sZV0nOiAnX2dldFJvbGUoKScsXG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtdGFiLW5hdi1iYXIgbWF0LW1kYy10YWItaGVhZGVyJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtdGFiLWhlYWRlci1wYWdpbmF0aW9uLWNvbnRyb2xzLWVuYWJsZWRdJzogJ19zaG93UGFnaW5hdGlvbkNvbnRyb2xzJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtdGFiLWhlYWRlci1ydGxdJzogXCJfZ2V0TGF5b3V0RGlyZWN0aW9uKCkgPT0gJ3J0bCdcIixcbiAgICAnW2NsYXNzLm1hdC1tZGMtdGFiLW5hdi1iYXItc3RyZXRjaC10YWJzXSc6ICdzdHJldGNoVGFicycsXG4gICAgJ1tjbGFzcy5tYXQtcHJpbWFyeV0nOiAnY29sb3IgIT09IFwid2FyblwiICYmIGNvbG9yICE9PSBcImFjY2VudFwiJyxcbiAgICAnW2NsYXNzLm1hdC1hY2NlbnRdJzogJ2NvbG9yID09PSBcImFjY2VudFwiJyxcbiAgICAnW2NsYXNzLm1hdC13YXJuXSc6ICdjb2xvciA9PT0gXCJ3YXJuXCInLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25Nb2RlID09PSBcIk5vb3BBbmltYXRpb25zXCInLFxuICAgICdbc3R5bGUuLS1tYXQtdGFiLWFuaW1hdGlvbi1kdXJhdGlvbl0nOiAnYW5pbWF0aW9uRHVyYXRpb24nLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtNYXRSaXBwbGUsIENka09ic2VydmVDb250ZW50XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiTmF2XG4gIGV4dGVuZHMgTWF0UGFnaW5hdGVkVGFiSGVhZGVyXG4gIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0XG57XG4gIC8qKiBXaGV0aGVyIHRoZSBpbmsgYmFyIHNob3VsZCBmaXQgaXRzIHdpZHRoIHRvIHRoZSBzaXplIG9mIHRoZSB0YWIgbGFiZWwgY29udGVudC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBnZXQgZml0SW5rQmFyVG9Db250ZW50KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9maXRJbmtCYXJUb0NvbnRlbnQudmFsdWU7XG4gIH1cbiAgc2V0IGZpdElua0JhclRvQ29udGVudCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2ZpdElua0JhclRvQ29udGVudC5uZXh0KHZhbHVlKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBfZml0SW5rQmFyVG9Db250ZW50ID0gbmV3IEJlaGF2aW9yU3ViamVjdChmYWxzZSk7XG5cbiAgLyoqIFdoZXRoZXIgdGFicyBzaG91bGQgYmUgc3RyZXRjaGVkIHRvIGZpbGwgdGhlIGhlYWRlci4gKi9cbiAgQElucHV0KHthbGlhczogJ21hdC1zdHJldGNoLXRhYnMnLCB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBzdHJldGNoVGFiczogYm9vbGVhbiA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZ2V0IGFuaW1hdGlvbkR1cmF0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvbkR1cmF0aW9uO1xuICB9XG5cbiAgc2V0IGFuaW1hdGlvbkR1cmF0aW9uKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICBjb25zdCBzdHJpbmdWYWx1ZSA9IHZhbHVlICsgJyc7XG4gICAgdGhpcy5fYW5pbWF0aW9uRHVyYXRpb24gPSAvXlxcZCskLy50ZXN0KHN0cmluZ1ZhbHVlKSA/IHZhbHVlICsgJ21zJyA6IHN0cmluZ1ZhbHVlO1xuICB9XG5cbiAgcHJpdmF0ZSBfYW5pbWF0aW9uRHVyYXRpb246IHN0cmluZztcblxuICAvKiogUXVlcnkgbGlzdCBvZiBhbGwgdGFiIGxpbmtzIG9mIHRoZSB0YWIgbmF2aWdhdGlvbi4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihmb3J3YXJkUmVmKCgpID0+IE1hdFRhYkxpbmspLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfaXRlbXM6IFF1ZXJ5TGlzdDxNYXRUYWJMaW5rPjtcblxuICAvKiogQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgdGFiIG5hdi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGJhY2tncm91bmRDb2xvcigpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kQ29sb3I7XG4gIH1cblxuICBzZXQgYmFja2dyb3VuZENvbG9yKHZhbHVlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgIGNsYXNzTGlzdC5yZW1vdmUoJ21hdC10YWJzLXdpdGgtYmFja2dyb3VuZCcsIGBtYXQtYmFja2dyb3VuZC0ke3RoaXMuYmFja2dyb3VuZENvbG9yfWApO1xuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBjbGFzc0xpc3QuYWRkKCdtYXQtdGFicy13aXRoLWJhY2tncm91bmQnLCBgbWF0LWJhY2tncm91bmQtJHt2YWx1ZX1gKTtcbiAgICB9XG5cbiAgICB0aGlzLl9iYWNrZ3JvdW5kQ29sb3IgPSB2YWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgX2JhY2tncm91bmRDb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByaXBwbGUgZWZmZWN0IGlzIGRpc2FibGVkIG9yIG5vdC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBkaXNhYmxlUmlwcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZW1lIGNvbG9yIG9mIHRoZSBuYXYgYmFyLiAqL1xuICBASW5wdXQoKSBjb2xvcjogVGhlbWVQYWxldHRlID0gJ3ByaW1hcnknO1xuXG4gIC8qKlxuICAgKiBBc3NvY2lhdGVkIHRhYiBwYW5lbCBjb250cm9sbGVkIGJ5IHRoZSBuYXYgYmFyLiBJZiBub3QgcHJvdmlkZWQsIHRoZW4gdGhlIG5hdiBiYXJcbiAgICogZm9sbG93cyB0aGUgQVJJQSBsaW5rIC8gbmF2aWdhdGlvbiBsYW5kbWFyayBwYXR0ZXJuLiBJZiBwcm92aWRlZCwgaXQgZm9sbG93cyB0aGVcbiAgICogQVJJQSB0YWJzIGRlc2lnbiBwYXR0ZXJuLlxuICAgKi9cbiAgQElucHV0KCkgdGFiUGFuZWw/OiBNYXRUYWJOYXZQYW5lbDtcblxuICBAVmlld0NoaWxkKCd0YWJMaXN0Q29udGFpbmVyJywge3N0YXRpYzogdHJ1ZX0pIF90YWJMaXN0Q29udGFpbmVyOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJMaXN0Jywge3N0YXRpYzogdHJ1ZX0pIF90YWJMaXN0OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJMaXN0SW5uZXInLCB7c3RhdGljOiB0cnVlfSkgX3RhYkxpc3RJbm5lcjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnbmV4dFBhZ2luYXRvcicpIF9uZXh0UGFnaW5hdG9yOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgncHJldmlvdXNQYWdpbmF0b3InKSBfcHJldmlvdXNQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBfaW5rQmFyOiBNYXRJbmtCYXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9UQUJTX0NPTkZJRykgZGVmYXVsdENvbmZpZz86IE1hdFRhYnNDb25maWcsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGNoYW5nZURldGVjdG9yUmVmLCB2aWV3cG9ydFJ1bGVyLCBkaXIsIG5nWm9uZSwgcGxhdGZvcm0sIGFuaW1hdGlvbk1vZGUpO1xuICAgIHRoaXMuZGlzYWJsZVBhZ2luYXRpb24gPVxuICAgICAgZGVmYXVsdENvbmZpZyAmJiBkZWZhdWx0Q29uZmlnLmRpc2FibGVQYWdpbmF0aW9uICE9IG51bGxcbiAgICAgICAgPyBkZWZhdWx0Q29uZmlnLmRpc2FibGVQYWdpbmF0aW9uXG4gICAgICAgIDogZmFsc2U7XG4gICAgdGhpcy5maXRJbmtCYXJUb0NvbnRlbnQgPVxuICAgICAgZGVmYXVsdENvbmZpZyAmJiBkZWZhdWx0Q29uZmlnLmZpdElua0JhclRvQ29udGVudCAhPSBudWxsXG4gICAgICAgID8gZGVmYXVsdENvbmZpZy5maXRJbmtCYXJUb0NvbnRlbnRcbiAgICAgICAgOiBmYWxzZTtcbiAgICB0aGlzLnN0cmV0Y2hUYWJzID1cbiAgICAgIGRlZmF1bHRDb25maWcgJiYgZGVmYXVsdENvbmZpZy5zdHJldGNoVGFicyAhPSBudWxsID8gZGVmYXVsdENvbmZpZy5zdHJldGNoVGFicyA6IHRydWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2l0ZW1TZWxlY3RlZCgpIHtcbiAgICAvLyBub29wXG4gIH1cblxuICBvdmVycmlkZSBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5faW5rQmFyID0gbmV3IE1hdElua0Jhcih0aGlzLl9pdGVtcyk7XG4gICAgLy8gV2UgbmVlZCB0aGlzIHRvIHJ1biBiZWZvcmUgdGhlIGBjaGFuZ2VzYCBzdWJzY3JpcHRpb24gaW4gcGFyZW50IHRvIGVuc3VyZSB0aGF0IHRoZVxuICAgIC8vIHNlbGVjdGVkSW5kZXggaXMgdXAtdG8tZGF0ZSBieSB0aGUgdGltZSB0aGUgc3VwZXIgY2xhc3Mgc3RhcnRzIGxvb2tpbmcgZm9yIGl0LlxuICAgIHRoaXMuX2l0ZW1zLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVBY3RpdmVMaW5rKCk7XG4gICAgfSk7XG5cbiAgICBzdXBlci5uZ0FmdGVyQ29udGVudEluaXQoKTtcbiAgfVxuXG4gIG92ZXJyaWRlIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAoIXRoaXMudGFiUGFuZWwgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSBtYXQtdGFiLW5hdi1wYW5lbCBtdXN0IGJlIHNwZWNpZmllZCB2aWEgW3RhYlBhbmVsXS4nKTtcbiAgICB9XG4gICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XG4gIH1cblxuICAvKiogTm90aWZpZXMgdGhlIGNvbXBvbmVudCB0aGF0IHRoZSBhY3RpdmUgbGluayBoYXMgYmVlbiBjaGFuZ2VkLiAqL1xuICB1cGRhdGVBY3RpdmVMaW5rKCkge1xuICAgIGlmICghdGhpcy5faXRlbXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2l0ZW1zLnRvQXJyYXkoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpdGVtc1tpXS5hY3RpdmUpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgICAgaWYgKHRoaXMudGFiUGFuZWwpIHtcbiAgICAgICAgICB0aGlzLnRhYlBhbmVsLl9hY3RpdmVUYWJJZCA9IGl0ZW1zW2ldLmlkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZSBpbmsgYmFyIHNob3VsZCBoaWRlIGl0c2VsZiBpZiBubyBpdGVtcyBhcmUgYWN0aXZlLlxuICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgIHRoaXMuX2lua0Jhci5oaWRlKCk7XG4gIH1cblxuICBfZ2V0Um9sZSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy50YWJQYW5lbCA/ICd0YWJsaXN0JyA6IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3JvbGUnKTtcbiAgfVxufVxuXG4vKipcbiAqIExpbmsgaW5zaWRlIGEgYG1hdC10YWItbmF2LWJhcmAuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ1ttYXQtdGFiLWxpbmtdLCBbbWF0VGFiTGlua10nLFxuICBleHBvcnRBczogJ21hdFRhYkxpbmsnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgdGVtcGxhdGVVcmw6ICd0YWItbGluay5odG1sJyxcbiAgc3R5bGVVcmw6ICd0YWItbGluay5jc3MnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy10YWIgbWF0LW1kYy10YWItbGluayBtYXQtbWRjLWZvY3VzLWluZGljYXRvcicsXG4gICAgJ1thdHRyLmFyaWEtY29udHJvbHNdJzogJ19nZXRBcmlhQ29udHJvbHMoKScsXG4gICAgJ1thdHRyLmFyaWEtY3VycmVudF0nOiAnX2dldEFyaWFDdXJyZW50KCknLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1thdHRyLmFyaWEtc2VsZWN0ZWRdJzogJ19nZXRBcmlhU2VsZWN0ZWQoKScsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ1thdHRyLnRhYkluZGV4XSc6ICdfZ2V0VGFiSW5kZXgoKScsXG4gICAgJ1thdHRyLnJvbGVdJzogJ19nZXRSb2xlKCknLFxuICAgICdbY2xhc3MubWF0LW1kYy10YWItZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1kYy10YWItLWFjdGl2ZV0nOiAnYWN0aXZlJyxcbiAgICAnKGZvY3VzKSc6ICdfaGFuZGxlRm9jdXMoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgfSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW01hdFJpcHBsZV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYkxpbmtcbiAgZXh0ZW5kcyBJbmtCYXJJdGVtXG4gIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBSaXBwbGVUYXJnZXQsIEZvY3VzYWJsZU9wdGlvblxue1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0YWIgbGluayBpcyBhY3RpdmUgb3Igbm90LiAqL1xuICBwcm90ZWN0ZWQgX2lzQWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxpbmsgaXMgYWN0aXZlLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGdldCBhY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzQWN0aXZlO1xuICB9XG5cbiAgc2V0IGFjdGl2ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX2lzQWN0aXZlID0gdmFsdWU7XG4gICAgICB0aGlzLl90YWJOYXZCYXIudXBkYXRlQWN0aXZlTGluaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSB0YWIgbGluayBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHJpcHBsZXMgYXJlIGRpc2FibGVkIG9uIHRoZSB0YWIgbGluay4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBkaXNhYmxlUmlwcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0KHtcbiAgICB0cmFuc2Zvcm06ICh2YWx1ZTogdW5rbm93bikgPT4gKHZhbHVlID09IG51bGwgPyAwIDogbnVtYmVyQXR0cmlidXRlKHZhbHVlKSksXG4gIH0pXG4gIHRhYkluZGV4OiBudW1iZXIgPSAwO1xuXG4gIC8qKlxuICAgKiBSaXBwbGUgY29uZmlndXJhdGlvbiBmb3IgcmlwcGxlcyB0aGF0IGFyZSBsYXVuY2hlZCBvbiBwb2ludGVyIGRvd24uIFRoZSByaXBwbGUgY29uZmlnXG4gICAqIGlzIHNldCB0byB0aGUgZ2xvYmFsIHJpcHBsZSBvcHRpb25zIHNpbmNlIHdlIGRvbid0IGhhdmUgYW55IGNvbmZpZ3VyYWJsZSBvcHRpb25zIGZvclxuICAgKiB0aGUgdGFiIGxpbmsgcmlwcGxlcy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmlwcGxlQ29uZmlnOiBSaXBwbGVDb25maWcgJiBSaXBwbGVHbG9iYWxPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHJpcHBsZXMgYXJlIGRpc2FibGVkIG9uIGludGVyYWN0aW9uLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgcmlwcGxlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuZGlzYWJsZWQgfHxcbiAgICAgIHRoaXMuZGlzYWJsZVJpcHBsZSB8fFxuICAgICAgdGhpcy5fdGFiTmF2QmFyLmRpc2FibGVSaXBwbGUgfHxcbiAgICAgICEhdGhpcy5yaXBwbGVDb25maWcuZGlzYWJsZWRcbiAgICApO1xuICB9XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhlIHRhYi4gKi9cbiAgQElucHV0KCkgaWQgPSBgbWF0LXRhYi1saW5rLSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF90YWJOYXZCYXI6IE1hdFRhYk5hdixcbiAgICAvKiogQGRvY3MtcHJpdmF0ZSAqLyBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpIGdsb2JhbFJpcHBsZU9wdGlvbnM6IFJpcHBsZUdsb2JhbE9wdGlvbnMgfCBudWxsLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMucmlwcGxlQ29uZmlnID0gZ2xvYmFsUmlwcGxlT3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnRhYkluZGV4ID0gcGFyc2VJbnQodGFiSW5kZXgpIHx8IDA7XG5cbiAgICBpZiAoYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgdGhpcy5yaXBwbGVDb25maWcuYW5pbWF0aW9uID0ge2VudGVyRHVyYXRpb246IDAsIGV4aXREdXJhdGlvbjogMH07XG4gICAgfVxuXG4gICAgX3RhYk5hdkJhci5fZml0SW5rQmFyVG9Db250ZW50XG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoZml0SW5rQmFyVG9Db250ZW50ID0+IHtcbiAgICAgICAgdGhpcy5maXRJbmtCYXJUb0NvbnRlbnQgPSBmaXRJbmtCYXJUb0NvbnRlbnQ7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSB0YWIgbGluay4gKi9cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLmVsZW1lbnRSZWYpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLmVsZW1lbnRSZWYpO1xuICB9XG5cbiAgX2hhbmRsZUZvY3VzKCkge1xuICAgIC8vIFNpbmNlIHdlIGFsbG93IG5hdmlnYXRpb24gdGhyb3VnaCB0YWJiaW5nIGluIHRoZSBuYXYgYmFyLCB3ZVxuICAgIC8vIGhhdmUgdG8gdXBkYXRlIHRoZSBmb2N1c2VkIGluZGV4IHdoZW5ldmVyIHRoZSBsaW5rIHJlY2VpdmVzIGZvY3VzLlxuICAgIHRoaXMuX3RhYk5hdkJhci5mb2N1c0luZGV4ID0gdGhpcy5fdGFiTmF2QmFyLl9pdGVtcy50b0FycmF5KCkuaW5kZXhPZih0aGlzKTtcbiAgfVxuXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IFNQQUNFIHx8IGV2ZW50LmtleUNvZGUgPT09IEVOVEVSKSB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl90YWJOYXZCYXIudGFiUGFuZWwpIHtcbiAgICAgICAgLy8gT25seSBwcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiBvbiBzcGFjZSBzaW5jZSBpdCBjYW4gc2Nyb2xsIHRoZSBwYWdlLlxuICAgICAgICAvLyBEb24ndCBwcmV2ZW50IGVudGVyIHNpbmNlIGl0IGNhbiBicmVhayBsaW5rIG5hdmlnYXRpb24uXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBTUEFDRSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGljaygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9nZXRBcmlhQ29udHJvbHMoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3RhYk5hdkJhci50YWJQYW5lbFxuICAgICAgPyB0aGlzLl90YWJOYXZCYXIudGFiUGFuZWw/LmlkXG4gICAgICA6IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xuICB9XG5cbiAgX2dldEFyaWFTZWxlY3RlZCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5fdGFiTmF2QmFyLnRhYlBhbmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5hY3RpdmUgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJyk7XG4gICAgfVxuICB9XG5cbiAgX2dldEFyaWFDdXJyZW50KCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZSAmJiAhdGhpcy5fdGFiTmF2QmFyLnRhYlBhbmVsID8gJ3BhZ2UnIDogbnVsbDtcbiAgfVxuXG4gIF9nZXRSb2xlKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl90YWJOYXZCYXIudGFiUGFuZWwgPyAndGFiJyA6IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEF0dHJpYnV0ZSgncm9sZScpO1xuICB9XG5cbiAgX2dldFRhYkluZGV4KCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMuX3RhYk5hdkJhci50YWJQYW5lbCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2lzQWN0aXZlICYmICF0aGlzLmRpc2FibGVkID8gMCA6IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/IC0xIDogdGhpcy50YWJJbmRleDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUYWIgcGFuZWwgY29tcG9uZW50IGFzc29jaWF0ZWQgd2l0aCBNYXRUYWJOYXYuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWItbmF2LXBhbmVsJyxcbiAgZXhwb3J0QXM6ICdtYXRUYWJOYXZQYW5lbCcsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfYWN0aXZlVGFiSWQnLFxuICAgICdbYXR0ci5pZF0nOiAnaWQnLFxuICAgICdjbGFzcyc6ICdtYXQtbWRjLXRhYi1uYXYtcGFuZWwnLFxuICAgICdyb2xlJzogJ3RhYnBhbmVsJyxcbiAgfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYk5hdlBhbmVsIHtcbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhlIHRhYiBwYW5lbC4gKi9cbiAgQElucHV0KCkgaWQgPSBgbWF0LXRhYi1uYXYtcGFuZWwtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBJZCBvZiB0aGUgYWN0aXZlIHRhYiBpbiB0aGUgbmF2IGJhci4gKi9cbiAgX2FjdGl2ZVRhYklkPzogc3RyaW5nO1xufVxuIiwiPCEtLSBUT0RPOiB0aGlzIGFsc28gaGFkIGBtYXQtZWxldmF0aW9uLXo0YC4gRmlndXJlIG91dCB3aGF0IHdlIHNob3VsZCBkbyB3aXRoIGl0LiAtLT5cbjxidXR0b24gY2xhc3M9XCJtYXQtbWRjLXRhYi1oZWFkZXItcGFnaW5hdGlvbiBtYXQtbWRjLXRhYi1oZWFkZXItcGFnaW5hdGlvbi1iZWZvcmVcIlxuICAgICAjcHJldmlvdXNQYWdpbmF0b3JcbiAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgIG1hdC1yaXBwbGVcbiAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgIFttYXRSaXBwbGVEaXNhYmxlZF09XCJfZGlzYWJsZVNjcm9sbEJlZm9yZSB8fCBkaXNhYmxlUmlwcGxlXCJcbiAgICAgW2NsYXNzLm1hdC1tZGMtdGFiLWhlYWRlci1wYWdpbmF0aW9uLWRpc2FibGVkXT1cIl9kaXNhYmxlU2Nyb2xsQmVmb3JlXCJcbiAgICAgW2Rpc2FibGVkXT1cIl9kaXNhYmxlU2Nyb2xsQmVmb3JlIHx8IG51bGxcIlxuICAgICAoY2xpY2spPVwiX2hhbmRsZVBhZ2luYXRvckNsaWNrKCdiZWZvcmUnKVwiXG4gICAgIChtb3VzZWRvd24pPVwiX2hhbmRsZVBhZ2luYXRvclByZXNzKCdiZWZvcmUnLCAkZXZlbnQpXCJcbiAgICAgKHRvdWNoZW5kKT1cIl9zdG9wSW50ZXJ2YWwoKVwiPlxuICA8ZGl2IGNsYXNzPVwibWF0LW1kYy10YWItaGVhZGVyLXBhZ2luYXRpb24tY2hldnJvblwiPjwvZGl2PlxuPC9idXR0b24+XG5cbjxkaXYgY2xhc3M9XCJtYXQtbWRjLXRhYi1saW5rLWNvbnRhaW5lclwiICN0YWJMaXN0Q29udGFpbmVyIChrZXlkb3duKT1cIl9oYW5kbGVLZXlkb3duKCRldmVudClcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtdGFiLWxpc3RcIiAjdGFiTGlzdCAoY2RrT2JzZXJ2ZUNvbnRlbnQpPVwiX29uQ29udGVudENoYW5nZXMoKVwiPlxuICAgIDxkaXYgY2xhc3M9XCJtYXQtbWRjLXRhYi1saW5rc1wiICN0YWJMaXN0SW5uZXI+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG5cbjwhLS0gVE9ETzogdGhpcyBhbHNvIGhhZCBgbWF0LWVsZXZhdGlvbi16NGAuIEZpZ3VyZSBvdXQgd2hhdCB3ZSBzaG91bGQgZG8gd2l0aCBpdC4gLS0+XG48YnV0dG9uIGNsYXNzPVwibWF0LW1kYy10YWItaGVhZGVyLXBhZ2luYXRpb24gbWF0LW1kYy10YWItaGVhZGVyLXBhZ2luYXRpb24tYWZ0ZXJcIlxuICAgICAjbmV4dFBhZ2luYXRvclxuICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgbWF0LXJpcHBsZVxuICAgICBbbWF0UmlwcGxlRGlzYWJsZWRdPVwiX2Rpc2FibGVTY3JvbGxBZnRlciB8fCBkaXNhYmxlUmlwcGxlXCJcbiAgICAgW2NsYXNzLm1hdC1tZGMtdGFiLWhlYWRlci1wYWdpbmF0aW9uLWRpc2FibGVkXT1cIl9kaXNhYmxlU2Nyb2xsQWZ0ZXJcIlxuICAgICBbZGlzYWJsZWRdPVwiX2Rpc2FibGVTY3JvbGxBZnRlciB8fCBudWxsXCJcbiAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgIChtb3VzZWRvd24pPVwiX2hhbmRsZVBhZ2luYXRvclByZXNzKCdhZnRlcicsICRldmVudClcIlxuICAgICAoY2xpY2spPVwiX2hhbmRsZVBhZ2luYXRvckNsaWNrKCdhZnRlcicpXCJcbiAgICAgKHRvdWNoZW5kKT1cIl9zdG9wSW50ZXJ2YWwoKVwiPlxuICA8ZGl2IGNsYXNzPVwibWF0LW1kYy10YWItaGVhZGVyLXBhZ2luYXRpb24tY2hldnJvblwiPjwvZGl2PlxuPC9idXR0b24+XG4iLCI8c3BhbiBjbGFzcz1cIm1kYy10YWJfX3JpcHBsZVwiPjwvc3Bhbj5cblxuPGRpdlxuICBjbGFzcz1cIm1hdC1tZGMtdGFiLXJpcHBsZVwiXG4gIG1hdC1yaXBwbGVcbiAgW21hdFJpcHBsZVRyaWdnZXJdPVwiZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50XCJcbiAgW21hdFJpcHBsZURpc2FibGVkXT1cInJpcHBsZURpc2FibGVkXCI+PC9kaXY+XG5cbjxzcGFuIGNsYXNzPVwibWRjLXRhYl9fY29udGVudFwiPlxuICA8c3BhbiBjbGFzcz1cIm1kYy10YWJfX3RleHQtbGFiZWxcIj5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIDwvc3Bhbj5cbjwvc3Bhbj5cblxuIl19
