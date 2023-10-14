import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  Optional,
  Input,
  Self,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, FormControl, NgControl } from '@angular/forms';
import { debounceTime, map, Observable, Subject, takeUntil } from 'rxjs';
import { TakFormFieldAppearance } from '@takkion/ng-material/form-field';
import { TakOptionSelectionChange, ThemePalette } from '@takkion/ng-material/core';
import {
  TakAutocompleteFieldType,
  TAK_DEFAULT_APPEARANCE_FORM,
  TAK_PRESS_ESC_KEY,
} from '../fields.common';

@Component({
  selector: 'tak-autocomplete-field',
  templateUrl: './autocomplete-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakAutocompleteField implements OnInit, OnDestroy, ControlValueAccessor {
  private _unsubscribe$ = new Subject<void>();

  @Input() option = 'option';
  @Input() extraInfo = '';
  @Input() autocomplete: TakAutocompleteFieldType = 'off';
  @Input() appearance: TakFormFieldAppearance = TAK_DEFAULT_APPEARANCE_FORM;
  @Input() color: ThemePalette = 'primary';
  @Input() hasClearButton = true;
  @Input() suggestions: any[] = [];
  @Input() disabled = false;
  @Input() maxLength!: number;

  @Input() isLoading = false;
  @Input() isRemoteSearch = false;
  @Input() debounceTimeForRemoteSearch = 500;

  @Output() onSelect = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<any>();

  public onChangeFn = (_: any) => {};
  public onTouchFn = (_: any) => {};

  public isSubmitted = false;
  public isInvalid = false;
  public required = false;
  public value = '';

  public filteredOptions!: Observable<any[]>;

  public notSuggestions = false;

  private _lastValue = '';

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
        if (r.name.includes('required')) this.required = true;
      });
    }

    this.filteredOptions = this.control.valueChanges.pipe(
      takeUntil(this._unsubscribe$),
      map(() => this._filter())
    );

    if (this.isRemoteSearch) {
      this.control.valueChanges
        .pipe(takeUntil(this._unsubscribe$), debounceTime(this.debounceTimeForRemoteSearch))
        .subscribe(() => {
          if (this._lastValue !== this.value && this.value && !this.control.value) {
            this.onSearch.emit(this.value);
            this._setValue(this.value);
          }

          this._lastValue = this.value;
        });
    }
  }

  private _filter(): any[] {
    if (this.value) {
      const value =
        typeof this.value === 'string'
          ? this.value.toLowerCase()
          : this.control.value[this.option].toLowerCase();
      const option = this.suggestions.filter(res => res[this.option].toLowerCase().includes(value));
      if (!option.length) this.notSuggestions = true;
      else this.notSuggestions = false;
      return option;
    } else {
      return [];
    }
  }

  public writeValue(value: string): void {
    if (value === null) this.isInvalid = false;
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
    if (event.target.value !== this.value) {
      this.value = event.target.value;

      if (!this.isRemoteSearch) this._setValue(this.value);

      this.onChangeFn(
        this.suggestions.filter(
          sug => sug[this.option].toLowerCase() === this.value.toLowerCase()
        )[0] || null
      );

      if (this.control.touched) {
        this._onValidate();
      }
    }
  }

  private _setValue(value: string) {
    if (!this.isRemoteSearch) {
      const suggestionsFiltered = value
        ? this.suggestions.filter(
            el =>
              el[this.option].toLocaleLowerCase().trim() ===
              (value as string).toLocaleLowerCase().trim()
          )
        : [];

      if (suggestionsFiltered.length) {
        document.body.dispatchEvent(TAK_PRESS_ESC_KEY);
      }

      try {
        this.control.setValue(suggestionsFiltered[0][this.option], {
          emitEvent: false,
        });
        this.onSelect.emit(suggestionsFiltered[0]);
      } catch (error) {}
    }
  }

  public emit(el: TakOptionSelectionChange) {
    if (el && el.isUserInput) this.isInvalid = false;
  }

  public emitWithClick(suggestionOption: any) {
    this.control.setValue(suggestionOption);
    this.value = suggestionOption[this.option];
    this.isInvalid = false;
  }

  public onFocusout(): void {
    this.onTouchFn(true);
    this._onValidate();
  }

  public onUpdateSuggestions(suggestions: any[]) {
    this.suggestions = suggestions;
    this._cd.markForCheck();

    this.onChangeFn(
      this.suggestions.filter(
        sug => sug[this.option].toLowerCase() === this.value.toLowerCase()
      )[0] || null
    );

    console.log(this.control.value);
  }

  private _onValidate(): void {
    if (this.control.invalid) this.isInvalid = true;
    else this.isInvalid = false;
  }
  /*
  public onUpdate(suggestion: any) {
    this.control.setValue(suggestion);
    this.value = suggestion[this.option];
    this._setValue(suggestion[this.option]);
    this._onValidate();
  } */

  public onFocus() {
    if (!this.value) {
      this.control.setValue('');
      this.value = '';
    }
  }

  public onClearControl(): void {
    this.control.setValue('', { emitEvent: false });
    this.value = '';
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
