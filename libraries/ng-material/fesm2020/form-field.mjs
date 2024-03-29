import * as i4 from '@takkion/ng-cdk/observers';
import { ObserversModule } from '@takkion/ng-cdk/observers';
import * as i3 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import {
  InjectionToken,
  Directive,
  Attribute,
  Input,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Optional,
  Inject,
  ViewChild,
  ContentChild,
  ContentChildren,
  NgModule,
} from '@angular/core';
import { mixinColor, TakCommonModule } from '@takkion/ng-material/core';
import * as i1 from '@takkion/ng-cdk/bidi';
import { coerceBooleanProperty } from '@takkion/ng-cdk/coercion';
import { Subject, merge, fromEvent } from 'rxjs';
import { startWith, takeUntil, take } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as i2 from '@takkion/ng-cdk/platform';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
let nextUniqueId$2 = 0;
/**
 * Injection token that can be used to reference instances of `TakError`. It serves as
 * alternative token to the actual `TakError` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const TAK_ERROR = new InjectionToken('TakError');
/** Single error message to be shown underneath the form field. */
class TakError {
  constructor(ariaLive, elementRef) {
    this.id = `tak-error-${nextUniqueId$2++}`;
    // If no aria-live value is set add 'polite' as a default. This is preferred over setting
    // role='alert' so that screen readers do not interrupt the current task to read this aloud.
    if (!ariaLive) {
      elementRef.nativeElement.setAttribute('aria-live', 'polite');
    }
  }
}
TakError.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakError,
  deps: [{ token: 'aria-live', attribute: true }, { token: i0.ElementRef }],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakError.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakError,
  selector: 'tak-error',
  inputs: { id: 'id' },
  host: {
    attributes: { 'aria-atomic': 'true' },
    properties: { 'attr.id': 'id' },
    classAttribute: 'tak-error',
  },
  providers: [{ provide: TAK_ERROR, useExisting: TakError }],
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakError,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: 'tak-error',
          host: {
            class: 'tak-error',
            '[attr.id]': 'id',
            'aria-atomic': 'true',
          },
          providers: [{ provide: TAK_ERROR, useExisting: TakError }],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      {
        type: undefined,
        decorators: [
          {
            type: Attribute,
            args: ['aria-live'],
          },
        ],
      },
      { type: i0.ElementRef },
    ];
  },
  propDecorators: {
    id: [
      {
        type: Input,
      },
    ],
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
 * Animations used by the TakFormField.
 * @docs-private
 */
const takFormFieldAnimations = {
  /** Animation that transitions the form field's error and hint messages. */
  transitionMessages: trigger('transitionMessages', [
    // TODO(mmalerba): Use angular animations for label animation as well.
    state('enter', style({ opacity: 1, transform: 'translateY(0%)' })),
    transition('void => enter', [
      style({ opacity: 0, transform: 'translateY(-5px)' }),
      animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
    ]),
  ]),
};

/** An interface which allows a control to work inside of a `TakFormField`. */
class TakFormFieldControl {}
TakFormFieldControl.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakFormFieldControl,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakFormFieldControl.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakFormFieldControl,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakFormFieldControl,
  decorators: [
    {
      type: Directive,
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
/** @docs-private */
function getTakFormFieldPlaceholderConflictError() {
  return Error('Placeholder attribute and child element were both specified.');
}
/** @docs-private */
function getTakFormFieldDuplicatedHintError(align) {
  return Error(`A hint was already declared for 'align="${align}"'.`);
}
/** @docs-private */
function getTakFormFieldMissingControlError() {
  return Error('tak-form-field must contain a TakFormFieldControl.');
}

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
let nextUniqueId$1 = 0;
/**
 * Injection token that can be used to reference instances of `TakHint`. It serves as
 * alternative token to the actual `TakHint` class which could cause unnecessary
 * retention of the class and its directive metadata.
 *
 * *Note*: This is not part of the public API as the MDC-based form-field will not
 * need a lightweight token for `TakHint` and we want to reduce breaking changes.
 */
const _TAK_HINT = new InjectionToken('TakHint');
/** Hint text to be shown underneath the form field control. */
class TakHint {
  constructor() {
    /** Whether to align the hint label at the start or end of the line. */
    this.align = 'start';
    /** Unique ID for the hint. Used for the aria-describedby on the form field control. */
    this.id = `tak-hint-${nextUniqueId$1++}`;
  }
}
TakHint.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakHint,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakHint.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakHint,
  selector: 'tak-hint',
  inputs: { align: 'align', id: 'id' },
  host: {
    properties: {
      'class.tak-form-field-hint-end': 'align === "end"',
      'attr.id': 'id',
      'attr.align': 'null',
    },
    classAttribute: 'tak-hint',
  },
  providers: [{ provide: _TAK_HINT, useExisting: TakHint }],
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakHint,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: 'tak-hint',
          host: {
            class: 'tak-hint',
            '[class.tak-form-field-hint-end]': 'align === "end"',
            '[attr.id]': 'id',
            // Remove align attribute to prevent it from interfering with layout.
            '[attr.align]': 'null',
          },
          providers: [{ provide: _TAK_HINT, useExisting: TakHint }],
        },
      ],
    },
  ],
  propDecorators: {
    align: [
      {
        type: Input,
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
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** The floating label for a `tak-form-field`. */
class TakLabel {}
TakLabel.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakLabel,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakLabel.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakLabel,
  selector: 'tak-label',
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakLabel,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: 'tak-label',
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
/**
 * The placeholder text for an `TakFormField`.
 * @deprecated Use `<tak-label>` to specify the label and the `placeholder` attribute to specify the
 *     placeholder.
 * @breaking-change 8.0.0
 */
class TakPlaceholder {}
TakPlaceholder.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakPlaceholder,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakPlaceholder.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakPlaceholder,
  selector: 'tak-placeholder',
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakPlaceholder,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: 'tak-placeholder',
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
/**
 * Injection token that can be used to reference instances of `TakPrefix`. It serves as
 * alternative token to the actual `TakPrefix` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const TAK_PREFIX = new InjectionToken('TakPrefix');
/** Prefix to be placed in front of the form field. */
class TakPrefix {}
TakPrefix.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakPrefix,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakPrefix.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakPrefix,
  selector: '[takPrefix]',
  providers: [{ provide: TAK_PREFIX, useExisting: TakPrefix }],
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakPrefix,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[takPrefix]',
          providers: [{ provide: TAK_PREFIX, useExisting: TakPrefix }],
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
/**
 * Injection token that can be used to reference instances of `TakSuffix`. It serves as
 * alternative token to the actual `TakSuffix` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const TAK_SUFFIX = new InjectionToken('TakSuffix');
/** Suffix to be placed at the end of the form field. */
class TakSuffix {}
TakSuffix.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakSuffix,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakSuffix.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakSuffix,
  selector: '[takSuffix]',
  providers: [{ provide: TAK_SUFFIX, useExisting: TakSuffix }],
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakSuffix,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[takSuffix]',
          providers: [{ provide: TAK_SUFFIX, useExisting: TakSuffix }],
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
const TAK_FORM_FIELD_DEFAULT_OPTIONS = new InjectionToken('TAK_FORM_FIELD_DEFAULT_OPTIONS');
/**
 * Injection token that can be used to inject an instances of `TakFormField`. It serves
 * as alternative token to the actual `TakFormField` class which would cause unnecessary
 * retention of the `TakFormField` class and its component metadata.
 */
const TAK_FORM_FIELD = new InjectionToken('TakFormField');
/** Container for form controls that applies Material Design styling and behavior. */
class TakFormField extends _TakFormFieldBase {
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

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class TakFormFieldModule {}
TakFormFieldModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakFormFieldModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
TakFormFieldModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakFormFieldModule,
  declarations: [TakError, TakFormField, TakHint, TakLabel, TakPlaceholder, TakPrefix, TakSuffix],
  imports: [CommonModule, TakCommonModule, ObserversModule],
  exports: [
    TakCommonModule,
    TakError,
    TakFormField,
    TakHint,
    TakLabel,
    TakPlaceholder,
    TakPrefix,
    TakSuffix,
  ],
});
TakFormFieldModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakFormFieldModule,
  imports: [CommonModule, TakCommonModule, ObserversModule, TakCommonModule],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakFormFieldModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          declarations: [
            TakError,
            TakFormField,
            TakHint,
            TakLabel,
            TakPlaceholder,
            TakPrefix,
            TakSuffix,
          ],
          imports: [CommonModule, TakCommonModule, ObserversModule],
          exports: [
            TakCommonModule,
            TakError,
            TakFormField,
            TakHint,
            TakLabel,
            TakPlaceholder,
            TakPrefix,
            TakSuffix,
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
  TAK_ERROR,
  TAK_FORM_FIELD,
  TAK_FORM_FIELD_DEFAULT_OPTIONS,
  TAK_PREFIX,
  TAK_SUFFIX,
  TakError,
  TakFormField,
  TakFormFieldControl,
  TakFormFieldModule,
  TakHint,
  TakLabel,
  TakPlaceholder,
  TakPrefix,
  TakSuffix,
  _TAK_HINT,
  getTakFormFieldDuplicatedHintError,
  getTakFormFieldMissingControlError,
  getTakFormFieldPlaceholderConflictError,
  takFormFieldAnimations,
};
//# sourceMappingURL=form-field.mjs.map
