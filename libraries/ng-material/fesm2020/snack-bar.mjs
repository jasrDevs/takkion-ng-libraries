import * as i1$1 from '@takkion/ng-cdk/overlay';
import { OverlayModule, OverlayConfig } from '@takkion/ng-cdk/overlay';
import * as i3$1 from '@takkion/ng-cdk/portal';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  PortalModule,
  ComponentPortal,
  TemplatePortal,
} from '@takkion/ng-cdk/portal';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import {
  InjectionToken,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Inject,
  Directive,
  ViewChild,
  NgModule,
  Injector,
  TemplateRef,
  Injectable,
  Optional,
  SkipSelf,
} from '@angular/core';
import { TakCommonModule } from '@takkion/ng-material/core';
import * as i3 from '@takkion/ng-material/button';
import { TakButtonModule } from '@takkion/ng-material/button';
import { Subject } from 'rxjs';
import * as i1 from '@takkion/ng-cdk/platform';
import { take, takeUntil } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as i2$1 from '@takkion/ng-cdk/a11y';
import * as i3$2 from '@takkion/ng-cdk/layout';
import { Breakpoints } from '@takkion/ng-cdk/layout';

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Injection token that can be used to access the data that was passed in to a snack bar. */
const TAK_SNACK_BAR_DATA = new InjectionToken('TakSnackBarData');
/**
 * Configuration used when opening a snack-bar.
 */
class TakSnackBarConfig {
  constructor() {
    /** The politeness level for the TakAriaLiveAnnouncer announcement. */
    this.politeness = 'assertive';
    /**
     * Message to be announced by the LiveAnnouncer. When opening a snackbar without a custom
     * component or template, the announcement message will default to the specified message.
     */
    this.announcementMessage = '';
    /** The length of time in milliseconds to wait before automatically dismissing the snack bar. */
    this.duration = 0;
    /** Data being injected into the child component. */
    this.data = null;
    /** The horizontal position to place the snack bar. */
    this.horizontalPosition = 'center';
    /** The vertical position to place the snack bar. */
    this.verticalPosition = 'bottom';
  }
}

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Maximum amount of milliseconds that can be passed into setTimeout. */
const MAX_TIMEOUT = Math.pow(2, 31) - 1;
/**
 * Reference to a snack bar dispatched from the snack bar service.
 */
