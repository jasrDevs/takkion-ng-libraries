import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TakModal } from '@takkion/ng-components/modal';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(private _modal: TakModal) {}

  public toggleTheme(): void {
    document.getElementsByTagName('body')[0].classList.toggle('tak-dark-theme');

    if (document.body.classList.contains('tak-dark-theme')) {
      localStorage.setItem('tak-dark-theme', 'true');
    } else {
      localStorage.removeItem('tak-dark-theme');
    }
  }

  public onLogout(): void {
    this._modal
      .confirm(
        '¿Desea cerrar su sesión?',
        '¿Seguro?' /* , {
        dialogOptions: {
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%',
        },
      } */
      )
      .subscribe(result => {
        if (result) {
          localStorage.clear();
          location.reload();
        }
      });
  }
}
