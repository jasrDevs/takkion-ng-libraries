/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusKeyManager, FocusMonitor } from '@takkion/ng-cdk/a11y';
import { coerceBooleanProperty } from '@takkion/ng-cdk/coercion';
import { SelectionModel } from '@takkion/ng-cdk/collections';
import { A, DOWN_ARROW, ENTER, hasModifierKey, SPACE, UP_ARROW } from '@takkion/ng-cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TakLine, mixinDisableRipple, setLines } from '@takkion/ng-material/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { TakListAvatarCssTakStyler, TakListIconCssTakStyler } from './list';
import * as i0 from '@angular/core';
import * as i1 from '@takkion/ng-material/core';
import * as i2 from '@angular/common';
import * as i3 from '@takkion/ng-cdk/a11y';
const _TakSelectionListBase = mixinDisableRipple(class {});
const _TakListOptionBase = mixinDisableRipple(class {});
/** @docs-private */
export const TAK_SELECTION_LIST_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TakSelectionList),
  multi: true,
};
/** Change event that is being fired whenever the selected state of an option changes. */
export class TakSelectionListChange {
  constructor(
    /** Reference to the selection list that emitted the event. */
    source,
    /** Reference to the options that have been changed. */
    options
  ) {
    this.source = source;
    this.options = options;
  }
}
/**
 * Component for list-options of selection-list. Each list-option can automatically
 * generate a checkbox and can put current item into the selectionModel of selection-list
 * if the current item is selected.
 */
export class TakListOption extends _TakListOptionBase {
  constructor(
    _element,
    _changeDetector,
    /** @docs-private */
    selectionList
  ) {
    super();
    this._element = _element;
    this._changeDetector = _changeDetector;
    this.selectionList = selectionList;
    this._selected = false;
    this._disabled = false;
    this._hasFocus = false;
    /**
     * Emits when the selected state of the option has changed.
     * Use to facilitate two-data binding to the `selected` property.
     * @docs-private
     */
    this.selectedChange = new EventEmitter();
    /** Whether the label should appear before or after the checkbox. Defaults to 'after' */
    this.checkboxPosition = 'after';
    /**
     * This is set to true after the first OnChanges cycle so we don't clear the value of `selected`
     * in the first cycle.
     */
    this._inputsInitialized = false;
  }
  /** Theme color of the list option. This sets the color of the checkbox. */
  get color() {
    return this._color || this.selectionList.color;
  }
  set color(newValue) {
    this._color = newValue;
  }
  /** Value of the option */
  get value() {
    return this._value;
  }
  set value(newValue) {
    if (
      this.selected &&
      !this.selectionList.compareWith(newValue, this.value) &&
      this._inputsInitialized
    ) {
      this.selected = false;
    }
    this._value = newValue;
  }
  /** Whether the option is disabled. */
  get disabled() {
    return this._disabled || (this.selectionList && this.selectionList.disabled);
  }
  set disabled(value) {
    const newValue = coerceBooleanProperty(value);
    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this._changeDetector.markForCheck();
    }
  }
  /** Whether the option is selected. */
  get selected() {
    return this.selectionList.selectedOptions.isSelected(this);
  }
  set selected(value) {
    const isSelected = coerceBooleanProperty(value);
    if (isSelected !== this._selected) {
      this._setSelected(isSelected);
      if (isSelected || this.selectionList.multiple) {
        this.selectionList._reportValueChange();
      }
    }
  }
  ngOnInit() {
    const list = this.selectionList;
    if (list._value && list._value.some(value => list.compareWith(this._value, value))) {
      this._setSelected(true);
    }
    const wasSelected = this._selected;
    // List options that are selected at initialization can't be reported properly to the form
    // control. This is because it takes some time until the selection-list knows about all
    // available options. Also it can happen that the ControlValueAccessor has an initial value
    // that should be used instead. Deferring the value change report to the next tick ensures
    // that the form control value is not being overwritten.
    Promise.resolve().then(() => {
      if (this._selected || wasSelected) {
        this.selected = true;
        this._changeDetector.markForCheck();
      }
    });
    this._inputsInitialized = true;
  }
  ngAfterContentInit() {
    setLines(this._lines, this._element);
  }
  ngOnDestroy() {
    if (this.selected) {
      // We have to delay this until the next tick in order
      // to avoid changed after checked errors.
      Promise.resolve().then(() => {
        this.selected = false;
      });
    }
    const hadFocus = this._hasFocus;
    const newActiveItem = this.selectionList._removeOptionFromList(this);
    // Only move focus if this option was focused at the time it was destroyed.
    if (hadFocus && newActiveItem) {
      newActiveItem.focus();
    }
  }
  /** Toggles the selection state of the option. */
  toggle() {
    this.selected = !this.selected;
  }
  /** Allows for programmatic focusing of the option. */
  focus() {
    this._element.nativeElement.focus();
  }
  /**
   * Returns the list item's text label. Implemented as a part of the FocusKeyManager.
   * @docs-private
   */
  getLabel() {
    return this._text ? this._text.nativeElement.textContent || '' : '';
  }
  /** Whether this list item should show a ripple effect when clicked. */
  _isRippleDisabled() {
    return this.disabled || this.disableRipple || this.selectionList.disableRipple;
  }
  _handleClick() {
    if (!this.disabled && (this.selectionList.multiple || !this.selected)) {
      this.toggle();
      // Emit a change event if the selected state of the option changed through user interaction.
      this.selectionList._emitChangeEvent([this]);
    }
  }
  _handleFocus() {
    this.selectionList._setFocusedOption(this);
    this._hasFocus = true;
  }
  _handleBlur() {
    this.selectionList._onTouched();
    this._hasFocus = false;
  }
  /** Retrieves the DOM element of the component host. */
  _getHostElement() {
    return this._element.nativeElement;
  }
  /** Sets the selected state of the option. Returns whether the value has changed. */
  _setSelected(selected) {
    if (selected === this._selected) {
      return false;
    }
    this._selected = selected;
    if (selected) {
      this.selectionList.selectedOptions.select(this);
    } else {
      this.selectionList.selectedOptions.deselect(this);
    }
    this.selectedChange.emit(selected);
    this._changeDetector.markForCheck();
    return true;
  }
  /**
   * Notifies Angular that the option needs to be checked in the next change detection run. Mainly
   * used to trigger an update of the list option if the disabled state of the selection list
   * changed.
   */
  _markForCheck() {
    this._changeDetector.markForCheck();
  }
}
TakListOption.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakListOption,
  deps: [
    { token: i0.ElementRef },
    { token: i0.ChangeDetectorRef },
    { token: forwardRef(() => TakSelectionList) },
  ],
  target: i0.ɵɵFactoryTarget.Component,
});
TakListOption.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakListOption,
  selector: 'tak-list-option',
  inputs: {
    disableRipple: 'disableRipple',
    checkboxPosition: 'checkboxPosition',
    color: 'color',
    value: 'value',
    disabled: 'disabled',
    selected: 'selected',
  },
  outputs: { selectedChange: 'selectedChange' },
  host: {
    attributes: { role: 'option' },
    listeners: { focus: '_handleFocus()', blur: '_handleBlur()', click: '_handleClick()' },
    properties: {
      'class.tak-list-item-disabled': 'disabled',
      'class.tak-list-item-with-avatar': '_avatar || _icon',
      'class.tak-primary': 'color === "primary"',
      'class.tak-accent': 'color !== "primary" && color !== "warn"',
      'class.tak-warn': 'color === "warn"',
      'class.tak-list-single-selected-option': 'selected && !selectionList.multiple',
      'attr.aria-selected': 'selected',
      'attr.aria-disabled': 'disabled',
      'attr.tabindex': '-1',
    },
    classAttribute: 'tak-list-item tak-list-option tak-focus-indicator',
  },
  queries: [
    {
      propertyName: '_avatar',
      first: true,
      predicate: TakListAvatarCssTakStyler,
      descendants: true,
    },
    { propertyName: '_icon', first: true, predicate: TakListIconCssTakStyler, descendants: true },
    { propertyName: '_lines', predicate: TakLine, descendants: true },
  ],
  viewQueries: [{ propertyName: '_text', first: true, predicate: ['text'], descendants: true }],
  exportAs: ['takListOption'],
  usesInheritance: true,
  ngImport: i0,
  template:
    '<div class="tak-list-item-content"\n  [class.tak-list-item-content-reverse]="checkboxPosition == \'after\'">\n\n  <div tak-ripple\n    class="tak-list-item-ripple"\n    [takRippleTrigger]="_getHostElement()"\n    [takRippleDisabled]="_isRippleDisabled()"></div>\n\n  <tak-pseudo-checkbox\n    *ngIf="selectionList.multiple"\n    [state]="selected ? \'checked\' : \'unchecked\'"\n    [disabled]="disabled"></tak-pseudo-checkbox>\n\n  <div class="tak-list-text" #text><ng-content></ng-content></div>\n\n  <ng-content select="[tak-list-avatar], [tak-list-icon], [takListAvatar], [takListIcon]">\n  </ng-content>\n\n</div>\n',
  dependencies: [
    {
      kind: 'directive',
      type: i1.TakRipple,
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
      kind: 'component',
      type: i1.TakPseudoCheckbox,
      selector: 'tak-pseudo-checkbox',
      inputs: ['state', 'disabled'],
    },
    {
      kind: 'directive',
      type: i2.NgIf,
      selector: '[ngIf]',
      inputs: ['ngIf', 'ngIfThen', 'ngIfElse'],
    },
  ],
  changeDetection: i0.ChangeDetectionStrategy.OnPush,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakListOption,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'tak-list-option',
          exportAs: 'takListOption',
          inputs: ['disableRipple'],
          host: {
            role: 'option',
            class: 'tak-list-item tak-list-option tak-focus-indicator',
            '(focus)': '_handleFocus()',
            '(blur)': '_handleBlur()',
            '(click)': '_handleClick()',
            '[class.tak-list-item-disabled]': 'disabled',
            '[class.tak-list-item-with-avatar]': '_avatar || _icon',
            // Manually set the "primary" or "warn" class if the color has been explicitly
            // set to "primary" or "warn". The pseudo checkbox picks up these classes for
            // its theme.
            '[class.tak-primary]': 'color === "primary"',
            // Even though accent is the default, we need to set this class anyway, because the  list might
            // be placed inside a parent that has one of the other colors with a higher specificity.
            '[class.tak-accent]': 'color !== "primary" && color !== "warn"',
            '[class.tak-warn]': 'color === "warn"',
            '[class.tak-list-single-selected-option]': 'selected && !selectionList.multiple',
            '[attr.aria-selected]': 'selected',
            '[attr.aria-disabled]': 'disabled',
            '[attr.tabindex]': '-1',
          },
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          template:
            '<div class="tak-list-item-content"\n  [class.tak-list-item-content-reverse]="checkboxPosition == \'after\'">\n\n  <div tak-ripple\n    class="tak-list-item-ripple"\n    [takRippleTrigger]="_getHostElement()"\n    [takRippleDisabled]="_isRippleDisabled()"></div>\n\n  <tak-pseudo-checkbox\n    *ngIf="selectionList.multiple"\n    [state]="selected ? \'checked\' : \'unchecked\'"\n    [disabled]="disabled"></tak-pseudo-checkbox>\n\n  <div class="tak-list-text" #text><ng-content></ng-content></div>\n\n  <ng-content select="[tak-list-avatar], [tak-list-icon], [takListAvatar], [takListIcon]">\n  </ng-content>\n\n</div>\n',
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.ElementRef },
      { type: i0.ChangeDetectorRef },
      {
        type: TakSelectionList,
        decorators: [
          {
            type: Inject,
            args: [forwardRef(() => TakSelectionList)],
          },
        ],
      },
    ];
  },
  propDecorators: {
    _avatar: [
      {
        type: ContentChild,
        args: [TakListAvatarCssTakStyler],
      },
    ],
    _icon: [
      {
        type: ContentChild,
        args: [TakListIconCssTakStyler],
      },
    ],
    _lines: [
      {
        type: ContentChildren,
        args: [TakLine, { descendants: true }],
      },
    ],
    selectedChange: [
      {
        type: Output,
      },
    ],
    _text: [
      {
        type: ViewChild,
        args: ['text'],
      },
    ],
    checkboxPosition: [
      {
        type: Input,
      },
    ],
    color: [
      {
        type: Input,
      },
    ],
    value: [
      {
        type: Input,
      },
    ],
    disabled: [
      {
        type: Input,
      },
    ],
    selected: [
      {
        type: Input,
      },
    ],
  },
});
/**
 * Material Design list component where each item is a selectable option. Behaves as a listbox.
 */