class TakSnackBarRef {
  constructor(containerInstance, _overlayRef) {
    this._overlayRef = _overlayRef;
    /** Subject for notifying the user that the snack bar has been dismissed. */
    this._afterDismissed = new Subject();
    /** Subject for notifying the user that the snack bar has opened and appeared. */
    this._afterOpened = new Subject();
    /** Subject for notifying the user that the snack bar action was called. */
    this._onAction = new Subject();
    /** Whether the snack bar was dismissed using the action button. */
    this._dismissedByAction = false;
    this.containerInstance = containerInstance;
    containerInstance._onExit.subscribe(() => this._finishDismiss());
  }
  /** Dismisses the snack bar. */
  dismiss() {
    if (!this._afterDismissed.closed) {
      this.containerInstance.exit();
    }
    clearTimeout(this._durationTimeoutId);
  }
  /** Marks the snackbar action clicked. */
  dismissWithAction() {
    if (!this._onAction.closed) {
      this._dismissedByAction = true;
      this._onAction.next();
      this._onAction.complete();
      this.dismiss();
    }
    clearTimeout(this._durationTimeoutId);
  }
  /**
   * Marks the snackbar action clicked.
   * @deprecated Use `dismissWithAction` instead.
   * @breaking-change 8.0.0
   */
  closeWithAction() {
    this.dismissWithAction();
  }
  /** Dismisses the snack bar after some duration */
  _dismissAfter(duration) {
    // Note that we need to cap the duration to the maximum value for setTimeout, because
    // it'll revert to 1 if somebody passes in something greater (e.g. `Infinity`). See #17234.
    this._durationTimeoutId = setTimeout(() => this.dismiss(), Math.min(duration, MAX_TIMEOUT));
  }
  /** Marks the snackbar as opened */
  _open() {
    if (!this._afterOpened.closed) {
      this._afterOpened.next();
      this._afterOpened.complete();
    }
  }
  /** Cleans up the DOM after closing. */
  _finishDismiss() {
    this._overlayRef.dispose();
    if (!this._onAction.closed) {
      this._onAction.complete();
    }
    this._afterDismissed.next({ dismissedByAction: this._dismissedByAction });
    this._afterDismissed.complete();
    this._dismissedByAction = false;
  }
  /** Gets an observable that is notified when the snack bar is finished closing. */
  afterDismissed() {
    return this._afterDismissed;
  }
  /** Gets an observable that is notified when the snack bar has opened and appeared. */
  afterOpened() {
    return this.containerInstance._onEnter;
  }
  /** Gets an observable that is notified when the snack bar action is called. */
  onAction() {
    return this._onAction;
  }
}

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
class SimpleSnackBar {
  constructor(snackBarRef, data) {
    this.snackBarRef = snackBarRef;
    this.data = data;
  }
  /** Performs the action on the snack bar. */
  action() {
    this.snackBarRef.dismissWithAction();
  }
  /** If the action button should be shown. */
  get hasAction() {
    return !!this.data.action;
  }
}
SimpleSnackBar.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: SimpleSnackBar,
  deps: [{ token: TakSnackBarRef }, { token: TAK_SNACK_BAR_DATA }],
  target: i0.ɵɵFactoryTarget.Component,
});
SimpleSnackBar.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: SimpleSnackBar,
  selector: 'simple-snack-bar',
  host: { classAttribute: 'tak-simple-snackbar' },
  ngImport: i0,
  template:
    '<span class="tak-simple-snack-bar-content">{{data.message}}</span>\n<div class="tak-simple-snackbar-action"  *ngIf="hasAction">\n  <button tak-button (click)="action()">{{data.action}}</button>\n</div>\n',
  styles: [
    '.tak-simple-snackbar{display:flex;justify-content:space-between;align-items:center;line-height:20px;opacity:1}.tak-simple-snackbar-action{flex-shrink:0;margin:-8px -8px -8px 8px}.tak-simple-snackbar-action button{max-height:36px;min-width:0}[dir=rtl] .tak-simple-snackbar-action{margin-left:-8px;margin-right:8px}.tak-simple-snack-bar-content{overflow:hidden;text-overflow:ellipsis}',
  ],
  dependencies: [
    {
      kind: 'directive',
      type: i2.NgIf,
      selector: '[ngIf]',
      inputs: ['ngIf', 'ngIfThen', 'ngIfElse'],
    },
    {
      kind: 'component',
      type: i3.TakButton,
      selector:
        'button[tak-button], button[tak-raised-button], button[tak-icon-button],             button[tak-fab], button[tak-mini-fab], button[tak-stroked-button],             button[tak-flat-button]',
      inputs: ['disabled', 'disableRipple', 'color'],
      exportAs: ['takButton'],
    },
  ],
  changeDetection: i0.ChangeDetectionStrategy.OnPush,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: SimpleSnackBar,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'simple-snack-bar',
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          host: {
            class: 'tak-simple-snackbar',
          },
          template:
            '<span class="tak-simple-snack-bar-content">{{data.message}}</span>\n<div class="tak-simple-snackbar-action"  *ngIf="hasAction">\n  <button tak-button (click)="action()">{{data.action}}</button>\n</div>\n',
          styles: [
            '.tak-simple-snackbar{display:flex;justify-content:space-between;align-items:center;line-height:20px;opacity:1}.tak-simple-snackbar-action{flex-shrink:0;margin:-8px -8px -8px 8px}.tak-simple-snackbar-action button{max-height:36px;min-width:0}[dir=rtl] .tak-simple-snackbar-action{margin-left:-8px;margin-right:8px}.tak-simple-snack-bar-content{overflow:hidden;text-overflow:ellipsis}',
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: TakSnackBarRef },
      {
        type: undefined,
        decorators: [
          {
            type: Inject,
            args: [TAK_SNACK_BAR_DATA],
          },
        ],
      },
    ];
  },
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Animations used by the Material snack bar.
 * @docs-private
 */
