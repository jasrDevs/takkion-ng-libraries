/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@takkion/cdk/bidi';
import { CdkStep, CdkStepper, STEPPER_GLOBAL_OPTIONS } from '@takkion/cdk/stepper';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Inject,
  Input,
  Optional,
  Output,
  QueryList,
  SkipSelf,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ErrorStateMatcher } from '@takkion/material/core';
import { CdkPortalOutlet, TemplatePortal } from '@takkion/cdk/portal';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { MatStepHeader } from './step-header';
import { MatStepLabel } from './step-label';
import {
  DEFAULT_HORIZONTAL_ANIMATION_DURATION,
  DEFAULT_VERTICAL_ANIMATION_DURATION,
  matStepperAnimations,
} from './stepper-animations';
import { MatStepperIcon } from './stepper-icon';
import { MatStepContent } from './step-content';
import { NgTemplateOutlet } from '@angular/common';
import { Platform } from '@takkion/cdk/platform';
import * as i0 from '@angular/core';
import * as i1 from '@takkion/material/core';
import * as i2 from '@takkion/cdk/bidi';
export class MatStep extends CdkStep {
  constructor(stepper, _errorStateMatcher, _viewContainerRef, stepperOptions) {
    super(stepper, stepperOptions);
    this._errorStateMatcher = _errorStateMatcher;
    this._viewContainerRef = _viewContainerRef;
    this._isSelected = Subscription.EMPTY;
    /** Content for step label given by `<ng-template matStepLabel>`. */
    // We need an initializer here to avoid a TS error.
    this.stepLabel = undefined;
  }
  ngAfterContentInit() {
    this._isSelected = this._stepper.steps.changes
      .pipe(
        switchMap(() => {
          return this._stepper.selectionChange.pipe(
            map(event => event.selectedStep === this),
            startWith(this._stepper.selected === this)
          );
        })
      )
      .subscribe(isSelected => {
        if (isSelected && this._lazyContent && !this._portal) {
          this._portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef);
        }
      });
  }
  ngOnDestroy() {
    this._isSelected.unsubscribe();
  }
  /** Custom error state matcher that additionally checks for validity of interacted form. */
  isErrorState(control, form) {
    const originalErrorState = this._errorStateMatcher.isErrorState(control, form);
    // Custom error state checks for the validity of form that is not submitted or touched
    // since user can trigger a form change by calling for another step without directly
    // interacting with the current form.
    const customErrorState = !!(control && control.invalid && this.interacted);
    return originalErrorState || customErrorState;
  }
  static {
    this.ɵfac = i0.ɵɵngDeclareFactory({
      minVersion: '12.0.0',
      version: '17.2.0',
      ngImport: i0,
      type: MatStep,
      deps: [
        { token: forwardRef(() => MatStepper) },
        { token: i1.ErrorStateMatcher, skipSelf: true },
        { token: i0.ViewContainerRef },
        { token: STEPPER_GLOBAL_OPTIONS, optional: true },
      ],
      target: i0.ɵɵFactoryTarget.Component,
    });
  }
  static {
    this.ɵcmp = i0.ɵɵngDeclareComponent({
      minVersion: '14.0.0',
      version: '17.2.0',
      type: MatStep,
      isStandalone: true,
      selector: 'mat-step',
      inputs: { color: 'color' },
      host: { attributes: { hidden: '' } },
      providers: [
        { provide: ErrorStateMatcher, useExisting: MatStep },
        { provide: CdkStep, useExisting: MatStep },
      ],
      queries: [
        { propertyName: 'stepLabel', first: true, predicate: MatStepLabel, descendants: true },
        { propertyName: '_lazyContent', first: true, predicate: MatStepContent, descendants: true },
      ],
      exportAs: ['matStep'],
      usesInheritance: true,
      ngImport: i0,
      template:
        '<ng-template>\n  <ng-content></ng-content>\n  <ng-template [cdkPortalOutlet]="_portal"></ng-template>\n</ng-template>\n',
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
      changeDetection: i0.ChangeDetectionStrategy.OnPush,
      encapsulation: i0.ViewEncapsulation.None,
    });
  }
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '17.2.0',
  ngImport: i0,
  type: MatStep,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-step',
          providers: [
            { provide: ErrorStateMatcher, useExisting: MatStep },
            { provide: CdkStep, useExisting: MatStep },
          ],
          encapsulation: ViewEncapsulation.None,
          exportAs: 'matStep',
          changeDetection: ChangeDetectionStrategy.OnPush,
          standalone: true,
          imports: [CdkPortalOutlet],
          host: {
            hidden: '', // Hide the steps so they don't affect the layout.
          },
          template:
            '<ng-template>\n  <ng-content></ng-content>\n  <ng-template [cdkPortalOutlet]="_portal"></ng-template>\n</ng-template>\n',
        },
      ],
    },
  ],
  ctorParameters: () => [
    {
      type: MatStepper,
      decorators: [
        {
          type: Inject,
          args: [forwardRef(() => MatStepper)],
        },
      ],
    },
    {
      type: i1.ErrorStateMatcher,
      decorators: [
        {
          type: SkipSelf,
        },
      ],
    },
    { type: i0.ViewContainerRef },
    {
      type: undefined,
      decorators: [
        {
          type: Optional,
        },
        {
          type: Inject,
          args: [STEPPER_GLOBAL_OPTIONS],
        },
      ],
    },
  ],
  propDecorators: {
    stepLabel: [
      {
        type: ContentChild,
        args: [MatStepLabel],
      },
    ],
    color: [
      {
        type: Input,
      },
    ],
    _lazyContent: [
      {
        type: ContentChild,
        args: [MatStepContent, { static: false }],
      },
    ],
  },
});
export class MatStepper extends CdkStepper {
  /** Duration for the animation. Will be normalized to milliseconds if no units are set. */
  get animationDuration() {
    return this._animationDuration;
  }
  set animationDuration(value) {
    this._animationDuration = /^\d+$/.test(value) ? value + 'ms' : value;
  }
  constructor(dir, changeDetectorRef, elementRef) {
    super(dir, changeDetectorRef, elementRef);
    /** The list of step headers of the steps in the stepper. */
    // We need an initializer here to avoid a TS error.
    this._stepHeader = undefined;
    /** Full list of steps inside the stepper, including inside nested steppers. */
    // We need an initializer here to avoid a TS error.
    this._steps = undefined;
    /** Steps that belong to the current stepper, excluding ones from nested steppers. */
    this.steps = new QueryList();
    /** Event emitted when the current step is done transitioning in. */
    this.animationDone = new EventEmitter();
    /**
     * Whether the label should display in bottom or end position.
     * Only applies in the `horizontal` orientation.
     */
    this.labelPosition = 'end';
    /**
     * Position of the stepper's header.
     * Only applies in the `horizontal` orientation.
     */
    this.headerPosition = 'top';
    /** Consumer-specified template-refs to be used to override the header icons. */
    this._iconOverrides = {};
    /** Stream of animation `done` events when the body expands/collapses. */
    this._animationDone = new Subject();
    this._animationDuration = '';
    /** Whether the stepper is rendering on the server. */
    this._isServer = !inject(Platform).isBrowser;
    const nodeName = elementRef.nativeElement.nodeName.toLowerCase();
    this.orientation = nodeName === 'mat-vertical-stepper' ? 'vertical' : 'horizontal';
  }
  ngAfterContentInit() {
    super.ngAfterContentInit();
    this._icons.forEach(({ name, templateRef }) => (this._iconOverrides[name] = templateRef));
    // Mark the component for change detection whenever the content children query changes
    this.steps.changes.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._stateChanged();
    });
    this._animationDone
      .pipe(
        // This needs a `distinctUntilChanged` in order to avoid emitting the same event twice due
        // to a bug in animations where the `.done` callback gets invoked twice on some browsers.
        // See https://github.com/angular/angular/issues/24084
        distinctUntilChanged((x, y) => x.fromState === y.fromState && x.toState === y.toState),
        takeUntil(this._destroyed)
      )
      .subscribe(event => {
        if (event.toState === 'current') {
          this.animationDone.emit();
        }
      });
  }
  _stepIsNavigable(index, step) {
    return step.completed || this.selectedIndex === index || !this.linear;
  }
  _getAnimationDuration() {
    if (this.animationDuration) {
      return this.animationDuration;
    }
    return this.orientation === 'horizontal'
      ? DEFAULT_HORIZONTAL_ANIMATION_DURATION
      : DEFAULT_VERTICAL_ANIMATION_DURATION;
  }
  static {
    this.ɵfac = i0.ɵɵngDeclareFactory({
      minVersion: '12.0.0',
      version: '17.2.0',
      ngImport: i0,
      type: MatStepper,
      deps: [
        { token: i2.Directionality, optional: true },
        { token: i0.ChangeDetectorRef },
        { token: i0.ElementRef },
      ],
      target: i0.ɵɵFactoryTarget.Component,
    });
  }
  static {
    this.ɵcmp = i0.ɵɵngDeclareComponent({
      minVersion: '17.0.0',
      version: '17.2.0',
      type: MatStepper,
      isStandalone: true,
      selector: 'mat-stepper, mat-vertical-stepper, mat-horizontal-stepper, [matStepper]',
      inputs: {
        disableRipple: 'disableRipple',
        color: 'color',
        labelPosition: 'labelPosition',
        headerPosition: 'headerPosition',
        animationDuration: 'animationDuration',
      },
      outputs: { animationDone: 'animationDone' },
      host: {
        attributes: { role: 'tablist' },
        properties: {
          'class.mat-stepper-horizontal': 'orientation === "horizontal"',
          'class.mat-stepper-vertical': 'orientation === "vertical"',
          'class.mat-stepper-label-position-end':
            'orientation === "horizontal" && labelPosition == "end"',
          'class.mat-stepper-label-position-bottom':
            'orientation === "horizontal" && labelPosition == "bottom"',
          'class.mat-stepper-header-position-bottom': 'headerPosition === "bottom"',
          'attr.aria-orientation': 'orientation',
        },
      },
      providers: [{ provide: CdkStepper, useExisting: MatStepper }],
      queries: [
        { propertyName: '_steps', predicate: MatStep, descendants: true },
        { propertyName: '_icons', predicate: MatStepperIcon, descendants: true },
      ],
      viewQueries: [{ propertyName: '_stepHeader', predicate: MatStepHeader, descendants: true }],
      exportAs: ['matStepper', 'matVerticalStepper', 'matHorizontalStepper'],
      usesInheritance: true,
      ngImport: i0,
      template:
        '<!--\n  We need to project the content somewhere to avoid hydration errors. Some observations:\n  1. This is only necessary on the server.\n  2. We get a hydration error if there aren\'t any nodes after the `ng-content`.\n  3. We get a hydration error if `ng-content` is wrapped in another element.\n-->\n@if (_isServer) {\n  <ng-content/>\n}\n\n@switch (orientation) {\n  @case (\'horizontal\') {\n    <div class="mat-horizontal-stepper-wrapper">\n      <div class="mat-horizontal-stepper-header-container">\n        @for (step of steps; track step; let i = $index, isLast = $last) {\n          <ng-container\n            [ngTemplateOutlet]="stepTemplate"\n            [ngTemplateOutletContext]="{step: step, i: i}"></ng-container>\n          @if (!isLast) {\n            <div class="mat-stepper-horizontal-line"></div>\n          }\n        }\n      </div>\n\n      <div class="mat-horizontal-content-container">\n        @for (step of steps; track step; let i = $index) {\n          <div class="mat-horizontal-stepper-content" role="tabpanel"\n               [@horizontalStepTransition]="{\n                  \'value\': _getAnimationDirection(i),\n                  \'params\': {\'animationDuration\': _getAnimationDuration()}\n                }"\n               (@horizontalStepTransition.done)="_animationDone.next($event)"\n               [id]="_getStepContentId(i)"\n               [attr.aria-labelledby]="_getStepLabelId(i)"\n               [class.mat-horizontal-stepper-content-inactive]="selectedIndex !== i">\n            <ng-container [ngTemplateOutlet]="step.content"></ng-container>\n          </div>\n        }\n      </div>\n    </div>\n  }\n\n  @case (\'vertical\') {\n    @for (step of steps; track step; let i = $index, isLast = $last) {\n      <div class="mat-step">\n        <ng-container\n          [ngTemplateOutlet]="stepTemplate"\n          [ngTemplateOutletContext]="{step: step, i: i}"></ng-container>\n        <div class="mat-vertical-content-container" [class.mat-stepper-vertical-line]="!isLast">\n          <div class="mat-vertical-stepper-content" role="tabpanel"\n               [@verticalStepTransition]="{\n                  \'value\': _getAnimationDirection(i),\n                  \'params\': {\'animationDuration\': _getAnimationDuration()}\n                }"\n               (@verticalStepTransition.done)="_animationDone.next($event)"\n               [id]="_getStepContentId(i)"\n               [attr.aria-labelledby]="_getStepLabelId(i)"\n               [class.mat-vertical-stepper-content-inactive]="selectedIndex !== i">\n            <div class="mat-vertical-content">\n              <ng-container [ngTemplateOutlet]="step.content"></ng-container>\n            </div>\n          </div>\n        </div>\n      </div>\n    }\n  }\n}\n\n<!-- Common step templating -->\n<ng-template let-step="step" let-i="i" #stepTemplate>\n  <mat-step-header\n    [class.mat-horizontal-stepper-header]="orientation === \'horizontal\'"\n    [class.mat-vertical-stepper-header]="orientation === \'vertical\'"\n    (click)="step.select()"\n    (keydown)="_onKeydown($event)"\n    [tabIndex]="_getFocusIndex() === i ? 0 : -1"\n    [id]="_getStepLabelId(i)"\n    [attr.aria-posinset]="i + 1"\n    [attr.aria-setsize]="steps.length"\n    [attr.aria-controls]="_getStepContentId(i)"\n    [attr.aria-selected]="selectedIndex == i"\n    [attr.aria-label]="step.ariaLabel || null"\n    [attr.aria-labelledby]="(!step.ariaLabel && step.ariaLabelledby) ? step.ariaLabelledby : null"\n    [attr.aria-disabled]="_stepIsNavigable(i, step) ? null : true"\n    [index]="i"\n    [state]="_getIndicatorType(i, step.state)"\n    [label]="step.stepLabel || step.label"\n    [selected]="selectedIndex === i"\n    [active]="_stepIsNavigable(i, step)"\n    [optional]="step.optional"\n    [errorMessage]="step.errorMessage"\n    [iconOverrides]="_iconOverrides"\n    [disableRipple]="disableRipple || !_stepIsNavigable(i, step)"\n    [color]="step.color || color"></mat-step-header>\n</ng-template>\n',
      styles: [
        '.mat-stepper-vertical,.mat-stepper-horizontal{display:block;font-family:var(--mat-stepper-container-text-font);background:var(--mat-stepper-container-color)}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-header-position-bottom .mat-horizontal-stepper-header-container{order:1}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px;border-top-color:var(--mat-stepper-line-color)}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative;top:calc(calc((var(--mat-stepper-header-height) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:"";display:inline-block;height:0;position:absolute;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px;height:var(--mat-stepper-header-height)}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-horizontal-stepper-header::before,.mat-horizontal-stepper-header::after{border-top-color:var(--mat-stepper-line-color)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{padding:calc((var(--mat-stepper-header-height) - 24px) / 2) 24px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::after{top:calc(calc((var(--mat-stepper-header-height) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;height:24px;padding:calc((var(--mat-stepper-header-height) - 24px) / 2) 24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-wrapper{display:flex;flex-direction:column}.mat-horizontal-stepper-content{outline:0}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-inactive{height:0;overflow:hidden}.mat-horizontal-stepper-content:not(.mat-horizontal-stepper-content-inactive){visibility:inherit !important}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}.cdk-high-contrast-active .mat-horizontal-content-container{outline:solid 1px}.mat-stepper-header-position-bottom .mat-horizontal-content-container{padding:24px 24px 0 24px}.mat-vertical-content-container{margin-left:36px;border:0;position:relative}.cdk-high-contrast-active .mat-vertical-content-container{outline:solid 1px}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}.mat-stepper-vertical-line::before{content:"";position:absolute;left:0;border-left-width:1px;border-left-style:solid;border-left-color:var(--mat-stepper-line-color);top:calc(8px - calc((var(--mat-stepper-header-height) - 24px) / 2));bottom:calc(8px - calc((var(--mat-stepper-header-height) - 24px) / 2))}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0}.mat-vertical-stepper-content:not(.mat-vertical-stepper-content-inactive){visibility:inherit !important}.mat-vertical-content{padding:0 24px 24px 24px}.mat-step:last-child .mat-vertical-content-container{border:none}',
      ],
      dependencies: [
        {
          kind: 'directive',
          type: NgTemplateOutlet,
          selector: '[ngTemplateOutlet]',
          inputs: ['ngTemplateOutletContext', 'ngTemplateOutlet', 'ngTemplateOutletInjector'],
        },
        {
          kind: 'component',
          type: MatStepHeader,
          selector: 'mat-step-header',
          inputs: [
            'state',
            'label',
            'errorMessage',
            'iconOverrides',
            'index',
            'selected',
            'active',
            'optional',
            'disableRipple',
            'color',
          ],
        },
      ],
      animations: [
        matStepperAnimations.horizontalStepTransition,
        matStepperAnimations.verticalStepTransition,
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
  type: MatStepper,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-stepper, mat-vertical-stepper, mat-horizontal-stepper, [matStepper]',
          exportAs: 'matStepper, matVerticalStepper, matHorizontalStepper',
          host: {
            '[class.mat-stepper-horizontal]': 'orientation === "horizontal"',
            '[class.mat-stepper-vertical]': 'orientation === "vertical"',
            '[class.mat-stepper-label-position-end]':
              'orientation === "horizontal" && labelPosition == "end"',
            '[class.mat-stepper-label-position-bottom]':
              'orientation === "horizontal" && labelPosition == "bottom"',
            '[class.mat-stepper-header-position-bottom]': 'headerPosition === "bottom"',
            '[attr.aria-orientation]': 'orientation',
            role: 'tablist',
          },
          animations: [
            matStepperAnimations.horizontalStepTransition,
            matStepperAnimations.verticalStepTransition,
          ],
          providers: [{ provide: CdkStepper, useExisting: MatStepper }],
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          standalone: true,
          imports: [NgTemplateOutlet, MatStepHeader],
          template:
            '<!--\n  We need to project the content somewhere to avoid hydration errors. Some observations:\n  1. This is only necessary on the server.\n  2. We get a hydration error if there aren\'t any nodes after the `ng-content`.\n  3. We get a hydration error if `ng-content` is wrapped in another element.\n-->\n@if (_isServer) {\n  <ng-content/>\n}\n\n@switch (orientation) {\n  @case (\'horizontal\') {\n    <div class="mat-horizontal-stepper-wrapper">\n      <div class="mat-horizontal-stepper-header-container">\n        @for (step of steps; track step; let i = $index, isLast = $last) {\n          <ng-container\n            [ngTemplateOutlet]="stepTemplate"\n            [ngTemplateOutletContext]="{step: step, i: i}"></ng-container>\n          @if (!isLast) {\n            <div class="mat-stepper-horizontal-line"></div>\n          }\n        }\n      </div>\n\n      <div class="mat-horizontal-content-container">\n        @for (step of steps; track step; let i = $index) {\n          <div class="mat-horizontal-stepper-content" role="tabpanel"\n               [@horizontalStepTransition]="{\n                  \'value\': _getAnimationDirection(i),\n                  \'params\': {\'animationDuration\': _getAnimationDuration()}\n                }"\n               (@horizontalStepTransition.done)="_animationDone.next($event)"\n               [id]="_getStepContentId(i)"\n               [attr.aria-labelledby]="_getStepLabelId(i)"\n               [class.mat-horizontal-stepper-content-inactive]="selectedIndex !== i">\n            <ng-container [ngTemplateOutlet]="step.content"></ng-container>\n          </div>\n        }\n      </div>\n    </div>\n  }\n\n  @case (\'vertical\') {\n    @for (step of steps; track step; let i = $index, isLast = $last) {\n      <div class="mat-step">\n        <ng-container\n          [ngTemplateOutlet]="stepTemplate"\n          [ngTemplateOutletContext]="{step: step, i: i}"></ng-container>\n        <div class="mat-vertical-content-container" [class.mat-stepper-vertical-line]="!isLast">\n          <div class="mat-vertical-stepper-content" role="tabpanel"\n               [@verticalStepTransition]="{\n                  \'value\': _getAnimationDirection(i),\n                  \'params\': {\'animationDuration\': _getAnimationDuration()}\n                }"\n               (@verticalStepTransition.done)="_animationDone.next($event)"\n               [id]="_getStepContentId(i)"\n               [attr.aria-labelledby]="_getStepLabelId(i)"\n               [class.mat-vertical-stepper-content-inactive]="selectedIndex !== i">\n            <div class="mat-vertical-content">\n              <ng-container [ngTemplateOutlet]="step.content"></ng-container>\n            </div>\n          </div>\n        </div>\n      </div>\n    }\n  }\n}\n\n<!-- Common step templating -->\n<ng-template let-step="step" let-i="i" #stepTemplate>\n  <mat-step-header\n    [class.mat-horizontal-stepper-header]="orientation === \'horizontal\'"\n    [class.mat-vertical-stepper-header]="orientation === \'vertical\'"\n    (click)="step.select()"\n    (keydown)="_onKeydown($event)"\n    [tabIndex]="_getFocusIndex() === i ? 0 : -1"\n    [id]="_getStepLabelId(i)"\n    [attr.aria-posinset]="i + 1"\n    [attr.aria-setsize]="steps.length"\n    [attr.aria-controls]="_getStepContentId(i)"\n    [attr.aria-selected]="selectedIndex == i"\n    [attr.aria-label]="step.ariaLabel || null"\n    [attr.aria-labelledby]="(!step.ariaLabel && step.ariaLabelledby) ? step.ariaLabelledby : null"\n    [attr.aria-disabled]="_stepIsNavigable(i, step) ? null : true"\n    [index]="i"\n    [state]="_getIndicatorType(i, step.state)"\n    [label]="step.stepLabel || step.label"\n    [selected]="selectedIndex === i"\n    [active]="_stepIsNavigable(i, step)"\n    [optional]="step.optional"\n    [errorMessage]="step.errorMessage"\n    [iconOverrides]="_iconOverrides"\n    [disableRipple]="disableRipple || !_stepIsNavigable(i, step)"\n    [color]="step.color || color"></mat-step-header>\n</ng-template>\n',
          styles: [
            '.mat-stepper-vertical,.mat-stepper-horizontal{display:block;font-family:var(--mat-stepper-container-text-font);background:var(--mat-stepper-container-color)}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-header-position-bottom .mat-horizontal-stepper-header-container{order:1}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px;border-top-color:var(--mat-stepper-line-color)}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative;top:calc(calc((var(--mat-stepper-header-height) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:"";display:inline-block;height:0;position:absolute;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px;height:var(--mat-stepper-header-height)}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-horizontal-stepper-header::before,.mat-horizontal-stepper-header::after{border-top-color:var(--mat-stepper-line-color)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{padding:calc((var(--mat-stepper-header-height) - 24px) / 2) 24px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::after{top:calc(calc((var(--mat-stepper-header-height) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;height:24px;padding:calc((var(--mat-stepper-header-height) - 24px) / 2) 24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-wrapper{display:flex;flex-direction:column}.mat-horizontal-stepper-content{outline:0}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-inactive{height:0;overflow:hidden}.mat-horizontal-stepper-content:not(.mat-horizontal-stepper-content-inactive){visibility:inherit !important}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}.cdk-high-contrast-active .mat-horizontal-content-container{outline:solid 1px}.mat-stepper-header-position-bottom .mat-horizontal-content-container{padding:24px 24px 0 24px}.mat-vertical-content-container{margin-left:36px;border:0;position:relative}.cdk-high-contrast-active .mat-vertical-content-container{outline:solid 1px}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}.mat-stepper-vertical-line::before{content:"";position:absolute;left:0;border-left-width:1px;border-left-style:solid;border-left-color:var(--mat-stepper-line-color);top:calc(8px - calc((var(--mat-stepper-header-height) - 24px) / 2));bottom:calc(8px - calc((var(--mat-stepper-header-height) - 24px) / 2))}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0}.mat-vertical-stepper-content:not(.mat-vertical-stepper-content-inactive){visibility:inherit !important}.mat-vertical-content{padding:0 24px 24px 24px}.mat-step:last-child .mat-vertical-content-container{border:none}',
          ],
        },
      ],
    },
  ],
  ctorParameters: () => [
    {
      type: i2.Directionality,
      decorators: [
        {
          type: Optional,
        },
      ],
    },
    { type: i0.ChangeDetectorRef },
    { type: i0.ElementRef },
  ],
  propDecorators: {
    _stepHeader: [
      {
        type: ViewChildren,
        args: [MatStepHeader],
      },
    ],
    _steps: [
      {
        type: ContentChildren,
        args: [MatStep, { descendants: true }],
      },
    ],
    _icons: [
      {
        type: ContentChildren,
        args: [MatStepperIcon, { descendants: true }],
      },
    ],
    animationDone: [
      {
        type: Output,
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
    labelPosition: [
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
  },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zdGVwcGVyL3N0ZXBwZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc3RlcHBlci9zdGVwLmh0bWwiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc3RlcHBlci9zdGVwcGVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFDTCxPQUFPLEVBQ1AsVUFBVSxFQUVWLHNCQUFzQixHQUV2QixNQUFNLHNCQUFzQixDQUFDO0FBRTlCLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixNQUFNLEVBQ04sS0FBSyxFQUVMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFFBQVEsRUFFUixZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsaUJBQWlCLEVBQWUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RSxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3BFLE9BQU8sRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxTQUFTLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUxRixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxjQUFjLENB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QjtTQUM1Qzs7MkZBT1UsVUFBVTtrQkExQnRCLFNBQVM7K0JBQ0UseUVBQXlFLFlBQ3pFLHNEQUFzRCxRQUcxRDt3QkFDSixnQ0FBZ0MsRUFBRSw4QkFBOEI7d0JBQ2hFLDhCQUE4QixFQUFFLDRCQUE0Qjt3QkFDNUQsd0NBQXdDLEVBQ3RDLHdEQUF3RDt3QkFDMUQsMkNBQTJDLEVBQ3pDLDJEQUEyRDt3QkFDN0QsNENBQTRDLEVBQUUsNkJBQTZCO3dCQUMzRSx5QkFBeUIsRUFBRSxhQUFhO3dCQUN4QyxNQUFNLEVBQUUsU0FBUztxQkFDbEIsY0FDVzt3QkFDVixvQkFBb0IsQ0FBQyx3QkFBd0I7d0JBQzdDLG9CQUFvQixDQUFDLHNCQUFzQjtxQkFDNUMsYUFDVSxDQUFDLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLFlBQVksRUFBQyxDQUFDLGlCQUM1QyxpQkFBaUIsQ0FBQyxJQUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNLGNBQ25DLElBQUksV0FDUCxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQzs7MEJBOER2QyxRQUFRO2tHQXpEMkIsV0FBVztzQkFBaEQsWUFBWTt1QkFBQyxhQUFhO2dCQUs2QixNQUFNO3NCQUE3RCxlQUFlO3VCQUFDLE9BQU8sRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7Z0JBT1MsTUFBTTtzQkFBM0QsZUFBZTt1QkFBQyxjQUFjLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQUdqQyxhQUFhO3NCQUEvQixNQUFNO2dCQUdFLGFBQWE7c0JBQXJCLEtBQUs7Z0JBR0csS0FBSztzQkFBYixLQUFLO2dCQU9OLGFBQWE7c0JBRFosS0FBSztnQkFRTixjQUFjO3NCQURiLEtBQUs7Z0JBV0YsaUJBQWlCO3NCQURwQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIENka1N0ZXAsXG4gIENka1N0ZXBwZXIsXG4gIFN0ZXBDb250ZW50UG9zaXRpb25TdGF0ZSxcbiAgU1RFUFBFUl9HTE9CQUxfT1BUSU9OUyxcbiAgU3RlcHBlck9wdGlvbnMsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zdGVwcGVyJztcbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIGluamVjdCxcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNraXBTZWxmLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgRm9ybUdyb3VwRGlyZWN0aXZlLCBOZ0Zvcm19IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7RXJyb3JTdGF0ZU1hdGNoZXIsIFRoZW1lUGFsZXR0ZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0Nka1BvcnRhbE91dGxldCwgVGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlVW50aWwsIGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBtYXAsIHN0YXJ0V2l0aCwgc3dpdGNoTWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7TWF0U3RlcEhlYWRlcn0gZnJvbSAnLi9zdGVwLWhlYWRlcic7XG5pbXBvcnQge01hdFN0ZXBMYWJlbH0gZnJvbSAnLi9zdGVwLWxhYmVsJztcbmltcG9ydCB7XG4gIERFRkFVTFRfSE9SSVpPTlRBTF9BTklNQVRJT05fRFVSQVRJT04sXG4gIERFRkFVTFRfVkVSVElDQUxfQU5JTUFUSU9OX0RVUkFUSU9OLFxuICBtYXRTdGVwcGVyQW5pbWF0aW9ucyxcbn0gZnJvbSAnLi9zdGVwcGVyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRTdGVwcGVySWNvbiwgTWF0U3RlcHBlckljb25Db250ZXh0fSBmcm9tICcuL3N0ZXBwZXItaWNvbic7XG5pbXBvcnQge01hdFN0ZXBDb250ZW50fSBmcm9tICcuL3N0ZXAtY29udGVudCc7XG5pbXBvcnQge05nVGVtcGxhdGVPdXRsZXR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc3RlcCcsXG4gIHRlbXBsYXRlVXJsOiAnc3RlcC5odG1sJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IEVycm9yU3RhdGVNYXRjaGVyLCB1c2VFeGlzdGluZzogTWF0U3RlcH0sXG4gICAge3Byb3ZpZGU6IENka1N0ZXAsIHVzZUV4aXN0aW5nOiBNYXRTdGVwfSxcbiAgXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRTdGVwJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtDZGtQb3J0YWxPdXRsZXRdLFxuICBob3N0OiB7XG4gICAgJ2hpZGRlbic6ICcnLCAvLyBIaWRlIHRoZSBzdGVwcyBzbyB0aGV5IGRvbid0IGFmZmVjdCB0aGUgbGF5b3V0LlxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwIGV4dGVuZHMgQ2RrU3RlcCBpbXBsZW1lbnRzIEVycm9yU3RhdGVNYXRjaGVyLCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9pc1NlbGVjdGVkID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBDb250ZW50IGZvciBzdGVwIGxhYmVsIGdpdmVuIGJ5IGA8bmctdGVtcGxhdGUgbWF0U3RlcExhYmVsPmAuICovXG4gIC8vIFdlIG5lZWQgYW4gaW5pdGlhbGl6ZXIgaGVyZSB0byBhdm9pZCBhIFRTIGVycm9yLlxuICBAQ29udGVudENoaWxkKE1hdFN0ZXBMYWJlbCkgb3ZlcnJpZGUgc3RlcExhYmVsOiBNYXRTdGVwTGFiZWwgPSB1bmRlZmluZWQhO1xuXG4gIC8qKiBUaGVtZSBjb2xvciBmb3IgdGhlIHBhcnRpY3VsYXIgc3RlcC4gKi9cbiAgQElucHV0KCkgY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKiogQ29udGVudCB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgbGF6aWx5LiAqL1xuICBAQ29udGVudENoaWxkKE1hdFN0ZXBDb250ZW50LCB7c3RhdGljOiBmYWxzZX0pIF9sYXp5Q29udGVudDogTWF0U3RlcENvbnRlbnQ7XG5cbiAgLyoqIEN1cnJlbnRseS1hdHRhY2hlZCBwb3J0YWwgY29udGFpbmluZyB0aGUgbGF6eSBjb250ZW50LiAqL1xuICBfcG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTWF0U3RlcHBlcikpIHN0ZXBwZXI6IE1hdFN0ZXBwZXIsXG4gICAgQFNraXBTZWxmKCkgcHJpdmF0ZSBfZXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChTVEVQUEVSX0dMT0JBTF9PUFRJT05TKSBzdGVwcGVyT3B0aW9ucz86IFN0ZXBwZXJPcHRpb25zLFxuICApIHtcbiAgICBzdXBlcihzdGVwcGVyLCBzdGVwcGVyT3B0aW9ucyk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5faXNTZWxlY3RlZCA9IHRoaXMuX3N0ZXBwZXIuc3RlcHMuY2hhbmdlc1xuICAgICAgLnBpcGUoXG4gICAgICAgIHN3aXRjaE1hcCgoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3N0ZXBwZXIuc2VsZWN0aW9uQ2hhbmdlLnBpcGUoXG4gICAgICAgICAgICBtYXAoZXZlbnQgPT4gZXZlbnQuc2VsZWN0ZWRTdGVwID09PSB0aGlzKSxcbiAgICAgICAgICAgIHN0YXJ0V2l0aCh0aGlzLl9zdGVwcGVyLnNlbGVjdGVkID09PSB0aGlzKSxcbiAgICAgICAgICApO1xuICAgICAgICB9KSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoaXNTZWxlY3RlZCA9PiB7XG4gICAgICAgIGlmIChpc1NlbGVjdGVkICYmIHRoaXMuX2xhenlDb250ZW50ICYmICF0aGlzLl9wb3J0YWwpIHtcbiAgICAgICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwodGhpcy5fbGF6eUNvbnRlbnQuX3RlbXBsYXRlLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmISk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5faXNTZWxlY3RlZC51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIEN1c3RvbSBlcnJvciBzdGF0ZSBtYXRjaGVyIHRoYXQgYWRkaXRpb25hbGx5IGNoZWNrcyBmb3IgdmFsaWRpdHkgb2YgaW50ZXJhY3RlZCBmb3JtLiAqL1xuICBpc0Vycm9yU3RhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sIHwgbnVsbCwgZm9ybTogRm9ybUdyb3VwRGlyZWN0aXZlIHwgTmdGb3JtIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG9yaWdpbmFsRXJyb3JTdGF0ZSA9IHRoaXMuX2Vycm9yU3RhdGVNYXRjaGVyLmlzRXJyb3JTdGF0ZShjb250cm9sLCBmb3JtKTtcblxuICAgIC8vIEN1c3RvbSBlcnJvciBzdGF0ZSBjaGVja3MgZm9yIHRoZSB2YWxpZGl0eSBvZiBmb3JtIHRoYXQgaXMgbm90IHN1Ym1pdHRlZCBvciB0b3VjaGVkXG4gICAgLy8gc2luY2UgdXNlciBjYW4gdHJpZ2dlciBhIGZvcm0gY2hhbmdlIGJ5IGNhbGxpbmcgZm9yIGFub3RoZXIgc3RlcCB3aXRob3V0IGRpcmVjdGx5XG4gICAgLy8gaW50ZXJhY3Rpbmcgd2l0aCB0aGUgY3VycmVudCBmb3JtLlxuICAgIGNvbnN0IGN1c3RvbUVycm9yU3RhdGUgPSAhIShjb250cm9sICYmIGNvbnRyb2wuaW52YWxpZCAmJiB0aGlzLmludGVyYWN0ZWQpO1xuXG4gICAgcmV0dXJuIG9yaWdpbmFsRXJyb3JTdGF0ZSB8fCBjdXN0b21FcnJvclN0YXRlO1xuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1zdGVwcGVyLCBtYXQtdmVydGljYWwtc3RlcHBlciwgbWF0LWhvcml6b250YWwtc3RlcHBlciwgW21hdFN0ZXBwZXJdJyxcbiAgZXhwb3J0QXM6ICdtYXRTdGVwcGVyLCBtYXRWZXJ0aWNhbFN0ZXBwZXIsIG1hdEhvcml6b250YWxTdGVwcGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdzdGVwcGVyLmh0bWwnLFxuICBzdHlsZVVybDogJ3N0ZXBwZXIuY3NzJyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MubWF0LXN0ZXBwZXItaG9yaXpvbnRhbF0nOiAnb3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1zdGVwcGVyLXZlcnRpY2FsXSc6ICdvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1zdGVwcGVyLWxhYmVsLXBvc2l0aW9uLWVuZF0nOlxuICAgICAgJ29yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIiAmJiBsYWJlbFBvc2l0aW9uID09IFwiZW5kXCInLFxuICAgICdbY2xhc3MubWF0LXN0ZXBwZXItbGFiZWwtcG9zaXRpb24tYm90dG9tXSc6XG4gICAgICAnb3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiICYmIGxhYmVsUG9zaXRpb24gPT0gXCJib3R0b21cIicsXG4gICAgJ1tjbGFzcy5tYXQtc3RlcHBlci1oZWFkZXItcG9zaXRpb24tYm90dG9tXSc6ICdoZWFkZXJQb3NpdGlvbiA9PT0gXCJib3R0b21cIicsXG4gICAgJ1thdHRyLmFyaWEtb3JpZW50YXRpb25dJzogJ29yaWVudGF0aW9uJyxcbiAgICAncm9sZSc6ICd0YWJsaXN0JyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW1xuICAgIG1hdFN0ZXBwZXJBbmltYXRpb25zLmhvcml6b250YWxTdGVwVHJhbnNpdGlvbixcbiAgICBtYXRTdGVwcGVyQW5pbWF0aW9ucy52ZXJ0aWNhbFN0ZXBUcmFuc2l0aW9uLFxuICBdLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrU3RlcHBlciwgdXNlRXhpc3Rpbmc6IE1hdFN0ZXBwZXJ9XSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtOZ1RlbXBsYXRlT3V0bGV0LCBNYXRTdGVwSGVhZGVyXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U3RlcHBlciBleHRlbmRzIENka1N0ZXBwZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcbiAgLyoqIFRoZSBsaXN0IG9mIHN0ZXAgaGVhZGVycyBvZiB0aGUgc3RlcHMgaW4gdGhlIHN0ZXBwZXIuICovXG4gIC8vIFdlIG5lZWQgYW4gaW5pdGlhbGl6ZXIgaGVyZSB0byBhdm9pZCBhIFRTIGVycm9yLlxuICBAVmlld0NoaWxkcmVuKE1hdFN0ZXBIZWFkZXIpIG92ZXJyaWRlIF9zdGVwSGVhZGVyOiBRdWVyeUxpc3Q8TWF0U3RlcEhlYWRlcj4gPVxuICAgIHVuZGVmaW5lZCBhcyB1bmtub3duIGFzIFF1ZXJ5TGlzdDxNYXRTdGVwSGVhZGVyPjtcblxuICAvKiogRnVsbCBsaXN0IG9mIHN0ZXBzIGluc2lkZSB0aGUgc3RlcHBlciwgaW5jbHVkaW5nIGluc2lkZSBuZXN0ZWQgc3RlcHBlcnMuICovXG4gIC8vIFdlIG5lZWQgYW4gaW5pdGlhbGl6ZXIgaGVyZSB0byBhdm9pZCBhIFRTIGVycm9yLlxuICBAQ29udGVudENoaWxkcmVuKE1hdFN0ZXAsIHtkZXNjZW5kYW50czogdHJ1ZX0pIG92ZXJyaWRlIF9zdGVwczogUXVlcnlMaXN0PE1hdFN0ZXA+ID1cbiAgICB1bmRlZmluZWQgYXMgdW5rbm93biBhcyBRdWVyeUxpc3Q8TWF0U3RlcD47XG5cbiAgLyoqIFN0ZXBzIHRoYXQgYmVsb25nIHRvIHRoZSBjdXJyZW50IHN0ZXBwZXIsIGV4Y2x1ZGluZyBvbmVzIGZyb20gbmVzdGVkIHN0ZXBwZXJzLiAqL1xuICBvdmVycmlkZSByZWFkb25seSBzdGVwczogUXVlcnlMaXN0PE1hdFN0ZXA+ID0gbmV3IFF1ZXJ5TGlzdDxNYXRTdGVwPigpO1xuXG4gIC8qKiBDdXN0b20gaWNvbiBvdmVycmlkZXMgcGFzc2VkIGluIGJ5IHRoZSBjb25zdW1lci4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRTdGVwcGVySWNvbiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2ljb25zOiBRdWVyeUxpc3Q8TWF0U3RlcHBlckljb24+O1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGN1cnJlbnQgc3RlcCBpcyBkb25lIHRyYW5zaXRpb25pbmcgaW4uICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhbmltYXRpb25Eb25lOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBzaG91bGQgYmUgZGlzYWJsZWQgZm9yIHRoZSBzdGVwIGhlYWRlcnMuICovXG4gIEBJbnB1dCgpIGRpc2FibGVSaXBwbGU6IGJvb2xlYW47XG5cbiAgLyoqIFRoZW1lIGNvbG9yIGZvciBhbGwgb2YgdGhlIHN0ZXBzIGluIHN0ZXBwZXIuICovXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBkaXNwbGF5IGluIGJvdHRvbSBvciBlbmQgcG9zaXRpb24uXG4gICAqIE9ubHkgYXBwbGllcyBpbiB0aGUgYGhvcml6b250YWxgIG9yaWVudGF0aW9uLlxuICAgKi9cbiAgQElucHV0KClcbiAgbGFiZWxQb3NpdGlvbjogJ2JvdHRvbScgfCAnZW5kJyA9ICdlbmQnO1xuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiBvZiB0aGUgc3RlcHBlcidzIGhlYWRlci5cbiAgICogT25seSBhcHBsaWVzIGluIHRoZSBgaG9yaXpvbnRhbGAgb3JpZW50YXRpb24uXG4gICAqL1xuICBASW5wdXQoKVxuICBoZWFkZXJQb3NpdGlvbjogJ3RvcCcgfCAnYm90dG9tJyA9ICd0b3AnO1xuXG4gIC8qKiBDb25zdW1lci1zcGVjaWZpZWQgdGVtcGxhdGUtcmVmcyB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBoZWFkZXIgaWNvbnMuICovXG4gIF9pY29uT3ZlcnJpZGVzOiBSZWNvcmQ8c3RyaW5nLCBUZW1wbGF0ZVJlZjxNYXRTdGVwcGVySWNvbkNvbnRleHQ+PiA9IHt9O1xuXG4gIC8qKiBTdHJlYW0gb2YgYW5pbWF0aW9uIGBkb25lYCBldmVudHMgd2hlbiB0aGUgYm9keSBleHBhbmRzL2NvbGxhcHNlcy4gKi9cbiAgcmVhZG9ubHkgX2FuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogRHVyYXRpb24gZm9yIHRoZSBhbmltYXRpb24uIFdpbGwgYmUgbm9ybWFsaXplZCB0byBtaWxsaXNlY29uZHMgaWYgbm8gdW5pdHMgYXJlIHNldC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGFuaW1hdGlvbkR1cmF0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvbkR1cmF0aW9uO1xuICB9XG4gIHNldCBhbmltYXRpb25EdXJhdGlvbih2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uRHVyYXRpb24gPSAvXlxcZCskLy50ZXN0KHZhbHVlKSA/IHZhbHVlICsgJ21zJyA6IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2FuaW1hdGlvbkR1cmF0aW9uID0gJyc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHN0ZXBwZXIgaXMgcmVuZGVyaW5nIG9uIHRoZSBzZXJ2ZXIuICovXG4gIHByb3RlY3RlZCBfaXNTZXJ2ZXI6IGJvb2xlYW4gPSAhaW5qZWN0KFBsYXRmb3JtKS5pc0Jyb3dzZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICkge1xuICAgIHN1cGVyKGRpciwgY2hhbmdlRGV0ZWN0b3JSZWYsIGVsZW1lbnRSZWYpO1xuICAgIGNvbnN0IG5vZGVOYW1lID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG5vZGVOYW1lID09PSAnbWF0LXZlcnRpY2FsLXN0ZXBwZXInID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgfVxuXG4gIG92ZXJyaWRlIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBzdXBlci5uZ0FmdGVyQ29udGVudEluaXQoKTtcbiAgICB0aGlzLl9pY29ucy5mb3JFYWNoKCh7bmFtZSwgdGVtcGxhdGVSZWZ9KSA9PiAodGhpcy5faWNvbk92ZXJyaWRlc1tuYW1lXSA9IHRlbXBsYXRlUmVmKSk7XG5cbiAgICAvLyBNYXJrIHRoZSBjb21wb25lbnQgZm9yIGNoYW5nZSBkZXRlY3Rpb24gd2hlbmV2ZXIgdGhlIGNvbnRlbnQgY2hpbGRyZW4gcXVlcnkgY2hhbmdlc1xuICAgIHRoaXMuc3RlcHMuY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fc3RhdGVDaGFuZ2VkKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9hbmltYXRpb25Eb25lXG4gICAgICAucGlwZShcbiAgICAgICAgLy8gVGhpcyBuZWVkcyBhIGBkaXN0aW5jdFVudGlsQ2hhbmdlZGAgaW4gb3JkZXIgdG8gYXZvaWQgZW1pdHRpbmcgdGhlIHNhbWUgZXZlbnQgdHdpY2UgZHVlXG4gICAgICAgIC8vIHRvIGEgYnVnIGluIGFuaW1hdGlvbnMgd2hlcmUgdGhlIGAuZG9uZWAgY2FsbGJhY2sgZ2V0cyBpbnZva2VkIHR3aWNlIG9uIHNvbWUgYnJvd3NlcnMuXG4gICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNDA4NFxuICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgoeCwgeSkgPT4geC5mcm9tU3RhdGUgPT09IHkuZnJvbVN0YXRlICYmIHgudG9TdGF0ZSA9PT0geS50b1N0YXRlKSxcbiAgICAgICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKChldmVudC50b1N0YXRlIGFzIFN0ZXBDb250ZW50UG9zaXRpb25TdGF0ZSkgPT09ICdjdXJyZW50Jykge1xuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uRG9uZS5lbWl0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgX3N0ZXBJc05hdmlnYWJsZShpbmRleDogbnVtYmVyLCBzdGVwOiBNYXRTdGVwKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHN0ZXAuY29tcGxldGVkIHx8IHRoaXMuc2VsZWN0ZWRJbmRleCA9PT0gaW5kZXggfHwgIXRoaXMubGluZWFyO1xuICB9XG5cbiAgX2dldEFuaW1hdGlvbkR1cmF0aW9uKCkge1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbkR1cmF0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5hbmltYXRpb25EdXJhdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnXG4gICAgICA/IERFRkFVTFRfSE9SSVpPTlRBTF9BTklNQVRJT05fRFVSQVRJT05cbiAgICAgIDogREVGQVVMVF9WRVJUSUNBTF9BTklNQVRJT05fRFVSQVRJT047XG4gIH1cbn1cbiIsIjxuZy10ZW1wbGF0ZT5cbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICA8bmctdGVtcGxhdGUgW2Nka1BvcnRhbE91dGxldF09XCJfcG9ydGFsXCI+PC9uZy10ZW1wbGF0ZT5cbjwvbmctdGVtcGxhdGU+XG4iLCI8IS0tXG4gIFdlIG5lZWQgdG8gcHJvamVjdCB0aGUgY29udGVudCBzb21ld2hlcmUgdG8gYXZvaWQgaHlkcmF0aW9uIGVycm9ycy4gU29tZSBvYnNlcnZhdGlvbnM6XG4gIDEuIFRoaXMgaXMgb25seSBuZWNlc3Nhcnkgb24gdGhlIHNlcnZlci5cbiAgMi4gV2UgZ2V0IGEgaHlkcmF0aW9uIGVycm9yIGlmIHRoZXJlIGFyZW4ndCBhbnkgbm9kZXMgYWZ0ZXIgdGhlIGBuZy1jb250ZW50YC5cbiAgMy4gV2UgZ2V0IGEgaHlkcmF0aW9uIGVycm9yIGlmIGBuZy1jb250ZW50YCBpcyB3cmFwcGVkIGluIGFub3RoZXIgZWxlbWVudC5cbi0tPlxuQGlmIChfaXNTZXJ2ZXIpIHtcbiAgPG5nLWNvbnRlbnQvPlxufVxuXG5Ac3dpdGNoIChvcmllbnRhdGlvbikge1xuICBAY2FzZSAoJ2hvcml6b250YWwnKSB7XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1ob3Jpem9udGFsLXN0ZXBwZXItd3JhcHBlclwiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1hdC1ob3Jpem9udGFsLXN0ZXBwZXItaGVhZGVyLWNvbnRhaW5lclwiPlxuICAgICAgICBAZm9yIChzdGVwIG9mIHN0ZXBzOyB0cmFjayBzdGVwOyBsZXQgaSA9ICRpbmRleCwgaXNMYXN0ID0gJGxhc3QpIHtcbiAgICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJzdGVwVGVtcGxhdGVcIlxuICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntzdGVwOiBzdGVwLCBpOiBpfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgIEBpZiAoIWlzTGFzdCkge1xuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1hdC1zdGVwcGVyLWhvcml6b250YWwtbGluZVwiPjwvZGl2PlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYXQtaG9yaXpvbnRhbC1jb250ZW50LWNvbnRhaW5lclwiPlxuICAgICAgICBAZm9yIChzdGVwIG9mIHN0ZXBzOyB0cmFjayBzdGVwOyBsZXQgaSA9ICRpbmRleCkge1xuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYXQtaG9yaXpvbnRhbC1zdGVwcGVyLWNvbnRlbnRcIiByb2xlPVwidGFicGFuZWxcIlxuICAgICAgICAgICAgICAgW0Bob3Jpem9udGFsU3RlcFRyYW5zaXRpb25dPVwie1xuICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogX2dldEFuaW1hdGlvbkRpcmVjdGlvbihpKSxcbiAgICAgICAgICAgICAgICAgICdwYXJhbXMnOiB7J2FuaW1hdGlvbkR1cmF0aW9uJzogX2dldEFuaW1hdGlvbkR1cmF0aW9uKCl9XG4gICAgICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAgICAoQGhvcml6b250YWxTdGVwVHJhbnNpdGlvbi5kb25lKT1cIl9hbmltYXRpb25Eb25lLm5leHQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICBbaWRdPVwiX2dldFN0ZXBDb250ZW50SWQoaSlcIlxuICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cIl9nZXRTdGVwTGFiZWxJZChpKVwiXG4gICAgICAgICAgICAgICBbY2xhc3MubWF0LWhvcml6b250YWwtc3RlcHBlci1jb250ZW50LWluYWN0aXZlXT1cInNlbGVjdGVkSW5kZXggIT09IGlcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwic3RlcC5jb250ZW50XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICB9XG5cbiAgQGNhc2UgKCd2ZXJ0aWNhbCcpIHtcbiAgICBAZm9yIChzdGVwIG9mIHN0ZXBzOyB0cmFjayBzdGVwOyBsZXQgaSA9ICRpbmRleCwgaXNMYXN0ID0gJGxhc3QpIHtcbiAgICAgIDxkaXYgY2xhc3M9XCJtYXQtc3RlcFwiPlxuICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwic3RlcFRlbXBsYXRlXCJcbiAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie3N0ZXA6IHN0ZXAsIGk6IGl9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtYXQtdmVydGljYWwtY29udGVudC1jb250YWluZXJcIiBbY2xhc3MubWF0LXN0ZXBwZXItdmVydGljYWwtbGluZV09XCIhaXNMYXN0XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1hdC12ZXJ0aWNhbC1zdGVwcGVyLWNvbnRlbnRcIiByb2xlPVwidGFicGFuZWxcIlxuICAgICAgICAgICAgICAgW0B2ZXJ0aWNhbFN0ZXBUcmFuc2l0aW9uXT1cIntcbiAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IF9nZXRBbmltYXRpb25EaXJlY3Rpb24oaSksXG4gICAgICAgICAgICAgICAgICAncGFyYW1zJzogeydhbmltYXRpb25EdXJhdGlvbic6IF9nZXRBbmltYXRpb25EdXJhdGlvbigpfVxuICAgICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgICAgKEB2ZXJ0aWNhbFN0ZXBUcmFuc2l0aW9uLmRvbmUpPVwiX2FuaW1hdGlvbkRvbmUubmV4dCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgIFtpZF09XCJfZ2V0U3RlcENvbnRlbnRJZChpKVwiXG4gICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiX2dldFN0ZXBMYWJlbElkKGkpXCJcbiAgICAgICAgICAgICAgIFtjbGFzcy5tYXQtdmVydGljYWwtc3RlcHBlci1jb250ZW50LWluYWN0aXZlXT1cInNlbGVjdGVkSW5kZXggIT09IGlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYXQtdmVydGljYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInN0ZXAuY29udGVudFwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgfVxuICB9XG59XG5cbjwhLS0gQ29tbW9uIHN0ZXAgdGVtcGxhdGluZyAtLT5cbjxuZy10ZW1wbGF0ZSBsZXQtc3RlcD1cInN0ZXBcIiBsZXQtaT1cImlcIiAjc3RlcFRlbXBsYXRlPlxuICA8bWF0LXN0ZXAtaGVhZGVyXG4gICAgW2NsYXNzLm1hdC1ob3Jpem9udGFsLXN0ZXBwZXItaGVhZGVyXT1cIm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCdcIlxuICAgIFtjbGFzcy5tYXQtdmVydGljYWwtc3RlcHBlci1oZWFkZXJdPVwib3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCdcIlxuICAgIChjbGljayk9XCJzdGVwLnNlbGVjdCgpXCJcbiAgICAoa2V5ZG93bik9XCJfb25LZXlkb3duKCRldmVudClcIlxuICAgIFt0YWJJbmRleF09XCJfZ2V0Rm9jdXNJbmRleCgpID09PSBpID8gMCA6IC0xXCJcbiAgICBbaWRdPVwiX2dldFN0ZXBMYWJlbElkKGkpXCJcbiAgICBbYXR0ci5hcmlhLXBvc2luc2V0XT1cImkgKyAxXCJcbiAgICBbYXR0ci5hcmlhLXNldHNpemVdPVwic3RlcHMubGVuZ3RoXCJcbiAgICBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cIl9nZXRTdGVwQ29udGVudElkKGkpXCJcbiAgICBbYXR0ci5hcmlhLXNlbGVjdGVkXT1cInNlbGVjdGVkSW5kZXggPT0gaVwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbF09XCJzdGVwLmFyaWFMYWJlbCB8fCBudWxsXCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiKCFzdGVwLmFyaWFMYWJlbCAmJiBzdGVwLmFyaWFMYWJlbGxlZGJ5KSA/IHN0ZXAuYXJpYUxhYmVsbGVkYnkgOiBudWxsXCJcbiAgICBbYXR0ci5hcmlhLWRpc2FibGVkXT1cIl9zdGVwSXNOYXZpZ2FibGUoaSwgc3RlcCkgPyBudWxsIDogdHJ1ZVwiXG4gICAgW2luZGV4XT1cImlcIlxuICAgIFtzdGF0ZV09XCJfZ2V0SW5kaWNhdG9yVHlwZShpLCBzdGVwLnN0YXRlKVwiXG4gICAgW2xhYmVsXT1cInN0ZXAuc3RlcExhYmVsIHx8IHN0ZXAubGFiZWxcIlxuICAgIFtzZWxlY3RlZF09XCJzZWxlY3RlZEluZGV4ID09PSBpXCJcbiAgICBbYWN0aXZlXT1cIl9zdGVwSXNOYXZpZ2FibGUoaSwgc3RlcClcIlxuICAgIFtvcHRpb25hbF09XCJzdGVwLm9wdGlvbmFsXCJcbiAgICBbZXJyb3JNZXNzYWdlXT1cInN0ZXAuZXJyb3JNZXNzYWdlXCJcbiAgICBbaWNvbk92ZXJyaWRlc109XCJfaWNvbk92ZXJyaWRlc1wiXG4gICAgW2Rpc2FibGVSaXBwbGVdPVwiZGlzYWJsZVJpcHBsZSB8fCAhX3N0ZXBJc05hdmlnYWJsZShpLCBzdGVwKVwiXG4gICAgW2NvbG9yXT1cInN0ZXAuY29sb3IgfHwgY29sb3JcIj48L21hdC1zdGVwLWhlYWRlcj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=
