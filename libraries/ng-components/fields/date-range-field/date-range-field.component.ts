import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TakFormFieldAppearance } from '@takkion/ng-material/form-field';
import { ThemePalette } from '@takkion/ng-material/core';
import { TakAutocompleteFieldType, TAK_DEFAULT_APPEARANCE_FORM } from '../fields.common';

@Component({
  selector: 'tak-date-range-field',
  templateUrl: './date-range-field.component.html',
})
export class TakDateRangeFieldComponent implements OnInit {
  @Input() autocomplete: TakAutocompleteFieldType = 'off';
  @Input() startPlaceholder: string = 'Inicio';
  @Input() endPlaceholder: string = 'Fin';

  @Input() appearance: TakFormFieldAppearance = TAK_DEFAULT_APPEARANCE_FORM;
  @Input() color: ThemePalette = 'primary';

  @Input() start!: FormControl;
  @Input() end!: FormControl;
  @Input() notInput = false;

  @Input() disabled = false;

  private _required = false;

  public ngOnInit(): void {
    const start: any = this.start;
    const end: any = this.end;
    if (start?._rawValidators) {
      start._rawValidators.map((r: any) => {
        if (r.name.includes('required')) this._required = true;
      });
    }
    if (end?._rawValidators) {
      end._rawValidators.map((r: any) => {
        if (r.name.includes('required')) this._required = true;
      });
    }
    if (this.disabled) {
      this.start.disable();
      this.end.disable();
    }
  }

  get required() {
    return this._required;
  }

  get isDisabled() {
    return this.start.disabled || this.end.disabled;
  }
}
