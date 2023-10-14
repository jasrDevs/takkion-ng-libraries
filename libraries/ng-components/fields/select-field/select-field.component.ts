import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  Component,
  Optional,
  Input,
  Self,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroupDirective, NgControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TakFormFieldAppearance } from '@takkion/ng-material/form-field';
import { TakOptionSelectionChange, ThemePalette } from '@takkion/ng-material/core';
import { TakAutocompleteFieldType, TAK_DEFAULT_APPEARANCE_FORM } from '../fields.common';

@Component({
  selector: 'tak-select-field',
  templateUrl: './select-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakSelectField implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() autocomplete: TakAutocompleteFieldType = 'off';
  @Input() appearance: TakFormFieldAppearance = TAK_DEFAULT_APPEARANCE_FORM;
  @Input() color: ThemePalette = 'primary';
  @Input() suggestions: any[] = [];

  @Input() placeholder = '';
  @Input() option = 'option';

  @Input() hasDefaultValue = false;
  @Input() disabled = false;

  @Output() onSelect = new EventEmitter<any>();

  public onChangeFn = (_: any) => {};
  public onTouchFn = (_: any) => {};

  public isInvalid = false;
  public isSubmitted = false;
  private _unsubscribe$ = new Subject<void>();

  constructor(
    @Self() @Optional() private _control: NgControl,
    @Optional() private _formGroupDirective: FormGroupDirective,
    private _cd: ChangeDetectorRef
  ) {
    if (_control) this._control.valueAccessor = this;
    if (_formGroupDirective) {
      _formGroupDirective.ngSubmit.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
        this.isSubmitted = true;
        _cd.markForCheck();
      });
    }
  }

  public ngOnInit(): void {
    if (this.suggestions.length && this.hasDefaultValue) {
      this._control.control?.setValue(this.suggestions[0]);
    }
  }

  public writeValue(value: string): void {
    if (value === null) {
      this.isInvalid = false;
      this._cd.markForCheck();
    }
  }

  public registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  public onChange(event: any): void {
    this.onChangeFn(event.target.value);
    if (this.control.touched) this._onValidate();
  }

  public emit(el: TakOptionSelectionChange) {
    if (el.isUserInput) {
      this.onSelect.emit(el.source.value);
      this.isInvalid = false;
    }
  }

  public onFocusOut() {
    this._onValidate();
  }

  private _onValidate(): void {
    if (this.control.invalid) this.isInvalid = true;
    else this.isInvalid = false;
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  get control(): FormControl {
    return this._control?.control as FormControl;
  }

  get directive(): FormGroupDirective {
    return this._formGroupDirective as FormGroupDirective;
  }
}
