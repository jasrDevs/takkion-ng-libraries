import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TakFormFieldModule } from '@takkion/ng-material/form-field';
import { TakSelectModule } from '@takkion/ng-material/select';
import { TakButtonModule } from '@takkion/ng-material/button';
import { TakNativeDateModule, TakOptionModule } from '@takkion/ng-material/core';
import { TakInputModule } from '@takkion/ng-material/input';
import { TakIconModule } from '@takkion/ng-material/icon';
import { TakDatepickerModule } from '@takkion/ng-material/datepicker';

import { TakSelectField } from './select-field/select-field.component';
import { TakDateField } from './date-field/date-field.component';

import { TakAutocompleteField } from './autocomplete-field/autocomplete-field.component';
import { TakAutocompleteModule } from '@takkion/ng-material/autocomplete';
import { TakErrorModule } from './error/error.module';
import { TakDateRangeField } from './date-range-field/date-range-field.component';
import { TakMoneyField } from './money-field/money-field.component';
import { TakGeneralField } from './general-field/general-field.component';
import { TakTextareaField } from './textarea-field/textarea-field.component';
import { TakProgressSpinnerModule } from '@takkion/ng-material/progress-spinner';
import { TakNumberField } from './number-field/number-field.component';

const components = [
  TakSelectField,
  TakDateField,
  TakAutocompleteField,
  TakDateRangeField,
  TakGeneralField,
  TakMoneyField,
  TakTextareaField,
  TakNumberField,
];

@NgModule({
  declarations: components,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TakProgressSpinnerModule,
    TakFormFieldModule,
    TakButtonModule,
    TakDatepickerModule,
    TakAutocompleteModule,
    TakErrorModule,
    TakIconModule,
    TakInputModule,
    TakOptionModule,
    TakSelectModule,
  ],
  exports: [
    ReactiveFormsModule,
    TakAutocompleteModule,
    FormsModule,
    TakNativeDateModule,
    ...components,
  ],
})
export class TakFieldsModule {}