const takSnackBarAnimations = {
  /** Animation that shows and hides a snack bar. */
  snackBarState: trigger('state', [
    state(
      'void, hidden',
      style({
        transform: 'scale(0.8)',
        opacity: 0,
      })
    ),
    state(
      'visible',
      style({
        transform: 'scale(1)',
        opacity: 1,
      })
    ),
    transition('* => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
    transition(
      '* => void, * => hidden',
      animate(
        '75ms cubic-bezier(0.4, 0.0, 1, 1)',
        style({
          opacity: 0,
        })
      )
    ),
  ]),
};

/**
 * Base class for snack bar containers.
 * @docs-private
 */
class _TakSnackBarContainerBase extends BasePortalOutlet {
  constructor(
    _ngZone,
    _elementRef,
    _changeDetectorRef,
    _platform,
    /** The snack bar configuration. */
    snackBarConfig
  ) {
    super();
    this._ngZone = _ngZone;
    this._elementRef = _elementRef;
    this._changeDetectorRef = _changeDetectorRef;
    this._platform = _platform;
    this.snackBarConfig = snackBarConfig;
    /** The number of milliseconds to wait before announcing the snack bar's content. */
    this._announceDelay = 150;
    /** Whether the component has been destroyed. */
    this._destroyed = false;
    /** Subject for notifying that the snack bar has announced to screen readers. */
    this._onAnnounce = new Subject();
    /** Subject for notifying that the snack bar has exited from view. */
    this._onExit = new Subject();
    /** Subject for notifying that the snack bar has finished entering the view. */
    this._onEnter = new Subject();
    /** The state of the snack bar animations. */
    this._animationState = 'void';
    /**
     * Attaches a DOM portal to the snack bar container.
     * @deprecated To be turned into a method.
     * @breaking-change 10.0.0
     */
    this.attachDomPortal = portal => {
      this._assertNotAttached();
      const result = this._portalOutlet.attachDomPortal(portal);
      this._afterPortalAttached();
      return result;
    };
    // Use aria-live rather than a live role like 'alert' or 'status'
    // because NVDA and JAWS have show inconsistent behavior with live roles.
    if (snackBarConfig.politeness === 'assertive' && !snackBarConfig.announcementMessage) {
      this._live = 'assertive';
    } else if (snackBarConfig.politeness === 'off') {
      this._live = 'off';
    } else {
      this._live = 'polite';
    }
    // Only set role for Firefox. Set role based on aria-live because setting role="alert" implies
    // aria-live="assertive" which may cause issues if aria-live is set to "polite" above.
    if (this._platform.FIREFOX) {
      if (this._live === 'polite') {
        this._role = 'status';
      }
      if (this._live === 'assertive') {
        this._role = 'alert';
      }
    }
  }
  /** Attach a component portal as content to this snack bar container. */
  attachComponentPortal(portal) {
    this._assertNotAttached();
    const result = this._portalOutlet.attachComponentPortal(portal);
    this._afterPortalAttached();
    return result;
  }
  /** Attach a template portal as content to this snack bar container. */
  attachTemplatePortal(portal) {
    this._assertNotAttached();
    const result = this._portalOutlet.attachTemplatePortal(portal);
    this._afterPortalAttached();
    return result;
  }
  /** Handle end of animations, updating the state of the snackbar. */
  onAnimationEnd(event) {
    const { fromState, toState } = event;
    if ((toState === 'void' && fromState !== 'void') || toState === 'hidden') {
      this._completeExit();
    }
    if (toState === 'visible') {
      // Note: we shouldn't use `this` inside the zone callback,
      // because it can cause a memory leak.
      const onEnter = this._onEnter;
      this._ngZone.run(() => {
        onEnter.next();
        onEnter.complete();
      });
    }
  }
  /** Begin animation of snack bar entrance into view. */
  enter() {
    if (!this._destroyed) {
      this._animationState = 'visible';
      this._changeDetectorRef.detectChanges();
      this._screenReaderAnnounce();
    }
  }
  /** Begin animation of the snack bar exiting from view. */
  exit() {
    // It's common for snack bars to be opened by random outside calls like HTTP requests or
    // errors. Run inside the NgZone to ensure that it functions correctly.
    this._ngZone.run(() => {
      // Note: this one transitions to `hidden`, rather than `void`, in order to handle the case
      // where multiple snack bars are opened in quick succession (e.g. two consecutive calls to
      // `TakSnackBar.open`).
      this._animationState = 'hidden';
      // Mark this element with an 'exit' attribute to indicate that the snackbar has
      // been dismissed and will soon be removed from the DOM. This is used by the snackbar
      // test harness.
      this._elementRef.nativeElement.setAttribute('tak-exit', '');
      // If the snack bar hasn't been announced by the time it exits it wouldn't have been open
      // long enough to visually read it either, so clear the timeout for announcing.
      clearTimeout(this._announceTimeoutId);
    });
    return this._onExit;
  }
  /** Makes sure the exit callbacks have been invoked when the element is destroyed. */
  ngOnDestroy() {
    this._destroyed = true;
    this._completeExit();
  }
  /**
   * Waits for the zone to settle before removing the element. Helps prevent
   * errors where we end up removing an element which is in the middle of an animation.
   */
  _completeExit() {
    this._ngZone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => {
      this._ngZone.run(() => {
        this._onExit.next();
        this._onExit.complete();
      });
    });
  }
  /**
   * Called after the portal contents have been attached. Can be
   * used to modify the DOM once it's guaranteed to be in place.
   */
  _afterPortalAttached() {
    const element = this._elementRef.nativeElement;
    const panelClasses = this.snackBarConfig.panelClass;
    if (panelClasses) {
      if (Array.isArray(panelClasses)) {
        // Note that we can't use a spread here, because IE doesn't support multiple arguments.
        panelClasses.forEach(cssClass => element.classList.add(cssClass));
      } else {
        element.classList.add(panelClasses);
      }
    }
  }
  /** Asserts that no content is already attached to the container. */
  _assertNotAttached() {
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error('Attempting to attach snack bar content after content is already attached');
    }
  }
  /**
   * Starts a timeout to move the snack bar content to the live region so screen readers will
   * announce it.
   */
  _screenReaderAnnounce() {
    if (!this._announceTimeoutId) {
      this._ngZone.runOutsideAngular(() => {
        this._announceTimeoutId = setTimeout(() => {
          const inertElement = this._elementRef.nativeElement.querySelector('[aria-hidden]');
          const liveElement = this._elementRef.nativeElement.querySelector('[aria-live]');
          if (inertElement && liveElement) {
            // If an element in the snack bar content is focused before being moved
            // track it and restore focus after moving to the live region.
            let focusedElement = null;
            if (
              this._platform.isBrowser &&
              document.activeElement instanceof HTMLElement &&
              inertElement.contains(document.activeElement)
            ) {
              focusedElement = document.activeElement;
            }
            inertElement.removeAttribute('aria-hidden');
            liveElement.appendChild(inertElement);
            focusedElement?.focus();
            this._onAnnounce.next();
            this._onAnnounce.complete();
          }
        }, this._announceDelay);
      });
    }
  }
}
_TakSnackBarContainerBase.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakSnackBarContainerBase,
  deps: [
    { token: i0.NgZone },
    { token: i0.ElementRef },
    { token: i0.ChangeDetectorRef },
    { token: i1.Platform },
    { token: TakSnackBarConfig },
  ],
  target: i0.ɵɵFactoryTarget.Directive,
});
_TakSnackBarContainerBase.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: _TakSnackBarContainerBase,
  viewQueries: [
    {
      propertyName: '_portalOutlet',
      first: true,
      predicate: CdkPortalOutlet,
      descendants: true,
      static: true,
    },
  ],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakSnackBarContainerBase,
  decorators: [
    {
      type: Directive,
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.NgZone },
      { type: i0.ElementRef },
      { type: i0.ChangeDetectorRef },
      { type: i1.Platform },
      { type: TakSnackBarConfig },
    ];
  },
  propDecorators: {
    _portalOutlet: [
      {
        type: ViewChild,
        args: [CdkPortalOutlet, { static: true }],
      },
    ],
  },
});
/**
 * Internal component that wraps user-provided snack bar content.
 * @docs-private
 */
