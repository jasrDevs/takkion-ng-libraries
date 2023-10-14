import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { TakSidenav } from '@takkion/ng-material/sidenav';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MaterialComponent {
  @ViewChild('sidenav') sidenav!: TakSidenav;

  public close() {
    this.sidenav.close();
    document.body.classList.remove('tak-block-sidebar');
  }

  public open() {
    this.sidenav.open();
    document.body.classList.add('tak-block-sidebar');
  }

  public toggleTheme() {
    document.body.classList.toggle('tak-dark-theme');
  }
}
