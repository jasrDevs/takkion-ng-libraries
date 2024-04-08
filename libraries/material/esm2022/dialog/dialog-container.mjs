/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor, FocusTrapFactory, InteractivityChecker } from '@takkion/cdk/a11y';
import { OverlayRef } from '@takkion/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  NgZone,
  Optional,
  ViewEncapsulation,
  ANIMATION_MODULE_TYPE,
} from '@angular/core';
import { MatDialogConfig } from './dialog-config';
import { CdkDialogContainer } from '@takkion/cdk/dialog';
import { coerceNumberProperty } from '@takkion/cdk/coercion';
import { CdkPortalOutlet } from '@takkion/cdk/portal';
import * as i0 from '@angular/core';
import * as i1 from '@takkion/cdk/a11y';
import * as i2 from './dialog-config';
import * as i3 from '@takkion/cdk/overlay';
/** Class added when the dialog is open. */
const OPEN_CLASS = 'mdc-dialog--open';
/** Class added while the dialog is opening. */
const OPENING_CLASS = 'mdc-dialog--opening';
/** Class added while the dialog is closing. */
const CLOSING_CLASS = 'mdc-dialog--closing';
/** Duration of the opening animation in milliseconds. */
export const OPEN_ANIMATION_DURATION = 150;
/** Duration of the closing animation in milliseconds. */
export const CLOSE_ANIMATION_DURATION = 75;
export class MatDialogContainer extends CdkDialogContainer {
  constructor(
    elementRef,
    focusTrapFactory,
    _document,
    dialogConfig,
    interactivityChecker,
    ngZone,
    overlayRef,
    _animationMode,
    focusMonitor
  ) {
    super(
      elementRef,
      focusTrapFactory,
      _document,
      dialogConfig,
      interactivityChecker,
      ngZone,
      overlayRef,
      focusMonitor
    );
    this._animationMode = _animationMode;
    /** Emits when an animation state changes. */
    this._animationStateChanged = new EventEmitter();
    /** Whether animations are enabled. */
    this._animationsEnabled = this._animationMode !== 'NoopAnimations';
    /** Number of actions projected in the dialog. */
    this._actionSectionCount = 0;
    /** Host element of the dialog container component. */
    this._hostElement = this._elementRef.nativeElement;
    /** Duration of the dialog open animation. */
    this._enterAnimationDuration = this._animationsEnabled
      ? parseCssTime(this._config.enterAnimationDuration) ?? OPEN_ANIMATION_DURATION
      : 0;
    /** Duration of the dialog close animation. */
    this._exitAnimationDuration = this._animationsEnabled
      ? parseCssTime(this._config.exitAnimationDuration) ?? CLOSE_ANIMATION_DURATION
      : 0;
    /** Current timer for dialog animations. */
    this._animationTimer = null;
    /**
     * Completes the dialog open by clearing potential animation classes, trapping
     * focus and emitting an opened event.
     */
    this._finishDialogOpen = () => {
      this._clearAnimationClasses();
      this._openAnimationDone(this._enterAnimationDuration);
    };
    /**
     * Completes the dialog close by clearing potential animation classes, restoring
     * focus and emitting a closed event.
     */
    this._finishDialogClose = () => {
      this._clearAnimationClasses();
      this._animationStateChanged.emit({ state: 'closed', totalTime: this._exitAnimationDuration });
    };
  }
  _contentAttached() {
    // Delegate to the original dialog-container initialization (i.e. saving the
    // previous element, setting up the focus trap and moving focus to the container).
    super._contentAttached();
    // Note: Usually we would be able to use the MDC dialog foundation here to handle
    // the dialog animation for us, but there are a few reasons why we just leverage
    // their styles and not use the runtime foundation code:
    //   1. Foundation does not allow us to disable animations.
    //   2. Foundation contains unnecessary features we don't need and aren't
    //      tree-shakeable. e.g. background scrim, keyboard event handlers for ESC button.
    //   3. Foundation uses unnecessary timers for animations to work around limitations
    //      in React's `setState` mechanism.
    //      https://github.com/material-components/material-components-web/pull/3682.
    this._startOpenAnimation();
  }
  /** Starts the dialog open animation if enabled. */
  _startOpenAnimation() {
    this._animationStateChanged.emit({ state: 'opening', totalTime: this._enterAnimationDuration });
    if (this._animationsEnabled) {
      this._hostElement.style.setProperty(
        TRANSITION_DURATION_PROPERTY,
        `${this._enterAnimationDuration}ms`
      );
      // We need to give the `setProperty` call from above some time to be applied.
      // One would expect that the open class is added once the animation finished, but MDC
      // uses the open class in combination with the opening class to start the animation.
      this._requestAnimationFrame(() => this._hostElement.classList.add(OPENING_CLASS, OPEN_CLASS));
      this._waitForAnimationToComplete(this._enterAnimationDuration, this._finishDialogOpen);
    } else {
      this._hostElement.classList.add(OPEN_CLASS);
      // Note: We could immediately finish the dialog opening here with noop animations,
      // but we defer until next tick so that consumers can subscribe to `afterOpened`.
      // Executing this immediately would mean that `afterOpened` emits synchronously
      // on `dialog.open` before the consumer had a change to subscribe to `afterOpened`.
      Promise.resolve().then(() => this._finishDialogOpen());
    }
  }
  /**
   * Starts the exit animation of the dialog if enabled. This method is
   * called by the dialog ref.
   */
  _startExitAnimation() {
    this._animationStateChanged.emit({ state: 'closing', totalTime: this._exitAnimationDuration });
    this._hostElement.classList.remove(OPEN_CLASS);
    if (this._animationsEnabled) {
      this._hostElement.style.setProperty(
        TRANSITION_DURATION_PROPERTY,
        `${this._exitAnimationDuration}ms`
      );
      // We need to give the `setProperty` call from above some time to be applied.
      this._requestAnimationFrame(() => this._hostElement.classList.add(CLOSING_CLASS));
      this._waitForAnimationToComplete(this._exitAnimationDuration, this._finishDialogClose);
    } else {
      // This subscription to the `OverlayRef#backdropClick` observable in the `DialogRef` is
      // set up before any user can subscribe to the backdrop click. The subscription triggers
      // the dialog close and this method synchronously. If we'd synchronously emit the `CLOSED`
      // animation state event if animations are disabled, the overlay would be disposed
      // immediately and all other subscriptions to `DialogRef#backdropClick` would be silently
      // skipped. We work around this by waiting with the dialog close until the next tick when
      // all subscriptions have been fired as expected. This is not an ideal solution, but
      // there doesn't seem to be any other good way. Alternatives that have been considered:
      //   1. Deferring `DialogRef.close`. This could be a breaking change due to a new microtask.
      //      Also this issue is specific to the MDC implementation where the dialog could
      //      technically be closed synchronously. In the non-MDC one, Angular animations are used
      //      and closing always takes at least a tick.
      //   2. Ensuring that user subscriptions to `backdropClick`, `keydownEvents` in the dialog
      //      ref are first. This would solve the issue, but has the risk of memory leaks and also
      //      doesn't solve the case where consumers call `DialogRef.close` in their subscriptions.
      // Based on the fact that this is specific to the MDC-based implementation of the dialog
      // animations, the defer is applied here.
      Promise.resolve().then(() => this._finishDialogClose());
    }
  }
  /**
   * Updates the number action sections.
   * @param delta Increase/decrease in the number of sections.
   */
  _updateActionSectionCount(delta) {
    this._actionSectionCount += delta;
    this._changeDetectorRef.markForCheck();
  }
  /** Clears all dialog animation classes. */
  _clearAnimationClasses() {
    this._hostElement.classList.remove(OPENING_CLASS, CLOSING_CLASS);
  }
  _waitForAnimationToComplete(duration, callback) {
    if (this._animationTimer !== null) {
      clearTimeout(this._animationTimer);
    }
    // Note that we want this timer to run inside the NgZone, because we want
    // the related events like `afterClosed` to be inside the zone as well.
    this._animationTimer = setTimeout(callback, duration);
  }
  /** Runs a callback in `requestAnimationFrame`, if available. */
  _requestAnimationFrame(callback) {
    this._ngZone.runOutsideAngular(() => {
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(callback);
      } else {
        callback();
      }
    });
  }
  _captureInitialFocus() {
    if (!this._config.delayFocusTrap) {
      this._trapFocus();
    }
  }
  /**
   * Callback for when the open dialog animation has finished. Intended to
   * be called by sub-classes that use different animation implementations.
   */
  _openAnimationDone(totalTime) {
    if (this._config.delayFocusTrap) {
      this._trapFocus();
    }
    this._animationStateChanged.next({ state: 'opened', totalTime });
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    if (this._animationTimer !== null) {
      clearTimeout(this._animationTimer);
    }
  }
  attachComponentPortal(portal) {
    // When a component is passed into the dialog, the host element interrupts
    // the `display:flex` from affecting the dialog title, content, and
    // actions. To fix this, we make the component host `display: contents` by
    // marking its host with the `mat-mdc-dialog-component-host` class.
    //
    // Note that this problem does not exist when a template ref is used since
    // the title, contents, and actions are then nested directly under the
    // dialog surface.
    const ref = super.attachComponentPortal(portal);
    ref.location.nativeElement.classList.add('mat-mdc-dialog-component-host');
    return ref;
  }
  static {
    this.ɵfac = i0.ɵɵngDeclareFactory({
      minVersion: '12.0.0',
      version: '17.2.0',
      ngImport: i0,
      type: MatDialogContainer,
      deps: [
        { token: i0.ElementRef },
        { token: i1.FocusTrapFactory },
        { token: DOCUMENT, optional: true },
        { token: i2.MatDialogConfig },
        { token: i1.InteractivityChecker },
        { token: i0.NgZone },
        { token: i3.OverlayRef },
        { token: ANIMATION_MODULE_TYPE, optional: true },
        { token: i1.FocusMonitor },
      ],
      target: i0.ɵɵFactoryTarget.Component,
    });
  }
  static {
    this.ɵcmp = i0.ɵɵngDeclareComponent({
      minVersion: '14.0.0',
      version: '17.2.0',
      type: MatDialogContainer,
      isStandalone: true,
      selector: 'mat-dialog-container',
      host: {
        attributes: { tabindex: '-1' },
        properties: {
          'attr.aria-modal': '_config.ariaModal',
          id: '_config.id',
          'attr.role': '_config.role',
          'attr.aria-labelledby': '_config.ariaLabel ? null : _ariaLabelledByQueue[0]',
          'attr.aria-label': '_config.ariaLabel',
          'attr.aria-describedby': '_config.ariaDescribedBy || null',
          'class._mat-animation-noopable': '!_animationsEnabled',
          'class.mat-mdc-dialog-container-with-actions': '_actionSectionCount > 0',
        },
        classAttribute: 'mat-mdc-dialog-container mdc-dialog',
      },
      usesInheritance: true,
      ngImport: i0,
      template:
        '<div class="mdc-dialog__container">\n  <div class="mat-mdc-dialog-surface mdc-dialog__surface">\n    <ng-template cdkPortalOutlet />\n  </div>\n</div>\n',
      styles: [
        '.mdc-elevation-overlay{position:absolute;border-radius:inherit;pointer-events:none;opacity:var(--mdc-elevation-overlay-opacity, 0);transition:opacity 280ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-dialog,.mdc-dialog__scrim{position:fixed;top:0;left:0;align-items:center;justify-content:center;box-sizing:border-box;width:100%;height:100%}.mdc-dialog{display:none;z-index:var(--mdc-dialog-z-index, 7)}.mdc-dialog .mdc-dialog__content{padding:20px 24px 20px 24px}.mdc-dialog .mdc-dialog__surface{min-width:280px}@media(max-width: 592px){.mdc-dialog .mdc-dialog__surface{max-width:calc(100vw - 32px)}}@media(min-width: 592px){.mdc-dialog .mdc-dialog__surface{max-width:560px}}.mdc-dialog .mdc-dialog__surface{max-height:calc(100% - 32px)}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-width:none}@media(max-width: 960px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-height:560px;width:560px}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{right:-12px}}@media(max-width: 720px)and (max-width: 672px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{width:calc(100vw - 112px)}}@media(max-width: 720px)and (min-width: 672px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{width:560px}}@media(max-width: 720px)and (max-height: 720px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-height:calc(100vh - 160px)}}@media(max-width: 720px)and (min-height: 720px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-height:560px}}@media(max-width: 720px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{right:-12px}}@media(max-width: 720px)and (max-height: 400px),(max-width: 600px),(min-width: 720px)and (max-height: 400px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{height:100%;max-height:100vh;max-width:100vw;width:100vw;border-radius:0}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{order:-1;left:-12px}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__header{padding:0 16px 9px;justify-content:flex-start}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__title{margin-left:calc(16px - 2 * 12px)}}@media(min-width: 960px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{width:calc(100vw - 400px)}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{right:-12px}}.mdc-dialog.mdc-dialog__scrim--hidden .mdc-dialog__scrim{opacity:0}.mdc-dialog__scrim{opacity:0;z-index:-1}.mdc-dialog__container{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;opacity:0;pointer-events:none}.mdc-dialog__surface{position:relative;display:flex;flex-direction:column;flex-grow:0;flex-shrink:0;box-sizing:border-box;max-width:100%;max-height:100%;pointer-events:auto;overflow-y:auto;outline:0;transform:scale(0.8)}.mdc-dialog__surface .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}[dir=rtl] .mdc-dialog__surface,.mdc-dialog__surface[dir=rtl]{text-align:right}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-dialog__surface{outline:2px solid windowText}}.mdc-dialog__surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:2px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none}@media screen and (forced-colors: active){.mdc-dialog__surface::before{border-color:CanvasText}}@media screen and (-ms-high-contrast: active),screen and (-ms-high-contrast: none){.mdc-dialog__surface::before{content:none}}.mdc-dialog__title{display:block;margin-top:0;position:relative;flex-shrink:0;box-sizing:border-box;margin:0 0 1px;padding:0 24px 9px}.mdc-dialog__title::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}[dir=rtl] .mdc-dialog__title,.mdc-dialog__title[dir=rtl]{text-align:right}.mdc-dialog--scrollable .mdc-dialog__title{margin-bottom:1px;padding-bottom:15px}.mdc-dialog--fullscreen .mdc-dialog__header{align-items:baseline;border-bottom:1px solid rgba(0,0,0,0);display:inline-flex;justify-content:space-between;padding:0 24px 9px;z-index:1}@media screen and (forced-colors: active){.mdc-dialog--fullscreen .mdc-dialog__header{border-bottom-color:CanvasText}}.mdc-dialog--fullscreen .mdc-dialog__header .mdc-dialog__close{right:-12px}.mdc-dialog--fullscreen .mdc-dialog__title{margin-bottom:0;padding:0;border-bottom:0}.mdc-dialog--fullscreen.mdc-dialog--scrollable .mdc-dialog__title{border-bottom:0;margin-bottom:0}.mdc-dialog--fullscreen .mdc-dialog__close{top:5px}.mdc-dialog--fullscreen.mdc-dialog--scrollable .mdc-dialog__actions{border-top:1px solid rgba(0,0,0,0)}@media screen and (forced-colors: active){.mdc-dialog--fullscreen.mdc-dialog--scrollable .mdc-dialog__actions{border-top-color:CanvasText}}.mdc-dialog--fullscreen--titleless .mdc-dialog__close{margin-top:4px}.mdc-dialog--fullscreen--titleless.mdc-dialog--scrollable .mdc-dialog__close{margin-top:0}.mdc-dialog__content{flex-grow:1;box-sizing:border-box;margin:0;overflow:auto}.mdc-dialog__content>:first-child{margin-top:0}.mdc-dialog__content>:last-child{margin-bottom:0}.mdc-dialog__title+.mdc-dialog__content,.mdc-dialog__header+.mdc-dialog__content{padding-top:0}.mdc-dialog--scrollable .mdc-dialog__title+.mdc-dialog__content{padding-top:8px;padding-bottom:8px}.mdc-dialog__content .mdc-deprecated-list:first-child:last-child{padding:6px 0 0}.mdc-dialog--scrollable .mdc-dialog__content .mdc-deprecated-list:first-child:last-child{padding:0}.mdc-dialog__actions{display:flex;position:relative;flex-shrink:0;flex-wrap:wrap;align-items:center;justify-content:flex-end;box-sizing:border-box;min-height:52px;margin:0;padding:8px;border-top:1px solid rgba(0,0,0,0)}@media screen and (forced-colors: active){.mdc-dialog__actions{border-top-color:CanvasText}}.mdc-dialog--stacked .mdc-dialog__actions{flex-direction:column;align-items:flex-end}.mdc-dialog__button{margin-left:8px;margin-right:0;max-width:100%;text-align:right}[dir=rtl] .mdc-dialog__button,.mdc-dialog__button[dir=rtl]{margin-left:0;margin-right:8px}.mdc-dialog__button:first-child{margin-left:0;margin-right:0}[dir=rtl] .mdc-dialog__button:first-child,.mdc-dialog__button:first-child[dir=rtl]{margin-left:0;margin-right:0}[dir=rtl] .mdc-dialog__button,.mdc-dialog__button[dir=rtl]{text-align:left}.mdc-dialog--stacked .mdc-dialog__button:not(:first-child){margin-top:12px}.mdc-dialog--open,.mdc-dialog--opening,.mdc-dialog--closing{display:flex}.mdc-dialog--opening .mdc-dialog__scrim{transition:opacity 150ms linear}.mdc-dialog--opening .mdc-dialog__container{transition:opacity 75ms linear,transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-dialog--closing .mdc-dialog__scrim,.mdc-dialog--closing .mdc-dialog__container{transition:opacity 75ms linear}.mdc-dialog--closing .mdc-dialog__container{transform:none}.mdc-dialog--closing .mdc-dialog__surface{transform:none}.mdc-dialog--open .mdc-dialog__scrim{opacity:1}.mdc-dialog--open .mdc-dialog__container{opacity:1}.mdc-dialog--open .mdc-dialog__surface{transform:none}.mdc-dialog--open.mdc-dialog__surface-scrim--shown .mdc-dialog__surface-scrim{opacity:1}.mdc-dialog--open.mdc-dialog__surface-scrim--hiding .mdc-dialog__surface-scrim{transition:opacity 75ms linear}.mdc-dialog--open.mdc-dialog__surface-scrim--showing .mdc-dialog__surface-scrim{transition:opacity 150ms linear}.mdc-dialog__surface-scrim{display:none;opacity:0;position:absolute;width:100%;height:100%;z-index:1}.mdc-dialog__surface-scrim--shown .mdc-dialog__surface-scrim,.mdc-dialog__surface-scrim--showing .mdc-dialog__surface-scrim,.mdc-dialog__surface-scrim--hiding .mdc-dialog__surface-scrim{display:block}.mdc-dialog-scroll-lock{overflow:hidden}.mdc-dialog--no-content-padding .mdc-dialog__content{padding:0}.mdc-dialog--sheet .mdc-dialog__container .mdc-dialog__close{right:12px;top:9px;position:absolute;z-index:1}.mdc-dialog__scrim--removed{pointer-events:none}.mdc-dialog__scrim--removed .mdc-dialog__scrim,.mdc-dialog__scrim--removed .mdc-dialog__surface-scrim{display:none}.mat-mdc-dialog-content{max-height:65vh}.mat-mdc-dialog-container{position:static;display:block}.mat-mdc-dialog-container,.mat-mdc-dialog-container .mdc-dialog__container,.mat-mdc-dialog-container .mdc-dialog__surface{max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit}.mat-mdc-dialog-container .mdc-dialog__surface{width:100%;height:100%}.mat-mdc-dialog-component-host{display:contents}.mat-mdc-dialog-container{--mdc-dialog-container-elevation: var(--mdc-dialog-container-elevation-shadow);outline:0}.mat-mdc-dialog-container .mdc-dialog__surface{background-color:var(--mdc-dialog-container-color, white)}.mat-mdc-dialog-container .mdc-dialog__surface{box-shadow:var(--mdc-dialog-container-elevation, 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12))}.mat-mdc-dialog-container .mdc-dialog__surface{border-radius:var(--mdc-dialog-container-shape, 4px)}.mat-mdc-dialog-container .mdc-dialog__title{font-family:var(--mdc-dialog-subhead-font, Roboto, sans-serif);line-height:var(--mdc-dialog-subhead-line-height, 1.5rem);font-size:var(--mdc-dialog-subhead-size, 1rem);font-weight:var(--mdc-dialog-subhead-weight, 400);letter-spacing:var(--mdc-dialog-subhead-tracking, 0.03125em)}.mat-mdc-dialog-container .mdc-dialog__title{color:var(--mdc-dialog-subhead-color, rgba(0, 0, 0, 0.87))}.mat-mdc-dialog-container .mdc-dialog__content{font-family:var(--mdc-dialog-supporting-text-font, Roboto, sans-serif);line-height:var(--mdc-dialog-supporting-text-line-height, 1.5rem);font-size:var(--mdc-dialog-supporting-text-size, 1rem);font-weight:var(--mdc-dialog-supporting-text-weight, 400);letter-spacing:var(--mdc-dialog-supporting-text-tracking, 0.03125em)}.mat-mdc-dialog-container .mdc-dialog__content{color:var(--mdc-dialog-supporting-text-color, rgba(0, 0, 0, 0.6))}.mat-mdc-dialog-container .mdc-dialog__container{transition:opacity linear var(--mat-dialog-transition-duration, 0ms)}.mat-mdc-dialog-container .mdc-dialog__surface{transition:transform var(--mat-dialog-transition-duration, 0ms) 0ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-dialog-container._mat-animation-noopable .mdc-dialog__container,.mat-mdc-dialog-container._mat-animation-noopable .mdc-dialog__surface{transition:none}.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-max-width, 80vw);min-width:var(--mat-dialog-container-min-width, 0)}@media(max-width: 599px){.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-small-max-width, 80vw)}}.mat-mdc-dialog-title{padding:var(--mat-dialog-headline-padding, 0 24px 9px)}.mat-mdc-dialog-content{display:block}.mat-mdc-dialog-container .mat-mdc-dialog-content{padding:var(--mat-dialog-content-padding, 20px 24px)}.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content{padding:var(--mat-dialog-with-actions-content-padding, 20px 24px)}.mat-mdc-dialog-container .mat-mdc-dialog-title+.mat-mdc-dialog-content{padding-top:0}.mat-mdc-dialog-actions{padding:var(--mat-dialog-actions-padding, 8px);justify-content:var(--mat-dialog-actions-alignment, start)}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start,.mat-mdc-dialog-actions[align=start]{justify-content:start}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center,.mat-mdc-dialog-actions[align=center]{justify-content:center}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end,.mat-mdc-dialog-actions[align=end]{justify-content:flex-end}.mat-mdc-dialog-actions .mat-button-base+.mat-button-base,.mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-mdc-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}',
      ],
      dependencies: [
        {
          kind: 'directive',
          type: CdkPortalOutlet,
          selector: '[cdkPortalOutlet]',
          inputs: ['cdkPortalOutlet'],
          outputs: ['attached'],
          exportAs: ['cdkPortalOutlet'],
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
  type: MatDialogContainer,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-dialog-container',
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.Default,
          standalone: true,
          imports: [CdkPortalOutlet],
          host: {
            class: 'mat-mdc-dialog-container mdc-dialog',
            tabindex: '-1',
            '[attr.aria-modal]': '_config.ariaModal',
            '[id]': '_config.id',
            '[attr.role]': '_config.role',
            '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledByQueue[0]',
            '[attr.aria-label]': '_config.ariaLabel',
            '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
            '[class._mat-animation-noopable]': '!_animationsEnabled',
            '[class.mat-mdc-dialog-container-with-actions]': '_actionSectionCount > 0',
          },
          template:
            '<div class="mdc-dialog__container">\n  <div class="mat-mdc-dialog-surface mdc-dialog__surface">\n    <ng-template cdkPortalOutlet />\n  </div>\n</div>\n',
          styles: [
            '.mdc-elevation-overlay{position:absolute;border-radius:inherit;pointer-events:none;opacity:var(--mdc-elevation-overlay-opacity, 0);transition:opacity 280ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-dialog,.mdc-dialog__scrim{position:fixed;top:0;left:0;align-items:center;justify-content:center;box-sizing:border-box;width:100%;height:100%}.mdc-dialog{display:none;z-index:var(--mdc-dialog-z-index, 7)}.mdc-dialog .mdc-dialog__content{padding:20px 24px 20px 24px}.mdc-dialog .mdc-dialog__surface{min-width:280px}@media(max-width: 592px){.mdc-dialog .mdc-dialog__surface{max-width:calc(100vw - 32px)}}@media(min-width: 592px){.mdc-dialog .mdc-dialog__surface{max-width:560px}}.mdc-dialog .mdc-dialog__surface{max-height:calc(100% - 32px)}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-width:none}@media(max-width: 960px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-height:560px;width:560px}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{right:-12px}}@media(max-width: 720px)and (max-width: 672px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{width:calc(100vw - 112px)}}@media(max-width: 720px)and (min-width: 672px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{width:560px}}@media(max-width: 720px)and (max-height: 720px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-height:calc(100vh - 160px)}}@media(max-width: 720px)and (min-height: 720px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-height:560px}}@media(max-width: 720px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{right:-12px}}@media(max-width: 720px)and (max-height: 400px),(max-width: 600px),(min-width: 720px)and (max-height: 400px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{height:100%;max-height:100vh;max-width:100vw;width:100vw;border-radius:0}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{order:-1;left:-12px}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__header{padding:0 16px 9px;justify-content:flex-start}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__title{margin-left:calc(16px - 2 * 12px)}}@media(min-width: 960px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{width:calc(100vw - 400px)}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{right:-12px}}.mdc-dialog.mdc-dialog__scrim--hidden .mdc-dialog__scrim{opacity:0}.mdc-dialog__scrim{opacity:0;z-index:-1}.mdc-dialog__container{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;opacity:0;pointer-events:none}.mdc-dialog__surface{position:relative;display:flex;flex-direction:column;flex-grow:0;flex-shrink:0;box-sizing:border-box;max-width:100%;max-height:100%;pointer-events:auto;overflow-y:auto;outline:0;transform:scale(0.8)}.mdc-dialog__surface .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}[dir=rtl] .mdc-dialog__surface,.mdc-dialog__surface[dir=rtl]{text-align:right}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-dialog__surface{outline:2px solid windowText}}.mdc-dialog__surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:2px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none}@media screen and (forced-colors: active){.mdc-dialog__surface::before{border-color:CanvasText}}@media screen and (-ms-high-contrast: active),screen and (-ms-high-contrast: none){.mdc-dialog__surface::before{content:none}}.mdc-dialog__title{display:block;margin-top:0;position:relative;flex-shrink:0;box-sizing:border-box;margin:0 0 1px;padding:0 24px 9px}.mdc-dialog__title::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}[dir=rtl] .mdc-dialog__title,.mdc-dialog__title[dir=rtl]{text-align:right}.mdc-dialog--scrollable .mdc-dialog__title{margin-bottom:1px;padding-bottom:15px}.mdc-dialog--fullscreen .mdc-dialog__header{align-items:baseline;border-bottom:1px solid rgba(0,0,0,0);display:inline-flex;justify-content:space-between;padding:0 24px 9px;z-index:1}@media screen and (forced-colors: active){.mdc-dialog--fullscreen .mdc-dialog__header{border-bottom-color:CanvasText}}.mdc-dialog--fullscreen .mdc-dialog__header .mdc-dialog__close{right:-12px}.mdc-dialog--fullscreen .mdc-dialog__title{margin-bottom:0;padding:0;border-bottom:0}.mdc-dialog--fullscreen.mdc-dialog--scrollable .mdc-dialog__title{border-bottom:0;margin-bottom:0}.mdc-dialog--fullscreen .mdc-dialog__close{top:5px}.mdc-dialog--fullscreen.mdc-dialog--scrollable .mdc-dialog__actions{border-top:1px solid rgba(0,0,0,0)}@media screen and (forced-colors: active){.mdc-dialog--fullscreen.mdc-dialog--scrollable .mdc-dialog__actions{border-top-color:CanvasText}}.mdc-dialog--fullscreen--titleless .mdc-dialog__close{margin-top:4px}.mdc-dialog--fullscreen--titleless.mdc-dialog--scrollable .mdc-dialog__close{margin-top:0}.mdc-dialog__content{flex-grow:1;box-sizing:border-box;margin:0;overflow:auto}.mdc-dialog__content>:first-child{margin-top:0}.mdc-dialog__content>:last-child{margin-bottom:0}.mdc-dialog__title+.mdc-dialog__content,.mdc-dialog__header+.mdc-dialog__content{padding-top:0}.mdc-dialog--scrollable .mdc-dialog__title+.mdc-dialog__content{padding-top:8px;padding-bottom:8px}.mdc-dialog__content .mdc-deprecated-list:first-child:last-child{padding:6px 0 0}.mdc-dialog--scrollable .mdc-dialog__content .mdc-deprecated-list:first-child:last-child{padding:0}.mdc-dialog__actions{display:flex;position:relative;flex-shrink:0;flex-wrap:wrap;align-items:center;justify-content:flex-end;box-sizing:border-box;min-height:52px;margin:0;padding:8px;border-top:1px solid rgba(0,0,0,0)}@media screen and (forced-colors: active){.mdc-dialog__actions{border-top-color:CanvasText}}.mdc-dialog--stacked .mdc-dialog__actions{flex-direction:column;align-items:flex-end}.mdc-dialog__button{margin-left:8px;margin-right:0;max-width:100%;text-align:right}[dir=rtl] .mdc-dialog__button,.mdc-dialog__button[dir=rtl]{margin-left:0;margin-right:8px}.mdc-dialog__button:first-child{margin-left:0;margin-right:0}[dir=rtl] .mdc-dialog__button:first-child,.mdc-dialog__button:first-child[dir=rtl]{margin-left:0;margin-right:0}[dir=rtl] .mdc-dialog__button,.mdc-dialog__button[dir=rtl]{text-align:left}.mdc-dialog--stacked .mdc-dialog__button:not(:first-child){margin-top:12px}.mdc-dialog--open,.mdc-dialog--opening,.mdc-dialog--closing{display:flex}.mdc-dialog--opening .mdc-dialog__scrim{transition:opacity 150ms linear}.mdc-dialog--opening .mdc-dialog__container{transition:opacity 75ms linear,transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-dialog--closing .mdc-dialog__scrim,.mdc-dialog--closing .mdc-dialog__container{transition:opacity 75ms linear}.mdc-dialog--closing .mdc-dialog__container{transform:none}.mdc-dialog--closing .mdc-dialog__surface{transform:none}.mdc-dialog--open .mdc-dialog__scrim{opacity:1}.mdc-dialog--open .mdc-dialog__container{opacity:1}.mdc-dialog--open .mdc-dialog__surface{transform:none}.mdc-dialog--open.mdc-dialog__surface-scrim--shown .mdc-dialog__surface-scrim{opacity:1}.mdc-dialog--open.mdc-dialog__surface-scrim--hiding .mdc-dialog__surface-scrim{transition:opacity 75ms linear}.mdc-dialog--open.mdc-dialog__surface-scrim--showing .mdc-dialog__surface-scrim{transition:opacity 150ms linear}.mdc-dialog__surface-scrim{display:none;opacity:0;position:absolute;width:100%;height:100%;z-index:1}.mdc-dialog__surface-scrim--shown .mdc-dialog__surface-scrim,.mdc-dialog__surface-scrim--showing .mdc-dialog__surface-scrim,.mdc-dialog__surface-scrim--hiding .mdc-dialog__surface-scrim{display:block}.mdc-dialog-scroll-lock{overflow:hidden}.mdc-dialog--no-content-padding .mdc-dialog__content{padding:0}.mdc-dialog--sheet .mdc-dialog__container .mdc-dialog__close{right:12px;top:9px;position:absolute;z-index:1}.mdc-dialog__scrim--removed{pointer-events:none}.mdc-dialog__scrim--removed .mdc-dialog__scrim,.mdc-dialog__scrim--removed .mdc-dialog__surface-scrim{display:none}.mat-mdc-dialog-content{max-height:65vh}.mat-mdc-dialog-container{position:static;display:block}.mat-mdc-dialog-container,.mat-mdc-dialog-container .mdc-dialog__container,.mat-mdc-dialog-container .mdc-dialog__surface{max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit}.mat-mdc-dialog-container .mdc-dialog__surface{width:100%;height:100%}.mat-mdc-dialog-component-host{display:contents}.mat-mdc-dialog-container{--mdc-dialog-container-elevation: var(--mdc-dialog-container-elevation-shadow);outline:0}.mat-mdc-dialog-container .mdc-dialog__surface{background-color:var(--mdc-dialog-container-color, white)}.mat-mdc-dialog-container .mdc-dialog__surface{box-shadow:var(--mdc-dialog-container-elevation, 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12))}.mat-mdc-dialog-container .mdc-dialog__surface{border-radius:var(--mdc-dialog-container-shape, 4px)}.mat-mdc-dialog-container .mdc-dialog__title{font-family:var(--mdc-dialog-subhead-font, Roboto, sans-serif);line-height:var(--mdc-dialog-subhead-line-height, 1.5rem);font-size:var(--mdc-dialog-subhead-size, 1rem);font-weight:var(--mdc-dialog-subhead-weight, 400);letter-spacing:var(--mdc-dialog-subhead-tracking, 0.03125em)}.mat-mdc-dialog-container .mdc-dialog__title{color:var(--mdc-dialog-subhead-color, rgba(0, 0, 0, 0.87))}.mat-mdc-dialog-container .mdc-dialog__content{font-family:var(--mdc-dialog-supporting-text-font, Roboto, sans-serif);line-height:var(--mdc-dialog-supporting-text-line-height, 1.5rem);font-size:var(--mdc-dialog-supporting-text-size, 1rem);font-weight:var(--mdc-dialog-supporting-text-weight, 400);letter-spacing:var(--mdc-dialog-supporting-text-tracking, 0.03125em)}.mat-mdc-dialog-container .mdc-dialog__content{color:var(--mdc-dialog-supporting-text-color, rgba(0, 0, 0, 0.6))}.mat-mdc-dialog-container .mdc-dialog__container{transition:opacity linear var(--mat-dialog-transition-duration, 0ms)}.mat-mdc-dialog-container .mdc-dialog__surface{transition:transform var(--mat-dialog-transition-duration, 0ms) 0ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-dialog-container._mat-animation-noopable .mdc-dialog__container,.mat-mdc-dialog-container._mat-animation-noopable .mdc-dialog__surface{transition:none}.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-max-width, 80vw);min-width:var(--mat-dialog-container-min-width, 0)}@media(max-width: 599px){.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-small-max-width, 80vw)}}.mat-mdc-dialog-title{padding:var(--mat-dialog-headline-padding, 0 24px 9px)}.mat-mdc-dialog-content{display:block}.mat-mdc-dialog-container .mat-mdc-dialog-content{padding:var(--mat-dialog-content-padding, 20px 24px)}.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content{padding:var(--mat-dialog-with-actions-content-padding, 20px 24px)}.mat-mdc-dialog-container .mat-mdc-dialog-title+.mat-mdc-dialog-content{padding-top:0}.mat-mdc-dialog-actions{padding:var(--mat-dialog-actions-padding, 8px);justify-content:var(--mat-dialog-actions-alignment, start)}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start,.mat-mdc-dialog-actions[align=start]{justify-content:start}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center,.mat-mdc-dialog-actions[align=center]{justify-content:center}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end,.mat-mdc-dialog-actions[align=end]{justify-content:flex-end}.mat-mdc-dialog-actions .mat-button-base+.mat-button-base,.mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-mdc-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}',
          ],
        },
      ],
    },
  ],
  ctorParameters: () => [
    { type: i0.ElementRef },
    { type: i1.FocusTrapFactory },
    {
      type: undefined,
      decorators: [
        {
          type: Optional,
        },
        {
          type: Inject,
          args: [DOCUMENT],
        },
      ],
    },
    { type: i2.MatDialogConfig },
    { type: i1.InteractivityChecker },
    { type: i0.NgZone },
    { type: i3.OverlayRef },
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
    { type: i1.FocusMonitor },
  ],
});
const TRANSITION_DURATION_PROPERTY = '--mat-dialog-transition-duration';
// TODO(mmalerba): Remove this function after animation durations are required
//  to be numbers.
/**
 * Converts a CSS time string to a number in ms. If the given time is already a
 * number, it is assumed to be in ms.
 */
