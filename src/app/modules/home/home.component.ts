import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FieldsForm, PRODUCTOS } from './fields.form';
import { HttpClient } from '@angular/common/http';
import {
  Subject,
  debounceTime,
  firstValueFrom,
  map,
  distinctUntilChanged,
  takeUntil,
  Observable,
  startWith,
} from 'rxjs';
import { FormControl } from '@angular/forms';

export interface ProductoResponse {
  id: number;
  clase: {
    code: number;
    forHumans: string;
  };
  codigo: string;
  descripcion: string;
  precioSugerido: number;
  nombreCompleto: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
