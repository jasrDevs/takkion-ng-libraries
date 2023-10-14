import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { TAK_BOX_FORM_CONFIG } from '@takkion/ng-components/box-form';
import { TAK_MODAL_CONFIG } from '@takkion/ng-components/modal';

TAK_BOX_FORM_CONFIG.setValue({
  submitButton: 'ENVIAR',
  resetButton: 'REINICIAR',
});

TAK_MODAL_CONFIG.setValue({
  confirmButton: 'SI',
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
