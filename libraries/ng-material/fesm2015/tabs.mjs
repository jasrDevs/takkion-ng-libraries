import * as i7 from '@takkion/ng-cdk/a11y';
import { FocusKeyManager, A11yModule } from '@takkion/ng-cdk/a11y';
import * as i5 from '@takkion/ng-cdk/observers';
import { ObserversModule } from '@takkion/ng-cdk/observers';
import * as i2 from '@takkion/ng-cdk/portal';
import { CdkPortal, TemplatePortal, CdkPortalOutlet, PortalModule } from '@takkion/ng-cdk/portal';
import * as i1$2 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import {
  InjectionToken,
  Directive,
  Inject,
  Optional,
  TemplateRef,
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ContentChild,
  ViewChild,
  Input,
  forwardRef,
  EventEmitter,
  Output,
  ContentChildren,
  QueryList,
  Attribute,
  NgModule,
} from '@angular/core';
import * as i4 from '@takkion/ng-material/core';
import {
  mixinDisabled,
  mixinColor,
  mixinDisableRipple,
  mixinTabIndex,
  TAK_RIPPLE_GLOBAL_OPTIONS,
  RippleRenderer,
  TakCommonModule,
  TakRippleModule,
} from '@takkion/ng-material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import {
  take,
  startWith,
  distinctUntilChanged,
  takeUntil,
  switchMap,
  skip,
  filter,
} from 'rxjs/operators';
import { Subject, Subscription, fromEvent, of, merge, EMPTY, Observable, timer } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as i1 from '@takkion/ng-cdk/bidi';
import { coerceBooleanProperty, coerceNumberProperty } from '@takkion/ng-cdk/coercion';
import { hasModifierKey, SPACE, ENTER } from '@takkion/ng-cdk/keycodes';
import * as i3 from '@takkion/ng-cdk/platform';
import { normalizePassiveListenerOptions } from '@takkion/ng-cdk/platform';
import * as i1$1 from '@takkion/ng-cdk/scrolling';

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Injection token for the TakInkBar's Positioner. */
const _TAK_INK_BAR_POSITIONER = new InjectionToken('TakInkBarPositioner', {
  providedIn: 'root',
  factory: _TAK_INK_BAR_POSITIONER_FACTORY,
});
/**
 * The default positioner function for the TakInkBar.
 * @docs-private
 */
function _TAK_INK_BAR_POSITIONER_FACTORY() {
  const method = element => ({
    left: element ? (element.offsetLeft || 0) + 'px' : '0',
    width: element ? (element.offsetWidth || 0) + 'px' : '0',
  });
  return method;
}
/**
 * The ink-bar is used to display and animate the line underneath the current active tab label.
 * @docs-private
 */
