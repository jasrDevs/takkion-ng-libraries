import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tak-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakFooter {}
