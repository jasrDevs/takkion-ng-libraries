/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import {
  DOWN_ARROW,
  ESCAPE,
  hasModifierKey,
  LEFT_ARROW,
  RIGHT_ARROW,
  TAB,
  UP_ARROW,
} from '@takkion/ng-cdk/keycodes';
import { takeUntil } from 'rxjs/operators';
import { CdkMenuGroup } from './menu-group';
import { CDK_MENU } from './menu-interface';
import { MENU_STACK, MenuStack } from './menu-stack';
import { CdkMenuBase } from './menu-base';
import * as i0 from '@angular/core';
/**
 * Directive applied to an element which configures it as a MenuBar by setting the appropriate
 * role, aria attributes, and accessible keyboard and mouse handling logic. The component that
 * this directive is applied to should contain components marked with CdkMenuItem.
 *
 */
export class CdkMenuBar extends CdkMenuBase {
  constructor() {
    super(...arguments);
    /** The direction items in the menu flow. */
    this.orientation = 'horizontal';
    /** Whether the menu is displayed inline (i.e. always present vs a conditional popup that the user triggers with a trigger element). */
    this.isInline = true;
  }
  ngAfterContentInit() {
    super.ngAfterContentInit();
    this._subscribeToMenuStackEmptied();
  }
  /**
   * Handle keyboard events for the Menu.
   * @param event The keyboard event to be handled.
   */
  _handleKeyEvent(event) {
    const keyManager = this.keyManager;
    switch (event.keyCode) {
      case UP_ARROW:
      case DOWN_ARROW:
      case LEFT_ARROW:
      case RIGHT_ARROW:
        if (!hasModifierKey(event)) {
          const horizontalArrows = event.keyCode === LEFT_ARROW || event.keyCode === RIGHT_ARROW;
          // For a horizontal menu if the left/right keys were clicked, or a vertical menu if the
          // up/down keys were clicked: if the current menu is open, close it then focus and open the
          // next  menu.
          if (horizontalArrows) {
            event.preventDefault();
            const prevIsOpen = keyManager.activeItem?.isMenuOpen();
            keyManager.activeItem?.getMenuTrigger()?.close();
            keyManager.setFocusOrigin('keyboard');
            keyManager.onKeydown(event);
            if (prevIsOpen) {
              keyManager.activeItem?.getMenuTrigger()?.open();
            }
          }
        }
        break;
      case ESCAPE:
        if (!hasModifierKey(event)) {
          event.preventDefault();
          keyManager.activeItem?.getMenuTrigger()?.close();
        }
        break;
      case TAB:
        if (!hasModifierKey(event, 'altKey', 'metaKey', 'ctrlKey')) {
          keyManager.activeItem?.getMenuTrigger()?.close();
        }
        break;
      default:
        keyManager.onKeydown(event);
    }
  }
  /**
   * Set focus to either the current, previous or next item based on the FocusNext event, then
   * open the previous or next item.
   * @param focusNext The element to focus.
   */
  _toggleOpenMenu(focusNext) {
    const keyManager = this.keyManager;
    switch (focusNext) {
      case 0 /* FocusNext.nextItem */:
        keyManager.setFocusOrigin('keyboard');
        keyManager.setNextItemActive();
        keyManager.activeItem?.getMenuTrigger()?.open();
        break;
      case 1 /* FocusNext.previousItem */:
        keyManager.setFocusOrigin('keyboard');
        keyManager.setPreviousItemActive();
        keyManager.activeItem?.getMenuTrigger()?.open();
        break;
      case 2 /* FocusNext.currentItem */:
        if (keyManager.activeItem) {
          keyManager.setFocusOrigin('keyboard');
          keyManager.setActiveItem(keyManager.activeItem);
        }
        break;
    }
  }
  /** Subscribe to the MenuStack emptied events. */
  _subscribeToMenuStackEmptied() {
    this.menuStack?.emptied
      .pipe(takeUntil(this.destroyed))
      .subscribe(event => this._toggleOpenMenu(event));
  }
}
CdkMenuBar.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuBar,
  deps: null,
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkMenuBar.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkMenuBar,
  selector: '[cdkMenuBar]',
  host: {
    attributes: { role: 'menubar' },
    listeners: { keydown: '_handleKeyEvent($event)' },
    classAttribute: 'cdk-menu-bar',
  },
  providers: [
    { provide: CdkMenuGroup, useExisting: CdkMenuBar },
    { provide: CDK_MENU, useExisting: CdkMenuBar },
    { provide: MENU_STACK, useFactory: () => MenuStack.inline('horizontal') },
  ],
  exportAs: ['cdkMenuBar'],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuBar,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[cdkMenuBar]',
          exportAs: 'cdkMenuBar',
          host: {
            role: 'menubar',
            class: 'cdk-menu-bar',
            '(keydown)': '_handleKeyEvent($event)',
          },
          providers: [
            { provide: CdkMenuGroup, useExisting: CdkMenuBar },
            { provide: CDK_MENU, useExisting: CdkMenuBar },
            { provide: MENU_STACK, useFactory: () => MenuStack.inline('horizontal') },
          ],
        },
      ],
    },
  ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1iYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL21lbnUvbWVudS1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFtQixTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDMUQsT0FBTyxFQUNMLFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLFVBQVUsRUFDVixXQUFXLEVBQ1gsR0FBRyxFQUNILFFBQVEsR0FDVCxNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUMxQyxPQUFPLEVBQVksVUFBVSxFQUFFLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUM5RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDOztBQUV4Qzs7Ozs7R0FLRztBQWVILE1BQU0sT0FBTyxVQUFXLFNBQVEsV0FBVztJQWQzQzs7UUFlRSw0Q0FBNEM7UUFDMUIsZ0JBQVcsR0FBRyxZQUFZLENBQUM7UUFFN0MsdUlBQXVJO1FBQ3JILGFBQVEsR0FBRyxJQUFJLENBQUM7S0EyRm5DO0lBekZVLGtCQUFrQjtRQUN6QixLQUFLLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsZUFBZSxDQUFDLEtBQW9CO1FBQ2xDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDbkMsUUFBUSxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ3JCLEtBQUssUUFBUSxDQUFDO1lBQ2QsS0FBSyxVQUFVLENBQUM7WUFDaEIsS0FBSyxVQUFVLENB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QUFFLFVBQVUsRUFBQztRQUM1QyxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUM7S0FDeEU7MkZBRVUsVUFBVTtrQkFkdEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLElBQUksRUFBRTt3QkFDSixNQUFNLEVBQUUsU0FBUzt3QkFDakIsT0FBTyxFQUFFLGNBQWM7d0JBQ3ZCLFdBQVcsRUFBRSx5QkFBeUI7cUJBQ3ZDO29CQUNELFNBQVMsRUFBRTt3QkFDVCxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxZQUFZLEVBQUM7d0JBQ2hELEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLFlBQVksRUFBQzt3QkFDNUMsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFDO3FCQUN4RTtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FmdGVyQ29udGVudEluaXQsIERpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBET1dOX0FSUk9XLFxuICBFU0NBUEUsXG4gIGhhc01vZGlmaWVyS2V5LFxuICBMRUZUX0FSUk9XLFxuICBSSUdIVF9BUlJPVyxcbiAgVEFCLFxuICBVUF9BUlJPVyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0Nka01lbnVHcm91cH0gZnJvbSAnLi9tZW51LWdyb3VwJztcbmltcG9ydCB7Q0RLX01FTlV9IGZyb20gJy4vbWVudS1pbnRlcmZhY2UnO1xuaW1wb3J0IHtGb2N1c05leHQsIE1FTlVfU1RBQ0ssIE1lbnVTdGFja30gZnJvbSAnLi9tZW51LXN0YWNrJztcbmltcG9ydCB7Q2RrTWVudUJhc2V9IGZyb20gJy4vbWVudS1iYXNlJztcblxuLyoqXG4gKiBEaXJlY3RpdmUgYXBwbGllZCB0byBhbiBlbGVtZW50IHdoaWNoIGNvbmZpZ3VyZXMgaXQgYXMgYSBNZW51QmFyIGJ5IHNldHRpbmcgdGhlIGFwcHJvcHJpYXRlXG4gKiByb2xlLCBhcmlhIGF0dHJpYnV0ZXMsIGFuZCBhY2Nlc3NpYmxlIGtleWJvYXJkIGFuZCBtb3VzZSBoYW5kbGluZyBsb2dpYy4gVGhlIGNvbXBvbmVudCB0aGF0XG4gKiB0aGlzIGRpcmVjdGl2ZSBpcyBhcHBsaWVkIHRvIHNob3VsZCBjb250YWluIGNvbXBvbmVudHMgbWFya2VkIHdpdGggQ2RrTWVudUl0ZW0uXG4gKlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2RrTWVudUJhcl0nLFxuICBleHBvcnRBczogJ2Nka01lbnVCYXInLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnbWVudWJhcicsXG4gICAgJ2NsYXNzJzogJ2Nkay1tZW51LWJhcicsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5RXZlbnQoJGV2ZW50KScsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBDZGtNZW51R3JvdXAsIHVzZUV4aXN0aW5nOiBDZGtNZW51QmFyfSxcbiAgICB7cHJvdmlkZTogQ0RLX01FTlUsIHVzZUV4aXN0aW5nOiBDZGtNZW51QmFyfSxcbiAgICB7cHJvdmlkZTogTUVOVV9TVEFDSywgdXNlRmFjdG9yeTogKCkgPT4gTWVudVN0YWNrLmlubGluZSgnaG9yaXpvbnRhbCcpfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2RrTWVudUJhciBleHRlbmRzIENka01lbnVCYXNlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIC8qKiBUaGUgZGlyZWN0aW9uIGl0ZW1zIGluIHRoZSBtZW51IGZsb3cuICovXG4gIG92ZXJyaWRlIHJlYWRvbmx5IG9yaWVudGF0aW9uID0gJ2hvcml6b250YWwnO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIGRpc3BsYXllZCBpbmxpbmUgKGkuZS4gYWx3YXlzIHByZXNlbnQgdnMgYSBjb25kaXRpb25hbCBwb3B1cCB0aGF0IHRoZSB1c2VyIHRyaWdnZXJzIHdpdGggYSB0cmlnZ2VyIGVsZW1lbnQpLiAqL1xuICBvdmVycmlkZSByZWFkb25seSBpc0lubGluZSA9IHRydWU7XG5cbiAgb3ZlcnJpZGUgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHN1cGVyLm5nQWZ0ZXJDb250ZW50SW5pdCgpO1xuICAgIHRoaXMuX3N1YnNjcmliZVRvTWVudVN0YWNrRW1wdGllZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBrZXlib2FyZCBldmVudHMgZm9yIHRoZSBNZW51LlxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGtleWJvYXJkIGV2ZW50IHRvIGJlIGhhbmRsZWQuXG4gICAqL1xuICBfaGFuZGxlS2V5RXZlbnQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBrZXlNYW5hZ2VyID0gdGhpcy5rZXlNYW5hZ2VyO1xuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBVUF9BUlJPVzpcbiAgICAgIGNhc2UgRE9XTl9BUlJPVzpcbiAgICAgIGNhc2UgTEVGVF9BUlJPVzpcbiAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICAgIGlmICghaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgICAgY29uc3QgaG9yaXpvbnRhbEFycm93cyA9IGV2ZW50LmtleUNvZGUgPT09IExFRlRfQVJST1cgfHwgZXZlbnQua2V5Q29kZSA9PT0gUklHSFRfQVJST1c7XG4gICAgICAgICAgLy8gRm9yIGEgaG9yaXpvbnRhbCBtZW51IGlmIHRoZSBsZWZ0L3JpZ2h0IGtleXMgd2VyZSBjbGlja2VkLCBvciBhIHZlcnRpY2FsIG1lbnUgaWYgdGhlXG4gICAgICAgICAgLy8gdXAvZG93biBrZXlzIHdlcmUgY2xpY2tlZDogaWYgdGhlIGN1cnJlbnQgbWVudSBpcyBvcGVuLCBjbG9zZSBpdCB0aGVuIGZvY3VzIGFuZCBvcGVuIHRoZVxuICAgICAgICAgIC8vIG5leHQgIG1lbnUuXG4gICAgICAgICAgaWYgKGhvcml6b250YWxBcnJvd3MpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHByZXZJc09wZW4gPSBrZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0/LmlzTWVudU9wZW4oKTtcbiAgICAgICAgICAgIGtleU1hbmFnZXIuYWN0aXZlSXRlbT8uZ2V0TWVudVRyaWdnZXIoKT8uY2xvc2UoKTtcblxuICAgICAgICAgICAga2V5TWFuYWdlci5zZXRGb2N1c09yaWdpbigna2V5Ym9hcmQnKTtcbiAgICAgICAgICAgIGtleU1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICAgICAgICAgIGlmIChwcmV2SXNPcGVuKSB7XG4gICAgICAgICAgICAgIGtleU1hbmFnZXIuYWN0aXZlSXRlbT8uZ2V0TWVudVRyaWdnZXIoKT8ub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBFU0NBUEU6XG4gICAgICAgIGlmICghaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBrZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0/LmdldE1lbnVUcmlnZ2VyKCk/LmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgVEFCOlxuICAgICAgICBpZiAoIWhhc01vZGlmaWVyS2V5KGV2ZW50LCAnYWx0S2V5JywgJ21ldGFLZXknLCAnY3RybEtleScpKSB7XG4gICAgICAgICAga2V5TWFuYWdlci5hY3RpdmVJdGVtPy5nZXRNZW51VHJpZ2dlcigpPy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBrZXlNYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCBmb2N1cyB0byBlaXRoZXIgdGhlIGN1cnJlbnQsIHByZXZpb3VzIG9yIG5leHQgaXRlbSBiYXNlZCBvbiB0aGUgRm9jdXNOZXh0IGV2ZW50LCB0aGVuXG4gICAqIG9wZW4gdGhlIHByZXZpb3VzIG9yIG5leHQgaXRlbS5cbiAgICogQHBhcmFtIGZvY3VzTmV4dCBUaGUgZWxlbWVudCB0byBmb2N1cy5cbiAgICovXG4gIHByaXZhdGUgX3RvZ2dsZU9wZW5NZW51KGZvY3VzTmV4dDogRm9jdXNOZXh0IHwgdW5kZWZpbmVkKSB7XG4gICAgY29uc3Qga2V5TWFuYWdlciA9IHRoaXMua2V5TWFuYWdlcjtcbiAgICBzd2l0Y2ggKGZvY3VzTmV4dCkge1xuICAgICAgY2FzZSBGb2N1c05leHQubmV4dEl0ZW06XG4gICAgICAgIGtleU1hbmFnZXIuc2V0Rm9jdXNPcmlnaW4oJ2tleWJvYXJkJyk7XG4gICAgICAgIGtleU1hbmFnZXIuc2V0TmV4dEl0ZW1BY3RpdmUoKTtcbiAgICAgICAga2V5TWFuYWdlci5hY3RpdmVJdGVtPy5nZXRNZW51VHJpZ2dlcigpPy5vcGVuKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIEZvY3VzTmV4dC5wcmV2aW91c0l0ZW06XG4gICAgICAgIGtleU1hbmFnZXIuc2V0Rm9jdXNPcmlnaW4oJ2tleWJvYXJkJyk7XG4gICAgICAgIGtleU1hbmFnZXIuc2V0UHJldmlvdXNJdGVtQWN0aXZlKCk7XG4gICAgICAgIGtleU1hbmFnZXIuYWN0aXZlSXRlbT8uZ2V0TWVudVRyaWdnZXIoKT8ub3BlbigpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBGb2N1c05leHQuY3VycmVudEl0ZW06XG4gICAgICAgIGlmIChrZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICBrZXlNYW5hZ2VyLnNldEZvY3VzT3JpZ2luKCdrZXlib2FyZCcpO1xuICAgICAgICAgIGtleU1hbmFnZXIuc2V0QWN0aXZlSXRlbShrZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTdWJzY3JpYmUgdG8gdGhlIE1lbnVTdGFjayBlbXB0aWVkIGV2ZW50cy4gKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9NZW51U3RhY2tFbXB0aWVkKCkge1xuICAgIHRoaXMubWVudVN0YWNrPy5lbXB0aWVkXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZShldmVudCA9PiB0aGlzLl90b2dnbGVPcGVuTWVudShldmVudCkpO1xuICB9XG59XG4iXX0=
