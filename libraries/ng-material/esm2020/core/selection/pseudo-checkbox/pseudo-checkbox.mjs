/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Component,
  ViewEncapsulation,
  Input,
  ChangeDetectionStrategy,
  Inject,
  Optional,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from '@angular/core';
/**
 * Component that shows a simplified checkbox without including any kind of "real" checkbox.
 * Meant to be used when the checkbox is purely decorative and a large number of them will be
 * included, such as for the options in a multi-select. Uses no SVGs or complex animations.
 * Note that theming is meant to be handled by the parent element, e.g.
 * `tak-primary .tak-pseudo-checkbox`.
 *
 * Note that this component will be completely invisible to screen-reader users. This is *not*
 * interchangeable with `<tak-checkbox>` and should *not* be used if the user would directly
 * interact with the checkbox. The pseudo-checkbox should only be used as an implementation detail
 * of more complex components that appropriately handle selected / checked state.
 * @docs-private
 */
export class TakPseudoCheckbox {
  constructor(_animationMode) {
    this._animationMode = _animationMode;
    /** Display state of the checkbox. */
    this.state = 'unchecked';
    /** Whether the checkbox is disabled. */
    this.disabled = false;
  }
}
TakPseudoCheckbox.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakPseudoCheckbox,
  deps: [{ token: ANIMATION_MODULE_TYPE, optional: true }],
  target: i0.ɵɵFactoryTarget.Component,
});
TakPseudoCheckbox.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakPseudoCheckbox,
  selector: 'tak-pseudo-checkbox',
  inputs: { state: 'state', disabled: 'disabled' },
  host: {
    properties: {
      'class.tak-pseudo-checkbox-indeterminate': 'state === "indeterminate"',
      'class.tak-pseudo-checkbox-checked': 'state === "checked"',
      'class.tak-pseudo-checkbox-disabled': 'disabled',
      'class._tak-animation-noopable': '_animationMode === "NoopAnimations"',
    },
    classAttribute: 'tak-pseudo-checkbox',
  },
  ngImport: i0,
  template: '',
  isInline: true,
  styles: [
    '.tak-pseudo-checkbox{width:16px;height:16px;border:2px solid;border-radius:2px;cursor:pointer;display:inline-block;vertical-align:middle;box-sizing:border-box;position:relative;flex-shrink:0;transition:border-color 90ms cubic-bezier(0, 0, 0.2, 0.1),background-color 90ms cubic-bezier(0, 0, 0.2, 0.1)}.tak-pseudo-checkbox::after{position:absolute;opacity:0;content:"";border-bottom:2px solid currentColor;transition:opacity 90ms cubic-bezier(0, 0, 0.2, 0.1)}.tak-pseudo-checkbox.tak-pseudo-checkbox-checked,.tak-pseudo-checkbox.tak-pseudo-checkbox-indeterminate{border-color:rgba(0,0,0,0)}.tak-pseudo-checkbox._tak-animation-noopable{transition:none !important;animation:none !important}.tak-pseudo-checkbox._tak-animation-noopable::after{transition:none}.tak-pseudo-checkbox-disabled{cursor:default}.tak-pseudo-checkbox-indeterminate::after{top:5px;left:1px;width:10px;opacity:1;border-radius:2px}.tak-pseudo-checkbox-checked::after{top:2.4px;left:1px;width:8px;height:3px;border-left:2px solid currentColor;transform:rotate(-45deg);opacity:1;box-sizing:content-box}',
  ],
  changeDetection: i0.ChangeDetectionStrategy.OnPush,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakPseudoCheckbox,
  decorators: [
    {
      type: Component,
      args: [
        {
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          selector: 'tak-pseudo-checkbox',
          template: '',
          host: {
            class: 'tak-pseudo-checkbox',
            '[class.tak-pseudo-checkbox-indeterminate]': 'state === "indeterminate"',
            '[class.tak-pseudo-checkbox-checked]': 'state === "checked"',
            '[class.tak-pseudo-checkbox-disabled]': 'disabled',
            '[class._tak-animation-noopable]': '_animationMode === "NoopAnimations"',
          },
          styles: [
            '.tak-pseudo-checkbox{width:16px;height:16px;border:2px solid;border-radius:2px;cursor:pointer;display:inline-block;vertical-align:middle;box-sizing:border-box;position:relative;flex-shrink:0;transition:border-color 90ms cubic-bezier(0, 0, 0.2, 0.1),background-color 90ms cubic-bezier(0, 0, 0.2, 0.1)}.tak-pseudo-checkbox::after{position:absolute;opacity:0;content:"";border-bottom:2px solid currentColor;transition:opacity 90ms cubic-bezier(0, 0, 0.2, 0.1)}.tak-pseudo-checkbox.tak-pseudo-checkbox-checked,.tak-pseudo-checkbox.tak-pseudo-checkbox-indeterminate{border-color:rgba(0,0,0,0)}.tak-pseudo-checkbox._tak-animation-noopable{transition:none !important;animation:none !important}.tak-pseudo-checkbox._tak-animation-noopable::after{transition:none}.tak-pseudo-checkbox-disabled{cursor:default}.tak-pseudo-checkbox-indeterminate::after{top:5px;left:1px;width:10px;opacity:1;border-radius:2px}.tak-pseudo-checkbox-checked::after{top:2.4px;left:1px;width:8px;height:3px;border-left:2px solid currentColor;transform:rotate(-45deg);opacity:1;box-sizing:content-box}',
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      {
        type: undefined,
        decorators: [
          {
            type: Optional,
          },
          {
            type: Inject,
            args: [ANIMATION_MODULE_TYPE],
          },
        ],
      },
    ];
  },
  propDecorators: {
    state: [
      {
        type: Input,
      },
    ],
    disabled: [
      {
        type: Input,
      },
    ],
  },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHNldWRvLWNoZWNrYm94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvc2VsZWN0aW9uL3BzZXVkby1jaGVja2JveC9wc2V1ZG8tY2hlY2tib3gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsS0FBSyxFQUNMLHVCQUF1QixFQUN2QixNQUFNLEVBQ04sUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDOztBQVEzRTs7Ozs7Ozs7Ozs7O0dBWUc7QUFlSCxNQUFNLE9BQU8saUJBQWlCO0lBTzVCLFlBQThELGNBQXVCO1FBQXZCLG1CQUFjLEdBQWQsY0FBYyxDQUFTO1FBTnJGLHFDQUFxQztRQUM1QixVQUFLLEdBQTJCLFdBQVcsQ0FBQztRQUVyRCx3Q0FBd0M7UUFDL0IsYUFBUSxHQUFZLEtBQUssQ0FBQztJQUVxRCxDQUFDOzs4R0FQOUUsaUJBQWlCLGtCQU9JLHFCQUFxQjtrR0FQMUMsaUJBQWlCLGtiQVRsQixFQUFFOzJGQVNELGlCQUFpQjtrQkFkN0IsU0FBUztvQ0FDTyxpQkFBaUIsQ0FBQyxJQUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNLFlBQ3JDLHFCQUFxQixZQUVyQixFQUFFLFFBQ047d0JBQ0osT0FBTyxFQUFFLHFCQUFxQjt3QkFDOUIsMkNBQTJDLEVBQUUsMkJBQTJCO3dCQUN4RSxxQ0FBcUMsRUFBRSxxQkFBcUI7d0JBQzVELHNDQUFzQyxFQUFFLFVBQVU7d0JBQ2xELGlDQUFpQyxFQUFFLHFDQUFxQztxQkFDekU7OzBCQVNZLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzRDQUw1QyxLQUFLO3NCQUFiLEtBQUs7Z0JBR0csUUFBUTtzQkFBaEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbnB1dCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cbi8qKlxuICogUG9zc2libGUgc3RhdGVzIGZvciBhIHBzZXVkbyBjaGVja2JveC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IHR5cGUgTWF0UHNldWRvQ2hlY2tib3hTdGF0ZSA9ICd1bmNoZWNrZWQnIHwgJ2NoZWNrZWQnIHwgJ2luZGV0ZXJtaW5hdGUnO1xuXG4vKipcbiAqIENvbXBvbmVudCB0aGF0IHNob3dzIGEgc2ltcGxpZmllZCBjaGVja2JveCB3aXRob3V0IGluY2x1ZGluZyBhbnkga2luZCBvZiBcInJlYWxcIiBjaGVja2JveC5cbiAqIE1lYW50IHRvIGJlIHVzZWQgd2hlbiB0aGUgY2hlY2tib3ggaXMgcHVyZWx5IGRlY29yYXRpdmUgYW5kIGEgbGFyZ2UgbnVtYmVyIG9mIHRoZW0gd2lsbCBiZVxuICogaW5jbHVkZWQsIHN1Y2ggYXMgZm9yIHRoZSBvcHRpb25zIGluIGEgbXVsdGktc2VsZWN0LiBVc2VzIG5vIFNWR3Mgb3IgY29tcGxleCBhbmltYXRpb25zLlxuICogTm90ZSB0aGF0IHRoZW1pbmcgaXMgbWVhbnQgdG8gYmUgaGFuZGxlZCBieSB0aGUgcGFyZW50IGVsZW1lbnQsIGUuZy5cbiAqIGBtYXQtcHJpbWFyeSAubWF0LXBzZXVkby1jaGVja2JveGAuXG4gKlxuICogTm90ZSB0aGF0IHRoaXMgY29tcG9uZW50IHdpbGwgYmUgY29tcGxldGVseSBpbnZpc2libGUgdG8gc2NyZWVuLXJlYWRlciB1c2Vycy4gVGhpcyBpcyAqbm90KlxuICogaW50ZXJjaGFuZ2VhYmxlIHdpdGggYDxtYXQtY2hlY2tib3g+YCBhbmQgc2hvdWxkICpub3QqIGJlIHVzZWQgaWYgdGhlIHVzZXIgd291bGQgZGlyZWN0bHlcbiAqIGludGVyYWN0IHdpdGggdGhlIGNoZWNrYm94LiBUaGUgcHNldWRvLWNoZWNrYm94IHNob3VsZCBvbmx5IGJlIHVzZWQgYXMgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsXG4gKiBvZiBtb3JlIGNvbXBsZXggY29tcG9uZW50cyB0aGF0IGFwcHJvcHJpYXRlbHkgaGFuZGxlIHNlbGVjdGVkIC8gY2hlY2tlZCBzdGF0ZS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzZWxlY3RvcjogJ21hdC1wc2V1ZG8tY2hlY2tib3gnLFxuICBzdHlsZVVybHM6IFsncHNldWRvLWNoZWNrYm94LmNzcyddLFxuICB0ZW1wbGF0ZTogJycsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXBzZXVkby1jaGVja2JveCcsXG4gICAgJ1tjbGFzcy5tYXQtcHNldWRvLWNoZWNrYm94LWluZGV0ZXJtaW5hdGVdJzogJ3N0YXRlID09PSBcImluZGV0ZXJtaW5hdGVcIicsXG4gICAgJ1tjbGFzcy5tYXQtcHNldWRvLWNoZWNrYm94LWNoZWNrZWRdJzogJ3N0YXRlID09PSBcImNoZWNrZWRcIicsXG4gICAgJ1tjbGFzcy5tYXQtcHNldWRvLWNoZWNrYm94LWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFBzZXVkb0NoZWNrYm94IHtcbiAgLyoqIERpc3BsYXkgc3RhdGUgb2YgdGhlIGNoZWNrYm94LiAqL1xuICBASW5wdXQoKSBzdGF0ZTogTWF0UHNldWRvQ2hlY2tib3hTdGF0ZSA9ICd1bmNoZWNrZWQnO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGVja2JveCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7fVxufVxuIl19
