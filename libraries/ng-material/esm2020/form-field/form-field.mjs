/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@takkion/ng-cdk/bidi';
import { coerceBooleanProperty } from '@takkion/ng-cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { mixinColor } from '@takkion/ng-material/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { startWith, take, takeUntil } from 'rxjs/operators';
import { TAK_ERROR } from './error';
import { takFormFieldAnimations } from './form-field-animations';
import { TakFormFieldControl } from './form-field-control';
import {
  getTakFormFieldDuplicatedHintError,
  getTakFormFieldMissingControlError,
  getTakFormFieldPlaceholderConflictError,
} from './form-field-errors';
import { _TAK_HINT } from './hint';
import { TakLabel } from './label';
import { TakPlaceholder } from './placeholder';
import { TAK_PREFIX } from './prefix';
import { TAK_SUFFIX } from './suffix';
import { Platform } from '@takkion/ng-cdk/platform';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from '@angular/core';
import * as i1 from '@takkion/ng-cdk/bidi';
import * as i2 from '@takkion/ng-cdk/platform';
import * as i3 from '@angular/common';
import * as i4 from '@takkion/ng-cdk/observers';
let nextUniqueId = 0;
const floatingLabelScale = 0.75;
const outlineGapPadding = 5;
/**
 * Boilerplate for applying mixins to TakFormField.
 * @docs-private
 */
const _TakFormFieldBase = mixinColor(
  class {
    constructor(_elementRef) {
      this._elementRef = _elementRef;
    }
  },
  'primary'
);
/**
 * Injection token that can be used to configure the
 * default options for all form field within an app.
 */
export const TAK_FORM_FIELD_DEFAULT_OPTIONS = new InjectionToken('TAK_FORM_FIELD_DEFAULT_OPTIONS');
/**
 * Injection token that can be used to inject an instances of `TakFormField`. It serves
 * as alternative token to the actual `TakFormField` class which would cause unnecessary
 * retention of the `TakFormField` class and its component metadata.
 */
