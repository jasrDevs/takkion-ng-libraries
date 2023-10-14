import { Injectable } from '@angular/core';
import { TakDialog, TakDialogConfig } from '@takkion/ng-material/dialog';
import { Observable } from 'rxjs';
import { TakModalComponent } from './modal.component';
import { TakModalConfig, TakModalType } from './config';

@Injectable({ providedIn: 'root' })
export class TakModal {
  constructor(private dialog: TakDialog) {}

  public alert(content: string, title: string = '', options?: TakModalConfig) {
    return this._generateDialog(content, title, 'alert', options);
  }

  public confirm(content: string, title: string = '', options?: TakModalConfig) {
    return this._generateDialog(content, title, 'confirm', options);
  }

  private _generateDialog(
    content: string,
    title: string,
    type: TakModalType,
    options?: TakModalConfig
  ) {
    if (options) options.dialogOptions!.data = { content, title, options, type };

    const dialog = this.dialog.open(
      TakModalComponent,
      options?.dialogOptions ? options.dialogOptions : { data: { content, title, options, type } }
    );
    return dialog.afterClosed();
  }
}