class TakSnackBarContainer extends _TakSnackBarContainerBase {
  _afterPortalAttached() {
    super._afterPortalAttached();
    if (this.snackBarConfig.horizontalPosition === 'center') {
      this._elementRef.nativeElement.classList.add('tak-snack-bar-center');
    }
    if (this.snackBarConfig.verticalPosition === 'top') {
      this._elementRef.nativeElement.classList.add('tak-snack-bar-top');
    }
  }
}
TakSnackBarContainer.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakSnackBarContainer,
  deps: null,
  target: i0.ɵɵFactoryTarget.Component,
});
TakSnackBarContainer.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakSnackBarContainer,
  selector: 'snack-bar-container',
  host: {
    listeners: { '@state.done': 'onAnimationEnd($event)' },
    properties: { '@state': '_animationState' },
    classAttribute: 'tak-snack-bar-container',
  },
  usesInheritance: true,
  ngImport: i0,
  template:
    '<!-- Initially holds the snack bar content, will be empty after announcing to screen readers. -->\n<div aria-hidden="true">\n  <ng-template cdkPortalOutlet></ng-template>\n</div>\n\n<!-- Will receive the snack bar content from the non-live div, move will happen a short delay after opening -->\n<div [attr.aria-live]="_live" [attr.role]="_role"></div>\n',
  styles: [
    '.tak-snack-bar-container{border-radius:4px;box-sizing:border-box;display:block;margin:24px;max-width:33vw;min-width:344px;padding:14px 16px;min-height:48px;transform-origin:center}.cdk-high-contrast-active .tak-snack-bar-container{border:solid 1px}.tak-snack-bar-handset{width:100%}.tak-snack-bar-handset .tak-snack-bar-container{margin:8px;max-width:100%;min-width:0;width:100%}',
  ],
  dependencies: [
    {
      kind: 'directive',
      type: i3$1.CdkPortalOutlet,
      selector: '[cdkPortalOutlet]',
      inputs: ['cdkPortalOutlet'],
      outputs: ['attached'],
      exportAs: ['cdkPortalOutlet'],
    },
  ],
  animations: [takSnackBarAnimations.snackBarState],
  changeDetection: i0.ChangeDetectionStrategy.Default,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakSnackBarContainer,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'snack-bar-container',
          changeDetection: ChangeDetectionStrategy.Default,
          encapsulation: ViewEncapsulation.None,
          animations: [takSnackBarAnimations.snackBarState],
          host: {
            class: 'tak-snack-bar-container',
            '[@state]': '_animationState',
            '(@state.done)': 'onAnimationEnd($event)',
          },
          template:
            '<!-- Initially holds the snack bar content, will be empty after announcing to screen readers. -->\n<div aria-hidden="true">\n  <ng-template cdkPortalOutlet></ng-template>\n</div>\n\n<!-- Will receive the snack bar content from the non-live div, move will happen a short delay after opening -->\n<div [attr.aria-live]="_live" [attr.role]="_role"></div>\n',
          styles: [
            '.tak-snack-bar-container{border-radius:4px;box-sizing:border-box;display:block;margin:24px;max-width:33vw;min-width:344px;padding:14px 16px;min-height:48px;transform-origin:center}.cdk-high-contrast-active .tak-snack-bar-container{border:solid 1px}.tak-snack-bar-handset{width:100%}.tak-snack-bar-handset .tak-snack-bar-container{margin:8px;max-width:100%;min-width:0;width:100%}',
          ],
        },
      ],
    },
  ],
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class TakSnackBarModule {}
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

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Injection token that can be used to specify default snack bar. */
const TAK_SNACK_BAR_DEFAULT_OPTIONS = new InjectionToken('tak-snack-bar-default-options', {
  providedIn: 'root',
  factory: TAK_SNACK_BAR_DEFAULT_OPTIONS_FACTORY,
});
/** @docs-private */
function TAK_SNACK_BAR_DEFAULT_OPTIONS_FACTORY() {
  return new TakSnackBarConfig();
}
class _TakSnackBarBase {
  constructor(_overlay, _live, _injector, _breakpointObserver, _parentSnackBar, _defaultConfig) {
    this._overlay = _overlay;
    this._live = _live;
    this._injector = _injector;
    this._breakpointObserver = _breakpointObserver;
    this._parentSnackBar = _parentSnackBar;
    this._defaultConfig = _defaultConfig;
    /**
     * Reference to the current snack bar in the view *at this level* (in the Angular injector tree).
     * If there is a parent snack-bar service, all operations should delegate to that parent
     * via `_openedSnackBarRef`.
     */
    this._snackBarRefAtThisLevel = null;
  }
  /** Reference to the currently opened snackbar at *any* level. */
  get _openedSnackBarRef() {
    const parent = this._parentSnackBar;
    return parent ? parent._openedSnackBarRef : this._snackBarRefAtThisLevel;
  }
  set _openedSnackBarRef(value) {
    if (this._parentSnackBar) {
      this._parentSnackBar._openedSnackBarRef = value;
    } else {
      this._snackBarRefAtThisLevel = value;
    }
  }
  /**
   * Creates and dispatches a snack bar with a custom component for the content, removing any
   * currently opened snack bars.
   *
   * @param component Component to be instantiated.
   * @param config Extra configuration for the snack bar.
   */
  openFromComponent(component, config) {
    return this._attach(component, config);
  }
  /**
   * Creates and dispatches a snack bar with a custom template for the content, removing any
   * currently opened snack bars.
   *
   * @param template Template to be instantiated.
   * @param config Extra configuration for the snack bar.
   */
  openFromTemplate(template, config) {
    return this._attach(template, config);
  }
  /**
   * Opens a snackbar with a message and an optional action.
   * @param message The message to show in the snackbar.
   * @param action The label for the snackbar action.
   * @param config Additional configuration options for the snackbar.
   */
  open(message, action = '', config) {
    const _config = { ...this._defaultConfig, ...config };
    // Since the user doesn't have access to the component, we can
    // override the data to pass in our own message and action.
    _config.data = { message, action };
    // Since the snack bar has `role="alert"`, we don't
    // want to announce the same message twice.
    if (_config.announcementMessage === message) {
      _config.announcementMessage = undefined;
    }
    return this.openFromComponent(this.simpleSnackBarComponent, _config);
  }
  /**
   * Dismisses the currently-visible snack bar.
   */
  dismiss() {
    if (this._openedSnackBarRef) {
      this._openedSnackBarRef.dismiss();
    }
  }
  ngOnDestroy() {
    // Only dismiss the snack bar at the current level on destroy.
    if (this._snackBarRefAtThisLevel) {
      this._snackBarRefAtThisLevel.dismiss();
    }
  }
  /**
   * Attaches the snack bar container component to the overlay.
   */
  _attachSnackBarContainer(overlayRef, config) {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    const injector = Injector.create({
      parent: userInjector || this._injector,
      providers: [{ provide: TakSnackBarConfig, useValue: config }],
    });
    const containerPortal = new ComponentPortal(
      this.snackBarContainerComponent,
      config.viewContainerRef,
      injector
    );
    const containerRef = overlayRef.attach(containerPortal);
    containerRef.instance.snackBarConfig = config;
    return containerRef.instance;
  }
  /**
   * Places a new component or a template as the content of the snack bar container.
   */
  _attach(content, userConfig) {
    const config = { ...new TakSnackBarConfig(), ...this._defaultConfig, ...userConfig };
    const overlayRef = this._createOverlay(config);
    const container = this._attachSnackBarContainer(overlayRef, config);
    const snackBarRef = new TakSnackBarRef(container, overlayRef);
    if (content instanceof TemplateRef) {
      const portal = new TemplatePortal(content, null, {
        $implicit: config.data,
        snackBarRef,
      });
      snackBarRef.instance = container.attachTemplatePortal(portal);
    } else {
      const injector = this._createInjector(config, snackBarRef);
      const portal = new ComponentPortal(content, undefined, injector);
      const contentRef = container.attachComponentPortal(portal);
      // We can't pass this via the injector, because the injector is created earlier.
      snackBarRef.instance = contentRef.instance;
    }
    // Subscribe to the breakpoint observer and attach the tak-snack-bar-handset class as
    // appropriate. This class is applied to the overlay element because the overlay must expand to
    // fill the width of the screen for full width snackbars.
    this._breakpointObserver
      .observe(Breakpoints.HandsetPortrait)
      .pipe(takeUntil(overlayRef.detachments()))
      .subscribe(state => {
        overlayRef.overlayElement.classList.toggle(this.handsetCssClass, state.matches);
      });
    if (config.announcementMessage) {
      // Wait until the snack bar contents have been announced then deliver this message.
      container._onAnnounce.subscribe(() => {
        this._live.announce(config.announcementMessage, config.politeness);
      });
    }
    this._animateSnackBar(snackBarRef, config);
    this._openedSnackBarRef = snackBarRef;
    return this._openedSnackBarRef;
  }
  /** Animates the old snack bar out and the new one in. */
  _animateSnackBar(snackBarRef, config) {
    // When the snackbar is dismissed, clear the reference to it.
    snackBarRef.afterDismissed().subscribe(() => {
      // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
      if (this._openedSnackBarRef == snackBarRef) {
        this._openedSnackBarRef = null;
      }
      if (config.announcementMessage) {
        this._live.clear();
      }
    });
    if (this._openedSnackBarRef) {
      // If a snack bar is already in view, dismiss it and enter the
      // new snack bar after exit animation is complete.
      this._openedSnackBarRef.afterDismissed().subscribe(() => {
        snackBarRef.containerInstance.enter();
      });
      this._openedSnackBarRef.dismiss();
    } else {
      // If no snack bar is in view, enter the new snack bar.
      snackBarRef.containerInstance.enter();
    }
    // If a dismiss timeout is provided, set up dismiss based on after the snackbar is opened.
    if (config.duration && config.duration > 0) {
      snackBarRef.afterOpened().subscribe(() => snackBarRef._dismissAfter(config.duration));
    }
  }
  /**
   * Creates a new overlay and places it in the correct location.
   * @param config The user-specified snack bar config.
   */
  _createOverlay(config) {
    const overlayConfig = new OverlayConfig();
    overlayConfig.direction = config.direction;
    let positionStrategy = this._overlay.position().global();
    // Set horizontal position.
    const isRtl = config.direction === 'rtl';
    const isLeft =
      config.horizontalPosition === 'left' ||
      (config.horizontalPosition === 'start' && !isRtl) ||
      (config.horizontalPosition === 'end' && isRtl);
    const isRight = !isLeft && config.horizontalPosition !== 'center';
    if (isLeft) {
      positionStrategy.left('0');
    } else if (isRight) {
      positionStrategy.right('0');
    } else {
      positionStrategy.centerHorizontally();
    }
    // Set horizontal position.
    if (config.verticalPosition === 'top') {
      positionStrategy.top('0');
    } else {
      positionStrategy.bottom('0');
    }
    overlayConfig.positionStrategy = positionStrategy;
    return this._overlay.create(overlayConfig);
  }
  /**
   * Creates an injector to be used inside of a snack bar component.
   * @param config Config that was used to create the snack bar.
   * @param snackBarRef Reference to the snack bar.
   */
  _createInjector(config, snackBarRef) {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    return Injector.create({
      parent: userInjector || this._injector,
      providers: [
        { provide: TakSnackBarRef, useValue: snackBarRef },
        { provide: TAK_SNACK_BAR_DATA, useValue: config.data },
      ],
    });
  }
}
_TakSnackBarBase.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakSnackBarBase,
  deps: [
    { token: i1$1.Overlay },
    { token: i2$1.LiveAnnouncer },
    { token: i0.Injector },
    { token: i3$2.BreakpointObserver },
    { token: _TakSnackBarBase, optional: true, skipSelf: true },
    { token: TAK_SNACK_BAR_DEFAULT_OPTIONS },
  ],
  target: i0.ɵɵFactoryTarget.Injectable,
});
_TakSnackBarBase.ɵprov = i0.ɵɵngDeclareInjectable({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakSnackBarBase,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakSnackBarBase,
  decorators: [
    {
      type: Injectable,
    },
  ],
  ctorParameters: function () {
    return [
      { type: i1$1.Overlay },
      { type: i2$1.LiveAnnouncer },
      { type: i0.Injector },
      { type: i3$2.BreakpointObserver },
      {
        type: _TakSnackBarBase,
        decorators: [
          {
            type: Optional,
          },
          {
            type: SkipSelf,
          },
        ],
      },
      {
        type: TakSnackBarConfig,
        decorators: [
          {
            type: Inject,
            args: [TAK_SNACK_BAR_DEFAULT_OPTIONS],
          },
        ],
      },
    ];
  },
});
/**
 * Service to dispatch Material Design snack bar messages.
 */
