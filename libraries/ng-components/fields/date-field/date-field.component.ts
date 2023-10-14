import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
  Component,
  Optional,
  OnInit,
  Input,
  Self,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemePalette } from '@takkion/ng-material/core';
import { TakFormFieldAppearance } from '@takkion/ng-material/form-field';
import { ControlValueAccessor, FormControl, FormGroupDirective, NgControl } from '@angular/forms';
import { TAK_DEFAULT_APPEARANCE_FORM, TakAutocompleteFieldType } from '../fields.common';

@Component({
  selector: 'tak-date-field',
  templateUrl: './date-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakDateField implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
  private _unsubscribe$ = new Subject<void>();

  @Input() appearance: TakFormFieldAppearance = TAK_DEFAULT_APPEARANCE_FORM;
  @Input() autocomplete: TakAutocompleteFieldType = 'off';
  @Input() color: ThemePalette = 'primary';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() notInput = false;

  @Input() minDate!: Date | string;
  @Input() maxDate!: Date | string;

  public onChangeFn = (_: any) => {};
  public onTouchFn = (_: any) => {};

  public isSubmitted = false;
  public isInvalid = false;
  public required = false;
  public value = '';

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
    const form: any = this.control;
    if (form?._rawValidators) {
      form._rawValidators.map((r: any) => {
        if (r.name.includes('required')) {
          this.required = true;
        }
      });
    }
  }

  public ngAfterViewInit(): void {
    const isValidDate = Date.parse(this.control.value);
    if (isNaN(isValidDate)) this.control.setValue(null);
    else this.control.setValue(new Date(this.control.value));
  }

  public writeValue(value: string): void {
    if (value === null) this.isInvalid = false;
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  public onChange(event: any): void {
    this.value = event.target.value;
    this.onChangeFn(event.target.value);
    if (this.control.touched) this._onValidate();
  }

  public onFocusout(): void {
    this.onTouchFn(true);
    this._onValidate();
  }

  public onCloseDatePicker(): void {
    this.onTouchFn(true);
    this._onValidate();
  }

  private _onValidate(): void {
    const isValidDate = Date.parse(this.control.value);
    if (
      this.control.invalid ||
      ([undefined, null, ''].indexOf(this.control.value) < 0 &&
        this.control.valid &&
        isNaN(isValidDate))
    ) {
      this.isInvalid = true;
    } else {
      this.isInvalid = false;
    }
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
