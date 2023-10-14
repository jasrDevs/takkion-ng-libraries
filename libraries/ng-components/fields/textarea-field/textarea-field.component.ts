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
import { ControlValueAccessor, FormGroupDirective, FormControl, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TAK_DEFAULT_APPEARANCE_FORM } from '../fields.common';
import { FloatLabelType, TakFormFieldAppearance } from '@takkion/ng-material/form-field';
import { ThemePalette } from '@takkion/ng-material/core';

@Component({
  selector: 'tak-textarea-field',
  templateUrl: './textarea-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakTextareaField implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() autocomplete: 'off' | 'on' = 'off';

  @Input() appearance: TakFormFieldAppearance = TAK_DEFAULT_APPEARANCE_FORM;
  @Input() floatLabel: FloatLabelType = 'auto';
  @Input() color: ThemePalette = 'primary';
  @Input() actionIcon = 'search';

  @Input() defaultFilterStyle = true;
  @Input() hasActionButton = false;
  @Input() hasClearButton = false;
  @Input() countCaracters = false;
  @Input() isTextArea = false;
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
  private _decrypted = false;

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
    if (this.control.touched) this._onValidate();
  }

  public onFocusOut(): void {
    this.onTouchFn(true);
    this._onValidate();
  }

  private _onValidate(): void {
    if (this.control.invalid) this.isInvalid = true;
    else this.isInvalid = false;
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

  get decrypted() {
    return this._decrypted;
  }
}
