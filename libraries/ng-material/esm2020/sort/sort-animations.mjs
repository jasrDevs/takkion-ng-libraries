/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  animate,
  state,
  style,
  transition,
  trigger,
  keyframes,
  query,
  animateChild,
} from '@angular/animations';
import { AnimationCurves, AnimationDurations } from '@takkion/ng-material/core';
const SORT_ANIMATION_TRANSITION =
  AnimationDurations.ENTERING + ' ' + AnimationCurves.STANDARD_CURVE;
/**
 * Animations used by TakSort.
 * @docs-private
 */
export const takSortAnimations = {
  /** Animation that moves the sort indicator. */
  indicator: trigger('indicator', [
    state('active-asc, asc', style({ transform: 'translateY(0px)' })),
    // 10px is the height of the sort indicator, minus the width of the pointers
    state('active-desc, desc', style({ transform: 'translateY(10px)' })),
    transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION)),
  ]),
  /** Animation that rotates the left pointer of the indicator based on the sorting direction. */
  leftPointer: trigger('leftPointer', [
    state('active-asc, asc', style({ transform: 'rotate(-45deg)' })),
    state('active-desc, desc', style({ transform: 'rotate(45deg)' })),
    transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION)),
  ]),
  /** Animation that rotates the right pointer of the indicator based on the sorting direction. */
  rightPointer: trigger('rightPointer', [
    state('active-asc, asc', style({ transform: 'rotate(45deg)' })),
    state('active-desc, desc', style({ transform: 'rotate(-45deg)' })),
    transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION)),
  ]),
  /** Animation that controls the arrow opacity. */
  arrowOpacity: trigger('arrowOpacity', [
    state('desc-to-active, asc-to-active, active', style({ opacity: 1 })),
    state('desc-to-hint, asc-to-hint, hint', style({ opacity: 0.54 })),
    state(
      'hint-to-desc, active-to-desc, desc, hint-to-asc, active-to-asc, asc, void',
      style({ opacity: 0 })
    ),
    // Transition between all states except for immediate transitions
    transition('* => asc, * => desc, * => active, * => hint, * => void', animate('0ms')),
    transition('* <=> *', animate(SORT_ANIMATION_TRANSITION)),
  ]),
  /**
   * Animation for the translation of the arrow as a whole. States are separated into two
   * groups: ones with animations and others that are immediate. Immediate states are asc, desc,
   * peek, and active. The other states define a specific animation (source-to-destination)
   * and are determined as a function of their prev user-perceived state and what the next state
   * should be.
   */
  arrowPosition: trigger('arrowPosition', [
    // Hidden Above => Hint Center
    transition(
      '* => desc-to-hint, * => desc-to-active',
      animate(
        SORT_ANIMATION_TRANSITION,
        keyframes([style({ transform: 'translateY(-25%)' }), style({ transform: 'translateY(0)' })])
      )
    ),
    // Hint Center => Hidden Below
    transition(
      '* => hint-to-desc, * => active-to-desc',
      animate(
        SORT_ANIMATION_TRANSITION,
        keyframes([style({ transform: 'translateY(0)' }), style({ transform: 'translateY(25%)' })])
      )
    ),
    // Hidden Below => Hint Center
    transition(
      '* => asc-to-hint, * => asc-to-active',
      animate(
        SORT_ANIMATION_TRANSITION,
        keyframes([style({ transform: 'translateY(25%)' }), style({ transform: 'translateY(0)' })])
      )
    ),
    // Hint Center => Hidden Above
    transition(
      '* => hint-to-asc, * => active-to-asc',
      animate(
        SORT_ANIMATION_TRANSITION,
        keyframes([style({ transform: 'translateY(0)' }), style({ transform: 'translateY(-25%)' })])
      )
    ),
    state(
      'desc-to-hint, asc-to-hint, hint, desc-to-active, asc-to-active, active',
      style({ transform: 'translateY(0)' })
    ),
    state('hint-to-desc, active-to-desc, desc', style({ transform: 'translateY(-25%)' })),
    state('hint-to-asc, active-to-asc, asc', style({ transform: 'translateY(25%)' })),
  ]),
  /** Necessary trigger that calls animate on children animations. */
  allowChildren: trigger('allowChildren', [
    transition('* <=> *', [query('@*', animateChild(), { optional: true })]),
  ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NvcnQvc29ydC1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxFQUNQLFNBQVMsRUFFVCxLQUFLLEVBQ0wsWUFBWSxHQUNiLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFDLGVBQWUsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRTNFLE1BQU0seUJBQXlCLEdBQzdCLGtCQUFrQixDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsZUFBZSxDQUFDLGNBQWMsQ0FBQztBQUVyRTs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FPMUI7SUFDRiwrQ0FBK0M7SUFDL0MsU0FBUyxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUU7UUFDOUIsS0FBSyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxDQUFDLENBQUM7UUFDL0QsNEVBQTRFO1FBQzVFLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDO1FBQ2xFLFVBQVUsQ0FBQyw0QkFBNEIsRUFBRSxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztLQUM3RSxDQUFDO0lBRUYsK0ZBQStGO0lBQy9GLFdBQVcsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFO1FBQ2xDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO1FBQzlELEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFT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bkUsYUFBYSxFQUFFLE9BQU8sQ0FBQyxlQUFlLEVBQUU7UUFDdEMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3ZFLENBQUM7Q0FDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1xuICBhbmltYXRlLFxuICBzdGF0ZSxcbiAgc3R5bGUsXG4gIHRyYW5zaXRpb24sXG4gIHRyaWdnZXIsXG4gIGtleWZyYW1lcyxcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxuICBxdWVyeSxcbiAgYW5pbWF0ZUNoaWxkLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7QW5pbWF0aW9uQ3VydmVzLCBBbmltYXRpb25EdXJhdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuXG5jb25zdCBTT1JUX0FOSU1BVElPTl9UUkFOU0lUSU9OID1cbiAgQW5pbWF0aW9uRHVyYXRpb25zLkVOVEVSSU5HICsgJyAnICsgQW5pbWF0aW9uQ3VydmVzLlNUQU5EQVJEX0NVUlZFO1xuXG4vKipcbiAqIEFuaW1hdGlvbnMgdXNlZCBieSBNYXRTb3J0LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgbWF0U29ydEFuaW1hdGlvbnM6IHtcbiAgcmVhZG9ubHkgaW5kaWNhdG9yOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG4gIHJlYWRvbmx5IGxlZnRQb2ludGVyOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG4gIHJlYWRvbmx5IHJpZ2h0UG9pbnRlcjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xuICByZWFkb25seSBhcnJvd09wYWNpdHk6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbiAgcmVhZG9ubHkgYXJyb3dQb3NpdGlvbjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xuICByZWFkb25seSBhbGxvd0NoaWxkcmVuOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG59ID0ge1xuICAvKiogQW5pbWF0aW9uIHRoYXQgbW92ZXMgdGhlIHNvcnQgaW5kaWNhdG9yLiAqL1xuICBpbmRpY2F0b3I6IHRyaWdnZXIoJ2luZGljYXRvcicsIFtcbiAgICBzdGF0ZSgnYWN0aXZlLWFzYywgYXNjJywgc3R5bGUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMHB4KSd9KSksXG4gICAgLy8gMTBweCBpcyB0aGUgaGVpZ2h0IG9mIHRoZSBzb3J0IGluZGljYXRvciwgbWludXMgdGhlIHdpZHRoIG9mIHRoZSBwb2ludGVyc1xuICAgIHN0YXRlKCdhY3RpdmUtZGVzYywgZGVzYycsIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDEwcHgpJ30pKSxcbiAgICB0cmFuc2l0aW9uKCdhY3RpdmUtYXNjIDw9PiBhY3RpdmUtZGVzYycsIGFuaW1hdGUoU09SVF9BTklNQVRJT05fVFJBTlNJVElPTikpLFxuICBdKSxcblxuICAvKiogQW5pbWF0aW9uIHRoYXQgcm90YXRlcyB0aGUgbGVmdCBwb2ludGVyIG9mIHRoZSBpbmRpY2F0b3IgYmFzZWQgb24gdGhlIHNvcnRpbmcgZGlyZWN0aW9uLiAqL1xuICBsZWZ0UG9pbnRlcjogdHJpZ2dlcignbGVmdFBvaW50ZXInLCBbXG4gICAgc3RhdGUoJ2FjdGl2ZS1hc2MsIGFzYycsIHN0eWxlKHt0cmFuc2Zvcm06ICdyb3RhdGUoLTQ1ZGVnKSd9KSksXG4gICAgc3RhdGUoJ2FjdGl2ZS1kZXNjLCBkZXNjJywgc3R5bGUoe3RyYW5zZm9ybTogJ3JvdGF0ZSg0NWRlZyknfSkpLFxuICAgIHRyYW5zaXRpb24oJ2FjdGl2ZS1hc2MgPD0+IGFjdGl2ZS1kZXNjJywgYW5pbWF0ZShTT1JUX0FOSU1BVElPTl9UUkFOU0lUSU9OKSksXG4gIF0pLFxuXG4gIC8qKiBBbmltYXRpb24gdGhhdCByb3RhdGVzIHRoZSByaWdodCBwb2ludGVyIG9mIHRoZSBpbmRpY2F0b3IgYmFzZWQgb24gdGhlIHNvcnRpbmcgZGlyZWN0aW9uLiAqL1xuICByaWdodFBvaW50ZXI6IHRyaWdnZXIoJ3JpZ2h0UG9pbnRlcicsIFtcbiAgICBzdGF0ZSgnYWN0aXZlLWFzYywgYXNjJywgc3R5bGUoe3RyYW5zZm9ybTogJ3JvdGF0ZSg0NWRlZyknfSkpLFxuICAgIHN0YXRlKCdhY3RpdmUtZGVzYywgZGVzYycsIHN0eWxlKHt0cmFuc2Zvcm06ICdyb3RhdGUoLTQ1ZGVnKSd9KSksXG4gICAgdHJhbnNpdGlvbignYWN0aXZlLWFzYyA8PT4gYWN0aXZlLWRlc2MnLCBhbmltYXRlKFNPUlRfQU5JTUFUSU9OX1RSQU5TSVRJT04pKSxcbiAgXSksXG5cbiAgLyoqIEFuaW1hdGlvbiB0aGF0IGNvbnRyb2xzIHRoZSBhcnJvdyBvcGFjaXR5LiAqL1xuICBhcnJvd09wYWNpdHk6IHRyaWdnZXIoJ2Fycm93T3BhY2l0eScsIFtcbiAgICBzdGF0ZSgnZGVzYy10by1hY3RpdmUsIGFzYy10by1hY3RpdmUsIGFjdGl2ZScsIHN0eWxlKHtvcGFjaXR5OiAxfSkpLFxuICAgIHN0YXRlKCdkZXNjLXRvLWhpbnQsIGFzYy10by1oaW50LCBoaW50Jywgc3R5bGUoe29wYWNpdHk6IDAuNTR9KSksXG4gICAgc3RhdGUoXG4gICAgICAnaGludC10by1kZXNjLCBhY3RpdmUtdG8tZGVzYywgZGVzYywgaGludC10by1hc2MsIGFjdGl2ZS10by1hc2MsIGFzYywgdm9pZCcsXG4gICAgICBzdHlsZSh7b3BhY2l0eTogMH0pLFxuICAgICksXG4gICAgLy8gVHJhbnNpdGlvbiBiZXR3ZWVuIGFsbCBzdGF0ZXMgZXhjZXB0IGZvciBpbW1lZGlhdGUgdHJhbnNpdGlvbnNcbiAgICB0cmFuc2l0aW9uKCcqID0+IGFzYywgKiA9PiBkZXNjLCAqID0+IGFjdGl2ZSwgKiA9PiBoaW50LCAqID0+IHZvaWQnLCBhbmltYXRlKCcwbXMnKSksXG4gICAgdHJhbnNpdGlvbignKiA8PT4gKicsIGFuaW1hdGUoU09SVF9BTklNQVRJT05fVFJBTlNJVElPTikpLFxuICBdKSxcblxuICAvKipcbiAgICogQW5pbWF0aW9uIGZvciB0aGUgdHJhbnNsYXRpb24gb2YgdGhlIGFycm93IGFzIGEgd2hvbGUuIFN0YXRlcyBhcmUgc2VwYXJhdGVkIGludG8gdHdvXG4gICAqIGdyb3Vwczogb25lcyB3aXRoIGFuaW1hdGlvbnMgYW5kIG90aGVycyB0aGF0IGFyZSBpbW1lZGlhdGUuIEltbWVkaWF0ZSBzdGF0ZXMgYXJlIGFzYywgZGVzYyxcbiAgICogcGVlaywgYW5kIGFjdGl2ZS4gVGhlIG90aGVyIHN0YXRlcyBkZWZpbmUgYSBzcGVjaWZpYyBhbmltYXRpb24gKHNvdXJjZS10by1kZXN0aW5hdGlvbilcbiAgICogYW5kIGFyZSBkZXRlcm1pbmVkIGFzIGEgZnVuY3Rpb24gb2YgdGhlaXIgcHJldiB1c2VyLXBlcmNlaXZlZCBzdGF0ZSBhbmQgd2hhdCB0aGUgbmV4dCBzdGF0ZVxuICAgKiBzaG91bGQgYmUuXG4gICAqL1xuICBhcnJvd1Bvc2l0aW9uOiB0cmlnZ2VyKCdhcnJvd1Bvc2l0aW9uJywgW1xuICAgIC8vIEhpZGRlbiBBYm92ZSA9PiBIaW50IENlbnRlclxuICAgIHRyYW5zaXRpb24oXG4gICAgICAnKiA9PiBkZXNjLXRvLWhpbnQsICogPT4gZGVzYy10by1hY3RpdmUnLFxuICAgICAgYW5pbWF0ZShcbiAgICAgICAgU09SVF9BTklNQVRJT05fVFJBTlNJVElPTixcbiAgICAgICAga2V5ZnJhbWVzKFtzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtMjUlKSd9KSwgc3R5bGUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknfSldKSxcbiAgICAgICksXG4gICAgKSxcbiAgICAvLyBIaW50IENlbnRlciA9PiBIaWRkZW4gQmVsb3dcbiAgICB0cmFuc2l0aW9uKFxuICAgICAgJyogPT4gaGludC10by1kZXNjLCAqID0+IGFjdGl2ZS10by1kZXNjJyxcbiAgICAgIGFuaW1hdGUoXG4gICAgICAgIFNPUlRfQU5JTUFUSU9OX1RSQU5TSVRJT04sXG4gICAgICAgIGtleWZyYW1lcyhbc3R5bGUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknfSksIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDI1JSknfSldKSxcbiAgICAgICksXG4gICAgKSxcbiAgICAvLyBIaWRkZW4gQmVsb3cgPT4gSGludCBDZW50ZXJcbiAgICB0cmFuc2l0aW9uKFxuICAgICAgJyogPT4gYXNjLXRvLWhpbnQsICogPT4gYXNjLXRvLWFjdGl2ZScsXG4gICAgICBhbmltYXRlKFxuICAgICAgICBTT1JUX0FOSU1BVElPTl9UUkFOU0lUSU9OLFxuICAgICAgICBrZXlmcmFtZXMoW3N0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDI1JSknfSksIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ30pXSksXG4gICAgICApLFxuICAgICksXG4gICAgLy8gSGludCBDZW50ZXIgPT4gSGlkZGVuIEFib3ZlXG4gICAgdHJhbnNpdGlvbihcbiAgICAgICcqID0+IGhpbnQtdG8tYXNjLCAqID0+IGFjdGl2ZS10by1hc2MnLFxuICAgICAgYW5pbWF0ZShcbiAgICAgICAgU09SVF9BTklNQVRJT05fVFJBTlNJVElPTixcbiAgICAgICAga2V5ZnJhbWVzKFtzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKSd9KSwgc3R5bGUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTI1JSknfSldKSxcbiAgICAgICksXG4gICAgKSxcbiAgICBzdGF0ZShcbiAgICAgICdkZXNjLXRvLWhpbnQsIGFzYy10by1oaW50LCBoaW50LCBkZXNjLXRvLWFjdGl2ZSwgYXNjLXRvLWFjdGl2ZSwgYWN0aXZlJyxcbiAgICAgIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ30pLFxuICAgICksXG4gICAgc3RhdGUoJ2hpbnQtdG8tZGVzYywgYWN0aXZlLXRvLWRlc2MsIGRlc2MnLCBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtMjUlKSd9KSksXG4gICAgc3RhdGUoJ2hpbnQtdG8tYXNjLCBhY3RpdmUtdG8tYXNjLCBhc2MnLCBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlWSgyNSUpJ30pKSxcbiAgXSksXG5cbiAgLyoqIE5lY2Vzc2FyeSB0cmlnZ2VyIHRoYXQgY2FsbHMgYW5pbWF0ZSBvbiBjaGlsZHJlbiBhbmltYXRpb25zLiAqL1xuICBhbGxvd0NoaWxkcmVuOiB0cmlnZ2VyKCdhbGxvd0NoaWxkcmVuJywgW1xuICAgIHRyYW5zaXRpb24oJyogPD0+IConLCBbcXVlcnkoJ0AqJywgYW5pbWF0ZUNoaWxkKCksIHtvcHRpb25hbDogdHJ1ZX0pXSksXG4gIF0pLFxufTtcbiJdfQ==