export class TakSelectionList extends _TakSelectionListBase {
  constructor(_element, _changeDetector, _focusMonitor) {
    super();
    this._element = _element;
    this._changeDetector = _changeDetector;
    this._focusMonitor = _focusMonitor;
    this._multiple = true;
    this._contentInitialized = false;
    /** Emits a change event whenever the selected state of an option changes. */
    this.selectionChange = new EventEmitter();
    /** Theme color of the selection list. This sets the checkbox color for all list options. */
    this.color = 'accent';
    /**
     * Function used for comparing an option against the selected value when determining which
     * options should appear as selected. The first argument is the value of an options. The second
     * one is a value from the selected value. A boolean must be returned.
     */
    this.compareWith = (a1, a2) => a1 === a2;
    this._disabled = false;
    /** The currently selected options. */
    this.selectedOptions = new SelectionModel(this._multiple);
    /** The tabindex of the selection list. */
    this._tabIndex = -1;
    /** View to model callback that should be called whenever the selected options change. */
    this._onChange = _ => {};
    /** Emits when the list has been destroyed. */
    this._destroyed = new Subject();
    /** View to model callback that should be called if the list or its options lost focus. */
    this._onTouched = () => {};
  }
  /** Whether the selection list is disabled. */
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
    // The `TakSelectionList` and `TakListOption` are using the `OnPush` change detection
    // strategy. Therefore the options will not check for any changes if the `TakSelectionList`
    // changed its state. Since we know that a change to `disabled` property of the list affects
    // the state of the options, we manually mark each option for check.
    this._markOptionsForCheck();
  }
  /** Whether selection is limited to one or multiple items (default multiple). */
  get multiple() {
    return this._multiple;
  }
  set multiple(value) {
    const newValue = coerceBooleanProperty(value);
    if (newValue !== this._multiple) {
      if (this._contentInitialized && (typeof ngDevMode === 'undefined' || ngDevMode)) {
        throw new Error(
          'Cannot change `multiple` mode of tak-selection-list after initialization.'
        );
      }
      this._multiple = newValue;
      this.selectedOptions = new SelectionModel(this._multiple, this.selectedOptions.selected);
    }
  }
  ngAfterContentInit() {
    this._contentInitialized = true;
    this._keyManager = new FocusKeyManager(this.options)
      .withWrap()
      .withTypeAhead()
      .withHomeAndEnd()
      // Allow disabled items to be focusable. For accessibility reasons, there must be a way for
      // screen reader users, that allows reading the different options of the list.
      .skipPredicate(() => false)
      .withAllowedModifierKeys(['shiftKey']);
    if (this._value) {
      this._setOptionsFromValues(this._value);
    }
    // If the user attempts to tab out of the selection list, allow focus to escape.
    this._keyManager.tabOut.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._allowFocusEscape();
    });
    // When the number of options change, update the tabindex of the selection list.
    this.options.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
      this._updateTabIndex();
    });
    // Sync external changes to the model back to the options.
    this.selectedOptions.changed.pipe(takeUntil(this._destroyed)).subscribe(event => {
      if (event.added) {
        for (let item of event.added) {
          item.selected = true;
        }
      }
      if (event.removed) {
        for (let item of event.removed) {
          item.selected = false;
        }
      }
    });
    this._focusMonitor
      .monitor(this._element)
      .pipe(takeUntil(this._destroyed))
      .subscribe(origin => {
        if (origin === 'keyboard' || origin === 'program') {
          let toFocus = 0;
          for (let i = 0; i < this.options.length; i++) {
            if (this.options.get(i)?.selected) {
              toFocus = i;
              break;
            }
          }
          this._keyManager.setActiveItem(toFocus);
        }
      });
  }
  ngOnChanges(changes) {
    const disableRippleChanges = changes['disableRipple'];
    const colorChanges = changes['color'];
    if (
      (disableRippleChanges && !disableRippleChanges.firstChange) ||
      (colorChanges && !colorChanges.firstChange)
    ) {
      this._markOptionsForCheck();
    }
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._element);
    this._destroyed.next();
    this._destroyed.complete();
    this._isDestroyed = true;
  }
  /** Focuses the selection list. */
  focus(options) {
    this._element.nativeElement.focus(options);
  }
  /** Selects all of the options. Returns the options that changed as a result. */
  selectAll() {
    return this._setAllOptionsSelected(true);
  }
  /** Deselects all of the options. Returns the options that changed as a result. */
  deselectAll() {
    return this._setAllOptionsSelected(false);
  }
  /** Sets the focused option of the selection-list. */
  _setFocusedOption(option) {
    this._keyManager.updateActiveItem(option);
  }
  /**
   * Removes an option from the selection list and updates the active item.
   * @returns Currently-active item.
   */
  _removeOptionFromList(option) {
    const optionIndex = this._getOptionIndex(option);
    if (optionIndex > -1 && this._keyManager.activeItemIndex === optionIndex) {
      // Check whether the option is the last item
      if (optionIndex > 0) {
        this._keyManager.updateActiveItem(optionIndex - 1);
      } else if (optionIndex === 0 && this.options.length > 1) {
        this._keyManager.updateActiveItem(Math.min(optionIndex + 1, this.options.length - 1));
      }
    }
    return this._keyManager.activeItem;
  }
  /** Passes relevant key presses to our key manager. */
  _keydown(event) {
    const keyCode = event.keyCode;
    const manager = this._keyManager;
    const previousFocusIndex = manager.activeItemIndex;
    const hasModifier = hasModifierKey(event);
    switch (keyCode) {
      case SPACE:
      case ENTER:
        if (!hasModifier && !manager.isTyping()) {
          this._toggleFocusedOption();
          // Always prevent space from scrolling the page since the list has focus
          event.preventDefault();
        }
        break;
      default:
        // The "A" key gets special treatment, because it's used for the "select all" functionality.
        if (
          keyCode === A &&
          this.multiple &&
          hasModifierKey(event, 'ctrlKey') &&
          !manager.isTyping()
        ) {
          const shouldSelect = this.options.some(option => !option.disabled && !option.selected);
          this._setAllOptionsSelected(shouldSelect, true, true);
          event.preventDefault();
        } else {
          manager.onKeydown(event);
        }
    }
    if (
      this.multiple &&
      (keyCode === UP_ARROW || keyCode === DOWN_ARROW) &&
      event.shiftKey &&
      manager.activeItemIndex !== previousFocusIndex
    ) {
      this._toggleFocusedOption();
    }
  }
  /** Reports a value change to the ControlValueAccessor */
  _reportValueChange() {
    // Stop reporting value changes after the list has been destroyed. This avoids
    // cases where the list might wrongly reset its value once it is removed, but
    // the form control is still live.
    if (this.options && !this._isDestroyed) {
      const value = this._getSelectedOptionValues();
      this._onChange(value);
      this._value = value;
    }
  }
  /** Emits a change event if the selected state of an option changed. */
  _emitChangeEvent(options) {
    this.selectionChange.emit(new TakSelectionListChange(this, options));
  }
  /** Implemented as part of ControlValueAccessor. */
  writeValue(values) {
    this._value = values;
    if (this.options) {
      this._setOptionsFromValues(values || []);
    }
  }
  /** Implemented as a part of ControlValueAccessor. */
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
  /** Implemented as part of ControlValueAccessor. */
  registerOnChange(fn) {
    this._onChange = fn;
  }
  /** Implemented as part of ControlValueAccessor. */
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  /** Sets the selected options based on the specified values. */
  _setOptionsFromValues(values) {
    this.options.forEach(option => option._setSelected(false));
    values.forEach(value => {
      const correspondingOption = this.options.find(option => {
        // Skip options that are already in the model. This allows us to handle cases
        // where the same primitive value is selected multiple times.
        return option.selected ? false : this.compareWith(option.value, value);
      });
      if (correspondingOption) {
        correspondingOption._setSelected(true);
      }
    });
  }
  /** Returns the values of the selected options. */
  _getSelectedOptionValues() {
    return this.options.filter(option => option.selected).map(option => option.value);
  }
  /** Toggles the state of the currently focused option if enabled. */
  _toggleFocusedOption() {
    let focusedIndex = this._keyManager.activeItemIndex;
    if (focusedIndex != null && this._isValidIndex(focusedIndex)) {
      let focusedOption = this.options.toArray()[focusedIndex];
      if (focusedOption && !focusedOption.disabled && (this._multiple || !focusedOption.selected)) {
        focusedOption.toggle();
        // Emit a change event because the focused option changed its state through user
        // interaction.
        this._emitChangeEvent([focusedOption]);
      }
    }
  }
  /**
   * Sets the selected state on all of the options
   * and emits an event if anything changed.
   */
  _setAllOptionsSelected(isSelected, skipDisabled, isUserInput) {
    // Keep track of whether anything changed, because we only want to
    // emit the changed event when something actually changed.
    const changedOptions = [];
    this.options.forEach(option => {
      if ((!skipDisabled || !option.disabled) && option._setSelected(isSelected)) {
        changedOptions.push(option);
      }
    });
    if (changedOptions.length) {
      this._reportValueChange();
      if (isUserInput) {
        this._emitChangeEvent(changedOptions);
      }
    }
    return changedOptions;
  }
  /**
   * Utility to ensure all indexes are valid.
   * @param index The index to be checked.
   * @returns True if the index is valid for our list of options.
   */
  _isValidIndex(index) {
    return index >= 0 && index < this.options.length;
  }
  /** Returns the index of the specified list option. */
  _getOptionIndex(option) {
    return this.options.toArray().indexOf(option);
  }
  /** Marks all the options to be checked in the next change detection run. */
  _markOptionsForCheck() {
    if (this.options) {
      this.options.forEach(option => option._markForCheck());
    }
  }
  /**
   * Removes the tabindex from the selection list and resets it back afterwards, allowing the user
   * to tab out of it. This prevents the list from capturing focus and redirecting it back within
   * the list, creating a focus trap if it user tries to tab away.
   */
  _allowFocusEscape() {
    this._tabIndex = -1;
    setTimeout(() => {
      this._tabIndex = 0;
      this._changeDetector.markForCheck();
    });
  }
  /** Updates the tabindex based upon if the selection list is empty. */
  _updateTabIndex() {
    this._tabIndex = this.options.length === 0 ? -1 : 0;
  }
}
TakSelectionList.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakSelectionList,
  deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i3.FocusMonitor }],
  target: i0.ɵɵFactoryTarget.Component,
});
TakSelectionList.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakSelectionList,
  selector: 'tak-selection-list',
  inputs: {
    disableRipple: 'disableRipple',
    color: 'color',
    compareWith: 'compareWith',
    disabled: 'disabled',
    multiple: 'multiple',
  },
  outputs: { selectionChange: 'selectionChange' },
  host: {
    attributes: { role: 'listbox' },
    listeners: { keydown: '_keydown($event)' },
    properties: {
      'attr.aria-multiselectable': 'multiple',
      'attr.aria-disabled': 'disabled.toString()',
      'attr.tabindex': '_tabIndex',
    },
    classAttribute: 'tak-selection-list tak-list-base',
  },
  providers: [TAK_SELECTION_LIST_VALUE_ACCESSOR],
  queries: [{ propertyName: 'options', predicate: TakListOption, descendants: true }],
  exportAs: ['takSelectionList'],
  usesInheritance: true,
  usesOnChanges: true,
  ngImport: i0,
  template: '<ng-content></ng-content>',
  isInline: true,
  styles: [
    '.tak-subheader{display:flex;box-sizing:border-box;padding:16px;align-items:center}.tak-list-base .tak-subheader{margin:0}button.tak-list-item,button.tak-list-option{padding:0;width:100%;background:none;color:inherit;border:none;outline:inherit;-webkit-tap-highlight-color:rgba(0,0,0,0);text-align:left}[dir=rtl] button.tak-list-item,[dir=rtl] button.tak-list-option{text-align:right}button.tak-list-item::-moz-focus-inner,button.tak-list-option::-moz-focus-inner{border:0}.tak-list-base{padding-top:8px;display:block;-webkit-tap-highlight-color:rgba(0,0,0,0)}.tak-list-base .tak-subheader{height:48px;line-height:16px}.tak-list-base .tak-subheader:first-child{margin-top:-8px}.tak-list-base .tak-list-item,.tak-list-base .tak-list-option{display:block;height:48px;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;padding:0}.tak-list-base .tak-list-item .tak-list-item-content,.tak-list-base .tak-list-option .tak-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.tak-list-base .tak-list-item .tak-list-item-content-reverse,.tak-list-base .tak-list-option .tak-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.tak-list-base .tak-list-item .tak-list-item-ripple,.tak-list-base .tak-list-option .tak-list-item-ripple{display:block;top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.tak-list-base .tak-list-item.tak-list-item-with-avatar,.tak-list-base .tak-list-option.tak-list-item-with-avatar{height:56px}.tak-list-base .tak-list-item.tak-2-line,.tak-list-base .tak-list-option.tak-2-line{height:72px}.tak-list-base .tak-list-item.tak-3-line,.tak-list-base .tak-list-option.tak-3-line{height:88px}.tak-list-base .tak-list-item.tak-multi-line,.tak-list-base .tak-list-option.tak-multi-line{height:auto}.tak-list-base .tak-list-item.tak-multi-line .tak-list-item-content,.tak-list-base .tak-list-option.tak-multi-line .tak-list-item-content{padding-top:16px;padding-bottom:16px}.tak-list-base .tak-list-item .tak-list-text,.tak-list-base .tak-list-option .tak-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden;padding:0}.tak-list-base .tak-list-item .tak-list-text>*,.tak-list-base .tak-list-option .tak-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.tak-list-base .tak-list-item .tak-list-text:empty,.tak-list-base .tak-list-option .tak-list-text:empty{display:none}.tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:0;padding-left:16px}[dir=rtl] .tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:0}.tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-left:0;padding-right:16px}[dir=rtl] .tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-right:0;padding-left:16px}.tak-list-base .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:16px}.tak-list-base .tak-list-item .tak-list-avatar,.tak-list-base .tak-list-option .tak-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%;object-fit:cover}.tak-list-base .tak-list-item .tak-list-avatar~.tak-divider-inset,.tak-list-base .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:72px;width:calc(100% - 72px)}[dir=rtl] .tak-list-base .tak-list-item .tak-list-avatar~.tak-divider-inset,[dir=rtl] .tak-list-base .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:auto;margin-right:72px}.tak-list-base .tak-list-item .tak-list-icon,.tak-list-base .tak-list-option .tak-list-icon{flex-shrink:0;width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.tak-list-base .tak-list-item .tak-list-icon~.tak-divider-inset,.tak-list-base .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:64px;width:calc(100% - 64px)}[dir=rtl] .tak-list-base .tak-list-item .tak-list-icon~.tak-divider-inset,[dir=rtl] .tak-list-base .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:auto;margin-right:64px}.tak-list-base .tak-list-item .tak-divider,.tak-list-base .tak-list-option .tak-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .tak-list-base .tak-list-item .tak-divider,[dir=rtl] .tak-list-base .tak-list-option .tak-divider{margin-left:auto;margin-right:0}.tak-list-base .tak-list-item .tak-divider.tak-divider-inset,.tak-list-base .tak-list-option .tak-divider.tak-divider-inset{position:absolute}.tak-list-base[dense]{padding-top:4px;display:block}.tak-list-base[dense] .tak-subheader{height:40px;line-height:8px}.tak-list-base[dense] .tak-subheader:first-child{margin-top:-4px}.tak-list-base[dense] .tak-list-item,.tak-list-base[dense] .tak-list-option{display:block;height:40px;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;padding:0}.tak-list-base[dense] .tak-list-item .tak-list-item-content,.tak-list-base[dense] .tak-list-option .tak-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.tak-list-base[dense] .tak-list-item .tak-list-item-content-reverse,.tak-list-base[dense] .tak-list-option .tak-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.tak-list-base[dense] .tak-list-item .tak-list-item-ripple,.tak-list-base[dense] .tak-list-option .tak-list-item-ripple{display:block;top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar{height:48px}.tak-list-base[dense] .tak-list-item.tak-2-line,.tak-list-base[dense] .tak-list-option.tak-2-line{height:60px}.tak-list-base[dense] .tak-list-item.tak-3-line,.tak-list-base[dense] .tak-list-option.tak-3-line{height:76px}.tak-list-base[dense] .tak-list-item.tak-multi-line,.tak-list-base[dense] .tak-list-option.tak-multi-line{height:auto}.tak-list-base[dense] .tak-list-item.tak-multi-line .tak-list-item-content,.tak-list-base[dense] .tak-list-option.tak-multi-line .tak-list-item-content{padding-top:16px;padding-bottom:16px}.tak-list-base[dense] .tak-list-item .tak-list-text,.tak-list-base[dense] .tak-list-option .tak-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden;padding:0}.tak-list-base[dense] .tak-list-item .tak-list-text>*,.tak-list-base[dense] .tak-list-option .tak-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.tak-list-base[dense] .tak-list-item .tak-list-text:empty,.tak-list-base[dense] .tak-list-option .tak-list-text:empty{display:none}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:0;padding-left:16px}[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:0}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-left:0;padding-right:16px}[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-right:0;padding-left:16px}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:16px}.tak-list-base[dense] .tak-list-item .tak-list-avatar,.tak-list-base[dense] .tak-list-option .tak-list-avatar{flex-shrink:0;width:36px;height:36px;border-radius:50%;object-fit:cover}.tak-list-base[dense] .tak-list-item .tak-list-avatar~.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:68px;width:calc(100% - 68px)}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-list-avatar~.tak-divider-inset,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:auto;margin-right:68px}.tak-list-base[dense] .tak-list-item .tak-list-icon,.tak-list-base[dense] .tak-list-option .tak-list-icon{flex-shrink:0;width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.tak-list-base[dense] .tak-list-item .tak-list-icon~.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:60px;width:calc(100% - 60px)}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-list-icon~.tak-divider-inset,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:auto;margin-right:60px}.tak-list-base[dense] .tak-list-item .tak-divider,.tak-list-base[dense] .tak-list-option .tak-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-divider,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-divider{margin-left:auto;margin-right:0}.tak-list-base[dense] .tak-list-item .tak-divider.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-divider.tak-divider-inset{position:absolute}.tak-nav-list a{text-decoration:none;color:inherit}.tak-nav-list .tak-list-item{cursor:pointer;outline:none}tak-action-list .tak-list-item{cursor:pointer;outline:inherit}.tak-list-option:not(.tak-list-item-disabled){cursor:pointer;outline:none}.tak-list-item-disabled{pointer-events:none}.cdk-high-contrast-active .tak-list-item-disabled{opacity:.5}.cdk-high-contrast-active :host .tak-list-item-disabled{opacity:.5}.cdk-high-contrast-active .tak-list-option:hover,.cdk-high-contrast-active .tak-nav-list .tak-list-item:hover,.cdk-high-contrast-active tak-action-list .tak-list-item:hover{outline:dotted 1px;z-index:1}.cdk-high-contrast-active .tak-list-single-selected-option::after{content:"";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}.cdk-high-contrast-active [dir=rtl] .tak-list-single-selected-option::after{right:auto;left:16px}@media(hover: none){.tak-list-option:not(.tak-list-single-selected-option):not(.tak-list-item-disabled):hover,.tak-nav-list .tak-list-item:not(.tak-list-item-disabled):hover,.tak-action-list .tak-list-item:not(.tak-list-item-disabled):hover{background:none}}',
  ],
  changeDetection: i0.ChangeDetectionStrategy.OnPush,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakSelectionList,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'tak-selection-list',
          exportAs: 'takSelectionList',
          inputs: ['disableRipple'],
          host: {
            role: 'listbox',
            class: 'tak-selection-list tak-list-base',
            '(keydown)': '_keydown($event)',
            '[attr.aria-multiselectable]': 'multiple',
            '[attr.aria-disabled]': 'disabled.toString()',
            '[attr.tabindex]': '_tabIndex',
          },
          template: '<ng-content></ng-content>',
          encapsulation: ViewEncapsulation.None,
          providers: [TAK_SELECTION_LIST_VALUE_ACCESSOR],
          changeDetection: ChangeDetectionStrategy.OnPush,
          styles: [
            '.tak-subheader{display:flex;box-sizing:border-box;padding:16px;align-items:center}.tak-list-base .tak-subheader{margin:0}button.tak-list-item,button.tak-list-option{padding:0;width:100%;background:none;color:inherit;border:none;outline:inherit;-webkit-tap-highlight-color:rgba(0,0,0,0);text-align:left}[dir=rtl] button.tak-list-item,[dir=rtl] button.tak-list-option{text-align:right}button.tak-list-item::-moz-focus-inner,button.tak-list-option::-moz-focus-inner{border:0}.tak-list-base{padding-top:8px;display:block;-webkit-tap-highlight-color:rgba(0,0,0,0)}.tak-list-base .tak-subheader{height:48px;line-height:16px}.tak-list-base .tak-subheader:first-child{margin-top:-8px}.tak-list-base .tak-list-item,.tak-list-base .tak-list-option{display:block;height:48px;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;padding:0}.tak-list-base .tak-list-item .tak-list-item-content,.tak-list-base .tak-list-option .tak-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.tak-list-base .tak-list-item .tak-list-item-content-reverse,.tak-list-base .tak-list-option .tak-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.tak-list-base .tak-list-item .tak-list-item-ripple,.tak-list-base .tak-list-option .tak-list-item-ripple{display:block;top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.tak-list-base .tak-list-item.tak-list-item-with-avatar,.tak-list-base .tak-list-option.tak-list-item-with-avatar{height:56px}.tak-list-base .tak-list-item.tak-2-line,.tak-list-base .tak-list-option.tak-2-line{height:72px}.tak-list-base .tak-list-item.tak-3-line,.tak-list-base .tak-list-option.tak-3-line{height:88px}.tak-list-base .tak-list-item.tak-multi-line,.tak-list-base .tak-list-option.tak-multi-line{height:auto}.tak-list-base .tak-list-item.tak-multi-line .tak-list-item-content,.tak-list-base .tak-list-option.tak-multi-line .tak-list-item-content{padding-top:16px;padding-bottom:16px}.tak-list-base .tak-list-item .tak-list-text,.tak-list-base .tak-list-option .tak-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden;padding:0}.tak-list-base .tak-list-item .tak-list-text>*,.tak-list-base .tak-list-option .tak-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.tak-list-base .tak-list-item .tak-list-text:empty,.tak-list-base .tak-list-option .tak-list-text:empty{display:none}.tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:0;padding-left:16px}[dir=rtl] .tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:0}.tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-left:0;padding-right:16px}[dir=rtl] .tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-right:0;padding-left:16px}.tak-list-base .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:16px}.tak-list-base .tak-list-item .tak-list-avatar,.tak-list-base .tak-list-option .tak-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%;object-fit:cover}.tak-list-base .tak-list-item .tak-list-avatar~.tak-divider-inset,.tak-list-base .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:72px;width:calc(100% - 72px)}[dir=rtl] .tak-list-base .tak-list-item .tak-list-avatar~.tak-divider-inset,[dir=rtl] .tak-list-base .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:auto;margin-right:72px}.tak-list-base .tak-list-item .tak-list-icon,.tak-list-base .tak-list-option .tak-list-icon{flex-shrink:0;width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.tak-list-base .tak-list-item .tak-list-icon~.tak-divider-inset,.tak-list-base .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:64px;width:calc(100% - 64px)}[dir=rtl] .tak-list-base .tak-list-item .tak-list-icon~.tak-divider-inset,[dir=rtl] .tak-list-base .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:auto;margin-right:64px}.tak-list-base .tak-list-item .tak-divider,.tak-list-base .tak-list-option .tak-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .tak-list-base .tak-list-item .tak-divider,[dir=rtl] .tak-list-base .tak-list-option .tak-divider{margin-left:auto;margin-right:0}.tak-list-base .tak-list-item .tak-divider.tak-divider-inset,.tak-list-base .tak-list-option .tak-divider.tak-divider-inset{position:absolute}.tak-list-base[dense]{padding-top:4px;display:block}.tak-list-base[dense] .tak-subheader{height:40px;line-height:8px}.tak-list-base[dense] .tak-subheader:first-child{margin-top:-4px}.tak-list-base[dense] .tak-list-item,.tak-list-base[dense] .tak-list-option{display:block;height:40px;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;padding:0}.tak-list-base[dense] .tak-list-item .tak-list-item-content,.tak-list-base[dense] .tak-list-option .tak-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.tak-list-base[dense] .tak-list-item .tak-list-item-content-reverse,.tak-list-base[dense] .tak-list-option .tak-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.tak-list-base[dense] .tak-list-item .tak-list-item-ripple,.tak-list-base[dense] .tak-list-option .tak-list-item-ripple{display:block;top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar{height:48px}.tak-list-base[dense] .tak-list-item.tak-2-line,.tak-list-base[dense] .tak-list-option.tak-2-line{height:60px}.tak-list-base[dense] .tak-list-item.tak-3-line,.tak-list-base[dense] .tak-list-option.tak-3-line{height:76px}.tak-list-base[dense] .tak-list-item.tak-multi-line,.tak-list-base[dense] .tak-list-option.tak-multi-line{height:auto}.tak-list-base[dense] .tak-list-item.tak-multi-line .tak-list-item-content,.tak-list-base[dense] .tak-list-option.tak-multi-line .tak-list-item-content{padding-top:16px;padding-bottom:16px}.tak-list-base[dense] .tak-list-item .tak-list-text,.tak-list-base[dense] .tak-list-option .tak-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden;padding:0}.tak-list-base[dense] .tak-list-item .tak-list-text>*,.tak-list-base[dense] .tak-list-option .tak-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.tak-list-base[dense] .tak-list-item .tak-list-text:empty,.tak-list-base[dense] .tak-list-option .tak-list-text:empty{display:none}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:0;padding-left:16px}[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:0}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-left:0;padding-right:16px}[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-right:0;padding-left:16px}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:16px}.tak-list-base[dense] .tak-list-item .tak-list-avatar,.tak-list-base[dense] .tak-list-option .tak-list-avatar{flex-shrink:0;width:36px;height:36px;border-radius:50%;object-fit:cover}.tak-list-base[dense] .tak-list-item .tak-list-avatar~.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:68px;width:calc(100% - 68px)}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-list-avatar~.tak-divider-inset,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:auto;margin-right:68px}.tak-list-base[dense] .tak-list-item .tak-list-icon,.tak-list-base[dense] .tak-list-option .tak-list-icon{flex-shrink:0;width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.tak-list-base[dense] .tak-list-item .tak-list-icon~.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:60px;width:calc(100% - 60px)}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-list-icon~.tak-divider-inset,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:auto;margin-right:60px}.tak-list-base[dense] .tak-list-item .tak-divider,.tak-list-base[dense] .tak-list-option .tak-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-divider,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-divider{margin-left:auto;margin-right:0}.tak-list-base[dense] .tak-list-item .tak-divider.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-divider.tak-divider-inset{position:absolute}.tak-nav-list a{text-decoration:none;color:inherit}.tak-nav-list .tak-list-item{cursor:pointer;outline:none}tak-action-list .tak-list-item{cursor:pointer;outline:inherit}.tak-list-option:not(.tak-list-item-disabled){cursor:pointer;outline:none}.tak-list-item-disabled{pointer-events:none}.cdk-high-contrast-active .tak-list-item-disabled{opacity:.5}.cdk-high-contrast-active :host .tak-list-item-disabled{opacity:.5}.cdk-high-contrast-active .tak-list-option:hover,.cdk-high-contrast-active .tak-nav-list .tak-list-item:hover,.cdk-high-contrast-active tak-action-list .tak-list-item:hover{outline:dotted 1px;z-index:1}.cdk-high-contrast-active .tak-list-single-selected-option::after{content:"";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}.cdk-high-contrast-active [dir=rtl] .tak-list-single-selected-option::after{right:auto;left:16px}@media(hover: none){.tak-list-option:not(.tak-list-single-selected-option):not(.tak-list-item-disabled):hover,.tak-nav-list .tak-list-item:not(.tak-list-item-disabled):hover,.tak-action-list .tak-list-item:not(.tak-list-item-disabled):hover{background:none}}',
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i3.FocusMonitor }];
  },
  propDecorators: {
    options: [
      {
        type: ContentChildren,
        args: [TakListOption, { descendants: true }],
      },
    ],
    selectionChange: [
      {
        type: Output,
      },
    ],
    color: [
      {
        type: Input,
      },
    ],
    compareWith: [
      {
        type: Input,
      },
    ],
    disabled: [
      {
        type: Input,
      },
    ],
    multiple: [
      {
        type: Input,
      },
    ],
  },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLWxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC9zZWxlY3Rpb24tbGlzdC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9saXN0L2xpc3Qtb3B0aW9uLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFrQixlQUFlLEVBQUUsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakYsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVGLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBSUwsTUFBTSxFQUNOLFNBQVMsRUFFVCxTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBRUwsT0FBTyxFQUNQLGtCQUFrQixFQUNsQixRQUFRLEdBRVQsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEQsT0FBTyxFQUFDLHlCQUF5QixFQUFFLHVCQUF1QixFQUFDLE1BQU0sUUFBUSxDQUFDOzs7OztBQUUx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d0JBQ2pCLE9BQU8sRUFBRSxrQ0FBa0M7d0JBQzNDLFdBQVcsRUFBRSxrQkFBa0I7d0JBQy9CLDZCQUE2QixFQUFFLFVBQVU7d0JBQ3pDLHNCQUFzQixFQUFFLHFCQUFxQjt3QkFDN0MsaUJBQWlCLEVBQUUsV0FBVztxQkFDL0IsWUFDUywyQkFBMkIsaUJBRXRCLGlCQUFpQixDQUFDLElBQUksYUFDMUIsQ0FBQyxpQ0FBaUMsQ0FBQyxtQkFDN0IsdUJBQXVCLENBQUMsTUFBTTs0SkFhTSxPQUFPO3NCQUEzRCxlQUFlO3VCQUFDLGFBQWEsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7Z0JBR2hDLGVBQWU7c0JBQWpDLE1BQU07Z0JBSUUsS0FBSztzQkFBYixLQUFLO2dCQU9HLFdBQVc7c0JBQW5CLEtBQUs7Z0JBSUYsUUFBUTtzQkFEWCxLQUFLO2dCQWlCRixRQUFRO3NCQURYLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c2FibGVPcHRpb24sIEZvY3VzS2V5TWFuYWdlciwgRm9jdXNNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7QSwgRE9XTl9BUlJPVywgRU5URVIsIGhhc01vZGlmaWVyS2V5LCBTUEFDRSwgVVBfQVJST1d9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIE1hdExpbmUsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgc2V0TGluZXMsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyLCBNYXRMaXN0SWNvbkNzc01hdFN0eWxlcn0gZnJvbSAnLi9saXN0JztcblxuY29uc3QgX01hdFNlbGVjdGlvbkxpc3RCYXNlID0gbWl4aW5EaXNhYmxlUmlwcGxlKGNsYXNzIHt9KTtcbmNvbnN0IF9NYXRMaXN0T3B0aW9uQmFzZSA9IG1peGluRGlzYWJsZVJpcHBsZShjbGFzcyB7fSk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX1NFTEVDVElPTl9MSVNUX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRTZWxlY3Rpb25MaXN0KSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKiogQ2hhbmdlIGV2ZW50IHRoYXQgaXMgYmVpbmcgZmlyZWQgd2hlbmV2ZXIgdGhlIHNlbGVjdGVkIHN0YXRlIG9mIGFuIG9wdGlvbiBjaGFuZ2VzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdGlvbkxpc3RDaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBzZWxlY3Rpb24gbGlzdCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdFNlbGVjdGlvbkxpc3QsXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgb3B0aW9ucyB0aGF0IGhhdmUgYmVlbiBjaGFuZ2VkLiAqL1xuICAgIHB1YmxpYyBvcHRpb25zOiBNYXRMaXN0T3B0aW9uW10sXG4gICkge31cbn1cblxuLyoqXG4gKiBUeXBlIGRlc2NyaWJpbmcgcG9zc2libGUgcG9zaXRpb25zIG9mIGEgY2hlY2tib3ggaW4gYSBsaXN0IG9wdGlvblxuICogd2l0aCByZXNwZWN0IHRvIHRoZSBsaXN0IGl0ZW0ncyB0ZXh0LlxuICovXG5leHBvcnQgdHlwZSBNYXRMaXN0T3B0aW9uQ2hlY2tib3hQb3NpdGlvbiA9ICdiZWZvcmUnIHwgJ2FmdGVyJztcblxuLyoqXG4gKiBDb21wb25lbnQgZm9yIGxpc3Qtb3B0aW9ucyBvZiBzZWxlY3Rpb24tbGlzdC4gRWFjaCBsaXN0LW9wdGlvbiBjYW4gYXV0b21hdGljYWxseVxuICogZ2VuZXJhdGUgYSBjaGVja2JveCBhbmQgY2FuIHB1dCBjdXJyZW50IGl0ZW0gaW50byB0aGUgc2VsZWN0aW9uTW9kZWwgb2Ygc2VsZWN0aW9uLWxpc3RcbiAqIGlmIHRoZSBjdXJyZW50IGl0ZW0gaXMgc2VsZWN0ZWQuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1saXN0LW9wdGlvbicsXG4gIGV4cG9ydEFzOiAnbWF0TGlzdE9wdGlvbicsXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJ10sXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdvcHRpb24nLFxuICAgICdjbGFzcyc6ICdtYXQtbGlzdC1pdGVtIG1hdC1saXN0LW9wdGlvbiBtYXQtZm9jdXMtaW5kaWNhdG9yJyxcbiAgICAnKGZvY3VzKSc6ICdfaGFuZGxlRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfaGFuZGxlQmx1cigpJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soKScsXG4gICAgJ1tjbGFzcy5tYXQtbGlzdC1pdGVtLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbGlzdC1pdGVtLXdpdGgtYXZhdGFyXSc6ICdfYXZhdGFyIHx8IF9pY29uJyxcbiAgICAvLyBNYW51YWxseSBzZXQgdGhlIFwicHJpbWFyeVwiIG9yIFwid2FyblwiIGNsYXNzIGlmIHRoZSBjb2xvciBoYXMgYmVlbiBleHBsaWNpdGx5XG4gICAgLy8gc2V0IHRvIFwicHJpbWFyeVwiIG9yIFwid2FyblwiLiBUaGUgcHNldWRvIGNoZWNrYm94IHBpY2tzIHVwIHRoZXNlIGNsYXNzZXMgZm9yXG4gICAgLy8gaXRzIHRoZW1lLlxuICAgICdbY2xhc3MubWF0LXByaW1hcnldJzogJ2NvbG9yID09PSBcInByaW1hcnlcIicsXG4gICAgLy8gRXZlbiB0aG91Z2ggYWNjZW50IGlzIHRoZSBkZWZhdWx0LCB3ZSBuZWVkIHRvIHNldCB0aGlzIGNsYXNzIGFueXdheSwgYmVjYXVzZSB0aGUgIGxpc3QgbWlnaHRcbiAgICAvLyBiZSBwbGFjZWQgaW5zaWRlIGEgcGFyZW50IHRoYXQgaGFzIG9uZSBvZiB0aGUgb3RoZXIgY29sb3JzIHdpdGggYSBoaWdoZXIgc3BlY2lmaWNpdHkuXG4gICAgJ1tjbGFzcy5tYXQtYWNjZW50XSc6ICdjb2xvciAhPT0gXCJwcmltYXJ5XCIgJiYgY29sb3IgIT09IFwid2FyblwiJyxcbiAgICAnW2NsYXNzLm1hdC13YXJuXSc6ICdjb2xvciA9PT0gXCJ3YXJuXCInLFxuICAgICdbY2xhc3MubWF0LWxpc3Qtc2luZ2xlLXNlbGVjdGVkLW9wdGlvbl0nOiAnc2VsZWN0ZWQgJiYgIXNlbGVjdGlvbkxpc3QubXVsdGlwbGUnLFxuICAgICdbYXR0ci5hcmlhLXNlbGVjdGVkXSc6ICdzZWxlY3RlZCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJy0xJyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICdsaXN0LW9wdGlvbi5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdExpc3RPcHRpb25cbiAgZXh0ZW5kcyBfTWF0TGlzdE9wdGlvbkJhc2VcbiAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgRm9jdXNhYmxlT3B0aW9uLCBDYW5EaXNhYmxlUmlwcGxlXG57XG4gIHByaXZhdGUgX3NlbGVjdGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2hhc0ZvY3VzID0gZmFsc2U7XG5cbiAgQENvbnRlbnRDaGlsZChNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyKSBfYXZhdGFyOiBNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyO1xuICBAQ29udGVudENoaWxkKE1hdExpc3RJY29uQ3NzTWF0U3R5bGVyKSBfaWNvbjogTWF0TGlzdEljb25Dc3NNYXRTdHlsZXI7XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TGluZSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2xpbmVzOiBRdWVyeUxpc3Q8TWF0TGluZT47XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHNlbGVjdGVkIHN0YXRlIG9mIHRoZSBvcHRpb24gaGFzIGNoYW5nZWQuXG4gICAqIFVzZSB0byBmYWNpbGl0YXRlIHR3by1kYXRhIGJpbmRpbmcgdG8gdGhlIGBzZWxlY3RlZGAgcHJvcGVydHkuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBzZWxlY3RlZENoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIC8qKiBET00gZWxlbWVudCBjb250YWluaW5nIHRoZSBpdGVtJ3MgdGV4dC4gKi9cbiAgQFZpZXdDaGlsZCgndGV4dCcpIF90ZXh0OiBFbGVtZW50UmVmO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgYXBwZWFyIGJlZm9yZSBvciBhZnRlciB0aGUgY2hlY2tib3guIERlZmF1bHRzIHRvICdhZnRlcicgKi9cbiAgQElucHV0KCkgY2hlY2tib3hQb3NpdGlvbjogTWF0TGlzdE9wdGlvbkNoZWNrYm94UG9zaXRpb24gPSAnYWZ0ZXInO1xuXG4gIC8qKiBUaGVtZSBjb2xvciBvZiB0aGUgbGlzdCBvcHRpb24uIFRoaXMgc2V0cyB0aGUgY29sb3Igb2YgdGhlIGNoZWNrYm94LiAqL1xuICBASW5wdXQoKVxuICBnZXQgY29sb3IoKTogVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5fY29sb3IgfHwgdGhpcy5zZWxlY3Rpb25MaXN0LmNvbG9yO1xuICB9XG4gIHNldCBjb2xvcihuZXdWYWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgdGhpcy5fY29sb3IgPSBuZXdWYWx1ZTtcbiAgfVxuICBwcml2YXRlIF9jb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKlxuICAgKiBUaGlzIGlzIHNldCB0byB0cnVlIGFmdGVyIHRoZSBmaXJzdCBPbkNoYW5nZXMgY3ljbGUgc28gd2UgZG9uJ3QgY2xlYXIgdGhlIHZhbHVlIG9mIGBzZWxlY3RlZGBcbiAgICogaW4gdGhlIGZpcnN0IGN5Y2xlLlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5wdXRzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgLyoqIFZhbHVlIG9mIHRoZSBvcHRpb24gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5zZWxlY3RlZCAmJlxuICAgICAgIXRoaXMuc2VsZWN0aW9uTGlzdC5jb21wYXJlV2l0aChuZXdWYWx1ZSwgdGhpcy52YWx1ZSkgJiZcbiAgICAgIHRoaXMuX2lucHV0c0luaXRpYWxpemVkXG4gICAgKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgfVxuICBwcml2YXRlIF92YWx1ZTogYW55O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBvcHRpb24gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQgfHwgKHRoaXMuc2VsZWN0aW9uTGlzdCAmJiB0aGlzLnNlbGVjdGlvbkxpc3QuZGlzYWJsZWQpO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fZGlzYWJsZWQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBvcHRpb24gaXMgc2VsZWN0ZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25MaXN0LnNlbGVjdGVkT3B0aW9ucy5pc1NlbGVjdGVkKHRoaXMpO1xuICB9XG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAoaXNTZWxlY3RlZCAhPT0gdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NldFNlbGVjdGVkKGlzU2VsZWN0ZWQpO1xuXG4gICAgICBpZiAoaXNTZWxlY3RlZCB8fCB0aGlzLnNlbGVjdGlvbkxpc3QubXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25MaXN0Ll9yZXBvcnRWYWx1ZUNoYW5nZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBNYXRTZWxlY3Rpb25MaXN0KSkgcHVibGljIHNlbGVjdGlvbkxpc3Q6IE1hdFNlbGVjdGlvbkxpc3QsXG4gICkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5zZWxlY3Rpb25MaXN0O1xuXG4gICAgaWYgKGxpc3QuX3ZhbHVlICYmIGxpc3QuX3ZhbHVlLnNvbWUodmFsdWUgPT4gbGlzdC5jb21wYXJlV2l0aCh0aGlzLl92YWx1ZSwgdmFsdWUpKSkge1xuICAgICAgdGhpcy5fc2V0U2VsZWN0ZWQodHJ1ZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd2FzU2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3RlZDtcblxuICAgIC8vIExpc3Qgb3B0aW9ucyB0aGF0IGFyZSBzZWxlY3RlZCBhdCBpbml0aWFsaXphdGlvbiBjYW4ndCBiZSByZXBvcnRlZCBwcm9wZXJseSB0byB0aGUgZm9ybVxuICAgIC8vIGNvbnRyb2wuIFRoaXMgaXMgYmVjYXVzZSBpdCB0YWtlcyBzb21lIHRpbWUgdW50aWwgdGhlIHNlbGVjdGlvbi1saXN0IGtub3dzIGFib3V0IGFsbFxuICAgIC8vIGF2YWlsYWJsZSBvcHRpb25zLiBBbHNvIGl0IGNhbiBoYXBwZW4gdGhhdCB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaGFzIGFuIGluaXRpYWwgdmFsdWVcbiAgICAvLyB0aGF0IHNob3VsZCBiZSB1c2VkIGluc3RlYWQuIERlZmVycmluZyB0aGUgdmFsdWUgY2hhbmdlIHJlcG9ydCB0byB0aGUgbmV4dCB0aWNrIGVuc3VyZXNcbiAgICAvLyB0aGF0IHRoZSBmb3JtIGNvbnRyb2wgdmFsdWUgaXMgbm90IGJlaW5nIG92ZXJ3cml0dGVuLlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkIHx8IHdhc1NlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl9pbnB1dHNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgc2V0TGluZXModGhpcy5fbGluZXMsIHRoaXMuX2VsZW1lbnQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgIC8vIFdlIGhhdmUgdG8gZGVsYXkgdGhpcyB1bnRpbCB0aGUgbmV4dCB0aWNrIGluIG9yZGVyXG4gICAgICAvLyB0byBhdm9pZCBjaGFuZ2VkIGFmdGVyIGNoZWNrZWQgZXJyb3JzLlxuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGhhZEZvY3VzID0gdGhpcy5faGFzRm9jdXM7XG4gICAgY29uc3QgbmV3QWN0aXZlSXRlbSA9IHRoaXMuc2VsZWN0aW9uTGlzdC5fcmVtb3ZlT3B0aW9uRnJvbUxpc3QodGhpcyk7XG5cbiAgICAvLyBPbmx5IG1vdmUgZm9jdXMgaWYgdGhpcyBvcHRpb24gd2FzIGZvY3VzZWQgYXQgdGhlIHRpbWUgaXQgd2FzIGRlc3Ryb3llZC5cbiAgICBpZiAoaGFkRm9jdXMgJiYgbmV3QWN0aXZlSXRlbSkge1xuICAgICAgbmV3QWN0aXZlSXRlbS5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSBzZWxlY3Rpb24gc3RhdGUgb2YgdGhlIG9wdGlvbi4gKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0ZWQgPSAhdGhpcy5zZWxlY3RlZDtcbiAgfVxuXG4gIC8qKiBBbGxvd3MgZm9yIHByb2dyYW1tYXRpYyBmb2N1c2luZyBvZiB0aGUgb3B0aW9uLiAqL1xuICBmb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBsaXN0IGl0ZW0ncyB0ZXh0IGxhYmVsLiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgdGhlIEZvY3VzS2V5TWFuYWdlci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0TGFiZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RleHQgPyB0aGlzLl90ZXh0Lm5hdGl2ZUVsZW1lbnQudGV4dENvbnRlbnQgfHwgJycgOiAnJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgbGlzdCBpdGVtIHNob3VsZCBzaG93IGEgcmlwcGxlIGVmZmVjdCB3aGVuIGNsaWNrZWQuICovXG4gIF9pc1JpcHBsZURpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVJpcHBsZSB8fCB0aGlzLnNlbGVjdGlvbkxpc3QuZGlzYWJsZVJpcHBsZTtcbiAgfVxuXG4gIF9oYW5kbGVDbGljaygpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgKHRoaXMuc2VsZWN0aW9uTGlzdC5tdWx0aXBsZSB8fCAhdGhpcy5zZWxlY3RlZCkpIHtcbiAgICAgIHRoaXMudG9nZ2xlKCk7XG5cbiAgICAgIC8vIEVtaXQgYSBjaGFuZ2UgZXZlbnQgaWYgdGhlIHNlbGVjdGVkIHN0YXRlIG9mIHRoZSBvcHRpb24gY2hhbmdlZCB0aHJvdWdoIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgICB0aGlzLnNlbGVjdGlvbkxpc3QuX2VtaXRDaGFuZ2VFdmVudChbdGhpc10pO1xuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVGb2N1cygpIHtcbiAgICB0aGlzLnNlbGVjdGlvbkxpc3QuX3NldEZvY3VzZWRPcHRpb24odGhpcyk7XG4gICAgdGhpcy5faGFzRm9jdXMgPSB0cnVlO1xuICB9XG5cbiAgX2hhbmRsZUJsdXIoKSB7XG4gICAgdGhpcy5zZWxlY3Rpb25MaXN0Ll9vblRvdWNoZWQoKTtcbiAgICB0aGlzLl9oYXNGb2N1cyA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIFJldHJpZXZlcyB0aGUgRE9NIGVsZW1lbnQgb2YgdGhlIGNvbXBvbmVudCBob3N0LiAqL1xuICBfZ2V0SG9zdEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgc2VsZWN0ZWQgc3RhdGUgb2YgdGhlIG9wdGlvbi4gUmV0dXJucyB3aGV0aGVyIHRoZSB2YWx1ZSBoYXMgY2hhbmdlZC4gKi9cbiAgX3NldFNlbGVjdGVkKHNlbGVjdGVkOiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgaWYgKHNlbGVjdGVkID09PSB0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuX3NlbGVjdGVkID0gc2VsZWN0ZWQ7XG5cbiAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uTGlzdC5zZWxlY3RlZE9wdGlvbnMuc2VsZWN0KHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkxpc3Quc2VsZWN0ZWRPcHRpb25zLmRlc2VsZWN0KHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdChzZWxlY3RlZCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogTm90aWZpZXMgQW5ndWxhciB0aGF0IHRoZSBvcHRpb24gbmVlZHMgdG8gYmUgY2hlY2tlZCBpbiB0aGUgbmV4dCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bi4gTWFpbmx5XG4gICAqIHVzZWQgdG8gdHJpZ2dlciBhbiB1cGRhdGUgb2YgdGhlIGxpc3Qgb3B0aW9uIGlmIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiB0aGUgc2VsZWN0aW9uIGxpc3RcbiAgICogY2hhbmdlZC5cbiAgICovXG4gIF9tYXJrRm9yQ2hlY2soKSB7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBNYXRlcmlhbCBEZXNpZ24gbGlzdCBjb21wb25lbnQgd2hlcmUgZWFjaCBpdGVtIGlzIGEgc2VsZWN0YWJsZSBvcHRpb24uIEJlaGF2ZXMgYXMgYSBsaXN0Ym94LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc2VsZWN0aW9uLWxpc3QnLFxuICBleHBvcnRBczogJ21hdFNlbGVjdGlvbkxpc3QnLFxuICBpbnB1dHM6IFsnZGlzYWJsZVJpcHBsZSddLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnbGlzdGJveCcsXG4gICAgJ2NsYXNzJzogJ21hdC1zZWxlY3Rpb24tbGlzdCBtYXQtbGlzdC1iYXNlJyxcbiAgICAnKGtleWRvd24pJzogJ19rZXlkb3duKCRldmVudCknLFxuICAgICdbYXR0ci5hcmlhLW11bHRpc2VsZWN0YWJsZV0nOiAnbXVsdGlwbGUnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ190YWJJbmRleCcsXG4gIH0sXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIHN0eWxlVXJsczogWydsaXN0LmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFtNQVRfU0VMRUNUSU9OX0xJU1RfVkFMVUVfQUNDRVNTT1JdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0aW9uTGlzdFxuICBleHRlbmRzIF9NYXRTZWxlY3Rpb25MaXN0QmFzZVxuICBpbXBsZW1lbnRzIENhbkRpc2FibGVSaXBwbGUsIEFmdGVyQ29udGVudEluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkRlc3Ryb3ksIE9uQ2hhbmdlc1xue1xuICBwcml2YXRlIF9tdWx0aXBsZSA9IHRydWU7XG4gIHByaXZhdGUgX2NvbnRlbnRJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgRm9jdXNLZXlNYW5hZ2VyIHdoaWNoIGhhbmRsZXMgZm9jdXMuICovXG4gIF9rZXlNYW5hZ2VyOiBGb2N1c0tleU1hbmFnZXI8TWF0TGlzdE9wdGlvbj47XG5cbiAgLyoqIFRoZSBvcHRpb24gY29tcG9uZW50cyBjb250YWluZWQgd2l0aGluIHRoaXMgc2VsZWN0aW9uLWxpc3QuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TGlzdE9wdGlvbiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgb3B0aW9uczogUXVlcnlMaXN0PE1hdExpc3RPcHRpb24+O1xuXG4gIC8qKiBFbWl0cyBhIGNoYW5nZSBldmVudCB3aGVuZXZlciB0aGUgc2VsZWN0ZWQgc3RhdGUgb2YgYW4gb3B0aW9uIGNoYW5nZXMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3Rpb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlPiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlPigpO1xuXG4gIC8qKiBUaGVtZSBjb2xvciBvZiB0aGUgc2VsZWN0aW9uIGxpc3QuIFRoaXMgc2V0cyB0aGUgY2hlY2tib3ggY29sb3IgZm9yIGFsbCBsaXN0IG9wdGlvbnMuICovXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGUgPSAnYWNjZW50JztcblxuICAvKipcbiAgICogRnVuY3Rpb24gdXNlZCBmb3IgY29tcGFyaW5nIGFuIG9wdGlvbiBhZ2FpbnN0IHRoZSBzZWxlY3RlZCB2YWx1ZSB3aGVuIGRldGVybWluaW5nIHdoaWNoXG4gICAqIG9wdGlvbnMgc2hvdWxkIGFwcGVhciBhcyBzZWxlY3RlZC4gVGhlIGZpcnN0IGFyZ3VtZW50IGlzIHRoZSB2YWx1ZSBvZiBhbiBvcHRpb25zLiBUaGUgc2Vjb25kXG4gICAqIG9uZSBpcyBhIHZhbHVlIGZyb20gdGhlIHNlbGVjdGVkIHZhbHVlLiBBIGJvb2xlYW4gbXVzdCBiZSByZXR1cm5lZC5cbiAgICovXG4gIEBJbnB1dCgpIGNvbXBhcmVXaXRoOiAobzE6IGFueSwgbzI6IGFueSkgPT4gYm9vbGVhbiA9IChhMSwgYTIpID0+IGExID09PSBhMjtcblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0aW9uIGxpc3QgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICAvLyBUaGUgYE1hdFNlbGVjdGlvbkxpc3RgIGFuZCBgTWF0TGlzdE9wdGlvbmAgYXJlIHVzaW5nIHRoZSBgT25QdXNoYCBjaGFuZ2UgZGV0ZWN0aW9uXG4gICAgLy8gc3RyYXRlZ3kuIFRoZXJlZm9yZSB0aGUgb3B0aW9ucyB3aWxsIG5vdCBjaGVjayBmb3IgYW55IGNoYW5nZXMgaWYgdGhlIGBNYXRTZWxlY3Rpb25MaXN0YFxuICAgIC8vIGNoYW5nZWQgaXRzIHN0YXRlLiBTaW5jZSB3ZSBrbm93IHRoYXQgYSBjaGFuZ2UgdG8gYGRpc2FibGVkYCBwcm9wZXJ0eSBvZiB0aGUgbGlzdCBhZmZlY3RzXG4gICAgLy8gdGhlIHN0YXRlIG9mIHRoZSBvcHRpb25zLCB3ZSBtYW51YWxseSBtYXJrIGVhY2ggb3B0aW9uIGZvciBjaGVjay5cbiAgICB0aGlzLl9tYXJrT3B0aW9uc0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciBzZWxlY3Rpb24gaXMgbGltaXRlZCB0byBvbmUgb3IgbXVsdGlwbGUgaXRlbXMgKGRlZmF1bHQgbXVsdGlwbGUpLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbXVsdGlwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX211bHRpcGxlO1xuICB9XG4gIHNldCBtdWx0aXBsZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9tdWx0aXBsZSkge1xuICAgICAgaWYgKHRoaXMuX2NvbnRlbnRJbml0aWFsaXplZCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBjaGFuZ2UgYG11bHRpcGxlYCBtb2RlIG9mIG1hdC1zZWxlY3Rpb24tbGlzdCBhZnRlciBpbml0aWFsaXphdGlvbi4nLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9tdWx0aXBsZSA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMgPSBuZXcgU2VsZWN0aW9uTW9kZWwodGhpcy5fbXVsdGlwbGUsIHRoaXMuc2VsZWN0ZWRPcHRpb25zLnNlbGVjdGVkKTtcbiAgICB9XG4gIH1cblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBvcHRpb25zLiAqL1xuICBzZWxlY3RlZE9wdGlvbnMgPSBuZXcgU2VsZWN0aW9uTW9kZWw8TWF0TGlzdE9wdGlvbj4odGhpcy5fbXVsdGlwbGUpO1xuXG4gIC8qKiBUaGUgdGFiaW5kZXggb2YgdGhlIHNlbGVjdGlvbiBsaXN0LiAqL1xuICBfdGFiSW5kZXggPSAtMTtcblxuICAvKiogVmlldyB0byBtb2RlbCBjYWxsYmFjayB0aGF0IHNob3VsZCBiZSBjYWxsZWQgd2hlbmV2ZXIgdGhlIHNlbGVjdGVkIG9wdGlvbnMgY2hhbmdlLiAqL1xuICBwcml2YXRlIF9vbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoXzogYW55KSA9PiB7fTtcblxuICAvKiogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnRseS1zZWxlY3RlZCB2YWx1ZS4gKi9cbiAgX3ZhbHVlOiBzdHJpbmdbXSB8IG51bGw7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGxpc3QgaGFzIGJlZW4gZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBWaWV3IHRvIG1vZGVsIGNhbGxiYWNrIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCBpZiB0aGUgbGlzdCBvciBpdHMgb3B0aW9ucyBsb3N0IGZvY3VzLiAqL1xuICBfb25Ub3VjaGVkOiAoKSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxpc3QgaGFzIGJlZW4gZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIF9pc0Rlc3Ryb3llZDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fY29udGVudEluaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgRm9jdXNLZXlNYW5hZ2VyPE1hdExpc3RPcHRpb24+KHRoaXMub3B0aW9ucylcbiAgICAgIC53aXRoV3JhcCgpXG4gICAgICAud2l0aFR5cGVBaGVhZCgpXG4gICAgICAud2l0aEhvbWVBbmRFbmQoKVxuICAgICAgLy8gQWxsb3cgZGlzYWJsZWQgaXRlbXMgdG8gYmUgZm9jdXNhYmxlLiBGb3IgYWNjZXNzaWJpbGl0eSByZWFzb25zLCB0aGVyZSBtdXN0IGJlIGEgd2F5IGZvclxuICAgICAgLy8gc2NyZWVuIHJlYWRlciB1c2VycywgdGhhdCBhbGxvd3MgcmVhZGluZyB0aGUgZGlmZmVyZW50IG9wdGlvbnMgb2YgdGhlIGxpc3QuXG4gICAgICAuc2tpcFByZWRpY2F0ZSgoKSA9PiBmYWxzZSlcbiAgICAgIC53aXRoQWxsb3dlZE1vZGlmaWVyS2V5cyhbJ3NoaWZ0S2V5J10pO1xuXG4gICAgaWYgKHRoaXMuX3ZhbHVlKSB7XG4gICAgICB0aGlzLl9zZXRPcHRpb25zRnJvbVZhbHVlcyh0aGlzLl92YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHVzZXIgYXR0ZW1wdHMgdG8gdGFiIG91dCBvZiB0aGUgc2VsZWN0aW9uIGxpc3QsIGFsbG93IGZvY3VzIHRvIGVzY2FwZS5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnRhYk91dC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fYWxsb3dGb2N1c0VzY2FwZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gV2hlbiB0aGUgbnVtYmVyIG9mIG9wdGlvbnMgY2hhbmdlLCB1cGRhdGUgdGhlIHRhYmluZGV4IG9mIHRoZSBzZWxlY3Rpb24gbGlzdC5cbiAgICB0aGlzLm9wdGlvbnMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl91cGRhdGVUYWJJbmRleCgpO1xuICAgIH0pO1xuXG4gICAgLy8gU3luYyBleHRlcm5hbCBjaGFuZ2VzIHRvIHRoZSBtb2RlbCBiYWNrIHRvIHRoZSBvcHRpb25zLlxuICAgIHRoaXMuc2VsZWN0ZWRPcHRpb25zLmNoYW5nZWQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmIChldmVudC5hZGRlZCkge1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGV2ZW50LmFkZGVkKSB7XG4gICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50LnJlbW92ZWQpIHtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBldmVudC5yZW1vdmVkKSB7XG4gICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9mb2N1c01vbml0b3JcbiAgICAgIC5tb25pdG9yKHRoaXMuX2VsZW1lbnQpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUob3JpZ2luID0+IHtcbiAgICAgICAgaWYgKG9yaWdpbiA9PT0gJ2tleWJvYXJkJyB8fCBvcmlnaW4gPT09ICdwcm9ncmFtJykge1xuICAgICAgICAgIGxldCB0b0ZvY3VzID0gMDtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoaSk/LnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgIHRvRm9jdXMgPSBpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKHRvRm9jdXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBkaXNhYmxlUmlwcGxlQ2hhbmdlcyA9IGNoYW5nZXNbJ2Rpc2FibGVSaXBwbGUnXTtcbiAgICBjb25zdCBjb2xvckNoYW5nZXMgPSBjaGFuZ2VzWydjb2xvciddO1xuXG4gICAgaWYgKFxuICAgICAgKGRpc2FibGVSaXBwbGVDaGFuZ2VzICYmICFkaXNhYmxlUmlwcGxlQ2hhbmdlcy5maXJzdENoYW5nZSkgfHxcbiAgICAgIChjb2xvckNoYW5nZXMgJiYgIWNvbG9yQ2hhbmdlcy5maXJzdENoYW5nZSlcbiAgICApIHtcbiAgICAgIHRoaXMuX21hcmtPcHRpb25zRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9pc0Rlc3Ryb3llZCA9IHRydWU7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgc2VsZWN0aW9uIGxpc3QuICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogU2VsZWN0cyBhbGwgb2YgdGhlIG9wdGlvbnMuIFJldHVybnMgdGhlIG9wdGlvbnMgdGhhdCBjaGFuZ2VkIGFzIGEgcmVzdWx0LiAqL1xuICBzZWxlY3RBbGwoKTogTWF0TGlzdE9wdGlvbltdIHtcbiAgICByZXR1cm4gdGhpcy5fc2V0QWxsT3B0aW9uc1NlbGVjdGVkKHRydWUpO1xuICB9XG5cbiAgLyoqIERlc2VsZWN0cyBhbGwgb2YgdGhlIG9wdGlvbnMuIFJldHVybnMgdGhlIG9wdGlvbnMgdGhhdCBjaGFuZ2VkIGFzIGEgcmVzdWx0LiAqL1xuICBkZXNlbGVjdEFsbCgpOiBNYXRMaXN0T3B0aW9uW10ge1xuICAgIHJldHVybiB0aGlzLl9zZXRBbGxPcHRpb25zU2VsZWN0ZWQoZmFsc2UpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGZvY3VzZWQgb3B0aW9uIG9mIHRoZSBzZWxlY3Rpb24tbGlzdC4gKi9cbiAgX3NldEZvY3VzZWRPcHRpb24ob3B0aW9uOiBNYXRMaXN0T3B0aW9uKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKG9wdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbiBvcHRpb24gZnJvbSB0aGUgc2VsZWN0aW9uIGxpc3QgYW5kIHVwZGF0ZXMgdGhlIGFjdGl2ZSBpdGVtLlxuICAgKiBAcmV0dXJucyBDdXJyZW50bHktYWN0aXZlIGl0ZW0uXG4gICAqL1xuICBfcmVtb3ZlT3B0aW9uRnJvbUxpc3Qob3B0aW9uOiBNYXRMaXN0T3B0aW9uKTogTWF0TGlzdE9wdGlvbiB8IG51bGwge1xuICAgIGNvbnN0IG9wdGlvbkluZGV4ID0gdGhpcy5fZ2V0T3B0aW9uSW5kZXgob3B0aW9uKTtcblxuICAgIGlmIChvcHRpb25JbmRleCA+IC0xICYmIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4ID09PSBvcHRpb25JbmRleCkge1xuICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgb3B0aW9uIGlzIHRoZSBsYXN0IGl0ZW1cbiAgICAgIGlmIChvcHRpb25JbmRleCA+IDApIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKG9wdGlvbkluZGV4IC0gMSk7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbkluZGV4ID09PSAwICYmIHRoaXMub3B0aW9ucy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShNYXRoLm1pbihvcHRpb25JbmRleCArIDEsIHRoaXMub3B0aW9ucy5sZW5ndGggLSAxKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbTtcbiAgfVxuXG4gIC8qKiBQYXNzZXMgcmVsZXZhbnQga2V5IHByZXNzZXMgdG8gb3VyIGtleSBtYW5hZ2VyLiAqL1xuICBfa2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuICAgIGNvbnN0IHByZXZpb3VzRm9jdXNJbmRleCA9IG1hbmFnZXIuYWN0aXZlSXRlbUluZGV4O1xuICAgIGNvbnN0IGhhc01vZGlmaWVyID0gaGFzTW9kaWZpZXJLZXkoZXZlbnQpO1xuXG4gICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICBjYXNlIFNQQUNFOlxuICAgICAgY2FzZSBFTlRFUjpcbiAgICAgICAgaWYgKCFoYXNNb2RpZmllciAmJiAhbWFuYWdlci5pc1R5cGluZygpKSB7XG4gICAgICAgICAgdGhpcy5fdG9nZ2xlRm9jdXNlZE9wdGlvbigpO1xuICAgICAgICAgIC8vIEFsd2F5cyBwcmV2ZW50IHNwYWNlIGZyb20gc2Nyb2xsaW5nIHRoZSBwYWdlIHNpbmNlIHRoZSBsaXN0IGhhcyBmb2N1c1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBUaGUgXCJBXCIga2V5IGdldHMgc3BlY2lhbCB0cmVhdG1lbnQsIGJlY2F1c2UgaXQncyB1c2VkIGZvciB0aGUgXCJzZWxlY3QgYWxsXCIgZnVuY3Rpb25hbGl0eS5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGtleUNvZGUgPT09IEEgJiZcbiAgICAgICAgICB0aGlzLm11bHRpcGxlICYmXG4gICAgICAgICAgaGFzTW9kaWZpZXJLZXkoZXZlbnQsICdjdHJsS2V5JykgJiZcbiAgICAgICAgICAhbWFuYWdlci5pc1R5cGluZygpXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IHNob3VsZFNlbGVjdCA9IHRoaXMub3B0aW9ucy5zb21lKG9wdGlvbiA9PiAhb3B0aW9uLmRpc2FibGVkICYmICFvcHRpb24uc2VsZWN0ZWQpO1xuICAgICAgICAgIHRoaXMuX3NldEFsbE9wdGlvbnNTZWxlY3RlZChzaG91bGRTZWxlY3QsIHRydWUsIHRydWUpO1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdGhpcy5tdWx0aXBsZSAmJlxuICAgICAgKGtleUNvZGUgPT09IFVQX0FSUk9XIHx8IGtleUNvZGUgPT09IERPV05fQVJST1cpICYmXG4gICAgICBldmVudC5zaGlmdEtleSAmJlxuICAgICAgbWFuYWdlci5hY3RpdmVJdGVtSW5kZXggIT09IHByZXZpb3VzRm9jdXNJbmRleFxuICAgICkge1xuICAgICAgdGhpcy5fdG9nZ2xlRm9jdXNlZE9wdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXBvcnRzIGEgdmFsdWUgY2hhbmdlIHRvIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciAqL1xuICBfcmVwb3J0VmFsdWVDaGFuZ2UoKSB7XG4gICAgLy8gU3RvcCByZXBvcnRpbmcgdmFsdWUgY2hhbmdlcyBhZnRlciB0aGUgbGlzdCBoYXMgYmVlbiBkZXN0cm95ZWQuIFRoaXMgYXZvaWRzXG4gICAgLy8gY2FzZXMgd2hlcmUgdGhlIGxpc3QgbWlnaHQgd3JvbmdseSByZXNldCBpdHMgdmFsdWUgb25jZSBpdCBpcyByZW1vdmVkLCBidXRcbiAgICAvLyB0aGUgZm9ybSBjb250cm9sIGlzIHN0aWxsIGxpdmUuXG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiAhdGhpcy5faXNEZXN0cm95ZWQpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fZ2V0U2VsZWN0ZWRPcHRpb25WYWx1ZXMoKTtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlKTtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVtaXRzIGEgY2hhbmdlIGV2ZW50IGlmIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiBhbiBvcHRpb24gY2hhbmdlZC4gKi9cbiAgX2VtaXRDaGFuZ2VFdmVudChvcHRpb25zOiBNYXRMaXN0T3B0aW9uW10pIHtcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KG5ldyBNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlKHRoaXMsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLiAqL1xuICB3cml0ZVZhbHVlKHZhbHVlczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlcztcblxuICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgIHRoaXMuX3NldE9wdGlvbnNGcm9tVmFsdWVzKHZhbHVlcyB8fCBbXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci4gKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci4gKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKiogU2V0cyB0aGUgc2VsZWN0ZWQgb3B0aW9ucyBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIHZhbHVlcy4gKi9cbiAgcHJpdmF0ZSBfc2V0T3B0aW9uc0Zyb21WYWx1ZXModmFsdWVzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMub3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiBvcHRpb24uX3NldFNlbGVjdGVkKGZhbHNlKSk7XG5cbiAgICB2YWx1ZXMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICBjb25zdCBjb3JyZXNwb25kaW5nT3B0aW9uID0gdGhpcy5vcHRpb25zLmZpbmQob3B0aW9uID0+IHtcbiAgICAgICAgLy8gU2tpcCBvcHRpb25zIHRoYXQgYXJlIGFscmVhZHkgaW4gdGhlIG1vZGVsLiBUaGlzIGFsbG93cyB1cyB0byBoYW5kbGUgY2FzZXNcbiAgICAgICAgLy8gd2hlcmUgdGhlIHNhbWUgcHJpbWl0aXZlIHZhbHVlIGlzIHNlbGVjdGVkIG11bHRpcGxlIHRpbWVzLlxuICAgICAgICByZXR1cm4gb3B0aW9uLnNlbGVjdGVkID8gZmFsc2UgOiB0aGlzLmNvbXBhcmVXaXRoKG9wdGlvbi52YWx1ZSwgdmFsdWUpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjb3JyZXNwb25kaW5nT3B0aW9uKSB7XG4gICAgICAgIGNvcnJlc3BvbmRpbmdPcHRpb24uX3NldFNlbGVjdGVkKHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHZhbHVlcyBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9ucy4gKi9cbiAgcHJpdmF0ZSBfZ2V0U2VsZWN0ZWRPcHRpb25WYWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmlsdGVyKG9wdGlvbiA9PiBvcHRpb24uc2VsZWN0ZWQpLm1hcChvcHRpb24gPT4gb3B0aW9uLnZhbHVlKTtcbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSBzdGF0ZSBvZiB0aGUgY3VycmVudGx5IGZvY3VzZWQgb3B0aW9uIGlmIGVuYWJsZWQuICovXG4gIHByaXZhdGUgX3RvZ2dsZUZvY3VzZWRPcHRpb24oKTogdm9pZCB7XG4gICAgbGV0IGZvY3VzZWRJbmRleCA9IHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4O1xuXG4gICAgaWYgKGZvY3VzZWRJbmRleCAhPSBudWxsICYmIHRoaXMuX2lzVmFsaWRJbmRleChmb2N1c2VkSW5kZXgpKSB7XG4gICAgICBsZXQgZm9jdXNlZE9wdGlvbjogTWF0TGlzdE9wdGlvbiA9IHRoaXMub3B0aW9ucy50b0FycmF5KClbZm9jdXNlZEluZGV4XTtcblxuICAgICAgaWYgKGZvY3VzZWRPcHRpb24gJiYgIWZvY3VzZWRPcHRpb24uZGlzYWJsZWQgJiYgKHRoaXMuX211bHRpcGxlIHx8ICFmb2N1c2VkT3B0aW9uLnNlbGVjdGVkKSkge1xuICAgICAgICBmb2N1c2VkT3B0aW9uLnRvZ2dsZSgpO1xuXG4gICAgICAgIC8vIEVtaXQgYSBjaGFuZ2UgZXZlbnQgYmVjYXVzZSB0aGUgZm9jdXNlZCBvcHRpb24gY2hhbmdlZCBpdHMgc3RhdGUgdGhyb3VnaCB1c2VyXG4gICAgICAgIC8vIGludGVyYWN0aW9uLlxuICAgICAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoW2ZvY3VzZWRPcHRpb25dKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2VsZWN0ZWQgc3RhdGUgb24gYWxsIG9mIHRoZSBvcHRpb25zXG4gICAqIGFuZCBlbWl0cyBhbiBldmVudCBpZiBhbnl0aGluZyBjaGFuZ2VkLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0QWxsT3B0aW9uc1NlbGVjdGVkKFxuICAgIGlzU2VsZWN0ZWQ6IGJvb2xlYW4sXG4gICAgc2tpcERpc2FibGVkPzogYm9vbGVhbixcbiAgICBpc1VzZXJJbnB1dD86IGJvb2xlYW4sXG4gICk6IE1hdExpc3RPcHRpb25bXSB7XG4gICAgLy8gS2VlcCB0cmFjayBvZiB3aGV0aGVyIGFueXRoaW5nIGNoYW5nZWQsIGJlY2F1c2Ugd2Ugb25seSB3YW50IHRvXG4gICAgLy8gZW1pdCB0aGUgY2hhbmdlZCBldmVudCB3aGVuIHNvbWV0aGluZyBhY3R1YWxseSBjaGFuZ2VkLlxuICAgIGNvbnN0IGNoYW5nZWRPcHRpb25zOiBNYXRMaXN0T3B0aW9uW10gPSBbXTtcblxuICAgIHRoaXMub3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICBpZiAoKCFza2lwRGlzYWJsZWQgfHwgIW9wdGlvbi5kaXNhYmxlZCkgJiYgb3B0aW9uLl9zZXRTZWxlY3RlZChpc1NlbGVjdGVkKSkge1xuICAgICAgICBjaGFuZ2VkT3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoY2hhbmdlZE9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9yZXBvcnRWYWx1ZUNoYW5nZSgpO1xuXG4gICAgICBpZiAoaXNVc2VySW5wdXQpIHtcbiAgICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KGNoYW5nZWRPcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hhbmdlZE9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogVXRpbGl0eSB0byBlbnN1cmUgYWxsIGluZGV4ZXMgYXJlIHZhbGlkLlxuICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IHRvIGJlIGNoZWNrZWQuXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGluZGV4IGlzIHZhbGlkIGZvciBvdXIgbGlzdCBvZiBvcHRpb25zLlxuICAgKi9cbiAgcHJpdmF0ZSBfaXNWYWxpZEluZGV4KGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMub3B0aW9ucy5sZW5ndGg7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIHNwZWNpZmllZCBsaXN0IG9wdGlvbi4gKi9cbiAgcHJpdmF0ZSBfZ2V0T3B0aW9uSW5kZXgob3B0aW9uOiBNYXRMaXN0T3B0aW9uKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnRvQXJyYXkoKS5pbmRleE9mKG9wdGlvbik7XG4gIH1cblxuICAvKiogTWFya3MgYWxsIHRoZSBvcHRpb25zIHRvIGJlIGNoZWNrZWQgaW4gdGhlIG5leHQgY2hhbmdlIGRldGVjdGlvbiBydW4uICovXG4gIHByaXZhdGUgX21hcmtPcHRpb25zRm9yQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zLmZvckVhY2gob3B0aW9uID0+IG9wdGlvbi5fbWFya0ZvckNoZWNrKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSB0YWJpbmRleCBmcm9tIHRoZSBzZWxlY3Rpb24gbGlzdCBhbmQgcmVzZXRzIGl0IGJhY2sgYWZ0ZXJ3YXJkcywgYWxsb3dpbmcgdGhlIHVzZXJcbiAgICogdG8gdGFiIG91dCBvZiBpdC4gVGhpcyBwcmV2ZW50cyB0aGUgbGlzdCBmcm9tIGNhcHR1cmluZyBmb2N1cyBhbmQgcmVkaXJlY3RpbmcgaXQgYmFjayB3aXRoaW5cbiAgICogdGhlIGxpc3QsIGNyZWF0aW5nIGEgZm9jdXMgdHJhcCBpZiBpdCB1c2VyIHRyaWVzIHRvIHRhYiBhd2F5LlxuICAgKi9cbiAgcHJpdmF0ZSBfYWxsb3dGb2N1c0VzY2FwZSgpIHtcbiAgICB0aGlzLl90YWJJbmRleCA9IC0xO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl90YWJJbmRleCA9IDA7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSB0YWJpbmRleCBiYXNlZCB1cG9uIGlmIHRoZSBzZWxlY3Rpb24gbGlzdCBpcyBlbXB0eS4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVGFiSW5kZXgoKTogdm9pZCB7XG4gICAgdGhpcy5fdGFiSW5kZXggPSB0aGlzLm9wdGlvbnMubGVuZ3RoID09PSAwID8gLTEgOiAwO1xuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwibWF0LWxpc3QtaXRlbS1jb250ZW50XCJcbiAgW2NsYXNzLm1hdC1saXN0LWl0ZW0tY29udGVudC1yZXZlcnNlXT1cImNoZWNrYm94UG9zaXRpb24gPT0gJ2FmdGVyJ1wiPlxuXG4gIDxkaXYgbWF0LXJpcHBsZVxuICAgIGNsYXNzPVwibWF0LWxpc3QtaXRlbS1yaXBwbGVcIlxuICAgIFttYXRSaXBwbGVUcmlnZ2VyXT1cIl9nZXRIb3N0RWxlbWVudCgpXCJcbiAgICBbbWF0UmlwcGxlRGlzYWJsZWRdPVwiX2lzUmlwcGxlRGlzYWJsZWQoKVwiPjwvZGl2PlxuXG4gIDxtYXQtcHNldWRvLWNoZWNrYm94XG4gICAgKm5nSWY9XCJzZWxlY3Rpb25MaXN0Lm11bHRpcGxlXCJcbiAgICBbc3RhdGVdPVwic2VsZWN0ZWQgPyAnY2hlY2tlZCcgOiAndW5jaGVja2VkJ1wiXG4gICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCI+PC9tYXQtcHNldWRvLWNoZWNrYm94PlxuXG4gIDxkaXYgY2xhc3M9XCJtYXQtbGlzdC10ZXh0XCIgI3RleHQ+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PjwvZGl2PlxuXG4gIDxuZy1jb250ZW50IHNlbGVjdD1cIlttYXQtbGlzdC1hdmF0YXJdLCBbbWF0LWxpc3QtaWNvbl0sIFttYXRMaXN0QXZhdGFyXSwgW21hdExpc3RJY29uXVwiPlxuICA8L25nLWNvbnRlbnQ+XG5cbjwvZGl2PlxuIl19