class TakSnackBar extends _TakSnackBarBase {
  constructor(overlay, live, injector, breakpointObserver, parentSnackBar, defaultConfig) {
    super(overlay, live, injector, breakpointObserver, parentSnackBar, defaultConfig);
    this.simpleSnackBarComponent = SimpleSnackBar;
    this.snackBarContainerComponent = TakSnackBarContainer;
    this.handsetCssClass = 'tak-snack-bar-handset';
  }
}
TakSnackBar.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakSnackBar,
  deps: [
    { token: i1$1.Overlay },
    { token: i2$1.LiveAnnouncer },
    { token: i0.Injector },
    { token: i3$2.BreakpointObserver },
    { token: TakSnackBar, optional: true, skipSelf: true },
    { token: TAK_SNACK_BAR_DEFAULT_OPTIONS },
  ],
  target: i0.ɵɵFactoryTarget.Injectable,
});
TakSnackBar.ɵprov = i0.ɵɵngDeclareInjectable({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakSnackBar,
  providedIn: TakSnackBarModule,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakSnackBar,
  decorators: [
    {
      type: Injectable,
      args: [{ providedIn: TakSnackBarModule }],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i1$1.Overlay },
      { type: i2$1.LiveAnnouncer },
      { type: i0.Injector },
      { type: i3$2.BreakpointObserver },
      {
        type: TakSnackBar,
        decorators: [
          {
            type: Optional,
          },
          {
            type: SkipSelf,
          },
        ],
      },
      {
        type: TakSnackBarConfig,
        decorators: [
          {
            type: Inject,
            args: [TAK_SNACK_BAR_DEFAULT_OPTIONS],
          },
        ],
      },
    ];
  },
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */

export {
  TAK_SNACK_BAR_DATA,
  TAK_SNACK_BAR_DEFAULT_OPTIONS,
  TAK_SNACK_BAR_DEFAULT_OPTIONS_FACTORY,
  TakSnackBar,
  TakSnackBarConfig,
  TakSnackBarContainer,
  TakSnackBarModule,
  TakSnackBarRef,
  SimpleSnackBar,
  _TakSnackBarBase,
  _TakSnackBarContainerBase,
  takSnackBarAnimations,
};
//# sourceMappingURL=snack-bar.mjs.map
