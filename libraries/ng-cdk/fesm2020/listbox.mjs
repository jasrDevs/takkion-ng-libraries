import * as i0 from '@angular/core';
import {
  inject,
  ElementRef,
  Directive,
  Input,
  ChangeDetectorRef,
  InjectFlags,
  forwardRef,
  Output,
  ContentChildren,
  NgModule,
} from '@angular/core';
import { ActiveDescendantKeyManager } from '@takkion/ng-cdk/a11y';
import {
  A,
  hasModifierKey,
  SPACE,
  ENTER,
  HOME,
  END,
  UP_ARROW,
  DOWN_ARROW,
  LEFT_ARROW,
  RIGHT_ARROW,
} from '@takkion/ng-cdk/keycodes';
import { coerceBooleanProperty, coerceArray } from '@takkion/ng-cdk/coercion';
import { SelectionModel } from '@takkion/ng-cdk/collections';
import { Subject, defer, merge } from 'rxjs';
import { startWith, switchMap, map, takeUntil, filter } from 'rxjs/operators';
import { Validators, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { Directionality } from '@takkion/ng-cdk/bidi';

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** The next id to use for creating unique DOM IDs. */
let nextId = 0;
/**
 * An implementation of SelectionModel that internally always represents the selection as a
 * multi-selection. This is necessary so that we can recover the full selection if the user
 * switches the listbox from single-selection to multi-selection after initialization.
 *
 * This selection model may report multiple selected values, even if it is in single-selection
 * mode. It is up to the user (CdkListbox) to check for invalid selections.
 */
class ListboxSelectionModel extends SelectionModel {
  constructor(multiple = false, initiallySelectedValues, emitChanges = true, compareWith) {
    super(true, initiallySelectedValues, emitChanges, compareWith);
    this.multiple = multiple;
  }
  isMultipleSelection() {
    return this.multiple;
  }
  select(...values) {
    // The super class is always in multi-selection mode, so we need to override the behavior if
    // this selection model actually belongs to a single-selection listbox.
    if (this.multiple) {
      return super.select(...values);
    } else {
      return super.setSelection(...values);
    }
  }
}
/** A selectable option in a listbox. */
class CdkOption {
  constructor() {
    this._generatedId = `cdk-option-${nextId++}`;
    this._disabled = false;
    /** The option's host element */
    this.element = inject(ElementRef).nativeElement;
    /** The parent listbox this option belongs to. */
    this.listbox = inject(CdkListbox);
    /** Emits when the option is destroyed. */
    this.destroyed = new Subject();
    /** Emits when the option is clicked. */
    this._clicked = new Subject();
    /** Whether the option is currently active. */
    this._active = false;
  }
  /** The id of the option's host element. */
  get id() {
    return this._id || this._generatedId;
  }
  set id(value) {
    this._id = value;
  }
  /** Whether this option is disabled. */
  get disabled() {
    return this.listbox.disabled || this._disabled;
  }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
  }
  /** The tabindex of the option when it is enabled. */
  get enabledTabIndex() {
    return this._enabledTabIndex === undefined
      ? this.listbox.enabledTabIndex
      : this._enabledTabIndex;
  }
  set enabledTabIndex(value) {
    this._enabledTabIndex = value;
  }
  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
  /** Whether this option is selected. */
  isSelected() {
    return this.listbox.isSelected(this);
  }
  /** Whether this option is active. */
  isActive() {
    return this._active;
  }
  /** Toggle the selected state of this option. */
  toggle() {
    this.listbox.toggle(this);
  }
  /** Select this option if it is not selected. */
  select() {
    this.listbox.select(this);
  }
  /** Deselect this option if it is selected. */
  deselect() {
    this.listbox.deselect(this);
  }
  /** Focus this option. */
  focus() {
    this.element.focus();
  }
  /** Get the label for this element which is required by the FocusableOption interface. */
  getLabel() {
    return (this.typeaheadLabel ?? this.element.textContent?.trim()) || '';
  }
  /**
   * Set the option as active.
   * @docs-private
   */
  setActiveStyles() {
    this._active = true;
  }
  /**
   * Set the option as inactive.
   * @docs-private
   */
  setInactiveStyles() {
    this._active = false;
  }
  /** Handle focus events on the option. */
  _handleFocus() {
    // Options can wind up getting focused in active descendant mode if the user clicks on them.
    // In this case, we push focus back to the parent listbox to prevent an extra tab stop when
    // the user performs a shift+tab.
    if (this.listbox.useActiveDescendant) {
      this.listbox._setActiveOption(this);
      this.listbox.focus();
    }
  }
  /** Get the tabindex for this option. */
  _getTabIndex() {
    if (this.listbox.useActiveDescendant || this.disabled) {
      return -1;
    }
    return this.isActive() ? this.enabledTabIndex : -1;
  }
}
CdkOption.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkOption,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkOption.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkOption,
  selector: '[cdkOption]',
  inputs: {
    id: 'id',
    value: ['cdkOption', 'value'],
    typeaheadLabel: ['cdkOptionTypeaheadLabel', 'typeaheadLabel'],
    disabled: ['cdkOptionDisabled', 'disabled'],
    enabledTabIndex: ['tabindex', 'enabledTabIndex'],
  },
  host: {
    attributes: { role: 'option' },
    listeners: { click: '_clicked.next($event)', focus: '_handleFocus()' },
    properties: {
      id: 'id',
      'attr.aria-selected': 'isSelected()',
      'attr.tabindex': '_getTabIndex()',
      'attr.aria-disabled': 'disabled',
      'class.cdk-option-active': 'isActive()',
    },
    classAttribute: 'cdk-option',
  },
  exportAs: ['cdkOption'],
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkOption,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[cdkOption]',
          exportAs: 'cdkOption',
          host: {
            role: 'option',
            class: 'cdk-option',
            '[id]': 'id',
            '[attr.aria-selected]': 'isSelected()',
            '[attr.tabindex]': '_getTabIndex()',
            '[attr.aria-disabled]': 'disabled',
            '[class.cdk-option-active]': 'isActive()',
            '(click)': '_clicked.next($event)',
            '(focus)': '_handleFocus()',
          },
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
    value: [
      {
        type: Input,
        args: ['cdkOption'],
      },
    ],
    typeaheadLabel: [
      {
        type: Input,
        args: ['cdkOptionTypeaheadLabel'],
      },
    ],
    disabled: [
      {
        type: Input,
        args: ['cdkOptionDisabled'],
      },
    ],
    enabledTabIndex: [
      {
        type: Input,
        args: ['tabindex'],
      },
    ],
  },
});
class CdkListbox {
  constructor() {
    this._generatedId = `cdk-listbox-${nextId++}`;
    this._disabled = false;
    this._useActiveDescendant = false;
    this._orientation = 'vertical';
    this._navigationWrapDisabled = false;
    this._navigateDisabledOptions = false;
    /** Emits when the selected value(s) in the listbox change. */
    this.valueChange = new Subject();
    /** The selection model used by the listbox. */
    this.selectionModel = new ListboxSelectionModel();
    /** Emits when the listbox is destroyed. */
    this.destroyed = new Subject();
    /** The host element of the listbox. */
    this.element = inject(ElementRef).nativeElement;
    /** The change detector for this listbox. */
    this.changeDetectorRef = inject(ChangeDetectorRef);
    /** Whether the currently selected value in the selection model is invalid. */
    this._invalid = false;
    /** The last user-triggered option. */
    this._lastTriggered = null;
    /** Callback called when the listbox has been touched */
    this._onTouched = () => {};
    /** Callback called when the listbox value changes */
    this._onChange = () => {};
    /** Callback called when the form validator changes. */
    this._onValidatorChange = () => {};
    /** Emits when an option has been clicked. */
    this._optionClicked = defer(() =>
      this.options.changes.pipe(
        startWith(this.options),
        switchMap(options =>
          merge(...options.map(option => option._clicked.pipe(map(event => ({ option, event })))))
        )
      )
    );
    /** The directionality of the page. */
    this._dir = inject(Directionality, InjectFlags.Optional);
    /** A predicate that skips disabled options. */
    this._skipDisabledPredicate = option => option.disabled;
    /** A predicate that does not skip any options. */
    this._skipNonePredicate = () => false;
    /**
     * Validator that produces an error if multiple values are selected in a single selection
     * listbox.
     * @param control The control to validate
     * @return A validation error or null
     */
    this._validateUnexpectedMultipleValues = control => {
      const controlValue = this._coerceValue(control.value);
      if (!this.multiple && controlValue.length > 1) {
        return { cdkListboxUnexpectedMultipleValues: true };
      }
      return null;
    };
    /**
     * Validator that produces an error if any selected values are not valid options for this listbox.
     * @param control The control to validate
     * @return A validation error or null
     */
    this._validateUnexpectedOptionValues = control => {
      const controlValue = this._coerceValue(control.value);
      const invalidValues = this._getInvalidOptionValues(controlValue);
      if (invalidValues.length) {
        return { cdkListboxUnexpectedOptionValues: { values: invalidValues } };
      }
      return null;
    };
    /** The combined set of validators for this listbox. */
    this._validators = Validators.compose([
      this._validateUnexpectedMultipleValues,
      this._validateUnexpectedOptionValues,
    ]);
  }
  /** The id of the option's host element. */
  get id() {
    return this._id || this._generatedId;
  }
  set id(value) {
    this._id = value;
  }
  /** The tabindex to use when the listbox is enabled. */
  get enabledTabIndex() {
    return this._enabledTabIndex === undefined ? 0 : this._enabledTabIndex;
  }
  set enabledTabIndex(value) {
    this._enabledTabIndex = value;
  }
  /** The value selected in the listbox, represented as an array of option values. */
  get value() {
    return this._invalid ? [] : this.selectionModel.selected;
  }
  set value(value) {
    this._setSelection(value);
  }
  /**
   * Whether the listbox allows multiple options to be selected. If the value switches from `true`
   * to `false`, and more than one option is selected, all options are deselected.
   */
  get multiple() {
    return this.selectionModel.multiple;
  }
  set multiple(value) {
    this.selectionModel.multiple = coerceBooleanProperty(value);
    if (this.options) {
      this._updateInternalValue();
    }
  }
  /** Whether the listbox is disabled. */
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
  }
  /** Whether the listbox will use active descendant or will move focus onto the options. */
  get useActiveDescendant() {
    return this._useActiveDescendant;
  }
  set useActiveDescendant(shouldUseActiveDescendant) {
    this._useActiveDescendant = coerceBooleanProperty(shouldUseActiveDescendant);
  }
  /** The orientation of the listbox. Only affects keyboard interaction, not visual layout. */
  get orientation() {
    return this._orientation;
  }
  set orientation(value) {
    this._orientation = value === 'horizontal' ? 'horizontal' : 'vertical';
    if (value === 'horizontal') {
      this.listKeyManager?.withHorizontalOrientation(this._dir?.value || 'ltr');
    } else {
      this.listKeyManager?.withVerticalOrientation();
    }
  }
  /** The function used to compare option values. */
  get compareWith() {
    return this.selectionModel.compareWith;
  }
  set compareWith(fn) {
    this.selectionModel.compareWith = fn;
  }
  /**
   * Whether the keyboard navigation should wrap when the user presses arrow down on the last item
   * or arrow up on the first item.
   */
  get navigationWrapDisabled() {
    return this._navigationWrapDisabled;
  }
  set navigationWrapDisabled(wrap) {
    this._navigationWrapDisabled = coerceBooleanProperty(wrap);
    this.listKeyManager?.withWrap(!this._navigationWrapDisabled);
  }
  /** Whether keyboard navigation should skip over disabled items. */
  get navigateDisabledOptions() {
    return this._navigateDisabledOptions;
  }
  set navigateDisabledOptions(skip) {
    this._navigateDisabledOptions = coerceBooleanProperty(skip);
    this.listKeyManager?.skipPredicate(
      this._navigateDisabledOptions ? this._skipNonePredicate : this._skipDisabledPredicate
    );
  }
  ngAfterContentInit() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      this._verifyNoOptionValueCollisions();
    }
    this._initKeyManager();
    // Update the internal value whenever the options or the model value changes.
    merge(this.selectionModel.changed, this.options.changes)
      .pipe(startWith(null), takeUntil(this.destroyed))
      .subscribe(() => this._updateInternalValue());
    this._optionClicked
      .pipe(
        filter(({ option }) => !option.disabled),
        takeUntil(this.destroyed)
      )
      .subscribe(({ option, event }) => this._handleOptionClicked(option, event));
  }
  ngOnDestroy() {
    this.listKeyManager.change.complete();
    this.destroyed.next();
    this.destroyed.complete();
  }
  /**
   * Toggle the selected state of the given option.
   * @param option The option to toggle
   */
  toggle(option) {
    this.toggleValue(option.value);
  }
  /**
   * Toggle the selected state of the given value.
   * @param value The value to toggle
   */
  toggleValue(value) {
    if (this._invalid) {
      this.selectionModel.clear(false);
    }
    this.selectionModel.toggle(value);
  }
  /**
   * Select the given option.
   * @param option The option to select
   */
  select(option) {
    this.selectValue(option.value);
  }
  /**
   * Select the given value.
   * @param value The value to select
   */
  selectValue(value) {
    if (this._invalid) {
      this.selectionModel.clear(false);
    }
    this.selectionModel.select(value);
  }
  /**
   * Deselect the given option.
   * @param option The option to deselect
   */
  deselect(option) {
    this.deselectValue(option.value);
  }
  /**
   * Deselect the given value.
   * @param value The value to deselect
   */
  deselectValue(value) {
    if (this._invalid) {
      this.selectionModel.clear(false);
    }
    this.selectionModel.deselect(value);
  }
  /**
   * Set the selected state of all options.
   * @param isSelected The new selected state to set
   */
  setAllSelected(isSelected) {
    if (!isSelected) {
      this.selectionModel.clear();
    } else {
      if (this._invalid) {
        this.selectionModel.clear(false);
      }
      this.selectionModel.select(...this.options.map(option => option.value));
    }
  }
  /**
   * Get whether the given option is selected.
   * @param option The option to get the selected state of
   */
  isSelected(option) {
    return this.isValueSelected(option.value);
  }
  /**
   * Get whether the given value is selected.
   * @param value The value to get the selected state of
   */
  isValueSelected(value) {
    if (this._invalid) {
      return false;
    }
    return this.selectionModel.isSelected(value);
  }
  /**
   * Registers a callback to be invoked when the listbox's value changes from user input.
   * @param fn The callback to register
   * @docs-private
   */
  registerOnChange(fn) {
    this._onChange = fn;
  }
  /**
   * Registers a callback to be invoked when the listbox is blurred by the user.
   * @param fn The callback to register
   * @docs-private
   */
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  /**
   * Sets the listbox's value.
   * @param value The new value of the listbox
   * @docs-private
   */
  writeValue(value) {
    this._setSelection(value);
  }
  /**
   * Sets the disabled state of the listbox.
   * @param isDisabled The new disabled state
   * @docs-private
   */
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
  /**
   * Validate the given control
   * @docs-private
   */
  validate(control) {
    return this._validators(control);
  }
  /**
   * Registers a callback to be called when the form validator changes.
   * @param fn The callback to call
   * @docs-private
   */
  registerOnValidatorChange(fn) {
    this._onValidatorChange = fn;
  }
  /** Focus the listbox's host element. */
  focus() {
    this.element.focus();
  }
  /**
   * Triggers the given option in response to user interaction.
   * - In single selection mode: selects the option and deselects any other selected option.
   * - In multi selection mode: toggles the selected state of the option.
   * @param option The option to trigger
   */
  triggerOption(option) {
    if (option && !option.disabled) {
      this._lastTriggered = option;
      const changed = this.multiple
        ? this.selectionModel.toggle(option.value)
        : this.selectionModel.select(option.value);
      if (changed) {
        this._onChange(this.value);
        this.valueChange.next({
          value: this.value,
          listbox: this,
          option: option,
        });
      }
    }
  }
  /**
   * Trigger the given range of options in response to user interaction.
   * Should only be called in multi-selection mode.
   * @param trigger The option that was triggered
   * @param from The start index of the options to toggle
   * @param to The end index of the options to toggle
   * @param on Whether to toggle the option range on
   */
  triggerRange(trigger, from, to, on) {
    if (this.disabled || (trigger && trigger.disabled)) {
      return;
    }
    this._lastTriggered = trigger;
    const isEqual = this.compareWith ?? Object.is;
    const updateValues = [...this.options]
      .slice(Math.max(0, Math.min(from, to)), Math.min(this.options.length, Math.max(from, to) + 1))
      .filter(option => !option.disabled)
      .map(option => option.value);
    const selected = [...this.value];
    for (const updateValue of updateValues) {
      const selectedIndex = selected.findIndex(selectedValue =>
        isEqual(selectedValue, updateValue)
      );
      if (on && selectedIndex === -1) {
        selected.push(updateValue);
      } else if (!on && selectedIndex !== -1) {
        selected.splice(selectedIndex, 1);
      }
    }
    let changed = this.selectionModel.setSelection(...selected);
    if (changed) {
      this._onChange(this.value);
      this.valueChange.next({
        value: this.value,
        listbox: this,
        option: trigger,
      });
    }
  }
  /**
   * Sets the given option as active.
   * @param option The option to make active
   */
  _setActiveOption(option) {
    this.listKeyManager.setActiveItem(option);
  }
  /** Called when the listbox receives focus. */
  _handleFocus() {
    if (!this.useActiveDescendant) {
      this.listKeyManager.setNextItemActive();
      this._focusActiveOption();
    }
  }
  /** Called when the user presses keydown on the listbox. */
  _handleKeydown(event) {
    if (this._disabled) {
      return;
    }
    const { keyCode } = event;
    const previousActiveIndex = this.listKeyManager.activeItemIndex;
    const ctrlKeys = ['ctrlKey', 'metaKey'];
    if (this.multiple && keyCode === A && hasModifierKey(event, ...ctrlKeys)) {
      // Toggle all options off if they're all selected, otherwise toggle them all on.
      this.triggerRange(
        null,
        0,
        this.options.length - 1,
        this.options.length !== this.value.length
      );
      event.preventDefault();
      return;
    }
    if (
      this.multiple &&
      (keyCode === SPACE || keyCode === ENTER) &&
      hasModifierKey(event, 'shiftKey')
    ) {
      if (this.listKeyManager.activeItem && this.listKeyManager.activeItemIndex != null) {
        this.triggerRange(
          this.listKeyManager.activeItem,
          this._getLastTriggeredIndex() ?? this.listKeyManager.activeItemIndex,
          this.listKeyManager.activeItemIndex,
          !this.listKeyManager.activeItem.isSelected()
        );
      }
      event.preventDefault();
      return;
    }
    if (
      this.multiple &&
      keyCode === HOME &&
      hasModifierKey(event, ...ctrlKeys) &&
      hasModifierKey(event, 'shiftKey')
    ) {
      const trigger = this.listKeyManager.activeItem;
      if (trigger) {
        const from = this.listKeyManager.activeItemIndex;
        this.listKeyManager.setFirstItemActive();
        this.triggerRange(
          trigger,
          from,
          this.listKeyManager.activeItemIndex,
          !trigger.isSelected()
        );
      }
      event.preventDefault();
      return;
    }
    if (
      this.multiple &&
      keyCode === END &&
      hasModifierKey(event, ...ctrlKeys) &&
      hasModifierKey(event, 'shiftKey')
    ) {
      const trigger = this.listKeyManager.activeItem;
      if (trigger) {
        const from = this.listKeyManager.activeItemIndex;
        this.listKeyManager.setLastItemActive();
        this.triggerRange(
          trigger,
          from,
          this.listKeyManager.activeItemIndex,
          !trigger.isSelected()
        );
      }
      event.preventDefault();
      return;
    }
    if (keyCode === SPACE || keyCode === ENTER) {
      this.triggerOption(this.listKeyManager.activeItem);
      event.preventDefault();
      return;
    }
    const isNavKey =
      keyCode === UP_ARROW ||
      keyCode === DOWN_ARROW ||
      keyCode === LEFT_ARROW ||
      keyCode === RIGHT_ARROW ||
      keyCode === HOME ||
      keyCode === END;
    this.listKeyManager.onKeydown(event);
    // Will select an option if shift was pressed while navigating to the option
    if (isNavKey && event.shiftKey && previousActiveIndex !== this.listKeyManager.activeItemIndex) {
      this.triggerOption(this.listKeyManager.activeItem);
    }
  }
  /**
   * Called when the focus leaves an element in the listbox.
   * @param event The focusout event
   */
  _handleFocusOut(event) {
    const otherElement = event.relatedTarget;
    if (this.element !== otherElement && !this.element.contains(otherElement)) {
      this._onTouched();
    }
  }
  /** Get the id of the active option if active descendant is being used. */
  _getAriaActiveDescendant() {
    return this._useActiveDescendant ? this.listKeyManager?.activeItem?.id : null;
  }
  /** Get the tabindex for the listbox. */
  _getTabIndex() {
    if (this.disabled) {
      return -1;
    }
    return this.useActiveDescendant || !this.listKeyManager.activeItem ? this.enabledTabIndex : -1;
  }
  /** Initialize the key manager. */
  _initKeyManager() {
    this.listKeyManager = new ActiveDescendantKeyManager(this.options)
      .withWrap(!this._navigationWrapDisabled)
      .withTypeAhead()
      .withHomeAndEnd()
      .withAllowedModifierKeys(['shiftKey'])
      .skipPredicate(
        this._navigateDisabledOptions ? this._skipNonePredicate : this._skipDisabledPredicate
      );
    if (this.orientation === 'vertical') {
      this.listKeyManager.withVerticalOrientation();
    } else {
      this.listKeyManager.withHorizontalOrientation(this._dir?.value || 'ltr');
    }
    this.listKeyManager.change
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => this._focusActiveOption());
  }
  /** Focus the active option. */
  _focusActiveOption() {
    if (!this.useActiveDescendant) {
      this.listKeyManager.activeItem?.focus();
    }
    this.changeDetectorRef.markForCheck();
  }
  /**
   * Set the selected values.
   * @param value The list of new selected values.
   */
  _setSelection(value) {
    if (this._invalid) {
      this.selectionModel.clear(false);
    }
    this.selectionModel.setSelection(...this._coerceValue(value));
  }
  /** Update the internal value of the listbox based on the selection model. */
  _updateInternalValue() {
    const indexCache = new Map();
    this.selectionModel.sort((a, b) => {
      const aIndex = this._getIndexForValue(indexCache, a);
      const bIndex = this._getIndexForValue(indexCache, b);
      return aIndex - bIndex;
    });
    const selected = this.selectionModel.selected;
    this._invalid =
      (!this.multiple && selected.length > 1) || !!this._getInvalidOptionValues(selected).length;
    this._onValidatorChange();
    this.changeDetectorRef.markForCheck();
  }
  /**
   * Gets the index of the given value in the given list of options.
   * @param cache The cache of indices found so far
   * @param value The value to find
   * @return The index of the value in the options list
   */
  _getIndexForValue(cache, value) {
    const isEqual = this.compareWith || Object.is;
    if (!cache.has(value)) {
      let index = -1;
      for (let i = 0; i < this.options.length; i++) {
        if (isEqual(value, this.options.get(i).value)) {
          index = i;
          break;
        }
      }
      cache.set(value, index);
    }
    return cache.get(value);
  }
  /**
   * Handle the user clicking an option.
   * @param option The option that was clicked.
   */
  _handleOptionClicked(option, event) {
    this.listKeyManager.setActiveItem(option);
    if (event.shiftKey && this.multiple) {
      this.triggerRange(
        option,
        this._getLastTriggeredIndex() ?? this.listKeyManager.activeItemIndex,
        this.listKeyManager.activeItemIndex,
        !option.isSelected()
      );
    } else {
      this.triggerOption(option);
    }
  }
  /** Verifies that no two options represent the same value under the compareWith function. */
  _verifyNoOptionValueCollisions() {
    this.options.changes.pipe(startWith(this.options), takeUntil(this.destroyed)).subscribe(() => {
      const isEqual = this.compareWith ?? Object.is;
      for (let i = 0; i < this.options.length; i++) {
        const option = this.options.get(i);
        let duplicate = null;
        for (let j = i + 1; j < this.options.length; j++) {
          const other = this.options.get(j);
          if (isEqual(option.value, other.value)) {
            duplicate = other;
            break;
          }
        }
        if (duplicate) {
          // TODO(mmalerba): Link to docs about this.
          if (this.compareWith) {
            console.warn(
              `Found multiple CdkOption representing the same value under the given compareWith function`,
              {
                option1: option.element,
                option2: duplicate.element,
                compareWith: this.compareWith,
              }
            );
          } else {
            console.warn(`Found multiple CdkOption with the same value`, {
              option1: option.element,
              option2: duplicate.element,
            });
          }
          return;
        }
      }
    });
  }
  /**
   * Coerces a value into an array representing a listbox selection.
   * @param value The value to coerce
   * @return An array
   */
  _coerceValue(value) {
    return value == null ? [] : coerceArray(value);
  }
  /**
   * Get the sublist of values that do not represent valid option values in this listbox.
   * @param values The list of values
   * @return The sublist of values that are not valid option values
   */
  _getInvalidOptionValues(values) {
    const isEqual = this.compareWith || Object.is;
    const validValues = (this.options || []).map(option => option.value);
    return values.filter(value => !validValues.some(validValue => isEqual(value, validValue)));
  }
  /** Get the index of the last triggered option. */
  _getLastTriggeredIndex() {
    const index = this.options.toArray().indexOf(this._lastTriggered);
    return index === -1 ? null : index;
  }
}
CdkListbox.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkListbox,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkListbox.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkListbox,
  selector: '[cdkListbox]',
  inputs: {
    id: 'id',
    enabledTabIndex: ['tabindex', 'enabledTabIndex'],
    value: ['cdkListboxValue', 'value'],
    multiple: ['cdkListboxMultiple', 'multiple'],
    disabled: ['cdkListboxDisabled', 'disabled'],
    useActiveDescendant: ['cdkListboxUseActiveDescendant', 'useActiveDescendant'],
    orientation: ['cdkListboxOrientation', 'orientation'],
    compareWith: ['cdkListboxCompareWith', 'compareWith'],
    navigationWrapDisabled: ['cdkListboxNavigationWrapDisabled', 'navigationWrapDisabled'],
    navigateDisabledOptions: ['cdkListboxNavigatesDisabledOptions', 'navigateDisabledOptions'],
  },
  outputs: { valueChange: 'cdkListboxValueChange' },
  host: {
    attributes: { role: 'listbox' },
    listeners: {
      focus: '_handleFocus()',
      keydown: '_handleKeydown($event)',
      focusout: '_handleFocusOut($event)',
    },
    properties: {
      id: 'id',
      'attr.tabindex': '_getTabIndex()',
      'attr.aria-disabled': 'disabled',
      'attr.aria-multiselectable': 'multiple',
      'attr.aria-activedescendant': '_getAriaActiveDescendant()',
      'attr.aria-orientation': 'orientation',
    },
    classAttribute: 'cdk-listbox',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CdkListbox),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CdkListbox),
      multi: true,
    },
  ],
  queries: [{ propertyName: 'options', predicate: CdkOption, descendants: true }],
  exportAs: ['cdkListbox'],
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkListbox,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[cdkListbox]',
          exportAs: 'cdkListbox',
          host: {
            role: 'listbox',
            class: 'cdk-listbox',
            '[id]': 'id',
            '[attr.tabindex]': '_getTabIndex()',
            '[attr.aria-disabled]': 'disabled',
            '[attr.aria-multiselectable]': 'multiple',
            '[attr.aria-activedescendant]': '_getAriaActiveDescendant()',
            '[attr.aria-orientation]': 'orientation',
            '(focus)': '_handleFocus()',
            '(keydown)': '_handleKeydown($event)',
            '(focusout)': '_handleFocusOut($event)',
          },
          providers: [
            {
              provide: NG_VALUE_ACCESSOR,
              useExisting: forwardRef(() => CdkListbox),
              multi: true,
            },
            {
              provide: NG_VALIDATORS,
              useExisting: forwardRef(() => CdkListbox),
              multi: true,
            },
          ],
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
    enabledTabIndex: [
      {
        type: Input,
        args: ['tabindex'],
      },
    ],
    value: [
      {
        type: Input,
        args: ['cdkListboxValue'],
      },
    ],
    multiple: [
      {
        type: Input,
        args: ['cdkListboxMultiple'],
      },
    ],
    disabled: [
      {
        type: Input,
        args: ['cdkListboxDisabled'],
      },
    ],
    useActiveDescendant: [
      {
        type: Input,
        args: ['cdkListboxUseActiveDescendant'],
      },
    ],
    orientation: [
      {
        type: Input,
        args: ['cdkListboxOrientation'],
      },
    ],
    compareWith: [
      {
        type: Input,
        args: ['cdkListboxCompareWith'],
      },
    ],
    navigationWrapDisabled: [
      {
        type: Input,
        args: ['cdkListboxNavigationWrapDisabled'],
      },
    ],
    navigateDisabledOptions: [
      {
        type: Input,
        args: ['cdkListboxNavigatesDisabledOptions'],
      },
    ],
    valueChange: [
      {
        type: Output,
        args: ['cdkListboxValueChange'],
      },
    ],
    options: [
      {
        type: ContentChildren,
        args: [CdkOption, { descendants: true }],
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
const EXPORTED_DECLARATIONS = [CdkListbox, CdkOption];
class CdkListboxModule {}
CdkListboxModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkListboxModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
CdkListboxModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkListboxModule,
  declarations: [CdkListbox, CdkOption],
  exports: [CdkListbox, CdkOption],
});
CdkListboxModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkListboxModule,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkListboxModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          exports: EXPORTED_DECLARATIONS,
          declarations: EXPORTED_DECLARATIONS,
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

export { CdkListbox, CdkListboxModule, CdkOption };
//# sourceMappingURL=listbox.mjs.map
