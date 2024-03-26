/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  NgZone,
} from '@angular/core';
import { take } from 'rxjs/operators';
import * as i0 from '@angular/core';
import * as i1 from '@angular/common';
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 */
export class TakCalendarCell {
  constructor(
    value,
    displayValue,
    ariaLabel,
    enabled,
    cssClasses = {},
    compareValue = value,
    rawValue
  ) {
    this.value = value;
    this.displayValue = displayValue;
    this.ariaLabel = ariaLabel;
    this.enabled = enabled;
    this.cssClasses = cssClasses;
    this.compareValue = compareValue;
    this.rawValue = rawValue;
  }
}
/**
 * An internal component used to display calendar data in a table.
 * @docs-private
 */
export class TakCalendarBody {
  constructor(_elementRef, _ngZone) {
    this._elementRef = _elementRef;
    this._ngZone = _ngZone;
    /**
     * Used to focus the active cell after change detection has run.
     */
    this._focusActiveCellAfterViewChecked = false;
    /** The number of columns in the table. */
    this.numCols = 7;
    /** The cell number of the active cell in the table. */
    this.activeCell = 0;
    /** Whether a range is being selected. */
    this.isRange = false;
    /**
     * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
     * maintained even as the table resizes.
     */
    this.cellAspectRatio = 1;
    /** Start of the preview range. */
    this.previewStart = null;
    /** End of the preview range. */
    this.previewEnd = null;
    /** Emits when a new value is selected. */
    this.selectedValueChange = new EventEmitter();
    /** Emits when the preview has changed as a result of a user action. */
    this.previewChange = new EventEmitter();
    this.activeDateChange = new EventEmitter();
    /**
     * Event handler for when the user enters an element
     * inside the calendar body (e.g. by hovering in or focus).
     */
    this._enterHandler = event => {
      if (this._skipNextFocus && event.type === 'focus') {
        this._skipNextFocus = false;
        return;
      }
      // We only need to hit the zone when we're selecting a range.
      if (event.target && this.isRange) {
        const cell = this._getCellFromElement(event.target);
        if (cell) {
          this._ngZone.run(() =>
            this.previewChange.emit({ value: cell.enabled ? cell : null, event })
          );
        }
      }
    };
    /**
     * Event handler for when the user's pointer leaves an element
     * inside the calendar body (e.g. by hovering out or blurring).
     */
    this._leaveHandler = event => {
      // We only need to hit the zone when we're selecting a range.
      if (this.previewEnd !== null && this.isRange) {
        // Only reset the preview end value when leaving cells. This looks better, because
        // we have a gap between the cells and the rows and we don't want to remove the
        // range just for it to show up again when the user moves a few pixels to the side.
        if (event.target && this._getCellFromElement(event.target)) {
          this._ngZone.run(() => this.previewChange.emit({ value: null, event }));
        }
      }
    };
    _ngZone.runOutsideAngular(() => {
      const element = _elementRef.nativeElement;
      element.addEventListener('mouseenter', this._enterHandler, true);
      element.addEventListener('focus', this._enterHandler, true);
      element.addEventListener('mouseleave', this._leaveHandler, true);
      element.addEventListener('blur', this._leaveHandler, true);
    });
  }
  ngAfterViewChecked() {
    if (this._focusActiveCellAfterViewChecked) {
      this._focusActiveCell();
      this._focusActiveCellAfterViewChecked = false;
    }
  }
  /** Called when a cell is clicked. */
  _cellClicked(cell, event) {
    if (cell.enabled) {
      this.selectedValueChange.emit({ value: cell.value, event });
    }
  }
  _emitActiveDateChange(cell, event) {
    if (cell.enabled) {
      this.activeDateChange.emit({ value: cell.value, event });
    }
  }
  /** Returns whether a cell should be marked as selected. */
  _isSelected(value) {
    return this.startValue === value || this.endValue === value;
  }
  ngOnChanges(changes) {
    const columnChanges = changes['numCols'];
    const { rows, numCols } = this;
    if (changes['rows'] || columnChanges) {
      this._firstRowOffset = rows && rows.length && rows[0].length ? numCols - rows[0].length : 0;
    }
    if (changes['cellAspectRatio'] || columnChanges || !this._cellPadding) {
      this._cellPadding = `${(50 * this.cellAspectRatio) / numCols}%`;
    }
    if (columnChanges || !this._cellWidth) {
      this._cellWidth = `${100 / numCols}%`;
    }
  }
  ngOnDestroy() {
    const element = this._elementRef.nativeElement;
    element.removeEventListener('mouseenter', this._enterHandler, true);
    element.removeEventListener('focus', this._enterHandler, true);
    element.removeEventListener('mouseleave', this._leaveHandler, true);
    element.removeEventListener('blur', this._leaveHandler, true);
  }
  /** Returns whether a cell is active. */
  _isActiveCell(rowIndex, colIndex) {
    let cellNumber = rowIndex * this.numCols + colIndex;
    // Account for the fact that the first row may not have as many cells.
    if (rowIndex) {
      cellNumber -= this._firstRowOffset;
    }
    return cellNumber == this.activeCell;
  }
  /**
   * Focuses the active cell after the microtask queue is empty.
   *
   * Adding a 0ms setTimeout seems to fix Voiceover losing focus when pressing PageUp/PageDown
   * (issue #24330).
   *
   * Determined a 0ms by gradually increasing duration from 0 and testing two use cases with screen
   * reader enabled:
   *
   * 1. Pressing PageUp/PageDown repeatedly with pausing between each key press.
   * 2. Pressing and holding the PageDown key with repeated keys enabled.
   *
   * Test 1 worked roughly 95-99% of the time with 0ms and got a little bit better as the duration
   * increased. Test 2 got slightly better until the duration was long enough to interfere with
   * repeated keys. If the repeated key speed was faster than the timeout duration, then pressing
   * and holding pagedown caused the entire page to scroll.
   *
   * Since repeated key speed can verify across machines, determined that any duration could
   * potentially interfere with repeated keys. 0ms would be best because it almost entirely
   * eliminates the focus being lost in Voiceover (#24330) without causing unintended side effects.
   * Adding delay also complicates writing tests.
   */
  _focusActiveCell(movePreview = true) {
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.onStable.pipe(take(1)).subscribe(() => {
        setTimeout(() => {
          const activeCell = this._elementRef.nativeElement.querySelector(
            '.tak-calendar-body-active'
          );
          if (activeCell) {
            if (!movePreview) {
              this._skipNextFocus = true;
            }
            activeCell.focus();
          }
        });
      });
    });
  }
  /** Focuses the active cell after change detection has run and the microtask queue is empty. */
  _scheduleFocusActiveCellAfterViewChecked() {
    this._focusActiveCellAfterViewChecked = true;
  }
  /** Gets whether a value is the start of the main range. */
  _isRangeStart(value) {
    return isStart(value, this.startValue, this.endValue);
  }
  /** Gets whether a value is the end of the main range. */
  _isRangeEnd(value) {
    return isEnd(value, this.startValue, this.endValue);
  }
  /** Gets whether a value is within the currently-selected range. */
  _isInRange(value) {
    return isInRange(value, this.startValue, this.endValue, this.isRange);
  }
  /** Gets whether a value is the start of the comparison range. */
  _isComparisonStart(value) {
    return isStart(value, this.comparisonStart, this.comparisonEnd);
  }
  /** Whether the cell is a start bridge cell between the main and comparison ranges. */
  _isComparisonBridgeStart(value, rowIndex, colIndex) {
    if (!this._isComparisonStart(value) || this._isRangeStart(value) || !this._isInRange(value)) {
      return false;
    }
    let previousCell = this.rows[rowIndex][colIndex - 1];
    if (!previousCell) {
      const previousRow = this.rows[rowIndex - 1];
      previousCell = previousRow && previousRow[previousRow.length - 1];
    }
    return previousCell && !this._isRangeEnd(previousCell.compareValue);
  }
  /** Whether the cell is an end bridge cell between the main and comparison ranges. */
  _isComparisonBridgeEnd(value, rowIndex, colIndex) {
    if (!this._isComparisonEnd(value) || this._isRangeEnd(value) || !this._isInRange(value)) {
      return false;
    }
    let nextCell = this.rows[rowIndex][colIndex + 1];
    if (!nextCell) {
      const nextRow = this.rows[rowIndex + 1];
      nextCell = nextRow && nextRow[0];
    }
    return nextCell && !this._isRangeStart(nextCell.compareValue);
  }
  /** Gets whether a value is the end of the comparison range. */
  _isComparisonEnd(value) {
    return isEnd(value, this.comparisonStart, this.comparisonEnd);
  }
  /** Gets whether a value is within the current comparison range. */
  _isInComparisonRange(value) {
    return isInRange(value, this.comparisonStart, this.comparisonEnd, this.isRange);
  }
  /**
   * Gets whether a value is the same as the start and end of the comparison range.
   * For context, the functions that we use to determine whether something is the start/end of
   * a range don't allow for the start and end to be on the same day, because we'd have to use
   * much more specific CSS selectors to style them correctly in all scenarios. This is fine for
   * the regular range, because when it happens, the selected styles take over and still show where
   * the range would've been, however we don't have these selected styles for a comparison range.
   * This function is used to apply a class that serves the same purpose as the one for selected
   * dates, but it only applies in the context of a comparison range.
   */
  _isComparisonIdentical(value) {
    // Note that we don't need to null check the start/end
    // here, because the `value` will always be defined.
    return this.comparisonStart === this.comparisonEnd && value === this.comparisonStart;
  }
  /** Gets whether a value is the start of the preview range. */
  _isPreviewStart(value) {
    return isStart(value, this.previewStart, this.previewEnd);
  }
  /** Gets whether a value is the end of the preview range. */
  _isPreviewEnd(value) {
    return isEnd(value, this.previewStart, this.previewEnd);
  }
  /** Gets whether a value is inside the preview range. */
  _isInPreview(value) {
    return isInRange(value, this.previewStart, this.previewEnd, this.isRange);
  }
  /** Finds the TakCalendarCell that corresponds to a DOM node. */
  _getCellFromElement(element) {
    let cell;
    if (isTableCell(element)) {
      cell = element;
    } else if (isTableCell(element.parentNode)) {
      cell = element.parentNode;
    }
    if (cell) {
      const row = cell.getAttribute('data-tak-row');
      const col = cell.getAttribute('data-tak-col');
      if (row && col) {
        return this.rows[parseInt(row)][parseInt(col)];
      }
    }
    return null;
  }
}
TakCalendarBody.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakCalendarBody,
  deps: [{ token: i0.ElementRef }, { token: i0.NgZone }],
  target: i0.ɵɵFactoryTarget.Component,
});
TakCalendarBody.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakCalendarBody,
  selector: '[tak-calendar-body]',
  inputs: {
    label: 'label',
    rows: 'rows',
    todayValue: 'todayValue',
    startValue: 'startValue',
    endValue: 'endValue',
    labelMinRequiredCells: 'labelMinRequiredCells',
    numCols: 'numCols',
    activeCell: 'activeCell',
    isRange: 'isRange',
    cellAspectRatio: 'cellAspectRatio',
    comparisonStart: 'comparisonStart',
    comparisonEnd: 'comparisonEnd',
    previewStart: 'previewStart',
    previewEnd: 'previewEnd',
  },
  outputs: {
    selectedValueChange: 'selectedValueChange',
    previewChange: 'previewChange',
    activeDateChange: 'activeDateChange',
  },
  host: { classAttribute: 'tak-calendar-body' },
  exportAs: ['takCalendarBody'],
  usesOnChanges: true,
  ngImport: i0,
  template:
    '<!--\n  If there\'s not enough space in the first row, create a separate label row. We mark this row as\n  aria-hidden because we don\'t want it to be read out as one of the weeks in the month.\n-->\n<tr *ngIf="_firstRowOffset < labelMinRequiredCells" aria-hidden="true">\n  <td class="tak-calendar-body-label"\n      [attr.colspan]="numCols"\n      [style.paddingTop]="_cellPadding"\n      [style.paddingBottom]="_cellPadding">\n    {{label}}\n  </td>\n</tr>\n\n<!-- Create the first row separately so we can include a special spacer cell. -->\n<tr *ngFor="let row of rows; let rowIndex = index" role="row">\n  <!--\n    This cell is purely decorative, but we can\'t put `aria-hidden` or `role="presentation"` on it,\n    because it throws off the week days for the rest of the row on NVDA. The aspect ratio of the\n    table cells is maintained by setting the top and bottom padding as a percentage of the width\n    (a variant of the trick described here: https://www.w3schools.com/howto/howto_css_aspect_ratio.asp).\n  -->\n  <td *ngIf="rowIndex === 0 && _firstRowOffset"\n      class="tak-calendar-body-label"\n      [attr.colspan]="_firstRowOffset"\n      [style.paddingTop]="_cellPadding"\n      [style.paddingBottom]="_cellPadding">\n    {{_firstRowOffset >= labelMinRequiredCells ? label : \'\'}}\n  </td>\n  <!--\n    Each gridcell in the calendar contains a button, which signals to assistive technology that the\n    cell is interactable, as well as the selection state via `aria-pressed`. See #23476 for\n    background.\n  -->\n  <td\n    *ngFor="let item of row; let colIndex = index"\n    role="gridcell"\n    class="tak-calendar-body-cell-container"\n    [style.width]="_cellWidth"\n    [style.paddingTop]="_cellPadding"\n    [style.paddingBottom]="_cellPadding"\n    [attr.data-tak-row]="rowIndex"\n    [attr.data-tak-col]="colIndex"\n  >\n    <button\n        type="button"\n        class="tak-calendar-body-cell"\n        [ngClass]="item.cssClasses"\n        [tabindex]="_isActiveCell(rowIndex, colIndex) ? 0 : -1"\n        [class.tak-calendar-body-disabled]="!item.enabled"\n        [class.tak-calendar-body-active]="_isActiveCell(rowIndex, colIndex)"\n        [class.tak-calendar-body-range-start]="_isRangeStart(item.compareValue)"\n        [class.tak-calendar-body-range-end]="_isRangeEnd(item.compareValue)"\n        [class.tak-calendar-body-in-range]="_isInRange(item.compareValue)"\n        [class.tak-calendar-body-comparison-bridge-start]="_isComparisonBridgeStart(item.compareValue, rowIndex, colIndex)"\n        [class.tak-calendar-body-comparison-bridge-end]="_isComparisonBridgeEnd(item.compareValue, rowIndex, colIndex)"\n        [class.tak-calendar-body-comparison-start]="_isComparisonStart(item.compareValue)"\n        [class.tak-calendar-body-comparison-end]="_isComparisonEnd(item.compareValue)"\n        [class.tak-calendar-body-in-comparison-range]="_isInComparisonRange(item.compareValue)"\n        [class.tak-calendar-body-preview-start]="_isPreviewStart(item.compareValue)"\n        [class.tak-calendar-body-preview-end]="_isPreviewEnd(item.compareValue)"\n        [class.tak-calendar-body-in-preview]="_isInPreview(item.compareValue)"\n        [attr.aria-label]="item.ariaLabel"\n        [attr.aria-disabled]="!item.enabled || null"\n        [attr.aria-pressed]="_isSelected(item.compareValue)"\n        [attr.aria-current]="todayValue === item.compareValue ? \'date\' : null"\n        (click)="_cellClicked(item, $event)"\n        (focus)="_emitActiveDateChange(item, $event)">\n        <div class="tak-calendar-body-cell-content tak-focus-indicator"\n          [class.tak-calendar-body-selected]="_isSelected(item.compareValue)"\n          [class.tak-calendar-body-comparison-identical]="_isComparisonIdentical(item.compareValue)"\n          [class.tak-calendar-body-today]="todayValue === item.compareValue">\n          {{item.displayValue}}\n        </div>\n        <div class="tak-calendar-body-cell-preview" aria-hidden="true"></div>\n    </button>\n  </td>\n</tr>\n',
  styles: [
    '.tak-calendar-body{min-width:224px}.tak-calendar-body-label{height:0;line-height:0;text-align:left;padding-left:4.7142857143%;padding-right:4.7142857143%}.tak-calendar-body-cell-container{position:relative;height:0;line-height:0}.tak-calendar-body-cell{-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);position:absolute;top:0;left:0;width:100%;height:100%;background:none;text-align:center;outline:none;font-family:inherit;margin:0}.tak-calendar-body-cell::-moz-focus-inner{border:0}.tak-calendar-body-cell::before,.tak-calendar-body-cell::after,.tak-calendar-body-cell-preview{content:"";position:absolute;top:5%;left:0;z-index:0;box-sizing:border-box;height:90%;width:100%}.tak-calendar-body-range-start:not(.tak-calendar-body-in-comparison-range)::before,.tak-calendar-body-range-start::after,.tak-calendar-body-comparison-start:not(.tak-calendar-body-comparison-bridge-start)::before,.tak-calendar-body-comparison-start::after,.tak-calendar-body-preview-start .tak-calendar-body-cell-preview{left:5%;width:95%;border-top-left-radius:999px;border-bottom-left-radius:999px}[dir=rtl] .tak-calendar-body-range-start:not(.tak-calendar-body-in-comparison-range)::before,[dir=rtl] .tak-calendar-body-range-start::after,[dir=rtl] .tak-calendar-body-comparison-start:not(.tak-calendar-body-comparison-bridge-start)::before,[dir=rtl] .tak-calendar-body-comparison-start::after,[dir=rtl] .tak-calendar-body-preview-start .tak-calendar-body-cell-preview{left:0;border-radius:0;border-top-right-radius:999px;border-bottom-right-radius:999px}.tak-calendar-body-range-end:not(.tak-calendar-body-in-comparison-range)::before,.tak-calendar-body-range-end::after,.tak-calendar-body-comparison-end:not(.tak-calendar-body-comparison-bridge-end)::before,.tak-calendar-body-comparison-end::after,.tak-calendar-body-preview-end .tak-calendar-body-cell-preview{width:95%;border-top-right-radius:999px;border-bottom-right-radius:999px}[dir=rtl] .tak-calendar-body-range-end:not(.tak-calendar-body-in-comparison-range)::before,[dir=rtl] .tak-calendar-body-range-end::after,[dir=rtl] .tak-calendar-body-comparison-end:not(.tak-calendar-body-comparison-bridge-end)::before,[dir=rtl] .tak-calendar-body-comparison-end::after,[dir=rtl] .tak-calendar-body-preview-end .tak-calendar-body-cell-preview{left:5%;border-radius:0;border-top-left-radius:999px;border-bottom-left-radius:999px}[dir=rtl] .tak-calendar-body-comparison-bridge-start.tak-calendar-body-range-end::after,[dir=rtl] .tak-calendar-body-comparison-bridge-end.tak-calendar-body-range-start::after{width:95%;border-top-right-radius:999px;border-bottom-right-radius:999px}.tak-calendar-body-comparison-start.tak-calendar-body-range-end::after,[dir=rtl] .tak-calendar-body-comparison-start.tak-calendar-body-range-end::after,.tak-calendar-body-comparison-end.tak-calendar-body-range-start::after,[dir=rtl] .tak-calendar-body-comparison-end.tak-calendar-body-range-start::after{width:90%}.tak-calendar-body-in-preview .tak-calendar-body-cell-preview{border-top:dashed 1px;border-bottom:dashed 1px}.tak-calendar-body-preview-start .tak-calendar-body-cell-preview{border-left:dashed 1px}[dir=rtl] .tak-calendar-body-preview-start .tak-calendar-body-cell-preview{border-left:0;border-right:dashed 1px}.tak-calendar-body-preview-end .tak-calendar-body-cell-preview{border-right:dashed 1px}[dir=rtl] .tak-calendar-body-preview-end .tak-calendar-body-cell-preview{border-right:0;border-left:dashed 1px}.tak-calendar-body-disabled{cursor:default}.cdk-high-contrast-active .tak-calendar-body-disabled{opacity:.5}.tak-calendar-body-cell-content{top:5%;left:5%;z-index:1;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;line-height:1;border-width:1px;border-style:solid;border-radius:999px}.tak-calendar-body-cell-content.tak-focus-indicator{position:absolute}.cdk-high-contrast-active .tak-calendar-body-cell-content{border:none}.cdk-high-contrast-active .tak-datepicker-popup:not(:empty),.cdk-high-contrast-active .tak-calendar-body-cell:not(.tak-calendar-body-in-range) .tak-calendar-body-selected{outline:solid 1px}.cdk-high-contrast-active .tak-calendar-body-today{outline:dotted 1px}.cdk-high-contrast-active .tak-calendar-body-cell::before,.cdk-high-contrast-active .tak-calendar-body-cell::after,.cdk-high-contrast-active .tak-calendar-body-selected{background:none}.cdk-high-contrast-active .tak-calendar-body-in-range::before,.cdk-high-contrast-active .tak-calendar-body-comparison-bridge-start::before,.cdk-high-contrast-active .tak-calendar-body-comparison-bridge-end::before{border-top:solid 1px;border-bottom:solid 1px}.cdk-high-contrast-active .tak-calendar-body-range-start::before{border-left:solid 1px}[dir=rtl] .cdk-high-contrast-active .tak-calendar-body-range-start::before{border-left:0;border-right:solid 1px}.cdk-high-contrast-active .tak-calendar-body-range-end::before{border-right:solid 1px}[dir=rtl] .cdk-high-contrast-active .tak-calendar-body-range-end::before{border-right:0;border-left:solid 1px}.cdk-high-contrast-active .tak-calendar-body-in-comparison-range::before{border-top:dashed 1px;border-bottom:dashed 1px}.cdk-high-contrast-active .tak-calendar-body-comparison-start::before{border-left:dashed 1px}[dir=rtl] .cdk-high-contrast-active .tak-calendar-body-comparison-start::before{border-left:0;border-right:dashed 1px}.cdk-high-contrast-active .tak-calendar-body-comparison-end::before{border-right:dashed 1px}[dir=rtl] .cdk-high-contrast-active .tak-calendar-body-comparison-end::before{border-right:0;border-left:dashed 1px}[dir=rtl] .tak-calendar-body-label{text-align:right}',
  ],
  dependencies: [
    { kind: 'directive', type: i1.NgClass, selector: '[ngClass]', inputs: ['class', 'ngClass'] },
    {
      kind: 'directive',
      type: i1.NgForOf,
      selector: '[ngFor][ngForOf]',
      inputs: ['ngForOf', 'ngForTrackBy', 'ngForTemplate'],
    },
    {
      kind: 'directive',
      type: i1.NgIf,
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
  type: TakCalendarBody,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: '[tak-calendar-body]',
          host: {
            class: 'tak-calendar-body',
          },
          exportAs: 'takCalendarBody',
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          template:
            '<!--\n  If there\'s not enough space in the first row, create a separate label row. We mark this row as\n  aria-hidden because we don\'t want it to be read out as one of the weeks in the month.\n-->\n<tr *ngIf="_firstRowOffset < labelMinRequiredCells" aria-hidden="true">\n  <td class="tak-calendar-body-label"\n      [attr.colspan]="numCols"\n      [style.paddingTop]="_cellPadding"\n      [style.paddingBottom]="_cellPadding">\n    {{label}}\n  </td>\n</tr>\n\n<!-- Create the first row separately so we can include a special spacer cell. -->\n<tr *ngFor="let row of rows; let rowIndex = index" role="row">\n  <!--\n    This cell is purely decorative, but we can\'t put `aria-hidden` or `role="presentation"` on it,\n    because it throws off the week days for the rest of the row on NVDA. The aspect ratio of the\n    table cells is maintained by setting the top and bottom padding as a percentage of the width\n    (a variant of the trick described here: https://www.w3schools.com/howto/howto_css_aspect_ratio.asp).\n  -->\n  <td *ngIf="rowIndex === 0 && _firstRowOffset"\n      class="tak-calendar-body-label"\n      [attr.colspan]="_firstRowOffset"\n      [style.paddingTop]="_cellPadding"\n      [style.paddingBottom]="_cellPadding">\n    {{_firstRowOffset >= labelMinRequiredCells ? label : \'\'}}\n  </td>\n  <!--\n    Each gridcell in the calendar contains a button, which signals to assistive technology that the\n    cell is interactable, as well as the selection state via `aria-pressed`. See #23476 for\n    background.\n  -->\n  <td\n    *ngFor="let item of row; let colIndex = index"\n    role="gridcell"\n    class="tak-calendar-body-cell-container"\n    [style.width]="_cellWidth"\n    [style.paddingTop]="_cellPadding"\n    [style.paddingBottom]="_cellPadding"\n    [attr.data-tak-row]="rowIndex"\n    [attr.data-tak-col]="colIndex"\n  >\n    <button\n        type="button"\n        class="tak-calendar-body-cell"\n        [ngClass]="item.cssClasses"\n        [tabindex]="_isActiveCell(rowIndex, colIndex) ? 0 : -1"\n        [class.tak-calendar-body-disabled]="!item.enabled"\n        [class.tak-calendar-body-active]="_isActiveCell(rowIndex, colIndex)"\n        [class.tak-calendar-body-range-start]="_isRangeStart(item.compareValue)"\n        [class.tak-calendar-body-range-end]="_isRangeEnd(item.compareValue)"\n        [class.tak-calendar-body-in-range]="_isInRange(item.compareValue)"\n        [class.tak-calendar-body-comparison-bridge-start]="_isComparisonBridgeStart(item.compareValue, rowIndex, colIndex)"\n        [class.tak-calendar-body-comparison-bridge-end]="_isComparisonBridgeEnd(item.compareValue, rowIndex, colIndex)"\n        [class.tak-calendar-body-comparison-start]="_isComparisonStart(item.compareValue)"\n        [class.tak-calendar-body-comparison-end]="_isComparisonEnd(item.compareValue)"\n        [class.tak-calendar-body-in-comparison-range]="_isInComparisonRange(item.compareValue)"\n        [class.tak-calendar-body-preview-start]="_isPreviewStart(item.compareValue)"\n        [class.tak-calendar-body-preview-end]="_isPreviewEnd(item.compareValue)"\n        [class.tak-calendar-body-in-preview]="_isInPreview(item.compareValue)"\n        [attr.aria-label]="item.ariaLabel"\n        [attr.aria-disabled]="!item.enabled || null"\n        [attr.aria-pressed]="_isSelected(item.compareValue)"\n        [attr.aria-current]="todayValue === item.compareValue ? \'date\' : null"\n        (click)="_cellClicked(item, $event)"\n        (focus)="_emitActiveDateChange(item, $event)">\n        <div class="tak-calendar-body-cell-content tak-focus-indicator"\n          [class.tak-calendar-body-selected]="_isSelected(item.compareValue)"\n          [class.tak-calendar-body-comparison-identical]="_isComparisonIdentical(item.compareValue)"\n          [class.tak-calendar-body-today]="todayValue === item.compareValue">\n          {{item.displayValue}}\n        </div>\n        <div class="tak-calendar-body-cell-preview" aria-hidden="true"></div>\n    </button>\n  </td>\n</tr>\n',
          styles: [
            '.tak-calendar-body{min-width:224px}.tak-calendar-body-label{height:0;line-height:0;text-align:left;padding-left:4.7142857143%;padding-right:4.7142857143%}.tak-calendar-body-cell-container{position:relative;height:0;line-height:0}.tak-calendar-body-cell{-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);position:absolute;top:0;left:0;width:100%;height:100%;background:none;text-align:center;outline:none;font-family:inherit;margin:0}.tak-calendar-body-cell::-moz-focus-inner{border:0}.tak-calendar-body-cell::before,.tak-calendar-body-cell::after,.tak-calendar-body-cell-preview{content:"";position:absolute;top:5%;left:0;z-index:0;box-sizing:border-box;height:90%;width:100%}.tak-calendar-body-range-start:not(.tak-calendar-body-in-comparison-range)::before,.tak-calendar-body-range-start::after,.tak-calendar-body-comparison-start:not(.tak-calendar-body-comparison-bridge-start)::before,.tak-calendar-body-comparison-start::after,.tak-calendar-body-preview-start .tak-calendar-body-cell-preview{left:5%;width:95%;border-top-left-radius:999px;border-bottom-left-radius:999px}[dir=rtl] .tak-calendar-body-range-start:not(.tak-calendar-body-in-comparison-range)::before,[dir=rtl] .tak-calendar-body-range-start::after,[dir=rtl] .tak-calendar-body-comparison-start:not(.tak-calendar-body-comparison-bridge-start)::before,[dir=rtl] .tak-calendar-body-comparison-start::after,[dir=rtl] .tak-calendar-body-preview-start .tak-calendar-body-cell-preview{left:0;border-radius:0;border-top-right-radius:999px;border-bottom-right-radius:999px}.tak-calendar-body-range-end:not(.tak-calendar-body-in-comparison-range)::before,.tak-calendar-body-range-end::after,.tak-calendar-body-comparison-end:not(.tak-calendar-body-comparison-bridge-end)::before,.tak-calendar-body-comparison-end::after,.tak-calendar-body-preview-end .tak-calendar-body-cell-preview{width:95%;border-top-right-radius:999px;border-bottom-right-radius:999px}[dir=rtl] .tak-calendar-body-range-end:not(.tak-calendar-body-in-comparison-range)::before,[dir=rtl] .tak-calendar-body-range-end::after,[dir=rtl] .tak-calendar-body-comparison-end:not(.tak-calendar-body-comparison-bridge-end)::before,[dir=rtl] .tak-calendar-body-comparison-end::after,[dir=rtl] .tak-calendar-body-preview-end .tak-calendar-body-cell-preview{left:5%;border-radius:0;border-top-left-radius:999px;border-bottom-left-radius:999px}[dir=rtl] .tak-calendar-body-comparison-bridge-start.tak-calendar-body-range-end::after,[dir=rtl] .tak-calendar-body-comparison-bridge-end.tak-calendar-body-range-start::after{width:95%;border-top-right-radius:999px;border-bottom-right-radius:999px}.tak-calendar-body-comparison-start.tak-calendar-body-range-end::after,[dir=rtl] .tak-calendar-body-comparison-start.tak-calendar-body-range-end::after,.tak-calendar-body-comparison-end.tak-calendar-body-range-start::after,[dir=rtl] .tak-calendar-body-comparison-end.tak-calendar-body-range-start::after{width:90%}.tak-calendar-body-in-preview .tak-calendar-body-cell-preview{border-top:dashed 1px;border-bottom:dashed 1px}.tak-calendar-body-preview-start .tak-calendar-body-cell-preview{border-left:dashed 1px}[dir=rtl] .tak-calendar-body-preview-start .tak-calendar-body-cell-preview{border-left:0;border-right:dashed 1px}.tak-calendar-body-preview-end .tak-calendar-body-cell-preview{border-right:dashed 1px}[dir=rtl] .tak-calendar-body-preview-end .tak-calendar-body-cell-preview{border-right:0;border-left:dashed 1px}.tak-calendar-body-disabled{cursor:default}.cdk-high-contrast-active .tak-calendar-body-disabled{opacity:.5}.tak-calendar-body-cell-content{top:5%;left:5%;z-index:1;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;line-height:1;border-width:1px;border-style:solid;border-radius:999px}.tak-calendar-body-cell-content.tak-focus-indicator{position:absolute}.cdk-high-contrast-active .tak-calendar-body-cell-content{border:none}.cdk-high-contrast-active .tak-datepicker-popup:not(:empty),.cdk-high-contrast-active .tak-calendar-body-cell:not(.tak-calendar-body-in-range) .tak-calendar-body-selected{outline:solid 1px}.cdk-high-contrast-active .tak-calendar-body-today{outline:dotted 1px}.cdk-high-contrast-active .tak-calendar-body-cell::before,.cdk-high-contrast-active .tak-calendar-body-cell::after,.cdk-high-contrast-active .tak-calendar-body-selected{background:none}.cdk-high-contrast-active .tak-calendar-body-in-range::before,.cdk-high-contrast-active .tak-calendar-body-comparison-bridge-start::before,.cdk-high-contrast-active .tak-calendar-body-comparison-bridge-end::before{border-top:solid 1px;border-bottom:solid 1px}.cdk-high-contrast-active .tak-calendar-body-range-start::before{border-left:solid 1px}[dir=rtl] .cdk-high-contrast-active .tak-calendar-body-range-start::before{border-left:0;border-right:solid 1px}.cdk-high-contrast-active .tak-calendar-body-range-end::before{border-right:solid 1px}[dir=rtl] .cdk-high-contrast-active .tak-calendar-body-range-end::before{border-right:0;border-left:solid 1px}.cdk-high-contrast-active .tak-calendar-body-in-comparison-range::before{border-top:dashed 1px;border-bottom:dashed 1px}.cdk-high-contrast-active .tak-calendar-body-comparison-start::before{border-left:dashed 1px}[dir=rtl] .cdk-high-contrast-active .tak-calendar-body-comparison-start::before{border-left:0;border-right:dashed 1px}.cdk-high-contrast-active .tak-calendar-body-comparison-end::before{border-right:dashed 1px}[dir=rtl] .cdk-high-contrast-active .tak-calendar-body-comparison-end::before{border-right:0;border-left:dashed 1px}[dir=rtl] .tak-calendar-body-label{text-align:right}',
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [{ type: i0.ElementRef }, { type: i0.NgZone }];
  },
  propDecorators: {
    label: [
      {
        type: Input,
      },
    ],
    rows: [
      {
        type: Input,
      },
    ],
    todayValue: [
      {
        type: Input,
      },
    ],
    startValue: [
      {
        type: Input,
      },
    ],
    endValue: [
      {
        type: Input,
      },
    ],
    labelMinRequiredCells: [
      {
        type: Input,
      },
    ],
    numCols: [
      {
        type: Input,
      },
    ],
    activeCell: [
      {
        type: Input,
      },
    ],
    isRange: [
      {
        type: Input,
      },
    ],
    cellAspectRatio: [
      {
        type: Input,
      },
    ],
    comparisonStart: [
      {
        type: Input,
      },
    ],
    comparisonEnd: [
      {
        type: Input,
      },
    ],
    previewStart: [
      {
        type: Input,
      },
    ],
    previewEnd: [
      {
        type: Input,
      },
    ],
    selectedValueChange: [
      {
        type: Output,
      },
    ],
    previewChange: [
      {
        type: Output,
      },
    ],
    activeDateChange: [
      {
        type: Output,
      },
    ],
  },
});
/** Checks whether a node is a table cell element. */
function isTableCell(node) {
  return node.nodeName === 'TD';
}
/** Checks whether a value is the start of a range. */
function isStart(value, start, end) {
  return end !== null && start !== end && value < end && value === start;
}
/** Checks whether a value is the end of a range. */
function isEnd(value, start, end) {
  return start !== null && start !== end && value >= start && value === end;
}
/** Checks whether a value is inside of a range. */
function isInRange(value, start, end, rangeEnabled) {
  return (
    rangeEnabled &&
    start !== null &&
    end !== null &&
    start !== end &&
    value >= start &&
    value <= end
  );
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL2NhbGVuZGFyLWJvZHkudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9jYWxlbmRhci1ib2R5Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixNQUFNLEdBS1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7QUFXcEM7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLGVBQWU7SUFDMUIsWUFDUyxLQUFhLEVBQ2IsWUFBb0IsRUFDcEIsU0FBaUIsRUFDakIsT0FBZ0IsRUFDaEIsYUFBd0MsRUFBRSxFQUMxQyxlQUFlLEtBQUssRUFDcEIsUUFBWTtRQU5aLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUNwQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsZUFBVSxHQUFWLFVBQVUsQ0FBZ0M7UUFDMUMsaUJBQVksR0FBWixZQUFZLENBQVE7UUFDcEIsYUFBUSxHQUFSLFFBQVEsQ0FBSTtJQUNsQixDQUFDO0NBQ0w7QUFRRDs7O0dBR0c7QUFZSCxNQUFNLE9BQU8sZUFBZTtJQW1GMUIsWUFBb0IsV0FBb0MsRUFBVSxPQUFlO1FBQTdELGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVE7UUE1RWpGOztXQUVHO1FBQ0sscUNBQWdDLEdBQUcsS0FBSyxDQUFDO1FBb0JqRCwwQ0FBMEM7UUFDakMsWUFBTyxHQUFX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R0FBRztRQUNiLEtBQUssSUFBSSxLQUFLO1FBQ2QsS0FBSyxJQUFJLEdBQUcsQ0FDYixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBBZnRlclZpZXdDaGVja2VkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKiogRXh0cmEgQ1NTIGNsYXNzZXMgdGhhdCBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgY2FsZW5kYXIgY2VsbC4gKi9cbmV4cG9ydCB0eXBlIE1hdENhbGVuZGFyQ2VsbENzc0NsYXNzZXMgPSBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+IHwge1trZXk6IHN0cmluZ106IGFueX07XG5cbi8qKiBGdW5jdGlvbiB0aGF0IGNhbiBnZW5lcmF0ZSB0aGUgZXh0cmEgY2xhc3NlcyB0aGF0IHNob3VsZCBiZSBhZGRlZCB0byBhIGNhbGVuZGFyIGNlbGwuICovXG5leHBvcnQgdHlwZSBNYXRDYWxlbmRhckNlbGxDbGFzc0Z1bmN0aW9uPEQ+ID0gKFxuICBkYXRlOiBELFxuICB2aWV3OiAnbW9udGgnIHwgJ3llYXInIHwgJ211bHRpLXllYXInLFxuKSA9PiBNYXRDYWxlbmRhckNlbGxDc3NDbGFzc2VzO1xuXG4vKipcbiAqIEFuIGludGVybmFsIGNsYXNzIHRoYXQgcmVwcmVzZW50cyB0aGUgZGF0YSBjb3JyZXNwb25kaW5nIHRvIGEgc2luZ2xlIGNhbGVuZGFyIGNlbGwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRDYWxlbmRhckNlbGw8RCA9IGFueT4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgdmFsdWU6IG51bWJlcixcbiAgICBwdWJsaWMgZGlzcGxheVZhbHVlOiBzdHJpbmcsXG4gICAgcHVibGljIGFyaWFMYWJlbDogc3RyaW5nLFxuICAgIHB1YmxpYyBlbmFibGVkOiBib29sZWFuLFxuICAgIHB1YmxpYyBjc3NDbGFzc2VzOiBNYXRDYWxlbmRhckNlbGxDc3NDbGFzc2VzID0ge30sXG4gICAgcHVibGljIGNvbXBhcmVWYWx1ZSA9IHZhbHVlLFxuICAgIHB1YmxpYyByYXdWYWx1ZT86IEQsXG4gICkge31cbn1cblxuLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiBhIGRhdGUgaW5zaWRlIHRoZSBjYWxlbmRhciBpcyB0cmlnZ2VyZWQgYXMgYSByZXN1bHQgb2YgYSB1c2VyIGFjdGlvbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RD4ge1xuICB2YWx1ZTogRDtcbiAgZXZlbnQ6IEV2ZW50O1xufVxuXG4vKipcbiAqIEFuIGludGVybmFsIGNvbXBvbmVudCB1c2VkIHRvIGRpc3BsYXkgY2FsZW5kYXIgZGF0YSBpbiBhIHRhYmxlLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbWF0LWNhbGVuZGFyLWJvZHldJyxcbiAgdGVtcGxhdGVVcmw6ICdjYWxlbmRhci1ib2R5Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnY2FsZW5kYXItYm9keS5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2FsZW5kYXItYm9keScsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0Q2FsZW5kYXJCb2R5JyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdENhbGVuZGFyQm9keSBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlclZpZXdDaGVja2VkIHtcbiAgLyoqXG4gICAqIFVzZWQgdG8gc2tpcCB0aGUgbmV4dCBmb2N1cyBldmVudCB3aGVuIHJlbmRlcmluZyB0aGUgcHJldmlldyByYW5nZS5cbiAgICogV2UgbmVlZCBhIGZsYWcgbGlrZSB0aGlzLCBiZWNhdXNlIHNvbWUgYnJvd3NlcnMgZmlyZSBmb2N1cyBldmVudHMgYXN5bmNocm9ub3VzbHkuXG4gICAqL1xuICBwcml2YXRlIF9za2lwTmV4dEZvY3VzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGZvY3VzIHRoZSBhY3RpdmUgY2VsbCBhZnRlciBjaGFuZ2UgZGV0ZWN0aW9uIGhhcyBydW4uXG4gICAqL1xuICBwcml2YXRlIF9mb2N1c0FjdGl2ZUNlbGxBZnRlclZpZXdDaGVja2VkID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBsYWJlbCBmb3IgdGhlIHRhYmxlLiAoZS5nLiBcIkphbiAyMDE3XCIpLiAqL1xuICBASW5wdXQoKSBsYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgY2VsbHMgdG8gZGlzcGxheSBpbiB0aGUgdGFibGUuICovXG4gIEBJbnB1dCgpIHJvd3M6IE1hdENhbGVuZGFyQ2VsbFtdW107XG5cbiAgLyoqIFRoZSB2YWx1ZSBpbiB0aGUgdGFibGUgdGhhdCBjb3JyZXNwb25kcyB0byB0b2RheS4gKi9cbiAgQElucHV0KCkgdG9kYXlWYWx1ZTogbnVtYmVyO1xuXG4gIC8qKiBTdGFydCB2YWx1ZSBvZiB0aGUgc2VsZWN0ZWQgZGF0ZSByYW5nZS4gKi9cbiAgQElucHV0KCkgc3RhcnRWYWx1ZTogbnVtYmVyO1xuXG4gIC8qKiBFbmQgdmFsdWUgb2YgdGhlIHNlbGVjdGVkIGRhdGUgcmFuZ2UuICovXG4gIEBJbnB1dCgpIGVuZFZhbHVlOiBudW1iZXI7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIG51bWJlciBvZiBmcmVlIGNlbGxzIG5lZWRlZCB0byBmaXQgdGhlIGxhYmVsIGluIHRoZSBmaXJzdCByb3cuICovXG4gIEBJbnB1dCgpIGxhYmVsTWluUmVxdWlyZWRDZWxsczogbnVtYmVyO1xuXG4gIC8qKiBUaGUgbnVtYmVyIG9mIGNvbHVtbnMgaW4gdGhlIHRhYmxlLiAqL1xuICBASW5wdXQoKSBudW1Db2xzOiBudW1iZXIgPSA3O1xuXG4gIC8qKiBUaGUgY2VsbCBudW1iZXIgb2YgdGhlIGFjdGl2ZSBjZWxsIGluIHRoZSB0YWJsZS4gKi9cbiAgQElucHV0KCkgYWN0aXZlQ2VsbDogbnVtYmVyID0gMDtcblxuICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgaWYgKHRoaXMuX2ZvY3VzQWN0aXZlQ2VsbEFmdGVyVmlld0NoZWNrZWQpIHtcbiAgICAgIHRoaXMuX2ZvY3VzQWN0aXZlQ2VsbCgpO1xuICAgICAgdGhpcy5fZm9jdXNBY3RpdmVDZWxsQWZ0ZXJWaWV3Q2hlY2tlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIGEgcmFuZ2UgaXMgYmVpbmcgc2VsZWN0ZWQuICovXG4gIEBJbnB1dCgpIGlzUmFuZ2U6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIGFzcGVjdCByYXRpbyAod2lkdGggLyBoZWlnaHQpIHRvIHVzZSBmb3IgdGhlIGNlbGxzIGluIHRoZSB0YWJsZS4gVGhpcyBhc3BlY3QgcmF0aW8gd2lsbCBiZVxuICAgKiBtYWludGFpbmVkIGV2ZW4gYXMgdGhlIHRhYmxlIHJlc2l6ZXMuXG4gICAqL1xuICBASW5wdXQoKSBjZWxsQXNwZWN0UmF0aW86IG51bWJlciA9IDE7XG5cbiAgLyoqIFN0YXJ0IG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBASW5wdXQoKSBjb21wYXJpc29uU3RhcnQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvbkVuZDogbnVtYmVyIHwgbnVsbDtcblxuICAvKiogU3RhcnQgb2YgdGhlIHByZXZpZXcgcmFuZ2UuICovXG4gIEBJbnB1dCgpIHByZXZpZXdTdGFydDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgcHJldmlldyByYW5nZS4gKi9cbiAgQElucHV0KCkgcHJldmlld0VuZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYSBuZXcgdmFsdWUgaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3RlZFZhbHVlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRDYWxlbmRhclVzZXJFdmVudDxudW1iZXI+PigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBwcmV2aWV3IGhhcyBjaGFuZ2VkIGFzIGEgcmVzdWx0IG9mIGEgdXNlciBhY3Rpb24uICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwcmV2aWV3Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBNYXRDYWxlbmRhclVzZXJFdmVudDxNYXRDYWxlbmRhckNlbGwgfCBudWxsPlxuICA+KCk7XG5cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGFjdGl2ZURhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVXNlckV2ZW50PG51bWJlcj4+KCk7XG5cbiAgLyoqIFRoZSBudW1iZXIgb2YgYmxhbmsgY2VsbHMgdG8gcHV0IGF0IHRoZSBiZWdpbm5pbmcgZm9yIHRoZSBmaXJzdCByb3cuICovXG4gIF9maXJzdFJvd09mZnNldDogbnVtYmVyO1xuXG4gIC8qKiBQYWRkaW5nIGZvciB0aGUgaW5kaXZpZHVhbCBkYXRlIGNlbGxzLiAqL1xuICBfY2VsbFBhZGRpbmc6IHN0cmluZztcblxuICAvKiogV2lkdGggb2YgYW4gaW5kaXZpZHVhbCBjZWxsLiAqL1xuICBfY2VsbFdpZHRoOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7XG4gICAgX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX2VudGVySGFuZGxlciwgdHJ1ZSk7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fZW50ZXJIYW5kbGVyLCB0cnVlKTtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMuX2xlYXZlSGFuZGxlciwgdHJ1ZSk7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9sZWF2ZUhhbmRsZXIsIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIGEgY2VsbCBpcyBjbGlja2VkLiAqL1xuICBfY2VsbENsaWNrZWQoY2VsbDogTWF0Q2FsZW5kYXJDZWxsLCBldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmIChjZWxsLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRWYWx1ZUNoYW5nZS5lbWl0KHt2YWx1ZTogY2VsbC52YWx1ZSwgZXZlbnR9KTtcbiAgICB9XG4gIH1cblxuICBfZW1pdEFjdGl2ZURhdGVDaGFuZ2UoY2VsbDogTWF0Q2FsZW5kYXJDZWxsLCBldmVudDogRm9jdXNFdmVudCk6IHZvaWQge1xuICAgIGlmIChjZWxsLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuYWN0aXZlRGF0ZUNoYW5nZS5lbWl0KHt2YWx1ZTogY2VsbC52YWx1ZSwgZXZlbnR9KTtcbiAgICB9XG4gIH1cblxuICAvKiogUmV0dXJucyB3aGV0aGVyIGEgY2VsbCBzaG91bGQgYmUgbWFya2VkIGFzIHNlbGVjdGVkLiAqL1xuICBfaXNTZWxlY3RlZCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRWYWx1ZSA9PT0gdmFsdWUgfHwgdGhpcy5lbmRWYWx1ZSA9PT0gdmFsdWU7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgY29sdW1uQ2hhbmdlcyA9IGNoYW5nZXNbJ251bUNvbHMnXTtcbiAgICBjb25zdCB7cm93cywgbnVtQ29sc30gPSB0aGlzO1xuXG4gICAgaWYgKGNoYW5nZXNbJ3Jvd3MnXSB8fCBjb2x1bW5DaGFuZ2VzKSB7XG4gICAgICB0aGlzLl9maXJzdFJvd09mZnNldCA9IHJvd3MgJiYgcm93cy5sZW5ndGggJiYgcm93c1swXS5sZW5ndGggPyBudW1Db2xzIC0gcm93c1swXS5sZW5ndGggOiAwO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzWydjZWxsQXNwZWN0UmF0aW8nXSB8fCBjb2x1bW5DaGFuZ2VzIHx8ICF0aGlzLl9jZWxsUGFkZGluZykge1xuICAgICAgdGhpcy5fY2VsbFBhZGRpbmcgPSBgJHsoNTAgKiB0aGlzLmNlbGxBc3BlY3RSYXRpbykgLyBudW1Db2xzfSVgO1xuICAgIH1cblxuICAgIGlmIChjb2x1bW5DaGFuZ2VzIHx8ICF0aGlzLl9jZWxsV2lkdGgpIHtcbiAgICAgIHRoaXMuX2NlbGxXaWR0aCA9IGAkezEwMCAvIG51bUNvbHN9JWA7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLl9lbnRlckhhbmRsZXIsIHRydWUpO1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9lbnRlckhhbmRsZXIsIHRydWUpO1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMuX2xlYXZlSGFuZGxlciwgdHJ1ZSk7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fbGVhdmVIYW5kbGVyLCB0cnVlKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHdoZXRoZXIgYSBjZWxsIGlzIGFjdGl2ZS4gKi9cbiAgX2lzQWN0aXZlQ2VsbChyb3dJbmRleDogbnVtYmVyLCBjb2xJbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgbGV0IGNlbGxOdW1iZXIgPSByb3dJbmRleCAqIHRoaXMubnVtQ29scyArIGNvbEluZGV4O1xuXG4gICAgLy8gQWNjb3VudCBmb3IgdGhlIGZhY3QgdGhhdCB0aGUgZmlyc3Qgcm93IG1heSBub3QgaGF2ZSBhcyBtYW55IGNlbGxzLlxuICAgIGlmIChyb3dJbmRleCkge1xuICAgICAgY2VsbE51bWJlciAtPSB0aGlzLl9maXJzdFJvd09mZnNldDtcbiAgICB9XG5cbiAgICByZXR1cm4gY2VsbE51bWJlciA9PSB0aGlzLmFjdGl2ZUNlbGw7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgYWN0aXZlIGNlbGwgYWZ0ZXIgdGhlIG1pY3JvdGFzayBxdWV1ZSBpcyBlbXB0eS5cbiAgICpcbiAgICogQWRkaW5nIGEgMG1zIHNldFRpbWVvdXQgc2VlbXMgdG8gZml4IFZvaWNlb3ZlciBsb3NpbmcgZm9jdXMgd2hlbiBwcmVzc2luZyBQYWdlVXAvUGFnZURvd25cbiAgICogKGlzc3VlICMyNDMzMCkuXG4gICAqXG4gICAqIERldGVybWluZWQgYSAwbXMgYnkgZ3JhZHVhbGx5IGluY3JlYXNpbmcgZHVyYXRpb24gZnJvbSAwIGFuZCB0ZXN0aW5nIHR3byB1c2UgY2FzZXMgd2l0aCBzY3JlZW5cbiAgICogcmVhZGVyIGVuYWJsZWQ6XG4gICAqXG4gICAqIDEuIFByZXNzaW5nIFBhZ2VVcC9QYWdlRG93biByZXBlYXRlZGx5IHdpdGggcGF1c2luZyBiZXR3ZWVuIGVhY2gga2V5IHByZXNzLlxuICAgKiAyLiBQcmVzc2luZyBhbmQgaG9sZGluZyB0aGUgUGFnZURvd24ga2V5IHdpdGggcmVwZWF0ZWQga2V5cyBlbmFibGVkLlxuICAgKlxuICAgKiBUZXN0IDEgd29ya2VkIHJvdWdobHkgOTUtOTklIG9mIHRoZSB0aW1lIHdpdGggMG1zIGFuZCBnb3QgYSBsaXR0bGUgYml0IGJldHRlciBhcyB0aGUgZHVyYXRpb25cbiAgICogaW5jcmVhc2VkLiBUZXN0IDIgZ290IHNsaWdodGx5IGJldHRlciB1bnRpbCB0aGUgZHVyYXRpb24gd2FzIGxvbmcgZW5vdWdoIHRvIGludGVyZmVyZSB3aXRoXG4gICAqIHJlcGVhdGVkIGtleXMuIElmIHRoZSByZXBlYXRlZCBrZXkgc3BlZWQgd2FzIGZhc3RlciB0aGFuIHRoZSB0aW1lb3V0IGR1cmF0aW9uLCB0aGVuIHByZXNzaW5nXG4gICAqIGFuZCBob2xkaW5nIHBhZ2Vkb3duIGNhdXNlZCB0aGUgZW50aXJlIHBhZ2UgdG8gc2Nyb2xsLlxuICAgKlxuICAgKiBTaW5jZSByZXBlYXRlZCBrZXkgc3BlZWQgY2FuIHZlcmlmeSBhY3Jvc3MgbWFjaGluZXMsIGRldGVybWluZWQgdGhhdCBhbnkgZHVyYXRpb24gY291bGRcbiAgICogcG90ZW50aWFsbHkgaW50ZXJmZXJlIHdpdGggcmVwZWF0ZWQga2V5cy4gMG1zIHdvdWxkIGJlIGJlc3QgYmVjYXVzZSBpdCBhbG1vc3QgZW50aXJlbHlcbiAgICogZWxpbWluYXRlcyB0aGUgZm9jdXMgYmVpbmcgbG9zdCBpbiBWb2ljZW92ZXIgKCMyNDMzMCkgd2l0aG91dCBjYXVzaW5nIHVuaW50ZW5kZWQgc2lkZSBlZmZlY3RzLlxuICAgKiBBZGRpbmcgZGVsYXkgYWxzbyBjb21wbGljYXRlcyB3cml0aW5nIHRlc3RzLlxuICAgKi9cbiAgX2ZvY3VzQWN0aXZlQ2VsbChtb3ZlUHJldmlldyA9IHRydWUpIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgYWN0aXZlQ2VsbDogSFRNTEVsZW1lbnQgfCBudWxsID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAnLm1hdC1jYWxlbmRhci1ib2R5LWFjdGl2ZScsXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmIChhY3RpdmVDZWxsKSB7XG4gICAgICAgICAgICBpZiAoIW1vdmVQcmV2aWV3KSB7XG4gICAgICAgICAgICAgIHRoaXMuX3NraXBOZXh0Rm9jdXMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhY3RpdmVDZWxsLmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGFjdGl2ZSBjZWxsIGFmdGVyIGNoYW5nZSBkZXRlY3Rpb24gaGFzIHJ1biBhbmQgdGhlIG1pY3JvdGFzayBxdWV1ZSBpcyBlbXB0eS4gKi9cbiAgX3NjaGVkdWxlRm9jdXNBY3RpdmVDZWxsQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICB0aGlzLl9mb2N1c0FjdGl2ZUNlbGxBZnRlclZpZXdDaGVja2VkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0aGUgc3RhcnQgb2YgdGhlIG1haW4gcmFuZ2UuICovXG4gIF9pc1JhbmdlU3RhcnQodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiBpc1N0YXJ0KHZhbHVlLCB0aGlzLnN0YXJ0VmFsdWUsIHRoaXMuZW5kVmFsdWUpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIHRoZSBlbmQgb2YgdGhlIG1haW4gcmFuZ2UuICovXG4gIF9pc1JhbmdlRW5kKHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXNFbmQodmFsdWUsIHRoaXMuc3RhcnRWYWx1ZSwgdGhpcy5lbmRWYWx1ZSk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgd2l0aGluIHRoZSBjdXJyZW50bHktc2VsZWN0ZWQgcmFuZ2UuICovXG4gIF9pc0luUmFuZ2UodmFsdWU6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc0luUmFuZ2UodmFsdWUsIHRoaXMuc3RhcnRWYWx1ZSwgdGhpcy5lbmRWYWx1ZSwgdGhpcy5pc1JhbmdlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0aGUgc3RhcnQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIF9pc0NvbXBhcmlzb25TdGFydCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzU3RhcnQodmFsdWUsIHRoaXMuY29tcGFyaXNvblN0YXJ0LCB0aGlzLmNvbXBhcmlzb25FbmQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNlbGwgaXMgYSBzdGFydCBicmlkZ2UgY2VsbCBiZXR3ZWVuIHRoZSBtYWluIGFuZCBjb21wYXJpc29uIHJhbmdlcy4gKi9cbiAgX2lzQ29tcGFyaXNvbkJyaWRnZVN0YXJ0KHZhbHVlOiBudW1iZXIsIHJvd0luZGV4OiBudW1iZXIsIGNvbEluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMuX2lzQ29tcGFyaXNvblN0YXJ0KHZhbHVlKSB8fCB0aGlzLl9pc1JhbmdlU3RhcnQodmFsdWUpIHx8ICF0aGlzLl9pc0luUmFuZ2UodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IHByZXZpb3VzQ2VsbDogTWF0Q2FsZW5kYXJDZWxsIHwgdW5kZWZpbmVkID0gdGhpcy5yb3dzW3Jvd0luZGV4XVtjb2xJbmRleCAtIDFdO1xuXG4gICAgaWYgKCFwcmV2aW91c0NlbGwpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzUm93ID0gdGhpcy5yb3dzW3Jvd0luZGV4IC0gMV07XG4gICAgICBwcmV2aW91c0NlbGwgPSBwcmV2aW91c1JvdyAmJiBwcmV2aW91c1Jvd1twcmV2aW91c1Jvdy5sZW5ndGggLSAxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJldmlvdXNDZWxsICYmICF0aGlzLl9pc1JhbmdlRW5kKHByZXZpb3VzQ2VsbC5jb21wYXJlVmFsdWUpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNlbGwgaXMgYW4gZW5kIGJyaWRnZSBjZWxsIGJldHdlZW4gdGhlIG1haW4gYW5kIGNvbXBhcmlzb24gcmFuZ2VzLiAqL1xuICBfaXNDb21wYXJpc29uQnJpZGdlRW5kKHZhbHVlOiBudW1iZXIsIHJvd0luZGV4OiBudW1iZXIsIGNvbEluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMuX2lzQ29tcGFyaXNvbkVuZCh2YWx1ZSkgfHwgdGhpcy5faXNSYW5nZUVuZCh2YWx1ZSkgfHwgIXRoaXMuX2lzSW5SYW5nZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgbmV4dENlbGw6IE1hdENhbGVuZGFyQ2VsbCB8IHVuZGVmaW5lZCA9IHRoaXMucm93c1tyb3dJbmRleF1bY29sSW5kZXggKyAxXTtcblxuICAgIGlmICghbmV4dENlbGwpIHtcbiAgICAgIGNvbnN0IG5leHRSb3cgPSB0aGlzLnJvd3Nbcm93SW5kZXggKyAxXTtcbiAgICAgIG5leHRDZWxsID0gbmV4dFJvdyAmJiBuZXh0Um93WzBdO1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0Q2VsbCAmJiAhdGhpcy5faXNSYW5nZVN0YXJ0KG5leHRDZWxsLmNvbXBhcmVWYWx1ZSk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIGVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgX2lzQ29tcGFyaXNvbkVuZCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzRW5kKHZhbHVlLCB0aGlzLmNvbXBhcmlzb25TdGFydCwgdGhpcy5jb21wYXJpc29uRW5kKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyB3aXRoaW4gdGhlIGN1cnJlbnQgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgX2lzSW5Db21wYXJpc29uUmFuZ2UodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiBpc0luUmFuZ2UodmFsdWUsIHRoaXMuY29tcGFyaXNvblN0YXJ0LCB0aGlzLmNvbXBhcmlzb25FbmQsIHRoaXMuaXNSYW5nZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIHNhbWUgYXMgdGhlIHN0YXJ0IGFuZCBlbmQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuXG4gICAqIEZvciBjb250ZXh0LCB0aGUgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIHRvIGRldGVybWluZSB3aGV0aGVyIHNvbWV0aGluZyBpcyB0aGUgc3RhcnQvZW5kIG9mXG4gICAqIGEgcmFuZ2UgZG9uJ3QgYWxsb3cgZm9yIHRoZSBzdGFydCBhbmQgZW5kIHRvIGJlIG9uIHRoZSBzYW1lIGRheSwgYmVjYXVzZSB3ZSdkIGhhdmUgdG8gdXNlXG4gICAqIG11Y2ggbW9yZSBzcGVjaWZpYyBDU1Mgc2VsZWN0b3JzIHRvIHN0eWxlIHRoZW0gY29ycmVjdGx5IGluIGFsbCBzY2VuYXJpb3MuIFRoaXMgaXMgZmluZSBmb3JcbiAgICogdGhlIHJlZ3VsYXIgcmFuZ2UsIGJlY2F1c2Ugd2hlbiBpdCBoYXBwZW5zLCB0aGUgc2VsZWN0ZWQgc3R5bGVzIHRha2Ugb3ZlciBhbmQgc3RpbGwgc2hvdyB3aGVyZVxuICAgKiB0aGUgcmFuZ2Ugd291bGQndmUgYmVlbiwgaG93ZXZlciB3ZSBkb24ndCBoYXZlIHRoZXNlIHNlbGVjdGVkIHN0eWxlcyBmb3IgYSBjb21wYXJpc29uIHJhbmdlLlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gYXBwbHkgYSBjbGFzcyB0aGF0IHNlcnZlcyB0aGUgc2FtZSBwdXJwb3NlIGFzIHRoZSBvbmUgZm9yIHNlbGVjdGVkXG4gICAqIGRhdGVzLCBidXQgaXQgb25seSBhcHBsaWVzIGluIHRoZSBjb250ZXh0IG9mIGEgY29tcGFyaXNvbiByYW5nZS5cbiAgICovXG4gIF9pc0NvbXBhcmlzb25JZGVudGljYWwodmFsdWU6IG51bWJlcikge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBkb24ndCBuZWVkIHRvIG51bGwgY2hlY2sgdGhlIHN0YXJ0L2VuZFxuICAgIC8vIGhlcmUsIGJlY2F1c2UgdGhlIGB2YWx1ZWAgd2lsbCBhbHdheXMgYmUgZGVmaW5lZC5cbiAgICByZXR1cm4gdGhpcy5jb21wYXJpc29uU3RhcnQgPT09IHRoaXMuY29tcGFyaXNvbkVuZCAmJiB2YWx1ZSA9PT0gdGhpcy5jb21wYXJpc29uU3RhcnQ7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIHN0YXJ0IG9mIHRoZSBwcmV2aWV3IHJhbmdlLiAqL1xuICBfaXNQcmV2aWV3U3RhcnQodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiBpc1N0YXJ0KHZhbHVlLCB0aGlzLnByZXZpZXdTdGFydCwgdGhpcy5wcmV2aWV3RW5kKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0aGUgZW5kIG9mIHRoZSBwcmV2aWV3IHJhbmdlLiAqL1xuICBfaXNQcmV2aWV3RW5kKHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXNFbmQodmFsdWUsIHRoaXMucHJldmlld1N0YXJ0LCB0aGlzLnByZXZpZXdFbmQpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHZhbHVlIGlzIGluc2lkZSB0aGUgcHJldmlldyByYW5nZS4gKi9cbiAgX2lzSW5QcmV2aWV3KHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXNJblJhbmdlKHZhbHVlLCB0aGlzLnByZXZpZXdTdGFydCwgdGhpcy5wcmV2aWV3RW5kLCB0aGlzLmlzUmFuZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gdGhlIHVzZXIgZW50ZXJzIGFuIGVsZW1lbnRcbiAgICogaW5zaWRlIHRoZSBjYWxlbmRhciBib2R5IChlLmcuIGJ5IGhvdmVyaW5nIGluIG9yIGZvY3VzKS5cbiAgICovXG4gIHByaXZhdGUgX2VudGVySGFuZGxlciA9IChldmVudDogRXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5fc2tpcE5leHRGb2N1cyAmJiBldmVudC50eXBlID09PSAnZm9jdXMnKSB7XG4gICAgICB0aGlzLl9za2lwTmV4dEZvY3VzID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2Ugb25seSBuZWVkIHRvIGhpdCB0aGUgem9uZSB3aGVuIHdlJ3JlIHNlbGVjdGluZyBhIHJhbmdlLlxuICAgIGlmIChldmVudC50YXJnZXQgJiYgdGhpcy5pc1JhbmdlKSB7XG4gICAgICBjb25zdCBjZWxsID0gdGhpcy5fZ2V0Q2VsbEZyb21FbGVtZW50KGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCk7XG5cbiAgICAgIGlmIChjZWxsKSB7XG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5wcmV2aWV3Q2hhbmdlLmVtaXQoe3ZhbHVlOiBjZWxsLmVuYWJsZWQgPyBjZWxsIDogbnVsbCwgZXZlbnR9KSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIGZvciB3aGVuIHRoZSB1c2VyJ3MgcG9pbnRlciBsZWF2ZXMgYW4gZWxlbWVudFxuICAgKiBpbnNpZGUgdGhlIGNhbGVuZGFyIGJvZHkgKGUuZy4gYnkgaG92ZXJpbmcgb3V0IG9yIGJsdXJyaW5nKS5cbiAgICovXG4gIHByaXZhdGUgX2xlYXZlSGFuZGxlciA9IChldmVudDogRXZlbnQpID0+IHtcbiAgICAvLyBXZSBvbmx5IG5lZWQgdG8gaGl0IHRoZSB6b25lIHdoZW4gd2UncmUgc2VsZWN0aW5nIGEgcmFuZ2UuXG4gICAgaWYgKHRoaXMucHJldmlld0VuZCAhPT0gbnVsbCAmJiB0aGlzLmlzUmFuZ2UpIHtcbiAgICAgIC8vIE9ubHkgcmVzZXQgdGhlIHByZXZpZXcgZW5kIHZhbHVlIHdoZW4gbGVhdmluZyBjZWxscy4gVGhpcyBsb29rcyBiZXR0ZXIsIGJlY2F1c2VcbiAgICAgIC8vIHdlIGhhdmUgYSBnYXAgYmV0d2VlbiB0aGUgY2VsbHMgYW5kIHRoZSByb3dzIGFuZCB3ZSBkb24ndCB3YW50IHRvIHJlbW92ZSB0aGVcbiAgICAgIC8vIHJhbmdlIGp1c3QgZm9yIGl0IHRvIHNob3cgdXAgYWdhaW4gd2hlbiB0aGUgdXNlciBtb3ZlcyBhIGZldyBwaXhlbHMgdG8gdGhlIHNpZGUuXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0ICYmIHRoaXMuX2dldENlbGxGcm9tRWxlbWVudChldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5wcmV2aWV3Q2hhbmdlLmVtaXQoe3ZhbHVlOiBudWxsLCBldmVudH0pKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqIEZpbmRzIHRoZSBNYXRDYWxlbmRhckNlbGwgdGhhdCBjb3JyZXNwb25kcyB0byBhIERPTSBub2RlLiAqL1xuICBwcml2YXRlIF9nZXRDZWxsRnJvbUVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBNYXRDYWxlbmRhckNlbGwgfCBudWxsIHtcbiAgICBsZXQgY2VsbDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgICBpZiAoaXNUYWJsZUNlbGwoZWxlbWVudCkpIHtcbiAgICAgIGNlbGwgPSBlbGVtZW50O1xuICAgIH0gZWxzZSBpZiAoaXNUYWJsZUNlbGwoZWxlbWVudC5wYXJlbnROb2RlISkpIHtcbiAgICAgIGNlbGwgPSBlbGVtZW50LnBhcmVudE5vZGUgYXMgSFRNTEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKGNlbGwpIHtcbiAgICAgIGNvbnN0IHJvdyA9IGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLW1hdC1yb3cnKTtcbiAgICAgIGNvbnN0IGNvbCA9IGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLW1hdC1jb2wnKTtcblxuICAgICAgaWYgKHJvdyAmJiBjb2wpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm93c1twYXJzZUludChyb3cpXVtwYXJzZUludChjb2wpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgYSBub2RlIGlzIGEgdGFibGUgY2VsbCBlbGVtZW50LiAqL1xuZnVuY3Rpb24gaXNUYWJsZUNlbGwobm9kZTogTm9kZSk6IG5vZGUgaXMgSFRNTFRhYmxlQ2VsbEVsZW1lbnQge1xuICByZXR1cm4gbm9kZS5ub2RlTmFtZSA9PT0gJ1REJztcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIHN0YXJ0IG9mIGEgcmFuZ2UuICovXG5mdW5jdGlvbiBpc1N0YXJ0KHZhbHVlOiBudW1iZXIsIHN0YXJ0OiBudW1iZXIgfCBudWxsLCBlbmQ6IG51bWJlciB8IG51bGwpOiBib29sZWFuIHtcbiAgcmV0dXJuIGVuZCAhPT0gbnVsbCAmJiBzdGFydCAhPT0gZW5kICYmIHZhbHVlIDwgZW5kICYmIHZhbHVlID09PSBzdGFydDtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIGEgdmFsdWUgaXMgdGhlIGVuZCBvZiBhIHJhbmdlLiAqL1xuZnVuY3Rpb24gaXNFbmQodmFsdWU6IG51bWJlciwgc3RhcnQ6IG51bWJlciB8IG51bGwsIGVuZDogbnVtYmVyIHwgbnVsbCk6IGJvb2xlYW4ge1xuICByZXR1cm4gc3RhcnQgIT09IG51bGwgJiYgc3RhcnQgIT09IGVuZCAmJiB2YWx1ZSA+PSBzdGFydCAmJiB2YWx1ZSA9PT0gZW5kO1xufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgYSB2YWx1ZSBpcyBpbnNpZGUgb2YgYSByYW5nZS4gKi9cbmZ1bmN0aW9uIGlzSW5SYW5nZShcbiAgdmFsdWU6IG51bWJlcixcbiAgc3RhcnQ6IG51bWJlciB8IG51bGwsXG4gIGVuZDogbnVtYmVyIHwgbnVsbCxcbiAgcmFuZ2VFbmFibGVkOiBib29sZWFuLFxuKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgcmFuZ2VFbmFibGVkICYmXG4gICAgc3RhcnQgIT09IG51bGwgJiZcbiAgICBlbmQgIT09IG51bGwgJiZcbiAgICBzdGFydCAhPT0gZW5kICYmXG4gICAgdmFsdWUgPj0gc3RhcnQgJiZcbiAgICB2YWx1ZSA8PSBlbmRcbiAgKTtcbn1cbiIsIjwhLS1cbiAgSWYgdGhlcmUncyBub3QgZW5vdWdoIHNwYWNlIGluIHRoZSBmaXJzdCByb3csIGNyZWF0ZSBhIHNlcGFyYXRlIGxhYmVsIHJvdy4gV2UgbWFyayB0aGlzIHJvdyBhc1xuICBhcmlhLWhpZGRlbiBiZWNhdXNlIHdlIGRvbid0IHdhbnQgaXQgdG8gYmUgcmVhZCBvdXQgYXMgb25lIG9mIHRoZSB3ZWVrcyBpbiB0aGUgbW9udGguXG4tLT5cbjx0ciAqbmdJZj1cIl9maXJzdFJvd09mZnNldCA8IGxhYmVsTWluUmVxdWlyZWRDZWxsc1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICA8dGQgY2xhc3M9XCJtYXQtY2FsZW5kYXItYm9keS1sYWJlbFwiXG4gICAgICBbYXR0ci5jb2xzcGFuXT1cIm51bUNvbHNcIlxuICAgICAgW3N0eWxlLnBhZGRpbmdUb3BdPVwiX2NlbGxQYWRkaW5nXCJcbiAgICAgIFtzdHlsZS5wYWRkaW5nQm90dG9tXT1cIl9jZWxsUGFkZGluZ1wiPlxuICAgIHt7bGFiZWx9fVxuICA8L3RkPlxuPC90cj5cblxuPCEtLSBDcmVhdGUgdGhlIGZpcnN0IHJvdyBzZXBhcmF0ZWx5IHNvIHdlIGNhbiBpbmNsdWRlIGEgc3BlY2lhbCBzcGFjZXIgY2VsbC4gLS0+XG48dHIgKm5nRm9yPVwibGV0IHJvdyBvZiByb3dzOyBsZXQgcm93SW5kZXggPSBpbmRleFwiIHJvbGU9XCJyb3dcIj5cbiAgPCEtLVxuICAgIFRoaXMgY2VsbCBpcyBwdXJlbHkgZGVjb3JhdGl2ZSwgYnV0IHdlIGNhbid0IHB1dCBgYXJpYS1oaWRkZW5gIG9yIGByb2xlPVwicHJlc2VudGF0aW9uXCJgIG9uIGl0LFxuICAgIGJlY2F1c2UgaXQgdGhyb3dzIG9mZiB0aGUgd2VlayBkYXlzIGZvciB0aGUgcmVzdCBvZiB0aGUgcm93IG9uIE5WREEuIFRoZSBhc3BlY3QgcmF0aW8gb2YgdGhlXG4gICAgdGFibGUgY2VsbHMgaXMgbWFpbnRhaW5lZCBieSBzZXR0aW5nIHRoZSB0b3AgYW5kIGJvdHRvbSBwYWRkaW5nIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgd2lkdGhcbiAgICAoYSB2YXJpYW50IG9mIHRoZSB0cmljayBkZXNjcmliZWQgaGVyZTogaHR0cHM6Ly93d3cudzNzY2hvb2xzLmNvbS9ob3d0by9ob3d0b19jc3NfYXNwZWN0X3JhdGlvLmFzcCkuXG4gIC0tPlxuICA8dGQgKm5nSWY9XCJyb3dJbmRleCA9PT0gMCAmJiBfZmlyc3RSb3dPZmZzZXRcIlxuICAgICAgY2xhc3M9XCJtYXQtY2FsZW5kYXItYm9keS1sYWJlbFwiXG4gICAgICBbYXR0ci5jb2xzcGFuXT1cIl9maXJzdFJvd09mZnNldFwiXG4gICAgICBbc3R5bGUucGFkZGluZ1RvcF09XCJfY2VsbFBhZGRpbmdcIlxuICAgICAgW3N0eWxlLnBhZGRpbmdCb3R0b21dPVwiX2NlbGxQYWRkaW5nXCI+XG4gICAge3tfZmlyc3RSb3dPZmZzZXQgPj0gbGFiZWxNaW5SZXF1aXJlZENlbGxzID8gbGFiZWwgOiAnJ319XG4gIDwvdGQ+XG4gIDwhLS1cbiAgICBFYWNoIGdyaWRjZWxsIGluIHRoZSBjYWxlbmRhciBjb250YWlucyBhIGJ1dHRvbiwgd2hpY2ggc2lnbmFscyB0byBhc3Npc3RpdmUgdGVjaG5vbG9neSB0aGF0IHRoZVxuICAgIGNlbGwgaXMgaW50ZXJhY3RhYmxlLCBhcyB3ZWxsIGFzIHRoZSBzZWxlY3Rpb24gc3RhdGUgdmlhIGBhcmlhLXByZXNzZWRgLiBTZWUgIzIzNDc2IGZvclxuICAgIGJhY2tncm91bmQuXG4gIC0tPlxuICA8dGRcbiAgICAqbmdGb3I9XCJsZXQgaXRlbSBvZiByb3c7IGxldCBjb2xJbmRleCA9IGluZGV4XCJcbiAgICByb2xlPVwiZ3JpZGNlbGxcIlxuICAgIGNsYXNzPVwibWF0LWNhbGVuZGFyLWJvZHktY2VsbC1jb250YWluZXJcIlxuICAgIFtzdHlsZS53aWR0aF09XCJfY2VsbFdpZHRoXCJcbiAgICBbc3R5bGUucGFkZGluZ1RvcF09XCJfY2VsbFBhZGRpbmdcIlxuICAgIFtzdHlsZS5wYWRkaW5nQm90dG9tXT1cIl9jZWxsUGFkZGluZ1wiXG4gICAgW2F0dHIuZGF0YS1tYXQtcm93XT1cInJvd0luZGV4XCJcbiAgICBbYXR0ci5kYXRhLW1hdC1jb2xdPVwiY29sSW5kZXhcIlxuICA+XG4gICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3M9XCJtYXQtY2FsZW5kYXItYm9keS1jZWxsXCJcbiAgICAgICAgW25nQ2xhc3NdPVwiaXRlbS5jc3NDbGFzc2VzXCJcbiAgICAgICAgW3RhYmluZGV4XT1cIl9pc0FjdGl2ZUNlbGwocm93SW5kZXgsIGNvbEluZGV4KSA/IDAgOiAtMVwiXG4gICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1kaXNhYmxlZF09XCIhaXRlbS5lbmFibGVkXCJcbiAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LWFjdGl2ZV09XCJfaXNBY3RpdmVDZWxsKHJvd0luZGV4LCBjb2xJbmRleClcIlxuICAgICAgICBbY2xhc3MubWF0LWNhbGVuZGFyLWJvZHktcmFuZ2Utc3RhcnRdPVwiX2lzUmFuZ2VTdGFydChpdGVtLmNvbXBhcmVWYWx1ZSlcIlxuICAgICAgICBbY2xhc3MubWF0LWNhbGVuZGFyLWJvZHktcmFuZ2UtZW5kXT1cIl9pc1JhbmdlRW5kKGl0ZW0uY29tcGFyZVZhbHVlKVwiXG4gICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1pbi1yYW5nZV09XCJfaXNJblJhbmdlKGl0ZW0uY29tcGFyZVZhbHVlKVwiXG4gICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1jb21wYXJpc29uLWJyaWRnZS1zdGFydF09XCJfaXNDb21wYXJpc29uQnJpZGdlU3RhcnQoaXRlbS5jb21wYXJlVmFsdWUsIHJvd0luZGV4LCBjb2xJbmRleClcIlxuICAgICAgICBbY2xhc3MubWF0LWNhbGVuZGFyLWJvZHktY29tcGFyaXNvbi1icmlkZ2UtZW5kXT1cIl9pc0NvbXBhcmlzb25CcmlkZ2VFbmQoaXRlbS5jb21wYXJlVmFsdWUsIHJvd0luZGV4LCBjb2xJbmRleClcIlxuICAgICAgICBbY2xhc3MubWF0LWNhbGVuZGFyLWJvZHktY29tcGFyaXNvbi1zdGFydF09XCJfaXNDb21wYXJpc29uU3RhcnQoaXRlbS5jb21wYXJlVmFsdWUpXCJcbiAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LWNvbXBhcmlzb24tZW5kXT1cIl9pc0NvbXBhcmlzb25FbmQoaXRlbS5jb21wYXJlVmFsdWUpXCJcbiAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LWluLWNvbXBhcmlzb24tcmFuZ2VdPVwiX2lzSW5Db21wYXJpc29uUmFuZ2UoaXRlbS5jb21wYXJlVmFsdWUpXCJcbiAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LXByZXZpZXctc3RhcnRdPVwiX2lzUHJldmlld1N0YXJ0KGl0ZW0uY29tcGFyZVZhbHVlKVwiXG4gICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1wcmV2aWV3LWVuZF09XCJfaXNQcmV2aWV3RW5kKGl0ZW0uY29tcGFyZVZhbHVlKVwiXG4gICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1pbi1wcmV2aWV3XT1cIl9pc0luUHJldmlldyhpdGVtLmNvbXBhcmVWYWx1ZSlcIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIml0ZW0uYXJpYUxhYmVsXCJcbiAgICAgICAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCIhaXRlbS5lbmFibGVkIHx8IG51bGxcIlxuICAgICAgICBbYXR0ci5hcmlhLXByZXNzZWRdPVwiX2lzU2VsZWN0ZWQoaXRlbS5jb21wYXJlVmFsdWUpXCJcbiAgICAgICAgW2F0dHIuYXJpYS1jdXJyZW50XT1cInRvZGF5VmFsdWUgPT09IGl0ZW0uY29tcGFyZVZhbHVlID8gJ2RhdGUnIDogbnVsbFwiXG4gICAgICAgIChjbGljayk9XCJfY2VsbENsaWNrZWQoaXRlbSwgJGV2ZW50KVwiXG4gICAgICAgIChmb2N1cyk9XCJfZW1pdEFjdGl2ZURhdGVDaGFuZ2UoaXRlbSwgJGV2ZW50KVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWF0LWNhbGVuZGFyLWJvZHktY2VsbC1jb250ZW50IG1hdC1mb2N1cy1pbmRpY2F0b3JcIlxuICAgICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1zZWxlY3RlZF09XCJfaXNTZWxlY3RlZChpdGVtLmNvbXBhcmVWYWx1ZSlcIlxuICAgICAgICAgIFtjbGFzcy5tYXQtY2FsZW5kYXItYm9keS1jb21wYXJpc29uLWlkZW50aWNhbF09XCJfaXNDb21wYXJpc29uSWRlbnRpY2FsKGl0ZW0uY29tcGFyZVZhbHVlKVwiXG4gICAgICAgICAgW2NsYXNzLm1hdC1jYWxlbmRhci1ib2R5LXRvZGF5XT1cInRvZGF5VmFsdWUgPT09IGl0ZW0uY29tcGFyZVZhbHVlXCI+XG4gICAgICAgICAge3tpdGVtLmRpc3BsYXlWYWx1ZX19XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWF0LWNhbGVuZGFyLWJvZHktY2VsbC1wcmV2aWV3XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9kaXY+XG4gICAgPC9idXR0b24+XG4gIDwvdGQ+XG48L3RyPlxuIl19
