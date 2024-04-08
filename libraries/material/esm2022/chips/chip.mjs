/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  Optional,
  Output,
  ViewEncapsulation,
  ViewChild,
  Attribute,
  ContentChildren,
  QueryList,
  inject,
  booleanAttribute,
  numberAttribute,
  ANIMATION_MODULE_TYPE,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MAT_RIPPLE_GLOBAL_OPTIONS, MatRippleLoader } from '@takkion/material/core';
import { FocusMonitor } from '@takkion/cdk/a11y';
import { merge, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatChipAvatar, MatChipTrailingIcon, MatChipRemove } from './chip-icons';
import { MatChipAction } from './chip-action';
import { BACKSPACE, DELETE } from '@takkion/cdk/keycodes';
import { MAT_CHIP, MAT_CHIP_AVATAR, MAT_CHIP_REMOVE, MAT_CHIP_TRAILING_ICON } from './tokens';
import * as i0 from '@angular/core';
import * as i1 from '@takkion/cdk/a11y';
let uid = 0;
/**
 * Material design styled Chip base component. Used inside the MatChipSet component.
 *
 * Extended by MatChipOption and MatChipRow for different interaction patterns.
 */
export class MatChip {
  _hasFocus() {
    return this._hasFocusInternal;
  }
  /**
   * The value of the chip. Defaults to the content inside
   * the `mat-mdc-chip-action-label` element.
   */
  get value() {
    return this._value !== undefined ? this._value : this._textElement.textContent.trim();
  }
  set value(value) {
    this._value = value;
  }
  /**
   * Reference to the MatRipple instance of the chip.
   * @deprecated Considered an implementation detail. To be removed.
   * @breaking-change 17.0.0
   */
  get ripple() {
    return this._rippleLoader?.getRipple(this._elementRef.nativeElement);
  }
  set ripple(v) {
    this._rippleLoader?.attachRipple(this._elementRef.nativeElement, v);
  }
  constructor(
    _changeDetectorRef,
    _elementRef,
    _ngZone,
    _focusMonitor,
    _document,
    animationMode,
    _globalRippleOptions,
    tabIndex
  ) {
    this._changeDetectorRef = _changeDetectorRef;
    this._elementRef = _elementRef;
    this._ngZone = _ngZone;
    this._focusMonitor = _focusMonitor;
    this._globalRippleOptions = _globalRippleOptions;
    /** Emits when the chip is focused. */
    this._onFocus = new Subject();
    /** Emits when the chip is blurred. */
    this._onBlur = new Subject();
    /** Role for the root of the chip. */
    this.role = null;
    /** Whether the chip has focus. */
    this._hasFocusInternal = false;
    /** A unique id for the chip. If none is supplied, it will be auto-generated. */
    this.id = `mat-mdc-chip-${uid++}`;
    // TODO(#26104): Consider deprecating and using `_computeAriaAccessibleName` instead.
    // `ariaLabel` may be unnecessary, and `_computeAriaAccessibleName` only supports
    // datepicker's use case.
    /** ARIA label for the content of the chip. */
    this.ariaLabel = null;
    // TODO(#26104): Consider deprecating and using `_computeAriaAccessibleName` instead.
    // `ariaDescription` may be unnecessary, and `_computeAriaAccessibleName` only supports
    // datepicker's use case.
    /** ARIA description for the content of the chip. */
    this.ariaDescription = null;
    /** Id of a span that contains this chip's aria description. */
    this._ariaDescriptionId = `${this.id}-aria-description`;
    /**
     * Determines whether or not the chip displays the remove styling and emits (removed) events.
     */
    this.removable = true;
    /**
     * Colors the chip for emphasis as if it were selected.
     */
    this.highlighted = false;
    /** Whether the ripple effect is disabled or not. */
    this.disableRipple = false;
    /** Whether the chip is disabled. */
    this.disabled = false;
    /** Tab index of the chip. */
    this.tabIndex = -1;
    /** Emitted when a chip is to be removed. */
    this.removed = new EventEmitter();
    /** Emitted when the chip is destroyed. */
    this.destroyed = new EventEmitter();
    /** The unstyled chip selector for this component. */
    this.basicChipAttrName = 'mat-basic-chip';
    /**
     * Handles the lazy creation of the MatChip ripple.
     * Used to improve initial load time of large applications.
     */
    this._rippleLoader = inject(MatRippleLoader);
    this._document = _document;
    this._animationsDisabled = animationMode === 'NoopAnimations';
    if (tabIndex != null) {
      this.tabIndex = parseInt(tabIndex) ?? -1;
    }
    this._monitorFocus();
    this._rippleLoader?.configureRipple(this._elementRef.nativeElement, {
      className: 'mat-mdc-chip-ripple',
      disabled: this._isRippleDisabled(),
    });
  }
  ngOnInit() {
    // This check needs to happen in `ngOnInit` so the overridden value of
    // `basicChipAttrName` coming from base classes can be picked up.
    const element = this._elementRef.nativeElement;
    this._isBasicChip =
      element.hasAttribute(this.basicChipAttrName) ||
      element.tagName.toLowerCase() === this.basicChipAttrName;
  }
  ngAfterViewInit() {
    this._textElement = this._elementRef.nativeElement.querySelector('.mat-mdc-chip-action-label');
    if (this._pendingFocus) {
      this._pendingFocus = false;
      this.focus();
    }
  }
  ngAfterContentInit() {
    // Since the styling depends on the presence of some
    // actions, we have to mark for check on changes.
    this._actionChanges = merge(
      this._allLeadingIcons.changes,
      this._allTrailingIcons.changes,
      this._allRemoveIcons.changes
    ).subscribe(() => this._changeDetectorRef.markForCheck());
  }
  ngDoCheck() {
    this._rippleLoader.setDisabled(this._elementRef.nativeElement, this._isRippleDisabled());
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._rippleLoader?.destroyRipple(this._elementRef.nativeElement);
    this._actionChanges?.unsubscribe();
    this.destroyed.emit({ chip: this });
    this.destroyed.complete();
  }
  /**
   * Allows for programmatic removal of the chip.
   *
   * Informs any listeners of the removal request. Does not remove the chip from the DOM.
   */
  remove() {
    if (this.removable) {
      this.removed.emit({ chip: this });
    }
  }
  /** Whether or not the ripple should be disabled. */
  _isRippleDisabled() {
    return (
      this.disabled ||
      this.disableRipple ||
      this._animationsDisabled ||
      this._isBasicChip ||
      !!this._globalRippleOptions?.disabled
    );
  }
  /** Returns whether the chip has a trailing icon. */
  _hasTrailingIcon() {
    return !!(this.trailingIcon || this.removeIcon);
  }
  /** Handles keyboard events on the chip. */
  _handleKeydown(event) {
    if (event.keyCode === BACKSPACE || event.keyCode === DELETE) {
      event.preventDefault();
      this.remove();
    }
  }
  /** Allows for programmatic focusing of the chip. */
  focus() {
    if (!this.disabled) {
      // If `focus` is called before `ngAfterViewInit`, we won't have access to the primary action.
      // This can happen if the consumer tries to focus a chip immediately after it is added.
      // Queue the method to be called again on init.
      if (this.primaryAction) {
        this.primaryAction.focus();
      } else {
        this._pendingFocus = true;
      }
    }
  }
  /** Gets the action that contains a specific target node. */
  _getSourceAction(target) {
    return this._getActions().find(action => {
      const element = action._elementRef.nativeElement;
      return element === target || element.contains(target);
    });
  }
  /** Gets all of the actions within the chip. */
  _getActions() {
    const result = [];
    if (this.primaryAction) {
      result.push(this.primaryAction);
    }
    if (this.removeIcon) {
      result.push(this.removeIcon);
    }
    if (this.trailingIcon) {
      result.push(this.trailingIcon);
    }
    return result;
  }
  /** Handles interactions with the primary action of the chip. */
  _handlePrimaryActionInteraction() {
    // Empty here, but is overwritten in child classes.
  }
  /** Gets the tabindex of the chip. */
  _getTabIndex() {
    if (!this.role) {
      return null;
    }
    return this.disabled ? -1 : this.tabIndex;
  }
  /** Starts the focus monitoring process on the chip. */
  _monitorFocus() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe(origin => {
      const hasFocus = origin !== null;
      if (hasFocus !== this._hasFocusInternal) {
        this._hasFocusInternal = hasFocus;
        if (hasFocus) {
          this._onFocus.next({ chip: this });
        } else {
          // When animations are enabled, Angular may end up removing the chip from the DOM a little
          // earlier than usual, causing it to be blurred and throwing off the logic in the chip list
          // that moves focus not the next item. To work around the issue, we defer marking the chip
          // as not focused until the next time the zone stabilizes.
          this._ngZone.onStable
            .pipe(take(1))
            .subscribe(() => this._ngZone.run(() => this._onBlur.next({ chip: this })));
        }
      }
    });
  }
  static {
    this.ɵfac = i0.ɵɵngDeclareFactory({
      minVersion: '12.0.0',
      version: '17.2.0',
      ngImport: i0,
      type: MatChip,
      deps: [
        { token: i0.ChangeDetectorRef },
        { token: i0.ElementRef },
        { token: i0.NgZone },
        { token: i1.FocusMonitor },
        { token: DOCUMENT },
        { token: ANIMATION_MODULE_TYPE, optional: true },
        { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true },
        { token: 'tabindex', attribute: true },
      ],
      target: i0.ɵɵFactoryTarget.Component,
    });
  }
  static {
    this.ɵcmp = i0.ɵɵngDeclareComponent({
      minVersion: '17.0.0',
      version: '17.2.0',
      type: MatChip,
      isStandalone: true,
      selector: 'mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]',
      inputs: {
        role: 'role',
        id: 'id',
        ariaLabel: ['aria-label', 'ariaLabel'],
        ariaDescription: ['aria-description', 'ariaDescription'],
        value: 'value',
        color: 'color',
        removable: ['removable', 'removable', booleanAttribute],
        highlighted: ['highlighted', 'highlighted', booleanAttribute],
        disableRipple: ['disableRipple', 'disableRipple', booleanAttribute],
        disabled: ['disabled', 'disabled', booleanAttribute],
        tabIndex: [
          'tabIndex',
          'tabIndex',
          value => (value == null ? undefined : numberAttribute(value)),
        ],
      },
      outputs: { removed: 'removed', destroyed: 'destroyed' },
      host: {
        listeners: { keydown: '_handleKeydown($event)' },
        properties: {
          class: '"mat-" + (color || "primary")',
          'class.mdc-evolution-chip': '!_isBasicChip',
          'class.mdc-evolution-chip--disabled': 'disabled',
          'class.mdc-evolution-chip--with-trailing-action': '_hasTrailingIcon()',
          'class.mdc-evolution-chip--with-primary-graphic': 'leadingIcon',
          'class.mdc-evolution-chip--with-primary-icon': 'leadingIcon',
          'class.mdc-evolution-chip--with-avatar': 'leadingIcon',
          'class.mat-mdc-chip-with-avatar': 'leadingIcon',
          'class.mat-mdc-chip-highlighted': 'highlighted',
          'class.mat-mdc-chip-disabled': 'disabled',
          'class.mat-mdc-basic-chip': '_isBasicChip',
          'class.mat-mdc-standard-chip': '!_isBasicChip',
          'class.mat-mdc-chip-with-trailing-icon': '_hasTrailingIcon()',
          'class._mat-animation-noopable': '_animationsDisabled',
          id: 'id',
          'attr.role': 'role',
          'attr.tabindex': '_getTabIndex()',
          'attr.aria-label': 'ariaLabel',
        },
        classAttribute: 'mat-mdc-chip',
      },
      providers: [{ provide: MAT_CHIP, useExisting: MatChip }],
      queries: [
        { propertyName: 'leadingIcon', first: true, predicate: MAT_CHIP_AVATAR, descendants: true },
        {
          propertyName: 'trailingIcon',
          first: true,
          predicate: MAT_CHIP_TRAILING_ICON,
          descendants: true,
        },
        { propertyName: 'removeIcon', first: true, predicate: MAT_CHIP_REMOVE, descendants: true },
        { propertyName: '_allLeadingIcons', predicate: MAT_CHIP_AVATAR, descendants: true },
        { propertyName: '_allTrailingIcons', predicate: MAT_CHIP_TRAILING_ICON, descendants: true },
        { propertyName: '_allRemoveIcons', predicate: MAT_CHIP_REMOVE, descendants: true },
      ],
      viewQueries: [
        { propertyName: 'primaryAction', first: true, predicate: MatChipAction, descendants: true },
      ],
      exportAs: ['matChip'],
      ngImport: i0,
      template:
        '<span class="mat-mdc-chip-focus-overlay"></span>\n\n<span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary">\n  <span matChipAction [isInteractive]="false">\n    @if (leadingIcon) {\n      <span class="mdc-evolution-chip__graphic mat-mdc-chip-graphic">\n        <ng-content select="mat-chip-avatar, [matChipAvatar]"></ng-content>\n      </span>\n    }\n    <span class="mdc-evolution-chip__text-label mat-mdc-chip-action-label">\n      <ng-content></ng-content>\n      <span class="mat-mdc-chip-primary-focus-indicator mat-mdc-focus-indicator"></span>\n    </span>\n  </span>\n</span>\n\n@if (_hasTrailingIcon()) {\n  <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--trailing">\n    <ng-content select="mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]"></ng-content>\n  </span>\n}\n',
      styles: [
        '.mdc-evolution-chip,.mdc-evolution-chip__cell,.mdc-evolution-chip__action{display:inline-flex;align-items:center}.mdc-evolution-chip{position:relative;max-width:100%}.mdc-evolution-chip .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-evolution-chip__cell,.mdc-evolution-chip__action{height:100%}.mdc-evolution-chip__cell--primary{overflow-x:hidden}.mdc-evolution-chip__cell--trailing{flex:1 0 auto}.mdc-evolution-chip__action{align-items:center;background:none;border:none;box-sizing:content-box;cursor:pointer;display:inline-flex;justify-content:center;outline:none;padding:0;text-decoration:none;color:inherit}.mdc-evolution-chip__action--presentational{cursor:auto}.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{pointer-events:none}.mdc-evolution-chip__action--primary{overflow-x:hidden}.mdc-evolution-chip__action--trailing{position:relative;overflow:visible}.mdc-evolution-chip__action--primary:before{box-sizing:border-box;content:"";height:100%;left:0;position:absolute;pointer-events:none;top:0;width:100%;z-index:1}.mdc-evolution-chip--touch{margin-top:8px;margin-bottom:8px}.mdc-evolution-chip__action-touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}.mdc-evolution-chip__text-label{white-space:nowrap;user-select:none;text-overflow:ellipsis;overflow:hidden}.mdc-evolution-chip__graphic{align-items:center;display:inline-flex;justify-content:center;overflow:hidden;pointer-events:none;position:relative;flex:1 0 auto}.mdc-evolution-chip__checkmark{position:absolute;opacity:0;top:50%;left:50%}.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic{width:0}.mdc-evolution-chip__checkmark-background{opacity:0}.mdc-evolution-chip__checkmark-svg{display:block}.mdc-evolution-chip__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385;stroke-dashoffset:29.7833385;stroke:currentColor}.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic{transition:width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark{transition:transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__graphic{transition:width 100ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__checkmark{transition:opacity 50ms 0ms linear,transform 100ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}.mdc-evolution-chip--selecting-with-primary-icon .mdc-evolution-chip__icon--primary{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selecting-with-primary-icon .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__icon--primary{transition:opacity 150ms 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__checkmark{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-50%, -50%)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary{opacity:0}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{transform:translate(-50%, -50%);opacity:1}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}@keyframes mdc-evolution-chip-enter{from{transform:scale(0.8);opacity:.4}to{transform:scale(1);opacity:1}}.mdc-evolution-chip--enter{animation:mdc-evolution-chip-enter 100ms 0ms cubic-bezier(0, 0, 0.2, 1)}@keyframes mdc-evolution-chip-exit{from{opacity:1}to{opacity:0}}.mdc-evolution-chip--exit{animation:mdc-evolution-chip-exit 75ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-evolution-chip--hidden{opacity:0;pointer-events:none;transition:width 150ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mat-mdc-standard-chip{border-radius:var(--mdc-chip-container-shape-radius);height:var(--mdc-chip-container-height)}.mat-mdc-standard-chip .mdc-evolution-chip__ripple{border-radius:var(--mdc-chip-container-shape-radius)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:before{border-radius:var(--mdc-chip-container-shape-radius)}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{border-radius:var(--mdc-chip-with-avatar-avatar-shape-radius)}.mat-mdc-standard-chip.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--with-primary-icon){--mdc-chip-graphic-selected-width:var(--mdc-chip-with-avatar-avatar-size)}.mat-mdc-standard-chip .mdc-evolution-chip__graphic{height:var(--mdc-chip-with-avatar-avatar-size);width:var(--mdc-chip-with-avatar-avatar-size);font-size:var(--mdc-chip-with-avatar-avatar-size)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--primary:before{border-color:var(--mdc-chip-outline-color)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:not(.mdc-evolution-chip__action--presentational).mdc-ripple-upgraded--background-focused:before,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:not(.mdc-evolution-chip__action--presentational):not(.mdc-ripple-upgraded):focus:before{border-color:var(--mdc-chip-focus-outline-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--primary:before{border-color:var(--mdc-chip-disabled-outline-color)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:before{border-width:var(--mdc-chip-outline-width)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary:before{border-width:var(--mdc-chip-flat-selected-outline-width)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--mdc-chip-elevated-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled){background-color:var(--mdc-chip-elevated-selected-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-flat-disabled-selected-container-color)}.mat-mdc-standard-chip .mdc-evolution-chip__text-label{font-family:var(--mdc-chip-label-text-font);line-height:var(--mdc-chip-label-text-line-height);font-size:var(--mdc-chip-label-text-size);font-weight:var(--mdc-chip-label-text-weight);letter-spacing:var(--mdc-chip-label-text-tracking)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mdc-chip-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mdc-chip-disabled-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mdc-chip-selected-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mdc-chip-disabled-label-text-color)}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{height:var(--mdc-chip-with-icon-icon-size);width:var(--mdc-chip-with-icon-icon-size);font-size:var(--mdc-chip-with-icon-icon-size)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary{color:var(--mdc-chip-with-icon-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary{color:var(--mdc-chip-with-icon-disabled-icon-color)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-selected-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-disabled-icon-color)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--trailing{color:var(--mdc-chip-with-trailing-icon-trailing-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mdc-chip-with-trailing-icon-disabled-trailing-icon-color)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary .mdc-evolution-chip__ripple::after{background-color:var(--mdc-chip-hover-state-layer-color)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:hover .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary.mdc-ripple-surface--hover .mdc-evolution-chip__ripple::before{opacity:var(--mdc-chip-hover-state-layer-opacity)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary.mdc-ripple-upgraded--background-focused .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:not(.mdc-ripple-upgraded):focus .mdc-evolution-chip__ripple::before{transition-duration:75ms;opacity:var(--mdc-chip-focus-state-layer-opacity)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary .mdc-evolution-chip__ripple::after{background-color:var(--mdc-chip-selected-hover-state-layer-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary:hover .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary.mdc-ripple-surface--hover .mdc-evolution-chip__ripple::before{opacity:var(--mdc-chip-selected-hover-state-layer-opacity)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary.mdc-ripple-upgraded--background-focused .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary:not(.mdc-ripple-upgraded):focus .mdc-evolution-chip__ripple::before{transition-duration:75ms;opacity:var(--mdc-chip-selected-focus-state-layer-opacity)}.mat-mdc-chip-focus-overlay{background:var(--mdc-chip-focus-state-layer-color)}.mat-mdc-chip-selected .mat-mdc-chip-focus-overlay{background:var(--mdc-chip-selected-focus-state-layer-color)}.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay{background:var(--mdc-chip-hover-state-layer-color);opacity:var(--mdc-chip-hover-state-layer-opacity)}.mat-mdc-chip-selected:hover .mat-mdc-chip-focus-overlay{background:var(--mdc-chip-selected-hover-state-layer-color);opacity:var(--mdc-chip-selected-hover-state-layer-opacity)}.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mdc-chip-focus-state-layer-color);opacity:var(--mdc-chip-focus-state-layer-opacity)}.mat-mdc-chip-selected.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mdc-chip-selected-focus-state-layer-color);opacity:var(--mdc-chip-selected-focus-state-layer-opacity)}.mdc-evolution-chip--disabled:not(.mdc-evolution-chip--selected) .mat-mdc-chip-avatar{opacity:var(--mdc-chip-with-avatar-disabled-avatar-opacity)}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{opacity:var(--mdc-chip-with-trailing-icon-disabled-trailing-icon-opacity)}.mdc-evolution-chip--disabled.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{opacity:var(--mdc-chip-with-icon-disabled-icon-opacity)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{opacity:var(--mat-chip-disabled-container-opacity)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-trailing-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-disabled-trailing-icon-color)}.mat-mdc-chip-remove{opacity:var(--mat-chip-trailing-action-opacity)}.mat-mdc-chip-remove:focus{opacity:var(--mat-chip-trailing-action-focus-opacity)}.mat-mdc-chip-remove::after{background:var(--mat-chip-trailing-action-state-layer-color)}.mat-mdc-chip-remove:hover::after{opacity:var(--mat-chip-trailing-action-hover-state-layer-opacity)}.mat-mdc-chip-remove:focus::after{opacity:var(--mat-chip-trailing-action-focus-state-layer-opacity)}.mat-mdc-chip-selected .mat-mdc-chip-remove::after{background:var(--mat-chip-selected-trailing-action-state-layer-color)}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove{opacity:calc(var(--mat-chip-trailing-action-opacity)*var(--mdc-chip-with-trailing-icon-disabled-trailing-icon-opacity))}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove:focus{opacity:calc(var(--mat-chip-trailing-action-focus-opacity)*var(--mdc-chip-with-trailing-icon-disabled-trailing-icon-opacity))}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:before{border-style:solid}.mat-mdc-standard-chip .mdc-evolution-chip__checkmark{height:20px;width:20px}.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing{height:18px;width:18px;font-size:18px}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic[dir=rtl]{padding-left:6px;padding-right:6px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic[dir=rtl]{padding-left:6px;padding-right:6px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic[dir=rtl]{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic[dir=rtl]{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:0}.mat-mdc-standard-chip{-webkit-tap-highlight-color:rgba(0,0,0,0)}.cdk-high-contrast-active .mat-mdc-standard-chip{outline:solid 1px}.cdk-high-contrast-active .mat-mdc-standard-chip .mdc-evolution-chip__checkmark-path{stroke:CanvasText !important}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mat-mdc-chip-action-label{overflow:visible}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary{flex-basis:100%}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{font:inherit;letter-spacing:inherit;white-space:inherit}.mat-mdc-standard-chip .mat-mdc-chip-graphic,.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon{box-sizing:content-box}.mat-mdc-standard-chip._mat-animation-noopable,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path{transition-duration:1ms;animation-duration:1ms}.mat-mdc-basic-chip .mdc-evolution-chip__action--primary{font:inherit}.mat-mdc-chip-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;opacity:0;border-radius:inherit;transition:opacity 150ms linear}._mat-animation-noopable .mat-mdc-chip-focus-overlay{transition:none}.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay{display:none}.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-chip-avatar{text-align:center;line-height:1;color:var(--mdc-chip-with-icon-icon-color, currentColor)}.mat-mdc-chip{position:relative;z-index:0}.mat-mdc-chip-action-label{text-align:left;z-index:1}[dir=rtl] .mat-mdc-chip-action-label{text-align:right}.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label{position:relative}.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}.mat-mdc-chip-action-label .mat-mdc-focus-indicator::before{margin:calc(calc(var(--mat-mdc-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-chip-remove::before{margin:calc(var(--mat-mdc-focus-indicator-border-width, 3px)*-1);left:8px;right:8px}.mat-mdc-chip-remove::after{content:"";display:block;opacity:0;position:absolute;top:-2px;bottom:-2px;left:6px;right:6px;border-radius:50%}.mat-mdc-chip-remove .mat-icon{width:inherit;height:inherit;font-size:inherit;box-sizing:content-box}.mat-chip-edit-input{cursor:text;display:inline-block;color:inherit;outline:0}.cdk-high-contrast-active .mat-mdc-chip-selected:not(.mat-mdc-chip-multiple){outline-width:3px}.mat-mdc-chip-action:focus .mat-mdc-focus-indicator::before{content:""}',
      ],
      dependencies: [
        {
          kind: 'directive',
          type: MatChipAction,
          selector: '[matChipAction]',
          inputs: ['isInteractive', 'disabled', 'tabIndex', '_allowFocusWhenDisabled'],
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
  type: MatChip,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]',
          exportAs: 'matChip',
          host: {
            class: 'mat-mdc-chip',
            '[class]': '"mat-" + (color || "primary")',
            '[class.mdc-evolution-chip]': '!_isBasicChip',
            '[class.mdc-evolution-chip--disabled]': 'disabled',
            '[class.mdc-evolution-chip--with-trailing-action]': '_hasTrailingIcon()',
            '[class.mdc-evolution-chip--with-primary-graphic]': 'leadingIcon',
            '[class.mdc-evolution-chip--with-primary-icon]': 'leadingIcon',
            '[class.mdc-evolution-chip--with-avatar]': 'leadingIcon',
            '[class.mat-mdc-chip-with-avatar]': 'leadingIcon',
            '[class.mat-mdc-chip-highlighted]': 'highlighted',
            '[class.mat-mdc-chip-disabled]': 'disabled',
            '[class.mat-mdc-basic-chip]': '_isBasicChip',
            '[class.mat-mdc-standard-chip]': '!_isBasicChip',
            '[class.mat-mdc-chip-with-trailing-icon]': '_hasTrailingIcon()',
            '[class._mat-animation-noopable]': '_animationsDisabled',
            '[id]': 'id',
            '[attr.role]': 'role',
            '[attr.tabindex]': '_getTabIndex()',
            '[attr.aria-label]': 'ariaLabel',
            '(keydown)': '_handleKeydown($event)',
          },
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          providers: [{ provide: MAT_CHIP, useExisting: MatChip }],
          standalone: true,
          imports: [MatChipAction],
          template:
            '<span class="mat-mdc-chip-focus-overlay"></span>\n\n<span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary">\n  <span matChipAction [isInteractive]="false">\n    @if (leadingIcon) {\n      <span class="mdc-evolution-chip__graphic mat-mdc-chip-graphic">\n        <ng-content select="mat-chip-avatar, [matChipAvatar]"></ng-content>\n      </span>\n    }\n    <span class="mdc-evolution-chip__text-label mat-mdc-chip-action-label">\n      <ng-content></ng-content>\n      <span class="mat-mdc-chip-primary-focus-indicator mat-mdc-focus-indicator"></span>\n    </span>\n  </span>\n</span>\n\n@if (_hasTrailingIcon()) {\n  <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--trailing">\n    <ng-content select="mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]"></ng-content>\n  </span>\n}\n',
          styles: [
            '.mdc-evolution-chip,.mdc-evolution-chip__cell,.mdc-evolution-chip__action{display:inline-flex;align-items:center}.mdc-evolution-chip{position:relative;max-width:100%}.mdc-evolution-chip .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-evolution-chip__cell,.mdc-evolution-chip__action{height:100%}.mdc-evolution-chip__cell--primary{overflow-x:hidden}.mdc-evolution-chip__cell--trailing{flex:1 0 auto}.mdc-evolution-chip__action{align-items:center;background:none;border:none;box-sizing:content-box;cursor:pointer;display:inline-flex;justify-content:center;outline:none;padding:0;text-decoration:none;color:inherit}.mdc-evolution-chip__action--presentational{cursor:auto}.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{pointer-events:none}.mdc-evolution-chip__action--primary{overflow-x:hidden}.mdc-evolution-chip__action--trailing{position:relative;overflow:visible}.mdc-evolution-chip__action--primary:before{box-sizing:border-box;content:"";height:100%;left:0;position:absolute;pointer-events:none;top:0;width:100%;z-index:1}.mdc-evolution-chip--touch{margin-top:8px;margin-bottom:8px}.mdc-evolution-chip__action-touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}.mdc-evolution-chip__text-label{white-space:nowrap;user-select:none;text-overflow:ellipsis;overflow:hidden}.mdc-evolution-chip__graphic{align-items:center;display:inline-flex;justify-content:center;overflow:hidden;pointer-events:none;position:relative;flex:1 0 auto}.mdc-evolution-chip__checkmark{position:absolute;opacity:0;top:50%;left:50%}.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic{width:0}.mdc-evolution-chip__checkmark-background{opacity:0}.mdc-evolution-chip__checkmark-svg{display:block}.mdc-evolution-chip__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385;stroke-dashoffset:29.7833385;stroke:currentColor}.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic{transition:width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark{transition:transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__graphic{transition:width 100ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__checkmark{transition:opacity 50ms 0ms linear,transform 100ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}.mdc-evolution-chip--selecting-with-primary-icon .mdc-evolution-chip__icon--primary{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selecting-with-primary-icon .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__icon--primary{transition:opacity 150ms 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__checkmark{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-50%, -50%)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary{opacity:0}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{transform:translate(-50%, -50%);opacity:1}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}@keyframes mdc-evolution-chip-enter{from{transform:scale(0.8);opacity:.4}to{transform:scale(1);opacity:1}}.mdc-evolution-chip--enter{animation:mdc-evolution-chip-enter 100ms 0ms cubic-bezier(0, 0, 0.2, 1)}@keyframes mdc-evolution-chip-exit{from{opacity:1}to{opacity:0}}.mdc-evolution-chip--exit{animation:mdc-evolution-chip-exit 75ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-evolution-chip--hidden{opacity:0;pointer-events:none;transition:width 150ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mat-mdc-standard-chip{border-radius:var(--mdc-chip-container-shape-radius);height:var(--mdc-chip-container-height)}.mat-mdc-standard-chip .mdc-evolution-chip__ripple{border-radius:var(--mdc-chip-container-shape-radius)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:before{border-radius:var(--mdc-chip-container-shape-radius)}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{border-radius:var(--mdc-chip-with-avatar-avatar-shape-radius)}.mat-mdc-standard-chip.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--with-primary-icon){--mdc-chip-graphic-selected-width:var(--mdc-chip-with-avatar-avatar-size)}.mat-mdc-standard-chip .mdc-evolution-chip__graphic{height:var(--mdc-chip-with-avatar-avatar-size);width:var(--mdc-chip-with-avatar-avatar-size);font-size:var(--mdc-chip-with-avatar-avatar-size)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--primary:before{border-color:var(--mdc-chip-outline-color)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:not(.mdc-evolution-chip__action--presentational).mdc-ripple-upgraded--background-focused:before,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:not(.mdc-evolution-chip__action--presentational):not(.mdc-ripple-upgraded):focus:before{border-color:var(--mdc-chip-focus-outline-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--primary:before{border-color:var(--mdc-chip-disabled-outline-color)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:before{border-width:var(--mdc-chip-outline-width)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary:before{border-width:var(--mdc-chip-flat-selected-outline-width)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--mdc-chip-elevated-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled){background-color:var(--mdc-chip-elevated-selected-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-flat-disabled-selected-container-color)}.mat-mdc-standard-chip .mdc-evolution-chip__text-label{font-family:var(--mdc-chip-label-text-font);line-height:var(--mdc-chip-label-text-line-height);font-size:var(--mdc-chip-label-text-size);font-weight:var(--mdc-chip-label-text-weight);letter-spacing:var(--mdc-chip-label-text-tracking)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mdc-chip-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mdc-chip-disabled-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mdc-chip-selected-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mdc-chip-disabled-label-text-color)}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{height:var(--mdc-chip-with-icon-icon-size);width:var(--mdc-chip-with-icon-icon-size);font-size:var(--mdc-chip-with-icon-icon-size)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary{color:var(--mdc-chip-with-icon-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary{color:var(--mdc-chip-with-icon-disabled-icon-color)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-selected-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-disabled-icon-color)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--trailing{color:var(--mdc-chip-with-trailing-icon-trailing-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mdc-chip-with-trailing-icon-disabled-trailing-icon-color)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary .mdc-evolution-chip__ripple::after{background-color:var(--mdc-chip-hover-state-layer-color)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:hover .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary.mdc-ripple-surface--hover .mdc-evolution-chip__ripple::before{opacity:var(--mdc-chip-hover-state-layer-opacity)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary.mdc-ripple-upgraded--background-focused .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:not(.mdc-ripple-upgraded):focus .mdc-evolution-chip__ripple::before{transition-duration:75ms;opacity:var(--mdc-chip-focus-state-layer-opacity)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary .mdc-evolution-chip__ripple::after{background-color:var(--mdc-chip-selected-hover-state-layer-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary:hover .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary.mdc-ripple-surface--hover .mdc-evolution-chip__ripple::before{opacity:var(--mdc-chip-selected-hover-state-layer-opacity)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary.mdc-ripple-upgraded--background-focused .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary:not(.mdc-ripple-upgraded):focus .mdc-evolution-chip__ripple::before{transition-duration:75ms;opacity:var(--mdc-chip-selected-focus-state-layer-opacity)}.mat-mdc-chip-focus-overlay{background:var(--mdc-chip-focus-state-layer-color)}.mat-mdc-chip-selected .mat-mdc-chip-focus-overlay{background:var(--mdc-chip-selected-focus-state-layer-color)}.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay{background:var(--mdc-chip-hover-state-layer-color);opacity:var(--mdc-chip-hover-state-layer-opacity)}.mat-mdc-chip-selected:hover .mat-mdc-chip-focus-overlay{background:var(--mdc-chip-selected-hover-state-layer-color);opacity:var(--mdc-chip-selected-hover-state-layer-opacity)}.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mdc-chip-focus-state-layer-color);opacity:var(--mdc-chip-focus-state-layer-opacity)}.mat-mdc-chip-selected.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mdc-chip-selected-focus-state-layer-color);opacity:var(--mdc-chip-selected-focus-state-layer-opacity)}.mdc-evolution-chip--disabled:not(.mdc-evolution-chip--selected) .mat-mdc-chip-avatar{opacity:var(--mdc-chip-with-avatar-disabled-avatar-opacity)}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{opacity:var(--mdc-chip-with-trailing-icon-disabled-trailing-icon-opacity)}.mdc-evolution-chip--disabled.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{opacity:var(--mdc-chip-with-icon-disabled-icon-opacity)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{opacity:var(--mat-chip-disabled-container-opacity)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-trailing-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-disabled-trailing-icon-color)}.mat-mdc-chip-remove{opacity:var(--mat-chip-trailing-action-opacity)}.mat-mdc-chip-remove:focus{opacity:var(--mat-chip-trailing-action-focus-opacity)}.mat-mdc-chip-remove::after{background:var(--mat-chip-trailing-action-state-layer-color)}.mat-mdc-chip-remove:hover::after{opacity:var(--mat-chip-trailing-action-hover-state-layer-opacity)}.mat-mdc-chip-remove:focus::after{opacity:var(--mat-chip-trailing-action-focus-state-layer-opacity)}.mat-mdc-chip-selected .mat-mdc-chip-remove::after{background:var(--mat-chip-selected-trailing-action-state-layer-color)}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove{opacity:calc(var(--mat-chip-trailing-action-opacity)*var(--mdc-chip-with-trailing-icon-disabled-trailing-icon-opacity))}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove:focus{opacity:calc(var(--mat-chip-trailing-action-focus-opacity)*var(--mdc-chip-with-trailing-icon-disabled-trailing-icon-opacity))}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:before{border-style:solid}.mat-mdc-standard-chip .mdc-evolution-chip__checkmark{height:20px;width:20px}.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing{height:18px;width:18px;font-size:18px}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic[dir=rtl]{padding-left:6px;padding-right:6px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic[dir=rtl]{padding-left:6px;padding-right:6px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic[dir=rtl]{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic[dir=rtl]{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:0}.mat-mdc-standard-chip{-webkit-tap-highlight-color:rgba(0,0,0,0)}.cdk-high-contrast-active .mat-mdc-standard-chip{outline:solid 1px}.cdk-high-contrast-active .mat-mdc-standard-chip .mdc-evolution-chip__checkmark-path{stroke:CanvasText !important}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mat-mdc-chip-action-label{overflow:visible}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary{flex-basis:100%}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{font:inherit;letter-spacing:inherit;white-space:inherit}.mat-mdc-standard-chip .mat-mdc-chip-graphic,.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon{box-sizing:content-box}.mat-mdc-standard-chip._mat-animation-noopable,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path{transition-duration:1ms;animation-duration:1ms}.mat-mdc-basic-chip .mdc-evolution-chip__action--primary{font:inherit}.mat-mdc-chip-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;opacity:0;border-radius:inherit;transition:opacity 150ms linear}._mat-animation-noopable .mat-mdc-chip-focus-overlay{transition:none}.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay{display:none}.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-chip-avatar{text-align:center;line-height:1;color:var(--mdc-chip-with-icon-icon-color, currentColor)}.mat-mdc-chip{position:relative;z-index:0}.mat-mdc-chip-action-label{text-align:left;z-index:1}[dir=rtl] .mat-mdc-chip-action-label{text-align:right}.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label{position:relative}.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}.mat-mdc-chip-action-label .mat-mdc-focus-indicator::before{margin:calc(calc(var(--mat-mdc-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-chip-remove::before{margin:calc(var(--mat-mdc-focus-indicator-border-width, 3px)*-1);left:8px;right:8px}.mat-mdc-chip-remove::after{content:"";display:block;opacity:0;position:absolute;top:-2px;bottom:-2px;left:6px;right:6px;border-radius:50%}.mat-mdc-chip-remove .mat-icon{width:inherit;height:inherit;font-size:inherit;box-sizing:content-box}.mat-chip-edit-input{cursor:text;display:inline-block;color:inherit;outline:0}.cdk-high-contrast-active .mat-mdc-chip-selected:not(.mat-mdc-chip-multiple){outline-width:3px}.mat-mdc-chip-action:focus .mat-mdc-focus-indicator::before{content:""}',
          ],
        },
      ],
    },
  ],
  ctorParameters: () => [
    { type: i0.ChangeDetectorRef },
    { type: i0.ElementRef },
    { type: i0.NgZone },
    { type: i1.FocusMonitor },
    {
      type: undefined,
      decorators: [
        {
          type: Inject,
          args: [DOCUMENT],
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
  ],
  propDecorators: {
    role: [
      {
        type: Input,
      },
    ],
    _allLeadingIcons: [
      {
        type: ContentChildren,
        args: [MAT_CHIP_AVATAR, { descendants: true }],
      },
    ],
    _allTrailingIcons: [
      {
        type: ContentChildren,
        args: [MAT_CHIP_TRAILING_ICON, { descendants: true }],
      },
    ],
    _allRemoveIcons: [
      {
        type: ContentChildren,
        args: [MAT_CHIP_REMOVE, { descendants: true }],
      },
    ],
    id: [
      {
        type: Input,
      },
    ],
    ariaLabel: [
      {
        type: Input,
        args: ['aria-label'],
      },
    ],
    ariaDescription: [
      {
        type: Input,
        args: ['aria-description'],
      },
    ],
    value: [
      {
        type: Input,
      },
    ],
    color: [
      {
        type: Input,
      },
    ],
    removable: [
      {
        type: Input,
        args: [{ transform: booleanAttribute }],
      },
    ],
    highlighted: [
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
    disabled: [
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
            transform: value => (value == null ? undefined : numberAttribute(value)),
          },
        ],
      },
    ],
    removed: [
      {
        type: Output,
      },
    ],
    destroyed: [
      {
        type: Output,
      },
    ],
    leadingIcon: [
      {
        type: ContentChild,
        args: [MAT_CHIP_AVATAR],
      },
    ],
    trailingIcon: [
      {
        type: ContentChild,
        args: [MAT_CHIP_TRAILING_ICON],
      },
    ],
    removeIcon: [
      {
        type: ContentChild,
        args: [MAT_CHIP_REMOVE],
      },
    ],
    primaryAction: [
      {
        type: ViewChild,
        args: [MatChipAction],
      },
    ],
  },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy9jaGlwLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoaXBzL2NoaXAuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBR0wsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsWUFBWSxFQUNaLFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUdULE1BQU0sRUFDTixnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLHFCQUFxQixHQUN0QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUVMLHlCQUF5QixFQUV6QixlQUFlLEdBQ2hCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBQ2xELE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwQyxPQUFPLEVBQUMsYUFBYSxFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMvRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDeEQsT0FBTyxFQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLHNCQUFzQixFQUFDLE1BQU0sVUFBVSxD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a0I7Z0JBWXJCLEtBQUs7c0JBRFIsS0FBSztnQkFXRyxLQUFLO3NCQUFiLEtBQUs7Z0JBTU4sU0FBUztzQkFEUixLQUFLO3VCQUFDLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFDO2dCQU9wQyxXQUFXO3NCQURWLEtBQUs7dUJBQUMsRUFBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUM7Z0JBS3BDLGFBQWE7c0JBRFosS0FBSzt1QkFBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQztnQkFLcEMsUUFBUTtzQkFEUCxLQUFLO3VCQUFDLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFDO2dCQU9wQyxRQUFRO3NCQUhQLEtBQUs7dUJBQUM7d0JBQ0wsU0FBUyxFQUFFLENBQUMsS0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUNwRjtnQkFJa0IsT0FBTztzQkFBekIsTUFBTTtnQkFHWSxTQUFTO3NCQUEzQixNQUFNO2dCQU13QixXQUFXO3NCQUF6QyxZQUFZO3VCQUFDLGVBQWU7Z0JBR1MsWUFBWTtzQkFBakQsWUFBWTt1QkFBQyxzQkFBc0I7Z0JBR0wsVUFBVTtzQkFBeEMsWUFBWTt1QkFBQyxlQUFlO2dCQWVILGFBQWE7c0JBQXRDLFNBQVM7dUJBQUMsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBDb21wb25lbnQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29udGVudENoaWxkLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgVmlld0NoaWxkLFxuICBBdHRyaWJ1dGUsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgUXVlcnlMaXN0LFxuICBPbkluaXQsXG4gIERvQ2hlY2ssXG4gIGluamVjdCxcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgbnVtYmVyQXR0cmlidXRlLFxuICBBTklNQVRJT05fTU9EVUxFX1RZUEUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIE1hdFJpcHBsZSxcbiAgTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUyxcbiAgUmlwcGxlR2xvYmFsT3B0aW9ucyxcbiAgTWF0UmlwcGxlTG9hZGVyLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Rm9jdXNNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge21lcmdlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdENoaXBBdmF0YXIsIE1hdENoaXBUcmFpbGluZ0ljb24sIE1hdENoaXBSZW1vdmV9IGZyb20gJy4vY2hpcC1pY29ucyc7XG5pbXBvcnQge01hdENoaXBBY3Rpb259IGZyb20gJy4vY2hpcC1hY3Rpb24nO1xuaW1wb3J0IHtCQUNLU1BBQ0UsIERFTEVURX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7TUFUX0NISVAsIE1BVF9DSElQX0FWQVRBUiwgTUFUX0NISVBfUkVNT1ZFLCBNQVRfQ0hJUF9UUkFJTElOR19JQ09OfSBmcm9tICcuL3Rva2Vucyc7XG5cbmxldCB1aWQgPSAwO1xuXG4vKiogUmVwcmVzZW50cyBhbiBldmVudCBmaXJlZCBvbiBhbiBpbmRpdmlkdWFsIGBtYXQtY2hpcGAuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdENoaXBFdmVudCB7XG4gIC8qKiBUaGUgY2hpcCB0aGUgZXZlbnQgd2FzIGZpcmVkIG9uLiAqL1xuICBjaGlwOiBNYXRDaGlwO1xufVxuXG4vKipcbiAqIE1hdGVyaWFsIGRlc2lnbiBzdHlsZWQgQ2hpcCBiYXNlIGNvbXBvbmVudC4gVXNlZCBpbnNpZGUgdGhlIE1hdENoaXBTZXQgY29tcG9uZW50LlxuICpcbiAqIEV4dGVuZGVkIGJ5IE1hdENoaXBPcHRpb24gYW5kIE1hdENoaXBSb3cgZm9yIGRpZmZlcmVudCBpbnRlcmFjdGlvbiBwYXR0ZXJucy5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWJhc2ljLWNoaXAsIFttYXQtYmFzaWMtY2hpcF0sIG1hdC1jaGlwLCBbbWF0LWNoaXBdJyxcbiAgZXhwb3J0QXM6ICdtYXRDaGlwJyxcbiAgdGVtcGxhdGVVcmw6ICdjaGlwLmh0bWwnLFxuICBzdHlsZVVybDogJ2NoaXAuY3NzJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbWRjLWNoaXAnLFxuICAgICdbY2xhc3NdJzogJ1wibWF0LVwiICsgKGNvbG9yIHx8IFwicHJpbWFyeVwiKScsXG4gICAgJ1tjbGFzcy5tZGMtZXZvbHV0aW9uLWNoaXBdJzogJyFfaXNCYXNpY0NoaXAnLFxuICAgICdbY2xhc3MubWRjLWV2b2x1dGlvbi1jaGlwLS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWRjLWV2b2x1dGlvbi1jaGlwLS13aXRoLXRyYWlsaW5nLWFjdGlvbl0nOiAnX2hhc1RyYWlsaW5nSWNvbigpJyxcbiAgICAnW2NsYXNzLm1kYy1ldm9sdXRpb24tY2hpcC0td2l0aC1wcmltYXJ5LWdyYXBoaWNdJzogJ2xlYWRpbmdJY29uJyxcbiAgICAnW2NsYXNzLm1kYy1ldm9sdXRpb24tY2hpcC0td2l0aC1wcmltYXJ5LWljb25dJzogJ2xlYWRpbmdJY29uJyxcbiAgICAnW2NsYXNzLm1kYy1ldm9sdXRpb24tY2hpcC0td2l0aC1hdmF0YXJdJzogJ2xlYWRpbmdJY29uJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtY2hpcC13aXRoLWF2YXRhcl0nOiAnbGVhZGluZ0ljb24nLFxuICAgICdbY2xhc3MubWF0LW1kYy1jaGlwLWhpZ2hsaWdodGVkXSc6ICdoaWdobGlnaHRlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLWNoaXAtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtYmFzaWMtY2hpcF0nOiAnX2lzQmFzaWNDaGlwJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtc3RhbmRhcmQtY2hpcF0nOiAnIV9pc0Jhc2ljQ2hpcCcsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLWNoaXAtd2l0aC10cmFpbGluZy1pY29uXSc6ICdfaGFzVHJhaWxpbmdJY29uKCknLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25zRGlzYWJsZWQnLFxuICAgICdbaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIucm9sZV0nOiAncm9sZScsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdfZ2V0VGFiSW5kZXgoKScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ2FyaWFMYWJlbCcsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfQ0hJUCwgdXNlRXhpc3Rpbmc6IE1hdENoaXB9XSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW01hdENoaXBBY3Rpb25dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwIGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBBZnRlckNvbnRlbnRJbml0LCBEb0NoZWNrLCBPbkRlc3Ryb3kge1xuICBwcm90ZWN0ZWQgX2RvY3VtZW50OiBEb2N1bWVudDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY2hpcCBpcyBmb2N1c2VkLiAqL1xuICByZWFkb25seSBfb25Gb2N1cyA9IG5ldyBTdWJqZWN0PE1hdENoaXBFdmVudD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY2hpcCBpcyBibHVycmVkLiAqL1xuICByZWFkb25seSBfb25CbHVyID0gbmV3IFN1YmplY3Q8TWF0Q2hpcEV2ZW50PigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgY2hpcCBpcyBhIGJhc2ljICh1bnN0eWxlZCkgY2hpcC4gKi9cbiAgX2lzQmFzaWNDaGlwOiBib29sZWFuO1xuXG4gIC8qKiBSb2xlIGZvciB0aGUgcm9vdCBvZiB0aGUgY2hpcC4gKi9cbiAgQElucHV0KCkgcm9sZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgaGFzIGZvY3VzLiAqL1xuICBwcml2YXRlIF9oYXNGb2N1c0ludGVybmFsID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgbW92aW5nIGZvY3VzIGludG8gdGhlIGNoaXAgaXMgcGVuZGluZy4gKi9cbiAgcHJpdmF0ZSBfcGVuZGluZ0ZvY3VzOiBib29sZWFuO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gY2hhbmdlcyBpbiB0aGUgY2hpcCdzIGFjdGlvbnMuICovXG4gIHByaXZhdGUgX2FjdGlvbkNoYW5nZXM6IFN1YnNjcmlwdGlvbiB8IHVuZGVmaW5lZDtcblxuICAvKiogV2hldGhlciBhbmltYXRpb25zIGZvciB0aGUgY2hpcCBhcmUgZW5hYmxlZC4gKi9cbiAgX2FuaW1hdGlvbnNEaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKiogQWxsIGF2YXRhcnMgcHJlc2VudCBpbiB0aGUgY2hpcC4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNQVRfQ0hJUF9BVkFUQVIsIHtkZXNjZW5kYW50czogdHJ1ZX0pXG4gIHByb3RlY3RlZCBfYWxsTGVhZGluZ0ljb25zOiBRdWVyeUxpc3Q8TWF0Q2hpcEF2YXRhcj47XG5cbiAgLyoqIEFsbCB0cmFpbGluZyBpY29ucyBwcmVzZW50IGluIHRoZSBjaGlwLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1BVF9DSElQX1RSQUlMSU5HX0lDT04sIHtkZXNjZW5kYW50czogdHJ1ZX0pXG4gIHByb3RlY3RlZCBfYWxsVHJhaWxpbmdJY29uczogUXVlcnlMaXN0PE1hdENoaXBUcmFpbGluZ0ljb24+O1xuXG4gIC8qKiBBbGwgcmVtb3ZlIGljb25zIHByZXNlbnQgaW4gdGhlIGNoaXAuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTUFUX0NISVBfUkVNT1ZFLCB7ZGVzY2VuZGFudHM6IHRydWV9KVxuICBwcm90ZWN0ZWQgX2FsbFJlbW92ZUljb25zOiBRdWVyeUxpc3Q8TWF0Q2hpcFJlbW92ZT47XG5cbiAgX2hhc0ZvY3VzKCkge1xuICAgIHJldHVybiB0aGlzLl9oYXNGb2N1c0ludGVybmFsO1xuICB9XG5cbiAgLyoqIEEgdW5pcXVlIGlkIGZvciB0aGUgY2hpcC4gSWYgbm9uZSBpcyBzdXBwbGllZCwgaXQgd2lsbCBiZSBhdXRvLWdlbmVyYXRlZC4gKi9cbiAgQElucHV0KCkgaWQ6IHN0cmluZyA9IGBtYXQtbWRjLWNoaXAtJHt1aWQrK31gO1xuXG4gIC8vIFRPRE8oIzI2MTA0KTogQ29uc2lkZXIgZGVwcmVjYXRpbmcgYW5kIHVzaW5nIGBfY29tcHV0ZUFyaWFBY2Nlc3NpYmxlTmFtZWAgaW5zdGVhZC5cbiAgLy8gYGFyaWFMYWJlbGAgbWF5IGJlIHVubmVjZXNzYXJ5LCBhbmQgYF9jb21wdXRlQXJpYUFjY2Vzc2libGVOYW1lYCBvbmx5IHN1cHBvcnRzXG4gIC8vIGRhdGVwaWNrZXIncyB1c2UgY2FzZS5cbiAgLyoqIEFSSUEgbGFiZWwgZm9yIHRoZSBjb250ZW50IG9mIHRoZSBjaGlwLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8vIFRPRE8oIzI2MTA0KTogQ29uc2lkZXIgZGVwcmVjYXRpbmcgYW5kIHVzaW5nIGBfY29tcHV0ZUFyaWFBY2Nlc3NpYmxlTmFtZWAgaW5zdGVhZC5cbiAgLy8gYGFyaWFEZXNjcmlwdGlvbmAgbWF5IGJlIHVubmVjZXNzYXJ5LCBhbmQgYF9jb21wdXRlQXJpYUFjY2Vzc2libGVOYW1lYCBvbmx5IHN1cHBvcnRzXG4gIC8vIGRhdGVwaWNrZXIncyB1c2UgY2FzZS5cbiAgLyoqIEFSSUEgZGVzY3JpcHRpb24gZm9yIHRoZSBjb250ZW50IG9mIHRoZSBjaGlwLiAqL1xuICBASW5wdXQoJ2FyaWEtZGVzY3JpcHRpb24nKSBhcmlhRGVzY3JpcHRpb246IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBJZCBvZiBhIHNwYW4gdGhhdCBjb250YWlucyB0aGlzIGNoaXAncyBhcmlhIGRlc2NyaXB0aW9uLiAqL1xuICBfYXJpYURlc2NyaXB0aW9uSWQgPSBgJHt0aGlzLmlkfS1hcmlhLWRlc2NyaXB0aW9uYDtcblxuICBwcml2YXRlIF90ZXh0RWxlbWVudCE6IEhUTUxFbGVtZW50O1xuXG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgb2YgdGhlIGNoaXAuIERlZmF1bHRzIHRvIHRoZSBjb250ZW50IGluc2lkZVxuICAgKiB0aGUgYG1hdC1tZGMtY2hpcC1hY3Rpb24tbGFiZWxgIGVsZW1lbnQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWUgIT09IHVuZGVmaW5lZCA/IHRoaXMuX3ZhbHVlIDogdGhpcy5fdGV4dEVsZW1lbnQudGV4dENvbnRlbnQhLnRyaW0oKTtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gIH1cbiAgcHJvdGVjdGVkIF92YWx1ZTogYW55O1xuXG4gIC8vIFRPRE86IHNob3VsZCBiZSB0eXBlZCBhcyBgVGhlbWVQYWxldHRlYCBidXQgaW50ZXJuYWwgYXBwcyBwYXNzIGluIGFyYml0cmFyeSBzdHJpbmdzLlxuICAvKiogVGhlbWUgY29sb3IgcGFsZXR0ZSBvZiB0aGUgY2hpcC4gKi9cbiAgQElucHV0KCkgY29sb3I/OiBzdHJpbmcgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBjaGlwIGRpc3BsYXlzIHRoZSByZW1vdmUgc3R5bGluZyBhbmQgZW1pdHMgKHJlbW92ZWQpIGV2ZW50cy5cbiAgICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgcmVtb3ZhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKipcbiAgICogQ29sb3JzIHRoZSBjaGlwIGZvciBlbXBoYXNpcyBhcyBpZiBpdCB3ZXJlIHNlbGVjdGVkLlxuICAgKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBoaWdobGlnaHRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByaXBwbGUgZWZmZWN0IGlzIGRpc2FibGVkIG9yIG5vdC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBkaXNhYmxlUmlwcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGFiIGluZGV4IG9mIHRoZSBjaGlwLiAqL1xuICBASW5wdXQoe1xuICAgIHRyYW5zZm9ybTogKHZhbHVlOiB1bmtub3duKSA9PiAodmFsdWUgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG51bWJlckF0dHJpYnV0ZSh2YWx1ZSkpLFxuICB9KVxuICB0YWJJbmRleDogbnVtYmVyID0gLTE7XG5cbiAgLyoqIEVtaXR0ZWQgd2hlbiBhIGNoaXAgaXMgdG8gYmUgcmVtb3ZlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHJlbW92ZWQ6IEV2ZW50RW1pdHRlcjxNYXRDaGlwRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRDaGlwRXZlbnQ+KCk7XG5cbiAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgY2hpcCBpcyBkZXN0cm95ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkZXN0cm95ZWQ6IEV2ZW50RW1pdHRlcjxNYXRDaGlwRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRDaGlwRXZlbnQ+KCk7XG5cbiAgLyoqIFRoZSB1bnN0eWxlZCBjaGlwIHNlbGVjdG9yIGZvciB0aGlzIGNvbXBvbmVudC4gKi9cbiAgcHJvdGVjdGVkIGJhc2ljQ2hpcEF0dHJOYW1lID0gJ21hdC1iYXNpYy1jaGlwJztcblxuICAvKiogVGhlIGNoaXAncyBsZWFkaW5nIGljb24uICovXG4gIEBDb250ZW50Q2hpbGQoTUFUX0NISVBfQVZBVEFSKSBsZWFkaW5nSWNvbjogTWF0Q2hpcEF2YXRhcjtcblxuICAvKiogVGhlIGNoaXAncyB0cmFpbGluZyBpY29uLiAqL1xuICBAQ29udGVudENoaWxkKE1BVF9DSElQX1RSQUlMSU5HX0lDT04pIHRyYWlsaW5nSWNvbjogTWF0Q2hpcFRyYWlsaW5nSWNvbjtcblxuICAvKiogVGhlIGNoaXAncyB0cmFpbGluZyByZW1vdmUgaWNvbi4gKi9cbiAgQENvbnRlbnRDaGlsZChNQVRfQ0hJUF9SRU1PVkUpIHJlbW92ZUljb246IE1hdENoaXBSZW1vdmU7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgTWF0UmlwcGxlIGluc3RhbmNlIG9mIHRoZSBjaGlwLlxuICAgKiBAZGVwcmVjYXRlZCBDb25zaWRlcmVkIGFuIGltcGxlbWVudGF0aW9uIGRldGFpbC4gVG8gYmUgcmVtb3ZlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAgICovXG4gIGdldCByaXBwbGUoKTogTWF0UmlwcGxlIHtcbiAgICByZXR1cm4gdGhpcy5fcmlwcGxlTG9hZGVyPy5nZXRSaXBwbGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSE7XG4gIH1cbiAgc2V0IHJpcHBsZSh2OiBNYXRSaXBwbGUpIHtcbiAgICB0aGlzLl9yaXBwbGVMb2FkZXI/LmF0dGFjaFJpcHBsZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHYpO1xuICB9XG5cbiAgLyoqIEFjdGlvbiByZWNlaXZpbmcgdGhlIHByaW1hcnkgc2V0IG9mIHVzZXIgaW50ZXJhY3Rpb25zLiAqL1xuICBAVmlld0NoaWxkKE1hdENoaXBBY3Rpb24pIHByaW1hcnlBY3Rpb246IE1hdENoaXBBY3Rpb247XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlIGxhenkgY3JlYXRpb24gb2YgdGhlIE1hdENoaXAgcmlwcGxlLlxuICAgKiBVc2VkIHRvIGltcHJvdmUgaW5pdGlhbCBsb2FkIHRpbWUgb2YgbGFyZ2UgYXBwbGljYXRpb25zLlxuICAgKi9cbiAgX3JpcHBsZUxvYWRlcjogTWF0UmlwcGxlTG9hZGVyID0gaW5qZWN0KE1hdFJpcHBsZUxvYWRlcik7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcm90ZWN0ZWQgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudDogYW55LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TKVxuICAgIHByaXZhdGUgX2dsb2JhbFJpcHBsZU9wdGlvbnM/OiBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg/OiBzdHJpbmcsXG4gICkge1xuICAgIHRoaXMuX2RvY3VtZW50ID0gX2RvY3VtZW50O1xuICAgIHRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCA9IGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucyc7XG4gICAgaWYgKHRhYkluZGV4ICE9IG51bGwpIHtcbiAgICAgIHRoaXMudGFiSW5kZXggPSBwYXJzZUludCh0YWJJbmRleCkgPz8gLTE7XG4gICAgfVxuICAgIHRoaXMuX21vbml0b3JGb2N1cygpO1xuXG4gICAgdGhpcy5fcmlwcGxlTG9hZGVyPy5jb25maWd1cmVSaXBwbGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB7XG4gICAgICBjbGFzc05hbWU6ICdtYXQtbWRjLWNoaXAtcmlwcGxlJyxcbiAgICAgIGRpc2FibGVkOiB0aGlzLl9pc1JpcHBsZURpc2FibGVkKCksXG4gICAgfSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBUaGlzIGNoZWNrIG5lZWRzIHRvIGhhcHBlbiBpbiBgbmdPbkluaXRgIHNvIHRoZSBvdmVycmlkZGVuIHZhbHVlIG9mXG4gICAgLy8gYGJhc2ljQ2hpcEF0dHJOYW1lYCBjb21pbmcgZnJvbSBiYXNlIGNsYXNzZXMgY2FuIGJlIHBpY2tlZCB1cC5cbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuX2lzQmFzaWNDaGlwID1cbiAgICAgIGVsZW1lbnQuaGFzQXR0cmlidXRlKHRoaXMuYmFzaWNDaGlwQXR0ck5hbWUpIHx8XG4gICAgICBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gdGhpcy5iYXNpY0NoaXBBdHRyTmFtZTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl90ZXh0RWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubWF0LW1kYy1jaGlwLWFjdGlvbi1sYWJlbCcpITtcblxuICAgIGlmICh0aGlzLl9wZW5kaW5nRm9jdXMpIHtcbiAgICAgIHRoaXMuX3BlbmRpbmdGb2N1cyA9IGZhbHNlO1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICAvLyBTaW5jZSB0aGUgc3R5bGluZyBkZXBlbmRzIG9uIHRoZSBwcmVzZW5jZSBvZiBzb21lXG4gICAgLy8gYWN0aW9ucywgd2UgaGF2ZSB0byBtYXJrIGZvciBjaGVjayBvbiBjaGFuZ2VzLlxuICAgIHRoaXMuX2FjdGlvbkNoYW5nZXMgPSBtZXJnZShcbiAgICAgIHRoaXMuX2FsbExlYWRpbmdJY29ucy5jaGFuZ2VzLFxuICAgICAgdGhpcy5fYWxsVHJhaWxpbmdJY29ucy5jaGFuZ2VzLFxuICAgICAgdGhpcy5fYWxsUmVtb3ZlSWNvbnMuY2hhbmdlcyxcbiAgICApLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XG4gICAgdGhpcy5fcmlwcGxlTG9hZGVyLnNldERpc2FibGVkKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5faXNSaXBwbGVEaXNhYmxlZCgpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgICB0aGlzLl9yaXBwbGVMb2FkZXI/LmRlc3Ryb3lSaXBwbGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLl9hY3Rpb25DaGFuZ2VzPy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuZGVzdHJveWVkLmVtaXQoe2NoaXA6IHRoaXN9KTtcbiAgICB0aGlzLmRlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBmb3IgcHJvZ3JhbW1hdGljIHJlbW92YWwgb2YgdGhlIGNoaXAuXG4gICAqXG4gICAqIEluZm9ybXMgYW55IGxpc3RlbmVycyBvZiB0aGUgcmVtb3ZhbCByZXF1ZXN0LiBEb2VzIG5vdCByZW1vdmUgdGhlIGNoaXAgZnJvbSB0aGUgRE9NLlxuICAgKi9cbiAgcmVtb3ZlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJlbW92YWJsZSkge1xuICAgICAgdGhpcy5yZW1vdmVkLmVtaXQoe2NoaXA6IHRoaXN9KTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIHJpcHBsZSBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIF9pc1JpcHBsZURpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmRpc2FibGVkIHx8XG4gICAgICB0aGlzLmRpc2FibGVSaXBwbGUgfHxcbiAgICAgIHRoaXMuX2FuaW1hdGlvbnNEaXNhYmxlZCB8fFxuICAgICAgdGhpcy5faXNCYXNpY0NoaXAgfHxcbiAgICAgICEhdGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucz8uZGlzYWJsZWRcbiAgICApO1xuICB9XG5cbiAgLyoqIFJldHVybnMgd2hldGhlciB0aGUgY2hpcCBoYXMgYSB0cmFpbGluZyBpY29uLiAqL1xuICBfaGFzVHJhaWxpbmdJY29uKCkge1xuICAgIHJldHVybiAhISh0aGlzLnRyYWlsaW5nSWNvbiB8fCB0aGlzLnJlbW92ZUljb24pO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMga2V5Ym9hcmQgZXZlbnRzIG9uIHRoZSBjaGlwLiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSBCQUNLU1BBQ0UgfHwgZXZlbnQua2V5Q29kZSA9PT0gREVMRVRFKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQWxsb3dzIGZvciBwcm9ncmFtbWF0aWMgZm9jdXNpbmcgb2YgdGhlIGNoaXAuICovXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgLy8gSWYgYGZvY3VzYCBpcyBjYWxsZWQgYmVmb3JlIGBuZ0FmdGVyVmlld0luaXRgLCB3ZSB3b24ndCBoYXZlIGFjY2VzcyB0byB0aGUgcHJpbWFyeSBhY3Rpb24uXG4gICAgICAvLyBUaGlzIGNhbiBoYXBwZW4gaWYgdGhlIGNvbnN1bWVyIHRyaWVzIHRvIGZvY3VzIGEgY2hpcCBpbW1lZGlhdGVseSBhZnRlciBpdCBpcyBhZGRlZC5cbiAgICAgIC8vIFF1ZXVlIHRoZSBtZXRob2QgdG8gYmUgY2FsbGVkIGFnYWluIG9uIGluaXQuXG4gICAgICBpZiAodGhpcy5wcmltYXJ5QWN0aW9uKSB7XG4gICAgICAgIHRoaXMucHJpbWFyeUFjdGlvbi5mb2N1cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ0ZvY3VzID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYWN0aW9uIHRoYXQgY29udGFpbnMgYSBzcGVjaWZpYyB0YXJnZXQgbm9kZS4gKi9cbiAgX2dldFNvdXJjZUFjdGlvbih0YXJnZXQ6IE5vZGUpOiBNYXRDaGlwQWN0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0QWN0aW9ucygpLmZpbmQoYWN0aW9uID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBhY3Rpb24uX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIHJldHVybiBlbGVtZW50ID09PSB0YXJnZXQgfHwgZWxlbWVudC5jb250YWlucyh0YXJnZXQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEdldHMgYWxsIG9mIHRoZSBhY3Rpb25zIHdpdGhpbiB0aGUgY2hpcC4gKi9cbiAgX2dldEFjdGlvbnMoKTogTWF0Q2hpcEFjdGlvbltdIHtcbiAgICBjb25zdCByZXN1bHQ6IE1hdENoaXBBY3Rpb25bXSA9IFtdO1xuXG4gICAgaWYgKHRoaXMucHJpbWFyeUFjdGlvbikge1xuICAgICAgcmVzdWx0LnB1c2godGhpcy5wcmltYXJ5QWN0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZW1vdmVJY29uKSB7XG4gICAgICByZXN1bHQucHVzaCh0aGlzLnJlbW92ZUljb24pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRyYWlsaW5nSWNvbikge1xuICAgICAgcmVzdWx0LnB1c2godGhpcy50cmFpbGluZ0ljb24pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogSGFuZGxlcyBpbnRlcmFjdGlvbnMgd2l0aCB0aGUgcHJpbWFyeSBhY3Rpb24gb2YgdGhlIGNoaXAuICovXG4gIF9oYW5kbGVQcmltYXJ5QWN0aW9uSW50ZXJhY3Rpb24oKSB7XG4gICAgLy8gRW1wdHkgaGVyZSwgYnV0IGlzIG92ZXJ3cml0dGVuIGluIGNoaWxkIGNsYXNzZXMuXG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGFiaW5kZXggb2YgdGhlIGNoaXAuICovXG4gIF9nZXRUYWJJbmRleCgpIHtcbiAgICBpZiAoIXRoaXMucm9sZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRpc2FibGVkID8gLTEgOiB0aGlzLnRhYkluZGV4O1xuICB9XG5cbiAgLyoqIFN0YXJ0cyB0aGUgZm9jdXMgbW9uaXRvcmluZyBwcm9jZXNzIG9uIHRoZSBjaGlwLiAqL1xuICBwcml2YXRlIF9tb25pdG9yRm9jdXMoKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgdHJ1ZSkuc3Vic2NyaWJlKG9yaWdpbiA9PiB7XG4gICAgICBjb25zdCBoYXNGb2N1cyA9IG9yaWdpbiAhPT0gbnVsbDtcblxuICAgICAgaWYgKGhhc0ZvY3VzICE9PSB0aGlzLl9oYXNGb2N1c0ludGVybmFsKSB7XG4gICAgICAgIHRoaXMuX2hhc0ZvY3VzSW50ZXJuYWwgPSBoYXNGb2N1cztcblxuICAgICAgICBpZiAoaGFzRm9jdXMpIHtcbiAgICAgICAgICB0aGlzLl9vbkZvY3VzLm5leHQoe2NoaXA6IHRoaXN9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBXaGVuIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWQsIEFuZ3VsYXIgbWF5IGVuZCB1cCByZW1vdmluZyB0aGUgY2hpcCBmcm9tIHRoZSBET00gYSBsaXR0bGVcbiAgICAgICAgICAvLyBlYXJsaWVyIHRoYW4gdXN1YWwsIGNhdXNpbmcgaXQgdG8gYmUgYmx1cnJlZCBhbmQgdGhyb3dpbmcgb2ZmIHRoZSBsb2dpYyBpbiB0aGUgY2hpcCBsaXN0XG4gICAgICAgICAgLy8gdGhhdCBtb3ZlcyBmb2N1cyBub3QgdGhlIG5leHQgaXRlbS4gVG8gd29yayBhcm91bmQgdGhlIGlzc3VlLCB3ZSBkZWZlciBtYXJraW5nIHRoZSBjaGlwXG4gICAgICAgICAgLy8gYXMgbm90IGZvY3VzZWQgdW50aWwgdGhlIG5leHQgdGltZSB0aGUgem9uZSBzdGFiaWxpemVzLlxuICAgICAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZVxuICAgICAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLl9vbkJsdXIubmV4dCh7Y2hpcDogdGhpc30pKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiPHNwYW4gY2xhc3M9XCJtYXQtbWRjLWNoaXAtZm9jdXMtb3ZlcmxheVwiPjwvc3Bhbj5cblxuPHNwYW4gY2xhc3M9XCJtZGMtZXZvbHV0aW9uLWNoaXBfX2NlbGwgbWRjLWV2b2x1dGlvbi1jaGlwX19jZWxsLS1wcmltYXJ5XCI+XG4gIDxzcGFuIG1hdENoaXBBY3Rpb24gW2lzSW50ZXJhY3RpdmVdPVwiZmFsc2VcIj5cbiAgICBAaWYgKGxlYWRpbmdJY29uKSB7XG4gICAgICA8c3BhbiBjbGFzcz1cIm1kYy1ldm9sdXRpb24tY2hpcF9fZ3JhcGhpYyBtYXQtbWRjLWNoaXAtZ3JhcGhpY1wiPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJtYXQtY2hpcC1hdmF0YXIsIFttYXRDaGlwQXZhdGFyXVwiPjwvbmctY29udGVudD5cbiAgICAgIDwvc3Bhbj5cbiAgICB9XG4gICAgPHNwYW4gY2xhc3M9XCJtZGMtZXZvbHV0aW9uLWNoaXBfX3RleHQtbGFiZWwgbWF0LW1kYy1jaGlwLWFjdGlvbi1sYWJlbFwiPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgPHNwYW4gY2xhc3M9XCJtYXQtbWRjLWNoaXAtcHJpbWFyeS1mb2N1cy1pbmRpY2F0b3IgbWF0LW1kYy1mb2N1cy1pbmRpY2F0b3JcIj48L3NwYW4+XG4gICAgPC9zcGFuPlxuICA8L3NwYW4+XG48L3NwYW4+XG5cbkBpZiAoX2hhc1RyYWlsaW5nSWNvbigpKSB7XG4gIDxzcGFuIGNsYXNzPVwibWRjLWV2b2x1dGlvbi1jaGlwX19jZWxsIG1kYy1ldm9sdXRpb24tY2hpcF9fY2VsbC0tdHJhaWxpbmdcIj5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJtYXQtY2hpcC10cmFpbGluZy1pY29uLFttYXRDaGlwUmVtb3ZlXSxbbWF0Q2hpcFRyYWlsaW5nSWNvbl1cIj48L25nLWNvbnRlbnQ+XG4gIDwvc3Bhbj5cbn1cbiJdfQ==