function parseCssTime(time) {
  if (time == null) {
    return null;
  }
  if (typeof time === 'number') {
    return time;
  }
  if (time.endsWith('ms')) {
    return coerceNumberProperty(time.substring(0, time.length - 2));
  }
  if (time.endsWith('s')) {
    return coerceNumberProperty(time.substring(0, time.length - 1)) * 1000;
  }
  if (time === '0') {
    return 0;
  }
  return null; // anything else is invalid.
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUN2RixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDaEQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLE1BQU0sRUFFTixRQUFRLEVBQ1IsaUJBQWlCLEVBQ2pCLHFCQUFxQixHQUN0QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDaEQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGVBQWUsRUFBa0IsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7QUFRckUsMkNBQTJDO0FBQzNDLE1BQU0sVUFBVSxHQUFHLGtCQUFrQixDQUFDO0FBRXRDLCtDQUErQztBQUMvQyxNQUFNLGFBQWEsR0FBRyxxQkFBcUIsQ0FBQztBQUU1QywrQ0FBK0M7QUFDL0MsTUFBTSxhQUFhLEdBQUcscUJBQXFCLENBQUM7QUFFNUMseURBQXlEO0FBQ3pELE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHLEdBQUcsQ0FBQztBQUUzQyx5REFBeUQ7QUFDekQsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUcsRUFBRSxDQUFDO0FBeUIzQyxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsa0JBQW1DO0lBdUJ6RSxZQUNFLFVBQXNCLEVBQ3RCLGdCQUFrQyxFQUNKLFNBQWMsRUFDNUMsWUFBNkIsRUFDN0Isb0JBQTBDLEVBQzFDLE1BQWMsRUFDZCxVQUFzQixFQUM2QixjQUF1QixFQUMxRSxZQUEyQjtRQUUzQixLQUFLLENBQ0gsVUFBVSxFQUNWLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsWUFBWSxFQUNaLG9CQUFvQixFQUNwQixNQUFNLEVBQ04sVUFBVSxFQUNWLFlBQVksQ0FDYixDQUFDO1FBWmlELG1CQUFjLEdBQWQsY0FBYyxDQUFTO1FBOUI1RSw2Q0FBNkM7UUFDN0MsMkJBQXNCLEdBQUcsSUFBSSxZQUFZLEVBQThCLENBQUM7UUFFeEUsc0NBQXNDO1FBQ3RDLHVCQUFrQixHQUFZLElBQUksQ0FBQyxjQUFjLEtBQUssZ0JBQWdCLENBQUM7UUFFdkUsaURBQWlEO1FBQ3ZDLHdCQUFtQixHQUFHLENBQUMsQ0FBQztRQUVsQyxzREFBc0Q7UUFDOUMsaUJBQVksR0FBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7UUFDbkUsNkNBQTZDO1FBQ3JDLDRCQUF1QixHQUFHLElBQUksQ0FBQyxrQkFBa0I7WUFDdkQsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLElBQUksdUJBQXVCO1lBQzlFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDTiw4Q0FBOEM7UUFDdEMsMkJBQXNCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQjtZQUN0RCxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSx3QkFBd0I7WUFDOUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNOLDJDQUEyQztRQUNuQyxvQkFBZSxHQUF5QyxJQUFJLENBQUM7UUFtSHJFOzs7V0FHRztRQUNLLHNCQUFpQixHQUFHLEdBQUcsRUFBRTtZQUMvQixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDO1FBRUY7OztXQUdHO1FBQ0ssdUJBQWtCLEdBQUcsR0FBRyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsc0JBQXNCLEVBQUMsQ0FBQyxDQUFDO1FBQzlGLENBQUMsQ0FBQztJQTVHRixDQUFDO0lBRWtCLGdCQUFnQjtRQUNqQyw0RUFBNEU7UUFDNUUsa0ZBQWtGO1FBQ2xGLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXpCLGlGQUFpRjtRQUNqRixnRkFBZ0Y7UUFDaEYsd0RBQXdEO1FBQ3hELDJEQUEyRDtRQUMzRCx5RUFBeUU7UUFDekUsc0ZBQXNGO1FBQ3RGLG9GQUFvRjtRQUNwRix3Q0FBd0M7UUFDeEMsaUZBQWlGO1FBQ2pGLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxtREFBbUQ7SUFDM0MsbUJBQW1CO1FBQ3pCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsdUJBQXVCLEVBQUMsQ0FBQyxDQUFDO1FBRTlGLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUNqQyw0QkFBNEIsRUFDNUIsR0FBRyxJQUFJLENBQUMsdUJBQXVCLElBQUksQ0FDcEMsQ0FBQztZQUVGLDZFQUE2RTtZQUM3RSxxRkFBcUY7WUFDckYsb0ZBQW9GO1lBQ3BGLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDOUYsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUN6RixDQUFDO2FBQU0sQ0FBQztZQUNOLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM1QyxrRkFBa0Y7WUFDbEYsaUZBQWlGO1lBQ2pGLCtFQUErRTtZQUMvRSxtRkFBbUY7WUFDbkYsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELENBQUM7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsbUJBQW1CO1FBQ2pCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsc0JBQXNCLEVBQUMsQ0FBQyxDQUFDO1FBQzdGLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUvQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FDakMsNEJBQTRCLEVBQzVCLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixJQUFJLENBQ25DLENBQUM7WUFFRiw2RUFBNkU7WUFDN0UsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDekYsQ0FBQzthQUFNLENBQUM7WUFDTix1RkFBdUY7WUFDdkYsd0ZBQXdGO1lBQ3hGLDBGQUEwRjtZQUMxRixrRkFBa0Y7WUFDbEYseUZBQXlGO1lBQ3pGLHlGQUF5RjtZQUN6RixvRkFBb0Y7WUFDcEYsdUZBQXVGO1lBQ3ZGLDRGQUE0RjtZQUM1RixvRkFBb0Y7WUFDcEYsNEZBQTRGO1lBQzVGLGlEQUFpRDtZQUNqRCwwRkFBMEY7WUFDMUYsNEZBQTRGO1lBQzVGLDZGQUE2RjtZQUM3Rix3RkFBd0Y7WUFDeEYseUNBQXlDO1lBQ3pDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztRQUMxRCxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILHlCQUF5QixDQUFDLEtBQWE7UUFDckMsSUFBSSxDQUFDLG1CQUFtQixJQUFJLEtBQUssQ0FBQztRQUNsQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQW9CRCwyQ0FBMkM7SUFDbkMsc0JBQXNCO1FBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVPLDJCQUEyQixDQUFDLFFBQWdCLEVBQUUsUUFBb0I7UUFDeEUsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ2xDLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUVELHlFQUF5RTtRQUN6RSx1RUFBdUU7UUFDdkUsSUFBSSxDQUFDLGVBQWUsR0FBRyxVQUFVLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxnRUFBZ0U7SUFDeEQsc0JBQXNCLENBQUMsUUFBb0I7UUFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDbEMsSUFBSSxPQUFPLHFCQUFxQixLQUFLLFVBQVUsRUFBRSxDQUFDO2dCQUNoRCxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsQyxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sUUFBUSxFQUFFLENBQUM7WUFDYixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRWtCLG9CQUFvQjtRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDcEIsQ0FBQztJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDTyxrQkFBa0IsQ0FBQyxTQUFpQjtRQUM1QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BCLENBQUM7UUFFRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFUSxXQUFXO1FBQ2xCLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVwQixJQUFJLElBQUksQ0FBQyxlQUFlLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDbEMsWUFBWSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNyQyxDQUFDO0lBQ0gsQ0FBQztJQUVRLHFCQUFxQixDQUFJLE1BQTBCO1FBQzFELDBFQUEwRTtRQUMxRSxtRUFBbUU7UUFDbkUsMEVBQTBFO1FBQzFFLG1FQUFtRTtRQUNuRSxFQUFFO1FBQ0YsMEVBQTBFO1FBQzFFLHNFQUFzRTtRQUN0RSxrQkFBa0I7UUFDbEIsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELEdBQUcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUMxRSxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7OEdBMU5VLGtCQUFrQiw0RUEwQlAsUUFBUSxnSkFLUixxQkFBcUI7a0dBL0JoQyxrQkFBa0IsdW1CQ3pFL0IsOEpBS0Esc2xYRHNEWSxlQUFlOzsyRkFjZCxrQkFBa0I7a0JBdkI5QixTQUFTOytCQUNFLHNCQUFzQixpQkFHakIsaUJBQWlCLENBQUMsSUFBSSxtQkFHcEIsdUJBQXVCLENBQUMsT0FBTyxjQUNwQyxJQUFJLFdBQ1AsQ0FBQyxlQUFlLENBQUMsUUFDcEI7d0JBQ0osT0FBTyxFQUFFLHFDQUFxQzt3QkFDOUMsVUFBVSxFQUFFLElBQUk7d0JBQ2hCLG1CQUFtQixFQUFFLG1CQUFtQjt3QkFDeEMsTUFBTSxFQUFFLFlBQVk7d0JBQ3BCLGFBQWEsRUFBRSxjQUFjO3dCQUM3Qix3QkFBd0IsRUFBRSxvREFBb0Q7d0JBQzlFLG1CQUFtQixFQUFFLG1CQUFtQjt3QkFDeEMseUJBQXlCLEVBQUUsaUNBQWlDO3dCQUM1RCxpQ0FBaUMsRUFBRSxxQkFBcUI7d0JBQ3hELCtDQUErQyxFQUFFLHlCQUF5QjtxQkFDM0U7OzBCQTRCRSxRQUFROzswQkFBSSxNQUFNOzJCQUFDLFFBQVE7OzBCQUszQixRQUFROzswQkFBSSxNQUFNOzJCQUFDLHFCQUFxQjs7QUE4TDdDLE1BQU0sNEJBQTRCLEdBQUcsa0NBQWtDLENBQUM7QUFFeEUsOEVBQThFO0FBQzlFLGtCQUFrQjtBQUNsQjs7O0dBR0c7QUFDSCxTQUFTLFlBQVksQ0FBQyxJQUFpQztJQUNyRCxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNqQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3hCLE9BQU8sb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUN2QixPQUFPLG9CQUFvQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDekUsQ0FBQztJQUNELElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNELE9BQU8sSUFBSSxDQUFDLENBQUMsNEJBQTRCO0FBQzNDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c01vbml0b3IsIEZvY3VzVHJhcEZhY3RvcnksIEludGVyYWN0aXZpdHlDaGVja2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge092ZXJsYXlSZWZ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBBTklNQVRJT05fTU9EVUxFX1RZUEUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXREaWFsb2dDb25maWd9IGZyb20gJy4vZGlhbG9nLWNvbmZpZyc7XG5pbXBvcnQge0Nka0RpYWxvZ0NvbnRhaW5lcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2RpYWxvZyc7XG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtDZGtQb3J0YWxPdXRsZXQsIENvbXBvbmVudFBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5cbi8qKiBFdmVudCB0aGF0IGNhcHR1cmVzIHRoZSBzdGF0ZSBvZiBkaWFsb2cgY29udGFpbmVyIGFuaW1hdGlvbnMuICovXG5pbnRlcmZhY2UgTGVnYWN5RGlhbG9nQW5pbWF0aW9uRXZlbnQge1xuICBzdGF0ZTogJ29wZW5lZCcgfCAnb3BlbmluZycgfCAnY2xvc2luZycgfCAnY2xvc2VkJztcbiAgdG90YWxUaW1lOiBudW1iZXI7XG59XG5cbi8qKiBDbGFzcyBhZGRlZCB3aGVuIHRoZSBkaWFsb2cgaXMgb3Blbi4gKi9cbmNvbnN0IE9QRU5fQ0xBU1MgPSAnbWRjLWRpYWxvZy0tb3Blbic7XG5cbi8qKiBDbGFzcyBhZGRlZCB3aGlsZSB0aGUgZGlhbG9nIGlzIG9wZW5pbmcuICovXG5jb25zdCBPUEVOSU5HX0NMQVNTID0gJ21kYy1kaWFsb2ctLW9wZW5pbmcnO1xuXG4vKiogQ2xhc3MgYWRkZWQgd2hpbGUgdGhlIGRpYWxvZyBpcyBjbG9zaW5nLiAqL1xuY29uc3QgQ0xPU0lOR19DTEFTUyA9ICdtZGMtZGlhbG9nLS1jbG9zaW5nJztcblxuLyoqIER1cmF0aW9uIG9mIHRoZSBvcGVuaW5nIGFuaW1hdGlvbiBpbiBtaWxsaXNlY29uZHMuICovXG5leHBvcnQgY29uc3QgT1BFTl9BTklNQVRJT05fRFVSQVRJT04gPSAxNTA7XG5cbi8qKiBEdXJhdGlvbiBvZiB0aGUgY2xvc2luZyBhbmltYXRpb24gaW4gbWlsbGlzZWNvbmRzLiAqL1xuZXhwb3J0IGNvbnN0IENMT1NFX0FOSU1BVElPTl9EVVJBVElPTiA9IDc1O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGlhbG9nLWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlVXJsOiAnZGlhbG9nLWNvbnRhaW5lci5odG1sJyxcbiAgc3R5bGVVcmw6ICdkaWFsb2cuY3NzJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gRGlzYWJsZWQgZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlIG5vbi1NREMgZGlhbG9nIGNvbnRhaW5lci5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ2RrUG9ydGFsT3V0bGV0XSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbWRjLWRpYWxvZy1jb250YWluZXIgbWRjLWRpYWxvZycsXG4gICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAnW2F0dHIuYXJpYS1tb2RhbF0nOiAnX2NvbmZpZy5hcmlhTW9kYWwnLFxuICAgICdbaWRdJzogJ19jb25maWcuaWQnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdfY29uZmlnLnJvbGUnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19jb25maWcuYXJpYUxhYmVsID8gbnVsbCA6IF9hcmlhTGFiZWxsZWRCeVF1ZXVlWzBdJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnX2NvbmZpZy5hcmlhTGFiZWwnLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfY29uZmlnLmFyaWFEZXNjcmliZWRCeSB8fCBudWxsJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICchX2FuaW1hdGlvbnNFbmFibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtZGlhbG9nLWNvbnRhaW5lci13aXRoLWFjdGlvbnNdJzogJ19hY3Rpb25TZWN0aW9uQ291bnQgPiAwJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nQ29udGFpbmVyIGV4dGVuZHMgQ2RrRGlhbG9nQ29udGFpbmVyPE1hdERpYWxvZ0NvbmZpZz4gaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKiogRW1pdHMgd2hlbiBhbiBhbmltYXRpb24gc3RhdGUgY2hhbmdlcy4gKi9cbiAgX2FuaW1hdGlvblN0YXRlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8TGVnYWN5RGlhbG9nQW5pbWF0aW9uRXZlbnQ+KCk7XG5cbiAgLyoqIFdoZXRoZXIgYW5pbWF0aW9ucyBhcmUgZW5hYmxlZC4gKi9cbiAgX2FuaW1hdGlvbnNFbmFibGVkOiBib29sZWFuID0gdGhpcy5fYW5pbWF0aW9uTW9kZSAhPT0gJ05vb3BBbmltYXRpb25zJztcblxuICAvKiogTnVtYmVyIG9mIGFjdGlvbnMgcHJvamVjdGVkIGluIHRoZSBkaWFsb2cuICovXG4gIHByb3RlY3RlZCBfYWN0aW9uU2VjdGlvbkNvdW50ID0gMDtcblxuICAvKiogSG9zdCBlbGVtZW50IG9mIHRoZSBkaWFsb2cgY29udGFpbmVyIGNvbXBvbmVudC4gKi9cbiAgcHJpdmF0ZSBfaG9zdEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAvKiogRHVyYXRpb24gb2YgdGhlIGRpYWxvZyBvcGVuIGFuaW1hdGlvbi4gKi9cbiAgcHJpdmF0ZSBfZW50ZXJBbmltYXRpb25EdXJhdGlvbiA9IHRoaXMuX2FuaW1hdGlvbnNFbmFibGVkXG4gICAgPyBwYXJzZUNzc1RpbWUodGhpcy5fY29uZmlnLmVudGVyQW5pbWF0aW9uRHVyYXRpb24pID8/IE9QRU5fQU5JTUFUSU9OX0RVUkFUSU9OXG4gICAgOiAwO1xuICAvKiogRHVyYXRpb24gb2YgdGhlIGRpYWxvZyBjbG9zZSBhbmltYXRpb24uICovXG4gIHByaXZhdGUgX2V4aXRBbmltYXRpb25EdXJhdGlvbiA9IHRoaXMuX2FuaW1hdGlvbnNFbmFibGVkXG4gICAgPyBwYXJzZUNzc1RpbWUodGhpcy5fY29uZmlnLmV4aXRBbmltYXRpb25EdXJhdGlvbikgPz8gQ0xPU0VfQU5JTUFUSU9OX0RVUkFUSU9OXG4gICAgOiAwO1xuICAvKiogQ3VycmVudCB0aW1lciBmb3IgZGlhbG9nIGFuaW1hdGlvbnMuICovXG4gIHByaXZhdGUgX2FuaW1hdGlvblRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgZm9jdXNUcmFwRmFjdG9yeTogRm9jdXNUcmFwRmFjdG9yeSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBfZG9jdW1lbnQ6IGFueSxcbiAgICBkaWFsb2dDb25maWc6IE1hdERpYWxvZ0NvbmZpZyxcbiAgICBpbnRlcmFjdGl2aXR5Q2hlY2tlcjogSW50ZXJhY3Rpdml0eUNoZWNrZXIsXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICAgb3ZlcmxheVJlZjogT3ZlcmxheVJlZixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgICBmb2N1c01vbml0b3I/OiBGb2N1c01vbml0b3IsXG4gICkge1xuICAgIHN1cGVyKFxuICAgICAgZWxlbWVudFJlZixcbiAgICAgIGZvY3VzVHJhcEZhY3RvcnksXG4gICAgICBfZG9jdW1lbnQsXG4gICAgICBkaWFsb2dDb25maWcsXG4gICAgICBpbnRlcmFjdGl2aXR5Q2hlY2tlcixcbiAgICAgIG5nWm9uZSxcbiAgICAgIG92ZXJsYXlSZWYsXG4gICAgICBmb2N1c01vbml0b3IsXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfY29udGVudEF0dGFjaGVkKCk6IHZvaWQge1xuICAgIC8vIERlbGVnYXRlIHRvIHRoZSBvcmlnaW5hbCBkaWFsb2ctY29udGFpbmVyIGluaXRpYWxpemF0aW9uIChpLmUuIHNhdmluZyB0aGVcbiAgICAvLyBwcmV2aW91cyBlbGVtZW50LCBzZXR0aW5nIHVwIHRoZSBmb2N1cyB0cmFwIGFuZCBtb3ZpbmcgZm9jdXMgdG8gdGhlIGNvbnRhaW5lcikuXG4gICAgc3VwZXIuX2NvbnRlbnRBdHRhY2hlZCgpO1xuXG4gICAgLy8gTm90ZTogVXN1YWxseSB3ZSB3b3VsZCBiZSBhYmxlIHRvIHVzZSB0aGUgTURDIGRpYWxvZyBmb3VuZGF0aW9uIGhlcmUgdG8gaGFuZGxlXG4gICAgLy8gdGhlIGRpYWxvZyBhbmltYXRpb24gZm9yIHVzLCBidXQgdGhlcmUgYXJlIGEgZmV3IHJlYXNvbnMgd2h5IHdlIGp1c3QgbGV2ZXJhZ2VcbiAgICAvLyB0aGVpciBzdHlsZXMgYW5kIG5vdCB1c2UgdGhlIHJ1bnRpbWUgZm91bmRhdGlvbiBjb2RlOlxuICAgIC8vICAgMS4gRm91bmRhdGlvbiBkb2VzIG5vdCBhbGxvdyB1cyB0byBkaXNhYmxlIGFuaW1hdGlvbnMuXG4gICAgLy8gICAyLiBGb3VuZGF0aW9uIGNvbnRhaW5zIHVubmVjZXNzYXJ5IGZlYXR1cmVzIHdlIGRvbid0IG5lZWQgYW5kIGFyZW4ndFxuICAgIC8vICAgICAgdHJlZS1zaGFrZWFibGUuIGUuZy4gYmFja2dyb3VuZCBzY3JpbSwga2V5Ym9hcmQgZXZlbnQgaGFuZGxlcnMgZm9yIEVTQyBidXR0b24uXG4gICAgLy8gICAzLiBGb3VuZGF0aW9uIHVzZXMgdW5uZWNlc3NhcnkgdGltZXJzIGZvciBhbmltYXRpb25zIHRvIHdvcmsgYXJvdW5kIGxpbWl0YXRpb25zXG4gICAgLy8gICAgICBpbiBSZWFjdCdzIGBzZXRTdGF0ZWAgbWVjaGFuaXNtLlxuICAgIC8vICAgICAgaHR0cHM6Ly9naXRodWIuY29tL21hdGVyaWFsLWNvbXBvbmVudHMvbWF0ZXJpYWwtY29tcG9uZW50cy13ZWIvcHVsbC8zNjgyLlxuICAgIHRoaXMuX3N0YXJ0T3BlbkFuaW1hdGlvbigpO1xuICB9XG5cbiAgLyoqIFN0YXJ0cyB0aGUgZGlhbG9nIG9wZW4gYW5pbWF0aW9uIGlmIGVuYWJsZWQuICovXG4gIHByaXZhdGUgX3N0YXJ0T3BlbkFuaW1hdGlvbigpIHtcbiAgICB0aGlzLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQuZW1pdCh7c3RhdGU6ICdvcGVuaW5nJywgdG90YWxUaW1lOiB0aGlzLl9lbnRlckFuaW1hdGlvbkR1cmF0aW9ufSk7XG5cbiAgICBpZiAodGhpcy5fYW5pbWF0aW9uc0VuYWJsZWQpIHtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFxuICAgICAgICBUUkFOU0lUSU9OX0RVUkFUSU9OX1BST1BFUlRZLFxuICAgICAgICBgJHt0aGlzLl9lbnRlckFuaW1hdGlvbkR1cmF0aW9ufW1zYCxcbiAgICAgICk7XG5cbiAgICAgIC8vIFdlIG5lZWQgdG8gZ2l2ZSB0aGUgYHNldFByb3BlcnR5YCBjYWxsIGZyb20gYWJvdmUgc29tZSB0aW1lIHRvIGJlIGFwcGxpZWQuXG4gICAgICAvLyBPbmUgd291bGQgZXhwZWN0IHRoYXQgdGhlIG9wZW4gY2xhc3MgaXMgYWRkZWQgb25jZSB0aGUgYW5pbWF0aW9uIGZpbmlzaGVkLCBidXQgTURDXG4gICAgICAvLyB1c2VzIHRoZSBvcGVuIGNsYXNzIGluIGNvbWJpbmF0aW9uIHdpdGggdGhlIG9wZW5pbmcgY2xhc3MgdG8gc3RhcnQgdGhlIGFuaW1hdGlvbi5cbiAgICAgIHRoaXMuX3JlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QuYWRkKE9QRU5JTkdfQ0xBU1MsIE9QRU5fQ0xBU1MpKTtcbiAgICAgIHRoaXMuX3dhaXRGb3JBbmltYXRpb25Ub0NvbXBsZXRlKHRoaXMuX2VudGVyQW5pbWF0aW9uRHVyYXRpb24sIHRoaXMuX2ZpbmlzaERpYWxvZ09wZW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QuYWRkKE9QRU5fQ0xBU1MpO1xuICAgICAgLy8gTm90ZTogV2UgY291bGQgaW1tZWRpYXRlbHkgZmluaXNoIHRoZSBkaWFsb2cgb3BlbmluZyBoZXJlIHdpdGggbm9vcCBhbmltYXRpb25zLFxuICAgICAgLy8gYnV0IHdlIGRlZmVyIHVudGlsIG5leHQgdGljayBzbyB0aGF0IGNvbnN1bWVycyBjYW4gc3Vic2NyaWJlIHRvIGBhZnRlck9wZW5lZGAuXG4gICAgICAvLyBFeGVjdXRpbmcgdGhpcyBpbW1lZGlhdGVseSB3b3VsZCBtZWFuIHRoYXQgYGFmdGVyT3BlbmVkYCBlbWl0cyBzeW5jaHJvbm91c2x5XG4gICAgICAvLyBvbiBgZGlhbG9nLm9wZW5gIGJlZm9yZSB0aGUgY29uc3VtZXIgaGFkIGEgY2hhbmdlIHRvIHN1YnNjcmliZSB0byBgYWZ0ZXJPcGVuZWRgLlxuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB0aGlzLl9maW5pc2hEaWFsb2dPcGVuKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIGV4aXQgYW5pbWF0aW9uIG9mIHRoZSBkaWFsb2cgaWYgZW5hYmxlZC4gVGhpcyBtZXRob2QgaXNcbiAgICogY2FsbGVkIGJ5IHRoZSBkaWFsb2cgcmVmLlxuICAgKi9cbiAgX3N0YXJ0RXhpdEFuaW1hdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQuZW1pdCh7c3RhdGU6ICdjbG9zaW5nJywgdG90YWxUaW1lOiB0aGlzLl9leGl0QW5pbWF0aW9uRHVyYXRpb259KTtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKE9QRU5fQ0xBU1MpO1xuXG4gICAgaWYgKHRoaXMuX2FuaW1hdGlvbnNFbmFibGVkKSB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcbiAgICAgICAgVFJBTlNJVElPTl9EVVJBVElPTl9QUk9QRVJUWSxcbiAgICAgICAgYCR7dGhpcy5fZXhpdEFuaW1hdGlvbkR1cmF0aW9ufW1zYCxcbiAgICAgICk7XG5cbiAgICAgIC8vIFdlIG5lZWQgdG8gZ2l2ZSB0aGUgYHNldFByb3BlcnR5YCBjYWxsIGZyb20gYWJvdmUgc29tZSB0aW1lIHRvIGJlIGFwcGxpZWQuXG4gICAgICB0aGlzLl9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LmFkZChDTE9TSU5HX0NMQVNTKSk7XG4gICAgICB0aGlzLl93YWl0Rm9yQW5pbWF0aW9uVG9Db21wbGV0ZSh0aGlzLl9leGl0QW5pbWF0aW9uRHVyYXRpb24sIHRoaXMuX2ZpbmlzaERpYWxvZ0Nsb3NlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhpcyBzdWJzY3JpcHRpb24gdG8gdGhlIGBPdmVybGF5UmVmI2JhY2tkcm9wQ2xpY2tgIG9ic2VydmFibGUgaW4gdGhlIGBEaWFsb2dSZWZgIGlzXG4gICAgICAvLyBzZXQgdXAgYmVmb3JlIGFueSB1c2VyIGNhbiBzdWJzY3JpYmUgdG8gdGhlIGJhY2tkcm9wIGNsaWNrLiBUaGUgc3Vic2NyaXB0aW9uIHRyaWdnZXJzXG4gICAgICAvLyB0aGUgZGlhbG9nIGNsb3NlIGFuZCB0aGlzIG1ldGhvZCBzeW5jaHJvbm91c2x5LiBJZiB3ZSdkIHN5bmNocm9ub3VzbHkgZW1pdCB0aGUgYENMT1NFRGBcbiAgICAgIC8vIGFuaW1hdGlvbiBzdGF0ZSBldmVudCBpZiBhbmltYXRpb25zIGFyZSBkaXNhYmxlZCwgdGhlIG92ZXJsYXkgd291bGQgYmUgZGlzcG9zZWRcbiAgICAgIC8vIGltbWVkaWF0ZWx5IGFuZCBhbGwgb3RoZXIgc3Vic2NyaXB0aW9ucyB0byBgRGlhbG9nUmVmI2JhY2tkcm9wQ2xpY2tgIHdvdWxkIGJlIHNpbGVudGx5XG4gICAgICAvLyBza2lwcGVkLiBXZSB3b3JrIGFyb3VuZCB0aGlzIGJ5IHdhaXRpbmcgd2l0aCB0aGUgZGlhbG9nIGNsb3NlIHVudGlsIHRoZSBuZXh0IHRpY2sgd2hlblxuICAgICAgLy8gYWxsIHN1YnNjcmlwdGlvbnMgaGF2ZSBiZWVuIGZpcmVkIGFzIGV4cGVjdGVkLiBUaGlzIGlzIG5vdCBhbiBpZGVhbCBzb2x1dGlvbiwgYnV0XG4gICAgICAvLyB0aGVyZSBkb2Vzbid0IHNlZW0gdG8gYmUgYW55IG90aGVyIGdvb2Qgd2F5LiBBbHRlcm5hdGl2ZXMgdGhhdCBoYXZlIGJlZW4gY29uc2lkZXJlZDpcbiAgICAgIC8vICAgMS4gRGVmZXJyaW5nIGBEaWFsb2dSZWYuY2xvc2VgLiBUaGlzIGNvdWxkIGJlIGEgYnJlYWtpbmcgY2hhbmdlIGR1ZSB0byBhIG5ldyBtaWNyb3Rhc2suXG4gICAgICAvLyAgICAgIEFsc28gdGhpcyBpc3N1ZSBpcyBzcGVjaWZpYyB0byB0aGUgTURDIGltcGxlbWVudGF0aW9uIHdoZXJlIHRoZSBkaWFsb2cgY291bGRcbiAgICAgIC8vICAgICAgdGVjaG5pY2FsbHkgYmUgY2xvc2VkIHN5bmNocm9ub3VzbHkuIEluIHRoZSBub24tTURDIG9uZSwgQW5ndWxhciBhbmltYXRpb25zIGFyZSB1c2VkXG4gICAgICAvLyAgICAgIGFuZCBjbG9zaW5nIGFsd2F5cyB0YWtlcyBhdCBsZWFzdCBhIHRpY2suXG4gICAgICAvLyAgIDIuIEVuc3VyaW5nIHRoYXQgdXNlciBzdWJzY3JpcHRpb25zIHRvIGBiYWNrZHJvcENsaWNrYCwgYGtleWRvd25FdmVudHNgIGluIHRoZSBkaWFsb2dcbiAgICAgIC8vICAgICAgcmVmIGFyZSBmaXJzdC4gVGhpcyB3b3VsZCBzb2x2ZSB0aGUgaXNzdWUsIGJ1dCBoYXMgdGhlIHJpc2sgb2YgbWVtb3J5IGxlYWtzIGFuZCBhbHNvXG4gICAgICAvLyAgICAgIGRvZXNuJ3Qgc29sdmUgdGhlIGNhc2Ugd2hlcmUgY29uc3VtZXJzIGNhbGwgYERpYWxvZ1JlZi5jbG9zZWAgaW4gdGhlaXIgc3Vic2NyaXB0aW9ucy5cbiAgICAgIC8vIEJhc2VkIG9uIHRoZSBmYWN0IHRoYXQgdGhpcyBpcyBzcGVjaWZpYyB0byB0aGUgTURDLWJhc2VkIGltcGxlbWVudGF0aW9uIG9mIHRoZSBkaWFsb2dcbiAgICAgIC8vIGFuaW1hdGlvbnMsIHRoZSBkZWZlciBpcyBhcHBsaWVkIGhlcmUuXG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHRoaXMuX2ZpbmlzaERpYWxvZ0Nsb3NlKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBudW1iZXIgYWN0aW9uIHNlY3Rpb25zLlxuICAgKiBAcGFyYW0gZGVsdGEgSW5jcmVhc2UvZGVjcmVhc2UgaW4gdGhlIG51bWJlciBvZiBzZWN0aW9ucy5cbiAgICovXG4gIF91cGRhdGVBY3Rpb25TZWN0aW9uQ291bnQoZGVsdGE6IG51bWJlcikge1xuICAgIHRoaXMuX2FjdGlvblNlY3Rpb25Db3VudCArPSBkZWx0YTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wbGV0ZXMgdGhlIGRpYWxvZyBvcGVuIGJ5IGNsZWFyaW5nIHBvdGVudGlhbCBhbmltYXRpb24gY2xhc3NlcywgdHJhcHBpbmdcbiAgICogZm9jdXMgYW5kIGVtaXR0aW5nIGFuIG9wZW5lZCBldmVudC5cbiAgICovXG4gIHByaXZhdGUgX2ZpbmlzaERpYWxvZ09wZW4gPSAoKSA9PiB7XG4gICAgdGhpcy5fY2xlYXJBbmltYXRpb25DbGFzc2VzKCk7XG4gICAgdGhpcy5fb3BlbkFuaW1hdGlvbkRvbmUodGhpcy5fZW50ZXJBbmltYXRpb25EdXJhdGlvbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbXBsZXRlcyB0aGUgZGlhbG9nIGNsb3NlIGJ5IGNsZWFyaW5nIHBvdGVudGlhbCBhbmltYXRpb24gY2xhc3NlcywgcmVzdG9yaW5nXG4gICAqIGZvY3VzIGFuZCBlbWl0dGluZyBhIGNsb3NlZCBldmVudC5cbiAgICovXG4gIHByaXZhdGUgX2ZpbmlzaERpYWxvZ0Nsb3NlID0gKCkgPT4ge1xuICAgIHRoaXMuX2NsZWFyQW5pbWF0aW9uQ2xhc3NlcygpO1xuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5lbWl0KHtzdGF0ZTogJ2Nsb3NlZCcsIHRvdGFsVGltZTogdGhpcy5fZXhpdEFuaW1hdGlvbkR1cmF0aW9ufSk7XG4gIH07XG5cbiAgLyoqIENsZWFycyBhbGwgZGlhbG9nIGFuaW1hdGlvbiBjbGFzc2VzLiAqL1xuICBwcml2YXRlIF9jbGVhckFuaW1hdGlvbkNsYXNzZXMoKSB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShPUEVOSU5HX0NMQVNTLCBDTE9TSU5HX0NMQVNTKTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhaXRGb3JBbmltYXRpb25Ub0NvbXBsZXRlKGR1cmF0aW9uOiBudW1iZXIsIGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgaWYgKHRoaXMuX2FuaW1hdGlvblRpbWVyICE9PSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fYW5pbWF0aW9uVGltZXIpO1xuICAgIH1cblxuICAgIC8vIE5vdGUgdGhhdCB3ZSB3YW50IHRoaXMgdGltZXIgdG8gcnVuIGluc2lkZSB0aGUgTmdab25lLCBiZWNhdXNlIHdlIHdhbnRcbiAgICAvLyB0aGUgcmVsYXRlZCBldmVudHMgbGlrZSBgYWZ0ZXJDbG9zZWRgIHRvIGJlIGluc2lkZSB0aGUgem9uZSBhcyB3ZWxsLlxuICAgIHRoaXMuX2FuaW1hdGlvblRpbWVyID0gc2V0VGltZW91dChjYWxsYmFjaywgZHVyYXRpb24pO1xuICB9XG5cbiAgLyoqIFJ1bnMgYSBjYWxsYmFjayBpbiBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCwgaWYgYXZhaWxhYmxlLiAqL1xuICBwcml2YXRlIF9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNhbGxiYWNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX2NhcHR1cmVJbml0aWFsRm9jdXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9jb25maWcuZGVsYXlGb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX3RyYXBGb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3Igd2hlbiB0aGUgb3BlbiBkaWFsb2cgYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC4gSW50ZW5kZWQgdG9cbiAgICogYmUgY2FsbGVkIGJ5IHN1Yi1jbGFzc2VzIHRoYXQgdXNlIGRpZmZlcmVudCBhbmltYXRpb24gaW1wbGVtZW50YXRpb25zLlxuICAgKi9cbiAgcHJvdGVjdGVkIF9vcGVuQW5pbWF0aW9uRG9uZSh0b3RhbFRpbWU6IG51bWJlcikge1xuICAgIGlmICh0aGlzLl9jb25maWcuZGVsYXlGb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX3RyYXBGb2N1cygpO1xuICAgIH1cblxuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5uZXh0KHtzdGF0ZTogJ29wZW5lZCcsIHRvdGFsVGltZX0pO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcblxuICAgIGlmICh0aGlzLl9hbmltYXRpb25UaW1lciAhPT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2FuaW1hdGlvblRpbWVyKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBhdHRhY2hDb21wb25lbnRQb3J0YWw8VD4ocG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VD4pOiBDb21wb25lbnRSZWY8VD4ge1xuICAgIC8vIFdoZW4gYSBjb21wb25lbnQgaXMgcGFzc2VkIGludG8gdGhlIGRpYWxvZywgdGhlIGhvc3QgZWxlbWVudCBpbnRlcnJ1cHRzXG4gICAgLy8gdGhlIGBkaXNwbGF5OmZsZXhgIGZyb20gYWZmZWN0aW5nIHRoZSBkaWFsb2cgdGl0bGUsIGNvbnRlbnQsIGFuZFxuICAgIC8vIGFjdGlvbnMuIFRvIGZpeCB0aGlzLCB3ZSBtYWtlIHRoZSBjb21wb25lbnQgaG9zdCBgZGlzcGxheTogY29udGVudHNgIGJ5XG4gICAgLy8gbWFya2luZyBpdHMgaG9zdCB3aXRoIHRoZSBgbWF0LW1kYy1kaWFsb2ctY29tcG9uZW50LWhvc3RgIGNsYXNzLlxuICAgIC8vXG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgcHJvYmxlbSBkb2VzIG5vdCBleGlzdCB3aGVuIGEgdGVtcGxhdGUgcmVmIGlzIHVzZWQgc2luY2VcbiAgICAvLyB0aGUgdGl0bGUsIGNvbnRlbnRzLCBhbmQgYWN0aW9ucyBhcmUgdGhlbiBuZXN0ZWQgZGlyZWN0bHkgdW5kZXIgdGhlXG4gICAgLy8gZGlhbG9nIHN1cmZhY2UuXG4gICAgY29uc3QgcmVmID0gc3VwZXIuYXR0YWNoQ29tcG9uZW50UG9ydGFsKHBvcnRhbCk7XG4gICAgcmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LW1kYy1kaWFsb2ctY29tcG9uZW50LWhvc3QnKTtcbiAgICByZXR1cm4gcmVmO1xuICB9XG59XG5cbmNvbnN0IFRSQU5TSVRJT05fRFVSQVRJT05fUFJPUEVSVFkgPSAnLS1tYXQtZGlhbG9nLXRyYW5zaXRpb24tZHVyYXRpb24nO1xuXG4vLyBUT0RPKG1tYWxlcmJhKTogUmVtb3ZlIHRoaXMgZnVuY3Rpb24gYWZ0ZXIgYW5pbWF0aW9uIGR1cmF0aW9ucyBhcmUgcmVxdWlyZWRcbi8vICB0byBiZSBudW1iZXJzLlxuLyoqXG4gKiBDb252ZXJ0cyBhIENTUyB0aW1lIHN0cmluZyB0byBhIG51bWJlciBpbiBtcy4gSWYgdGhlIGdpdmVuIHRpbWUgaXMgYWxyZWFkeSBhXG4gKiBudW1iZXIsIGl0IGlzIGFzc3VtZWQgdG8gYmUgaW4gbXMuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQ3NzVGltZSh0aW1lOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQpOiBudW1iZXIgfCBudWxsIHtcbiAgaWYgKHRpbWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmICh0eXBlb2YgdGltZSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdGltZTtcbiAgfVxuICBpZiAodGltZS5lbmRzV2l0aCgnbXMnKSkge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh0aW1lLnN1YnN0cmluZygwLCB0aW1lLmxlbmd0aCAtIDIpKTtcbiAgfVxuICBpZiAodGltZS5lbmRzV2l0aCgncycpKSB7XG4gICAgcmV0dXJuIGNvZXJjZU51bWJlclByb3BlcnR5KHRpbWUuc3Vic3RyaW5nKDAsIHRpbWUubGVuZ3RoIC0gMSkpICogMTAwMDtcbiAgfVxuICBpZiAodGltZSA9PT0gJzAnKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgcmV0dXJuIG51bGw7IC8vIGFueXRoaW5nIGVsc2UgaXMgaW52YWxpZC5cbn1cbiIsIjxkaXYgY2xhc3M9XCJtZGMtZGlhbG9nX19jb250YWluZXJcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtZGlhbG9nLXN1cmZhY2UgbWRjLWRpYWxvZ19fc3VyZmFjZVwiPlxuICAgIDxuZy10ZW1wbGF0ZSBjZGtQb3J0YWxPdXRsZXQgLz5cbiAgPC9kaXY+XG48L2Rpdj5cbiJdfQ==