class TakInkBar {
  constructor(_elementRef, _ngZone, _inkBarPositioner, _animationMode) {
    this._elementRef = _elementRef;
    this._ngZone = _ngZone;
    this._inkBarPositioner = _inkBarPositioner;
    this._animationMode = _animationMode;
  }
  /**
   * Calculates the styles from the provided element in order to align the ink-bar to that element.
   * Shows the ink bar if previously set as hidden.
   * @param element
   */
  alignToElement(element) {
    this.show();
    // `onStable` might not run for a while if the zone has already stabilized.
    // Wrap the call in `NgZone.run` to ensure that it runs relatively soon.
    this._ngZone.run(() => {
      this._ngZone.onStable.pipe(take(1)).subscribe(() => {
        const positions = this._inkBarPositioner(element);
        const inkBar = this._elementRef.nativeElement;
        inkBar.style.left = positions.left;
        inkBar.style.width = positions.width;
      });
    });
  }
  /** Shows the ink bar. */
  show() {
    this._elementRef.nativeElement.style.visibility = 'visible';
  }
  /** Hides the ink bar. */
  hide() {
    this._elementRef.nativeElement.style.visibility = 'hidden';
  }
}
TakInkBar.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakInkBar,
  deps: [
    { token: i0.ElementRef },
    { token: i0.NgZone },
    { token: _TAK_INK_BAR_POSITIONER },
    { token: ANIMATION_MODULE_TYPE, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakInkBar.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakInkBar,
  selector: 'tak-ink-bar',
  host: {
    properties: { 'class._tak-animation-noopable': "_animationMode === 'NoopAnimations'" },
    classAttribute: 'tak-ink-bar',
  },
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakInkBar,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: 'tak-ink-bar',
          host: {
            class: 'tak-ink-bar',
            '[class._tak-animation-noopable]': `_animationMode === 'NoopAnimations'`,
          },
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.ElementRef },
      { type: i0.NgZone },
      {
        type: undefined,
        decorators: [
          {
            type: Inject,
            args: [_TAK_INK_BAR_POSITIONER],
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
 * Injection token that can be used to reference instances of `TakTabContent`. It serves as
 * alternative token to the actual `TakTabContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const TAK_TAB_CONTENT = new InjectionToken('TakTabContent');
/** Decorates the `ng-template` tags and reads out the template from it. */
class TakTabContent {
  constructor(/** Content for the tab. */ template) {
    this.template = template;
  }
}
TakTabContent.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabContent,
  deps: [{ token: i0.TemplateRef }],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakTabContent.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakTabContent,
  selector: '[takTabContent]',
  providers: [{ provide: TAK_TAB_CONTENT, useExisting: TakTabContent }],
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabContent,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[takTabContent]',
          providers: [{ provide: TAK_TAB_CONTENT, useExisting: TakTabContent }],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [{ type: i0.TemplateRef }];
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
 * Injection token that can be used to reference instances of `TakTabLabel`. It serves as
 * alternative token to the actual `TakTabLabel` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const TAK_TAB_LABEL = new InjectionToken('TakTabLabel');
/**
 * Used to provide a tab label to a tab without causing a circular dependency.
 * @docs-private
 */
const TAK_TAB = new InjectionToken('TAK_TAB');
/** Used to flag tab labels for use with the portal directive */
class TakTabLabel extends CdkPortal {
  constructor(templateRef, viewContainerRef, _closestTab) {
    super(templateRef, viewContainerRef);
    this._closestTab = _closestTab;
  }
}
TakTabLabel.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabLabel,
  deps: [
    { token: i0.TemplateRef },
    { token: i0.ViewContainerRef },
    { token: TAK_TAB, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakTabLabel.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakTabLabel,
  selector: '[tak-tab-label], [takTabLabel]',
  providers: [{ provide: TAK_TAB_LABEL, useExisting: TakTabLabel }],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabLabel,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[tak-tab-label], [takTabLabel]',
          providers: [{ provide: TAK_TAB_LABEL, useExisting: TakTabLabel }],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.TemplateRef },
      { type: i0.ViewContainerRef },
      {
        type: undefined,
        decorators: [
          {
            type: Inject,
            args: [TAK_TAB],
          },
          {
            type: Optional,
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
// Boilerplate for applying mixins to TakTab.
/** @docs-private */
const _TakTabBase = mixinDisabled(class {});
/**
 * Used to provide a tab group to a tab without causing a circular dependency.
 * @docs-private
 */
const TAK_TAB_GROUP = new InjectionToken('TAK_TAB_GROUP');
class TakTab extends _TakTabBase {
  constructor(_viewContainerRef, _closestTabGroup) {
    super();
    this._viewContainerRef = _viewContainerRef;
    this._closestTabGroup = _closestTabGroup;
    /** Plain text label for the tab, used when there is no template label. */
    this.textLabel = '';
    /** Portal that will be the hosted content of the tab */
    this._contentPortal = null;
    /** Emits whenever the internal state of the tab changes. */
    this._stateChanges = new Subject();
    /**
     * The relatively indexed position where 0 represents the center, negative is left, and positive
     * represents the right.
     */
    this.position = null;
    /**
     * The initial relatively index origin of the tab if it was created and selected after there
     * was already a selected tab. Provides context of what position the tab should originate from.
     */
    this.origin = null;
    /**
     * Whether the tab is currently active.
     */
    this.isActive = false;
  }
  /** Content for the tab label given by `<ng-template tak-tab-label>`. */
  get templateLabel() {
    return this._templateLabel;
  }
  set templateLabel(value) {
    this._setTemplateLabelInput(value);
  }
  /** @docs-private */
  get content() {
    return this._contentPortal;
  }
  ngOnChanges(changes) {
    if (changes.hasOwnProperty('textLabel') || changes.hasOwnProperty('disabled')) {
      this._stateChanges.next();
    }
  }
  ngOnDestroy() {
    this._stateChanges.complete();
  }
  ngOnInit() {
    this._contentPortal = new TemplatePortal(
      this._explicitContent || this._implicitContent,
      this._viewContainerRef
    );
  }
  /**
   * This has been extracted to a util because of TS 4 and VE.
   * View Engine doesn't support property rename inheritance.
   * TS 4.0 doesn't allow properties to override accessors or vice-versa.
   * @docs-private
   */
  _setTemplateLabelInput(value) {
    // Only update the label if the query managed to find one. This works around an issue where a
    // user may have manually set `templateLabel` during creation mode, which would then get
    // clobbered by `undefined` when the query resolves. Also note that we check that the closest
    // tab matches the current one so that we don't pick up labels from nested tabs.
    if (value && value._closestTab === this) {
      this._templateLabel = value;
    }
  }
}
TakTab.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTab,
  deps: [{ token: i0.ViewContainerRef }, { token: TAK_TAB_GROUP, optional: true }],
  target: i0.ɵɵFactoryTarget.Component,
});
TakTab.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakTab,
  selector: 'tak-tab',
  inputs: {
    disabled: 'disabled',
    textLabel: ['label', 'textLabel'],
    ariaLabel: ['aria-label', 'ariaLabel'],
    ariaLabelledby: ['aria-labelledby', 'ariaLabelledby'],
    labelClass: 'labelClass',
    bodyClass: 'bodyClass',
  },
  providers: [{ provide: TAK_TAB, useExisting: TakTab }],
  queries: [
    { propertyName: 'templateLabel', first: true, predicate: TAK_TAB_LABEL, descendants: true },
    {
      propertyName: '_explicitContent',
      first: true,
      predicate: TAK_TAB_CONTENT,
      descendants: true,
      read: TemplateRef,
      static: true,
    },
  ],
  viewQueries: [
    {
      propertyName: '_implicitContent',
      first: true,
      predicate: TemplateRef,
      descendants: true,
      static: true,
    },
  ],
  exportAs: ['takTab'],
  usesInheritance: true,
  usesOnChanges: true,
  ngImport: i0,
  template:
    '<!-- Create a template for the content of the <tak-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n',
  changeDetection: i0.ChangeDetectionStrategy.Default,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTab,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'tak-tab',
          inputs: ['disabled'],
          changeDetection: ChangeDetectionStrategy.Default,
          encapsulation: ViewEncapsulation.None,
          exportAs: 'takTab',
          providers: [{ provide: TAK_TAB, useExisting: TakTab }],
          template:
            '<!-- Create a template for the content of the <tak-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n',
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.ViewContainerRef },
      {
        type: undefined,
        decorators: [
          {
            type: Inject,
            args: [TAK_TAB_GROUP],
          },
          {
            type: Optional,
          },
        ],
      },
    ];
  },
  propDecorators: {
    templateLabel: [
      {
        type: ContentChild,
        args: [TAK_TAB_LABEL],
      },
    ],
    _explicitContent: [
      {
        type: ContentChild,
        args: [TAK_TAB_CONTENT, { read: TemplateRef, static: true }],
      },
    ],
    _implicitContent: [
      {
        type: ViewChild,
        args: [TemplateRef, { static: true }],
      },
    ],
    textLabel: [
      {
        type: Input,
        args: ['label'],
      },
    ],
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
    labelClass: [
      {
        type: Input,
      },
    ],
    bodyClass: [
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
 * Animations used by the Material tabs.
 * @docs-private
 */
const takTabsAnimations = {
  /** Animation translates a tab along the X axis. */
  translateTab: trigger('translateTab', [
    // Transitions to `none` instead of 0, because some browsers might blur the content.
    state('center, void, left-origin-center, right-origin-center', style({ transform: 'none' })),
    // If the tab is either on the left or right, we additionally add a `min-height` of 1px
    // in order to ensure that the element has a height before its state changes. This is
    // necessary because Chrome does seem to skip the transition in RTL mode if the element does
    // not have a static height and is not rendered. See related issue: #9465
    state(
      'left',
      style({
        transform: 'translate3d(-100%, 0, 0)',
        minHeight: '1px',
        // Normally this is redundant since we detach the content from the DOM, but if the user
        // opted into keeping the content in the DOM, we have to hide it so it isn't focusable.
        visibility: 'hidden',
      })
    ),
    state(
      'right',
      style({
        transform: 'translate3d(100%, 0, 0)',
        minHeight: '1px',
        visibility: 'hidden',
      })
    ),
    transition(
      '* => left, * => right, left => center, right => center',
      animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)')
    ),
    transition('void => left-origin-center', [
      style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' }),
      animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)'),
    ]),
    transition('void => right-origin-center', [
      style({ transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' }),
      animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)'),
    ]),
  ]),
};

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * The portal host directive for the contents of the tab.
 * @docs-private
 */
class TakTabBodyPortal extends CdkPortalOutlet {
  constructor(componentFactoryResolver, viewContainerRef, _host, _document) {
    super(componentFactoryResolver, viewContainerRef, _document);
    this._host = _host;
    /** Subscription to events for when the tab body begins centering. */
    this._centeringSub = Subscription.EMPTY;
    /** Subscription to events for when the tab body finishes leaving from center position. */
    this._leavingSub = Subscription.EMPTY;
  }
  /** Set initial visibility or set up subscription for changing visibility. */
  ngOnInit() {
    super.ngOnInit();
    this._centeringSub = this._host._beforeCentering
      .pipe(startWith(this._host._isCenterPosition(this._host._position)))
      .subscribe(isCentering => {
        if (isCentering && !this.hasAttached()) {
          this.attach(this._host._content);
        }
      });
    this._leavingSub = this._host._afterLeavingCenter.subscribe(() => {
      if (!this._host.preserveContent) {
        this.detach();
      }
    });
  }
  /** Clean up centering subscription. */
  ngOnDestroy() {
    super.ngOnDestroy();
    this._centeringSub.unsubscribe();
    this._leavingSub.unsubscribe();
  }
}
TakTabBodyPortal.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabBodyPortal,
  deps: [
    { token: i0.ComponentFactoryResolver },
    { token: i0.ViewContainerRef },
    { token: forwardRef(() => TakTabBody) },
    { token: DOCUMENT },
  ],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakTabBodyPortal.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakTabBodyPortal,
  selector: '[takTabBodyHost]',
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabBodyPortal,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[takTabBodyHost]',
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.ComponentFactoryResolver },
      { type: i0.ViewContainerRef },
      {
        type: TakTabBody,
        decorators: [
          {
            type: Inject,
            args: [forwardRef(() => TakTabBody)],
          },
        ],
      },
      {
        type: undefined,
        decorators: [
          {
            type: Inject,
            args: [DOCUMENT],
          },
        ],
      },
    ];
  },
});
/**
 * Base class with all of the `TakTabBody` functionality.
 * @docs-private
 */
class _TakTabBodyBase {
  constructor(_elementRef, _dir, changeDetectorRef) {
    this._elementRef = _elementRef;
    this._dir = _dir;
    /** Subscription to the directionality change observable. */
    this._dirChangeSubscription = Subscription.EMPTY;
    /** Emits when an animation on the tab is complete. */
    this._translateTabComplete = new Subject();
    /** Event emitted when the tab begins to animate towards the center as the active tab. */
    this._onCentering = new EventEmitter();
    /** Event emitted before the centering of the tab begins. */
    this._beforeCentering = new EventEmitter();
    /** Event emitted before the centering of the tab begins. */
    this._afterLeavingCenter = new EventEmitter();
    /** Event emitted when the tab completes its animation towards the center. */
    this._onCentered = new EventEmitter(true);
    // Note that the default value will always be overwritten by `TakTabBody`, but we need one
    // anyway to prevent the animations module from throwing an error if the body is used on its own.
    /** Duration for the tab's animation. */
    this.animationDuration = '500ms';
    /** Whether the tab's content should be kept in the DOM while it's off-screen. */
    this.preserveContent = false;
    if (_dir) {
      this._dirChangeSubscription = _dir.change.subscribe(dir => {
        this._computePositionAnimationState(dir);
        changeDetectorRef.markForCheck();
      });
    }
    // Ensure that we get unique animation events, because the `.done` callback can get
    // invoked twice in some browsers. See https://github.com/angular/angular/issues/24084.
    this._translateTabComplete
      .pipe(
        distinctUntilChanged((x, y) => {
          return x.fromState === y.fromState && x.toState === y.toState;
        })
      )
      .subscribe(event => {
        // If the transition to the center is complete, emit an event.
        if (this._isCenterPosition(event.toState) && this._isCenterPosition(this._position)) {
          this._onCentered.emit();
        }
        if (this._isCenterPosition(event.fromState) && !this._isCenterPosition(this._position)) {
          this._afterLeavingCenter.emit();
        }
      });
  }
  /** The shifted index position of the tab body, where zero represents the active center tab. */
  set position(position) {
    this._positionIndex = position;
    this._computePositionAnimationState();
  }
  /**
   * After initialized, check if the content is centered and has an origin. If so, set the
   * special position states that transition the tab from the left or right before centering.
   */
  ngOnInit() {
    if (this._position == 'center' && this.origin != null) {
      this._position = this._computePositionFromOrigin(this.origin);
    }
  }
  ngOnDestroy() {
    this._dirChangeSubscription.unsubscribe();
    this._translateTabComplete.complete();
  }
  _onTranslateTabStarted(event) {
    const isCentering = this._isCenterPosition(event.toState);
    this._beforeCentering.emit(isCentering);
    if (isCentering) {
      this._onCentering.emit(this._elementRef.nativeElement.clientHeight);
    }
  }
  /** The text direction of the containing app. */
  _getLayoutDirection() {
    return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
  }
  /** Whether the provided position state is considered center, regardless of origin. */
  _isCenterPosition(position) {
    return (
      position == 'center' || position == 'left-origin-center' || position == 'right-origin-center'
    );
  }
  /** Computes the position state that will be used for the tab-body animation trigger. */
  _computePositionAnimationState(dir = this._getLayoutDirection()) {
    if (this._positionIndex < 0) {
      this._position = dir == 'ltr' ? 'left' : 'right';
    } else if (this._positionIndex > 0) {
      this._position = dir == 'ltr' ? 'right' : 'left';
    } else {
      this._position = 'center';
    }
  }
  /**
   * Computes the position state based on the specified origin position. This is used if the
   * tab is becoming visible immediately after creation.
   */
  _computePositionFromOrigin(origin) {
    const dir = this._getLayoutDirection();
    if ((dir == 'ltr' && origin <= 0) || (dir == 'rtl' && origin > 0)) {
      return 'left-origin-center';
    }
    return 'right-origin-center';
  }
}
_TakTabBodyBase.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakTabBodyBase,
  deps: [
    { token: i0.ElementRef },
    { token: i1.Directionality, optional: true },
    { token: i0.ChangeDetectorRef },
  ],
  target: i0.ɵɵFactoryTarget.Directive,
});
_TakTabBodyBase.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: _TakTabBodyBase,
  inputs: {
    _content: ['content', '_content'],
    origin: 'origin',
    animationDuration: 'animationDuration',
    preserveContent: 'preserveContent',
    position: 'position',
  },
  outputs: {
    _onCentering: '_onCentering',
    _beforeCentering: '_beforeCentering',
    _afterLeavingCenter: '_afterLeavingCenter',
    _onCentered: '_onCentered',
  },
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakTabBodyBase,
  decorators: [
    {
      type: Directive,
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.ElementRef },
      {
        type: i1.Directionality,
        decorators: [
          {
            type: Optional,
          },
        ],
      },
      { type: i0.ChangeDetectorRef },
    ];
  },
  propDecorators: {
    _onCentering: [
      {
        type: Output,
      },
    ],
    _beforeCentering: [
      {
        type: Output,
      },
    ],
    _afterLeavingCenter: [
      {
        type: Output,
      },
    ],
    _onCentered: [
      {
        type: Output,
      },
    ],
    _content: [
      {
        type: Input,
        args: ['content'],
      },
    ],
    origin: [
      {
        type: Input,
      },
    ],
    animationDuration: [
      {
        type: Input,
      },
    ],
    preserveContent: [
      {
        type: Input,
      },
    ],
    position: [
      {
        type: Input,
      },
    ],
  },
});
/**
 * Wrapper for the contents of a tab.
 * @docs-private
 */
class TakTabBody extends _TakTabBodyBase {
  constructor(elementRef, dir, changeDetectorRef) {
    super(elementRef, dir, changeDetectorRef);
  }
}
TakTabBody.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabBody,
  deps: [
    { token: i0.ElementRef },
    { token: i1.Directionality, optional: true },
    { token: i0.ChangeDetectorRef },
  ],
  target: i0.ɵɵFactoryTarget.Component,
});
TakTabBody.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakTabBody,
  selector: 'tak-tab-body',
  host: { classAttribute: 'tak-tab-body' },
  viewQueries: [
    { propertyName: '_portalHost', first: true, predicate: CdkPortalOutlet, descendants: true },
  ],
  usesInheritance: true,
  ngImport: i0,
  template:
    '<div class="tak-tab-body-content" #content\n     [@translateTab]="{\n        value: _position,\n        params: {animationDuration: animationDuration}\n     }"\n     (@translateTab.start)="_onTranslateTabStarted($event)"\n     (@translateTab.done)="_translateTabComplete.next($event)"\n     cdkScrollable>\n  <ng-template takTabBodyHost></ng-template>\n</div>\n',
  styles: [
    '.tak-tab-body-content{height:100%;overflow:auto}.tak-tab-group-dynamic-height .tak-tab-body-content{overflow:hidden}.tak-tab-body-content[style*="visibility: hidden"]{display:none}',
  ],
  dependencies: [{ kind: 'directive', type: TakTabBodyPortal, selector: '[takTabBodyHost]' }],
  animations: [takTabsAnimations.translateTab],
  changeDetection: i0.ChangeDetectionStrategy.Default,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabBody,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'tak-tab-body',
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.Default,
          animations: [takTabsAnimations.translateTab],
          host: {
            class: 'tak-tab-body',
          },
          template:
            '<div class="tak-tab-body-content" #content\n     [@translateTab]="{\n        value: _position,\n        params: {animationDuration: animationDuration}\n     }"\n     (@translateTab.start)="_onTranslateTabStarted($event)"\n     (@translateTab.done)="_translateTabComplete.next($event)"\n     cdkScrollable>\n  <ng-template takTabBodyHost></ng-template>\n</div>\n',
          styles: [
            '.tak-tab-body-content{height:100%;overflow:auto}.tak-tab-group-dynamic-height .tak-tab-body-content{overflow:hidden}.tak-tab-body-content[style*="visibility: hidden"]{display:none}',
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.ElementRef },
      {
        type: i1.Directionality,
        decorators: [
          {
            type: Optional,
          },
        ],
      },
      { type: i0.ChangeDetectorRef },
    ];
  },
  propDecorators: {
    _portalHost: [
      {
        type: ViewChild,
        args: [CdkPortalOutlet],
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
/** Injection token that can be used to provide the default options the tabs module. */
const TAK_TABS_CONFIG = new InjectionToken('TAK_TABS_CONFIG');

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Boilerplate for applying mixins to TakTabLabelWrapper.
/** @docs-private */
const _TakTabLabelWrapperBase = mixinDisabled(class {});
/**
 * Used in the `tak-tab-group` view to display tab labels.
 * @docs-private
 */
class TakTabLabelWrapper extends _TakTabLabelWrapperBase {
  constructor(elementRef) {
    super();
    this.elementRef = elementRef;
  }
  /** Sets focus on the wrapper element */
  focus() {
    this.elementRef.nativeElement.focus();
  }
  getOffsetLeft() {
    return this.elementRef.nativeElement.offsetLeft;
  }
  getOffsetWidth() {
    return this.elementRef.nativeElement.offsetWidth;
  }
}
TakTabLabelWrapper.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabLabelWrapper,
  deps: [{ token: i0.ElementRef }],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakTabLabelWrapper.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakTabLabelWrapper,
  selector: '[takTabLabelWrapper]',
  inputs: { disabled: 'disabled' },
  host: {
    properties: { 'class.tak-tab-disabled': 'disabled', 'attr.aria-disabled': '!!disabled' },
  },
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabLabelWrapper,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[takTabLabelWrapper]',
          inputs: ['disabled'],
          host: {
            '[class.tak-tab-disabled]': 'disabled',
            '[attr.aria-disabled]': '!!disabled',
          },
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [{ type: i0.ElementRef }];
  },
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Config used to bind passive event listeners */
const passiveEventListenerOptions = normalizePassiveListenerOptions({
  passive: true,
});
/**
 * The distance in pixels that will be overshot when scrolling a tab label into view. This helps
 * provide a small affordance to the label next to it.
 */
const EXAGGERATED_OVERSCROLL = 60;
/**
 * Amount of milliseconds to wait before starting to scroll the header automatically.
 * Set a little conservatively in order to handle fake events dispatched on touch devices.
 */
const HEADER_SCROLL_DELAY = 650;
/**
 * Interval in milliseconds at which to scroll the header
 * while the user is holding their pointer.
 */
const HEADER_SCROLL_INTERVAL = 100;
/**
 * Base class for a tab header that supported pagination.
 * @docs-private
 */
class TakPaginatedTabHeader {
  constructor(
    _elementRef,
    _changeDetectorRef,
    _viewportRuler,
    _dir,
    _ngZone,
    _platform,
    _animationMode
  ) {
    this._elementRef = _elementRef;
    this._changeDetectorRef = _changeDetectorRef;
    this._viewportRuler = _viewportRuler;
    this._dir = _dir;
    this._ngZone = _ngZone;
    this._platform = _platform;
    this._animationMode = _animationMode;
    /** The distance in pixels that the tab labels should be translated to the left. */
    this._scrollDistance = 0;
    /** Whether the header should scroll to the selected index after the view has been checked. */
    this._selectedIndexChanged = false;
    /** Emits when the component is destroyed. */
    this._destroyed = new Subject();
    /** Whether the controls for pagination should be displayed */
    this._showPaginationControls = false;
    /** Whether the tab list can be scrolled more towards the end of the tab label list. */
    this._disableScrollAfter = true;
    /** Whether the tab list can be scrolled more towards the beginning of the tab label list. */
    this._disableScrollBefore = true;
    /** Stream that will stop the automated scrolling. */
    this._stopScrolling = new Subject();
    this._disablePagination = false;
    this._selectedIndex = 0;
    /** Event emitted when the option is selected. */
    this.selectFocusedIndex = new EventEmitter();
    /** Event emitted when a label is focused. */
    this.indexFocused = new EventEmitter();
    // Bind the `mouseleave` event on the outside since it doesn't change anything in the view.
    _ngZone.runOutsideAngular(() => {
      fromEvent(_elementRef.nativeElement, 'mouseleave')
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => {
          this._stopInterval();
        });
    });
  }
  /**
   * Whether pagination should be disabled. This can be used to avoid unnecessary
   * layout recalculations if it's known that pagination won't be required.
   */
  get disablePagination() {
    return this._disablePagination;
  }
  set disablePagination(value) {
    this._disablePagination = coerceBooleanProperty(value);
  }
  /** The index of the active tab. */
  get selectedIndex() {
    return this._selectedIndex;
  }
  set selectedIndex(value) {
    value = coerceNumberProperty(value);
    if (this._selectedIndex != value) {
      this._selectedIndexChanged = true;
      this._selectedIndex = value;
      if (this._keyManager) {
        this._keyManager.updateActiveItem(value);
      }
    }
  }
  ngAfterViewInit() {
    // We need to handle these events manually, because we want to bind passive event listeners.
    fromEvent(this._previousPaginator.nativeElement, 'touchstart', passiveEventListenerOptions)
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        this._handlePaginatorPress('before');
      });
    fromEvent(this._nextPaginator.nativeElement, 'touchstart', passiveEventListenerOptions)
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        this._handlePaginatorPress('after');
      });
  }
  ngAfterContentInit() {
    const dirChange = this._dir ? this._dir.change : of('ltr');
    const resize = this._viewportRuler.change(150);
    const realign = () => {
      this.updatePagination();
      this._alignInkBarToSelectedTab();
    };
    this._keyManager = new FocusKeyManager(this._items)
      .withHorizontalOrientation(this._getLayoutDirection())
      .withHomeAndEnd()
      .withWrap();
    this._keyManager.updateActiveItem(this._selectedIndex);
    // Defer the first call in order to allow for slower browsers to lay out the elements.
    // This helps in cases where the user lands directly on a page with paginated tabs.
    // Note that we use `onStable` instead of `requestAnimationFrame`, because the latter
    // can hold up tests that are in a background tab.
    this._ngZone.onStable.pipe(take(1)).subscribe(realign);
    // On dir change or window resize, realign the ink bar and update the orientation of
    // the key manager if the direction has changed.
    merge(dirChange, resize, this._items.changes, this._itemsResized())
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        // We need to defer this to give the browser some time to recalculate
        // the element dimensions. The call has to be wrapped in `NgZone.run`,
        // because the viewport change handler runs outside of Angular.
        this._ngZone.run(() => {
          Promise.resolve().then(() => {
            // Clamp the scroll distance, because it can change with the number of tabs.
            this._scrollDistance = Math.max(
              0,
              Math.min(this._getMaxScrollDistance(), this._scrollDistance)
            );
            realign();
          });
        });
        this._keyManager.withHorizontalOrientation(this._getLayoutDirection());
      });
    // If there is a change in the focus key manager we need to emit the `indexFocused`
    // event in order to provide a public event that notifies about focus changes. Also we realign
    // the tabs container by scrolling the new focused tab into the visible section.
    this._keyManager.change.pipe(takeUntil(this._destroyed)).subscribe(newFocusIndex => {
      this.indexFocused.emit(newFocusIndex);
      this._setTabFocus(newFocusIndex);
    });
  }
  /** Sends any changes that could affect the layout of the items. */
  _itemsResized() {
    if (typeof ResizeObserver !== 'function') {
      return EMPTY;
    }
    return this._items.changes.pipe(
      startWith(this._items),
      switchMap(
        tabItems =>
          new Observable(observer =>
            this._ngZone.runOutsideAngular(() => {
              const resizeObserver = new ResizeObserver(entries => observer.next(entries));
              tabItems.forEach(item => resizeObserver.observe(item.elementRef.nativeElement));
              return () => {
                resizeObserver.disconnect();
              };
            })
          )
      ),
      // Skip the first emit since the resize observer emits when an item
      // is observed for new items when the tab is already inserted
      skip(1),
      // Skip emissions where all the elements are invisible since we don't want
      // the header to try and re-render with invalid measurements. See #25574.
      filter(entries => entries.some(e => e.contentRect.width > 0 && e.contentRect.height > 0))
    );
  }
  ngAfterContentChecked() {
    // If the number of tab labels have changed, check if scrolling should be enabled
    if (this._tabLabelCount != this._items.length) {
      this.updatePagination();
      this._tabLabelCount = this._items.length;
      this._changeDetectorRef.markForCheck();
    }
    // If the selected index has changed, scroll to the label and check if the scrolling controls
    // should be disabled.
    if (this._selectedIndexChanged) {
      this._scrollToLabel(this._selectedIndex);
      this._checkScrollingControls();
      this._alignInkBarToSelectedTab();
      this._selectedIndexChanged = false;
      this._changeDetectorRef.markForCheck();
    }
    // If the scroll distance has been changed (tab selected, focused, scroll controls activated),
    // then translate the header to reflect this.
    if (this._scrollDistanceChanged) {
      this._updateTabScrollPosition();
      this._scrollDistanceChanged = false;
      this._changeDetectorRef.markForCheck();
    }
  }
  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
    this._stopScrolling.complete();
  }
  /** Handles keyboard events on the header. */
  _handleKeydown(event) {
    // We don't handle any key bindings with a modifier key.
    if (hasModifierKey(event)) {
      return;
    }
    switch (event.keyCode) {
      case ENTER:
      case SPACE:
        if (this.focusIndex !== this.selectedIndex) {
          this.selectFocusedIndex.emit(this.focusIndex);
          this._itemSelected(event);
        }
        break;
      default:
        this._keyManager.onKeydown(event);
    }
  }
  /**
   * Callback for when the MutationObserver detects that the content has changed.
   */
  _onContentChanges() {
    const textContent = this._elementRef.nativeElement.textContent;
    // We need to diff the text content of the header, because the MutationObserver callback
    // will fire even if the text content didn't change which is inefficient and is prone
    // to infinite loops if a poorly constructed expression is passed in (see #14249).
    if (textContent !== this._currentTextContent) {
      this._currentTextContent = textContent || '';
      // The content observer runs outside the `NgZone` by default, which
      // means that we need to bring the callback back in ourselves.
      this._ngZone.run(() => {
        this.updatePagination();
        this._alignInkBarToSelectedTab();
        this._changeDetectorRef.markForCheck();
      });
    }
  }
  /**
   * Updates the view whether pagination should be enabled or not.
   *
   * WARNING: Calling this method can be very costly in terms of performance. It should be called
   * as infrequently as possible from outside of the Tabs component as it causes a reflow of the
   * page.
   */
  updatePagination() {
    this._checkPaginationEnabled();
    this._checkScrollingControls();
    this._updateTabScrollPosition();
  }
  /** Tracks which element has focus; used for keyboard navigation */
  get focusIndex() {
    return this._keyManager ? this._keyManager.activeItemIndex : 0;
  }
  /** When the focus index is set, we must manually send focus to the correct label */
  set focusIndex(value) {
    if (!this._isValidIndex(value) || this.focusIndex === value || !this._keyManager) {
      return;
    }
    this._keyManager.setActiveItem(value);
  }
  /**
   * Determines if an index is valid.  If the tabs are not ready yet, we assume that the user is
   * providing a valid index and return true.
   */
  _isValidIndex(index) {
    if (!this._items) {
      return true;
    }
    const tab = this._items ? this._items.toArray()[index] : null;
    return !!tab && !tab.disabled;
  }
  /**
   * Sets focus on the HTML element for the label wrapper and scrolls it into the view if
   * scrolling is enabled.
   */
  _setTabFocus(tabIndex) {
    if (this._showPaginationControls) {
      this._scrollToLabel(tabIndex);
    }
    if (this._items && this._items.length) {
      this._items.toArray()[tabIndex].focus();
      // Do not let the browser manage scrolling to focus the element, this will be handled
      // by using translation. In LTR, the scroll left should be 0. In RTL, the scroll width
      // should be the full width minus the offset width.
      const containerEl = this._tabListContainer.nativeElement;
      const dir = this._getLayoutDirection();
      if (dir == 'ltr') {
        containerEl.scrollLeft = 0;
      } else {
        containerEl.scrollLeft = containerEl.scrollWidth - containerEl.offsetWidth;
      }
    }
  }
  /** The layout direction of the containing app. */
  _getLayoutDirection() {
    return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
  }
  /** Performs the CSS transformation on the tab list that will cause the list to scroll. */
  _updateTabScrollPosition() {
    if (this.disablePagination) {
      return;
    }
    const scrollDistance = this.scrollDistance;
    const translateX = this._getLayoutDirection() === 'ltr' ? -scrollDistance : scrollDistance;
    // Don't use `translate3d` here because we don't want to create a new layer. A new layer
    // seems to cause flickering and overflow in Internet Explorer. For example, the ink bar
    // and ripples will exceed the boundaries of the visible tab bar.
    // See: https://github.com/angular/components/issues/10276
    // We round the `transform` here, because transforms with sub-pixel precision cause some
    // browsers to blur the content of the element.
    this._tabList.nativeElement.style.transform = `translateX(${Math.round(translateX)}px)`;
    // Setting the `transform` on IE will change the scroll offset of the parent, causing the
    // position to be thrown off in some cases. We have to reset it ourselves to ensure that
    // it doesn't get thrown off. Note that we scope it only to IE and Edge, because messing
    // with the scroll position throws off Chrome 71+ in RTL mode (see #14689).
    if (this._platform.TRIDENT || this._platform.EDGE) {
      this._tabListContainer.nativeElement.scrollLeft = 0;
    }
  }
  /** Sets the distance in pixels that the tab header should be transformed in the X-axis. */
  get scrollDistance() {
    return this._scrollDistance;
  }
  set scrollDistance(value) {
    this._scrollTo(value);
  }
  /**
   * Moves the tab list in the 'before' or 'after' direction (towards the beginning of the list or
   * the end of the list, respectively). The distance to scroll is computed to be a third of the
   * length of the tab list view window.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _scrollHeader(direction) {
    const viewLength = this._tabListContainer.nativeElement.offsetWidth;
    // Move the scroll distance one-third the length of the tab list's viewport.
    const scrollAmount = ((direction == 'before' ? -1 : 1) * viewLength) / 3;
    return this._scrollTo(this._scrollDistance + scrollAmount);
  }
  /** Handles click events on the pagination arrows. */
  _handlePaginatorClick(direction) {
    this._stopInterval();
    this._scrollHeader(direction);
  }
  /**
   * Moves the tab list such that the desired tab label (marked by index) is moved into view.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _scrollToLabel(labelIndex) {
    if (this.disablePagination) {
      return;
    }
    const selectedLabel = this._items ? this._items.toArray()[labelIndex] : null;
    if (!selectedLabel) {
      return;
    }
    // The view length is the visible width of the tab labels.
    const viewLength = this._tabListContainer.nativeElement.offsetWidth;
    const { offsetLeft, offsetWidth } = selectedLabel.elementRef.nativeElement;
    let labelBeforePos, labelAfterPos;
    if (this._getLayoutDirection() == 'ltr') {
      labelBeforePos = offsetLeft;
      labelAfterPos = labelBeforePos + offsetWidth;
    } else {
      labelAfterPos = this._tabListInner.nativeElement.offsetWidth - offsetLeft;
      labelBeforePos = labelAfterPos - offsetWidth;
    }
    const beforeVisiblePos = this.scrollDistance;
    const afterVisiblePos = this.scrollDistance + viewLength;
    if (labelBeforePos < beforeVisiblePos) {
      // Scroll header to move label to the before direction
      this.scrollDistance -= beforeVisiblePos - labelBeforePos + EXAGGERATED_OVERSCROLL;
    } else if (labelAfterPos > afterVisiblePos) {
      // Scroll header to move label to the after direction
      this.scrollDistance += labelAfterPos - afterVisiblePos + EXAGGERATED_OVERSCROLL;
    }
  }
  /**
   * Evaluate whether the pagination controls should be displayed. If the scroll width of the
   * tab list is wider than the size of the header container, then the pagination controls should
   * be shown.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _checkPaginationEnabled() {
    if (this.disablePagination) {
      this._showPaginationControls = false;
    } else {
      const isEnabled =
        this._tabListInner.nativeElement.scrollWidth > this._elementRef.nativeElement.offsetWidth;
      if (!isEnabled) {
        this.scrollDistance = 0;
      }
      if (isEnabled !== this._showPaginationControls) {
        this._changeDetectorRef.markForCheck();
      }
      this._showPaginationControls = isEnabled;
    }
  }
  /**
   * Evaluate whether the before and after controls should be enabled or disabled.
   * If the header is at the beginning of the list (scroll distance is equal to 0) then disable the
   * before button. If the header is at the end of the list (scroll distance is equal to the
   * maximum distance we can scroll), then disable the after button.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _checkScrollingControls() {
    if (this.disablePagination) {
      this._disableScrollAfter = this._disableScrollBefore = true;
    } else {
      // Check if the pagination arrows should be activated.
      this._disableScrollBefore = this.scrollDistance == 0;
      this._disableScrollAfter = this.scrollDistance == this._getMaxScrollDistance();
      this._changeDetectorRef.markForCheck();
    }
  }
  /**
   * Determines what is the maximum length in pixels that can be set for the scroll distance. This
   * is equal to the difference in width between the tab list container and tab header container.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _getMaxScrollDistance() {
    const lengthOfTabList = this._tabListInner.nativeElement.scrollWidth;
    const viewLength = this._tabListContainer.nativeElement.offsetWidth;
    return lengthOfTabList - viewLength || 0;
  }
  /** Tells the ink-bar to align itself to the current label wrapper */
  _alignInkBarToSelectedTab() {
    const selectedItem =
      this._items && this._items.length ? this._items.toArray()[this.selectedIndex] : null;
    const selectedLabelWrapper = selectedItem ? selectedItem.elementRef.nativeElement : null;
    if (selectedLabelWrapper) {
      this._inkBar.alignToElement(selectedLabelWrapper);
    } else {
      this._inkBar.hide();
    }
  }
  /** Stops the currently-running paginator interval.  */
  _stopInterval() {
    this._stopScrolling.next();
  }
  /**
   * Handles the user pressing down on one of the paginators.
   * Starts scrolling the header after a certain amount of time.
   * @param direction In which direction the paginator should be scrolled.
   */
  _handlePaginatorPress(direction, mouseEvent) {
    // Don't start auto scrolling for right mouse button clicks. Note that we shouldn't have to
    // null check the `button`, but we do it so we don't break tests that use fake events.
    if (mouseEvent && mouseEvent.button != null && mouseEvent.button !== 0) {
      return;
    }
    // Avoid overlapping timers.
    this._stopInterval();
    // Start a timer after the delay and keep firing based on the interval.
    timer(HEADER_SCROLL_DELAY, HEADER_SCROLL_INTERVAL)
      // Keep the timer going until something tells it to stop or the component is destroyed.
      .pipe(takeUntil(merge(this._stopScrolling, this._destroyed)))
      .subscribe(() => {
        const { maxScrollDistance, distance } = this._scrollHeader(direction);
        // Stop the timer if we've reached the start or the end.
        if (distance === 0 || distance >= maxScrollDistance) {
          this._stopInterval();
        }
      });
  }
  /**
   * Scrolls the header to a given position.
   * @param position Position to which to scroll.
   * @returns Information on the current scroll distance and the maximum.
   */
  _scrollTo(position) {
    if (this.disablePagination) {
      return { maxScrollDistance: 0, distance: 0 };
    }
    const maxScrollDistance = this._getMaxScrollDistance();
    this._scrollDistance = Math.max(0, Math.min(maxScrollDistance, position));
    // Mark that the scroll distance has changed so that after the view is checked, the CSS
    // transformation can move the header.
    this._scrollDistanceChanged = true;
    this._checkScrollingControls();
    return { maxScrollDistance, distance: this._scrollDistance };
  }
}
TakPaginatedTabHeader.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakPaginatedTabHeader,
  deps: [
    { token: i0.ElementRef },
    { token: i0.ChangeDetectorRef },
    { token: i1$1.ViewportRuler },
    { token: i1.Directionality, optional: true },
    { token: i0.NgZone },
    { token: i3.Platform },
    { token: ANIMATION_MODULE_TYPE, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakPaginatedTabHeader.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakPaginatedTabHeader,
  inputs: { disablePagination: 'disablePagination' },
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakPaginatedTabHeader,
  decorators: [
    {
      type: Directive,
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.ElementRef },
      { type: i0.ChangeDetectorRef },
      { type: i1$1.ViewportRuler },
      {
        type: i1.Directionality,
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
    disablePagination: [
      {
        type: Input,
      },
    ],
  },
});

/**
 * Base class with all of the `TakTabHeader` functionality.
 * @docs-private
 */
class _TakTabHeaderBase extends TakPaginatedTabHeader {
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
    { token: i1$1.ViewportRuler },
    { token: i1.Directionality, optional: true },
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
      { type: i1$1.ViewportRuler },
      {
        type: i1.Directionality,
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
class TakTabHeader extends _TakTabHeaderBase {
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
    { token: i1$1.ViewportRuler },
    { token: i1.Directionality, optional: true },
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
    { kind: 'directive', type: TakInkBar, selector: 'tak-ink-bar' },
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
      { type: i1$1.ViewportRuler },
      {
        type: i1.Directionality,
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

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Used to generate unique ID's for each tab component */
let nextId = 0;
/** A simple change event emitted on focus or selection changes. */
class TakTabChangeEvent {}
// Boilerplate for applying mixins to TakTabGroup.
/** @docs-private */
const _TakTabGroupMixinBase = mixinColor(
  mixinDisableRipple(
    class {
      constructor(_elementRef) {
        this._elementRef = _elementRef;
      }
    }
  ),
  'primary'
);
/**
 * Base class with all of the `TakTabGroupBase` functionality.
 * @docs-private
 */
class _TakTabGroupBase extends _TakTabGroupMixinBase {
  constructor(elementRef, _changeDetectorRef, defaultConfig, _animationMode) {
    var _a;
    super(elementRef);
    this._changeDetectorRef = _changeDetectorRef;
    this._animationMode = _animationMode;
    /** All of the tabs that belong to the group. */
    this._tabs = new QueryList();
    /** The tab index that should be selected after the content has been checked. */
    this._indexToSelect = 0;
    /** Index of the tab that was focused last. */
    this._lastFocusedTabIndex = null;
    /** Snapshot of the height of the tab body wrapper before another tab is activated. */
    this._tabBodyWrapperHeight = 0;
    /** Subscription to tabs being added/removed. */
    this._tabsSubscription = Subscription.EMPTY;
    /** Subscription to changes in the tab labels. */
    this._tabLabelSubscription = Subscription.EMPTY;
    this._dynamicHeight = false;
    this._selectedIndex = null;
    /** Position of the tab header. */
    this.headerPosition = 'above';
    this._disablePagination = false;
    this._preserveContent = false;
    /** Output to enable support for two-way binding on `[(selectedIndex)]` */
    this.selectedIndexChange = new EventEmitter();
    /** Event emitted when focus has changed within a tab group. */
    this.focusChange = new EventEmitter();
    /** Event emitted when the body animation has completed */
    this.animationDone = new EventEmitter();
    /** Event emitted when the tab selection has changed. */
    this.selectedTabChange = new EventEmitter(true);
    this._groupId = nextId++;
    this.animationDuration =
      defaultConfig && defaultConfig.animationDuration ? defaultConfig.animationDuration : '500ms';
    this.disablePagination =
      defaultConfig && defaultConfig.disablePagination != null
        ? defaultConfig.disablePagination
        : false;
    this.dynamicHeight =
      defaultConfig && defaultConfig.dynamicHeight != null ? defaultConfig.dynamicHeight : false;
    this.contentTabIndex =
      (_a =
        defaultConfig === null || defaultConfig === void 0
          ? void 0
          : defaultConfig.contentTabIndex) !== null && _a !== void 0
        ? _a
        : null;
    this.preserveContent = !!(defaultConfig === null || defaultConfig === void 0
      ? void 0
      : defaultConfig.preserveContent);
  }
  /** Whether the tab group should grow to the size of the active tab. */
  get dynamicHeight() {
    return this._dynamicHeight;
  }
  set dynamicHeight(value) {
    this._dynamicHeight = coerceBooleanProperty(value);
  }
  /** The index of the active tab. */
  get selectedIndex() {
    return this._selectedIndex;
  }
  set selectedIndex(value) {
    this._indexToSelect = coerceNumberProperty(value, null);
  }
  /** Duration for the tab animation. Will be normalized to milliseconds if no units are set. */
  get animationDuration() {
    return this._animationDuration;
  }
  set animationDuration(value) {
    this._animationDuration = /^\d+$/.test(value + '') ? value + 'ms' : value;
  }
  /**
   * `tabindex` to be set on the inner element that wraps the tab content. Can be used for improved
   * accessibility when the tab does not have focusable elements or if it has scrollable content.
   * The `tabindex` will be removed automatically for inactive tabs.
   * Read more at https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html
   */
  get contentTabIndex() {
    return this._contentTabIndex;
  }
  set contentTabIndex(value) {
    this._contentTabIndex = coerceNumberProperty(value, null);
  }
  /**
   * Whether pagination should be disabled. This can be used to avoid unnecessary
   * layout recalculations if it's known that pagination won't be required.
   */
  get disablePagination() {
    return this._disablePagination;
  }
  set disablePagination(value) {
    this._disablePagination = coerceBooleanProperty(value);
  }
  /**
   * By default tabs remove their content from the DOM while it's off-screen.
   * Setting this to `true` will keep it in the DOM which will prevent elements
   * like iframes and videos from reloading next time it comes back into the view.
   */
  get preserveContent() {
    return this._preserveContent;
  }
  set preserveContent(value) {
    this._preserveContent = coerceBooleanProperty(value);
  }
  /** Background color of the tab group. */
  get backgroundColor() {
    return this._backgroundColor;
  }
  set backgroundColor(value) {
    const nativeElement = this._elementRef.nativeElement;
    nativeElement.classList.remove(`tak-background-${this.backgroundColor}`);
    if (value) {
      nativeElement.classList.add(`tak-background-${value}`);
    }
    this._backgroundColor = value;
  }
  /**
   * After the content is checked, this component knows what tabs have been defined
   * and what the selected index should be. This is where we can know exactly what position
   * each tab should be in according to the new selected index, and additionally we know how
   * a new selected tab should transition in (from the left or right).
   */
  ngAfterContentChecked() {
    // Don't clamp the `indexToSelect` immediately in the setter because it can happen that
    // the amount of tabs changes before the actual change detection runs.
    const indexToSelect = (this._indexToSelect = this._clampTabIndex(this._indexToSelect));
    // If there is a change in selected index, emit a change event. Should not trigger if
    // the selected index has not yet been initialized.
    if (this._selectedIndex != indexToSelect) {
      const isFirstRun = this._selectedIndex == null;
      if (!isFirstRun) {
        this.selectedTabChange.emit(this._createChangeEvent(indexToSelect));
        // Preserve the height so page doesn't scroll up during tab change.
        // Fixes https://stackblitz.com/edit/tak-tabs-scroll-page-top-on-tab-change
        const wrapper = this._tabBodyWrapper.nativeElement;
        wrapper.style.minHeight = wrapper.clientHeight + 'px';
      }
      // Changing these values after change detection has run
      // since the checked content may contain references to them.
      Promise.resolve().then(() => {
        this._tabs.forEach((tab, index) => (tab.isActive = index === indexToSelect));
        if (!isFirstRun) {
          this.selectedIndexChange.emit(indexToSelect);
          // Clear the min-height, this was needed during tab change to avoid
          // unnecessary scrolling.
          this._tabBodyWrapper.nativeElement.style.minHeight = '';
        }
      });
    }
    // Setup the position for each tab and optionally setup an origin on the next selected tab.
    this._tabs.forEach((tab, index) => {
      tab.position = index - indexToSelect;
      // If there is already a selected tab, then set up an origin for the next selected tab
      // if it doesn't have one already.
      if (this._selectedIndex != null && tab.position == 0 && !tab.origin) {
        tab.origin = indexToSelect - this._selectedIndex;
      }
    });
    if (this._selectedIndex !== indexToSelect) {
      this._selectedIndex = indexToSelect;
      this._lastFocusedTabIndex = null;
      this._changeDetectorRef.markForCheck();
    }
  }
  ngAfterContentInit() {
    this._subscribeToAllTabChanges();
    this._subscribeToTabLabels();
    // Subscribe to changes in the amount of tabs, in order to be
    // able to re-render the content as new tabs are added or removed.
    this._tabsSubscription = this._tabs.changes.subscribe(() => {
      const indexToSelect = this._clampTabIndex(this._indexToSelect);
      // Maintain the previously-selected tab if a new tab is added or removed and there is no
      // explicit change that selects a different tab.
      if (indexToSelect === this._selectedIndex) {
        const tabs = this._tabs.toArray();
        let selectedTab;
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].isActive) {
            // Assign both to the `_indexToSelect` and `_selectedIndex` so we don't fire a changed
            // event, otherwise the consumer may end up in an infinite loop in some edge cases like
            // adding a tab within the `selectedIndexChange` event.
            this._indexToSelect = this._selectedIndex = i;
            this._lastFocusedTabIndex = null;
            selectedTab = tabs[i];
            break;
          }
        }
        // If we haven't found an active tab and a tab exists at the selected index, it means
        // that the active tab was swapped out. Since this won't be picked up by the rendering
        // loop in `ngAfterContentChecked`, we need to sync it up manually.
        if (!selectedTab && tabs[indexToSelect]) {
          Promise.resolve().then(() => {
            tabs[indexToSelect].isActive = true;
            this.selectedTabChange.emit(this._createChangeEvent(indexToSelect));
          });
        }
      }
      this._changeDetectorRef.markForCheck();
    });
  }
  /** Listens to changes in all of the tabs. */
  _subscribeToAllTabChanges() {
    // Since we use a query with `descendants: true` to pick up the tabs, we may end up catching
    // some that are inside of nested tab groups. We filter them out manually by checking that
    // the closest group to the tab is the current one.
    this._allTabs.changes.pipe(startWith(this._allTabs)).subscribe(tabs => {
      this._tabs.reset(
        tabs.filter(tab => {
          return tab._closestTabGroup === this || !tab._closestTabGroup;
        })
      );
      this._tabs.notifyOnChanges();
    });
  }
  ngOnDestroy() {
    this._tabs.destroy();
    this._tabsSubscription.unsubscribe();
    this._tabLabelSubscription.unsubscribe();
  }
  /** Re-aligns the ink bar to the selected tab element. */
  realignInkBar() {
    if (this._tabHeader) {
      this._tabHeader._alignInkBarToSelectedTab();
    }
  }
  /**
   * Recalculates the tab group's pagination dimensions.
   *
   * WARNING: Calling this method can be very costly in terms of performance. It should be called
   * as infrequently as possible from outside of the Tabs component as it causes a reflow of the
   * page.
   */
  updatePagination() {
    if (this._tabHeader) {
      this._tabHeader.updatePagination();
    }
  }
  /**
   * Sets focus to a particular tab.
   * @param index Index of the tab to be focused.
   */
  focusTab(index) {
    const header = this._tabHeader;
    if (header) {
      header.focusIndex = index;
    }
  }
  _focusChanged(index) {
    this._lastFocusedTabIndex = index;
    this.focusChange.emit(this._createChangeEvent(index));
  }
  _createChangeEvent(index) {
    const event = new TakTabChangeEvent();
    event.index = index;
    if (this._tabs && this._tabs.length) {
      event.tab = this._tabs.toArray()[index];
    }
    return event;
  }
  /**
   * Subscribes to changes in the tab labels. This is needed, because the @Input for the label is
   * on the TakTab component, whereas the data binding is inside the TakTabGroup. In order for the
   * binding to be updated, we need to subscribe to changes in it and trigger change detection
   * manually.
   */
  _subscribeToTabLabels() {
    if (this._tabLabelSubscription) {
      this._tabLabelSubscription.unsubscribe();
    }
    this._tabLabelSubscription = merge(...this._tabs.map(tab => tab._stateChanges)).subscribe(() =>
      this._changeDetectorRef.markForCheck()
    );
  }
  /** Clamps the given index to the bounds of 0 and the tabs length. */
  _clampTabIndex(index) {
    // Note the `|| 0`, which ensures that values like NaN can't get through
    // and which would otherwise throw the component into an infinite loop
    // (since Math.max(NaN, 0) === NaN).
    return Math.min(this._tabs.length - 1, Math.max(index || 0, 0));
  }
  /** Returns a unique id for each tab label element */
  _getTabLabelId(i) {
    return `tak-tab-label-${this._groupId}-${i}`;
  }
  /** Returns a unique id for each tab content element */
  _getTabContentId(i) {
    return `tak-tab-content-${this._groupId}-${i}`;
  }
  /**
   * Sets the height of the body wrapper to the height of the activating tab if dynamic
   * height property is true.
   */
  _setTabBodyWrapperHeight(tabHeight) {
    if (!this._dynamicHeight || !this._tabBodyWrapperHeight) {
      return;
    }
    const wrapper = this._tabBodyWrapper.nativeElement;
    wrapper.style.height = this._tabBodyWrapperHeight + 'px';
    // This conditional forces the browser to paint the height so that
    // the animation to the new height can have an origin.
    if (this._tabBodyWrapper.nativeElement.offsetHeight) {
      wrapper.style.height = tabHeight + 'px';
    }
  }
  /** Removes the height of the tab body wrapper. */
  _removeTabBodyWrapperHeight() {
    const wrapper = this._tabBodyWrapper.nativeElement;
    this._tabBodyWrapperHeight = wrapper.clientHeight;
    wrapper.style.height = '';
    this.animationDone.emit();
  }
  /** Handle click events, setting new selected index if appropriate. */
  _handleClick(tab, tabHeader, index) {
    if (!tab.disabled) {
      this.selectedIndex = tabHeader.focusIndex = index;
    }
  }
  /** Retrieves the tabindex for the tab. */
  _getTabIndex(tab, index) {
    var _a;
    if (tab.disabled) {
      return null;
    }
    const targetIndex =
      (_a = this._lastFocusedTabIndex) !== null && _a !== void 0 ? _a : this.selectedIndex;
    return index === targetIndex ? 0 : -1;
  }
  /** Callback for when the focused state of a tab has changed. */
  _tabFocusChanged(focusOrigin, index) {
    // Mouse/touch focus happens during the `mousedown`/`touchstart` phase which
    // can cause the tab to be moved out from under the pointer, interrupting the
    // click sequence (see #21898). We don't need to scroll the tab into view for
    // such cases anyway, because it will be done when the tab becomes selected.
    if (focusOrigin && focusOrigin !== 'mouse' && focusOrigin !== 'touch') {
      this._tabHeader.focusIndex = index;
    }
  }
}
_TakTabGroupBase.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakTabGroupBase,
  deps: [
    { token: i0.ElementRef },
    { token: i0.ChangeDetectorRef },
    { token: TAK_TABS_CONFIG, optional: true },
    { token: ANIMATION_MODULE_TYPE, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Directive,
});
_TakTabGroupBase.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: _TakTabGroupBase,
  inputs: {
    dynamicHeight: 'dynamicHeight',
    selectedIndex: 'selectedIndex',
    headerPosition: 'headerPosition',
    animationDuration: 'animationDuration',
    contentTabIndex: 'contentTabIndex',
    disablePagination: 'disablePagination',
    preserveContent: 'preserveContent',
    backgroundColor: 'backgroundColor',
  },
  outputs: {
    selectedIndexChange: 'selectedIndexChange',
    focusChange: 'focusChange',
    animationDone: 'animationDone',
    selectedTabChange: 'selectedTabChange',
  },
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakTabGroupBase,
  decorators: [
    {
      type: Directive,
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.ElementRef },
      { type: i0.ChangeDetectorRef },
      {
        type: undefined,
        decorators: [
          {
            type: Inject,
            args: [TAK_TABS_CONFIG],
          },
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
            args: [ANIMATION_MODULE_TYPE],
          },
        ],
      },
    ];
  },
  propDecorators: {
    dynamicHeight: [
      {
        type: Input,
      },
    ],
    selectedIndex: [
      {
        type: Input,
      },
    ],
    headerPosition: [
      {
        type: Input,
      },
    ],
    animationDuration: [
      {
        type: Input,
      },
    ],
    contentTabIndex: [
      {
        type: Input,
      },
    ],
    disablePagination: [
      {
        type: Input,
      },
    ],
    preserveContent: [
      {
        type: Input,
      },
    ],
    backgroundColor: [
      {
        type: Input,
      },
    ],
    selectedIndexChange: [
      {
        type: Output,
      },
    ],
    focusChange: [
      {
        type: Output,
      },
    ],
    animationDone: [
      {
        type: Output,
      },
    ],
    selectedTabChange: [
      {
        type: Output,
      },
    ],
  },
});
/**
 * Material design tab-group component. Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://material.io/design/components/tabs.html
 */
class TakTabGroup extends _TakTabGroupBase {
  constructor(elementRef, changeDetectorRef, defaultConfig, animationMode) {
    super(elementRef, changeDetectorRef, defaultConfig, animationMode);
  }
}
TakTabGroup.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabGroup,
  deps: [
    { token: i0.ElementRef },
    { token: i0.ChangeDetectorRef },
    { token: TAK_TABS_CONFIG, optional: true },
    { token: ANIMATION_MODULE_TYPE, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Component,
});
TakTabGroup.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakTabGroup,
  selector: 'tak-tab-group',
  inputs: { color: 'color', disableRipple: 'disableRipple' },
  host: {
    properties: {
      'class.tak-tab-group-dynamic-height': 'dynamicHeight',
      'class.tak-tab-group-inverted-header': 'headerPosition === "below"',
    },
    classAttribute: 'tak-tab-group',
  },
  providers: [
    {
      provide: TAK_TAB_GROUP,
      useExisting: TakTabGroup,
    },
  ],
  queries: [{ propertyName: '_allTabs', predicate: TakTab, descendants: true }],
  viewQueries: [
    {
      propertyName: '_tabBodyWrapper',
      first: true,
      predicate: ['tabBodyWrapper'],
      descendants: true,
    },
    { propertyName: '_tabHeader', first: true, predicate: ['tabHeader'], descendants: true },
  ],
  exportAs: ['takTabGroup'],
  usesInheritance: true,
  ngImport: i0,
  template:
    '<tak-tab-header #tabHeader\n               [selectedIndex]="selectedIndex || 0"\n               [disableRipple]="disableRipple"\n               [disablePagination]="disablePagination"\n               (indexFocused)="_focusChanged($event)"\n               (selectFocusedIndex)="selectedIndex = $event">\n  <div class="tak-tab-label tak-focus-indicator" role="tab" takTabLabelWrapper tak-ripple\n       cdkMonitorElementFocus\n       *ngFor="let tab of _tabs; let i = index"\n       [id]="_getTabLabelId(i)"\n       [attr.tabIndex]="_getTabIndex(tab, i)"\n       [attr.aria-posinset]="i + 1"\n       [attr.aria-setsize]="_tabs.length"\n       [attr.aria-controls]="_getTabContentId(i)"\n       [attr.aria-selected]="selectedIndex === i"\n       [attr.aria-label]="tab.ariaLabel || null"\n       [attr.aria-labelledby]="(!tab.ariaLabel && tab.ariaLabelledby) ? tab.ariaLabelledby : null"\n       [class.tak-tab-label-active]="selectedIndex === i"\n       [ngClass]="tab.labelClass"\n       [disabled]="tab.disabled"\n       [takRippleDisabled]="tab.disabled || disableRipple"\n       (click)="_handleClick(tab, tabHeader, i)"\n       (cdkFocusChange)="_tabFocusChanged($event, i)">\n\n\n    <div class="tak-tab-label-content">\n      <!-- If there is a label template, use it. -->\n      <ng-template [ngIf]="tab.templateLabel" [ngIfElse]="tabTextLabel">\n        <ng-template [cdkPortalOutlet]="tab.templateLabel"></ng-template>\n      </ng-template>\n\n      <!-- If there is not a label template, fall back to the text label. -->\n      <ng-template #tabTextLabel>{{tab.textLabel}}</ng-template>\n    </div>\n  </div>\n</tak-tab-header>\n\n<div\n  class="tak-tab-body-wrapper"\n  [class._tak-animation-noopable]="_animationMode === \'NoopAnimations\'"\n  #tabBodyWrapper>\n  <tak-tab-body role="tabpanel"\n               *ngFor="let tab of _tabs; let i = index"\n               [id]="_getTabContentId(i)"\n               [attr.tabindex]="(contentTabIndex != null && selectedIndex === i) ? contentTabIndex : null"\n               [attr.aria-labelledby]="_getTabLabelId(i)"\n               [class.tak-tab-body-active]="selectedIndex === i"\n               [ngClass]="tab.bodyClass"\n               [content]="tab.content!"\n               [position]="tab.position!"\n               [origin]="tab.origin"\n               [animationDuration]="animationDuration"\n               [preserveContent]="preserveContent"\n               (_onCentered)="_removeTabBodyWrapperHeight()"\n               (_onCentering)="_setTabBodyWrapperHeight($event)">\n  </tak-tab-body>\n</div>\n',
  styles: [
    '.tak-tab-group{display:flex;flex-direction:column;max-width:100%}.tak-tab-group.tak-tab-group-inverted-header{flex-direction:column-reverse}.tak-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.tak-tab-label:focus{outline:none}.tak-tab-label:focus:not(.tak-tab-disabled){opacity:1}.tak-tab-label.tak-tab-disabled{cursor:default}.cdk-high-contrast-active .tak-tab-label.tak-tab-disabled{opacity:.5}.tak-tab-label .tak-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .tak-tab-label{opacity:1}@media(max-width: 599px){.tak-tab-label{padding:0 12px}}@media(max-width: 959px){.tak-tab-label{padding:0 12px}}.tak-tab-group[tak-stretch-tabs]>.tak-tab-header .tak-tab-label{flex-basis:0;flex-grow:1}.tak-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height 500ms cubic-bezier(0.35, 0, 0.25, 1)}.tak-tab-body-wrapper._tak-animation-noopable{transition:none !important;animation:none !important}.tak-tab-body{top:0;left:0;right:0;bottom:0;position:absolute;display:block;overflow:hidden;outline:0;flex-basis:100%}.tak-tab-body.tak-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}.tak-tab-group.tak-tab-group-dynamic-height .tak-tab-body.tak-tab-body-active{overflow-y:hidden}',
  ],
  dependencies: [
    { kind: 'directive', type: i1$2.NgClass, selector: '[ngClass]', inputs: ['class', 'ngClass'] },
    {
      kind: 'directive',
      type: i1$2.NgForOf,
      selector: '[ngFor][ngForOf]',
      inputs: ['ngForOf', 'ngForTrackBy', 'ngForTemplate'],
    },
    {
      kind: 'directive',
      type: i1$2.NgIf,
      selector: '[ngIf]',
      inputs: ['ngIf', 'ngIfThen', 'ngIfElse'],
    },
    {
      kind: 'directive',
      type: i2.CdkPortalOutlet,
      selector: '[cdkPortalOutlet]',
      inputs: ['cdkPortalOutlet'],
      outputs: ['attached'],
      exportAs: ['cdkPortalOutlet'],
    },
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
      type: i7.CdkMonitorFocus,
      selector: '[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]',
      outputs: ['cdkFocusChange'],
      exportAs: ['cdkMonitorFocus'],
    },
    {
      kind: 'directive',
      type: TakTabLabelWrapper,
      selector: '[takTabLabelWrapper]',
      inputs: ['disabled'],
    },
    { kind: 'component', type: TakTabBody, selector: 'tak-tab-body' },
    {
      kind: 'component',
      type: TakTabHeader,
      selector: 'tak-tab-header',
      inputs: ['selectedIndex'],
      outputs: ['selectFocusedIndex', 'indexFocused'],
    },
  ],
  changeDetection: i0.ChangeDetectionStrategy.Default,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabGroup,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'tak-tab-group',
          exportAs: 'takTabGroup',
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.Default,
          inputs: ['color', 'disableRipple'],
          providers: [
            {
              provide: TAK_TAB_GROUP,
              useExisting: TakTabGroup,
            },
          ],
          host: {
            class: 'tak-tab-group',
            '[class.tak-tab-group-dynamic-height]': 'dynamicHeight',
            '[class.tak-tab-group-inverted-header]': 'headerPosition === "below"',
          },
          template:
            '<tak-tab-header #tabHeader\n               [selectedIndex]="selectedIndex || 0"\n               [disableRipple]="disableRipple"\n               [disablePagination]="disablePagination"\n               (indexFocused)="_focusChanged($event)"\n               (selectFocusedIndex)="selectedIndex = $event">\n  <div class="tak-tab-label tak-focus-indicator" role="tab" takTabLabelWrapper tak-ripple\n       cdkMonitorElementFocus\n       *ngFor="let tab of _tabs; let i = index"\n       [id]="_getTabLabelId(i)"\n       [attr.tabIndex]="_getTabIndex(tab, i)"\n       [attr.aria-posinset]="i + 1"\n       [attr.aria-setsize]="_tabs.length"\n       [attr.aria-controls]="_getTabContentId(i)"\n       [attr.aria-selected]="selectedIndex === i"\n       [attr.aria-label]="tab.ariaLabel || null"\n       [attr.aria-labelledby]="(!tab.ariaLabel && tab.ariaLabelledby) ? tab.ariaLabelledby : null"\n       [class.tak-tab-label-active]="selectedIndex === i"\n       [ngClass]="tab.labelClass"\n       [disabled]="tab.disabled"\n       [takRippleDisabled]="tab.disabled || disableRipple"\n       (click)="_handleClick(tab, tabHeader, i)"\n       (cdkFocusChange)="_tabFocusChanged($event, i)">\n\n\n    <div class="tak-tab-label-content">\n      <!-- If there is a label template, use it. -->\n      <ng-template [ngIf]="tab.templateLabel" [ngIfElse]="tabTextLabel">\n        <ng-template [cdkPortalOutlet]="tab.templateLabel"></ng-template>\n      </ng-template>\n\n      <!-- If there is not a label template, fall back to the text label. -->\n      <ng-template #tabTextLabel>{{tab.textLabel}}</ng-template>\n    </div>\n  </div>\n</tak-tab-header>\n\n<div\n  class="tak-tab-body-wrapper"\n  [class._tak-animation-noopable]="_animationMode === \'NoopAnimations\'"\n  #tabBodyWrapper>\n  <tak-tab-body role="tabpanel"\n               *ngFor="let tab of _tabs; let i = index"\n               [id]="_getTabContentId(i)"\n               [attr.tabindex]="(contentTabIndex != null && selectedIndex === i) ? contentTabIndex : null"\n               [attr.aria-labelledby]="_getTabLabelId(i)"\n               [class.tak-tab-body-active]="selectedIndex === i"\n               [ngClass]="tab.bodyClass"\n               [content]="tab.content!"\n               [position]="tab.position!"\n               [origin]="tab.origin"\n               [animationDuration]="animationDuration"\n               [preserveContent]="preserveContent"\n               (_onCentered)="_removeTabBodyWrapperHeight()"\n               (_onCentering)="_setTabBodyWrapperHeight($event)">\n  </tak-tab-body>\n</div>\n',
          styles: [
            '.tak-tab-group{display:flex;flex-direction:column;max-width:100%}.tak-tab-group.tak-tab-group-inverted-header{flex-direction:column-reverse}.tak-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.tak-tab-label:focus{outline:none}.tak-tab-label:focus:not(.tak-tab-disabled){opacity:1}.tak-tab-label.tak-tab-disabled{cursor:default}.cdk-high-contrast-active .tak-tab-label.tak-tab-disabled{opacity:.5}.tak-tab-label .tak-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .tak-tab-label{opacity:1}@media(max-width: 599px){.tak-tab-label{padding:0 12px}}@media(max-width: 959px){.tak-tab-label{padding:0 12px}}.tak-tab-group[tak-stretch-tabs]>.tak-tab-header .tak-tab-label{flex-basis:0;flex-grow:1}.tak-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height 500ms cubic-bezier(0.35, 0, 0.25, 1)}.tak-tab-body-wrapper._tak-animation-noopable{transition:none !important;animation:none !important}.tak-tab-body{top:0;left:0;right:0;bottom:0;position:absolute;display:block;overflow:hidden;outline:0;flex-basis:100%}.tak-tab-body.tak-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}.tak-tab-group.tak-tab-group-dynamic-height .tak-tab-body.tak-tab-body-active{overflow-y:hidden}',
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
        type: undefined,
        decorators: [
          {
            type: Inject,
            args: [TAK_TABS_CONFIG],
          },
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
            args: [ANIMATION_MODULE_TYPE],
          },
        ],
      },
    ];
  },
  propDecorators: {
    _allTabs: [
      {
        type: ContentChildren,
        args: [TakTab, { descendants: true }],
      },
    ],
    _tabBodyWrapper: [
      {
        type: ViewChild,
        args: ['tabBodyWrapper'],
      },
    ],
    _tabHeader: [
      {
        type: ViewChild,
        args: ['tabHeader'],
      },
    ],
  },
});

// Increasing integer for generating unique ids for tab nav components.
let nextUniqueId = 0;
/**
 * Base class with all of the `TakTabNav` functionality.
 * @docs-private
 */
class _TakTabNavBase extends TakPaginatedTabHeader {
  constructor(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode) {
    super(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode);
    this._disableRipple = false;
    /** Theme color of the nav bar. */
    this.color = 'primary';
  }
  /** Background color of the tab nav. */
  get backgroundColor() {
    return this._backgroundColor;
  }
  set backgroundColor(value) {
    const classList = this._elementRef.nativeElement.classList;
    classList.remove(`tak-background-${this.backgroundColor}`);
    if (value) {
      classList.add(`tak-background-${value}`);
    }
    this._backgroundColor = value;
  }
  /** Whether the ripple effect is disabled or not. */
  get disableRipple() {
    return this._disableRipple;
  }
  set disableRipple(value) {
    this._disableRipple = coerceBooleanProperty(value);
  }
  _itemSelected() {
    // noop
  }
  ngAfterContentInit() {
    // We need this to run before the `changes` subscription in parent to ensure that the
    // selectedIndex is up-to-date by the time the super class starts looking for it.
    this._items.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
      this.updateActiveLink();
    });
    super.ngAfterContentInit();
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
}
_TakTabNavBase.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakTabNavBase,
  deps: [
    { token: i0.ElementRef },
    { token: i1.Directionality, optional: true },
    { token: i0.NgZone },
    { token: i0.ChangeDetectorRef },
    { token: i1$1.ViewportRuler },
    { token: i3.Platform },
    { token: ANIMATION_MODULE_TYPE, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Directive,
});
_TakTabNavBase.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: _TakTabNavBase,
  inputs: {
    backgroundColor: 'backgroundColor',
    disableRipple: 'disableRipple',
    color: 'color',
    tabPanel: 'tabPanel',
  },
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakTabNavBase,
  decorators: [
    {
      type: Directive,
    },
  ],
  ctorParameters: function () {
    return [
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
      { type: i1$1.ViewportRuler },
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
    backgroundColor: [
      {
        type: Input,
      },
    ],
    disableRipple: [
      {
        type: Input,
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
  },
});
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
class TakTabNav extends _TakTabNavBase {
  constructor(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode) {
    super(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode);
  }
}
TakTabNav.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabNav,
  deps: [
    { token: i0.ElementRef },
    { token: i1.Directionality, optional: true },
    { token: i0.NgZone },
    { token: i0.ChangeDetectorRef },
    { token: i1$1.ViewportRuler },
    { token: i3.Platform },
    { token: ANIMATION_MODULE_TYPE, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Component,
});
TakTabNav.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakTabNav,
  selector: '[tak-tab-nav-bar]',
  inputs: { color: 'color' },
  host: {
    properties: {
      'attr.role': '_getRole()',
      'class.tak-tab-header-pagination-controls-enabled': '_showPaginationControls',
      'class.tak-tab-header-rtl': "_getLayoutDirection() == 'rtl'",
      'class.tak-primary': 'color !== "warn" && color !== "accent"',
      'class.tak-accent': 'color === "accent"',
      'class.tak-warn': 'color === "warn"',
    },
    classAttribute: 'tak-tab-nav-bar tak-tab-header',
  },
  queries: [
    {
      propertyName: '_items',
      predicate: i0.forwardRef(function () {
        return TakTabLink;
      }),
      descendants: true,
    },
  ],
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
  exportAs: ['takTabNavBar', 'takTabNav'],
  usesInheritance: true,
  ngImport: i0,
  template:
    '<button class="tak-tab-header-pagination tak-tab-header-pagination-before tak-elevation-z4"\n     #previousPaginator\n     aria-hidden="true"\n     type="button"\n     tak-ripple\n     tabindex="-1"\n     [takRippleDisabled]="_disableScrollBefore || disableRipple"\n     [class.tak-tab-header-pagination-disabled]="_disableScrollBefore"\n     [disabled]="_disableScrollBefore || null"\n     (click)="_handlePaginatorClick(\'before\')"\n     (mousedown)="_handlePaginatorPress(\'before\', $event)"\n     (touchend)="_stopInterval()">\n  <div class="tak-tab-header-pagination-chevron"></div>\n</button>\n\n<div class="tak-tab-link-container" #tabListContainer (keydown)="_handleKeydown($event)">\n  <div\n    class="tak-tab-list"\n    [class._tak-animation-noopable]="_animationMode === \'NoopAnimations\'"\n    #tabList\n    (cdkObserveContent)="_onContentChanges()">\n    <div class="tak-tab-links" #tabListInner>\n      <ng-content></ng-content>\n    </div>\n    <tak-ink-bar></tak-ink-bar>\n  </div>\n</div>\n\n<button class="tak-tab-header-pagination tak-tab-header-pagination-after tak-elevation-z4"\n     #nextPaginator\n     aria-hidden="true"\n     type="button"\n     tak-ripple\n     [takRippleDisabled]="_disableScrollAfter || disableRipple"\n     [class.tak-tab-header-pagination-disabled]="_disableScrollAfter"\n     [disabled]="_disableScrollAfter || null"\n     tabindex="-1"\n     (mousedown)="_handlePaginatorPress(\'after\', $event)"\n     (click)="_handlePaginatorClick(\'after\')"\n     (touchend)="_stopInterval()">\n  <div class="tak-tab-header-pagination-chevron"></div>\n</button>\n',
  styles: [
    '.tak-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.tak-tab-header-pagination{-webkit-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:none;box-sizing:content-box;background:none;border:none;outline:0;padding:0}.tak-tab-header-pagination::-moz-focus-inner{border:0}.tak-tab-header-pagination-controls-enabled .tak-tab-header-pagination{display:flex}.tak-tab-header-pagination-before,.tak-tab-header-rtl .tak-tab-header-pagination-after{padding-left:4px}.tak-tab-header-pagination-before .tak-tab-header-pagination-chevron,.tak-tab-header-rtl .tak-tab-header-pagination-after .tak-tab-header-pagination-chevron{transform:rotate(-135deg)}.tak-tab-header-rtl .tak-tab-header-pagination-before,.tak-tab-header-pagination-after{padding-right:4px}.tak-tab-header-rtl .tak-tab-header-pagination-before .tak-tab-header-pagination-chevron,.tak-tab-header-pagination-after .tak-tab-header-pagination-chevron{transform:rotate(45deg)}.tak-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;height:8px;width:8px}.tak-tab-header-pagination-disabled{box-shadow:none;cursor:default}.tak-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.tak-tab-links{display:flex}[tak-align-tabs=center]>.tak-tab-link-container .tak-tab-links{justify-content:center}[tak-align-tabs=end]>.tak-tab-link-container .tak-tab-links{justify-content:flex-end}.tak-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}.tak-ink-bar._tak-animation-noopable{transition:none !important;animation:none !important}.tak-tab-group-inverted-header .tak-ink-bar{bottom:auto;top:0}.cdk-high-contrast-active .tak-ink-bar{outline:solid 2px;height:0}.tak-tab-link-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.tak-tab-link{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;vertical-align:top;text-decoration:none;position:relative;overflow:hidden;-webkit-tap-highlight-color:rgba(0,0,0,0)}.tak-tab-link:focus{outline:none}.tak-tab-link:focus:not(.tak-tab-disabled){opacity:1}.tak-tab-link.tak-tab-disabled{cursor:default}.cdk-high-contrast-active .tak-tab-link.tak-tab-disabled{opacity:.5}.tak-tab-link .tak-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .tak-tab-link{opacity:1}[tak-stretch-tabs] .tak-tab-link{flex-basis:0;flex-grow:1}.tak-tab-link.tak-tab-disabled{pointer-events:none}.tak-tab-link::before{margin:5px}@media(max-width: 599px){.tak-tab-link{min-width:72px}}',
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
    { kind: 'directive', type: TakInkBar, selector: 'tak-ink-bar' },
  ],
  changeDetection: i0.ChangeDetectionStrategy.Default,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabNav,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: '[tak-tab-nav-bar]',
          exportAs: 'takTabNavBar, takTabNav',
          inputs: ['color'],
          host: {
            '[attr.role]': '_getRole()',
            class: 'tak-tab-nav-bar tak-tab-header',
            '[class.tak-tab-header-pagination-controls-enabled]': '_showPaginationControls',
            '[class.tak-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
            '[class.tak-primary]': 'color !== "warn" && color !== "accent"',
            '[class.tak-accent]': 'color === "accent"',
            '[class.tak-warn]': 'color === "warn"',
          },
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.Default,
          template:
            '<button class="tak-tab-header-pagination tak-tab-header-pagination-before tak-elevation-z4"\n     #previousPaginator\n     aria-hidden="true"\n     type="button"\n     tak-ripple\n     tabindex="-1"\n     [takRippleDisabled]="_disableScrollBefore || disableRipple"\n     [class.tak-tab-header-pagination-disabled]="_disableScrollBefore"\n     [disabled]="_disableScrollBefore || null"\n     (click)="_handlePaginatorClick(\'before\')"\n     (mousedown)="_handlePaginatorPress(\'before\', $event)"\n     (touchend)="_stopInterval()">\n  <div class="tak-tab-header-pagination-chevron"></div>\n</button>\n\n<div class="tak-tab-link-container" #tabListContainer (keydown)="_handleKeydown($event)">\n  <div\n    class="tak-tab-list"\n    [class._tak-animation-noopable]="_animationMode === \'NoopAnimations\'"\n    #tabList\n    (cdkObserveContent)="_onContentChanges()">\n    <div class="tak-tab-links" #tabListInner>\n      <ng-content></ng-content>\n    </div>\n    <tak-ink-bar></tak-ink-bar>\n  </div>\n</div>\n\n<button class="tak-tab-header-pagination tak-tab-header-pagination-after tak-elevation-z4"\n     #nextPaginator\n     aria-hidden="true"\n     type="button"\n     tak-ripple\n     [takRippleDisabled]="_disableScrollAfter || disableRipple"\n     [class.tak-tab-header-pagination-disabled]="_disableScrollAfter"\n     [disabled]="_disableScrollAfter || null"\n     tabindex="-1"\n     (mousedown)="_handlePaginatorPress(\'after\', $event)"\n     (click)="_handlePaginatorClick(\'after\')"\n     (touchend)="_stopInterval()">\n  <div class="tak-tab-header-pagination-chevron"></div>\n</button>\n',
          styles: [
            '.tak-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.tak-tab-header-pagination{-webkit-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:none;box-sizing:content-box;background:none;border:none;outline:0;padding:0}.tak-tab-header-pagination::-moz-focus-inner{border:0}.tak-tab-header-pagination-controls-enabled .tak-tab-header-pagination{display:flex}.tak-tab-header-pagination-before,.tak-tab-header-rtl .tak-tab-header-pagination-after{padding-left:4px}.tak-tab-header-pagination-before .tak-tab-header-pagination-chevron,.tak-tab-header-rtl .tak-tab-header-pagination-after .tak-tab-header-pagination-chevron{transform:rotate(-135deg)}.tak-tab-header-rtl .tak-tab-header-pagination-before,.tak-tab-header-pagination-after{padding-right:4px}.tak-tab-header-rtl .tak-tab-header-pagination-before .tak-tab-header-pagination-chevron,.tak-tab-header-pagination-after .tak-tab-header-pagination-chevron{transform:rotate(45deg)}.tak-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;height:8px;width:8px}.tak-tab-header-pagination-disabled{box-shadow:none;cursor:default}.tak-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.tak-tab-links{display:flex}[tak-align-tabs=center]>.tak-tab-link-container .tak-tab-links{justify-content:center}[tak-align-tabs=end]>.tak-tab-link-container .tak-tab-links{justify-content:flex-end}.tak-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}.tak-ink-bar._tak-animation-noopable{transition:none !important;animation:none !important}.tak-tab-group-inverted-header .tak-ink-bar{bottom:auto;top:0}.cdk-high-contrast-active .tak-ink-bar{outline:solid 2px;height:0}.tak-tab-link-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.tak-tab-link{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;vertical-align:top;text-decoration:none;position:relative;overflow:hidden;-webkit-tap-highlight-color:rgba(0,0,0,0)}.tak-tab-link:focus{outline:none}.tak-tab-link:focus:not(.tak-tab-disabled){opacity:1}.tak-tab-link.tak-tab-disabled{cursor:default}.cdk-high-contrast-active .tak-tab-link.tak-tab-disabled{opacity:.5}.tak-tab-link .tak-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .tak-tab-link{opacity:1}[tak-stretch-tabs] .tak-tab-link{flex-basis:0;flex-grow:1}.tak-tab-link.tak-tab-disabled{pointer-events:none}.tak-tab-link::before{margin:5px}@media(max-width: 599px){.tak-tab-link{min-width:72px}}',
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
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
      { type: i1$1.ViewportRuler },
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
        args: [forwardRef(() => TakTabLink), { descendants: true }],
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
// Boilerplate for applying mixins to TakTabLink.
const _TakTabLinkMixinBase = mixinTabIndex(mixinDisableRipple(mixinDisabled(class {})));
/** Base class with all of the `TakTabLink` functionality. */
class _TakTabLinkBase extends _TakTabLinkMixinBase {
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
    /** Whether the tab link is active or not. */
    this._isActive = false;
    /** Unique id for the tab. */
    this.id = `tak-tab-link-${nextUniqueId++}`;
    this.rippleConfig = globalRippleOptions || {};
    this.tabIndex = parseInt(tabIndex) || 0;
    if (animationMode === 'NoopAnimations') {
      this.rippleConfig.animation = { enterDuration: 0, exitDuration: 0 };
    }
  }
  /** Whether the link is active. */
  get active() {
    return this._isActive;
  }
  set active(value) {
    const newValue = coerceBooleanProperty(value);
    if (newValue !== this._isActive) {
      this._isActive = newValue;
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
  /** Focuses the tab link. */
  focus() {
    this.elementRef.nativeElement.focus();
  }
  ngAfterViewInit() {
    this._focusMonitor.monitor(this.elementRef);
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this.elementRef);
  }
  _handleFocus() {
    // Since we allow navigation through tabbing in the nav bar, we
    // have to update the focused index whenever the link receives focus.
    this._tabNavBar.focusIndex = this._tabNavBar._items.toArray().indexOf(this);
  }
  _handleKeydown(event) {
    if (this._tabNavBar.tabPanel && event.keyCode === SPACE) {
      this.elementRef.nativeElement.click();
    }
  }
  _getAriaControls() {
    var _a;
    return this._tabNavBar.tabPanel
      ? (_a = this._tabNavBar.tabPanel) === null || _a === void 0
        ? void 0
        : _a.id
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
      return this.tabIndex;
    }
  }
}
_TakTabLinkBase.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakTabLinkBase,
  deps: [
    { token: _TakTabNavBase },
    { token: i0.ElementRef },
    { token: TAK_RIPPLE_GLOBAL_OPTIONS, optional: true },
    { token: 'tabindex', attribute: true },
    { token: i7.FocusMonitor },
    { token: ANIMATION_MODULE_TYPE, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Directive,
});
_TakTabLinkBase.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: _TakTabLinkBase,
  inputs: { active: 'active', id: 'id' },
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: _TakTabLinkBase,
  decorators: [
    {
      type: Directive,
    },
  ],
  ctorParameters: function () {
    return [
      { type: _TakTabNavBase },
      { type: i0.ElementRef },
      {
        type: undefined,
        decorators: [
          {
            type: Optional,
          },
          {
            type: Inject,
            args: [TAK_RIPPLE_GLOBAL_OPTIONS],
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
      { type: i7.FocusMonitor },
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
    active: [
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
 * Link inside of a `tak-tab-nav-bar`.
 */
class TakTabLink extends _TakTabLinkBase {
  constructor(
    tabNavBar,
    elementRef,
    ngZone,
    platform,
    globalRippleOptions,
    tabIndex,
    focusMonitor,
    animationMode
  ) {
    super(tabNavBar, elementRef, globalRippleOptions, tabIndex, focusMonitor, animationMode);
    this._tabLinkRipple = new RippleRenderer(this, ngZone, elementRef, platform);
    this._tabLinkRipple.setupTriggerEvents(elementRef.nativeElement);
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this._tabLinkRipple._removeTriggerEvents();
  }
}
TakTabLink.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabLink,
  deps: [
    { token: TakTabNav },
    { token: i0.ElementRef },
    { token: i0.NgZone },
    { token: i3.Platform },
    { token: TAK_RIPPLE_GLOBAL_OPTIONS, optional: true },
    { token: 'tabindex', attribute: true },
    { token: i7.FocusMonitor },
    { token: ANIMATION_MODULE_TYPE, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakTabLink.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakTabLink,
  selector: '[tak-tab-link], [takTabLink]',
  inputs: { disabled: 'disabled', disableRipple: 'disableRipple', tabIndex: 'tabIndex' },
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
      'class.tak-tab-disabled': 'disabled',
      'class.tak-tab-label-active': 'active',
    },
    classAttribute: 'tak-tab-link tak-focus-indicator',
  },
  exportAs: ['takTabLink'],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabLink,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[tak-tab-link], [takTabLink]',
          exportAs: 'takTabLink',
          inputs: ['disabled', 'disableRipple', 'tabIndex'],
          host: {
            class: 'tak-tab-link tak-focus-indicator',
            '[attr.aria-controls]': '_getAriaControls()',
            '[attr.aria-current]': '_getAriaCurrent()',
            '[attr.aria-disabled]': 'disabled',
            '[attr.aria-selected]': '_getAriaSelected()',
            '[attr.id]': 'id',
            '[attr.tabIndex]': '_getTabIndex()',
            '[attr.role]': '_getRole()',
            '[class.tak-tab-disabled]': 'disabled',
            '[class.tak-tab-label-active]': 'active',
            '(focus)': '_handleFocus()',
            '(keydown)': '_handleKeydown($event)',
          },
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: TakTabNav },
      { type: i0.ElementRef },
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
            args: [TAK_RIPPLE_GLOBAL_OPTIONS],
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
      { type: i7.FocusMonitor },
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
});
/**
 * Tab panel component associated with TakTabNav.
 */
class TakTabNavPanel {
  constructor() {
    /** Unique id for the tab panel. */
    this.id = `tak-tab-nav-panel-${nextUniqueId++}`;
  }
}
TakTabNavPanel.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabNavPanel,
  deps: [],
  target: i0.ɵɵFactoryTarget.Component,
});
TakTabNavPanel.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakTabNavPanel,
  selector: 'tak-tab-nav-panel',
  inputs: { id: 'id' },
  host: {
    attributes: { role: 'tabpanel' },
    properties: { 'attr.aria-labelledby': '_activeTabId', 'attr.id': 'id' },
    classAttribute: 'tak-tab-nav-panel',
  },
  exportAs: ['takTabNavPanel'],
  ngImport: i0,
  template: '<ng-content></ng-content>',
  isInline: true,
  changeDetection: i0.ChangeDetectionStrategy.OnPush,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabNavPanel,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'tak-tab-nav-panel',
          exportAs: 'takTabNavPanel',
          template: '<ng-content></ng-content>',
          host: {
            '[attr.aria-labelledby]': '_activeTabId',
            '[attr.id]': 'id',
            class: 'tak-tab-nav-panel',
            role: 'tabpanel',
          },
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
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

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class TakTabsModule {}
TakTabsModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabsModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
TakTabsModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabsModule,
  declarations: [
    TakTabGroup,
    TakTabLabel,
    TakTab,
    TakInkBar,
    TakTabLabelWrapper,
    TakTabNav,
    TakTabNavPanel,
    TakTabLink,
    TakTabBody,
    TakTabBodyPortal,
    TakTabHeader,
    TakTabContent,
  ],
  imports: [
    CommonModule,
    TakCommonModule,
    PortalModule,
    TakRippleModule,
    ObserversModule,
    A11yModule,
  ],
  exports: [
    TakCommonModule,
    TakTabGroup,
    TakTabLabel,
    TakTab,
    TakTabNav,
    TakTabNavPanel,
    TakTabLink,
    TakTabContent,
  ],
});
TakTabsModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabsModule,
  imports: [
    CommonModule,
    TakCommonModule,
    PortalModule,
    TakRippleModule,
    ObserversModule,
    A11yModule,
    TakCommonModule,
  ],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTabsModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          imports: [
            CommonModule,
            TakCommonModule,
            PortalModule,
            TakRippleModule,
            ObserversModule,
            A11yModule,
          ],
          // Don't export all components because some are only to be used internally.
          exports: [
            TakCommonModule,
            TakTabGroup,
            TakTabLabel,
            TakTab,
            TakTabNav,
            TakTabNavPanel,
            TakTabLink,
            TakTabContent,
          ],
          declarations: [
            TakTabGroup,
            TakTabLabel,
            TakTab,
            TakInkBar,
            TakTabLabelWrapper,
            TakTabNav,
            TakTabNavPanel,
            TakTabLink,
            TakTabBody,
            TakTabBodyPortal,
            TakTabHeader,
            TakTabContent,
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
  TAK_TAB,
  TAK_TABS_CONFIG,
  TAK_TAB_GROUP,
  TakInkBar,
  TakTab,
  TakTabBody,
  TakTabBodyPortal,
  TakTabChangeEvent,
  TakTabContent,
  TakTabGroup,
  TakTabHeader,
  TakTabLabel,
  TakTabLabelWrapper,
  TakTabLink,
  TakTabNav,
  TakTabNavPanel,
  TakTabsModule,
  _TAK_INK_BAR_POSITIONER,
  _TakTabBodyBase,
  _TakTabGroupBase,
  _TakTabHeaderBase,
  _TakTabLinkBase,
  _TakTabNavBase,
  takTabsAnimations,
};
//# sourceMappingURL=tabs.mjs.map
