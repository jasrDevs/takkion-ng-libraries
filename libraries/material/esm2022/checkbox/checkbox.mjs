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
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  NgZone,
  numberAttribute,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation,
  ANIMATION_MODULE_TYPE,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { _MatInternalFormField, MatRipple } from '@takkion/material/core';
import {
  MAT_CHECKBOX_DEFAULT_OPTIONS,
  MAT_CHECKBOX_DEFAULT_OPTIONS_FACTORY,
} from './checkbox-config';
import * as i0 from '@angular/core';
/**
 * Represents the different states that require custom transitions between them.
 * @docs-private
 */
export var TransitionCheckState;
(function (TransitionCheckState) {
  /** The initial state of the component before any user interaction. */
  TransitionCheckState[(TransitionCheckState['Init'] = 0)] = 'Init';
  /** The state representing the component when it's becoming checked. */
  TransitionCheckState[(TransitionCheckState['Checked'] = 1)] = 'Checked';
  /** The state representing the component when it's becoming unchecked. */
  TransitionCheckState[(TransitionCheckState['Unchecked'] = 2)] = 'Unchecked';
  /** The state representing the component when it's becoming indeterminate. */
  TransitionCheckState[(TransitionCheckState['Indeterminate'] = 3)] = 'Indeterminate';
})(TransitionCheckState || (TransitionCheckState = {}));
/**
 * @deprecated Will stop being exported.
 * @breaking-change 19.0.0
 */