export const TAK_FORM_FIELD = new InjectionToken('TakFormField');
/** Container for form controls that applies Material Design styling and behavior. */
export class TakFormField extends _TakFormFieldBase {
  constructor(elementRef, _changeDetectorRef, _dir, _defaults, _platform, _ngZone, _animationMode) {
    super(elementRef);
    this._changeDetectorRef = _changeDetectorRef;
    this._dir = _dir;
    this._defaults = _defaults;
    this._platform = _platform;
    this._ngZone = _ngZone;
    /**
     * Whether the outline gap needs to be calculated
     * immediately on the next change detection run.
     */
    this._outlineGapCalculationNeededImmediately = false;
    /** Whether the outline gap needs to be calculated next time the zone has stabilized. */
    this._outlineGapCalculationNeededOnStable = false;
    this._destroyed = new Subject();
    this._hideRequiredMarker = false;
    /** Override for the logic that disables the label animation in certain cases. */
    this._showAlwaysAnimate = false;
    /** State of the tak-hint and tak-error animations. */
    this._subscriptAnimationState = '';
    this._hintLabel = '';
    // Unique id for the hint label.
    this._hintLabelId = `tak-hint-${nextUniqueId++}`;
    // Unique id for the label element.
    this._labelId = `tak-form-field-label-${nextUniqueId++}`;
    this.floatLabel = this._getDefaultFloatLabelState();
    this._animationsEnabled = _animationMode !== 'NoopAnimations';
    // Set the default through here so we invoke the setter on the first run.
    this.appearance = _defaults?.appearance || 'legacy';
    if (_defaults) {
      this._hideRequiredMarker = Boolean(_defaults.hideRequiredMarker);
      if (_defaults.color) {
        this.color = this.defaultColor = _defaults.color;
      }
    }
  }
  /** The form field appearance style. */
  get appearance() {
    return this._appearance;
  }
  set appearance(value) {
    const oldValue = this._appearance;
    this._appearance = value || this._defaults?.appearance || 'legacy';
    if (this._appearance === 'outline' && oldValue !== value) {
      this._outlineGapCalculationNeededOnStable = true;
    }
  }
  /** Whether the required marker should be hidden. */
  get hideRequiredMarker() {
    return this._hideRequiredMarker;
  }
  set hideRequiredMarker(value) {
    this._hideRequiredMarker = coerceBooleanProperty(value);
  }
  /** Whether the floating label should always float or not. */
  _shouldAlwaysFloat() {
    return this.floatLabel === 'always' && !this._showAlwaysAnimate;
  }
  /** Whether the label can float or not. */
  _canLabelFloat() {
    return this.floatLabel !== 'never';
  }
  /** Text for the form field hint. */
  get hintLabel() {
    return this._hintLabel;
  }
  set hintLabel(value) {
    this._hintLabel = value;
    this._processHints();
  }
  /**
   * Whether the label should always float, never float or float as the user types.
   *
   * Note: only the legacy appearance supports the `never` option. `never` was originally added as a
   * way to make the floating label emulate the behavior of a standard input placeholder. However
   * the form field now supports both floating labels and placeholders. Therefore in the non-legacy
   * appearances the `never` option has been disabled in favor of just using the placeholder.
   */
  get floatLabel() {
    return this.appearance !== 'legacy' && this._floatLabel === 'never' ? 'auto' : this._floatLabel;
  }
  set floatLabel(value) {
    if (value !== this._floatLabel) {
      this._floatLabel = value || this._getDefaultFloatLabelState();
      this._changeDetectorRef.markForCheck();
    }
  }
  get _control() {
    // TODO(crisbeto): we need this workaround in order to support both Ivy and ViewEngine.
    //  We should clean this up once Ivy is the default renderer.
    return this._explicitFormFieldControl || this._controlNonStatic || this._controlStatic;
  }
  set _control(value) {
    this._explicitFormFieldControl = value;
  }
  /**
   * Gets the id of the label element. If no label is present, returns `null`.
   */
  getLabelId() {
    return this._hasFloatingLabel() ? this._labelId : null;
  }
  /**
   * Gets an ElementRef for the element that a overlay attached to the form field should be
   * positioned relative to.
   */
  getConnectedOverlayOrigin() {
    return this._connectionContainerRef || this._elementRef;
  }
  ngAfterContentInit() {
    this._validateControlChild();
    const control = this._control;
    if (control.controlType) {
      this._elementRef.nativeElement.classList.add(`tak-form-field-type-${control.controlType}`);
    }
    // Subscribe to changes in the child control state in order to update the form field UI.
    control.stateChanges.pipe(startWith(null)).subscribe(() => {
      this._validatePlaceholders();
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });
    // Run change detection if the value changes.
    if (control.ngControl && control.ngControl.valueChanges) {
      control.ngControl.valueChanges
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => this._changeDetectorRef.markForCheck());
    }
    // Note that we have to run outside of the `NgZone` explicitly,
    // in order to avoid throwing users into an infinite loop
    // if `zone-patch-rxjs` is included.
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.onStable.pipe(takeUntil(this._destroyed)).subscribe(() => {
        if (this._outlineGapCalculationNeededOnStable) {
          this.updateOutlineGap();
        }
      });
    });
    // Run change detection and update the outline if the suffix or prefix changes.
    merge(this._prefixChildren.changes, this._suffixChildren.changes).subscribe(() => {
      this._outlineGapCalculationNeededOnStable = true;
      this._changeDetectorRef.markForCheck();
    });
    // Re-validate when the number of hints changes.
    this._hintChildren.changes.pipe(startWith(null)).subscribe(() => {
      this._processHints();
      this._changeDetectorRef.markForCheck();
    });
    // Update the aria-described by when the number of errors changes.
    this._errorChildren.changes.pipe(startWith(null)).subscribe(() => {
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });
    if (this._dir) {
      this._dir.change.pipe(takeUntil(this._destroyed)).subscribe(() => {
        if (typeof requestAnimationFrame === 'function') {
          this._ngZone.runOutsideAngular(() => {
            requestAnimationFrame(() => this.updateOutlineGap());
          });
        } else {
          this.updateOutlineGap();
        }
      });
    }
  }
  ngAfterContentChecked() {
    this._validateControlChild();
    if (this._outlineGapCalculationNeededImmediately) {
      this.updateOutlineGap();
    }
  }
  ngAfterViewInit() {
    // Avoid animations on load.
    this._subscriptAnimationState = 'enter';
    this._changeDetectorRef.detectChanges();
  }
  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
  /**
   * Determines whether a class from the AbstractControlDirective
   * should be forwarded to the host element.
   */
  _shouldForward(prop) {
    const control = this._control ? this._control.ngControl : null;
    return control && control[prop];
  }
  _hasPlaceholder() {
    return !!((this._control && this._control.placeholder) || this._placeholderChild);
  }
  _hasLabel() {
    return !!(this._labelChildNonStatic || this._labelChildStatic);
  }
  _shouldLabelFloat() {
    return (
      this._canLabelFloat() &&
      ((this._control && this._control.shouldLabelFloat) || this._shouldAlwaysFloat())
    );
  }
  _hideControlPlaceholder() {
    // In the legacy appearance the placeholder is promoted to a label if no label is given.
    return (
      (this.appearance === 'legacy' && !this._hasLabel()) ||
      (this._hasLabel() && !this._shouldLabelFloat())
    );
  }
  _hasFloatingLabel() {
    // In the legacy appearance the placeholder is promoted to a label if no label is given.
    return this._hasLabel() || (this.appearance === 'legacy' && this._hasPlaceholder());
  }
  /** Determines whether to display hints or errors. */
  _getDisplayedMessages() {
    return this._errorChildren && this._errorChildren.length > 0 && this._control.errorState
      ? 'error'
      : 'hint';
  }
  /** Animates the placeholder up and locks it in position. */
  _animateAndLockLabel() {
    if (this._hasFloatingLabel() && this._canLabelFloat()) {
      // If animations are disabled, we shouldn't go in here,
      // because the `transitionend` will never fire.
      if (this._animationsEnabled && this._label) {
        this._showAlwaysAnimate = true;
        fromEvent(this._label.nativeElement, 'transitionend')
          .pipe(take(1))
          .subscribe(() => {
            this._showAlwaysAnimate = false;
          });
      }
      this.floatLabel = 'always';
      this._changeDetectorRef.markForCheck();
    }
  }
  /**
   * Ensure that there is only one placeholder (either `placeholder` attribute on the child control
   * or child element with the `tak-placeholder` directive).
   */
  _validatePlaceholders() {
    if (
      this._control.placeholder &&
      this._placeholderChild &&
      (typeof ngDevMode === 'undefined' || ngDevMode)
    ) {
      throw getTakFormFieldPlaceholderConflictError();
    }
  }
  /** Does any extra processing that is required when handling the hints. */
  _processHints() {
    this._validateHints();
    this._syncDescribedByIds();
  }
  /**
   * Ensure that there is a maximum of one of each `<tak-hint>` alignment specified, with the
   * attribute being considered as `align="start"`.
   */
  _validateHints() {
    if (this._hintChildren && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      let startHint;
      let endHint;
      this._hintChildren.forEach(hint => {
        if (hint.align === 'start') {
          if (startHint || this.hintLabel) {
            throw getTakFormFieldDuplicatedHintError('start');
          }
          startHint = hint;
        } else if (hint.align === 'end') {
          if (endHint) {
            throw getTakFormFieldDuplicatedHintError('end');
          }
          endHint = hint;
        }
      });
    }
  }
  /** Gets the default float label state. */
  _getDefaultFloatLabelState() {
    return (this._defaults && this._defaults.floatLabel) || 'auto';
  }
  /**
   * Sets the list of element IDs that describe the child control. This allows the control to update
   * its `aria-describedby` attribute accordingly.
   */
  _syncDescribedByIds() {
    if (this._control) {
      let ids = [];
      // TODO(wagnermaciel): Remove the type check when we find the root cause of this bug.
      if (
        this._control.userAriaDescribedBy &&
        typeof this._control.userAriaDescribedBy === 'string'
      ) {
        ids.push(...this._control.userAriaDescribedBy.split(' '));
      }
      if (this._getDisplayedMessages() === 'hint') {
        const startHint = this._hintChildren
          ? this._hintChildren.find(hint => hint.align === 'start')
          : null;
        const endHint = this._hintChildren
          ? this._hintChildren.find(hint => hint.align === 'end')
          : null;
        if (startHint) {
          ids.push(startHint.id);
        } else if (this._hintLabel) {
          ids.push(this._hintLabelId);
        }
        if (endHint) {
          ids.push(endHint.id);
        }
      } else if (this._errorChildren) {
        ids.push(...this._errorChildren.map(error => error.id));
      }
      this._control.setDescribedByIds(ids);
    }
  }
  /** Throws an error if the form field's control is missing. */
  _validateControlChild() {
    if (!this._control && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw getTakFormFieldMissingControlError();
    }
  }
  /**
   * Updates the width and position of the gap in the outline. Only relevant for the outline
   * appearance.
   */
  updateOutlineGap() {
    const labelEl = this._label ? this._label.nativeElement : null;
    const container = this._connectionContainerRef.nativeElement;
    const outlineStartSelector = '.tak-form-field-outline-start';
    const outlineGapSelector = '.tak-form-field-outline-gap';
    // getBoundingClientRect isn't available on the server.
    if (this.appearance !== 'outline' || !this._platform.isBrowser) {
      return;
    }
    // If there is no content, set the gap elements to zero.
    if (!labelEl || !labelEl.children.length || !labelEl.textContent.trim()) {
      const gapElements = container.querySelectorAll(
        `${outlineStartSelector}, ${outlineGapSelector}`
      );
      for (let i = 0; i < gapElements.length; i++) {
        gapElements[i].style.width = '0';
      }
      return;
    }
    // If the element is not present in the DOM, the outline gap will need to be calculated
    // the next time it is checked and in the DOM.
    if (!this._isAttachedToDOM()) {
      this._outlineGapCalculationNeededImmediately = true;
      return;
    }
    let startWidth = 0;
    let gapWidth = 0;
    const startEls = container.querySelectorAll(outlineStartSelector);
    const gapEls = container.querySelectorAll(outlineGapSelector);
    if (this._label && this._label.nativeElement.children.length) {
      const containerRect = container.getBoundingClientRect();
      // If the container's width and height are zero, it means that the element is
      // invisible and we can't calculate the outline gap. Mark the element as needing
      // to be checked the next time the zone stabilizes. We can't do this immediately
      // on the next change detection, because even if the element becomes visible,
      // the `ClientRect` won't be recalculated immediately. We reset the
      // `_outlineGapCalculationNeededImmediately` flag some we don't run the checks twice.
      if (containerRect.width === 0 && containerRect.height === 0) {
        this._outlineGapCalculationNeededOnStable = true;
        this._outlineGapCalculationNeededImmediately = false;
        return;
      }
      const containerStart = this._getStartEnd(containerRect);
      const labelChildren = labelEl.children;
      const labelStart = this._getStartEnd(labelChildren[0].getBoundingClientRect());
      let labelWidth = 0;
      for (let i = 0; i < labelChildren.length; i++) {
        labelWidth += labelChildren[i].offsetWidth;
      }
      startWidth = Math.abs(labelStart - containerStart) - outlineGapPadding;
      gapWidth = labelWidth > 0 ? labelWidth * floatingLabelScale + outlineGapPadding * 2 : 0;
    }
    for (let i = 0; i < startEls.length; i++) {
      startEls[i].style.width = `${startWidth}px`;
    }
    for (let i = 0; i < gapEls.length; i++) {
      gapEls[i].style.width = `${gapWidth}px`;
    }
    this._outlineGapCalculationNeededOnStable =
      this._outlineGapCalculationNeededImmediately = false;
  }
  /** Gets the start end of the rect considering the current directionality. */
  _getStartEnd(rect) {
    return this._dir && this._dir.value === 'rtl' ? rect.right : rect.left;
  }
  /** Checks whether the form field is attached to the DOM. */
  _isAttachedToDOM() {
    const element = this._elementRef.nativeElement;
    if (element.getRootNode) {
      const rootNode = element.getRootNode();
      // If the element is inside the DOM the root node will be either the document
      // or the closest shadow root, otherwise it'll be the element itself.
      return rootNode && rootNode !== element;
    }
    // Otherwise fall back to checking if it's in the document. This doesn't account for
    // shadow DOM, however browser that support shadow DOM should support `getRootNode` as well.
    return document.documentElement.contains(element);
  }
}
TakFormField.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakFormField,
  deps: [
    { token: i0.ElementRef },
    { token: i0.ChangeDetectorRef },
    { token: i1.Directionality, optional: true },
    { token: TAK_FORM_FIELD_DEFAULT_OPTIONS, optional: true },
    { token: i2.Platform },
    { token: i0.NgZone },
    { token: ANIMATION_MODULE_TYPE, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Component,
});
TakFormField.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakFormField,
  selector: 'tak-form-field',
  inputs: {
    color: 'color',
    appearance: 'appearance',
    hideRequiredMarker: 'hideRequiredMarker',
    hintLabel: 'hintLabel',
    floatLabel: 'floatLabel',
  },
  host: {
    properties: {
      'class.tak-form-field-appearance-standard': 'appearance == "standard"',
      'class.tak-form-field-appearance-fill': 'appearance == "fill"',
      'class.tak-form-field-appearance-outline': 'appearance == "outline"',
      'class.tak-form-field-appearance-legacy': 'appearance == "legacy"',
      'class.tak-form-field-invalid': '_control.errorState',
      'class.tak-form-field-can-float': '_canLabelFloat()',
      'class.tak-form-field-should-float': '_shouldLabelFloat()',
      'class.tak-form-field-has-label': '_hasFloatingLabel()',
      'class.tak-form-field-hide-placeholder': '_hideControlPlaceholder()',
      'class.tak-form-field-disabled': '_control.disabled',
      'class.tak-form-field-autofilled': '_control.autofilled',
      'class.tak-focused': '_control.focused',
      'class.ng-untouched': '_shouldForward("untouched")',
      'class.ng-touched': '_shouldForward("touched")',
      'class.ng-pristine': '_shouldForward("pristine")',
      'class.ng-dirty': '_shouldForward("dirty")',
      'class.ng-valid': '_shouldForward("valid")',
      'class.ng-invalid': '_shouldForward("invalid")',
      'class.ng-pending': '_shouldForward("pending")',
      'class._tak-animation-noopable': '!_animationsEnabled',
    },
    classAttribute: 'tak-form-field',
  },
  providers: [{ provide: TAK_FORM_FIELD, useExisting: TakFormField }],
  queries: [
    {
      propertyName: '_controlNonStatic',
      first: true,
      predicate: TakFormFieldControl,
      descendants: true,
    },
    {
      propertyName: '_controlStatic',
      first: true,
      predicate: TakFormFieldControl,
      descendants: true,
      static: true,
    },
    { propertyName: '_labelChildNonStatic', first: true, predicate: TakLabel, descendants: true },
    {
      propertyName: '_labelChildStatic',
      first: true,
      predicate: TakLabel,
      descendants: true,
      static: true,
    },
    {
      propertyName: '_placeholderChild',
      first: true,
      predicate: TakPlaceholder,
      descendants: true,
    },
    { propertyName: '_errorChildren', predicate: TAK_ERROR, descendants: true },
    { propertyName: '_hintChildren', predicate: _TAK_HINT, descendants: true },
    { propertyName: '_prefixChildren', predicate: TAK_PREFIX, descendants: true },
    { propertyName: '_suffixChildren', predicate: TAK_SUFFIX, descendants: true },
  ],
  viewQueries: [
    {
      propertyName: '_connectionContainerRef',
      first: true,
      predicate: ['connectionContainer'],
      descendants: true,
      static: true,
    },
    {
      propertyName: '_inputContainerRef',
      first: true,
      predicate: ['inputContainer'],
      descendants: true,
    },
    { propertyName: '_label', first: true, predicate: ['label'], descendants: true },
  ],
  exportAs: ['takFormField'],
  usesInheritance: true,
  ngImport: i0,
  template:
    '<div class="tak-form-field-wrapper">\n  <div class="tak-form-field-flex" #connectionContainer\n       (click)="_control.onContainerClick && _control.onContainerClick($event)">\n\n    <!-- Outline used for outline appearance. -->\n    <ng-container *ngIf="appearance == \'outline\'">\n      <div class="tak-form-field-outline">\n        <div class="tak-form-field-outline-start"></div>\n        <div class="tak-form-field-outline-gap"></div>\n        <div class="tak-form-field-outline-end"></div>\n      </div>\n      <div class="tak-form-field-outline tak-form-field-outline-thick">\n        <div class="tak-form-field-outline-start"></div>\n        <div class="tak-form-field-outline-gap"></div>\n        <div class="tak-form-field-outline-end"></div>\n      </div>\n    </ng-container>\n\n    <div\n      class="tak-form-field-prefix"\n      *ngIf="_prefixChildren.length"\n      (cdkObserveContent)="updateOutlineGap()"\n      [cdkObserveContentDisabled]="appearance != \'outline\'">\n      <ng-content select="[takPrefix]"></ng-content>\n    </div>\n\n    <div class="tak-form-field-infix" #inputContainer>\n      <ng-content></ng-content>\n\n      <span class="tak-form-field-label-wrapper">\n        <!-- We add aria-owns as a workaround for an issue in JAWS & NVDA where the label isn\'t\n             read if it comes before the control in the DOM. -->\n        <label class="tak-form-field-label"\n               (cdkObserveContent)="updateOutlineGap()"\n               [cdkObserveContentDisabled]="appearance != \'outline\'"\n               [id]="_labelId"\n               [attr.for]="_control.id"\n               [attr.aria-owns]="_control.id"\n               [class.tak-empty]="_control.empty && !_shouldAlwaysFloat()"\n               [class.tak-form-field-empty]="_control.empty && !_shouldAlwaysFloat()"\n               [class.tak-accent]="color == \'accent\'"\n               [class.tak-warn]="color == \'warn\'"\n               #label\n               *ngIf="_hasFloatingLabel()"\n               [ngSwitch]="_hasLabel()">\n\n          <!-- @breaking-change 8.0.0 remove in favor of tak-label element an placeholder attr. -->\n          <ng-container *ngSwitchCase="false">\n            <ng-content select="tak-placeholder"></ng-content>\n            <span>{{_control.placeholder}}</span>\n          </ng-container>\n\n          <ng-content select="tak-label" *ngSwitchCase="true"></ng-content>\n\n          <!-- @breaking-change 8.0.0 remove `tak-placeholder-required` class -->\n          <span\n            class="tak-placeholder-required tak-form-field-required-marker"\n            aria-hidden="true"\n            *ngIf="!hideRequiredMarker && _control.required && !_control.disabled">&#32;*</span>\n        </label>\n      </span>\n    </div>\n\n    <div class="tak-form-field-suffix" *ngIf="_suffixChildren.length">\n      <ng-content select="[takSuffix]"></ng-content>\n    </div>\n  </div>\n\n  <!-- Underline used for legacy, standard, and box appearances. -->\n  <div class="tak-form-field-underline"\n       *ngIf="appearance != \'outline\'">\n    <span class="tak-form-field-ripple"\n          [class.tak-accent]="color == \'accent\'"\n          [class.tak-warn]="color == \'warn\'"></span>\n  </div>\n\n  <div class="tak-form-field-subscript-wrapper"\n       [ngSwitch]="_getDisplayedMessages()">\n    <div *ngSwitchCase="\'error\'" [@transitionMessages]="_subscriptAnimationState">\n      <ng-content select="tak-error"></ng-content>\n    </div>\n\n    <div class="tak-form-field-hint-wrapper" *ngSwitchCase="\'hint\'"\n      [@transitionMessages]="_subscriptAnimationState">\n      <!-- TODO(mmalerba): use an actual <tak-hint> once all selectors are switched to tak-* -->\n      <div *ngIf="hintLabel" [id]="_hintLabelId" class="tak-hint">{{hintLabel}}</div>\n      <ng-content select="tak-hint:not([align=\'end\'])"></ng-content>\n      <div class="tak-form-field-hint-spacer"></div>\n      <ng-content select="tak-hint[align=\'end\']"></ng-content>\n    </div>\n  </div>\n</div>\n',
  styles: [
    '.tak-form-field{display:inline-block;position:relative;text-align:left}[dir=rtl] .tak-form-field{text-align:right}.tak-form-field-wrapper{position:relative}.tak-form-field-flex{display:inline-flex;align-items:baseline;box-sizing:border-box;width:100%}.tak-form-field-prefix,.tak-form-field-suffix{white-space:nowrap;flex:none;position:relative}.tak-form-field-infix{display:block;position:relative;flex:auto;min-width:0;width:180px}.cdk-high-contrast-active .tak-form-field-infix{border-image:linear-gradient(transparent, transparent)}.tak-form-field-label-wrapper{position:absolute;left:0;box-sizing:content-box;width:100%;height:100%;overflow:hidden;pointer-events:none}[dir=rtl] .tak-form-field-label-wrapper{left:auto;right:0}.tak-form-field-label{position:absolute;left:0;font:inherit;pointer-events:none;width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),width 400ms cubic-bezier(0.25, 0.8, 0.25, 1);display:none}[dir=rtl] .tak-form-field-label{transform-origin:100% 0;left:auto;right:0}.cdk-high-contrast-active .tak-form-field-disabled .tak-form-field-label{color:GrayText}.tak-form-field-empty.tak-form-field-label,.tak-form-field-can-float.tak-form-field-should-float .tak-form-field-label{display:block}.tak-form-field-autofill-control:-webkit-autofill+.tak-form-field-label-wrapper .tak-form-field-label{display:none}.tak-form-field-can-float .tak-form-field-autofill-control:-webkit-autofill+.tak-form-field-label-wrapper .tak-form-field-label{display:block;transition:none}.tak-input-server:focus+.tak-form-field-label-wrapper .tak-form-field-label,.tak-input-server[placeholder]:not(:placeholder-shown)+.tak-form-field-label-wrapper .tak-form-field-label{display:none}.tak-form-field-can-float .tak-input-server:focus+.tak-form-field-label-wrapper .tak-form-field-label,.tak-form-field-can-float .tak-input-server[placeholder]:not(:placeholder-shown)+.tak-form-field-label-wrapper .tak-form-field-label{display:block}.tak-form-field-label:not(.tak-form-field-empty){transition:none}.tak-form-field-underline{position:absolute;width:100%;pointer-events:none;transform:scale3d(1, 1.0001, 1)}.tak-form-field-ripple{position:absolute;left:0;width:100%;transform-origin:50%;transform:scaleX(0.5);opacity:0;transition:background-color 300ms cubic-bezier(0.55, 0, 0.55, 0.2)}.tak-form-field.tak-focused .tak-form-field-ripple,.tak-form-field.tak-form-field-invalid .tak-form-field-ripple{opacity:1;transform:none;transition:transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 300ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-form-field-subscript-wrapper{position:absolute;box-sizing:border-box;width:100%;overflow:hidden}.tak-form-field-subscript-wrapper .tak-icon,.tak-form-field-label-wrapper .tak-icon{width:1em;height:1em;font-size:inherit;vertical-align:baseline}.tak-form-field-hint-wrapper{display:flex}.tak-form-field-hint-spacer{flex:1 0 1em}.tak-error{display:block}.tak-form-field-control-wrapper{position:relative}.tak-form-field-hint-end{order:1}.tak-form-field._tak-animation-noopable .tak-form-field-label,.tak-form-field._tak-animation-noopable .tak-form-field-ripple{transition:none}',
    '.tak-form-field-appearance-fill .tak-form-field-flex{border-radius:4px 4px 0 0;padding:.75em .75em 0 .75em}.cdk-high-contrast-active .tak-form-field-appearance-fill .tak-form-field-flex{outline:solid 1px}.cdk-high-contrast-active .tak-form-field-appearance-fill.tak-form-field-disabled .tak-form-field-flex{outline-color:GrayText}.cdk-high-contrast-active .tak-form-field-appearance-fill.tak-focused .tak-form-field-flex{outline:dashed 3px}.tak-form-field-appearance-fill .tak-form-field-underline::before{content:"";display:block;position:absolute;bottom:0;height:1px;width:100%}.tak-form-field-appearance-fill .tak-form-field-ripple{bottom:0;height:2px}.cdk-high-contrast-active .tak-form-field-appearance-fill .tak-form-field-ripple{height:0}.tak-form-field-appearance-fill:not(.tak-form-field-disabled) .tak-form-field-flex:hover~.tak-form-field-underline .tak-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-form-field-appearance-fill._tak-animation-noopable:not(.tak-form-field-disabled) .tak-form-field-flex:hover~.tak-form-field-underline .tak-form-field-ripple{transition:none}.tak-form-field-appearance-fill .tak-form-field-subscript-wrapper{padding:0 1em}',
    '.tak-input-element{font:inherit;background:rgba(0,0,0,0);color:currentColor;border:none;outline:none;padding:0;margin:0;width:100%;max-width:100%;vertical-align:bottom;text-align:inherit;box-sizing:content-box}.tak-input-element:-moz-ui-invalid{box-shadow:none}.tak-input-element,.tak-input-element::-webkit-search-cancel-button,.tak-input-element::-webkit-search-decoration,.tak-input-element::-webkit-search-results-button,.tak-input-element::-webkit-search-results-decoration{-webkit-appearance:none}.tak-input-element::-webkit-contacts-auto-fill-button,.tak-input-element::-webkit-caps-lock-indicator,.tak-input-element:not([type=password])::-webkit-credentials-auto-fill-button{visibility:hidden}.tak-input-element[type=date],.tak-input-element[type=datetime],.tak-input-element[type=datetime-local],.tak-input-element[type=month],.tak-input-element[type=week],.tak-input-element[type=time]{line-height:1}.tak-input-element[type=date]::after,.tak-input-element[type=datetime]::after,.tak-input-element[type=datetime-local]::after,.tak-input-element[type=month]::after,.tak-input-element[type=week]::after,.tak-input-element[type=time]::after{content:" ";white-space:pre;width:1px}.tak-input-element::-webkit-inner-spin-button,.tak-input-element::-webkit-calendar-picker-indicator,.tak-input-element::-webkit-clear-button{font-size:.75em}.tak-input-element::placeholder{-webkit-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-input-element::-moz-placeholder{-webkit-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-input-element::-webkit-input-placeholder{-webkit-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-input-element:-ms-input-placeholder{-webkit-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-form-field-hide-placeholder .tak-input-element::placeholder{color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .tak-form-field-hide-placeholder .tak-input-element::placeholder{opacity:0}.tak-form-field-hide-placeholder .tak-input-element::-moz-placeholder{color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .tak-form-field-hide-placeholder .tak-input-element::-moz-placeholder{opacity:0}.tak-form-field-hide-placeholder .tak-input-element::-webkit-input-placeholder{color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .tak-form-field-hide-placeholder .tak-input-element::-webkit-input-placeholder{opacity:0}.tak-form-field-hide-placeholder .tak-input-element:-ms-input-placeholder{color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .tak-form-field-hide-placeholder .tak-input-element:-ms-input-placeholder{opacity:0}._tak-animation-noopable .tak-input-element::placeholder{transition:none}._tak-animation-noopable .tak-input-element::-moz-placeholder{transition:none}._tak-animation-noopable .tak-input-element::-webkit-input-placeholder{transition:none}._tak-animation-noopable .tak-input-element:-ms-input-placeholder{transition:none}textarea.tak-input-element{resize:vertical;overflow:auto}textarea.tak-input-element.cdk-textarea-autosize{resize:none}textarea.tak-input-element{padding:2px 0;margin:-2px 0}select.tak-input-element{-moz-appearance:none;-webkit-appearance:none;position:relative;background-color:rgba(0,0,0,0);display:inline-flex;box-sizing:border-box;padding-top:1em;top:-1em;margin-bottom:-1em}select.tak-input-element::-moz-focus-inner{border:0}select.tak-input-element:not(:disabled){cursor:pointer}.tak-form-field-type-tak-native-select .tak-form-field-infix::after{content:"";width:0;height:0;border-left:5px solid rgba(0,0,0,0);border-right:5px solid rgba(0,0,0,0);border-top:5px solid;position:absolute;top:50%;right:0;margin-top:-2.5px;pointer-events:none}[dir=rtl] .tak-form-field-type-tak-native-select .tak-form-field-infix::after{right:auto;left:0}.tak-form-field-type-tak-native-select .tak-input-element{padding-right:15px}[dir=rtl] .tak-form-field-type-tak-native-select .tak-input-element{padding-right:0;padding-left:15px}.tak-form-field-type-tak-native-select .tak-form-field-label-wrapper{max-width:calc(100% - 10px)}.tak-form-field-type-tak-native-select.tak-form-field-appearance-outline .tak-form-field-infix::after{margin-top:-5px}.tak-form-field-type-tak-native-select.tak-form-field-appearance-fill .tak-form-field-infix::after{margin-top:-10px}',
    '.tak-form-field-appearance-legacy .tak-form-field-label{transform:perspective(100px)}.tak-form-field-appearance-legacy .tak-form-field-prefix .tak-icon,.tak-form-field-appearance-legacy .tak-form-field-suffix .tak-icon{width:1em}.tak-form-field-appearance-legacy .tak-form-field-prefix .tak-icon-button,.tak-form-field-appearance-legacy .tak-form-field-suffix .tak-icon-button{font:inherit;vertical-align:baseline}.tak-form-field-appearance-legacy .tak-form-field-prefix .tak-icon-button .tak-icon,.tak-form-field-appearance-legacy .tak-form-field-suffix .tak-icon-button .tak-icon{font-size:inherit}.tak-form-field-appearance-legacy .tak-form-field-underline{height:1px}.cdk-high-contrast-active .tak-form-field-appearance-legacy .tak-form-field-underline{height:0;border-top:solid 1px}.tak-form-field-appearance-legacy .tak-form-field-ripple{top:0;height:2px;overflow:hidden}.cdk-high-contrast-active .tak-form-field-appearance-legacy .tak-form-field-ripple{height:0;border-top:solid 2px}.tak-form-field-appearance-legacy.tak-form-field-disabled .tak-form-field-underline{background-position:0;background-color:rgba(0,0,0,0)}.cdk-high-contrast-active .tak-form-field-appearance-legacy.tak-form-field-disabled .tak-form-field-underline{border-top-style:dotted;border-top-width:2px;border-top-color:GrayText}.tak-form-field-appearance-legacy.tak-form-field-invalid:not(.tak-focused) .tak-form-field-ripple{height:1px}',
    '.tak-form-field-appearance-outline .tak-form-field-wrapper{margin:.25em 0}.tak-form-field-appearance-outline .tak-form-field-flex{padding:0 .75em 0 .75em;margin-top:-0.25em;position:relative}.tak-form-field-appearance-outline .tak-form-field-prefix,.tak-form-field-appearance-outline .tak-form-field-suffix{top:.25em}.tak-form-field-appearance-outline .tak-form-field-outline{display:flex;position:absolute;top:.25em;left:0;right:0;bottom:0;pointer-events:none}.tak-form-field-appearance-outline .tak-form-field-outline-start,.tak-form-field-appearance-outline .tak-form-field-outline-end{border:1px solid currentColor;min-width:5px}.tak-form-field-appearance-outline .tak-form-field-outline-start{border-radius:5px 0 0 5px;border-right-style:none}[dir=rtl] .tak-form-field-appearance-outline .tak-form-field-outline-start{border-right-style:solid;border-left-style:none;border-radius:0 5px 5px 0}.tak-form-field-appearance-outline .tak-form-field-outline-end{border-radius:0 5px 5px 0;border-left-style:none;flex-grow:1}[dir=rtl] .tak-form-field-appearance-outline .tak-form-field-outline-end{border-left-style:solid;border-right-style:none;border-radius:5px 0 0 5px}.tak-form-field-appearance-outline .tak-form-field-outline-gap{border-radius:.000001px;border:1px solid currentColor;border-left-style:none;border-right-style:none}.tak-form-field-appearance-outline.tak-form-field-can-float.tak-form-field-should-float .tak-form-field-outline-gap{border-top-color:rgba(0,0,0,0)}.tak-form-field-appearance-outline .tak-form-field-outline-thick{opacity:0}.tak-form-field-appearance-outline .tak-form-field-outline-thick .tak-form-field-outline-start,.tak-form-field-appearance-outline .tak-form-field-outline-thick .tak-form-field-outline-end,.tak-form-field-appearance-outline .tak-form-field-outline-thick .tak-form-field-outline-gap{border-width:2px}.tak-form-field-appearance-outline.tak-focused .tak-form-field-outline,.tak-form-field-appearance-outline.tak-form-field-invalid .tak-form-field-outline{opacity:0;transition:opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-form-field-appearance-outline.tak-focused .tak-form-field-outline-thick,.tak-form-field-appearance-outline.tak-form-field-invalid .tak-form-field-outline-thick{opacity:1}.cdk-high-contrast-active .tak-form-field-appearance-outline.tak-focused .tak-form-field-outline-thick{border:3px dashed}.tak-form-field-appearance-outline:not(.tak-form-field-disabled) .tak-form-field-flex:hover .tak-form-field-outline{opacity:0;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-form-field-appearance-outline:not(.tak-form-field-disabled) .tak-form-field-flex:hover .tak-form-field-outline-thick{opacity:1}.tak-form-field-appearance-outline .tak-form-field-subscript-wrapper{padding:0 1em}.cdk-high-contrast-active .tak-form-field-appearance-outline.tak-form-field-disabled .tak-form-field-outline{color:GrayText}.tak-form-field-appearance-outline._tak-animation-noopable:not(.tak-form-field-disabled) .tak-form-field-flex:hover~.tak-form-field-outline,.tak-form-field-appearance-outline._tak-animation-noopable .tak-form-field-outline,.tak-form-field-appearance-outline._tak-animation-noopable .tak-form-field-outline-start,.tak-form-field-appearance-outline._tak-animation-noopable .tak-form-field-outline-end,.tak-form-field-appearance-outline._tak-animation-noopable .tak-form-field-outline-gap{transition:none}',
    '.tak-form-field-appearance-standard .tak-form-field-flex{padding-top:.75em}.tak-form-field-appearance-standard .tak-form-field-underline{height:1px}.cdk-high-contrast-active .tak-form-field-appearance-standard .tak-form-field-underline{height:0;border-top:solid 1px}.tak-form-field-appearance-standard .tak-form-field-ripple{bottom:0;height:2px}.cdk-high-contrast-active .tak-form-field-appearance-standard .tak-form-field-ripple{height:0;border-top:solid 2px}.tak-form-field-appearance-standard.tak-form-field-disabled .tak-form-field-underline{background-position:0;background-color:rgba(0,0,0,0)}.cdk-high-contrast-active .tak-form-field-appearance-standard.tak-form-field-disabled .tak-form-field-underline{border-top-style:dotted;border-top-width:2px}.tak-form-field-appearance-standard:not(.tak-form-field-disabled) .tak-form-field-flex:hover~.tak-form-field-underline .tak-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-form-field-appearance-standard._tak-animation-noopable:not(.tak-form-field-disabled) .tak-form-field-flex:hover~.tak-form-field-underline .tak-form-field-ripple{transition:none}',
  ],
  dependencies: [
    {
      kind: 'directive',
      type: i3.NgIf,
      selector: '[ngIf]',
      inputs: ['ngIf', 'ngIfThen', 'ngIfElse'],
    },
    { kind: 'directive', type: i3.NgSwitch, selector: '[ngSwitch]', inputs: ['ngSwitch'] },
    {
      kind: 'directive',
      type: i3.NgSwitchCase,
      selector: '[ngSwitchCase]',
      inputs: ['ngSwitchCase'],
    },
    {
      kind: 'directive',
      type: i4.CdkObserveContent,
      selector: '[cdkObserveContent]',
      inputs: ['cdkObserveContentDisabled', 'debounce'],
      outputs: ['cdkObserveContent'],
      exportAs: ['cdkObserveContent'],
    },
  ],
  animations: [takFormFieldAnimations.transitionMessages],
  changeDetection: i0.ChangeDetectionStrategy.OnPush,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakFormField,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'tak-form-field',
          exportAs: 'takFormField',
          animations: [takFormFieldAnimations.transitionMessages],
          host: {
            class: 'tak-form-field',
            '[class.tak-form-field-appearance-standard]': 'appearance == "standard"',
            '[class.tak-form-field-appearance-fill]': 'appearance == "fill"',
            '[class.tak-form-field-appearance-outline]': 'appearance == "outline"',
            '[class.tak-form-field-appearance-legacy]': 'appearance == "legacy"',
            '[class.tak-form-field-invalid]': '_control.errorState',
            '[class.tak-form-field-can-float]': '_canLabelFloat()',
            '[class.tak-form-field-should-float]': '_shouldLabelFloat()',
            '[class.tak-form-field-has-label]': '_hasFloatingLabel()',
            '[class.tak-form-field-hide-placeholder]': '_hideControlPlaceholder()',
            '[class.tak-form-field-disabled]': '_control.disabled',
            '[class.tak-form-field-autofilled]': '_control.autofilled',
            '[class.tak-focused]': '_control.focused',
            '[class.ng-untouched]': '_shouldForward("untouched")',
            '[class.ng-touched]': '_shouldForward("touched")',
            '[class.ng-pristine]': '_shouldForward("pristine")',
            '[class.ng-dirty]': '_shouldForward("dirty")',
            '[class.ng-valid]': '_shouldForward("valid")',
            '[class.ng-invalid]': '_shouldForward("invalid")',
            '[class.ng-pending]': '_shouldForward("pending")',
            '[class._tak-animation-noopable]': '!_animationsEnabled',
          },
          inputs: ['color'],
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          providers: [{ provide: TAK_FORM_FIELD, useExisting: TakFormField }],
          template:
            '<div class="tak-form-field-wrapper">\n  <div class="tak-form-field-flex" #connectionContainer\n       (click)="_control.onContainerClick && _control.onContainerClick($event)">\n\n    <!-- Outline used for outline appearance. -->\n    <ng-container *ngIf="appearance == \'outline\'">\n      <div class="tak-form-field-outline">\n        <div class="tak-form-field-outline-start"></div>\n        <div class="tak-form-field-outline-gap"></div>\n        <div class="tak-form-field-outline-end"></div>\n      </div>\n      <div class="tak-form-field-outline tak-form-field-outline-thick">\n        <div class="tak-form-field-outline-start"></div>\n        <div class="tak-form-field-outline-gap"></div>\n        <div class="tak-form-field-outline-end"></div>\n      </div>\n    </ng-container>\n\n    <div\n      class="tak-form-field-prefix"\n      *ngIf="_prefixChildren.length"\n      (cdkObserveContent)="updateOutlineGap()"\n      [cdkObserveContentDisabled]="appearance != \'outline\'">\n      <ng-content select="[takPrefix]"></ng-content>\n    </div>\n\n    <div class="tak-form-field-infix" #inputContainer>\n      <ng-content></ng-content>\n\n      <span class="tak-form-field-label-wrapper">\n        <!-- We add aria-owns as a workaround for an issue in JAWS & NVDA where the label isn\'t\n             read if it comes before the control in the DOM. -->\n        <label class="tak-form-field-label"\n               (cdkObserveContent)="updateOutlineGap()"\n               [cdkObserveContentDisabled]="appearance != \'outline\'"\n               [id]="_labelId"\n               [attr.for]="_control.id"\n               [attr.aria-owns]="_control.id"\n               [class.tak-empty]="_control.empty && !_shouldAlwaysFloat()"\n               [class.tak-form-field-empty]="_control.empty && !_shouldAlwaysFloat()"\n               [class.tak-accent]="color == \'accent\'"\n               [class.tak-warn]="color == \'warn\'"\n               #label\n               *ngIf="_hasFloatingLabel()"\n               [ngSwitch]="_hasLabel()">\n\n          <!-- @breaking-change 8.0.0 remove in favor of tak-label element an placeholder attr. -->\n          <ng-container *ngSwitchCase="false">\n            <ng-content select="tak-placeholder"></ng-content>\n            <span>{{_control.placeholder}}</span>\n          </ng-container>\n\n          <ng-content select="tak-label" *ngSwitchCase="true"></ng-content>\n\n          <!-- @breaking-change 8.0.0 remove `tak-placeholder-required` class -->\n          <span\n            class="tak-placeholder-required tak-form-field-required-marker"\n            aria-hidden="true"\n            *ngIf="!hideRequiredMarker && _control.required && !_control.disabled">&#32;*</span>\n        </label>\n      </span>\n    </div>\n\n    <div class="tak-form-field-suffix" *ngIf="_suffixChildren.length">\n      <ng-content select="[takSuffix]"></ng-content>\n    </div>\n  </div>\n\n  <!-- Underline used for legacy, standard, and box appearances. -->\n  <div class="tak-form-field-underline"\n       *ngIf="appearance != \'outline\'">\n    <span class="tak-form-field-ripple"\n          [class.tak-accent]="color == \'accent\'"\n          [class.tak-warn]="color == \'warn\'"></span>\n  </div>\n\n  <div class="tak-form-field-subscript-wrapper"\n       [ngSwitch]="_getDisplayedMessages()">\n    <div *ngSwitchCase="\'error\'" [@transitionMessages]="_subscriptAnimationState">\n      <ng-content select="tak-error"></ng-content>\n    </div>\n\n    <div class="tak-form-field-hint-wrapper" *ngSwitchCase="\'hint\'"\n      [@transitionMessages]="_subscriptAnimationState">\n      <!-- TODO(mmalerba): use an actual <tak-hint> once all selectors are switched to tak-* -->\n      <div *ngIf="hintLabel" [id]="_hintLabelId" class="tak-hint">{{hintLabel}}</div>\n      <ng-content select="tak-hint:not([align=\'end\'])"></ng-content>\n      <div class="tak-form-field-hint-spacer"></div>\n      <ng-content select="tak-hint[align=\'end\']"></ng-content>\n    </div>\n  </div>\n</div>\n',
          styles: [
            '.tak-form-field{display:inline-block;position:relative;text-align:left}[dir=rtl] .tak-form-field{text-align:right}.tak-form-field-wrapper{position:relative}.tak-form-field-flex{display:inline-flex;align-items:baseline;box-sizing:border-box;width:100%}.tak-form-field-prefix,.tak-form-field-suffix{white-space:nowrap;flex:none;position:relative}.tak-form-field-infix{display:block;position:relative;flex:auto;min-width:0;width:180px}.cdk-high-contrast-active .tak-form-field-infix{border-image:linear-gradient(transparent, transparent)}.tak-form-field-label-wrapper{position:absolute;left:0;box-sizing:content-box;width:100%;height:100%;overflow:hidden;pointer-events:none}[dir=rtl] .tak-form-field-label-wrapper{left:auto;right:0}.tak-form-field-label{position:absolute;left:0;font:inherit;pointer-events:none;width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),width 400ms cubic-bezier(0.25, 0.8, 0.25, 1);display:none}[dir=rtl] .tak-form-field-label{transform-origin:100% 0;left:auto;right:0}.cdk-high-contrast-active .tak-form-field-disabled .tak-form-field-label{color:GrayText}.tak-form-field-empty.tak-form-field-label,.tak-form-field-can-float.tak-form-field-should-float .tak-form-field-label{display:block}.tak-form-field-autofill-control:-webkit-autofill+.tak-form-field-label-wrapper .tak-form-field-label{display:none}.tak-form-field-can-float .tak-form-field-autofill-control:-webkit-autofill+.tak-form-field-label-wrapper .tak-form-field-label{display:block;transition:none}.tak-input-server:focus+.tak-form-field-label-wrapper .tak-form-field-label,.tak-input-server[placeholder]:not(:placeholder-shown)+.tak-form-field-label-wrapper .tak-form-field-label{display:none}.tak-form-field-can-float .tak-input-server:focus+.tak-form-field-label-wrapper .tak-form-field-label,.tak-form-field-can-float .tak-input-server[placeholder]:not(:placeholder-shown)+.tak-form-field-label-wrapper .tak-form-field-label{display:block}.tak-form-field-label:not(.tak-form-field-empty){transition:none}.tak-form-field-underline{position:absolute;width:100%;pointer-events:none;transform:scale3d(1, 1.0001, 1)}.tak-form-field-ripple{position:absolute;left:0;width:100%;transform-origin:50%;transform:scaleX(0.5);opacity:0;transition:background-color 300ms cubic-bezier(0.55, 0, 0.55, 0.2)}.tak-form-field.tak-focused .tak-form-field-ripple,.tak-form-field.tak-form-field-invalid .tak-form-field-ripple{opacity:1;transform:none;transition:transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 300ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-form-field-subscript-wrapper{position:absolute;box-sizing:border-box;width:100%;overflow:hidden}.tak-form-field-subscript-wrapper .tak-icon,.tak-form-field-label-wrapper .tak-icon{width:1em;height:1em;font-size:inherit;vertical-align:baseline}.tak-form-field-hint-wrapper{display:flex}.tak-form-field-hint-spacer{flex:1 0 1em}.tak-error{display:block}.tak-form-field-control-wrapper{position:relative}.tak-form-field-hint-end{order:1}.tak-form-field._tak-animation-noopable .tak-form-field-label,.tak-form-field._tak-animation-noopable .tak-form-field-ripple{transition:none}',
            '.tak-form-field-appearance-fill .tak-form-field-flex{border-radius:4px 4px 0 0;padding:.75em .75em 0 .75em}.cdk-high-contrast-active .tak-form-field-appearance-fill .tak-form-field-flex{outline:solid 1px}.cdk-high-contrast-active .tak-form-field-appearance-fill.tak-form-field-disabled .tak-form-field-flex{outline-color:GrayText}.cdk-high-contrast-active .tak-form-field-appearance-fill.tak-focused .tak-form-field-flex{outline:dashed 3px}.tak-form-field-appearance-fill .tak-form-field-underline::before{content:"";display:block;position:absolute;bottom:0;height:1px;width:100%}.tak-form-field-appearance-fill .tak-form-field-ripple{bottom:0;height:2px}.cdk-high-contrast-active .tak-form-field-appearance-fill .tak-form-field-ripple{height:0}.tak-form-field-appearance-fill:not(.tak-form-field-disabled) .tak-form-field-flex:hover~.tak-form-field-underline .tak-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-form-field-appearance-fill._tak-animation-noopable:not(.tak-form-field-disabled) .tak-form-field-flex:hover~.tak-form-field-underline .tak-form-field-ripple{transition:none}.tak-form-field-appearance-fill .tak-form-field-subscript-wrapper{padding:0 1em}',
            '.tak-input-element{font:inherit;background:rgba(0,0,0,0);color:currentColor;border:none;outline:none;padding:0;margin:0;width:100%;max-width:100%;vertical-align:bottom;text-align:inherit;box-sizing:content-box}.tak-input-element:-moz-ui-invalid{box-shadow:none}.tak-input-element,.tak-input-element::-webkit-search-cancel-button,.tak-input-element::-webkit-search-decoration,.tak-input-element::-webkit-search-results-button,.tak-input-element::-webkit-search-results-decoration{-webkit-appearance:none}.tak-input-element::-webkit-contacts-auto-fill-button,.tak-input-element::-webkit-caps-lock-indicator,.tak-input-element:not([type=password])::-webkit-credentials-auto-fill-button{visibility:hidden}.tak-input-element[type=date],.tak-input-element[type=datetime],.tak-input-element[type=datetime-local],.tak-input-element[type=month],.tak-input-element[type=week],.tak-input-element[type=time]{line-height:1}.tak-input-element[type=date]::after,.tak-input-element[type=datetime]::after,.tak-input-element[type=datetime-local]::after,.tak-input-element[type=month]::after,.tak-input-element[type=week]::after,.tak-input-element[type=time]::after{content:" ";white-space:pre;width:1px}.tak-input-element::-webkit-inner-spin-button,.tak-input-element::-webkit-calendar-picker-indicator,.tak-input-element::-webkit-clear-button{font-size:.75em}.tak-input-element::placeholder{-webkit-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-input-element::-moz-placeholder{-webkit-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-input-element::-webkit-input-placeholder{-webkit-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-input-element:-ms-input-placeholder{-webkit-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-form-field-hide-placeholder .tak-input-element::placeholder{color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .tak-form-field-hide-placeholder .tak-input-element::placeholder{opacity:0}.tak-form-field-hide-placeholder .tak-input-element::-moz-placeholder{color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .tak-form-field-hide-placeholder .tak-input-element::-moz-placeholder{opacity:0}.tak-form-field-hide-placeholder .tak-input-element::-webkit-input-placeholder{color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .tak-form-field-hide-placeholder .tak-input-element::-webkit-input-placeholder{opacity:0}.tak-form-field-hide-placeholder .tak-input-element:-ms-input-placeholder{color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}.cdk-high-contrast-active .tak-form-field-hide-placeholder .tak-input-element:-ms-input-placeholder{opacity:0}._tak-animation-noopable .tak-input-element::placeholder{transition:none}._tak-animation-noopable .tak-input-element::-moz-placeholder{transition:none}._tak-animation-noopable .tak-input-element::-webkit-input-placeholder{transition:none}._tak-animation-noopable .tak-input-element:-ms-input-placeholder{transition:none}textarea.tak-input-element{resize:vertical;overflow:auto}textarea.tak-input-element.cdk-textarea-autosize{resize:none}textarea.tak-input-element{padding:2px 0;margin:-2px 0}select.tak-input-element{-moz-appearance:none;-webkit-appearance:none;position:relative;background-color:rgba(0,0,0,0);display:inline-flex;box-sizing:border-box;padding-top:1em;top:-1em;margin-bottom:-1em}select.tak-input-element::-moz-focus-inner{border:0}select.tak-input-element:not(:disabled){cursor:pointer}.tak-form-field-type-tak-native-select .tak-form-field-infix::after{content:"";width:0;height:0;border-left:5px solid rgba(0,0,0,0);border-right:5px solid rgba(0,0,0,0);border-top:5px solid;position:absolute;top:50%;right:0;margin-top:-2.5px;pointer-events:none}[dir=rtl] .tak-form-field-type-tak-native-select .tak-form-field-infix::after{right:auto;left:0}.tak-form-field-type-tak-native-select .tak-input-element{padding-right:15px}[dir=rtl] .tak-form-field-type-tak-native-select .tak-input-element{padding-right:0;padding-left:15px}.tak-form-field-type-tak-native-select .tak-form-field-label-wrapper{max-width:calc(100% - 10px)}.tak-form-field-type-tak-native-select.tak-form-field-appearance-outline .tak-form-field-infix::after{margin-top:-5px}.tak-form-field-type-tak-native-select.tak-form-field-appearance-fill .tak-form-field-infix::after{margin-top:-10px}',
            '.tak-form-field-appearance-legacy .tak-form-field-label{transform:perspective(100px)}.tak-form-field-appearance-legacy .tak-form-field-prefix .tak-icon,.tak-form-field-appearance-legacy .tak-form-field-suffix .tak-icon{width:1em}.tak-form-field-appearance-legacy .tak-form-field-prefix .tak-icon-button,.tak-form-field-appearance-legacy .tak-form-field-suffix .tak-icon-button{font:inherit;vertical-align:baseline}.tak-form-field-appearance-legacy .tak-form-field-prefix .tak-icon-button .tak-icon,.tak-form-field-appearance-legacy .tak-form-field-suffix .tak-icon-button .tak-icon{font-size:inherit}.tak-form-field-appearance-legacy .tak-form-field-underline{height:1px}.cdk-high-contrast-active .tak-form-field-appearance-legacy .tak-form-field-underline{height:0;border-top:solid 1px}.tak-form-field-appearance-legacy .tak-form-field-ripple{top:0;height:2px;overflow:hidden}.cdk-high-contrast-active .tak-form-field-appearance-legacy .tak-form-field-ripple{height:0;border-top:solid 2px}.tak-form-field-appearance-legacy.tak-form-field-disabled .tak-form-field-underline{background-position:0;background-color:rgba(0,0,0,0)}.cdk-high-contrast-active .tak-form-field-appearance-legacy.tak-form-field-disabled .tak-form-field-underline{border-top-style:dotted;border-top-width:2px;border-top-color:GrayText}.tak-form-field-appearance-legacy.tak-form-field-invalid:not(.tak-focused) .tak-form-field-ripple{height:1px}',
            '.tak-form-field-appearance-outline .tak-form-field-wrapper{margin:.25em 0}.tak-form-field-appearance-outline .tak-form-field-flex{padding:0 .75em 0 .75em;margin-top:-0.25em;position:relative}.tak-form-field-appearance-outline .tak-form-field-prefix,.tak-form-field-appearance-outline .tak-form-field-suffix{top:.25em}.tak-form-field-appearance-outline .tak-form-field-outline{display:flex;position:absolute;top:.25em;left:0;right:0;bottom:0;pointer-events:none}.tak-form-field-appearance-outline .tak-form-field-outline-start,.tak-form-field-appearance-outline .tak-form-field-outline-end{border:1px solid currentColor;min-width:5px}.tak-form-field-appearance-outline .tak-form-field-outline-start{border-radius:5px 0 0 5px;border-right-style:none}[dir=rtl] .tak-form-field-appearance-outline .tak-form-field-outline-start{border-right-style:solid;border-left-style:none;border-radius:0 5px 5px 0}.tak-form-field-appearance-outline .tak-form-field-outline-end{border-radius:0 5px 5px 0;border-left-style:none;flex-grow:1}[dir=rtl] .tak-form-field-appearance-outline .tak-form-field-outline-end{border-left-style:solid;border-right-style:none;border-radius:5px 0 0 5px}.tak-form-field-appearance-outline .tak-form-field-outline-gap{border-radius:.000001px;border:1px solid currentColor;border-left-style:none;border-right-style:none}.tak-form-field-appearance-outline.tak-form-field-can-float.tak-form-field-should-float .tak-form-field-outline-gap{border-top-color:rgba(0,0,0,0)}.tak-form-field-appearance-outline .tak-form-field-outline-thick{opacity:0}.tak-form-field-appearance-outline .tak-form-field-outline-thick .tak-form-field-outline-start,.tak-form-field-appearance-outline .tak-form-field-outline-thick .tak-form-field-outline-end,.tak-form-field-appearance-outline .tak-form-field-outline-thick .tak-form-field-outline-gap{border-width:2px}.tak-form-field-appearance-outline.tak-focused .tak-form-field-outline,.tak-form-field-appearance-outline.tak-form-field-invalid .tak-form-field-outline{opacity:0;transition:opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-form-field-appearance-outline.tak-focused .tak-form-field-outline-thick,.tak-form-field-appearance-outline.tak-form-field-invalid .tak-form-field-outline-thick{opacity:1}.cdk-high-contrast-active .tak-form-field-appearance-outline.tak-focused .tak-form-field-outline-thick{border:3px dashed}.tak-form-field-appearance-outline:not(.tak-form-field-disabled) .tak-form-field-flex:hover .tak-form-field-outline{opacity:0;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-form-field-appearance-outline:not(.tak-form-field-disabled) .tak-form-field-flex:hover .tak-form-field-outline-thick{opacity:1}.tak-form-field-appearance-outline .tak-form-field-subscript-wrapper{padding:0 1em}.cdk-high-contrast-active .tak-form-field-appearance-outline.tak-form-field-disabled .tak-form-field-outline{color:GrayText}.tak-form-field-appearance-outline._tak-animation-noopable:not(.tak-form-field-disabled) .tak-form-field-flex:hover~.tak-form-field-outline,.tak-form-field-appearance-outline._tak-animation-noopable .tak-form-field-outline,.tak-form-field-appearance-outline._tak-animation-noopable .tak-form-field-outline-start,.tak-form-field-appearance-outline._tak-animation-noopable .tak-form-field-outline-end,.tak-form-field-appearance-outline._tak-animation-noopable .tak-form-field-outline-gap{transition:none}',
            '.tak-form-field-appearance-standard .tak-form-field-flex{padding-top:.75em}.tak-form-field-appearance-standard .tak-form-field-underline{height:1px}.cdk-high-contrast-active .tak-form-field-appearance-standard .tak-form-field-underline{height:0;border-top:solid 1px}.tak-form-field-appearance-standard .tak-form-field-ripple{bottom:0;height:2px}.cdk-high-contrast-active .tak-form-field-appearance-standard .tak-form-field-ripple{height:0;border-top:solid 2px}.tak-form-field-appearance-standard.tak-form-field-disabled .tak-form-field-underline{background-position:0;background-color:rgba(0,0,0,0)}.cdk-high-contrast-active .tak-form-field-appearance-standard.tak-form-field-disabled .tak-form-field-underline{border-top-style:dotted;border-top-width:2px}.tak-form-field-appearance-standard:not(.tak-form-field-disabled) .tak-form-field-flex:hover~.tak-form-field-underline .tak-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.tak-form-field-appearance-standard._tak-animation-noopable:not(.tak-form-field-disabled) .tak-form-field-flex:hover~.tak-form-field-underline .tak-form-field-ripple{transition:none}',
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.ElementRef },
      { type: i0.ChangeDetectorRef },
      {
        type: i1.Directionality,
        decorators: [
          {
            type: Optional,
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
            args: [TAK_FORM_FIELD_DEFAULT_OPTIONS],
          },
        ],
      },
      { type: i2.Platform },
      { type: i0.NgZone },
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
    appearance: [
      {
        type: Input,
      },
    ],
    hideRequiredMarker: [
      {
        type: Input,
      },
    ],
    hintLabel: [
      {
        type: Input,
      },
    ],
    floatLabel: [
      {
        type: Input,
      },
    ],
    _connectionContainerRef: [
      {
        type: ViewChild,
        args: ['connectionContainer', { static: true }],
      },
    ],
    _inputContainerRef: [
      {
        type: ViewChild,
        args: ['inputContainer'],
      },
    ],
    _label: [
      {
        type: ViewChild,
        args: ['label'],
      },
    ],
    _controlNonStatic: [
      {
        type: ContentChild,
        args: [TakFormFieldControl],
      },
    ],
    _controlStatic: [
      {
        type: ContentChild,
        args: [TakFormFieldControl, { static: true }],
      },
    ],
    _labelChildNonStatic: [
      {
        type: ContentChild,
        args: [TakLabel],
      },
    ],
    _labelChildStatic: [
      {
        type: ContentChild,
        args: [TakLabel, { static: true }],
      },
    ],
    _placeholderChild: [
      {
        type: ContentChild,
        args: [TakPlaceholder],
      },
    ],
    _errorChildren: [
      {
        type: ContentChildren,
        args: [TAK_ERROR, { descendants: true }],
      },
    ],
    _hintChildren: [
      {
        type: ContentChildren,
        args: [_TAK_HINT, { descendants: true }],
      },
    ],
    _prefixChildren: [
      {
        type: ContentChildren,
        args: [TAK_PREFIX, { descendants: true }],
      },
    ],
    _suffixChildren: [
      {
        type: ContentChildren,
        args: [TAK_SUFFIX, { descendants: true }],
      },
    ],
  },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2Zvcm0tZmllbGQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9mb3JtLWZpZWxkLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFJTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBQ04sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBRWxCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBVyxVQUFVLEVBQWUsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRSxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUQsT0FBTyxFQUFDLFNBQVMsRUFBVyxNQUFNLFNBQVMsQ0FBQztBQUM1QyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RCxPQUFPLEVBQ0wsa0NBQWtDLEVBQ2xDLGtDQUFrQyxFQUNsQyx1Q0FBdUMsR0FDeEMsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQUMsU0FBUyxFQUFVLE1BQU0sUUFBUSxDQUFDO0FB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LEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2dCQUNuQixrQkFBa0I7c0JBQTlDLFNBQVM7dUJBQUMsZ0JBQWdCO2dCQUNDLE1BQU07c0JBQWpDLFNBQVM7dUJBQUMsT0FBTztnQkFFaUIsaUJBQWlCO3NCQUFuRCxZQUFZO3VCQUFDLG1CQUFtQjtnQkFDa0IsY0FBYztzQkFBaEUsWUFBWTt1QkFBQyxtQkFBbUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7Z0JBV3pCLG9CQUFvQjtzQkFBM0MsWUFBWTt1QkFBQyxRQUFRO2dCQUNrQixpQkFBaUI7c0JBQXhELFlBQVk7dUJBQUMsUUFBUSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztnQkFDUixpQkFBaUI7c0JBQTlDLFlBQVk7dUJBQUMsY0FBYztnQkFFcUIsY0FBYztzQkFBOUQsZUFBZTt1QkFBQyxTQUFTLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQUNFLGFBQWE7c0JBQTdELGVBQWU7dUJBQUMsU0FBUyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQztnQkFDRyxlQUFlO3NCQUFoRSxlQUFlO3VCQUFDLFVBQVUsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7Z0JBQ0UsZUFBZTtzQkFBaEUsZUFBZTt1QkFBQyxVQUFVLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkNvbG9yLCBtaXhpbkNvbG9yLCBUaGVtZVBhbGV0dGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtmcm9tRXZlbnQsIG1lcmdlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRoLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TUFUX0VSUk9SLCBNYXRFcnJvcn0gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQge21hdEZvcm1GaWVsZEFuaW1hdGlvbnN9IGZyb20gJy4vZm9ybS1maWVsZC1hbmltYXRpb25zJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbH0gZnJvbSAnLi9mb3JtLWZpZWxkLWNvbnRyb2wnO1xuaW1wb3J0IHtcbiAgZ2V0TWF0Rm9ybUZpZWxkRHVwbGljYXRlZEhpbnRFcnJvcixcbiAgZ2V0TWF0Rm9ybUZpZWxkTWlzc2luZ0NvbnRyb2xFcnJvcixcbiAgZ2V0TWF0Rm9ybUZpZWxkUGxhY2Vob2xkZXJDb25mbGljdEVycm9yLFxufSBmcm9tICcuL2Zvcm0tZmllbGQtZXJyb3JzJztcbmltcG9ydCB7X01BVF9ISU5ULCBNYXRIaW50fSBmcm9tICcuL2hpbnQnO1xuaW1wb3J0IHtNYXRMYWJlbH0gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge01hdFBsYWNlaG9sZGVyfSBmcm9tICcuL3BsYWNlaG9sZGVyJztcbmltcG9ydCB7TUFUX1BSRUZJWCwgTWF0UHJlZml4fSBmcm9tICcuL3ByZWZpeCc7XG5pbXBvcnQge01BVF9TVUZGSVgsIE1hdFN1ZmZpeH0gZnJvbSAnLi9zdWZmaXgnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7QWJzdHJhY3RDb250cm9sRGlyZWN0aXZlfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5jb25zdCBmbG9hdGluZ0xhYmVsU2NhbGUgPSAwLjc1O1xuY29uc3Qgb3V0bGluZUdhcFBhZGRpbmcgPSA1O1xuXG4vKipcbiAqIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0Rm9ybUZpZWxkLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5jb25zdCBfTWF0Rm9ybUZpZWxkQmFzZSA9IG1peGluQ29sb3IoXG4gIGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG4gIH0sXG4gICdwcmltYXJ5Jyxcbik7XG5cbi8qKiBQb3NzaWJsZSBhcHBlYXJhbmNlIHN0eWxlcyBmb3IgdGhlIGZvcm0gZmllbGQuICovXG5leHBvcnQgdHlwZSBNYXRGb3JtRmllbGRBcHBlYXJhbmNlID0gJ2xlZ2FjeScgfCAnc3RhbmRhcmQnIHwgJ2ZpbGwnIHwgJ291dGxpbmUnO1xuXG4vKiogUG9zc2libGUgdmFsdWVzIGZvciB0aGUgXCJmbG9hdExhYmVsXCIgZm9ybSBmaWVsZCBpbnB1dC4gKi9cbmV4cG9ydCB0eXBlIEZsb2F0TGFiZWxUeXBlID0gJ2Fsd2F5cycgfCAnbmV2ZXInIHwgJ2F1dG8nO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIGZvcm0gZmllbGQgdGhhdCBjYW4gYmUgY29uZmlndXJlZFxuICogdXNpbmcgdGhlIGBNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlNgIGluamVjdGlvbiB0b2tlbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRGb3JtRmllbGREZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBEZWZhdWx0IGZvcm0gZmllbGQgYXBwZWFyYW5jZSBzdHlsZS4gKi9cbiAgYXBwZWFyYW5jZT86IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2U7XG4gIC8qKiBEZWZhdWx0IGNvbG9yIG9mIHRoZSBmb3JtIGZpZWxkLiAqL1xuICBjb2xvcj86IFRoZW1lUGFsZXR0ZTtcbiAgLyoqIFdoZXRoZXIgdGhlIHJlcXVpcmVkIG1hcmtlciBzaG91bGQgYmUgaGlkZGVuIGJ5IGRlZmF1bHQuICovXG4gIGhpZGVSZXF1aXJlZE1hcmtlcj86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBsYWJlbCBmb3IgZm9ybSBmaWVsZHMgc2hvdWxkIGJ5IGRlZmF1bHQgZmxvYXQgYGFsd2F5c2AsXG4gICAqIGBuZXZlcmAsIG9yIGBhdXRvYCAob25seSB3aGVuIG5lY2Vzc2FyeSkuXG4gICAqL1xuICBmbG9hdExhYmVsPzogRmxvYXRMYWJlbFR5cGU7XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZVxuICogZGVmYXVsdCBvcHRpb25zIGZvciBhbGwgZm9ybSBmaWVsZCB3aXRoaW4gYW4gYXBwLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPE1hdEZvcm1GaWVsZERlZmF1bHRPcHRpb25zPihcbiAgJ01BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUycsXG4pO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGluamVjdCBhbiBpbnN0YW5jZXMgb2YgYE1hdEZvcm1GaWVsZGAuIEl0IHNlcnZlc1xuICogYXMgYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0Rm9ybUZpZWxkYCBjbGFzcyB3aGljaCB3b3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBgTWF0Rm9ybUZpZWxkYCBjbGFzcyBhbmQgaXRzIGNvbXBvbmVudCBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9GT1JNX0ZJRUxEID0gbmV3IEluamVjdGlvblRva2VuPE1hdEZvcm1GaWVsZD4oJ01hdEZvcm1GaWVsZCcpO1xuXG4vKiogQ29udGFpbmVyIGZvciBmb3JtIGNvbnRyb2xzIHRoYXQgYXBwbGllcyBNYXRlcmlhbCBEZXNpZ24gc3R5bGluZyBhbmQgYmVoYXZpb3IuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZm9ybS1maWVsZCcsXG4gIGV4cG9ydEFzOiAnbWF0Rm9ybUZpZWxkJyxcbiAgdGVtcGxhdGVVcmw6ICdmb3JtLWZpZWxkLmh0bWwnLFxuICAvLyBNYXRJbnB1dCBpcyBhIGRpcmVjdGl2ZSBhbmQgY2FuJ3QgaGF2ZSBzdHlsZXMsIHNvIHdlIG5lZWQgdG8gaW5jbHVkZSBpdHMgc3R5bGVzIGhlcmVcbiAgLy8gaW4gZm9ybS1maWVsZC1pbnB1dC5jc3MuIFRoZSBNYXRJbnB1dCBzdHlsZXMgYXJlIGZhaXJseSBtaW5pbWFsIHNvIGl0IHNob3VsZG4ndCBiZSBhXG4gIC8vIGJpZyBkZWFsIGZvciBwZW9wbGUgd2hvIGFyZW4ndCB1c2luZyBNYXRJbnB1dC5cbiAgc3R5bGVVcmxzOiBbXG4gICAgJ2Zvcm0tZmllbGQuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1maWxsLmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtaW5wdXQuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1sZWdhY3kuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1vdXRsaW5lLmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtc3RhbmRhcmQuY3NzJyxcbiAgXSxcbiAgYW5pbWF0aW9uczogW21hdEZvcm1GaWVsZEFuaW1hdGlvbnMudHJhbnNpdGlvbk1lc3NhZ2VzXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZm9ybS1maWVsZCcsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hcHBlYXJhbmNlLXN0YW5kYXJkXSc6ICdhcHBlYXJhbmNlID09IFwic3RhbmRhcmRcIicsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hcHBlYXJhbmNlLWZpbGxdJzogJ2FwcGVhcmFuY2UgPT0gXCJmaWxsXCInLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1vdXRsaW5lXSc6ICdhcHBlYXJhbmNlID09IFwib3V0bGluZVwiJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2UtbGVnYWN5XSc6ICdhcHBlYXJhbmNlID09IFwibGVnYWN5XCInLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtaW52YWxpZF0nOiAnX2NvbnRyb2wuZXJyb3JTdGF0ZScsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1jYW4tZmxvYXRdJzogJ19jYW5MYWJlbEZsb2F0KCknLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtc2hvdWxkLWZsb2F0XSc6ICdfc2hvdWxkTGFiZWxGbG9hdCgpJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWhhcy1sYWJlbF0nOiAnX2hhc0Zsb2F0aW5nTGFiZWwoKScsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1oaWRlLXBsYWNlaG9sZGVyXSc6ICdfaGlkZUNvbnRyb2xQbGFjZWhvbGRlcigpJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWRpc2FibGVkXSc6ICdfY29udHJvbC5kaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hdXRvZmlsbGVkXSc6ICdfY29udHJvbC5hdXRvZmlsbGVkJyxcbiAgICAnW2NsYXNzLm1hdC1mb2N1c2VkXSc6ICdfY29udHJvbC5mb2N1c2VkJyxcbiAgICAnW2NsYXNzLm5nLXVudG91Y2hlZF0nOiAnX3Nob3VsZEZvcndhcmQoXCJ1bnRvdWNoZWRcIiknLFxuICAgICdbY2xhc3MubmctdG91Y2hlZF0nOiAnX3Nob3VsZEZvcndhcmQoXCJ0b3VjaGVkXCIpJyxcbiAgICAnW2NsYXNzLm5nLXByaXN0aW5lXSc6ICdfc2hvdWxkRm9yd2FyZChcInByaXN0aW5lXCIpJyxcbiAgICAnW2NsYXNzLm5nLWRpcnR5XSc6ICdfc2hvdWxkRm9yd2FyZChcImRpcnR5XCIpJyxcbiAgICAnW2NsYXNzLm5nLXZhbGlkXSc6ICdfc2hvdWxkRm9yd2FyZChcInZhbGlkXCIpJyxcbiAgICAnW2NsYXNzLm5nLWludmFsaWRdJzogJ19zaG91bGRGb3J3YXJkKFwiaW52YWxpZFwiKScsXG4gICAgJ1tjbGFzcy5uZy1wZW5kaW5nXSc6ICdfc2hvdWxkRm9yd2FyZChcInBlbmRpbmdcIiknLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJyFfYW5pbWF0aW9uc0VuYWJsZWQnLFxuICB9LFxuICBpbnB1dHM6IFsnY29sb3InXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfRk9STV9GSUVMRCwgdXNlRXhpc3Rpbmc6IE1hdEZvcm1GaWVsZH1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRGb3JtRmllbGRcbiAgZXh0ZW5kcyBfTWF0Rm9ybUZpZWxkQmFzZVxuICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIEFmdGVyQ29udGVudENoZWNrZWQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3JcbntcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIG91dGxpbmUgZ2FwIG5lZWRzIHRvIGJlIGNhbGN1bGF0ZWRcbiAgICogaW1tZWRpYXRlbHkgb24gdGhlIG5leHQgY2hhbmdlIGRldGVjdGlvbiBydW4uXG4gICAqL1xuICBwcml2YXRlIF9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBvdXRsaW5lIGdhcCBuZWVkcyB0byBiZSBjYWxjdWxhdGVkIG5leHQgdGltZSB0aGUgem9uZSBoYXMgc3RhYmlsaXplZC4gKi9cbiAgcHJpdmF0ZSBfb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUgPSBmYWxzZTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBUaGUgZm9ybSBmaWVsZCBhcHBlYXJhbmNlIHN0eWxlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgYXBwZWFyYW5jZSgpOiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwZWFyYW5jZTtcbiAgfVxuICBzZXQgYXBwZWFyYW5jZSh2YWx1ZTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSkge1xuICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5fYXBwZWFyYW5jZTtcblxuICAgIHRoaXMuX2FwcGVhcmFuY2UgPSB2YWx1ZSB8fCB0aGlzLl9kZWZhdWx0cz8uYXBwZWFyYW5jZSB8fCAnbGVnYWN5JztcblxuICAgIGlmICh0aGlzLl9hcHBlYXJhbmNlID09PSAnb3V0bGluZScgJiYgb2xkVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IHRydWU7XG4gICAgfVxuICB9XG4gIF9hcHBlYXJhbmNlOiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByZXF1aXJlZCBtYXJrZXIgc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhpZGVSZXF1aXJlZE1hcmtlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZVJlcXVpcmVkTWFya2VyO1xuICB9XG4gIHNldCBoaWRlUmVxdWlyZWRNYXJrZXIodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2hpZGVSZXF1aXJlZE1hcmtlciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZVJlcXVpcmVkTWFya2VyID0gZmFsc2U7XG5cbiAgLyoqIE92ZXJyaWRlIGZvciB0aGUgbG9naWMgdGhhdCBkaXNhYmxlcyB0aGUgbGFiZWwgYW5pbWF0aW9uIGluIGNlcnRhaW4gY2FzZXMuICovXG4gIHByaXZhdGUgX3Nob3dBbHdheXNBbmltYXRlID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZsb2F0aW5nIGxhYmVsIHNob3VsZCBhbHdheXMgZmxvYXQgb3Igbm90LiAqL1xuICBfc2hvdWxkQWx3YXlzRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZmxvYXRMYWJlbCA9PT0gJ2Fsd2F5cycgJiYgIXRoaXMuX3Nob3dBbHdheXNBbmltYXRlO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIGNhbiBmbG9hdCBvciBub3QuICovXG4gIF9jYW5MYWJlbEZsb2F0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZsb2F0TGFiZWwgIT09ICduZXZlcic7XG4gIH1cblxuICAvKiogU3RhdGUgb2YgdGhlIG1hdC1oaW50IGFuZCBtYXQtZXJyb3IgYW5pbWF0aW9ucy4gKi9cbiAgX3N1YnNjcmlwdEFuaW1hdGlvblN0YXRlOiBzdHJpbmcgPSAnJztcblxuICAvKiogVGV4dCBmb3IgdGhlIGZvcm0gZmllbGQgaGludC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhpbnRMYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9oaW50TGFiZWw7XG4gIH1cbiAgc2V0IGhpbnRMYWJlbCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5faGludExhYmVsID0gdmFsdWU7XG4gICAgdGhpcy5fcHJvY2Vzc0hpbnRzKCk7XG4gIH1cbiAgcHJpdmF0ZSBfaGludExhYmVsID0gJyc7XG5cbiAgLy8gVW5pcXVlIGlkIGZvciB0aGUgaGludCBsYWJlbC5cbiAgcmVhZG9ubHkgX2hpbnRMYWJlbElkOiBzdHJpbmcgPSBgbWF0LWhpbnQtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8vIFVuaXF1ZSBpZCBmb3IgdGhlIGxhYmVsIGVsZW1lbnQuXG4gIHJlYWRvbmx5IF9sYWJlbElkID0gYG1hdC1mb3JtLWZpZWxkLWxhYmVsLSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGFsd2F5cyBmbG9hdCwgbmV2ZXIgZmxvYXQgb3IgZmxvYXQgYXMgdGhlIHVzZXIgdHlwZXMuXG4gICAqXG4gICAqIE5vdGU6IG9ubHkgdGhlIGxlZ2FjeSBhcHBlYXJhbmNlIHN1cHBvcnRzIHRoZSBgbmV2ZXJgIG9wdGlvbi4gYG5ldmVyYCB3YXMgb3JpZ2luYWxseSBhZGRlZCBhcyBhXG4gICAqIHdheSB0byBtYWtlIHRoZSBmbG9hdGluZyBsYWJlbCBlbXVsYXRlIHRoZSBiZWhhdmlvciBvZiBhIHN0YW5kYXJkIGlucHV0IHBsYWNlaG9sZGVyLiBIb3dldmVyXG4gICAqIHRoZSBmb3JtIGZpZWxkIG5vdyBzdXBwb3J0cyBib3RoIGZsb2F0aW5nIGxhYmVscyBhbmQgcGxhY2Vob2xkZXJzLiBUaGVyZWZvcmUgaW4gdGhlIG5vbi1sZWdhY3lcbiAgICogYXBwZWFyYW5jZXMgdGhlIGBuZXZlcmAgb3B0aW9uIGhhcyBiZWVuIGRpc2FibGVkIGluIGZhdm9yIG9mIGp1c3QgdXNpbmcgdGhlIHBsYWNlaG9sZGVyLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGZsb2F0TGFiZWwoKTogRmxvYXRMYWJlbFR5cGUge1xuICAgIHJldHVybiB0aGlzLmFwcGVhcmFuY2UgIT09ICdsZWdhY3knICYmIHRoaXMuX2Zsb2F0TGFiZWwgPT09ICduZXZlcicgPyAnYXV0bycgOiB0aGlzLl9mbG9hdExhYmVsO1xuICB9XG4gIHNldCBmbG9hdExhYmVsKHZhbHVlOiBGbG9hdExhYmVsVHlwZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fZmxvYXRMYWJlbCkge1xuICAgICAgdGhpcy5fZmxvYXRMYWJlbCA9IHZhbHVlIHx8IHRoaXMuX2dldERlZmF1bHRGbG9hdExhYmVsU3RhdGUoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9mbG9hdExhYmVsOiBGbG9hdExhYmVsVHlwZTtcblxuICAvKiogV2hldGhlciB0aGUgQW5ndWxhciBhbmltYXRpb25zIGFyZSBlbmFibGVkLiAqL1xuICBfYW5pbWF0aW9uc0VuYWJsZWQ6IGJvb2xlYW47XG5cbiAgQFZpZXdDaGlsZCgnY29ubmVjdGlvbkNvbnRhaW5lcicsIHtzdGF0aWM6IHRydWV9KSBfY29ubmVjdGlvbkNvbnRhaW5lclJlZjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnaW5wdXRDb250YWluZXInKSBfaW5wdXRDb250YWluZXJSZWY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2xhYmVsJykgcHJpdmF0ZSBfbGFiZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0Rm9ybUZpZWxkQ29udHJvbCkgX2NvbnRyb2xOb25TdGF0aWM6IE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNYXRGb3JtRmllbGRDb250cm9sLCB7c3RhdGljOiB0cnVlfSkgX2NvbnRyb2xTdGF0aWM6IE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PjtcbiAgZ2V0IF9jb250cm9sKCkge1xuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBuZWVkIHRoaXMgd29ya2Fyb3VuZCBpbiBvcmRlciB0byBzdXBwb3J0IGJvdGggSXZ5IGFuZCBWaWV3RW5naW5lLlxuICAgIC8vICBXZSBzaG91bGQgY2xlYW4gdGhpcyB1cCBvbmNlIEl2eSBpcyB0aGUgZGVmYXVsdCByZW5kZXJlci5cbiAgICByZXR1cm4gdGhpcy5fZXhwbGljaXRGb3JtRmllbGRDb250cm9sIHx8IHRoaXMuX2NvbnRyb2xOb25TdGF0aWMgfHwgdGhpcy5fY29udHJvbFN0YXRpYztcbiAgfVxuICBzZXQgX2NvbnRyb2wodmFsdWUpIHtcbiAgICB0aGlzLl9leHBsaWNpdEZvcm1GaWVsZENvbnRyb2wgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9leHBsaWNpdEZvcm1GaWVsZENvbnRyb2w6IE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PjtcblxuICBAQ29udGVudENoaWxkKE1hdExhYmVsKSBfbGFiZWxDaGlsZE5vblN0YXRpYzogTWF0TGFiZWw7XG4gIEBDb250ZW50Q2hpbGQoTWF0TGFiZWwsIHtzdGF0aWM6IHRydWV9KSBfbGFiZWxDaGlsZFN0YXRpYzogTWF0TGFiZWw7XG4gIEBDb250ZW50Q2hpbGQoTWF0UGxhY2Vob2xkZXIpIF9wbGFjZWhvbGRlckNoaWxkOiBNYXRQbGFjZWhvbGRlcjtcblxuICBAQ29udGVudENoaWxkcmVuKE1BVF9FUlJPUiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2Vycm9yQ2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRFcnJvcj47XG4gIEBDb250ZW50Q2hpbGRyZW4oX01BVF9ISU5ULCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfaGludENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0SGludD47XG4gIEBDb250ZW50Q2hpbGRyZW4oTUFUX1BSRUZJWCwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3ByZWZpeENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0UHJlZml4PjtcbiAgQENvbnRlbnRDaGlsZHJlbihNQVRfU1VGRklYLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfc3VmZml4Q2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRTdWZmaXg+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUylcbiAgICBwcml2YXRlIF9kZWZhdWx0czogTWF0Rm9ybUZpZWxkRGVmYXVsdE9wdGlvbnMsXG4gICAgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBfYW5pbWF0aW9uTW9kZTogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcblxuICAgIHRoaXMuZmxvYXRMYWJlbCA9IHRoaXMuX2dldERlZmF1bHRGbG9hdExhYmVsU3RhdGUoKTtcbiAgICB0aGlzLl9hbmltYXRpb25zRW5hYmxlZCA9IF9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnO1xuXG4gICAgLy8gU2V0IHRoZSBkZWZhdWx0IHRocm91Z2ggaGVyZSBzbyB3ZSBpbnZva2UgdGhlIHNldHRlciBvbiB0aGUgZmlyc3QgcnVuLlxuICAgIHRoaXMuYXBwZWFyYW5jZSA9IF9kZWZhdWx0cz8uYXBwZWFyYW5jZSB8fCAnbGVnYWN5JztcbiAgICBpZiAoX2RlZmF1bHRzKSB7XG4gICAgICB0aGlzLl9oaWRlUmVxdWlyZWRNYXJrZXIgPSBCb29sZWFuKF9kZWZhdWx0cy5oaWRlUmVxdWlyZWRNYXJrZXIpO1xuICAgICAgaWYgKF9kZWZhdWx0cy5jb2xvcikge1xuICAgICAgICB0aGlzLmNvbG9yID0gdGhpcy5kZWZhdWx0Q29sb3IgPSBfZGVmYXVsdHMuY29sb3I7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGlkIG9mIHRoZSBsYWJlbCBlbGVtZW50LiBJZiBubyBsYWJlbCBpcyBwcmVzZW50LCByZXR1cm5zIGBudWxsYC5cbiAgICovXG4gIGdldExhYmVsSWQoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc0Zsb2F0aW5nTGFiZWwoKSA/IHRoaXMuX2xhYmVsSWQgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gRWxlbWVudFJlZiBmb3IgdGhlIGVsZW1lbnQgdGhhdCBhIG92ZXJsYXkgYXR0YWNoZWQgdG8gdGhlIGZvcm0gZmllbGQgc2hvdWxkIGJlXG4gICAqIHBvc2l0aW9uZWQgcmVsYXRpdmUgdG8uXG4gICAqL1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWYge1xuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uQ29udGFpbmVyUmVmIHx8IHRoaXMuX2VsZW1lbnRSZWY7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fdmFsaWRhdGVDb250cm9sQ2hpbGQoKTtcblxuICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLl9jb250cm9sO1xuXG4gICAgaWYgKGNvbnRyb2wuY29udHJvbFR5cGUpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBtYXQtZm9ybS1maWVsZC10eXBlLSR7Y29udHJvbC5jb250cm9sVHlwZX1gKTtcbiAgICB9XG5cbiAgICAvLyBTdWJzY3JpYmUgdG8gY2hhbmdlcyBpbiB0aGUgY2hpbGQgY29udHJvbCBzdGF0ZSBpbiBvcmRlciB0byB1cGRhdGUgdGhlIGZvcm0gZmllbGQgVUkuXG4gICAgY29udHJvbC5zdGF0ZUNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl92YWxpZGF0ZVBsYWNlaG9sZGVycygpO1xuICAgICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIC8vIFJ1biBjaGFuZ2UgZGV0ZWN0aW9uIGlmIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgIGlmIChjb250cm9sLm5nQ29udHJvbCAmJiBjb250cm9sLm5nQ29udHJvbC52YWx1ZUNoYW5nZXMpIHtcbiAgICAgIGNvbnRyb2wubmdDb250cm9sLnZhbHVlQ2hhbmdlc1xuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHdlIGhhdmUgdG8gcnVuIG91dHNpZGUgb2YgdGhlIGBOZ1pvbmVgIGV4cGxpY2l0bHksXG4gICAgLy8gaW4gb3JkZXIgdG8gYXZvaWQgdGhyb3dpbmcgdXNlcnMgaW50byBhbiBpbmZpbml0ZSBsb29wXG4gICAgLy8gaWYgYHpvbmUtcGF0Y2gtcnhqc2AgaXMgaW5jbHVkZWQuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBSdW4gY2hhbmdlIGRldGVjdGlvbiBhbmQgdXBkYXRlIHRoZSBvdXRsaW5lIGlmIHRoZSBzdWZmaXggb3IgcHJlZml4IGNoYW5nZXMuXG4gICAgbWVyZ2UodGhpcy5fcHJlZml4Q2hpbGRyZW4uY2hhbmdlcywgdGhpcy5fc3VmZml4Q2hpbGRyZW4uY2hhbmdlcykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gUmUtdmFsaWRhdGUgd2hlbiB0aGUgbnVtYmVyIG9mIGhpbnRzIGNoYW5nZXMuXG4gICAgdGhpcy5faGludENoaWxkcmVuLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9wcm9jZXNzSGludHMoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBhcmlhLWRlc2NyaWJlZCBieSB3aGVuIHRoZSBudW1iZXIgb2YgZXJyb3JzIGNoYW5nZXMuXG4gICAgdGhpcy5fZXJyb3JDaGlsZHJlbi5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9kaXIpIHtcbiAgICAgIHRoaXMuX2Rpci5jaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMudXBkYXRlT3V0bGluZUdhcCgpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIHRoaXMuX3ZhbGlkYXRlQ29udHJvbENoaWxkKCk7XG4gICAgaWYgKHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5KSB7XG4gICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gQXZvaWQgYW5pbWF0aW9ucyBvbiBsb2FkLlxuICAgIHRoaXMuX3N1YnNjcmlwdEFuaW1hdGlvblN0YXRlID0gJ2VudGVyJztcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciBhIGNsYXNzIGZyb20gdGhlIEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZVxuICAgKiBzaG91bGQgYmUgZm9yd2FyZGVkIHRvIHRoZSBob3N0IGVsZW1lbnQuXG4gICAqL1xuICBfc2hvdWxkRm9yd2FyZChwcm9wOiBrZXlvZiBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmUpOiBib29sZWFuIHtcbiAgICBjb25zdCBjb250cm9sID0gdGhpcy5fY29udHJvbCA/IHRoaXMuX2NvbnRyb2wubmdDb250cm9sIDogbnVsbDtcbiAgICByZXR1cm4gY29udHJvbCAmJiBjb250cm9sW3Byb3BdO1xuICB9XG5cbiAgX2hhc1BsYWNlaG9sZGVyKCkge1xuICAgIHJldHVybiAhISgodGhpcy5fY29udHJvbCAmJiB0aGlzLl9jb250cm9sLnBsYWNlaG9sZGVyKSB8fCB0aGlzLl9wbGFjZWhvbGRlckNoaWxkKTtcbiAgfVxuXG4gIF9oYXNMYWJlbCgpIHtcbiAgICByZXR1cm4gISEodGhpcy5fbGFiZWxDaGlsZE5vblN0YXRpYyB8fCB0aGlzLl9sYWJlbENoaWxkU3RhdGljKTtcbiAgfVxuXG4gIF9zaG91bGRMYWJlbEZsb2F0KCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl9jYW5MYWJlbEZsb2F0KCkgJiZcbiAgICAgICgodGhpcy5fY29udHJvbCAmJiB0aGlzLl9jb250cm9sLnNob3VsZExhYmVsRmxvYXQpIHx8IHRoaXMuX3Nob3VsZEFsd2F5c0Zsb2F0KCkpXG4gICAgKTtcbiAgfVxuXG4gIF9oaWRlQ29udHJvbFBsYWNlaG9sZGVyKCkge1xuICAgIC8vIEluIHRoZSBsZWdhY3kgYXBwZWFyYW5jZSB0aGUgcGxhY2Vob2xkZXIgaXMgcHJvbW90ZWQgdG8gYSBsYWJlbCBpZiBubyBsYWJlbCBpcyBnaXZlbi5cbiAgICByZXR1cm4gKFxuICAgICAgKHRoaXMuYXBwZWFyYW5jZSA9PT0gJ2xlZ2FjeScgJiYgIXRoaXMuX2hhc0xhYmVsKCkpIHx8XG4gICAgICAodGhpcy5faGFzTGFiZWwoKSAmJiAhdGhpcy5fc2hvdWxkTGFiZWxGbG9hdCgpKVxuICAgICk7XG4gIH1cblxuICBfaGFzRmxvYXRpbmdMYWJlbCgpIHtcbiAgICAvLyBJbiB0aGUgbGVnYWN5IGFwcGVhcmFuY2UgdGhlIHBsYWNlaG9sZGVyIGlzIHByb21vdGVkIHRvIGEgbGFiZWwgaWYgbm8gbGFiZWwgaXMgZ2l2ZW4uXG4gICAgcmV0dXJuIHRoaXMuX2hhc0xhYmVsKCkgfHwgKHRoaXMuYXBwZWFyYW5jZSA9PT0gJ2xlZ2FjeScgJiYgdGhpcy5faGFzUGxhY2Vob2xkZXIoKSk7XG4gIH1cblxuICAvKiogRGV0ZXJtaW5lcyB3aGV0aGVyIHRvIGRpc3BsYXkgaGludHMgb3IgZXJyb3JzLiAqL1xuICBfZ2V0RGlzcGxheWVkTWVzc2FnZXMoKTogJ2Vycm9yJyB8ICdoaW50JyB7XG4gICAgcmV0dXJuIHRoaXMuX2Vycm9yQ2hpbGRyZW4gJiYgdGhpcy5fZXJyb3JDaGlsZHJlbi5sZW5ndGggPiAwICYmIHRoaXMuX2NvbnRyb2wuZXJyb3JTdGF0ZVxuICAgICAgPyAnZXJyb3InXG4gICAgICA6ICdoaW50JztcbiAgfVxuXG4gIC8qKiBBbmltYXRlcyB0aGUgcGxhY2Vob2xkZXIgdXAgYW5kIGxvY2tzIGl0IGluIHBvc2l0aW9uLiAqL1xuICBfYW5pbWF0ZUFuZExvY2tMYWJlbCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faGFzRmxvYXRpbmdMYWJlbCgpICYmIHRoaXMuX2NhbkxhYmVsRmxvYXQoKSkge1xuICAgICAgLy8gSWYgYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQsIHdlIHNob3VsZG4ndCBnbyBpbiBoZXJlLFxuICAgICAgLy8gYmVjYXVzZSB0aGUgYHRyYW5zaXRpb25lbmRgIHdpbGwgbmV2ZXIgZmlyZS5cbiAgICAgIGlmICh0aGlzLl9hbmltYXRpb25zRW5hYmxlZCAmJiB0aGlzLl9sYWJlbCkge1xuICAgICAgICB0aGlzLl9zaG93QWx3YXlzQW5pbWF0ZSA9IHRydWU7XG5cbiAgICAgICAgZnJvbUV2ZW50KHRoaXMuX2xhYmVsLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2l0aW9uZW5kJylcbiAgICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc2hvd0Fsd2F5c0FuaW1hdGUgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5mbG9hdExhYmVsID0gJ2Fsd2F5cyc7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW5zdXJlIHRoYXQgdGhlcmUgaXMgb25seSBvbmUgcGxhY2Vob2xkZXIgKGVpdGhlciBgcGxhY2Vob2xkZXJgIGF0dHJpYnV0ZSBvbiB0aGUgY2hpbGQgY29udHJvbFxuICAgKiBvciBjaGlsZCBlbGVtZW50IHdpdGggdGhlIGBtYXQtcGxhY2Vob2xkZXJgIGRpcmVjdGl2ZSkuXG4gICAqL1xuICBwcml2YXRlIF92YWxpZGF0ZVBsYWNlaG9sZGVycygpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLl9jb250cm9sLnBsYWNlaG9sZGVyICYmXG4gICAgICB0aGlzLl9wbGFjZWhvbGRlckNoaWxkICYmXG4gICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKVxuICAgICkge1xuICAgICAgdGhyb3cgZ2V0TWF0Rm9ybUZpZWxkUGxhY2Vob2xkZXJDb25mbGljdEVycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERvZXMgYW55IGV4dHJhIHByb2Nlc3NpbmcgdGhhdCBpcyByZXF1aXJlZCB3aGVuIGhhbmRsaW5nIHRoZSBoaW50cy4gKi9cbiAgcHJpdmF0ZSBfcHJvY2Vzc0hpbnRzKCkge1xuICAgIHRoaXMuX3ZhbGlkYXRlSGludHMoKTtcbiAgICB0aGlzLl9zeW5jRGVzY3JpYmVkQnlJZHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnN1cmUgdGhhdCB0aGVyZSBpcyBhIG1heGltdW0gb2Ygb25lIG9mIGVhY2ggYDxtYXQtaGludD5gIGFsaWdubWVudCBzcGVjaWZpZWQsIHdpdGggdGhlXG4gICAqIGF0dHJpYnV0ZSBiZWluZyBjb25zaWRlcmVkIGFzIGBhbGlnbj1cInN0YXJ0XCJgLlxuICAgKi9cbiAgcHJpdmF0ZSBfdmFsaWRhdGVIaW50cygpIHtcbiAgICBpZiAodGhpcy5faGludENoaWxkcmVuICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICBsZXQgc3RhcnRIaW50OiBNYXRIaW50O1xuICAgICAgbGV0IGVuZEhpbnQ6IE1hdEhpbnQ7XG4gICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uZm9yRWFjaCgoaGludDogTWF0SGludCkgPT4ge1xuICAgICAgICBpZiAoaGludC5hbGlnbiA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICAgIGlmIChzdGFydEhpbnQgfHwgdGhpcy5oaW50TGFiZWwpIHtcbiAgICAgICAgICAgIHRocm93IGdldE1hdEZvcm1GaWVsZER1cGxpY2F0ZWRIaW50RXJyb3IoJ3N0YXJ0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YXJ0SGludCA9IGhpbnQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaGludC5hbGlnbiA9PT0gJ2VuZCcpIHtcbiAgICAgICAgICBpZiAoZW5kSGludCkge1xuICAgICAgICAgICAgdGhyb3cgZ2V0TWF0Rm9ybUZpZWxkRHVwbGljYXRlZEhpbnRFcnJvcignZW5kJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVuZEhpbnQgPSBoaW50O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGVmYXVsdCBmbG9hdCBsYWJlbCBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGVmYXVsdEZsb2F0TGFiZWxTdGF0ZSgpOiBGbG9hdExhYmVsVHlwZSB7XG4gICAgcmV0dXJuICh0aGlzLl9kZWZhdWx0cyAmJiB0aGlzLl9kZWZhdWx0cy5mbG9hdExhYmVsKSB8fCAnYXV0byc7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbGlzdCBvZiBlbGVtZW50IElEcyB0aGF0IGRlc2NyaWJlIHRoZSBjaGlsZCBjb250cm9sLiBUaGlzIGFsbG93cyB0aGUgY29udHJvbCB0byB1cGRhdGVcbiAgICogaXRzIGBhcmlhLWRlc2NyaWJlZGJ5YCBhdHRyaWJ1dGUgYWNjb3JkaW5nbHkuXG4gICAqL1xuICBwcml2YXRlIF9zeW5jRGVzY3JpYmVkQnlJZHMoKSB7XG4gICAgaWYgKHRoaXMuX2NvbnRyb2wpIHtcbiAgICAgIGxldCBpZHM6IHN0cmluZ1tdID0gW107XG5cbiAgICAgIC8vIFRPRE8od2FnbmVybWFjaWVsKTogUmVtb3ZlIHRoZSB0eXBlIGNoZWNrIHdoZW4gd2UgZmluZCB0aGUgcm9vdCBjYXVzZSBvZiB0aGlzIGJ1Zy5cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5fY29udHJvbC51c2VyQXJpYURlc2NyaWJlZEJ5ICYmXG4gICAgICAgIHR5cGVvZiB0aGlzLl9jb250cm9sLnVzZXJBcmlhRGVzY3JpYmVkQnkgPT09ICdzdHJpbmcnXG4gICAgICApIHtcbiAgICAgICAgaWRzLnB1c2goLi4udGhpcy5fY29udHJvbC51c2VyQXJpYURlc2NyaWJlZEJ5LnNwbGl0KCcgJykpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fZ2V0RGlzcGxheWVkTWVzc2FnZXMoKSA9PT0gJ2hpbnQnKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0SGludCA9IHRoaXMuX2hpbnRDaGlsZHJlblxuICAgICAgICAgID8gdGhpcy5faGludENoaWxkcmVuLmZpbmQoaGludCA9PiBoaW50LmFsaWduID09PSAnc3RhcnQnKVxuICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgY29uc3QgZW5kSGludCA9IHRoaXMuX2hpbnRDaGlsZHJlblxuICAgICAgICAgID8gdGhpcy5faGludENoaWxkcmVuLmZpbmQoaGludCA9PiBoaW50LmFsaWduID09PSAnZW5kJylcbiAgICAgICAgICA6IG51bGw7XG5cbiAgICAgICAgaWYgKHN0YXJ0SGludCkge1xuICAgICAgICAgIGlkcy5wdXNoKHN0YXJ0SGludC5pZCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5faGludExhYmVsKSB7XG4gICAgICAgICAgaWRzLnB1c2godGhpcy5faGludExhYmVsSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZEhpbnQpIHtcbiAgICAgICAgICBpZHMucHVzaChlbmRIaW50LmlkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9lcnJvckNoaWxkcmVuKSB7XG4gICAgICAgIGlkcy5wdXNoKC4uLnRoaXMuX2Vycm9yQ2hpbGRyZW4ubWFwKGVycm9yID0+IGVycm9yLmlkKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NvbnRyb2wuc2V0RGVzY3JpYmVkQnlJZHMoaWRzKTtcbiAgICB9XG4gIH1cblxuICAvKiogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBmb3JtIGZpZWxkJ3MgY29udHJvbCBpcyBtaXNzaW5nLiAqL1xuICBwcm90ZWN0ZWQgX3ZhbGlkYXRlQ29udHJvbENoaWxkKCkge1xuICAgIGlmICghdGhpcy5fY29udHJvbCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgZ2V0TWF0Rm9ybUZpZWxkTWlzc2luZ0NvbnRyb2xFcnJvcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB3aWR0aCBhbmQgcG9zaXRpb24gb2YgdGhlIGdhcCBpbiB0aGUgb3V0bGluZS4gT25seSByZWxldmFudCBmb3IgdGhlIG91dGxpbmVcbiAgICogYXBwZWFyYW5jZS5cbiAgICovXG4gIHVwZGF0ZU91dGxpbmVHYXAoKSB7XG4gICAgY29uc3QgbGFiZWxFbCA9IHRoaXMuX2xhYmVsID8gdGhpcy5fbGFiZWwubmF0aXZlRWxlbWVudCA6IG51bGw7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fY29ubmVjdGlvbkNvbnRhaW5lclJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IG91dGxpbmVTdGFydFNlbGVjdG9yID0gJy5tYXQtZm9ybS1maWVsZC1vdXRsaW5lLXN0YXJ0JztcbiAgICBjb25zdCBvdXRsaW5lR2FwU2VsZWN0b3IgPSAnLm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtZ2FwJztcblxuICAgIC8vIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBpc24ndCBhdmFpbGFibGUgb24gdGhlIHNlcnZlci5cbiAgICBpZiAodGhpcy5hcHBlYXJhbmNlICE9PSAnb3V0bGluZScgfHwgIXRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGlzIG5vIGNvbnRlbnQsIHNldCB0aGUgZ2FwIGVsZW1lbnRzIHRvIHplcm8uXG4gICAgaWYgKCFsYWJlbEVsIHx8ICFsYWJlbEVsLmNoaWxkcmVuLmxlbmd0aCB8fCAhbGFiZWxFbC50ZXh0Q29udGVudCEudHJpbSgpKSB7XG4gICAgICBjb25zdCBnYXBFbGVtZW50cyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBgJHtvdXRsaW5lU3RhcnRTZWxlY3Rvcn0sICR7b3V0bGluZUdhcFNlbGVjdG9yfWAsXG4gICAgICApO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnYXBFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBnYXBFbGVtZW50c1tpXS5zdHlsZS53aWR0aCA9ICcwJztcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgZWxlbWVudCBpcyBub3QgcHJlc2VudCBpbiB0aGUgRE9NLCB0aGUgb3V0bGluZSBnYXAgd2lsbCBuZWVkIHRvIGJlIGNhbGN1bGF0ZWRcbiAgICAvLyB0aGUgbmV4dCB0aW1lIGl0IGlzIGNoZWNrZWQgYW5kIGluIHRoZSBET00uXG4gICAgaWYgKCF0aGlzLl9pc0F0dGFjaGVkVG9ET00oKSkge1xuICAgICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHkgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBzdGFydFdpZHRoID0gMDtcbiAgICBsZXQgZ2FwV2lkdGggPSAwO1xuXG4gICAgY29uc3Qgc3RhcnRFbHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbChvdXRsaW5lU3RhcnRTZWxlY3Rvcik7XG4gICAgY29uc3QgZ2FwRWxzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwob3V0bGluZUdhcFNlbGVjdG9yKTtcblxuICAgIGlmICh0aGlzLl9sYWJlbCAmJiB0aGlzLl9sYWJlbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgY29uc3QgY29udGFpbmVyUmVjdCA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgLy8gSWYgdGhlIGNvbnRhaW5lcidzIHdpZHRoIGFuZCBoZWlnaHQgYXJlIHplcm8sIGl0IG1lYW5zIHRoYXQgdGhlIGVsZW1lbnQgaXNcbiAgICAgIC8vIGludmlzaWJsZSBhbmQgd2UgY2FuJ3QgY2FsY3VsYXRlIHRoZSBvdXRsaW5lIGdhcC4gTWFyayB0aGUgZWxlbWVudCBhcyBuZWVkaW5nXG4gICAgICAvLyB0byBiZSBjaGVja2VkIHRoZSBuZXh0IHRpbWUgdGhlIHpvbmUgc3RhYmlsaXplcy4gV2UgY2FuJ3QgZG8gdGhpcyBpbW1lZGlhdGVseVxuICAgICAgLy8gb24gdGhlIG5leHQgY2hhbmdlIGRldGVjdGlvbiwgYmVjYXVzZSBldmVuIGlmIHRoZSBlbGVtZW50IGJlY29tZXMgdmlzaWJsZSxcbiAgICAgIC8vIHRoZSBgQ2xpZW50UmVjdGAgd29uJ3QgYmUgcmVjYWxjdWxhdGVkIGltbWVkaWF0ZWx5LiBXZSByZXNldCB0aGVcbiAgICAgIC8vIGBfb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHlgIGZsYWcgc29tZSB3ZSBkb24ndCBydW4gdGhlIGNoZWNrcyB0d2ljZS5cbiAgICAgIGlmIChjb250YWluZXJSZWN0LndpZHRoID09PSAwICYmIGNvbnRhaW5lclJlY3QuaGVpZ2h0ID09PSAwKSB7XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHkgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb250YWluZXJTdGFydCA9IHRoaXMuX2dldFN0YXJ0RW5kKGNvbnRhaW5lclJlY3QpO1xuICAgICAgY29uc3QgbGFiZWxDaGlsZHJlbiA9IGxhYmVsRWwuY2hpbGRyZW47XG4gICAgICBjb25zdCBsYWJlbFN0YXJ0ID0gdGhpcy5fZ2V0U3RhcnRFbmQobGFiZWxDaGlsZHJlblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gICAgICBsZXQgbGFiZWxXaWR0aCA9IDA7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGFiZWxDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBsYWJlbFdpZHRoICs9IChsYWJlbENoaWxkcmVuW2ldIGFzIEhUTUxFbGVtZW50KS5vZmZzZXRXaWR0aDtcbiAgICAgIH1cbiAgICAgIHN0YXJ0V2lkdGggPSBNYXRoLmFicyhsYWJlbFN0YXJ0IC0gY29udGFpbmVyU3RhcnQpIC0gb3V0bGluZUdhcFBhZGRpbmc7XG4gICAgICBnYXBXaWR0aCA9IGxhYmVsV2lkdGggPiAwID8gbGFiZWxXaWR0aCAqIGZsb2F0aW5nTGFiZWxTY2FsZSArIG91dGxpbmVHYXBQYWRkaW5nICogMiA6IDA7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydEVscy5sZW5ndGg7IGkrKykge1xuICAgICAgc3RhcnRFbHNbaV0uc3R5bGUud2lkdGggPSBgJHtzdGFydFdpZHRofXB4YDtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnYXBFbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGdhcEVsc1tpXS5zdHlsZS53aWR0aCA9IGAke2dhcFdpZHRofXB4YDtcbiAgICB9XG5cbiAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID1cbiAgICAgIGZhbHNlO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHN0YXJ0IGVuZCBvZiB0aGUgcmVjdCBjb25zaWRlcmluZyB0aGUgY3VycmVudCBkaXJlY3Rpb25hbGl0eS4gKi9cbiAgcHJpdmF0ZSBfZ2V0U3RhcnRFbmQocmVjdDogQ2xpZW50UmVjdCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnID8gcmVjdC5yaWdodCA6IHJlY3QubGVmdDtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgZm9ybSBmaWVsZCBpcyBhdHRhY2hlZCB0byB0aGUgRE9NLiAqL1xuICBwcml2YXRlIF9pc0F0dGFjaGVkVG9ET00oKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAoZWxlbWVudC5nZXRSb290Tm9kZSkge1xuICAgICAgY29uc3Qgcm9vdE5vZGUgPSBlbGVtZW50LmdldFJvb3ROb2RlKCk7XG4gICAgICAvLyBJZiB0aGUgZWxlbWVudCBpcyBpbnNpZGUgdGhlIERPTSB0aGUgcm9vdCBub2RlIHdpbGwgYmUgZWl0aGVyIHRoZSBkb2N1bWVudFxuICAgICAgLy8gb3IgdGhlIGNsb3Nlc3Qgc2hhZG93IHJvb3QsIG90aGVyd2lzZSBpdCdsbCBiZSB0aGUgZWxlbWVudCBpdHNlbGYuXG4gICAgICByZXR1cm4gcm9vdE5vZGUgJiYgcm9vdE5vZGUgIT09IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlIGZhbGwgYmFjayB0byBjaGVja2luZyBpZiBpdCdzIGluIHRoZSBkb2N1bWVudC4gVGhpcyBkb2Vzbid0IGFjY291bnQgZm9yXG4gICAgLy8gc2hhZG93IERPTSwgaG93ZXZlciBicm93c2VyIHRoYXQgc3VwcG9ydCBzaGFkb3cgRE9NIHNob3VsZCBzdXBwb3J0IGBnZXRSb290Tm9kZWAgYXMgd2VsbC5cbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IS5jb250YWlucyhlbGVtZW50KTtcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm1hdC1mb3JtLWZpZWxkLXdyYXBwZXJcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1mb3JtLWZpZWxkLWZsZXhcIiAjY29ubmVjdGlvbkNvbnRhaW5lclxuICAgICAgIChjbGljayk9XCJfY29udHJvbC5vbkNvbnRhaW5lckNsaWNrICYmIF9jb250cm9sLm9uQ29udGFpbmVyQ2xpY2soJGV2ZW50KVwiPlxuXG4gICAgPCEtLSBPdXRsaW5lIHVzZWQgZm9yIG91dGxpbmUgYXBwZWFyYW5jZS4gLS0+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImFwcGVhcmFuY2UgPT0gJ291dGxpbmUnXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibWF0LWZvcm0tZmllbGQtb3V0bGluZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWF0LWZvcm0tZmllbGQtb3V0bGluZS1zdGFydFwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWF0LWZvcm0tZmllbGQtb3V0bGluZS1nYXBcIj48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtZW5kXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYXQtZm9ybS1maWVsZC1vdXRsaW5lIG1hdC1mb3JtLWZpZWxkLW91dGxpbmUtdGhpY2tcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtc3RhcnRcIj48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtZ2FwXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtYXQtZm9ybS1maWVsZC1vdXRsaW5lLWVuZFwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy1jb250YWluZXI+XG5cbiAgICA8ZGl2XG4gICAgICBjbGFzcz1cIm1hdC1mb3JtLWZpZWxkLXByZWZpeFwiXG4gICAgICAqbmdJZj1cIl9wcmVmaXhDaGlsZHJlbi5sZW5ndGhcIlxuICAgICAgKGNka09ic2VydmVDb250ZW50KT1cInVwZGF0ZU91dGxpbmVHYXAoKVwiXG4gICAgICBbY2RrT2JzZXJ2ZUNvbnRlbnREaXNhYmxlZF09XCJhcHBlYXJhbmNlICE9ICdvdXRsaW5lJ1wiPlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW21hdFByZWZpeF1cIj48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwibWF0LWZvcm0tZmllbGQtaW5maXhcIiAjaW5wdXRDb250YWluZXI+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG5cbiAgICAgIDxzcGFuIGNsYXNzPVwibWF0LWZvcm0tZmllbGQtbGFiZWwtd3JhcHBlclwiPlxuICAgICAgICA8IS0tIFdlIGFkZCBhcmlhLW93bnMgYXMgYSB3b3JrYXJvdW5kIGZvciBhbiBpc3N1ZSBpbiBKQVdTICYgTlZEQSB3aGVyZSB0aGUgbGFiZWwgaXNuJ3RcbiAgICAgICAgICAgICByZWFkIGlmIGl0IGNvbWVzIGJlZm9yZSB0aGUgY29udHJvbCBpbiB0aGUgRE9NLiAtLT5cbiAgICAgICAgPGxhYmVsIGNsYXNzPVwibWF0LWZvcm0tZmllbGQtbGFiZWxcIlxuICAgICAgICAgICAgICAgKGNka09ic2VydmVDb250ZW50KT1cInVwZGF0ZU91dGxpbmVHYXAoKVwiXG4gICAgICAgICAgICAgICBbY2RrT2JzZXJ2ZUNvbnRlbnREaXNhYmxlZF09XCJhcHBlYXJhbmNlICE9ICdvdXRsaW5lJ1wiXG4gICAgICAgICAgICAgICBbaWRdPVwiX2xhYmVsSWRcIlxuICAgICAgICAgICAgICAgW2F0dHIuZm9yXT1cIl9jb250cm9sLmlkXCJcbiAgICAgICAgICAgICAgIFthdHRyLmFyaWEtb3duc109XCJfY29udHJvbC5pZFwiXG4gICAgICAgICAgICAgICBbY2xhc3MubWF0LWVtcHR5XT1cIl9jb250cm9sLmVtcHR5ICYmICFfc2hvdWxkQWx3YXlzRmxvYXQoKVwiXG4gICAgICAgICAgICAgICBbY2xhc3MubWF0LWZvcm0tZmllbGQtZW1wdHldPVwiX2NvbnRyb2wuZW1wdHkgJiYgIV9zaG91bGRBbHdheXNGbG9hdCgpXCJcbiAgICAgICAgICAgICAgIFtjbGFzcy5tYXQtYWNjZW50XT1cImNvbG9yID09ICdhY2NlbnQnXCJcbiAgICAgICAgICAgICAgIFtjbGFzcy5tYXQtd2Fybl09XCJjb2xvciA9PSAnd2FybidcIlxuICAgICAgICAgICAgICAgI2xhYmVsXG4gICAgICAgICAgICAgICAqbmdJZj1cIl9oYXNGbG9hdGluZ0xhYmVsKClcIlxuICAgICAgICAgICAgICAgW25nU3dpdGNoXT1cIl9oYXNMYWJlbCgpXCI+XG5cbiAgICAgICAgICA8IS0tIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgcmVtb3ZlIGluIGZhdm9yIG9mIG1hdC1sYWJlbCBlbGVtZW50IGFuIHBsYWNlaG9sZGVyIGF0dHIuIC0tPlxuICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cImZhbHNlXCI+XG4gICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJtYXQtcGxhY2Vob2xkZXJcIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICA8c3Bhbj57e19jb250cm9sLnBsYWNlaG9sZGVyfX08L3NwYW4+XG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XG5cbiAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJtYXQtbGFiZWxcIiAqbmdTd2l0Y2hDYXNlPVwidHJ1ZVwiPjwvbmctY29udGVudD5cblxuICAgICAgICAgIDwhLS0gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCByZW1vdmUgYG1hdC1wbGFjZWhvbGRlci1yZXF1aXJlZGAgY2xhc3MgLS0+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIGNsYXNzPVwibWF0LXBsYWNlaG9sZGVyLXJlcXVpcmVkIG1hdC1mb3JtLWZpZWxkLXJlcXVpcmVkLW1hcmtlclwiXG4gICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgKm5nSWY9XCIhaGlkZVJlcXVpcmVkTWFya2VyICYmIF9jb250cm9sLnJlcXVpcmVkICYmICFfY29udHJvbC5kaXNhYmxlZFwiPiYjMzI7Kjwvc3Bhbj5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJtYXQtZm9ybS1maWVsZC1zdWZmaXhcIiAqbmdJZj1cIl9zdWZmaXhDaGlsZHJlbi5sZW5ndGhcIj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIlttYXRTdWZmaXhdXCI+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cblxuICA8IS0tIFVuZGVybGluZSB1c2VkIGZvciBsZWdhY3ksIHN0YW5kYXJkLCBhbmQgYm94IGFwcGVhcmFuY2VzLiAtLT5cbiAgPGRpdiBjbGFzcz1cIm1hdC1mb3JtLWZpZWxkLXVuZGVybGluZVwiXG4gICAgICAgKm5nSWY9XCJhcHBlYXJhbmNlICE9ICdvdXRsaW5lJ1wiPlxuICAgIDxzcGFuIGNsYXNzPVwibWF0LWZvcm0tZmllbGQtcmlwcGxlXCJcbiAgICAgICAgICBbY2xhc3MubWF0LWFjY2VudF09XCJjb2xvciA9PSAnYWNjZW50J1wiXG4gICAgICAgICAgW2NsYXNzLm1hdC13YXJuXT1cImNvbG9yID09ICd3YXJuJ1wiPjwvc3Bhbj5cbiAgPC9kaXY+XG5cbiAgPGRpdiBjbGFzcz1cIm1hdC1mb3JtLWZpZWxkLXN1YnNjcmlwdC13cmFwcGVyXCJcbiAgICAgICBbbmdTd2l0Y2hdPVwiX2dldERpc3BsYXllZE1lc3NhZ2VzKClcIj5cbiAgICA8ZGl2ICpuZ1N3aXRjaENhc2U9XCInZXJyb3InXCIgW0B0cmFuc2l0aW9uTWVzc2FnZXNdPVwiX3N1YnNjcmlwdEFuaW1hdGlvblN0YXRlXCI+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJtYXQtZXJyb3JcIj48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwibWF0LWZvcm0tZmllbGQtaGludC13cmFwcGVyXCIgKm5nU3dpdGNoQ2FzZT1cIidoaW50J1wiXG4gICAgICBbQHRyYW5zaXRpb25NZXNzYWdlc109XCJfc3Vic2NyaXB0QW5pbWF0aW9uU3RhdGVcIj5cbiAgICAgIDwhLS0gVE9ETyhtbWFsZXJiYSk6IHVzZSBhbiBhY3R1YWwgPG1hdC1oaW50PiBvbmNlIGFsbCBzZWxlY3RvcnMgYXJlIHN3aXRjaGVkIHRvIG1hdC0qIC0tPlxuICAgICAgPGRpdiAqbmdJZj1cImhpbnRMYWJlbFwiIFtpZF09XCJfaGludExhYmVsSWRcIiBjbGFzcz1cIm1hdC1oaW50XCI+e3toaW50TGFiZWx9fTwvZGl2PlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwibWF0LWhpbnQ6bm90KFthbGlnbj0nZW5kJ10pXCI+PC9uZy1jb250ZW50PlxuICAgICAgPGRpdiBjbGFzcz1cIm1hdC1mb3JtLWZpZWxkLWhpbnQtc3BhY2VyXCI+PC9kaXY+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJtYXQtaGludFthbGlnbj0nZW5kJ11cIj48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG4iXX0=
