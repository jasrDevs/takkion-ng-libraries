/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@takkion/ng-cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  Optional,
  Inject,
  Input,
  NgZone,
} from '@angular/core';
import {
  TakRipple,
  mixinColor,
  mixinDisabled,
  mixinDisableRipple,
} from '@takkion/ng-material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from '@angular/core';
import * as i1 from '@takkion/ng-cdk/a11y';
import * as i2 from '@takkion/ng-material/core';
/** Default color palette for round buttons (tak-fab and tak-mini-fab) */
const DEFAULT_ROUND_BUTTON_COLOR = 'accent';
/**
 * List of classes to add to TakButton instances based on host attributes to
 * style as different variants.
 */
const BUTTON_HOST_ATTRIBUTES = [
  'tak-button',
  'tak-flat-button',
  'tak-icon-button',
  'tak-raised-button',
  'tak-stroked-button',
  'tak-mini-fab',
  'tak-fab',
];
// Boilerplate for applying mixins to TakButton.
const _TakButtonBase = mixinColor(
  mixinDisabled(
    mixinDisableRipple(
      class {
        constructor(_elementRef) {
          this._elementRef = _elementRef;
        }
      }
    )
  )
);
/**
 * Material design button.
 */
export class TakButton extends _TakButtonBase {
  constructor(elementRef, _focusMonitor, _animationMode) {
    super(elementRef);
    this._focusMonitor = _focusMonitor;
    this._animationMode = _animationMode;
    /** Whether the button is round. */
    this.isRoundButton = this._hasHostAttributes('tak-fab', 'tak-mini-fab');
    /** Whether the button is icon button. */
    this.isIconButton = this._hasHostAttributes('tak-icon-button');
    // For each of the variant selectors that is present in the button's host
    // attributes, add the correct corresponding class.
    for (const attr of BUTTON_HOST_ATTRIBUTES) {
      if (this._hasHostAttributes(attr)) {
        this._getHostElement().classList.add(attr);
      }
    }
    // Add a class that applies to all buttons. This makes it easier to target if somebody
    // wants to target all Material buttons. We do it here rather than `host` to ensure that
    // the class is applied to derived classes.
    elementRef.nativeElement.classList.add('tak-button-base');
    if (this.isRoundButton) {
      this.color = DEFAULT_ROUND_BUTTON_COLOR;
    }
  }
  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true);
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
  /** Focuses the button. */
  focus(origin, options) {
    if (origin) {
      this._focusMonitor.focusVia(this._getHostElement(), origin, options);
    } else {
      this._getHostElement().focus(options);
    }
  }
  _getHostElement() {
    return this._elementRef.nativeElement;
  }
  _isRippleDisabled() {
    return this.disableRipple || this.disabled;
  }
  /** Gets whether the button has one of the given attributes. */
  _hasHostAttributes(...attributes) {
    return attributes.some(attribute => this._getHostElement().hasAttribute(attribute));
  }
}
TakButton.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakButton,
  deps: [
    { token: i0.ElementRef },
    { token: i1.FocusMonitor },
    { token: ANIMATION_MODULE_TYPE, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Component,
});
TakButton.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakButton,
  selector:
    'button[tak-button], button[tak-raised-button], button[tak-icon-button],\n             button[tak-fab], button[tak-mini-fab], button[tak-stroked-button],\n             button[tak-flat-button]',
  inputs: { disabled: 'disabled', disableRipple: 'disableRipple', color: 'color' },
  host: {
    properties: {
      'attr.disabled': 'disabled || null',
      'class._tak-animation-noopable': '_animationMode === "NoopAnimations"',
      'class.tak-button-disabled': 'disabled',
    },
    classAttribute: 'tak-focus-indicator',
  },
  viewQueries: [{ propertyName: 'ripple', first: true, predicate: TakRipple, descendants: true }],
  exportAs: ['takButton'],
  usesInheritance: true,
  ngImport: i0,
  template:
    '<span class="tak-button-wrapper"><ng-content></ng-content></span>\n<span takRipple class="tak-button-ripple"\n      [class.tak-button-ripple-round]="isRoundButton || isIconButton"\n      [takRippleDisabled]="_isRippleDisabled()"\n      [takRippleCentered]="isIconButton"\n      [takRippleTrigger]="_getHostElement()"></span>\n<span class="tak-button-focus-overlay"></span>\n',
  styles: [
    '.tak-button .tak-button-focus-overlay,.tak-icon-button .tak-button-focus-overlay{opacity:0}.tak-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay,.tak-stroked-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay{opacity:.04}@media(hover: none){.tak-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay,.tak-stroked-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay{opacity:0}}.tak-button,.tak-icon-button,.tak-stroked-button,.tak-flat-button{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible}.tak-button::-moz-focus-inner,.tak-icon-button::-moz-focus-inner,.tak-stroked-button::-moz-focus-inner,.tak-flat-button::-moz-focus-inner{border:0}.tak-button.tak-button-disabled,.tak-icon-button.tak-button-disabled,.tak-stroked-button.tak-button-disabled,.tak-flat-button.tak-button-disabled{cursor:default}.tak-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-button.cdk-program-focused .tak-button-focus-overlay,.tak-icon-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-icon-button.cdk-program-focused .tak-button-focus-overlay,.tak-stroked-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-stroked-button.cdk-program-focused .tak-button-focus-overlay,.tak-flat-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-flat-button.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-button::-moz-focus-inner,.tak-icon-button::-moz-focus-inner,.tak-stroked-button::-moz-focus-inner,.tak-flat-button::-moz-focus-inner{border:0}.tak-raised-button{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)}.tak-raised-button::-moz-focus-inner{border:0}.tak-raised-button.tak-button-disabled{cursor:default}.tak-raised-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-raised-button.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-raised-button::-moz-focus-inner{border:0}.tak-raised-button._tak-animation-noopable{transition:none !important;animation:none !important}.tak-stroked-button{border:1px solid currentColor;padding:0 15px;line-height:34px}.tak-stroked-button .tak-button-ripple.tak-ripple,.tak-stroked-button .tak-button-focus-overlay{top:-1px;left:-1px;right:-1px;bottom:-1px}.tak-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:56px;height:56px;padding:0;flex-shrink:0}.tak-fab::-moz-focus-inner{border:0}.tak-fab.tak-button-disabled{cursor:default}.tak-fab.cdk-keyboard-focused .tak-button-focus-overlay,.tak-fab.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-fab::-moz-focus-inner{border:0}.tak-fab._tak-animation-noopable{transition:none !important;animation:none !important}.tak-fab .tak-button-wrapper{padding:16px 0;display:inline-block;line-height:24px}.tak-mini-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:40px;height:40px;padding:0;flex-shrink:0}.tak-mini-fab::-moz-focus-inner{border:0}.tak-mini-fab.tak-button-disabled{cursor:default}.tak-mini-fab.cdk-keyboard-focused .tak-button-focus-overlay,.tak-mini-fab.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-mini-fab::-moz-focus-inner{border:0}.tak-mini-fab._tak-animation-noopable{transition:none !important;animation:none !important}.tak-mini-fab .tak-button-wrapper{padding:8px 0;display:inline-block;line-height:24px}.tak-icon-button{padding:0;min-width:0;width:40px;height:40px;flex-shrink:0;line-height:40px;border-radius:50%}.tak-icon-button i,.tak-icon-button .tak-icon{line-height:24px}.tak-button-ripple.tak-ripple,.tak-button-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.tak-button-ripple.tak-ripple:not(:empty){transform:translateZ(0)}.tak-button-focus-overlay{opacity:0;transition:opacity 200ms cubic-bezier(0.35, 0, 0.25, 1),background-color 200ms cubic-bezier(0.35, 0, 0.25, 1)}._tak-animation-noopable .tak-button-focus-overlay{transition:none}.tak-button-ripple-round{border-radius:50%;z-index:1}.tak-button .tak-button-wrapper>*,.tak-flat-button .tak-button-wrapper>*,.tak-stroked-button .tak-button-wrapper>*,.tak-raised-button .tak-button-wrapper>*,.tak-icon-button .tak-button-wrapper>*,.tak-fab .tak-button-wrapper>*,.tak-mini-fab .tak-button-wrapper>*{vertical-align:middle}.tak-form-field:not(.tak-form-field-appearance-legacy) .tak-form-field-prefix .tak-icon-button,.tak-form-field:not(.tak-form-field-appearance-legacy) .tak-form-field-suffix .tak-icon-button{display:inline-flex;justify-content:center;align-items:center;font-size:inherit;width:2.5em;height:2.5em}.tak-flat-button::before,.tak-raised-button::before,.tak-fab::before,.tak-mini-fab::before{margin:calc(calc(var(--tak-focus-indicator-border-width, 3px) + 2px) * -1)}.tak-stroked-button::before{margin:calc(calc(var(--tak-focus-indicator-border-width, 3px) + 3px) * -1)}.cdk-high-contrast-active .tak-button,.cdk-high-contrast-active .tak-flat-button,.cdk-high-contrast-active .tak-raised-button,.cdk-high-contrast-active .tak-icon-button,.cdk-high-contrast-active .tak-fab,.cdk-high-contrast-active .tak-mini-fab{outline:solid 1px}',
  ],
  dependencies: [
    {
      kind: 'directive',
      type: i2.TakRipple,
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
  ],
  changeDetection: i0.ChangeDetectionStrategy.OnPush,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakButton,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: `button[tak-button], button[tak-raised-button], button[tak-icon-button],
             button[tak-fab], button[tak-mini-fab], button[tak-stroked-button],
             button[tak-flat-button]`,
          exportAs: 'takButton',
          host: {
            '[attr.disabled]': 'disabled || null',
            '[class._tak-animation-noopable]': '_animationMode === "NoopAnimations"',
            // Add a class for disabled button styling instead of the using attribute
            // selector or pseudo-selector.  This allows users to create focusable
            // disabled buttons without recreating the styles.
            '[class.tak-button-disabled]': 'disabled',
            class: 'tak-focus-indicator',
          },
          inputs: ['disabled', 'disableRipple', 'color'],
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          template:
            '<span class="tak-button-wrapper"><ng-content></ng-content></span>\n<span takRipple class="tak-button-ripple"\n      [class.tak-button-ripple-round]="isRoundButton || isIconButton"\n      [takRippleDisabled]="_isRippleDisabled()"\n      [takRippleCentered]="isIconButton"\n      [takRippleTrigger]="_getHostElement()"></span>\n<span class="tak-button-focus-overlay"></span>\n',
          styles: [
            '.tak-button .tak-button-focus-overlay,.tak-icon-button .tak-button-focus-overlay{opacity:0}.tak-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay,.tak-stroked-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay{opacity:.04}@media(hover: none){.tak-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay,.tak-stroked-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay{opacity:0}}.tak-button,.tak-icon-button,.tak-stroked-button,.tak-flat-button{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible}.tak-button::-moz-focus-inner,.tak-icon-button::-moz-focus-inner,.tak-stroked-button::-moz-focus-inner,.tak-flat-button::-moz-focus-inner{border:0}.tak-button.tak-button-disabled,.tak-icon-button.tak-button-disabled,.tak-stroked-button.tak-button-disabled,.tak-flat-button.tak-button-disabled{cursor:default}.tak-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-button.cdk-program-focused .tak-button-focus-overlay,.tak-icon-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-icon-button.cdk-program-focused .tak-button-focus-overlay,.tak-stroked-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-stroked-button.cdk-program-focused .tak-button-focus-overlay,.tak-flat-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-flat-button.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-button::-moz-focus-inner,.tak-icon-button::-moz-focus-inner,.tak-stroked-button::-moz-focus-inner,.tak-flat-button::-moz-focus-inner{border:0}.tak-raised-button{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)}.tak-raised-button::-moz-focus-inner{border:0}.tak-raised-button.tak-button-disabled{cursor:default}.tak-raised-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-raised-button.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-raised-button::-moz-focus-inner{border:0}.tak-raised-button._tak-animation-noopable{transition:none !important;animation:none !important}.tak-stroked-button{border:1px solid currentColor;padding:0 15px;line-height:34px}.tak-stroked-button .tak-button-ripple.tak-ripple,.tak-stroked-button .tak-button-focus-overlay{top:-1px;left:-1px;right:-1px;bottom:-1px}.tak-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:56px;height:56px;padding:0;flex-shrink:0}.tak-fab::-moz-focus-inner{border:0}.tak-fab.tak-button-disabled{cursor:default}.tak-fab.cdk-keyboard-focused .tak-button-focus-overlay,.tak-fab.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-fab::-moz-focus-inner{border:0}.tak-fab._tak-animation-noopable{transition:none !important;animation:none !important}.tak-fab .tak-button-wrapper{padding:16px 0;display:inline-block;line-height:24px}.tak-mini-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:40px;height:40px;padding:0;flex-shrink:0}.tak-mini-fab::-moz-focus-inner{border:0}.tak-mini-fab.tak-button-disabled{cursor:default}.tak-mini-fab.cdk-keyboard-focused .tak-button-focus-overlay,.tak-mini-fab.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-mini-fab::-moz-focus-inner{border:0}.tak-mini-fab._tak-animation-noopable{transition:none !important;animation:none !important}.tak-mini-fab .tak-button-wrapper{padding:8px 0;display:inline-block;line-height:24px}.tak-icon-button{padding:0;min-width:0;width:40px;height:40px;flex-shrink:0;line-height:40px;border-radius:50%}.tak-icon-button i,.tak-icon-button .tak-icon{line-height:24px}.tak-button-ripple.tak-ripple,.tak-button-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.tak-button-ripple.tak-ripple:not(:empty){transform:translateZ(0)}.tak-button-focus-overlay{opacity:0;transition:opacity 200ms cubic-bezier(0.35, 0, 0.25, 1),background-color 200ms cubic-bezier(0.35, 0, 0.25, 1)}._tak-animation-noopable .tak-button-focus-overlay{transition:none}.tak-button-ripple-round{border-radius:50%;z-index:1}.tak-button .tak-button-wrapper>*,.tak-flat-button .tak-button-wrapper>*,.tak-stroked-button .tak-button-wrapper>*,.tak-raised-button .tak-button-wrapper>*,.tak-icon-button .tak-button-wrapper>*,.tak-fab .tak-button-wrapper>*,.tak-mini-fab .tak-button-wrapper>*{vertical-align:middle}.tak-form-field:not(.tak-form-field-appearance-legacy) .tak-form-field-prefix .tak-icon-button,.tak-form-field:not(.tak-form-field-appearance-legacy) .tak-form-field-suffix .tak-icon-button{display:inline-flex;justify-content:center;align-items:center;font-size:inherit;width:2.5em;height:2.5em}.tak-flat-button::before,.tak-raised-button::before,.tak-fab::before,.tak-mini-fab::before{margin:calc(calc(var(--tak-focus-indicator-border-width, 3px) + 2px) * -1)}.tak-stroked-button::before{margin:calc(calc(var(--tak-focus-indicator-border-width, 3px) + 3px) * -1)}.cdk-high-contrast-active .tak-button,.cdk-high-contrast-active .tak-flat-button,.cdk-high-contrast-active .tak-raised-button,.cdk-high-contrast-active .tak-icon-button,.cdk-high-contrast-active .tak-fab,.cdk-high-contrast-active .tak-mini-fab{outline:solid 1px}',
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.ElementRef },
      { type: i1.FocusMonitor },
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
    ripple: [
      {
        type: ViewChild,
        args: [TakRipple],
      },
    ],
  },
});
/**
 * Material design anchor button.
 */