export const MAT_CHECKBOX_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatCheckbox),
  multi: true,
};
/** Change event object emitted by checkbox. */
export class MatCheckboxChange {}
// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;
// Default checkbox configuration.
const defaults = MAT_CHECKBOX_DEFAULT_OPTIONS_FACTORY();
export class MatCheckbox {
  /** Focuses the checkbox. */
  focus() {
    this._inputElement.nativeElement.focus();
  }
  /** Creates the change event that will be emitted by the checkbox. */
  _createChangeEvent(isChecked) {
    const event = new MatCheckboxChange();
    event.source = this;
    event.checked = isChecked;
    return event;
  }
  /** Gets the element on which to add the animation CSS classes. */
  _getAnimationTargetElement() {
    return this._inputElement?.nativeElement;
  }
  /** Returns the unique id for the visual hidden input. */
  get inputId() {
    return `${this.id || this._uniqueId}-input`;
  }
  constructor(_elementRef, _changeDetectorRef, _ngZone, tabIndex, _animationMode, _options) {
    this._elementRef = _elementRef;
    this._changeDetectorRef = _changeDetectorRef;
    this._ngZone = _ngZone;
    this._animationMode = _animationMode;
    this._options = _options;
    /** CSS classes to add when transitioning between the different checkbox states. */
    this._animationClasses = {
      uncheckedToChecked: 'mdc-checkbox--anim-unchecked-checked',
      uncheckedToIndeterminate: 'mdc-checkbox--anim-unchecked-indeterminate',
      checkedToUnchecked: 'mdc-checkbox--anim-checked-unchecked',
      checkedToIndeterminate: 'mdc-checkbox--anim-checked-indeterminate',
      indeterminateToChecked: 'mdc-checkbox--anim-indeterminate-checked',
      indeterminateToUnchecked: 'mdc-checkbox--anim-indeterminate-unchecked',
    };
    /**
     * Attached to the aria-label attribute of the host element. In most cases, aria-labelledby will
     * take precedence so this may be omitted.
     */
    this.ariaLabel = '';
    /**
     * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
     */
    this.ariaLabelledby = null;
    /** Whether the label should appear after or before the checkbox. Defaults to 'after' */
    this.labelPosition = 'after';
    /** Name value will be applied to the input element if present */
    this.name = null;
    /** Event emitted when the checkbox's `checked` value changes. */
    this.change = new EventEmitter();
    /** Event emitted when the checkbox's `indeterminate` value changes. */
    this.indeterminateChange = new EventEmitter();
    /**
     * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
     * @docs-private
     */
    this._onTouched = () => {};
    this._currentAnimationClass = '';
    this._currentCheckState = TransitionCheckState.Init;
    this._controlValueAccessorChangeFn = () => {};
    this._validatorChangeFn = () => {};
    this._checked = false;
    this._disabled = false;
    this._indeterminate = false;
    this._options = this._options || defaults;
    this.color = this._options.color || defaults.color;
    this.tabIndex = parseInt(tabIndex) || 0;
    this.id = this._uniqueId = `mat-mdc-checkbox-${++nextUniqueId}`;
  }
  ngOnChanges(changes) {
    if (changes['required']) {
      this._validatorChangeFn();
    }
  }
  ngAfterViewInit() {
    this._syncIndeterminate(this._indeterminate);
  }
  /** Whether the checkbox is checked. */
  get checked() {
    return this._checked;
  }
  set checked(value) {
    if (value != this.checked) {
      this._checked = value;
      this._changeDetectorRef.markForCheck();
    }
  }
  /** Whether the checkbox is disabled. */
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    if (value !== this.disabled) {
      this._disabled = value;
      this._changeDetectorRef.markForCheck();
    }
  }
  /**
   * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
   * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
   * checkable items. Note that whenever checkbox is manually clicked, indeterminate is immediately
   * set to false.
   */
  get indeterminate() {
    return this._indeterminate;
  }
  set indeterminate(value) {
    const changed = value != this._indeterminate;
    this._indeterminate = value;
    if (changed) {
      if (this._indeterminate) {
        this._transitionCheckState(TransitionCheckState.Indeterminate);
      } else {
        this._transitionCheckState(
          this.checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked
        );
      }
      this.indeterminateChange.emit(this._indeterminate);
    }
    this._syncIndeterminate(this._indeterminate);
  }
  _isRippleDisabled() {
    return this.disableRipple || this.disabled;
  }
  /** Method being called whenever the label text changes. */
  _onLabelTextChange() {
    // Since the event of the `cdkObserveContent` directive runs outside of the zone, the checkbox
    // component will be only marked for check, but no actual change detection runs automatically.
    // Instead of going back into the zone in order to trigger a change detection which causes
    // *all* components to be checked (if explicitly marked or not using OnPush), we only trigger
    // an explicit change detection for the checkbox view and its children.
    this._changeDetectorRef.detectChanges();
  }
  // Implemented as part of ControlValueAccessor.
  writeValue(value) {
    this.checked = !!value;
  }
  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn) {
    this._controlValueAccessorChangeFn = fn;
  }
  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
  // Implemented as a part of Validator.
  validate(control) {
    return this.required && control.value !== true ? { required: true } : null;
  }
  // Implemented as a part of Validator.
  registerOnValidatorChange(fn) {
    this._validatorChangeFn = fn;
  }
  _transitionCheckState(newState) {
    let oldState = this._currentCheckState;
    let element = this._getAnimationTargetElement();
    if (oldState === newState || !element) {
      return;
    }
    if (this._currentAnimationClass) {
      element.classList.remove(this._currentAnimationClass);
    }
    this._currentAnimationClass = this._getAnimationClassForCheckStateTransition(
      oldState,
      newState
    );
    this._currentCheckState = newState;
    if (this._currentAnimationClass.length > 0) {
      element.classList.add(this._currentAnimationClass);
      // Remove the animation class to avoid animation when the checkbox is moved between containers
      const animationClass = this._currentAnimationClass;
      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          element.classList.remove(animationClass);
        }, 1000);
      });
    }
  }
  _emitChangeEvent() {
    this._controlValueAccessorChangeFn(this.checked);
    this.change.emit(this._createChangeEvent(this.checked));
    // Assigning the value again here is redundant, but we have to do it in case it was
    // changed inside the `change` listener which will cause the input to be out of sync.
    if (this._inputElement) {
      this._inputElement.nativeElement.checked = this.checked;
    }
  }
  /** Toggles the `checked` state of the checkbox. */
  toggle() {
    this.checked = !this.checked;
    this._controlValueAccessorChangeFn(this.checked);
  }
  _handleInputClick() {
    const clickAction = this._options?.clickAction;
    // If resetIndeterminate is false, and the current state is indeterminate, do nothing on click
    if (!this.disabled && clickAction !== 'noop') {
      // When user manually click on the checkbox, `indeterminate` is set to false.
      if (this.indeterminate && clickAction !== 'check') {
        Promise.resolve().then(() => {
          this._indeterminate = false;
          this.indeterminateChange.emit(this._indeterminate);
        });
      }
      this._checked = !this._checked;
      this._transitionCheckState(
        this._checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked
      );
      // Emit our custom change event if the native input emitted one.
      // It is important to only emit it, if the native input triggered one, because
      // we don't want to trigger a change event, when the `checked` variable changes for example.
      this._emitChangeEvent();
    } else if (!this.disabled && clickAction === 'noop') {
      // Reset native input when clicked with noop. The native checkbox becomes checked after
      // click, reset it to be align with `checked` value of `mat-checkbox`.
      this._inputElement.nativeElement.checked = this.checked;
      this._inputElement.nativeElement.indeterminate = this.indeterminate;
    }
  }
  _onInteractionEvent(event) {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();
  }
  _onBlur() {
    // When a focused element becomes disabled, the browser *immediately* fires a blur event.
    // Angular does not expect events to be raised during change detection, so any state change
    // (such as a form control's 'ng-touched') will cause a changed-after-checked error.
    // See https://github.com/angular/angular/issues/17793. To work around this, we defer
    // telling the form control it has been touched until the next tick.
    Promise.resolve().then(() => {
      this._onTouched();
      this._changeDetectorRef.markForCheck();
    });
  }
  _getAnimationClassForCheckStateTransition(oldState, newState) {
    // Don't transition if animations are disabled.
    if (this._animationMode === 'NoopAnimations') {
      return '';
    }
    switch (oldState) {
      case TransitionCheckState.Init:
        // Handle edge case where user interacts with checkbox that does not have [(ngModel)] or
        // [checked] bound to it.
        if (newState === TransitionCheckState.Checked) {
          return this._animationClasses.uncheckedToChecked;
        } else if (newState == TransitionCheckState.Indeterminate) {
          return this._checked
            ? this._animationClasses.checkedToIndeterminate
            : this._animationClasses.uncheckedToIndeterminate;
        }
        break;
      case TransitionCheckState.Unchecked:
        return newState === TransitionCheckState.Checked
          ? this._animationClasses.uncheckedToChecked
          : this._animationClasses.uncheckedToIndeterminate;
      case TransitionCheckState.Checked:
        return newState === TransitionCheckState.Unchecked
          ? this._animationClasses.checkedToUnchecked
          : this._animationClasses.checkedToIndeterminate;
      case TransitionCheckState.Indeterminate:
        return newState === TransitionCheckState.Checked
          ? this._animationClasses.indeterminateToChecked
          : this._animationClasses.indeterminateToUnchecked;
    }
    return '';
  }
  /**
   * Syncs the indeterminate value with the checkbox DOM node.
   *
   * We sync `indeterminate` directly on the DOM node, because in Ivy the check for whether a
   * property is supported on an element boils down to `if (propName in element)`. Domino's
   * HTMLInputElement doesn't have an `indeterminate` property so Ivy will warn during
   * server-side rendering.
   */
  _syncIndeterminate(value) {
    const nativeCheckbox = this._inputElement;
    if (nativeCheckbox) {
      nativeCheckbox.nativeElement.indeterminate = value;
    }
  }
  _onInputClick() {
    this._handleInputClick();
  }
  _onTouchTargetClick() {
    this._handleInputClick();
    if (!this.disabled) {
      // Normally the input should be focused already, but if the click
      // comes from the touch target, then we might have to focus it ourselves.
      this._inputElement.nativeElement.focus();
    }
  }
  /**
   *  Prevent click events that come from the `<label/>` element from bubbling. This prevents the
   *  click handler on the host from triggering twice when clicking on the `<label/>` element. After
   *  the click event on the `<label/>` propagates, the browsers dispatches click on the associated
   *  `<input/>`. By preventing clicks on the label by bubbling, we ensure only one click event
   *  bubbles when the label is clicked.
   */
  _preventBubblingFromLabel(event) {
    if (!!event.target && this._labelElement.nativeElement.contains(event.target)) {
      event.stopPropagation();
    }
  }
  static {
    this.ɵfac = i0.ɵɵngDeclareFactory({
      minVersion: '12.0.0',
      version: '17.2.0',
      ngImport: i0,
      type: MatCheckbox,
      deps: [
        { token: i0.ElementRef },
        { token: i0.ChangeDetectorRef },
        { token: i0.NgZone },
        { token: 'tabindex', attribute: true },
        { token: ANIMATION_MODULE_TYPE, optional: true },
        { token: MAT_CHECKBOX_DEFAULT_OPTIONS, optional: true },
      ],
      target: i0.ɵɵFactoryTarget.Component,
    });
  }
  static {
    this.ɵcmp = i0.ɵɵngDeclareComponent({
      minVersion: '16.1.0',
      version: '17.2.0',
      type: MatCheckbox,
      isStandalone: true,
      selector: 'mat-checkbox',
      inputs: {
        ariaLabel: ['aria-label', 'ariaLabel'],
        ariaLabelledby: ['aria-labelledby', 'ariaLabelledby'],
        ariaDescribedby: ['aria-describedby', 'ariaDescribedby'],
        id: 'id',
        required: ['required', 'required', booleanAttribute],
        labelPosition: 'labelPosition',
        name: 'name',
        value: 'value',
        disableRipple: ['disableRipple', 'disableRipple', booleanAttribute],
        tabIndex: [
          'tabIndex',
          'tabIndex',
          value => (value == null ? undefined : numberAttribute(value)),
        ],
        color: 'color',
        checked: ['checked', 'checked', booleanAttribute],
        disabled: ['disabled', 'disabled', booleanAttribute],
        indeterminate: ['indeterminate', 'indeterminate', booleanAttribute],
      },
      outputs: { change: 'change', indeterminateChange: 'indeterminateChange' },
      host: {
        properties: {
          'attr.tabindex': 'null',
          'attr.aria-label': 'null',
          'attr.aria-labelledby': 'null',
          'class._mat-animation-noopable': "_animationMode === 'NoopAnimations'",
          'class.mdc-checkbox--disabled': 'disabled',
          id: 'id',
          'class.mat-mdc-checkbox-disabled': 'disabled',
          'class.mat-mdc-checkbox-checked': 'checked',
          class: 'color ? "mat-" + color : "mat-accent"',
        },
        classAttribute: 'mat-mdc-checkbox',
      },
      providers: [
        MAT_CHECKBOX_CONTROL_VALUE_ACCESSOR,
        {
          provide: NG_VALIDATORS,
          useExisting: MatCheckbox,
          multi: true,
        },
      ],
      viewQueries: [
        { propertyName: '_inputElement', first: true, predicate: ['input'], descendants: true },
        { propertyName: '_labelElement', first: true, predicate: ['label'], descendants: true },
        { propertyName: 'ripple', first: true, predicate: MatRipple, descendants: true },
      ],
      exportAs: ['matCheckbox'],
      usesOnChanges: true,
      ngImport: i0,
      template:
        '<div mat-internal-form-field [labelPosition]="labelPosition" (click)="_preventBubblingFromLabel($event)">\n  <div #checkbox class="mdc-checkbox">\n    <!-- Render this element first so the input is on top. -->\n    <div class="mat-mdc-checkbox-touch-target" (click)="_onTouchTargetClick()"></div>\n    <input #input\n           type="checkbox"\n           class="mdc-checkbox__native-control"\n           [class.mdc-checkbox--selected]="checked"\n           [attr.aria-label]="ariaLabel || null"\n           [attr.aria-labelledby]="ariaLabelledby"\n           [attr.aria-describedby]="ariaDescribedby"\n           [attr.aria-checked]="indeterminate ? \'mixed\' : null"\n           [attr.name]="name"\n           [attr.value]="value"\n           [checked]="checked"\n           [indeterminate]="indeterminate"\n           [disabled]="disabled"\n           [id]="inputId"\n           [required]="required"\n           [tabIndex]="disabled ? -1 : tabIndex"\n           (blur)="_onBlur()"\n           (click)="_onInputClick()"\n           (change)="_onInteractionEvent($event)"/>\n    <div class="mdc-checkbox__ripple"></div>\n    <div class="mdc-checkbox__background">\n      <svg class="mdc-checkbox__checkmark"\n           focusable="false"\n           viewBox="0 0 24 24"\n           aria-hidden="true">\n        <path class="mdc-checkbox__checkmark-path"\n              fill="none"\n              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>\n      </svg>\n      <div class="mdc-checkbox__mixedmark"></div>\n    </div>\n    <div class="mat-mdc-checkbox-ripple mat-mdc-focus-indicator" mat-ripple\n      [matRippleTrigger]="checkbox"\n      [matRippleDisabled]="disableRipple || disabled"\n      [matRippleCentered]="true"></div>\n  </div>\n  <!--\n    Avoid putting a click handler on the <label/> to fix duplicate navigation stop on Talk Back\n    (#14385). Putting a click handler on the <label/> caused this bug because the browser produced\n    an unnecessary accessibility tree node.\n  -->\n  <label class="mdc-label"\n         #label\n         [for]="inputId">\n    <ng-content></ng-content>\n  </label>\n</div>\n',
      styles: [
        '.mdc-touch-target-wrapper{display:inline}@keyframes mdc-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:29.7833385}50%{animation-timing-function:cubic-bezier(0, 0, 0.2, 1)}100%{stroke-dashoffset:0}}@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0, 0, 0, 1)}100%{transform:scaleX(1)}}@keyframes mdc-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(0.4, 0, 1, 1);opacity:1;stroke-dashoffset:0}to{opacity:0;stroke-dashoffset:-29.7833385}}@keyframes mdc-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 1);transform:rotate(0deg);opacity:1}to{transform:rotate(45deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);transform:rotate(45deg);opacity:0}to{transform:rotate(360deg);opacity:1}}@keyframes mdc-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:mdc-animation-deceleration-curve-timing-function;transform:rotate(-45deg);opacity:0}to{transform:rotate(0deg);opacity:1}}@keyframes mdc-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);transform:rotate(0deg);opacity:1}to{transform:rotate(315deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;transform:scaleX(1);opacity:1}32.8%,100%{transform:scaleX(0);opacity:0}}.mdc-checkbox{display:inline-block;position:relative;flex:0 0 18px;box-sizing:content-box;width:18px;height:18px;line-height:0;white-space:nowrap;cursor:pointer;vertical-align:bottom}.mdc-checkbox[hidden]{display:none}.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring{pointer-events:none;border:2px solid rgba(0,0,0,0);border-radius:6px;box-sizing:content-box;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:100%;width:100%}@media screen and (forced-colors: active){.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring{border-color:CanvasText}}.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring::after,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring::after{content:"";border:2px solid rgba(0,0,0,0);border-radius:8px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:calc(100% + 4px);width:calc(100% + 4px)}@media screen and (forced-colors: active){.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring::after,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring::after{border-color:CanvasText}}@media all and (-ms-high-contrast: none){.mdc-checkbox .mdc-checkbox__focus-ring{display:none}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-checkbox__mixedmark{margin:0 1px}}.mdc-checkbox--disabled{cursor:default;pointer-events:none}.mdc-checkbox__background{display:inline-flex;position:absolute;align-items:center;justify-content:center;box-sizing:border-box;width:18px;height:18px;border:2px solid currentColor;border-radius:2px;background-color:rgba(0,0,0,0);pointer-events:none;will-change:background-color,border-color;transition:background-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),border-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox__checkmark{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;opacity:0;transition:opacity 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox--upgraded .mdc-checkbox__checkmark{opacity:1}.mdc-checkbox__checkmark-path{transition:stroke-dashoffset 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1);stroke:currentColor;stroke-width:3.12px;stroke-dashoffset:29.7833385;stroke-dasharray:29.7833385}.mdc-checkbox__mixedmark{width:100%;height:0;transform:scaleX(0) rotate(0deg);border-width:1px;border-style:solid;opacity:0;transition:opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background{animation-duration:180ms;animation-timing-function:linear}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-unchecked-checked-checkmark-path 180ms linear 0s;transition:none}.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark{animation:mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark{animation:mdc-checkbox-indeterminate-checked-checkmark 500ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-checked-mixedmark 500ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear 0s;transition:none}.mdc-checkbox__native-control:checked~.mdc-checkbox__background,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background{transition:border-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1),background-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark-path{stroke-dashoffset:0}.mdc-checkbox__native-control{position:absolute;margin:0;padding:0;opacity:0;cursor:inherit}.mdc-checkbox__native-control:disabled{cursor:default;pointer-events:none}.mdc-checkbox--touch{margin:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2)}.mdc-checkbox--touch .mdc-checkbox__native-control{top:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2);right:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2);left:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2);width:var(--mdc-checkbox-state-layer-size);height:var(--mdc-checkbox-state-layer-size)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark{transition:opacity 180ms 0ms cubic-bezier(0, 0, 0.2, 1),transform 180ms 0ms cubic-bezier(0, 0, 0.2, 1);opacity:1}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(-45deg)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark{transform:rotate(45deg);opacity:0;transition:opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__mixedmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(0deg);opacity:1}.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark-path,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__mixedmark{transition:none}.mdc-checkbox{padding:calc((var(--mdc-checkbox-state-layer-size) - 18px) / 2);margin:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2)}.mdc-checkbox .mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:var(--mdc-checkbox-disabled-unselected-icon-color);background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true][disabled]~.mdc-checkbox__background{border-color:transparent;background-color:var(--mdc-checkbox-disabled-selected-icon-color)}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:var(--mdc-checkbox-selected-checkmark-color)}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:var(--mdc-checkbox-selected-checkmark-color)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:var(--mdc-checkbox-disabled-selected-checkmark-color)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:var(--mdc-checkbox-disabled-selected-checkmark-color)}.mdc-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:var(--mdc-checkbox-unselected-icon-color);background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true]:enabled~.mdc-checkbox__background{border-color:var(--mdc-checkbox-selected-icon-color);background-color:var(--mdc-checkbox-selected-icon-color)}@keyframes mdc-checkbox-fade-in-background-8A000000FFF4433600000000FFF44336{0%{border-color:var(--mdc-checkbox-unselected-icon-color);background-color:transparent}50%{border-color:var(--mdc-checkbox-selected-icon-color);background-color:var(--mdc-checkbox-selected-icon-color)}}@keyframes mdc-checkbox-fade-out-background-8A000000FFF4433600000000FFF44336{0%,80%{border-color:var(--mdc-checkbox-selected-icon-color);background-color:var(--mdc-checkbox-selected-icon-color)}100%{border-color:var(--mdc-checkbox-unselected-icon-color);background-color:transparent}}.mdc-checkbox.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-in-background-8A000000FFF4433600000000FFF44336}.mdc-checkbox.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-out-background-8A000000FFF4433600000000FFF44336}.mdc-checkbox:hover .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:var(--mdc-checkbox-unselected-hover-icon-color);background-color:transparent}.mdc-checkbox:hover .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox:hover .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background,.mdc-checkbox:hover .mdc-checkbox__native-control[data-indeterminate=true]:enabled~.mdc-checkbox__background{border-color:var(--mdc-checkbox-selected-hover-icon-color);background-color:var(--mdc-checkbox-selected-hover-icon-color)}@keyframes mdc-checkbox-fade-in-background-FF212121FFF4433600000000FFF44336{0%{border-color:var(--mdc-checkbox-unselected-hover-icon-color);background-color:transparent}50%{border-color:var(--mdc-checkbox-selected-hover-icon-color);background-color:var(--mdc-checkbox-selected-hover-icon-color)}}@keyframes mdc-checkbox-fade-out-background-FF212121FFF4433600000000FFF44336{0%,80%{border-color:var(--mdc-checkbox-selected-hover-icon-color);background-color:var(--mdc-checkbox-selected-hover-icon-color)}100%{border-color:var(--mdc-checkbox-unselected-hover-icon-color);background-color:transparent}}.mdc-checkbox:hover.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox:hover.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-in-background-FF212121FFF4433600000000FFF44336}.mdc-checkbox:hover.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox:hover.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-out-background-FF212121FFF4433600000000FFF44336}.mdc-checkbox:not(:disabled):active .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:var(--mdc-checkbox-unselected-pressed-icon-color);background-color:transparent}.mdc-checkbox:not(:disabled):active .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox:not(:disabled):active .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background,.mdc-checkbox:not(:disabled):active .mdc-checkbox__native-control[data-indeterminate=true]:enabled~.mdc-checkbox__background{border-color:var(--mdc-checkbox-selected-pressed-icon-color);background-color:var(--mdc-checkbox-selected-pressed-icon-color)}@keyframes mdc-checkbox-fade-in-background-8A000000FFF4433600000000FFF44336{0%{border-color:var(--mdc-checkbox-unselected-pressed-icon-color);background-color:transparent}50%{border-color:var(--mdc-checkbox-selected-pressed-icon-color);background-color:var(--mdc-checkbox-selected-pressed-icon-color)}}@keyframes mdc-checkbox-fade-out-background-8A000000FFF4433600000000FFF44336{0%,80%{border-color:var(--mdc-checkbox-selected-pressed-icon-color);background-color:var(--mdc-checkbox-selected-pressed-icon-color)}100%{border-color:var(--mdc-checkbox-unselected-pressed-icon-color);background-color:transparent}}.mdc-checkbox:not(:disabled):active.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox:not(:disabled):active.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-in-background-8A000000FFF4433600000000FFF44336}.mdc-checkbox:not(:disabled):active.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox:not(:disabled):active.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-out-background-8A000000FFF4433600000000FFF44336}.mdc-checkbox .mdc-checkbox__background{top:calc((var(--mdc-checkbox-state-layer-size) - 18px) / 2);left:calc((var(--mdc-checkbox-state-layer-size) - 18px) / 2)}.mdc-checkbox .mdc-checkbox__native-control{top:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2);right:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2);left:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2);width:var(--mdc-checkbox-state-layer-size);height:var(--mdc-checkbox-state-layer-size)}.mdc-checkbox .mdc-checkbox__native-control:enabled:focus:focus:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--mdc-checkbox-unselected-focus-icon-color)}.mdc-checkbox .mdc-checkbox__native-control:enabled:focus:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control:enabled:focus:indeterminate~.mdc-checkbox__background{border-color:var(--mdc-checkbox-selected-focus-icon-color);background-color:var(--mdc-checkbox-selected-focus-icon-color)}.mdc-checkbox:hover .mdc-checkbox__ripple{opacity:var(--mdc-checkbox-unselected-hover-state-layer-opacity);background-color:var(--mdc-checkbox-unselected-hover-state-layer-color)}.mdc-checkbox:hover .mat-mdc-checkbox-ripple .mat-ripple-element{background-color:var(--mdc-checkbox-unselected-hover-state-layer-color)}.mdc-checkbox .mdc-checkbox__native-control:focus~.mdc-checkbox__ripple{opacity:var(--mdc-checkbox-unselected-focus-state-layer-opacity);background-color:var(--mdc-checkbox-unselected-focus-state-layer-color)}.mdc-checkbox .mdc-checkbox__native-control:focus~.mat-mdc-checkbox-ripple .mat-ripple-element{background-color:var(--mdc-checkbox-unselected-focus-state-layer-color)}.mdc-checkbox:active .mdc-checkbox__native-control~.mdc-checkbox__ripple{opacity:var(--mdc-checkbox-unselected-pressed-state-layer-opacity);background-color:var(--mdc-checkbox-unselected-pressed-state-layer-color)}.mdc-checkbox:active .mdc-checkbox__native-control~.mat-mdc-checkbox-ripple .mat-ripple-element{background-color:var(--mdc-checkbox-unselected-pressed-state-layer-color)}.mdc-checkbox:hover .mdc-checkbox__native-control:checked~.mdc-checkbox__ripple{opacity:var(--mdc-checkbox-selected-hover-state-layer-opacity);background-color:var(--mdc-checkbox-selected-hover-state-layer-color)}.mdc-checkbox:hover .mdc-checkbox__native-control:checked~.mat-mdc-checkbox-ripple .mat-ripple-element{background-color:var(--mdc-checkbox-selected-hover-state-layer-color)}.mdc-checkbox .mdc-checkbox__native-control:focus:checked~.mdc-checkbox__ripple{opacity:var(--mdc-checkbox-selected-focus-state-layer-opacity);background-color:var(--mdc-checkbox-selected-focus-state-layer-color)}.mdc-checkbox .mdc-checkbox__native-control:focus:checked~.mat-mdc-checkbox-ripple .mat-ripple-element{background-color:var(--mdc-checkbox-selected-focus-state-layer-color)}.mdc-checkbox:active .mdc-checkbox__native-control:checked~.mdc-checkbox__ripple{opacity:var(--mdc-checkbox-selected-pressed-state-layer-opacity);background-color:var(--mdc-checkbox-selected-pressed-state-layer-color)}.mdc-checkbox:active .mdc-checkbox__native-control:checked~.mat-mdc-checkbox-ripple .mat-ripple-element{background-color:var(--mdc-checkbox-selected-pressed-state-layer-color)}.mat-mdc-checkbox{display:inline-block;position:relative;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-checkbox .mdc-checkbox__background{-webkit-print-color-adjust:exact;color-adjust:exact}.mat-mdc-checkbox._mat-animation-noopable *,.mat-mdc-checkbox._mat-animation-noopable *::before{transition:none !important;animation:none !important}.mat-mdc-checkbox label{cursor:pointer}.mat-mdc-checkbox.mat-mdc-checkbox-disabled label{cursor:default;color:var(--mat-checkbox-disabled-label-color)}.mat-mdc-checkbox label:empty{display:none}.cdk-high-contrast-active .mat-mdc-checkbox.mat-mdc-checkbox-disabled{opacity:.5}.cdk-high-contrast-active .mat-mdc-checkbox .mdc-checkbox__checkmark{--mdc-checkbox-selected-checkmark-color: CanvasText;--mdc-checkbox-disabled-selected-checkmark-color: CanvasText}.mat-mdc-checkbox .mdc-checkbox__ripple{opacity:0}.mat-mdc-checkbox-ripple,.mdc-checkbox__ripple{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:50%;pointer-events:none}.mat-mdc-checkbox-ripple:not(:empty),.mdc-checkbox__ripple:not(:empty){transform:translateZ(0)}.mat-mdc-checkbox-ripple .mat-ripple-element{opacity:.1}.mat-mdc-checkbox-touch-target{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%);display:var(--mat-checkbox-touch-target-display)}.mat-mdc-checkbox-ripple::before{border-radius:50%}.mdc-checkbox__native-control:focus~.mat-mdc-focus-indicator::before{content:""}',
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
          kind: 'component',
          type: _MatInternalFormField,
          selector: 'div[mat-internal-form-field]',
          inputs: ['labelPosition'],
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
  type: MatCheckbox,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-checkbox',
          host: {
            class: 'mat-mdc-checkbox',
            '[attr.tabindex]': 'null',
            '[attr.aria-label]': 'null',
            '[attr.aria-labelledby]': 'null',
            '[class._mat-animation-noopable]': `_animationMode === 'NoopAnimations'`,
            '[class.mdc-checkbox--disabled]': 'disabled',
            '[id]': 'id',
            // Add classes that users can use to more easily target disabled or checked checkboxes.
            '[class.mat-mdc-checkbox-disabled]': 'disabled',
            '[class.mat-mdc-checkbox-checked]': 'checked',
            '[class]': 'color ? "mat-" + color : "mat-accent"',
          },
          providers: [
            MAT_CHECKBOX_CONTROL_VALUE_ACCESSOR,
            {
              provide: NG_VALIDATORS,
              useExisting: MatCheckbox,
              multi: true,
            },
          ],
          exportAs: 'matCheckbox',
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          standalone: true,
          imports: [MatRipple, _MatInternalFormField],
          template:
            '<div mat-internal-form-field [labelPosition]="labelPosition" (click)="_preventBubblingFromLabel($event)">\n  <div #checkbox class="mdc-checkbox">\n    <!-- Render this element first so the input is on top. -->\n    <div class="mat-mdc-checkbox-touch-target" (click)="_onTouchTargetClick()"></div>\n    <input #input\n           type="checkbox"\n           class="mdc-checkbox__native-control"\n           [class.mdc-checkbox--selected]="checked"\n           [attr.aria-label]="ariaLabel || null"\n           [attr.aria-labelledby]="ariaLabelledby"\n           [attr.aria-describedby]="ariaDescribedby"\n           [attr.aria-checked]="indeterminate ? \'mixed\' : null"\n           [attr.name]="name"\n           [attr.value]="value"\n           [checked]="checked"\n           [indeterminate]="indeterminate"\n           [disabled]="disabled"\n           [id]="inputId"\n           [required]="required"\n           [tabIndex]="disabled ? -1 : tabIndex"\n           (blur)="_onBlur()"\n           (click)="_onInputClick()"\n           (change)="_onInteractionEvent($event)"/>\n    <div class="mdc-checkbox__ripple"></div>\n    <div class="mdc-checkbox__background">\n      <svg class="mdc-checkbox__checkmark"\n           focusable="false"\n           viewBox="0 0 24 24"\n           aria-hidden="true">\n        <path class="mdc-checkbox__checkmark-path"\n              fill="none"\n              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>\n      </svg>\n      <div class="mdc-checkbox__mixedmark"></div>\n    </div>\n    <div class="mat-mdc-checkbox-ripple mat-mdc-focus-indicator" mat-ripple\n      [matRippleTrigger]="checkbox"\n      [matRippleDisabled]="disableRipple || disabled"\n      [matRippleCentered]="true"></div>\n  </div>\n  <!--\n    Avoid putting a click handler on the <label/> to fix duplicate navigation stop on Talk Back\n    (#14385). Putting a click handler on the <label/> caused this bug because the browser produced\n    an unnecessary accessibility tree node.\n  -->\n  <label class="mdc-label"\n         #label\n         [for]="inputId">\n    <ng-content></ng-content>\n  </label>\n</div>\n',
          styles: [
            '.mdc-touch-target-wrapper{display:inline}@keyframes mdc-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:29.7833385}50%{animation-timing-function:cubic-bezier(0, 0, 0.2, 1)}100%{stroke-dashoffset:0}}@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0, 0, 0, 1)}100%{transform:scaleX(1)}}@keyframes mdc-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(0.4, 0, 1, 1);opacity:1;stroke-dashoffset:0}to{opacity:0;stroke-dashoffset:-29.7833385}}@keyframes mdc-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 1);transform:rotate(0deg);opacity:1}to{transform:rotate(45deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);transform:rotate(45deg);opacity:0}to{transform:rotate(360deg);opacity:1}}@keyframes mdc-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:mdc-animation-deceleration-curve-timing-function;transform:rotate(-45deg);opacity:0}to{transform:rotate(0deg);opacity:1}}@keyframes mdc-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);transform:rotate(0deg);opacity:1}to{transform:rotate(315deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;transform:scaleX(1);opacity:1}32.8%,100%{transform:scaleX(0);opacity:0}}.mdc-checkbox{display:inline-block;position:relative;flex:0 0 18px;box-sizing:content-box;width:18px;height:18px;line-height:0;white-space:nowrap;cursor:pointer;vertical-align:bottom}.mdc-checkbox[hidden]{display:none}.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring{pointer-events:none;border:2px solid rgba(0,0,0,0);border-radius:6px;box-sizing:content-box;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:100%;width:100%}@media screen and (forced-colors: active){.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring{border-color:CanvasText}}.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring::after,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring::after{content:"";border:2px solid rgba(0,0,0,0);border-radius:8px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:calc(100% + 4px);width:calc(100% + 4px)}@media screen and (forced-colors: active){.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring::after,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring::after{border-color:CanvasText}}@media all and (-ms-high-contrast: none){.mdc-checkbox .mdc-checkbox__focus-ring{display:none}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-checkbox__mixedmark{margin:0 1px}}.mdc-checkbox--disabled{cursor:default;pointer-events:none}.mdc-checkbox__background{display:inline-flex;position:absolute;align-items:center;justify-content:center;box-sizing:border-box;width:18px;height:18px;border:2px solid currentColor;border-radius:2px;background-color:rgba(0,0,0,0);pointer-events:none;will-change:background-color,border-color;transition:background-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),border-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox__checkmark{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;opacity:0;transition:opacity 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox--upgraded .mdc-checkbox__checkmark{opacity:1}.mdc-checkbox__checkmark-path{transition:stroke-dashoffset 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1);stroke:currentColor;stroke-width:3.12px;stroke-dashoffset:29.7833385;stroke-dasharray:29.7833385}.mdc-checkbox__mixedmark{width:100%;height:0;transform:scaleX(0) rotate(0deg);border-width:1px;border-style:solid;opacity:0;transition:opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background{animation-duration:180ms;animation-timing-function:linear}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-unchecked-checked-checkmark-path 180ms linear 0s;transition:none}.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark{animation:mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark{animation:mdc-checkbox-indeterminate-checked-checkmark 500ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-checked-mixedmark 500ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear 0s;transition:none}.mdc-checkbox__native-control:checked~.mdc-checkbox__background,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background{transition:border-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1),background-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark-path{stroke-dashoffset:0}.mdc-checkbox__native-control{position:absolute;margin:0;padding:0;opacity:0;cursor:inherit}.mdc-checkbox__native-control:disabled{cursor:default;pointer-events:none}.mdc-checkbox--touch{margin:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2)}.mdc-checkbox--touch .mdc-checkbox__native-control{top:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2);right:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2);left:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2);width:var(--mdc-checkbox-state-layer-size);height:var(--mdc-checkbox-state-layer-size)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark{transition:opacity 180ms 0ms cubic-bezier(0, 0, 0.2, 1),transform 180ms 0ms cubic-bezier(0, 0, 0.2, 1);opacity:1}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(-45deg)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark{transform:rotate(45deg);opacity:0;transition:opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__mixedmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(0deg);opacity:1}.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark-path,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__mixedmark{transition:none}.mdc-checkbox{padding:calc((var(--mdc-checkbox-state-layer-size) - 18px) / 2);margin:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2)}.mdc-checkbox .mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:var(--mdc-checkbox-disabled-unselected-icon-color);background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true][disabled]~.mdc-checkbox__background{border-color:transparent;background-color:var(--mdc-checkbox-disabled-selected-icon-color)}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:var(--mdc-checkbox-selected-checkmark-color)}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:var(--mdc-checkbox-selected-checkmark-color)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:var(--mdc-checkbox-disabled-selected-checkmark-color)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:var(--mdc-checkbox-disabled-selected-checkmark-color)}.mdc-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:var(--mdc-checkbox-unselected-icon-color);background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true]:enabled~.mdc-checkbox__background{border-color:var(--mdc-checkbox-selected-icon-color);background-color:var(--mdc-checkbox-selected-icon-color)}@keyframes mdc-checkbox-fade-in-background-8A000000FFF4433600000000FFF44336{0%{border-color:var(--mdc-checkbox-unselected-icon-color);background-color:transparent}50%{border-color:var(--mdc-checkbox-selected-icon-color);background-color:var(--mdc-checkbox-selected-icon-color)}}@keyframes mdc-checkbox-fade-out-background-8A000000FFF4433600000000FFF44336{0%,80%{border-color:var(--mdc-checkbox-selected-icon-color);background-color:var(--mdc-checkbox-selected-icon-color)}100%{border-color:var(--mdc-checkbox-unselected-icon-color);background-color:transparent}}.mdc-checkbox.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-in-background-8A000000FFF4433600000000FFF44336}.mdc-checkbox.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-out-background-8A000000FFF4433600000000FFF44336}.mdc-checkbox:hover .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:var(--mdc-checkbox-unselected-hover-icon-color);background-color:transparent}.mdc-checkbox:hover .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox:hover .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background,.mdc-checkbox:hover .mdc-checkbox__native-control[data-indeterminate=true]:enabled~.mdc-checkbox__background{border-color:var(--mdc-checkbox-selected-hover-icon-color);background-color:var(--mdc-checkbox-selected-hover-icon-color)}@keyframes mdc-checkbox-fade-in-background-FF212121FFF4433600000000FFF44336{0%{border-color:var(--mdc-checkbox-unselected-hover-icon-color);background-color:transparent}50%{border-color:var(--mdc-checkbox-selected-hover-icon-color);background-color:var(--mdc-checkbox-selected-hover-icon-color)}}@keyframes mdc-checkbox-fade-out-background-FF212121FFF4433600000000FFF44336{0%,80%{border-color:var(--mdc-checkbox-selected-hover-icon-color);background-color:var(--mdc-checkbox-selected-hover-icon-color)}100%{border-color:var(--mdc-checkbox-unselected-hover-icon-color);background-color:transparent}}.mdc-checkbox:hover.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox:hover.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-in-background-FF212121FFF4433600000000FFF44336}.mdc-checkbox:hover.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox:hover.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-out-background-FF212121FFF4433600000000FFF44336}.mdc-checkbox:not(:disabled):active .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:var(--mdc-checkbox-unselected-pressed-icon-color);background-color:transparent}.mdc-checkbox:not(:disabled):active .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox:not(:disabled):active .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background,.mdc-checkbox:not(:disabled):active .mdc-checkbox__native-control[data-indeterminate=true]:enabled~.mdc-checkbox__background{border-color:var(--mdc-checkbox-selected-pressed-icon-color);background-color:var(--mdc-checkbox-selected-pressed-icon-color)}@keyframes mdc-checkbox-fade-in-background-8A000000FFF4433600000000FFF44336{0%{border-color:var(--mdc-checkbox-unselected-pressed-icon-color);background-color:transparent}50%{border-color:var(--mdc-checkbox-selected-pressed-icon-color);background-color:var(--mdc-checkbox-selected-pressed-icon-color)}}@keyframes mdc-checkbox-fade-out-background-8A000000FFF4433600000000FFF44336{0%,80%{border-color:var(--mdc-checkbox-selected-pressed-icon-color);background-color:var(--mdc-checkbox-selected-pressed-icon-color)}100%{border-color:var(--mdc-checkbox-unselected-pressed-icon-color);background-color:transparent}}.mdc-checkbox:not(:disabled):active.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox:not(:disabled):active.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-in-background-8A000000FFF4433600000000FFF44336}.mdc-checkbox:not(:disabled):active.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox:not(:disabled):active.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-out-background-8A000000FFF4433600000000FFF44336}.mdc-checkbox .mdc-checkbox__background{top:calc((var(--mdc-checkbox-state-layer-size) - 18px) / 2);left:calc((var(--mdc-checkbox-state-layer-size) - 18px) / 2)}.mdc-checkbox .mdc-checkbox__native-control{top:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2);right:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2);left:calc((var(--mdc-checkbox-state-layer-size) - var(--mdc-checkbox-state-layer-size)) / 2);width:var(--mdc-checkbox-state-layer-size);height:var(--mdc-checkbox-state-layer-size)}.mdc-checkbox .mdc-checkbox__native-control:enabled:focus:focus:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:var(--mdc-checkbox-unselected-focus-icon-color)}.mdc-checkbox .mdc-checkbox__native-control:enabled:focus:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control:enabled:focus:indeterminate~.mdc-checkbox__background{border-color:var(--mdc-checkbox-selected-focus-icon-color);background-color:var(--mdc-checkbox-selected-focus-icon-color)}.mdc-checkbox:hover .mdc-checkbox__ripple{opacity:var(--mdc-checkbox-unselected-hover-state-layer-opacity);background-color:var(--mdc-checkbox-unselected-hover-state-layer-color)}.mdc-checkbox:hover .mat-mdc-checkbox-ripple .mat-ripple-element{background-color:var(--mdc-checkbox-unselected-hover-state-layer-color)}.mdc-checkbox .mdc-checkbox__native-control:focus~.mdc-checkbox__ripple{opacity:var(--mdc-checkbox-unselected-focus-state-layer-opacity);background-color:var(--mdc-checkbox-unselected-focus-state-layer-color)}.mdc-checkbox .mdc-checkbox__native-control:focus~.mat-mdc-checkbox-ripple .mat-ripple-element{background-color:var(--mdc-checkbox-unselected-focus-state-layer-color)}.mdc-checkbox:active .mdc-checkbox__native-control~.mdc-checkbox__ripple{opacity:var(--mdc-checkbox-unselected-pressed-state-layer-opacity);background-color:var(--mdc-checkbox-unselected-pressed-state-layer-color)}.mdc-checkbox:active .mdc-checkbox__native-control~.mat-mdc-checkbox-ripple .mat-ripple-element{background-color:var(--mdc-checkbox-unselected-pressed-state-layer-color)}.mdc-checkbox:hover .mdc-checkbox__native-control:checked~.mdc-checkbox__ripple{opacity:var(--mdc-checkbox-selected-hover-state-layer-opacity);background-color:var(--mdc-checkbox-selected-hover-state-layer-color)}.mdc-checkbox:hover .mdc-checkbox__native-control:checked~.mat-mdc-checkbox-ripple .mat-ripple-element{background-color:var(--mdc-checkbox-selected-hover-state-layer-color)}.mdc-checkbox .mdc-checkbox__native-control:focus:checked~.mdc-checkbox__ripple{opacity:var(--mdc-checkbox-selected-focus-state-layer-opacity);background-color:var(--mdc-checkbox-selected-focus-state-layer-color)}.mdc-checkbox .mdc-checkbox__native-control:focus:checked~.mat-mdc-checkbox-ripple .mat-ripple-element{background-color:var(--mdc-checkbox-selected-focus-state-layer-color)}.mdc-checkbox:active .mdc-checkbox__native-control:checked~.mdc-checkbox__ripple{opacity:var(--mdc-checkbox-selected-pressed-state-layer-opacity);background-color:var(--mdc-checkbox-selected-pressed-state-layer-color)}.mdc-checkbox:active .mdc-checkbox__native-control:checked~.mat-mdc-checkbox-ripple .mat-ripple-element{background-color:var(--mdc-checkbox-selected-pressed-state-layer-color)}.mat-mdc-checkbox{display:inline-block;position:relative;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-checkbox .mdc-checkbox__background{-webkit-print-color-adjust:exact;color-adjust:exact}.mat-mdc-checkbox._mat-animation-noopable *,.mat-mdc-checkbox._mat-animation-noopable *::before{transition:none !important;animation:none !important}.mat-mdc-checkbox label{cursor:pointer}.mat-mdc-checkbox.mat-mdc-checkbox-disabled label{cursor:default;color:var(--mat-checkbox-disabled-label-color)}.mat-mdc-checkbox label:empty{display:none}.cdk-high-contrast-active .mat-mdc-checkbox.mat-mdc-checkbox-disabled{opacity:.5}.cdk-high-contrast-active .mat-mdc-checkbox .mdc-checkbox__checkmark{--mdc-checkbox-selected-checkmark-color: CanvasText;--mdc-checkbox-disabled-selected-checkmark-color: CanvasText}.mat-mdc-checkbox .mdc-checkbox__ripple{opacity:0}.mat-mdc-checkbox-ripple,.mdc-checkbox__ripple{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:50%;pointer-events:none}.mat-mdc-checkbox-ripple:not(:empty),.mdc-checkbox__ripple:not(:empty){transform:translateZ(0)}.mat-mdc-checkbox-ripple .mat-ripple-element{opacity:.1}.mat-mdc-checkbox-touch-target{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%);display:var(--mat-checkbox-touch-target-display)}.mat-mdc-checkbox-ripple::before{border-radius:50%}.mdc-checkbox__native-control:focus~.mat-mdc-focus-indicator::before{content:""}',
          ],
        },
      ],
    },
  ],
  ctorParameters: () => [
    { type: i0.ElementRef },
    { type: i0.ChangeDetectorRef },
    { type: i0.NgZone },
    {
      type: undefined,
      decorators: [
        {
          type: Attribute,
          args: ['tabindex'],
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
          args: [MAT_CHECKBOX_DEFAULT_OPTIONS],
        },
      ],
    },
  ],
  propDecorators: {
    ariaLabel: [
      {
        type: Input,
        args: ['aria-label'],
      },
    ],
    ariaLabelledby: [
      {
        type: Input,
        args: ['aria-labelledby'],
      },
    ],
    ariaDescribedby: [
      {
        type: Input,
        args: ['aria-describedby'],
      },
    ],
    id: [
      {
        type: Input,
      },
    ],
    required: [
      {
        type: Input,
        args: [{ transform: booleanAttribute }],
      },
    ],
    labelPosition: [
      {
        type: Input,
      },
    ],
    name: [
      {
        type: Input,
      },
    ],
    change: [
      {
        type: Output,
      },
    ],
    indeterminateChange: [
      {
        type: Output,
      },
    ],
    value: [
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
    _inputElement: [
      {
        type: ViewChild,
        args: ['input'],
      },
    ],
    _labelElement: [
      {
        type: ViewChild,
        args: ['label'],
      },
    ],
    tabIndex: [
      {
        type: Input,
        args: [{ transform: value => (value == null ? undefined : numberAttribute(value)) }],
      },
    ],
    color: [
      {
        type: Input,
      },
    ],
    ripple: [
      {
        type: ViewChild,
        args: [MatRipple],
      },
    ],
    checked: [
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
    indeterminate: [
      {
        type: Input,
        args: [{ transform: booleanAttribute }],
      },
    ],
  },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hlY2tib3gvY2hlY2tib3gudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hlY2tib3gvY2hlY2tib3guaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBRUwsU0FBUyxFQUNULGdCQUFnQixFQUNoQix1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFDTixlQUFlLEVBRWYsUUFBUSxFQUNSLE1BQU0sRUFFTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLHFCQUFxQixHQUN0QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBR0wsYUFBYSxFQUNiLGlCQUFpQixHQUdsQixNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxTQUFTLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUV4RSxPQUFPLEVBQ0wsNEJBQTRCLEVBQzVCLG9DQUFvQyxHQUVyQyxNQUFNLG1CQUFtQixDQUFDOztBQUUzQjs7O0dBR0c7QUFDSCxNQUFNLENBQU4sSUFBWSxvQkFTWDtBQVRELFdBQVksb0JBQW9CO0lBQzlCLHNFQUFzRTtJQUN0RSwrREFBSSxDQUFBO0lBQ0osdUVBQXVFO0lBQ3ZFLHFFQUFPLENBQUE7SUFDUCx5RUFBeUU7SUFDekUseUVBQVMsQ0FBQTtJQUNULDZFQUE2RTtJQUM3RSxpRkFBYSxDQUFBO0FBQ2YsQ0FBQyxFQVRXLG9CQUFvQixLQUFwQixvQkFBb0IsUUFTL0I7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxtQ0FBbUMsR0FBUTtJQUN0RCxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENB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ZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIEF0dHJpYnV0ZSxcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBudW1iZXJBdHRyaWJ1dGUsXG4gIE9uQ2hhbmdlcyxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQU5JTUFUSU9OX01PRFVMRV9UWVBFLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEFic3RyYWN0Q29udHJvbCxcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIE5HX1ZBTElEQVRPUlMsXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBWYWxpZGF0aW9uRXJyb3JzLFxuICBWYWxpZGF0b3IsXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7X01hdEludGVybmFsRm9ybUZpZWxkLCBNYXRSaXBwbGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtGb2N1c2FibGVPcHRpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7XG4gIE1BVF9DSEVDS0JPWF9ERUZBVUxUX09QVElPTlMsXG4gIE1BVF9DSEVDS0JPWF9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSxcbiAgTWF0Q2hlY2tib3hEZWZhdWx0T3B0aW9ucyxcbn0gZnJvbSAnLi9jaGVja2JveC1jb25maWcnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGRpZmZlcmVudCBzdGF0ZXMgdGhhdCByZXF1aXJlIGN1c3RvbSB0cmFuc2l0aW9ucyBiZXR3ZWVuIHRoZW0uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBlbnVtIFRyYW5zaXRpb25DaGVja1N0YXRlIHtcbiAgLyoqIFRoZSBpbml0aWFsIHN0YXRlIG9mIHRoZSBjb21wb25lbnQgYmVmb3JlIGFueSB1c2VyIGludGVyYWN0aW9uLiAqL1xuICBJbml0LFxuICAvKiogVGhlIHN0YXRlIHJlcHJlc2VudGluZyB0aGUgY29tcG9uZW50IHdoZW4gaXQncyBiZWNvbWluZyBjaGVja2VkLiAqL1xuICBDaGVja2VkLFxuICAvKiogVGhlIHN0YXRlIHJlcHJlc2VudGluZyB0aGUgY29tcG9uZW50IHdoZW4gaXQncyBiZWNvbWluZyB1bmNoZWNrZWQuICovXG4gIFVuY2hlY2tlZCxcbiAgLyoqIFRoZSBzdGF0ZSByZXByZXNlbnRpbmcgdGhlIGNvbXBvbmVudCB3aGVuIGl0J3MgYmVjb21pbmcgaW5kZXRlcm1pbmF0ZS4gKi9cbiAgSW5kZXRlcm1pbmF0ZSxcbn1cblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBXaWxsIHN0b3AgYmVpbmcgZXhwb3J0ZWQuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE5LjAuMFxuICovXG5leHBvcnQgY29uc3QgTUFUX0NIRUNLQk9YX0NPTlRST0xfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdENoZWNrYm94KSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKiogQ2hhbmdlIGV2ZW50IG9iamVjdCBlbWl0dGVkIGJ5IGNoZWNrYm94LiAqL1xuZXhwb3J0IGNsYXNzIE1hdENoZWNrYm94Q2hhbmdlIHtcbiAgLyoqIFRoZSBzb3VyY2UgY2hlY2tib3ggb2YgdGhlIGV2ZW50LiAqL1xuICBzb3VyY2U6IE1hdENoZWNrYm94O1xuICAvKiogVGhlIG5ldyBgY2hlY2tlZGAgdmFsdWUgb2YgdGhlIGNoZWNrYm94LiAqL1xuICBjaGVja2VkOiBib29sZWFuO1xufVxuXG4vLyBJbmNyZWFzaW5nIGludGVnZXIgZm9yIGdlbmVyYXRpbmcgdW5pcXVlIGlkcyBmb3IgY2hlY2tib3ggY29tcG9uZW50cy5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG4vLyBEZWZhdWx0IGNoZWNrYm94IGNvbmZpZ3VyYXRpb24uXG5jb25zdCBkZWZhdWx0cyA9IE1BVF9DSEVDS0JPWF9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSgpO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hlY2tib3gnLFxuICB0ZW1wbGF0ZVVybDogJ2NoZWNrYm94Lmh0bWwnLFxuICBzdHlsZVVybDogJ2NoZWNrYm94LmNzcycsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy1jaGVja2JveCcsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnbnVsbCcsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiBgX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucydgLFxuICAgICdbY2xhc3MubWRjLWNoZWNrYm94LS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbaWRdJzogJ2lkJyxcbiAgICAvLyBBZGQgY2xhc3NlcyB0aGF0IHVzZXJzIGNhbiB1c2UgdG8gbW9yZSBlYXNpbHkgdGFyZ2V0IGRpc2FibGVkIG9yIGNoZWNrZWQgY2hlY2tib3hlcy5cbiAgICAnW2NsYXNzLm1hdC1tZGMtY2hlY2tib3gtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtY2hlY2tib3gtY2hlY2tlZF0nOiAnY2hlY2tlZCcsXG4gICAgJ1tjbGFzc10nOiAnY29sb3IgPyBcIm1hdC1cIiArIGNvbG9yIDogXCJtYXQtYWNjZW50XCInLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICBNQVRfQ0hFQ0tCT1hfQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUixcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgICAgdXNlRXhpc3Rpbmc6IE1hdENoZWNrYm94LFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgfSxcbiAgXSxcbiAgZXhwb3J0QXM6ICdtYXRDaGVja2JveCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbTWF0UmlwcGxlLCBfTWF0SW50ZXJuYWxGb3JtRmllbGRdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGVja2JveFxuICBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcywgQ29udHJvbFZhbHVlQWNjZXNzb3IsIFZhbGlkYXRvciwgRm9jdXNhYmxlT3B0aW9uXG57XG4gIC8qKiBGb2N1c2VzIHRoZSBjaGVja2JveC4gKi9cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5faW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIHRoZSBjaGFuZ2UgZXZlbnQgdGhhdCB3aWxsIGJlIGVtaXR0ZWQgYnkgdGhlIGNoZWNrYm94LiAqL1xuICBwcm90ZWN0ZWQgX2NyZWF0ZUNoYW5nZUV2ZW50KGlzQ2hlY2tlZDogYm9vbGVhbikge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IE1hdENoZWNrYm94Q2hhbmdlKCk7XG4gICAgZXZlbnQuc291cmNlID0gdGhpcztcbiAgICBldmVudC5jaGVja2VkID0gaXNDaGVja2VkO1xuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBlbGVtZW50IG9uIHdoaWNoIHRvIGFkZCB0aGUgYW5pbWF0aW9uIENTUyBjbGFzc2VzLiAqL1xuICBwcm90ZWN0ZWQgX2dldEFuaW1hdGlvblRhcmdldEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lucHV0RWxlbWVudD8ubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBDU1MgY2xhc3NlcyB0byBhZGQgd2hlbiB0cmFuc2l0aW9uaW5nIGJldHdlZW4gdGhlIGRpZmZlcmVudCBjaGVja2JveCBzdGF0ZXMuICovXG4gIHByb3RlY3RlZCBfYW5pbWF0aW9uQ2xhc3NlcyA9IHtcbiAgICB1bmNoZWNrZWRUb0NoZWNrZWQ6ICdtZGMtY2hlY2tib3gtLWFuaW0tdW5jaGVja2VkLWNoZWNrZWQnLFxuICAgIHVuY2hlY2tlZFRvSW5kZXRlcm1pbmF0ZTogJ21kYy1jaGVja2JveC0tYW5pbS11bmNoZWNrZWQtaW5kZXRlcm1pbmF0ZScsXG4gICAgY2hlY2tlZFRvVW5jaGVja2VkOiAnbWRjLWNoZWNrYm94LS1hbmltLWNoZWNrZWQtdW5jaGVja2VkJyxcbiAgICBjaGVja2VkVG9JbmRldGVybWluYXRlOiAnbWRjLWNoZWNrYm94LS1hbmltLWNoZWNrZWQtaW5kZXRlcm1pbmF0ZScsXG4gICAgaW5kZXRlcm1pbmF0ZVRvQ2hlY2tlZDogJ21kYy1jaGVja2JveC0tYW5pbS1pbmRldGVybWluYXRlLWNoZWNrZWQnLFxuICAgIGluZGV0ZXJtaW5hdGVUb1VuY2hlY2tlZDogJ21kYy1jaGVja2JveC0tYW5pbS1pbmRldGVybWluYXRlLXVuY2hlY2tlZCcsXG4gIH07XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVkIHRvIHRoZSBhcmlhLWxhYmVsIGF0dHJpYnV0ZSBvZiB0aGUgaG9zdCBlbGVtZW50LiBJbiBtb3N0IGNhc2VzLCBhcmlhLWxhYmVsbGVkYnkgd2lsbFxuICAgKiB0YWtlIHByZWNlZGVuY2Ugc28gdGhpcyBtYXkgYmUgb21pdHRlZC5cbiAgICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nID0gJyc7XG5cbiAgLyoqXG4gICAqIFVzZXJzIGNhbiBzcGVjaWZ5IHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUgd2hpY2ggd2lsbCBiZSBmb3J3YXJkZWQgdG8gdGhlIGlucHV0IGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBUaGUgJ2FyaWEtZGVzY3JpYmVkYnknIGF0dHJpYnV0ZSBpcyByZWFkIGFmdGVyIHRoZSBlbGVtZW50J3MgbGFiZWwgYW5kIGZpZWxkIHR5cGUuICovXG4gIEBJbnB1dCgnYXJpYS1kZXNjcmliZWRieScpIGFyaWFEZXNjcmliZWRieTogc3RyaW5nO1xuXG4gIHByaXZhdGUgX3VuaXF1ZUlkOiBzdHJpbmc7XG5cbiAgLyoqIEEgdW5pcXVlIGlkIGZvciB0aGUgY2hlY2tib3ggaW5wdXQuIElmIG5vbmUgaXMgc3VwcGxpZWQsIGl0IHdpbGwgYmUgYXV0by1nZW5lcmF0ZWQuICovXG4gIEBJbnB1dCgpIGlkOiBzdHJpbmc7XG5cbiAgLyoqIFJldHVybnMgdGhlIHVuaXF1ZSBpZCBmb3IgdGhlIHZpc3VhbCBoaWRkZW4gaW5wdXQuICovXG4gIGdldCBpbnB1dElkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3RoaXMuaWQgfHwgdGhpcy5fdW5pcXVlSWR9LWlucHV0YDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGVja2JveCBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KSByZXF1aXJlZDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGFwcGVhciBhZnRlciBvciBiZWZvcmUgdGhlIGNoZWNrYm94LiBEZWZhdWx0cyB0byAnYWZ0ZXInICovXG4gIEBJbnB1dCgpIGxhYmVsUG9zaXRpb246ICdiZWZvcmUnIHwgJ2FmdGVyJyA9ICdhZnRlcic7XG5cbiAgLyoqIE5hbWUgdmFsdWUgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBpbnB1dCBlbGVtZW50IGlmIHByZXNlbnQgKi9cbiAgQElucHV0KCkgbmFtZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY2hlY2tib3gncyBgY2hlY2tlZGAgdmFsdWUgY2hhbmdlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hlY2tib3hDaGFuZ2U+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY2hlY2tib3gncyBgaW5kZXRlcm1pbmF0ZWAgdmFsdWUgY2hhbmdlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGluZGV0ZXJtaW5hdGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAvKiogVGhlIHZhbHVlIGF0dHJpYnV0ZSBvZiB0aGUgbmF0aXZlIGlucHV0IGVsZW1lbnQgKi9cbiAgQElucHV0KCkgdmFsdWU6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgY2hlY2tib3ggaGFzIGEgcmlwcGxlLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pIGRpc2FibGVSaXBwbGU6IGJvb2xlYW47XG5cbiAgLyoqIFRoZSBuYXRpdmUgYDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIj5gIGVsZW1lbnQgKi9cbiAgQFZpZXdDaGlsZCgnaW5wdXQnKSBfaW5wdXRFbGVtZW50OiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xuXG4gIC8qKiBUaGUgbmF0aXZlIGA8bGFiZWw+YCBlbGVtZW50ICovXG4gIEBWaWV3Q2hpbGQoJ2xhYmVsJykgX2xhYmVsRWxlbWVudDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PjtcblxuICAvKiogVGFiaW5kZXggZm9yIHRoZSBjaGVja2JveC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06ICh2YWx1ZTogdW5rbm93bikgPT4gKHZhbHVlID09IG51bGwgPyB1bmRlZmluZWQgOiBudW1iZXJBdHRyaWJ1dGUodmFsdWUpKX0pXG4gIHRhYkluZGV4OiBudW1iZXI7XG5cbiAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgc2hvdWxkIGJlIGEgVGhlbWVQYWxldHRlLCBidXQgc29tZSBpbnRlcm5hbCBhcHBzIHdlcmUgYWJ1c2luZ1xuICAvLyB0aGUgbGFjayBvZiB0eXBlIGNoZWNraW5nIHByZXZpb3VzbHkgYW5kIGFzc2lnbmluZyByYW5kb20gc3RyaW5ncy5cbiAgLyoqIFBhbGV0dGUgY29sb3Igb2YgdGhlIGNoZWNrYm94LiAqL1xuICBASW5wdXQoKSBjb2xvcjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIE1hdFJpcHBsZSBpbnN0YW5jZSBvZiB0aGUgY2hlY2tib3guXG4gICAqIEBkZXByZWNhdGVkIENvbnNpZGVyZWQgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsLiBUbyBiZSByZW1vdmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgQFZpZXdDaGlsZChNYXRSaXBwbGUpIHJpcHBsZTogTWF0UmlwcGxlO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2hlY2tib3ggaXMgYmx1cnJlZC4gTmVlZGVkIHRvIHByb3Blcmx5IGltcGxlbWVudCBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgX29uVG91Y2hlZDogKCkgPT4gYW55ID0gKCkgPT4ge307XG5cbiAgcHJpdmF0ZSBfY3VycmVudEFuaW1hdGlvbkNsYXNzOiBzdHJpbmcgPSAnJztcbiAgcHJpdmF0ZSBfY3VycmVudENoZWNrU3RhdGU6IFRyYW5zaXRpb25DaGVja1N0YXRlID0gVHJhbnNpdGlvbkNoZWNrU3RhdGUuSW5pdDtcbiAgcHJpdmF0ZSBfY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbjogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yQ2hhbmdlRm4gPSAoKSA9PiB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9DSEVDS0JPWF9ERUZBVUxUX09QVElPTlMpIHByaXZhdGUgX29wdGlvbnM/OiBNYXRDaGVja2JveERlZmF1bHRPcHRpb25zLFxuICApIHtcbiAgICB0aGlzLl9vcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCBkZWZhdWx0cztcbiAgICB0aGlzLmNvbG9yID0gdGhpcy5fb3B0aW9ucy5jb2xvciB8fCBkZWZhdWx0cy5jb2xvcjtcbiAgICB0aGlzLnRhYkluZGV4ID0gcGFyc2VJbnQodGFiSW5kZXgpIHx8IDA7XG4gICAgdGhpcy5pZCA9IHRoaXMuX3VuaXF1ZUlkID0gYG1hdC1tZGMtY2hlY2tib3gtJHsrK25leHRVbmlxdWVJZH1gO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydyZXF1aXJlZCddKSB7XG4gICAgICB0aGlzLl92YWxpZGF0b3JDaGFuZ2VGbigpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9zeW5jSW5kZXRlcm1pbmF0ZSh0aGlzLl9pbmRldGVybWluYXRlKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGVja2JveCBpcyBjaGVja2VkLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGdldCBjaGVja2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9jaGVja2VkO1xuICB9XG4gIHNldCBjaGVja2VkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlICE9IHRoaXMuY2hlY2tlZCkge1xuICAgICAgdGhpcy5fY2hlY2tlZCA9IHZhbHVlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2NoZWNrZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgY2hlY2tib3ggaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgY2hlY2tib3ggaXMgaW5kZXRlcm1pbmF0ZS4gVGhpcyBpcyBhbHNvIGtub3duIGFzIFwibWl4ZWRcIiBtb2RlIGFuZCBjYW4gYmUgdXNlZCB0b1xuICAgKiByZXByZXNlbnQgYSBjaGVja2JveCB3aXRoIHRocmVlIHN0YXRlcywgZS5nLiBhIGNoZWNrYm94IHRoYXQgcmVwcmVzZW50cyBhIG5lc3RlZCBsaXN0IG9mXG4gICAqIGNoZWNrYWJsZSBpdGVtcy4gTm90ZSB0aGF0IHdoZW5ldmVyIGNoZWNrYm94IGlzIG1hbnVhbGx5IGNsaWNrZWQsIGluZGV0ZXJtaW5hdGUgaXMgaW1tZWRpYXRlbHlcbiAgICogc2V0IHRvIGZhbHNlLlxuICAgKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBnZXQgaW5kZXRlcm1pbmF0ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faW5kZXRlcm1pbmF0ZTtcbiAgfVxuICBzZXQgaW5kZXRlcm1pbmF0ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IGNoYW5nZWQgPSB2YWx1ZSAhPSB0aGlzLl9pbmRldGVybWluYXRlO1xuICAgIHRoaXMuX2luZGV0ZXJtaW5hdGUgPSB2YWx1ZTtcblxuICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICBpZiAodGhpcy5faW5kZXRlcm1pbmF0ZSkge1xuICAgICAgICB0aGlzLl90cmFuc2l0aW9uQ2hlY2tTdGF0ZShUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5JbmRldGVybWluYXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25DaGVja1N0YXRlKFxuICAgICAgICAgIHRoaXMuY2hlY2tlZCA/IFRyYW5zaXRpb25DaGVja1N0YXRlLkNoZWNrZWQgOiBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5VbmNoZWNrZWQsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB0aGlzLmluZGV0ZXJtaW5hdGVDaGFuZ2UuZW1pdCh0aGlzLl9pbmRldGVybWluYXRlKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zeW5jSW5kZXRlcm1pbmF0ZSh0aGlzLl9pbmRldGVybWluYXRlKTtcbiAgfVxuICBwcml2YXRlIF9pbmRldGVybWluYXRlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgX2lzUmlwcGxlRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZVJpcHBsZSB8fCB0aGlzLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIE1ldGhvZCBiZWluZyBjYWxsZWQgd2hlbmV2ZXIgdGhlIGxhYmVsIHRleHQgY2hhbmdlcy4gKi9cbiAgX29uTGFiZWxUZXh0Q2hhbmdlKCkge1xuICAgIC8vIFNpbmNlIHRoZSBldmVudCBvZiB0aGUgYGNka09ic2VydmVDb250ZW50YCBkaXJlY3RpdmUgcnVucyBvdXRzaWRlIG9mIHRoZSB6b25lLCB0aGUgY2hlY2tib3hcbiAgICAvLyBjb21wb25lbnQgd2lsbCBiZSBvbmx5IG1hcmtlZCBmb3IgY2hlY2ssIGJ1dCBubyBhY3R1YWwgY2hhbmdlIGRldGVjdGlvbiBydW5zIGF1dG9tYXRpY2FsbHkuXG4gICAgLy8gSW5zdGVhZCBvZiBnb2luZyBiYWNrIGludG8gdGhlIHpvbmUgaW4gb3JkZXIgdG8gdHJpZ2dlciBhIGNoYW5nZSBkZXRlY3Rpb24gd2hpY2ggY2F1c2VzXG4gICAgLy8gKmFsbCogY29tcG9uZW50cyB0byBiZSBjaGVja2VkIChpZiBleHBsaWNpdGx5IG1hcmtlZCBvciBub3QgdXNpbmcgT25QdXNoKSwgd2Ugb25seSB0cmlnZ2VyXG4gICAgLy8gYW4gZXhwbGljaXQgY2hhbmdlIGRldGVjdGlvbiBmb3IgdGhlIGNoZWNrYm94IHZpZXcgYW5kIGl0cyBjaGlsZHJlbi5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLmNoZWNrZWQgPSAhIXZhbHVlO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuID0gZm47XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBWYWxpZGF0b3IuXG4gIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbDxib29sZWFuPik6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1aXJlZCAmJiBjb250cm9sLnZhbHVlICE9PSB0cnVlID8geydyZXF1aXJlZCc6IHRydWV9IDogbnVsbDtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBWYWxpZGF0b3IuXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl92YWxpZGF0b3JDaGFuZ2VGbiA9IGZuO1xuICB9XG5cbiAgcHJpdmF0ZSBfdHJhbnNpdGlvbkNoZWNrU3RhdGUobmV3U3RhdGU6IFRyYW5zaXRpb25DaGVja1N0YXRlKSB7XG4gICAgbGV0IG9sZFN0YXRlID0gdGhpcy5fY3VycmVudENoZWNrU3RhdGU7XG4gICAgbGV0IGVsZW1lbnQgPSB0aGlzLl9nZXRBbmltYXRpb25UYXJnZXRFbGVtZW50KCk7XG5cbiAgICBpZiAob2xkU3RhdGUgPT09IG5ld1N0YXRlIHx8ICFlbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9jdXJyZW50QW5pbWF0aW9uQ2xhc3MpIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLl9jdXJyZW50QW5pbWF0aW9uQ2xhc3MpO1xuICAgIH1cblxuICAgIHRoaXMuX2N1cnJlbnRBbmltYXRpb25DbGFzcyA9IHRoaXMuX2dldEFuaW1hdGlvbkNsYXNzRm9yQ2hlY2tTdGF0ZVRyYW5zaXRpb24oXG4gICAgICBvbGRTdGF0ZSxcbiAgICAgIG5ld1N0YXRlLFxuICAgICk7XG4gICAgdGhpcy5fY3VycmVudENoZWNrU3RhdGUgPSBuZXdTdGF0ZTtcblxuICAgIGlmICh0aGlzLl9jdXJyZW50QW5pbWF0aW9uQ2xhc3MubGVuZ3RoID4gMCkge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX2N1cnJlbnRBbmltYXRpb25DbGFzcyk7XG5cbiAgICAgIC8vIFJlbW92ZSB0aGUgYW5pbWF0aW9uIGNsYXNzIHRvIGF2b2lkIGFuaW1hdGlvbiB3aGVuIHRoZSBjaGVja2JveCBpcyBtb3ZlZCBiZXR3ZWVuIGNvbnRhaW5lcnNcbiAgICAgIGNvbnN0IGFuaW1hdGlvbkNsYXNzID0gdGhpcy5fY3VycmVudEFuaW1hdGlvbkNsYXNzO1xuXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBlbGVtZW50IS5jbGFzc0xpc3QucmVtb3ZlKGFuaW1hdGlvbkNsYXNzKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9lbWl0Q2hhbmdlRXZlbnQoKSB7XG4gICAgdGhpcy5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbih0aGlzLmNoZWNrZWQpO1xuICAgIHRoaXMuY2hhbmdlLmVtaXQodGhpcy5fY3JlYXRlQ2hhbmdlRXZlbnQodGhpcy5jaGVja2VkKSk7XG5cbiAgICAvLyBBc3NpZ25pbmcgdGhlIHZhbHVlIGFnYWluIGhlcmUgaXMgcmVkdW5kYW50LCBidXQgd2UgaGF2ZSB0byBkbyBpdCBpbiBjYXNlIGl0IHdhc1xuICAgIC8vIGNoYW5nZWQgaW5zaWRlIHRoZSBgY2hhbmdlYCBsaXN0ZW5lciB3aGljaCB3aWxsIGNhdXNlIHRoZSBpbnB1dCB0byBiZSBvdXQgb2Ygc3luYy5cbiAgICBpZiAodGhpcy5faW5wdXRFbGVtZW50KSB7XG4gICAgICB0aGlzLl9pbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5jaGVja2VkID0gdGhpcy5jaGVja2VkO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSBgY2hlY2tlZGAgc3RhdGUgb2YgdGhlIGNoZWNrYm94LiAqL1xuICB0b2dnbGUoKTogdm9pZCB7XG4gICAgdGhpcy5jaGVja2VkID0gIXRoaXMuY2hlY2tlZDtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuKHRoaXMuY2hlY2tlZCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2hhbmRsZUlucHV0Q2xpY2soKSB7XG4gICAgY29uc3QgY2xpY2tBY3Rpb24gPSB0aGlzLl9vcHRpb25zPy5jbGlja0FjdGlvbjtcblxuICAgIC8vIElmIHJlc2V0SW5kZXRlcm1pbmF0ZSBpcyBmYWxzZSwgYW5kIHRoZSBjdXJyZW50IHN0YXRlIGlzIGluZGV0ZXJtaW5hdGUsIGRvIG5vdGhpbmcgb24gY2xpY2tcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgY2xpY2tBY3Rpb24gIT09ICdub29wJykge1xuICAgICAgLy8gV2hlbiB1c2VyIG1hbnVhbGx5IGNsaWNrIG9uIHRoZSBjaGVja2JveCwgYGluZGV0ZXJtaW5hdGVgIGlzIHNldCB0byBmYWxzZS5cbiAgICAgIGlmICh0aGlzLmluZGV0ZXJtaW5hdGUgJiYgY2xpY2tBY3Rpb24gIT09ICdjaGVjaycpIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5faW5kZXRlcm1pbmF0ZSA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuaW5kZXRlcm1pbmF0ZUNoYW5nZS5lbWl0KHRoaXMuX2luZGV0ZXJtaW5hdGUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2hlY2tlZCA9ICF0aGlzLl9jaGVja2VkO1xuICAgICAgdGhpcy5fdHJhbnNpdGlvbkNoZWNrU3RhdGUoXG4gICAgICAgIHRoaXMuX2NoZWNrZWQgPyBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5DaGVja2VkIDogVHJhbnNpdGlvbkNoZWNrU3RhdGUuVW5jaGVja2VkLFxuICAgICAgKTtcblxuICAgICAgLy8gRW1pdCBvdXIgY3VzdG9tIGNoYW5nZSBldmVudCBpZiB0aGUgbmF0aXZlIGlucHV0IGVtaXR0ZWQgb25lLlxuICAgICAgLy8gSXQgaXMgaW1wb3J0YW50IHRvIG9ubHkgZW1pdCBpdCwgaWYgdGhlIG5hdGl2ZSBpbnB1dCB0cmlnZ2VyZWQgb25lLCBiZWNhdXNlXG4gICAgICAvLyB3ZSBkb24ndCB3YW50IHRvIHRyaWdnZXIgYSBjaGFuZ2UgZXZlbnQsIHdoZW4gdGhlIGBjaGVja2VkYCB2YXJpYWJsZSBjaGFuZ2VzIGZvciBleGFtcGxlLlxuICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5kaXNhYmxlZCAmJiBjbGlja0FjdGlvbiA9PT0gJ25vb3AnKSB7XG4gICAgICAvLyBSZXNldCBuYXRpdmUgaW5wdXQgd2hlbiBjbGlja2VkIHdpdGggbm9vcC4gVGhlIG5hdGl2ZSBjaGVja2JveCBiZWNvbWVzIGNoZWNrZWQgYWZ0ZXJcbiAgICAgIC8vIGNsaWNrLCByZXNldCBpdCB0byBiZSBhbGlnbiB3aXRoIGBjaGVja2VkYCB2YWx1ZSBvZiBgbWF0LWNoZWNrYm94YC5cbiAgICAgIHRoaXMuX2lucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LmNoZWNrZWQgPSB0aGlzLmNoZWNrZWQ7XG4gICAgICB0aGlzLl9pbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5pbmRldGVybWluYXRlID0gdGhpcy5pbmRldGVybWluYXRlO1xuICAgIH1cbiAgfVxuXG4gIF9vbkludGVyYWN0aW9uRXZlbnQoZXZlbnQ6IEV2ZW50KSB7XG4gICAgLy8gV2UgYWx3YXlzIGhhdmUgdG8gc3RvcCBwcm9wYWdhdGlvbiBvbiB0aGUgY2hhbmdlIGV2ZW50LlxuICAgIC8vIE90aGVyd2lzZSB0aGUgY2hhbmdlIGV2ZW50LCBmcm9tIHRoZSBpbnB1dCBlbGVtZW50LCB3aWxsIGJ1YmJsZSB1cCBhbmRcbiAgICAvLyBlbWl0IGl0cyBldmVudCBvYmplY3QgdG8gdGhlIGBjaGFuZ2VgIG91dHB1dC5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxuXG4gIF9vbkJsdXIoKSB7XG4gICAgLy8gV2hlbiBhIGZvY3VzZWQgZWxlbWVudCBiZWNvbWVzIGRpc2FibGVkLCB0aGUgYnJvd3NlciAqaW1tZWRpYXRlbHkqIGZpcmVzIGEgYmx1ciBldmVudC5cbiAgICAvLyBBbmd1bGFyIGRvZXMgbm90IGV4cGVjdCBldmVudHMgdG8gYmUgcmFpc2VkIGR1cmluZyBjaGFuZ2UgZGV0ZWN0aW9uLCBzbyBhbnkgc3RhdGUgY2hhbmdlXG4gICAgLy8gKHN1Y2ggYXMgYSBmb3JtIGNvbnRyb2wncyAnbmctdG91Y2hlZCcpIHdpbGwgY2F1c2UgYSBjaGFuZ2VkLWFmdGVyLWNoZWNrZWQgZXJyb3IuXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE3NzkzLiBUbyB3b3JrIGFyb3VuZCB0aGlzLCB3ZSBkZWZlclxuICAgIC8vIHRlbGxpbmcgdGhlIGZvcm0gY29udHJvbCBpdCBoYXMgYmVlbiB0b3VjaGVkIHVudGlsIHRoZSBuZXh0IHRpY2suXG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0QW5pbWF0aW9uQ2xhc3NGb3JDaGVja1N0YXRlVHJhbnNpdGlvbihcbiAgICBvbGRTdGF0ZTogVHJhbnNpdGlvbkNoZWNrU3RhdGUsXG4gICAgbmV3U3RhdGU6IFRyYW5zaXRpb25DaGVja1N0YXRlLFxuICApOiBzdHJpbmcge1xuICAgIC8vIERvbid0IHRyYW5zaXRpb24gaWYgYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQuXG4gICAgaWYgKHRoaXMuX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBzd2l0Y2ggKG9sZFN0YXRlKSB7XG4gICAgICBjYXNlIFRyYW5zaXRpb25DaGVja1N0YXRlLkluaXQ6XG4gICAgICAgIC8vIEhhbmRsZSBlZGdlIGNhc2Ugd2hlcmUgdXNlciBpbnRlcmFjdHMgd2l0aCBjaGVja2JveCB0aGF0IGRvZXMgbm90IGhhdmUgWyhuZ01vZGVsKV0gb3JcbiAgICAgICAgLy8gW2NoZWNrZWRdIGJvdW5kIHRvIGl0LlxuICAgICAgICBpZiAobmV3U3RhdGUgPT09IFRyYW5zaXRpb25DaGVja1N0YXRlLkNoZWNrZWQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uQ2xhc3Nlcy51bmNoZWNrZWRUb0NoZWNrZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAobmV3U3RhdGUgPT0gVHJhbnNpdGlvbkNoZWNrU3RhdGUuSW5kZXRlcm1pbmF0ZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9jaGVja2VkXG4gICAgICAgICAgICA/IHRoaXMuX2FuaW1hdGlvbkNsYXNzZXMuY2hlY2tlZFRvSW5kZXRlcm1pbmF0ZVxuICAgICAgICAgICAgOiB0aGlzLl9hbmltYXRpb25DbGFzc2VzLnVuY2hlY2tlZFRvSW5kZXRlcm1pbmF0ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHJhbnNpdGlvbkNoZWNrU3RhdGUuVW5jaGVja2VkOlxuICAgICAgICByZXR1cm4gbmV3U3RhdGUgPT09IFRyYW5zaXRpb25DaGVja1N0YXRlLkNoZWNrZWRcbiAgICAgICAgICA/IHRoaXMuX2FuaW1hdGlvbkNsYXNzZXMudW5jaGVja2VkVG9DaGVja2VkXG4gICAgICAgICAgOiB0aGlzLl9hbmltYXRpb25DbGFzc2VzLnVuY2hlY2tlZFRvSW5kZXRlcm1pbmF0ZTtcbiAgICAgIGNhc2UgVHJhbnNpdGlvbkNoZWNrU3RhdGUuQ2hlY2tlZDpcbiAgICAgICAgcmV0dXJuIG5ld1N0YXRlID09PSBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5VbmNoZWNrZWRcbiAgICAgICAgICA/IHRoaXMuX2FuaW1hdGlvbkNsYXNzZXMuY2hlY2tlZFRvVW5jaGVja2VkXG4gICAgICAgICAgOiB0aGlzLl9hbmltYXRpb25DbGFzc2VzLmNoZWNrZWRUb0luZGV0ZXJtaW5hdGU7XG4gICAgICBjYXNlIFRyYW5zaXRpb25DaGVja1N0YXRlLkluZGV0ZXJtaW5hdGU6XG4gICAgICAgIHJldHVybiBuZXdTdGF0ZSA9PT0gVHJhbnNpdGlvbkNoZWNrU3RhdGUuQ2hlY2tlZFxuICAgICAgICAgID8gdGhpcy5fYW5pbWF0aW9uQ2xhc3Nlcy5pbmRldGVybWluYXRlVG9DaGVja2VkXG4gICAgICAgICAgOiB0aGlzLl9hbmltYXRpb25DbGFzc2VzLmluZGV0ZXJtaW5hdGVUb1VuY2hlY2tlZDtcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICAvKipcbiAgICogU3luY3MgdGhlIGluZGV0ZXJtaW5hdGUgdmFsdWUgd2l0aCB0aGUgY2hlY2tib3ggRE9NIG5vZGUuXG4gICAqXG4gICAqIFdlIHN5bmMgYGluZGV0ZXJtaW5hdGVgIGRpcmVjdGx5IG9uIHRoZSBET00gbm9kZSwgYmVjYXVzZSBpbiBJdnkgdGhlIGNoZWNrIGZvciB3aGV0aGVyIGFcbiAgICogcHJvcGVydHkgaXMgc3VwcG9ydGVkIG9uIGFuIGVsZW1lbnQgYm9pbHMgZG93biB0byBgaWYgKHByb3BOYW1lIGluIGVsZW1lbnQpYC4gRG9taW5vJ3NcbiAgICogSFRNTElucHV0RWxlbWVudCBkb2Vzbid0IGhhdmUgYW4gYGluZGV0ZXJtaW5hdGVgIHByb3BlcnR5IHNvIEl2eSB3aWxsIHdhcm4gZHVyaW5nXG4gICAqIHNlcnZlci1zaWRlIHJlbmRlcmluZy5cbiAgICovXG4gIHByaXZhdGUgX3N5bmNJbmRldGVybWluYXRlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgbmF0aXZlQ2hlY2tib3ggPSB0aGlzLl9pbnB1dEVsZW1lbnQ7XG5cbiAgICBpZiAobmF0aXZlQ2hlY2tib3gpIHtcbiAgICAgIG5hdGl2ZUNoZWNrYm94Lm5hdGl2ZUVsZW1lbnQuaW5kZXRlcm1pbmF0ZSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIF9vbklucHV0Q2xpY2soKSB7XG4gICAgdGhpcy5faGFuZGxlSW5wdXRDbGljaygpO1xuICB9XG5cbiAgX29uVG91Y2hUYXJnZXRDbGljaygpIHtcbiAgICB0aGlzLl9oYW5kbGVJbnB1dENsaWNrKCk7XG5cbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIC8vIE5vcm1hbGx5IHRoZSBpbnB1dCBzaG91bGQgYmUgZm9jdXNlZCBhbHJlYWR5LCBidXQgaWYgdGhlIGNsaWNrXG4gICAgICAvLyBjb21lcyBmcm9tIHRoZSB0b3VjaCB0YXJnZXQsIHRoZW4gd2UgbWlnaHQgaGF2ZSB0byBmb2N1cyBpdCBvdXJzZWx2ZXMuXG4gICAgICB0aGlzLl9pbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgUHJldmVudCBjbGljayBldmVudHMgdGhhdCBjb21lIGZyb20gdGhlIGA8bGFiZWwvPmAgZWxlbWVudCBmcm9tIGJ1YmJsaW5nLiBUaGlzIHByZXZlbnRzIHRoZVxuICAgKiAgY2xpY2sgaGFuZGxlciBvbiB0aGUgaG9zdCBmcm9tIHRyaWdnZXJpbmcgdHdpY2Ugd2hlbiBjbGlja2luZyBvbiB0aGUgYDxsYWJlbC8+YCBlbGVtZW50LiBBZnRlclxuICAgKiAgdGhlIGNsaWNrIGV2ZW50IG9uIHRoZSBgPGxhYmVsLz5gIHByb3BhZ2F0ZXMsIHRoZSBicm93c2VycyBkaXNwYXRjaGVzIGNsaWNrIG9uIHRoZSBhc3NvY2lhdGVkXG4gICAqICBgPGlucHV0Lz5gLiBCeSBwcmV2ZW50aW5nIGNsaWNrcyBvbiB0aGUgbGFiZWwgYnkgYnViYmxpbmcsIHdlIGVuc3VyZSBvbmx5IG9uZSBjbGljayBldmVudFxuICAgKiAgYnViYmxlcyB3aGVuIHRoZSBsYWJlbCBpcyBjbGlja2VkLlxuICAgKi9cbiAgX3ByZXZlbnRCdWJibGluZ0Zyb21MYWJlbChldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICghIWV2ZW50LnRhcmdldCAmJiB0aGlzLl9sYWJlbEVsZW1lbnQubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cbn1cbiIsIjxkaXYgbWF0LWludGVybmFsLWZvcm0tZmllbGQgW2xhYmVsUG9zaXRpb25dPVwibGFiZWxQb3NpdGlvblwiIChjbGljayk9XCJfcHJldmVudEJ1YmJsaW5nRnJvbUxhYmVsKCRldmVudClcIj5cbiAgPGRpdiAjY2hlY2tib3ggY2xhc3M9XCJtZGMtY2hlY2tib3hcIj5cbiAgICA8IS0tIFJlbmRlciB0aGlzIGVsZW1lbnQgZmlyc3Qgc28gdGhlIGlucHV0IGlzIG9uIHRvcC4gLS0+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtY2hlY2tib3gtdG91Y2gtdGFyZ2V0XCIgKGNsaWNrKT1cIl9vblRvdWNoVGFyZ2V0Q2xpY2soKVwiPjwvZGl2PlxuICAgIDxpbnB1dCAjaW5wdXRcbiAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgY2xhc3M9XCJtZGMtY2hlY2tib3hfX25hdGl2ZS1jb250cm9sXCJcbiAgICAgICAgICAgW2NsYXNzLm1kYy1jaGVja2JveC0tc2VsZWN0ZWRdPVwiY2hlY2tlZFwiXG4gICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsIHx8IG51bGxcIlxuICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkYnlcIlxuICAgICAgICAgICBbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XT1cImFyaWFEZXNjcmliZWRieVwiXG4gICAgICAgICAgIFthdHRyLmFyaWEtY2hlY2tlZF09XCJpbmRldGVybWluYXRlID8gJ21peGVkJyA6IG51bGxcIlxuICAgICAgICAgICBbYXR0ci5uYW1lXT1cIm5hbWVcIlxuICAgICAgICAgICBbYXR0ci52YWx1ZV09XCJ2YWx1ZVwiXG4gICAgICAgICAgIFtjaGVja2VkXT1cImNoZWNrZWRcIlxuICAgICAgICAgICBbaW5kZXRlcm1pbmF0ZV09XCJpbmRldGVybWluYXRlXCJcbiAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICAgW2lkXT1cImlucHV0SWRcIlxuICAgICAgICAgICBbcmVxdWlyZWRdPVwicmVxdWlyZWRcIlxuICAgICAgICAgICBbdGFiSW5kZXhdPVwiZGlzYWJsZWQgPyAtMSA6IHRhYkluZGV4XCJcbiAgICAgICAgICAgKGJsdXIpPVwiX29uQmx1cigpXCJcbiAgICAgICAgICAgKGNsaWNrKT1cIl9vbklucHV0Q2xpY2soKVwiXG4gICAgICAgICAgIChjaGFuZ2UpPVwiX29uSW50ZXJhY3Rpb25FdmVudCgkZXZlbnQpXCIvPlxuICAgIDxkaXYgY2xhc3M9XCJtZGMtY2hlY2tib3hfX3JpcHBsZVwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJtZGMtY2hlY2tib3hfX2JhY2tncm91bmRcIj5cbiAgICAgIDxzdmcgY2xhc3M9XCJtZGMtY2hlY2tib3hfX2NoZWNrbWFya1wiXG4gICAgICAgICAgIGZvY3VzYWJsZT1cImZhbHNlXCJcbiAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICA8cGF0aCBjbGFzcz1cIm1kYy1jaGVja2JveF9fY2hlY2ttYXJrLXBhdGhcIlxuICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgIGQ9XCJNMS43MywxMi45MSA4LjEsMTkuMjggMjIuNzksNC41OVwiLz5cbiAgICAgIDwvc3ZnPlxuICAgICAgPGRpdiBjbGFzcz1cIm1kYy1jaGVja2JveF9fbWl4ZWRtYXJrXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtY2hlY2tib3gtcmlwcGxlIG1hdC1tZGMtZm9jdXMtaW5kaWNhdG9yXCIgbWF0LXJpcHBsZVxuICAgICAgW21hdFJpcHBsZVRyaWdnZXJdPVwiY2hlY2tib3hcIlxuICAgICAgW21hdFJpcHBsZURpc2FibGVkXT1cImRpc2FibGVSaXBwbGUgfHwgZGlzYWJsZWRcIlxuICAgICAgW21hdFJpcHBsZUNlbnRlcmVkXT1cInRydWVcIj48L2Rpdj5cbiAgPC9kaXY+XG4gIDwhLS1cbiAgICBBdm9pZCBwdXR0aW5nIGEgY2xpY2sgaGFuZGxlciBvbiB0aGUgPGxhYmVsLz4gdG8gZml4IGR1cGxpY2F0ZSBuYXZpZ2F0aW9uIHN0b3Agb24gVGFsayBCYWNrXG4gICAgKCMxNDM4NSkuIFB1dHRpbmcgYSBjbGljayBoYW5kbGVyIG9uIHRoZSA8bGFiZWwvPiBjYXVzZWQgdGhpcyBidWcgYmVjYXVzZSB0aGUgYnJvd3NlciBwcm9kdWNlZFxuICAgIGFuIHVubmVjZXNzYXJ5IGFjY2Vzc2liaWxpdHkgdHJlZSBub2RlLlxuICAtLT5cbiAgPGxhYmVsIGNsYXNzPVwibWRjLWxhYmVsXCJcbiAgICAgICAgICNsYWJlbFxuICAgICAgICAgW2Zvcl09XCJpbnB1dElkXCI+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICA8L2xhYmVsPlxuPC9kaXY+XG4iXX0=
