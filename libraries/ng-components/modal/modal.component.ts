import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { TakDialogRef, TAK_DIALOG_DATA } from '@takkion/ng-material/dialog';
import { TAK_MODAL_CONFIG, TakModalConfig, TakModalType } from './config';

@Component({
  selector: 'tak-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TakModalComponent implements OnInit {
  private _isAlert = false;

  private _confirmButton = '';
  private _deniedButton = '';
  private _okButton = '';
  private _hasTopCloseButton = true;

  constructor(
    private _href: ElementRef<HTMLElement>,
    private _dialogRef: TakDialogRef<TakModalComponent>,
    @Inject(TAK_DIALOG_DATA)
    public data: { content: string; title: string; options?: TakModalConfig; type: TakModalType }
  ) {
    _href.nativeElement.classList.add('tak-modal');
  }

  public ngOnInit(): void {
    if (this.data.type === 'alert') this._isAlert = true;
    else this._isAlert = false;

    const confirmButton = this.data.options?.confirmButton
      ? this.data.options.confirmButton
      : TAK_MODAL_CONFIG.value?.confirmButton || 'YES';

    const deniedButton = this.data.options?.deniedButton
      ? this.data.options.deniedButton
      : TAK_MODAL_CONFIG.value?.deniedButton || 'NO';

    const okButton = this.data.options?.okButton
      ? this.data.options.okButton
      : TAK_MODAL_CONFIG.value?.okButton || 'OK';

    const hasTopCloseButton = this.data.options?.hasTopCloseButton
      ? this.data.options.hasTopCloseButton
      : TAK_MODAL_CONFIG.value?.hasTopCloseButton || true;

    this._confirmButton = confirmButton;
    this._deniedButton = deniedButton;
    this._okButton = okButton;
    this._hasTopCloseButton = hasTopCloseButton;
  }

  public onConfirm(): void {
    this._dialogRef.close(true);
  }

  public onClose(): void {
    this._dialogRef.close(false);
  }

  get isAlert(): boolean {
    return this._isAlert;
  }

  get confirmButton(): string {
    return this._confirmButton;
  }

  get deniedButton(): string {
    return this._deniedButton;
  }

  get okButton(): string {
    return this._okButton;
  }

  get hasTopCloseButton(): boolean {
    return this._hasTopCloseButton;
  }
}
