import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TAK_BOX_FORM_CONFIG } from './common';

@Component({
  selector: 'tak-box-form',
  templateUrl: './box-form.component.html',
  styleUrls: ['./box-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TakBoxForm {
  @ViewChild('content') content!: ElementRef;

  @Output() ngSubmit = new EventEmitter();
  @Output() ngReset = new EventEmitter();

  @Output() onBack = new EventEmitter();

  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() takTitle = '';
  @Input() takSubtitle = '';

  @Input() showActionButtons = true;
  @Input() hasResetButton = false;
  @Input() hasBackButton = false;
  @Input() hasBranding = true;
  @Input() isLoading = false;

  @Input() exedentInPx = 295;

  @Input() submitButton = '';
  @Input() resetButton = '';

  private _submitButton = '';
  private _resetButton = '';

  private _formGroupSubs!: Subscription;

  constructor(
    private _href: ElementRef<HTMLElement>,
    private _cd: ChangeDetectorRef
  ) {
    _href.nativeElement.classList.add('tak-box-form');
  }

  public ngOnInit(): void {
    this._formGroupSubs = this.formGroup.statusChanges.subscribe(() => {
      this._cd.markForCheck();
    });

    if (!this.showActionButtons) this.exedentInPx -= 58;

    this._submitButton = this.submitButton
      ? this.submitButton
      : TAK_BOX_FORM_CONFIG.value?.submitButton || 'Submit';
    this._resetButton = this.resetButton
      ? this.resetButton
      : TAK_BOX_FORM_CONFIG.value?.resetButton || 'Reset';
  }

  public clickOnReset() {
    if (this.formGroup) this.formGroup.reset();
    this.ngReset.emit();
  }

  public ngOnDestroy(): void {
    if (this._formGroupSubs) this._formGroupSubs.unsubscribe();
  }

  get orSubmitButton() {
    return this._submitButton;
  }

  get orResetButton() {
    return this._resetButton;
  }
}
