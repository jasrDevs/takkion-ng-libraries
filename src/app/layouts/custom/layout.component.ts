import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { SIDE_NAV } from './navigation';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  public navigation = SIDE_NAV;

  public resourcesLoaded = false;

  public permissions = ['1', '2', '3'];

  public context = 'BOGOTA';

  public accordionInCollections = true;
  public disableHiddenCollections = false;

  constructor() {}

  public ngOnInit(): void {
    this.navigation.items
      .filter(el => el.type === 'collection')
      .map(item => {
        item.showCollectionContent = false;
        this.accordionInCollections = false;
      });
    //this.disableHiddenCollections = true;

    this.resourcesLoaded = true;

    this._setTheme();
  }

  public ngOnDestroy(): void {
    document.getElementsByTagName('body')[0].classList.remove('dark-theme');
  }

  private _setTheme(): void {
    if (localStorage.getItem('dark-theme') !== null) {
      document.getElementsByTagName('body')[0].classList.add('dark-theme');
    }
  }
}