export class TakAnchor extends TakButton {
  constructor(
    focusMonitor,
    elementRef,
    animationMode,
    /** @breaking-change 14.0.0 _ngZone will be required. */
    _ngZone
  ) {
    super(elementRef, focusMonitor, animationMode);
    this._ngZone = _ngZone;
    this._haltDisabledEvents = event => {
      // A disabled button shouldn't apply any actions
      if (this.disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    /** @breaking-change 14.0.0 _ngZone will be required. */
    if (this._ngZone) {
      this._ngZone.runOutsideAngular(() => {
        this._elementRef.nativeElement.addEventListener('click', this._haltDisabledEvents);
      });
    } else {
      this._elementRef.nativeElement.addEventListener('click', this._haltDisabledEvents);
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this._elementRef.nativeElement.removeEventListener('click', this._haltDisabledEvents);
  }
}
TakAnchor.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakAnchor,
  deps: [
    { token: i1.FocusMonitor },
    { token: i0.ElementRef },
    { token: ANIMATION_MODULE_TYPE, optional: true },
    { token: i0.NgZone, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Component,
});
TakAnchor.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakAnchor,
  selector:
    'a[tak-button], a[tak-raised-button], a[tak-icon-button], a[tak-fab],\n             a[tak-mini-fab], a[tak-stroked-button], a[tak-flat-button]',
  inputs: {
    disabled: 'disabled',
    disableRipple: 'disableRipple',
    color: 'color',
    tabIndex: 'tabIndex',
  },
  host: {
    properties: {
      'attr.tabindex': 'disabled ? -1 : tabIndex',
      'attr.disabled': 'disabled || null',
      'attr.aria-disabled': 'disabled.toString()',
      'class._tak-animation-noopable': '_animationMode === "NoopAnimations"',
      'class.tak-button-disabled': 'disabled',
    },
    classAttribute: 'tak-focus-indicator',
  },
  exportAs: ['takButton', 'takAnchor'],
  usesInheritance: true,
  ngImport: i0,
  template:
    '<span class="tak-button-wrapper"><ng-content></ng-content></span>\n<span takRipple class="tak-button-ripple"\n      [class.tak-button-ripple-round]="isRoundButton || isIconButton"\n      [takRippleDisabled]="_isRippleDisabled()"\n      [takRippleCentered]="isIconButton"\n      [takRippleTrigger]="_getHostElement()"></span>\n<span class="tak-button-focus-overlay"></span>\n',
  styles: [
    '.tak-button .tak-button-focus-overlay,.tak-icon-button .tak-button-focus-overlay{opacity:0}.tak-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay,.tak-stroked-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay{opacity:.04}@media(hover: none){.tak-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay,.tak-stroked-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay{opacity:0}}.tak-button,.tak-icon-button,.tak-stroked-button,.tak-flat-button{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible}.tak-button::-moz-focus-inner,.tak-icon-button::-moz-focus-inner,.tak-stroked-button::-moz-focus-inner,.tak-flat-button::-moz-focus-inner{border:0}.tak-button.tak-button-disabled,.tak-icon-button.tak-button-disabled,.tak-stroked-button.tak-button-disabled,.tak-flat-button.tak-button-disabled{cursor:default}.tak-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-button.cdk-program-focused .tak-button-focus-overlay,.tak-icon-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-icon-button.cdk-program-focused .tak-button-focus-overlay,.tak-stroked-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-stroked-button.cdk-program-focused .tak-button-focus-overlay,.tak-flat-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-flat-button.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-button::-moz-focus-inner,.tak-icon-button::-moz-focus-inner,.tak-stroked-button::-moz-focus-inner,.tak-flat-button::-moz-focus-inner{border:0}.tak-raised-button{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)}.tak-raised-button::-moz-focus-inner{border:0}.tak-raised-button.tak-button-disabled{cursor:default}.tak-raised-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-raised-button.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-raised-button::-moz-focus-inner{border:0}.tak-raised-button._tak-animation-noopable{transition:none !important;animation:none !important}.tak-stroked-button{border:1px solid currentColor;padding:0 15px;line-height:34px}.tak-stroked-button .tak-button-ripple.tak-ripple,.tak-stroked-button .tak-button-focus-overlay{top:-1px;left:-1px;right:-1px;bottom:-1px}.tak-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:56px;height:56px;padding:0;flex-shrink:0}.tak-fab::-moz-focus-inner{border:0}.tak-fab.tak-button-disabled{cursor:default}.tak-fab.cdk-keyboard-focused .tak-button-focus-overlay,.tak-fab.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-fab::-moz-focus-inner{border:0}.tak-fab._tak-animation-noopable{transition:none !important;animation:none !important}.tak-fab .tak-button-wrapper{padding:16px 0;display:inline-block;line-height:24px}.tak-mini-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:40px;height:40px;padding:0;flex-shrink:0}.tak-mini-fab::-moz-focus-inner{border:0}.tak-mini-fab.tak-button-disabled{cursor:default}.tak-mini-fab.cdk-keyboard-focused .tak-button-focus-overlay,.tak-mini-fab.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-mini-fab::-moz-focus-inner{border:0}.tak-mini-fab._tak-animation-noopable{transition:none !important;animation:none !important}.tak-mini-fab .tak-button-wrapper{padding:8px 0;display:inline-block;line-height:24px}.tak-icon-button{padding:0;min-width:0;width:40px;height:40px;flex-shrink:0;line-height:40px;border-radius:50%}.tak-icon-button i,.tak-icon-button .tak-icon{line-height:24px}.tak-button-ripple.tak-ripple,.tak-button-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.tak-button-ripple.tak-ripple:not(:empty){transform:translateZ(0)}.tak-button-focus-overlay{opacity:0;transition:opacity 200ms cubic-bezier(0.35, 0, 0.25, 1),background-color 200ms cubic-bezier(0.35, 0, 0.25, 1)}._tak-animation-noopable .tak-button-focus-overlay{transition:none}.tak-button-ripple-round{border-radius:50%;z-index:1}.tak-button .tak-button-wrapper>*,.tak-flat-button .tak-button-wrapper>*,.tak-stroked-button .tak-button-wrapper>*,.tak-raised-button .tak-button-wrapper>*,.tak-icon-button .tak-button-wrapper>*,.tak-fab .tak-button-wrapper>*,.tak-mini-fab .tak-button-wrapper>*{vertical-align:middle}.tak-form-field:not(.tak-form-field-appearance-legacy) .tak-form-field-prefix .tak-icon-button,.tak-form-field:not(.tak-form-field-appearance-legacy) .tak-form-field-suffix .tak-icon-button{display:inline-flex;justify-content:center;align-items:center;font-size:inherit;width:2.5em;height:2.5em}.tak-flat-button::before,.tak-raised-button::before,.tak-fab::before,.tak-mini-fab::before{margin:calc(calc(var(--tak-focus-indicator-border-width, 3px) + 2px) * -1)}.tak-stroked-button::before{margin:calc(calc(var(--tak-focus-indicator-border-width, 3px) + 3px) * -1)}.cdk-high-contrast-active .tak-button,.cdk-high-contrast-active .tak-flat-button,.cdk-high-contrast-active .tak-raised-button,.cdk-high-contrast-active .tak-icon-button,.cdk-high-contrast-active .tak-fab,.cdk-high-contrast-active .tak-mini-fab{outline:solid 1px}',
  ],
  dependencies: [
    {
      kind: 'directive',
      type: i2.TakRipple,
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
  ],
  changeDetection: i0.ChangeDetectionStrategy.OnPush,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakAnchor,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: `a[tak-button], a[tak-raised-button], a[tak-icon-button], a[tak-fab],
             a[tak-mini-fab], a[tak-stroked-button], a[tak-flat-button]`,
          exportAs: 'takButton, takAnchor',
          host: {
            // Note that we ignore the user-specified tabindex when it's disabled for
            // consistency with the `tak-button` applied on native buttons where even
            // though they have an index, they're not tabbable.
            '[attr.tabindex]': 'disabled ? -1 : tabIndex',
            '[attr.disabled]': 'disabled || null',
            '[attr.aria-disabled]': 'disabled.toString()',
            '[class._tak-animation-noopable]': '_animationMode === "NoopAnimations"',
            '[class.tak-button-disabled]': 'disabled',
            class: 'tak-focus-indicator',
          },
          inputs: ['disabled', 'disableRipple', 'color'],
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          template:
            '<span class="tak-button-wrapper"><ng-content></ng-content></span>\n<span takRipple class="tak-button-ripple"\n      [class.tak-button-ripple-round]="isRoundButton || isIconButton"\n      [takRippleDisabled]="_isRippleDisabled()"\n      [takRippleCentered]="isIconButton"\n      [takRippleTrigger]="_getHostElement()"></span>\n<span class="tak-button-focus-overlay"></span>\n',
          styles: [
            '.tak-button .tak-button-focus-overlay,.tak-icon-button .tak-button-focus-overlay{opacity:0}.tak-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay,.tak-stroked-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay{opacity:.04}@media(hover: none){.tak-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay,.tak-stroked-button:hover:not(.tak-button-disabled) .tak-button-focus-overlay{opacity:0}}.tak-button,.tak-icon-button,.tak-stroked-button,.tak-flat-button{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible}.tak-button::-moz-focus-inner,.tak-icon-button::-moz-focus-inner,.tak-stroked-button::-moz-focus-inner,.tak-flat-button::-moz-focus-inner{border:0}.tak-button.tak-button-disabled,.tak-icon-button.tak-button-disabled,.tak-stroked-button.tak-button-disabled,.tak-flat-button.tak-button-disabled{cursor:default}.tak-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-button.cdk-program-focused .tak-button-focus-overlay,.tak-icon-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-icon-button.cdk-program-focused .tak-button-focus-overlay,.tak-stroked-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-stroked-button.cdk-program-focused .tak-button-focus-overlay,.tak-flat-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-flat-button.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-button::-moz-focus-inner,.tak-icon-button::-moz-focus-inner,.tak-stroked-button::-moz-focus-inner,.tak-flat-button::-moz-focus-inner{border:0}.tak-raised-button{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)}.tak-raised-button::-moz-focus-inner{border:0}.tak-raised-button.tak-button-disabled{cursor:default}.tak-raised-button.cdk-keyboard-focused .tak-button-focus-overlay,.tak-raised-button.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-raised-button::-moz-focus-inner{border:0}.tak-raised-button._tak-animation-noopable{transition:none !important;animation:none !important}.tak-stroked-button{border:1px solid currentColor;padding:0 15px;line-height:34px}.tak-stroked-button .tak-button-ripple.tak-ripple,.tak-stroked-button .tak-button-focus-overlay{top:-1px;left:-1px;right:-1px;bottom:-1px}.tak-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:56px;height:56px;padding:0;flex-shrink:0}.tak-fab::-moz-focus-inner{border:0}.tak-fab.tak-button-disabled{cursor:default}.tak-fab.cdk-keyboard-focused .tak-button-focus-overlay,.tak-fab.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-fab::-moz-focus-inner{border:0}.tak-fab._tak-animation-noopable{transition:none !important;animation:none !important}.tak-fab .tak-button-wrapper{padding:16px 0;display:inline-block;line-height:24px}.tak-mini-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:40px;height:40px;padding:0;flex-shrink:0}.tak-mini-fab::-moz-focus-inner{border:0}.tak-mini-fab.tak-button-disabled{cursor:default}.tak-mini-fab.cdk-keyboard-focused .tak-button-focus-overlay,.tak-mini-fab.cdk-program-focused .tak-button-focus-overlay{opacity:.12}.tak-mini-fab::-moz-focus-inner{border:0}.tak-mini-fab._tak-animation-noopable{transition:none !important;animation:none !important}.tak-mini-fab .tak-button-wrapper{padding:8px 0;display:inline-block;line-height:24px}.tak-icon-button{padding:0;min-width:0;width:40px;height:40px;flex-shrink:0;line-height:40px;border-radius:50%}.tak-icon-button i,.tak-icon-button .tak-icon{line-height:24px}.tak-button-ripple.tak-ripple,.tak-button-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.tak-button-ripple.tak-ripple:not(:empty){transform:translateZ(0)}.tak-button-focus-overlay{opacity:0;transition:opacity 200ms cubic-bezier(0.35, 0, 0.25, 1),background-color 200ms cubic-bezier(0.35, 0, 0.25, 1)}._tak-animation-noopable .tak-button-focus-overlay{transition:none}.tak-button-ripple-round{border-radius:50%;z-index:1}.tak-button .tak-button-wrapper>*,.tak-flat-button .tak-button-wrapper>*,.tak-stroked-button .tak-button-wrapper>*,.tak-raised-button .tak-button-wrapper>*,.tak-icon-button .tak-button-wrapper>*,.tak-fab .tak-button-wrapper>*,.tak-mini-fab .tak-button-wrapper>*{vertical-align:middle}.tak-form-field:not(.tak-form-field-appearance-legacy) .tak-form-field-prefix .tak-icon-button,.tak-form-field:not(.tak-form-field-appearance-legacy) .tak-form-field-suffix .tak-icon-button{display:inline-flex;justify-content:center;align-items:center;font-size:inherit;width:2.5em;height:2.5em}.tak-flat-button::before,.tak-raised-button::before,.tak-fab::before,.tak-mini-fab::before{margin:calc(calc(var(--tak-focus-indicator-border-width, 3px) + 2px) * -1)}.tak-stroked-button::before{margin:calc(calc(var(--tak-focus-indicator-border-width, 3px) + 3px) * -1)}.cdk-high-contrast-active .tak-button,.cdk-high-contrast-active .tak-flat-button,.cdk-high-contrast-active .tak-raised-button,.cdk-high-contrast-active .tak-icon-button,.cdk-high-contrast-active .tak-fab,.cdk-high-contrast-active .tak-mini-fab{outline:solid 1px}',
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i1.FocusMonitor },
      { type: i0.ElementRef },
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
        type: i0.NgZone,
        decorators: [
          {
            type: Optional,
          },
        ],
      },
    ];
  },
  propDecorators: {
    tabIndex: [
      {
        type: Input,
      },
    ],
  },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2J1dHRvbi9idXR0b24udHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYnV0dG9uL2J1dHRvbi5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQStCLE1BQU0sbUJBQW1CLENBQUM7QUFDN0UsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUVWLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsUUFBUSxFQUNSLE1BQU0sRUFDTixLQUFLLEVBRUwsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFJTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLGFBQWEsRUFDYixrQkFBa0IsR0FDbkIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQzs7OztBQUUzRSx5RUFBeUU7QUFDekUsTUFBTSwwQkFBMEIsR0FBRyxRQUFRLENBQUM7QUFFNUM7OztHQUdHO0FBQ0gsTUFBTSxzQkFBc0IsR0FBRztJQUM3QixZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLGlCQUFpQjtJQUNqQixtQkFBbUI7SUFDbkIsb0JBQW9CO0lBQ3BCLGNBQWM7SUFDZCxTQUFTO0NBQ1YsQ0FBQztBQUVGLGdEQUFnRDtBQUNoRCxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQy9CLGFBQWEsQ0FDWCxrQkFBa0IsQ0FDaEI7SUFDRSxZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7Q0FDL0MsQ0FDRixDQUNGLENBQ0YsQ0FBQztBQUVGOztHQUVHO0FBcUJILE1BQU0sT0FBTyxTQUNYLFNBQVEsY0FBYztJQVl0QixZQUNFLFVBQXNCLEVBQ2QsYUFBMkIsRUFDZSxjQUFzQjtRQUV4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Six5RUFBeUU7d0JBQ3pFLHlFQUF5RTt3QkFDekUsbURBQW1EO3dCQUNuRCxpQkFBaUIsRUFBRSwwQkFBMEI7d0JBQzdDLGlCQUFpQixFQUFFLGtCQUFrQjt3QkFDckMsc0JBQXNCLEVBQUUscUJBQXFCO3dCQUM3QyxpQ0FBaUMsRUFBRSxxQ0FBcUM7d0JBQ3hFLDZCQUE2QixFQUFFLFVBQVU7d0JBQ3pDLE9BQU8sRUFBRSxxQkFBcUI7cUJBQy9CLFVBQ08sQ0FBQyxVQUFVLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxpQkFHL0IsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTTs7MEJBUzVDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzswQkFFeEMsUUFBUTs0Q0FQRixRQUFRO3NCQUFoQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNNb25pdG9yLCBGb2N1c2FibGVPcHRpb24sIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBPbkRlc3Ryb3ksXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9wdGlvbmFsLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBBZnRlclZpZXdJbml0LFxuICBOZ1pvbmUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIE1hdFJpcHBsZSxcbiAgbWl4aW5Db2xvcixcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG4vKiogRGVmYXVsdCBjb2xvciBwYWxldHRlIGZvciByb3VuZCBidXR0b25zIChtYXQtZmFiIGFuZCBtYXQtbWluaS1mYWIpICovXG5jb25zdCBERUZBVUxUX1JPVU5EX0JVVFRPTl9DT0xPUiA9ICdhY2NlbnQnO1xuXG4vKipcbiAqIExpc3Qgb2YgY2xhc3NlcyB0byBhZGQgdG8gTWF0QnV0dG9uIGluc3RhbmNlcyBiYXNlZCBvbiBob3N0IGF0dHJpYnV0ZXMgdG9cbiAqIHN0eWxlIGFzIGRpZmZlcmVudCB2YXJpYW50cy5cbiAqL1xuY29uc3QgQlVUVE9OX0hPU1RfQVRUUklCVVRFUyA9IFtcbiAgJ21hdC1idXR0b24nLFxuICAnbWF0LWZsYXQtYnV0dG9uJyxcbiAgJ21hdC1pY29uLWJ1dHRvbicsXG4gICdtYXQtcmFpc2VkLWJ1dHRvbicsXG4gICdtYXQtc3Ryb2tlZC1idXR0b24nLFxuICAnbWF0LW1pbmktZmFiJyxcbiAgJ21hdC1mYWInLFxuXTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRCdXR0b24uXG5jb25zdCBfTWF0QnV0dG9uQmFzZSA9IG1peGluQ29sb3IoXG4gIG1peGluRGlzYWJsZWQoXG4gICAgbWl4aW5EaXNhYmxlUmlwcGxlKFxuICAgICAgY2xhc3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG4gICAgICB9LFxuICAgICksXG4gICksXG4pO1xuXG4vKipcbiAqIE1hdGVyaWFsIGRlc2lnbiBidXR0b24uXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogYGJ1dHRvblttYXQtYnV0dG9uXSwgYnV0dG9uW21hdC1yYWlzZWQtYnV0dG9uXSwgYnV0dG9uW21hdC1pY29uLWJ1dHRvbl0sXG4gICAgICAgICAgICAgYnV0dG9uW21hdC1mYWJdLCBidXR0b25bbWF0LW1pbmktZmFiXSwgYnV0dG9uW21hdC1zdHJva2VkLWJ1dHRvbl0sXG4gICAgICAgICAgICAgYnV0dG9uW21hdC1mbGF0LWJ1dHRvbl1gLFxuICBleHBvcnRBczogJ21hdEJ1dHRvbicsXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIuZGlzYWJsZWRdJzogJ2Rpc2FibGVkIHx8IG51bGwnLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25Nb2RlID09PSBcIk5vb3BBbmltYXRpb25zXCInLFxuICAgIC8vIEFkZCBhIGNsYXNzIGZvciBkaXNhYmxlZCBidXR0b24gc3R5bGluZyBpbnN0ZWFkIG9mIHRoZSB1c2luZyBhdHRyaWJ1dGVcbiAgICAvLyBzZWxlY3RvciBvciBwc2V1ZG8tc2VsZWN0b3IuICBUaGlzIGFsbG93cyB1c2VycyB0byBjcmVhdGUgZm9jdXNhYmxlXG4gICAgLy8gZGlzYWJsZWQgYnV0dG9ucyB3aXRob3V0IHJlY3JlYXRpbmcgdGhlIHN0eWxlcy5cbiAgICAnW2NsYXNzLm1hdC1idXR0b24tZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnY2xhc3MnOiAnbWF0LWZvY3VzLWluZGljYXRvcicsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnYnV0dG9uLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnYnV0dG9uLmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnZGlzYWJsZVJpcHBsZScsICdjb2xvciddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uXG4gIGV4dGVuZHMgX01hdEJ1dHRvbkJhc2VcbiAgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIENhbkRpc2FibGUsIENhbkNvbG9yLCBDYW5EaXNhYmxlUmlwcGxlLCBGb2N1c2FibGVPcHRpb25cbntcbiAgLyoqIFdoZXRoZXIgdGhlIGJ1dHRvbiBpcyByb3VuZC4gKi9cbiAgcmVhZG9ubHkgaXNSb3VuZEJ1dHRvbjogYm9vbGVhbiA9IHRoaXMuX2hhc0hvc3RBdHRyaWJ1dGVzKCdtYXQtZmFiJywgJ21hdC1taW5pLWZhYicpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBidXR0b24gaXMgaWNvbiBidXR0b24uICovXG4gIHJlYWRvbmx5IGlzSWNvbkJ1dHRvbjogYm9vbGVhbiA9IHRoaXMuX2hhc0hvc3RBdHRyaWJ1dGVzKCdtYXQtaWNvbi1idXR0b24nKTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBNYXRSaXBwbGUgaW5zdGFuY2Ugb2YgdGhlIGJ1dHRvbi4gKi9cbiAgQFZpZXdDaGlsZChNYXRSaXBwbGUpIHJpcHBsZTogTWF0UmlwcGxlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZTogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcblxuICAgIC8vIEZvciBlYWNoIG9mIHRoZSB2YXJpYW50IHNlbGVjdG9ycyB0aGF0IGlzIHByZXNlbnQgaW4gdGhlIGJ1dHRvbidzIGhvc3RcbiAgICAvLyBhdHRyaWJ1dGVzLCBhZGQgdGhlIGNvcnJlY3QgY29ycmVzcG9uZGluZyBjbGFzcy5cbiAgICBmb3IgKGNvbnN0IGF0dHIgb2YgQlVUVE9OX0hPU1RfQVRUUklCVVRFUykge1xuICAgICAgaWYgKHRoaXMuX2hhc0hvc3RBdHRyaWJ1dGVzKGF0dHIpKSB7XG4gICAgICAgICh0aGlzLl9nZXRIb3N0RWxlbWVudCgpIGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuYWRkKGF0dHIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBhIGNsYXNzIHRoYXQgYXBwbGllcyB0byBhbGwgYnV0dG9ucy4gVGhpcyBtYWtlcyBpdCBlYXNpZXIgdG8gdGFyZ2V0IGlmIHNvbWVib2R5XG4gICAgLy8gd2FudHMgdG8gdGFyZ2V0IGFsbCBNYXRlcmlhbCBidXR0b25zLiBXZSBkbyBpdCBoZXJlIHJhdGhlciB0aGFuIGBob3N0YCB0byBlbnN1cmUgdGhhdFxuICAgIC8vIHRoZSBjbGFzcyBpcyBhcHBsaWVkIHRvIGRlcml2ZWQgY2xhc3Nlcy5cbiAgICBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LWJ1dHRvbi1iYXNlJyk7XG5cbiAgICBpZiAodGhpcy5pc1JvdW5kQnV0dG9uKSB7XG4gICAgICB0aGlzLmNvbG9yID0gREVGQVVMVF9ST1VORF9CVVRUT05fQ09MT1I7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGJ1dHRvbi4gKi9cbiAgZm9jdXMob3JpZ2luPzogRm9jdXNPcmlnaW4sIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICBpZiAob3JpZ2luKSB7XG4gICAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5fZ2V0SG9zdEVsZW1lbnQoKSwgb3JpZ2luLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZ2V0SG9zdEVsZW1lbnQoKS5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0SG9zdEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIF9pc1JpcHBsZURpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVSaXBwbGUgfHwgdGhpcy5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGJ1dHRvbiBoYXMgb25lIG9mIHRoZSBnaXZlbiBhdHRyaWJ1dGVzLiAqL1xuICBfaGFzSG9zdEF0dHJpYnV0ZXMoLi4uYXR0cmlidXRlczogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gYXR0cmlidXRlcy5zb21lKGF0dHJpYnV0ZSA9PiB0aGlzLl9nZXRIb3N0RWxlbWVudCgpLmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGUpKTtcbiAgfVxufVxuXG4vKipcbiAqIE1hdGVyaWFsIGRlc2lnbiBhbmNob3IgYnV0dG9uLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IGBhW21hdC1idXR0b25dLCBhW21hdC1yYWlzZWQtYnV0dG9uXSwgYVttYXQtaWNvbi1idXR0b25dLCBhW21hdC1mYWJdLFxuICAgICAgICAgICAgIGFbbWF0LW1pbmktZmFiXSwgYVttYXQtc3Ryb2tlZC1idXR0b25dLCBhW21hdC1mbGF0LWJ1dHRvbl1gLFxuICBleHBvcnRBczogJ21hdEJ1dHRvbiwgbWF0QW5jaG9yJyxcbiAgaG9zdDoge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBpZ25vcmUgdGhlIHVzZXItc3BlY2lmaWVkIHRhYmluZGV4IHdoZW4gaXQncyBkaXNhYmxlZCBmb3JcbiAgICAvLyBjb25zaXN0ZW5jeSB3aXRoIHRoZSBgbWF0LWJ1dHRvbmAgYXBwbGllZCBvbiBuYXRpdmUgYnV0dG9ucyB3aGVyZSBldmVuXG4gICAgLy8gdGhvdWdoIHRoZXkgaGF2ZSBhbiBpbmRleCwgdGhleSdyZSBub3QgdGFiYmFibGUuXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdkaXNhYmxlZCA/IC0xIDogdGFiSW5kZXgnLFxuICAgICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25Nb2RlID09PSBcIk5vb3BBbmltYXRpb25zXCInLFxuICAgICdbY2xhc3MubWF0LWJ1dHRvbi1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdjbGFzcyc6ICdtYXQtZm9jdXMtaW5kaWNhdG9yJyxcbiAgfSxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ2Rpc2FibGVSaXBwbGUnLCAnY29sb3InXSxcbiAgdGVtcGxhdGVVcmw6ICdidXR0b24uaHRtbCcsXG4gIHN0eWxlVXJsczogWydidXR0b24uY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRBbmNob3IgZXh0ZW5kcyBNYXRCdXR0b24gaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAvKiogVGFiaW5kZXggb2YgdGhlIGJ1dHRvbi4gKi9cbiAgQElucHV0KCkgdGFiSW5kZXg6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBmb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlOiBzdHJpbmcsXG4gICAgLyoqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIF9uZ1pvbmUgd2lsbCBiZSByZXF1aXJlZC4gKi9cbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9uZ1pvbmU/OiBOZ1pvbmUsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGZvY3VzTW9uaXRvciwgYW5pbWF0aW9uTW9kZSk7XG4gIH1cblxuICBvdmVycmlkZSBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XG5cbiAgICAvKiogQGJyZWFraW5nLWNoYW5nZSAxNC4wLjAgX25nWm9uZSB3aWxsIGJlIHJlcXVpcmVkLiAqL1xuICAgIGlmICh0aGlzLl9uZ1pvbmUpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2hhbHREaXNhYmxlZEV2ZW50cyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5faGFsdERpc2FibGVkRXZlbnRzKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2hhbHREaXNhYmxlZEV2ZW50cyk7XG4gIH1cblxuICBfaGFsdERpc2FibGVkRXZlbnRzID0gKGV2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xuICAgIC8vIEEgZGlzYWJsZWQgYnV0dG9uIHNob3VsZG4ndCBhcHBseSBhbnkgYWN0aW9uc1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9O1xufVxuIiwiPHNwYW4gY2xhc3M9XCJtYXQtYnV0dG9uLXdyYXBwZXJcIj48bmctY29udGVudD48L25nLWNvbnRlbnQ+PC9zcGFuPlxuPHNwYW4gbWF0UmlwcGxlIGNsYXNzPVwibWF0LWJ1dHRvbi1yaXBwbGVcIlxuICAgICAgW2NsYXNzLm1hdC1idXR0b24tcmlwcGxlLXJvdW5kXT1cImlzUm91bmRCdXR0b24gfHwgaXNJY29uQnV0dG9uXCJcbiAgICAgIFttYXRSaXBwbGVEaXNhYmxlZF09XCJfaXNSaXBwbGVEaXNhYmxlZCgpXCJcbiAgICAgIFttYXRSaXBwbGVDZW50ZXJlZF09XCJpc0ljb25CdXR0b25cIlxuICAgICAgW21hdFJpcHBsZVRyaWdnZXJdPVwiX2dldEhvc3RFbGVtZW50KClcIj48L3NwYW4+XG48c3BhbiBjbGFzcz1cIm1hdC1idXR0b24tZm9jdXMtb3ZlcmxheVwiPjwvc3Bhbj5cbiJdfQ==
