import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  Optional,
  OnInit,
  Input,
  Self,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  FormControl,
  NgControl,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { TAK_DEFAULT_APPEARANCE_FORM } from '../fields.common';
import { FloatLabelType, TakFormFieldAppearance } from '@takkion/ng-material/form-field';
import { ThemePalette } from '@takkion/ng-material/core';

@Component({
  selector: 'tak-money-field',
  templateUrl: './money-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakMoneyField implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() autocomplete: 'off' | 'on' = 'off';

  @Input() appearance: TakFormFieldAppearance = TAK_DEFAULT_APPEARANCE_FORM;
  @Input() floatLabel: FloatLabelType = 'auto';
  @Input() color: ThemePalette = 'primary';
  @Input() actionIcon = 'search';

  @Input() defaultFilterStyle = true;
  @Input() hasActionButton = false;
  @Input() hasClearButton = true;
  @Input() countCaracters = false;
  @Input() disabled = false;
  @Input() placeholder = '';
  @Input() maxLength!: number;

  @Output() onExecuteAction = new EventEmitter();
  @Output() onKeyUp = new EventEmitter();

  public onChangeFn = (_: any) => {};
  public onTouchFn = (_: any) => {};

  public isSubmitted = false;
  public isInvalid = false;
  public required = false;
  public value = '';

  private _subscription!: Subscription;

  constructor(
    @Self() @Optional() private _control: NgControl,
    @Optional() private _formGroupDirective: FormGroupDirective,
    private _cd: ChangeDetectorRef
  ) {
    if (_control) this._control.valueAccessor = this;

    if (_formGroupDirective) {
      this._subscription = _formGroupDirective.ngSubmit.subscribe(() => {
        this.isSubmitted = true;
        _cd.markForCheck();
      });
    }
  }

  public ngOnInit(): void {
    const form: any = this.control;

    if (form?._rawValidators) {
      form._rawValidators.forEach((r: any) => {
        if (r.name.includes('required')) this.required = true;
      });
    }

    this.control.addValidators(Validators.pattern(/^[0-9.,-]+$/));

    if (['', null, undefined, '-'].indexOf(this.control.value) < 0) this._addCurrencyMask();
  }

  public writeValue(value: string): void {
    if (value === null) {
      this.isInvalid = false;
    }
    this.value = value;
    this.isSubmitted = false;
    this._cd.markForCheck();
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
    this._addCurrencyMask();
    if (this.control.touched) this._onValidate();
  }

  private _addCurrencyMask() {
    const valueFormatted = this.control.value
      .toString()
      .replace(/,/g, '')
      .replace(/ /g, '')
      .replace('$', '');

    if (['', null, undefined, '-'].indexOf(valueFormatted) < 0 && !isNaN(Number(valueFormatted))) {
      const value = '$ ' + Intl.NumberFormat('en-US').format(Number(valueFormatted));
      this.control.setValue(+valueFormatted);
      this.value = value;
    } else if (['-'].indexOf(valueFormatted) >= 0) this.control.setValue('-');
    else this.control.setValue(null);
  }

  public onFocusOut(): void {
    this.onTouchFn(true);
    //this._executeIfIsMoneyField();
    this._onValidate();
  }

  private _onValidate(): void {
    if (this.control.invalid) this.isInvalid = true;
    else this.isInvalid = false;
  }

  public onKeyDown(event: any) {
    const pattern = /[0-9.-]/i.test(event.key);
    const validKeyCodes = [8, 46, 37, 39, 9, 17, 16, 67, 86, 109, 189];
    return pattern || validKeyCodes.indexOf(event.keyCode) >= 0;
  }

  public onClearControl(): void {
    if (['', null, undefined].indexOf(this.control.value) >= 0) {
      this.control.setValue('', { emitEvent: false });
    } else {
      this.control.setValue('');
    }

    this.value = '';
  }

  public ngOnDestroy(): void {
    if (this._subscription) this._subscription.unsubscribe();
  }

  get control(): FormControl {
    return this._control.control as FormControl;
  }

  get directive(): FormGroupDirective {
    return this._formGroupDirective as FormGroupDirective;
  }
}
