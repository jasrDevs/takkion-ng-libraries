import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TakSnav } from '../navigation-interfaces';

@Component({
  selector: 'tak-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakSidebar implements AfterViewInit {
  @ViewChild('checkbox') checkbox!: ElementRef;

  @Output() blockSidebar: EventEmitter<any> = new EventEmitter();
  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();

  @Input() appIcon!: string;
  @Input() appTitle!: string;
  @Input() mdWidth = 640;
  @Input() navigation: TakSnav = {
    items: [],
    typeSnavIcons: 'material-icon',
  };
  @Input() authorities: any[] = [];
  @Input() context: any;
  @Input() isToggleShow = false;
  @Input() isCompact: boolean = false;
  @Input() isMd: boolean = false;
  @Input() accordionInCollections = true;
  @Input() disableHiddenCollections = false;

  hideSidebar = new FormControl(true);

  public ngAfterViewInit(): void {
    if (this.isCompact) this.onBlockSidebar(true);
  }

  public onToggleSidebar(): void {
    this.toggleSidebar.emit(true);
  }

  public onBlockSidebar(checked?: boolean): void {
    const isChecked = checked || this.checkbox.nativeElement.checked;

    localStorage.setItem('tak-sidebar-is-compact', isChecked);
    this.blockSidebar.emit(isChecked);
  }
}
