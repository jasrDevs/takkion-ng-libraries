/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ENTER } from '@takkion/ng-cdk/keycodes';
import { NgModule } from '@angular/core';
import { ErrorStateMatcher, TakCommonModule } from '@takkion/ng-material/core';
import { TakChip, TakChipAvatar, TakChipRemove, TakChipTrailingIcon } from './chip';
import { TAK_CHIPS_DEFAULT_OPTIONS } from './chip-default-options';
import { TakChipInput } from './chip-input';
import { TakChipList } from './chip-list';
import * as i0 from '@angular/core';
const CHIP_DECLARATIONS = [
  TakChipList,
  TakChip,
  TakChipInput,
  TakChipRemove,
  TakChipAvatar,
  TakChipTrailingIcon,
];
export class TakChipsModule {}
TakChipsModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakChipsModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
TakChipsModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakChipsModule,
  declarations: [
    TakChipList,
    TakChip,
    TakChipInput,
    TakChipRemove,
    TakChipAvatar,
    TakChipTrailingIcon,
  ],
  imports: [TakCommonModule],
  exports: [TakChipList, TakChip, TakChipInput, TakChipRemove, TakChipAvatar, TakChipTrailingIcon],
});
TakChipsModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakChipsModule,
  providers: [
    ErrorStateMatcher,
    {
      provide: TAK_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER],
      },
    },
  ],
  imports: [TakCommonModule],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakChipsModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          imports: [TakCommonModule],
          exports: CHIP_DECLARATIONS,
          declarations: CHIP_DECLARATIONS,
          providers: [
            ErrorStateMatcher,
            {
              provide: TAK_CHIPS_DEFAULT_OPTIONS,
              useValue: {
                separatorKeyCodes: [ENTER],
              },
            },
          ],
        },
      ],
    },
  ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcHMtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoaXBzL2NoaXBzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDMUUsT0FBTyxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQ2xGLE9BQU8sRUFBQyx5QkFBeUIsRUFBeUIsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7O0FBRXhDLE1BQU0saUJBQWlCLEdBQUc7SUFDeEIsV0FBVztJQUNYLE9BQU87SUFDUCxZQUFZO0lBQ1osYUFBYTtJQUNiLGFBQWE7SUFDYixtQkFBbUI7Q0FDcEIsQ0FBQztBQWdCRixNQUFNLE9BQU8sY0FBYzs7MkdBQWQsY0FBYzs0R0FBZCxjQUFjLGlCQXRCekIsV0FBVztRQUNYLE9BQU87UUFDUCxZQUFZO1FBQ1osYUFBYTtRQUNiLGFBQWE7UUFDYixtQkFBbUIsYUFJVCxlQUFlLGFBVHpCLFdBQVc7UUFDWCxPQUFPO1FBQ1AsWUFBWTtRQUNaLGFBQWE7UUFDYixhQUFhO1FBQ2IsbUJBQW1COzRHQWlCUixjQUFjLGFBVmQ7UUFDVCxpQkFBaUI7UUFDakI7WUFDRSxPQUFPLEVBQUUseUJBQXlCO1lBQ2xDLFFBQVEsRUFBRTtnQkFDUixpQkFBaUIsRUFBRSxDQUFDLEtBQUssQ0FBQzthQUNEO1NBQzVCO0tBQ0YsWUFYUyxlQUFlOzJGQWFkLGNBQWM7a0JBZDFCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO29CQUMxQixPQUFPLEVBQUUsaUJBQWlCO29CQUMxQixZQUFZLEVBQUUsaUJBQWlCO29CQUMvQixTQUFTLEVBQUU7d0JBQ1QsaUJBQWlCO3dCQUNqQjs0QkFDRSxPQUFPLEVBQUUseUJBQXlCOzRCQUNsQyxRQUFRLEVBQUU7Z0NBQ1IsaUJBQWlCLEVBQUUsQ0FBQyxLQUFLLENBQUM7NkJBQ0Q7eUJBQzVCO3FCQUNGO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RU5URVJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RXJyb3JTdGF0ZU1hdGNoZXIsIE1hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdENoaXAsIE1hdENoaXBBdmF0YXIsIE1hdENoaXBSZW1vdmUsIE1hdENoaXBUcmFpbGluZ0ljb259IGZyb20gJy4vY2hpcCc7XG5pbXBvcnQge01BVF9DSElQU19ERUZBVUxUX09QVElPTlMsIE1hdENoaXBzRGVmYXVsdE9wdGlvbnN9IGZyb20gJy4vY2hpcC1kZWZhdWx0LW9wdGlvbnMnO1xuaW1wb3J0IHtNYXRDaGlwSW5wdXR9IGZyb20gJy4vY2hpcC1pbnB1dCc7XG5pbXBvcnQge01hdENoaXBMaXN0fSBmcm9tICcuL2NoaXAtbGlzdCc7XG5cbmNvbnN0IENISVBfREVDTEFSQVRJT05TID0gW1xuICBNYXRDaGlwTGlzdCxcbiAgTWF0Q2hpcCxcbiAgTWF0Q2hpcElucHV0LFxuICBNYXRDaGlwUmVtb3ZlLFxuICBNYXRDaGlwQXZhdGFyLFxuICBNYXRDaGlwVHJhaWxpbmdJY29uLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IENISVBfREVDTEFSQVRJT05TLFxuICBkZWNsYXJhdGlvbnM6IENISVBfREVDTEFSQVRJT05TLFxuICBwcm92aWRlcnM6IFtcbiAgICBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICB7XG4gICAgICBwcm92aWRlOiBNQVRfQ0hJUFNfREVGQVVMVF9PUFRJT05TLFxuICAgICAgdXNlVmFsdWU6IHtcbiAgICAgICAgc2VwYXJhdG9yS2V5Q29kZXM6IFtFTlRFUl0sXG4gICAgICB9IGFzIE1hdENoaXBzRGVmYXVsdE9wdGlvbnMsXG4gICAgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcHNNb2R1bGUge31cbiJdfQ==
