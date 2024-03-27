/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { dispatchFakeEvent } from './dispatch-events';
function triggerFocusChange(element, event) {
    let eventFired = false;
    const handler = () => (eventFired = true);
    element.addEventListener(event, handler);
    element[event]();
    element.removeEventListener(event, handler);
    if (!eventFired) {
        dispatchFakeEvent(element, event);
    }
}
/**
 * Patches an elements focus and blur methods to emit events consistently and predictably.
 * This is necessary, because some browsers can call the focus handlers asynchronously,
 * while others won't fire them at all if the browser window is not focused.
 * @docs-private
 */
// TODO: Check if this element focus patching is still needed for local testing,
// where browser is not necessarily focused.
export function patchElementFocus(element) {
    element.focus = () => dispatchFakeEvent(element, 'focus');
    element.blur = () => dispatchFakeEvent(element, 'blur');
}
/** @docs-private */
export function triggerFocus(element) {
    triggerFocusChange(element, 'focus');
}
/** @docs-private */
export function triggerBlur(element) {
    triggerFocusChange(element, 'blur');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudC1mb2N1cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvdGVzdGluZy90ZXN0YmVkL2Zha2UtZXZlbnRzL2VsZW1lbnQtZm9jdXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFcEQsU0FBUyxrQkFBa0IsQ0FBQyxPQUFvQixFQUFFLEtBQXVCO0lBQ3ZFLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztJQUN2QixNQUFNLE9BQU8sR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUMxQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO0lBQ2pCLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2hCLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNwQyxDQUFDO0FBQ0gsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsZ0ZBQWdGO0FBQ2hGLDRDQUE0QztBQUM1QyxNQUFNLFVBQVUsaUJBQWlCLENBQUMsT0FBb0I7SUFDcEQsT0FBTyxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUQsT0FBTyxDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUVELG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsWUFBWSxDQUFDLE9BQW9CO0lBQy9DLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSxXQUFXLENBQUMsT0FBb0I7SUFDOUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtkaXNwYXRjaEZha2VFdmVudH0gZnJvbSAnLi9kaXNwYXRjaC1ldmVudHMnO1xuXG5mdW5jdGlvbiB0cmlnZ2VyRm9jdXNDaGFuZ2UoZWxlbWVudDogSFRNTEVsZW1lbnQsIGV2ZW50OiAnZm9jdXMnIHwgJ2JsdXInKSB7XG4gIGxldCBldmVudEZpcmVkID0gZmFsc2U7XG4gIGNvbnN0IGhhbmRsZXIgPSAoKSA9PiAoZXZlbnRGaXJlZCA9IHRydWUpO1xuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xuICBlbGVtZW50W2V2ZW50XSgpO1xuICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xuICBpZiAoIWV2ZW50RmlyZWQpIHtcbiAgICBkaXNwYXRjaEZha2VFdmVudChlbGVtZW50LCBldmVudCk7XG4gIH1cbn1cblxuLyoqXG4gKiBQYXRjaGVzIGFuIGVsZW1lbnRzIGZvY3VzIGFuZCBibHVyIG1ldGhvZHMgdG8gZW1pdCBldmVudHMgY29uc2lzdGVudGx5IGFuZCBwcmVkaWN0YWJseS5cbiAqIFRoaXMgaXMgbmVjZXNzYXJ5LCBiZWNhdXNlIHNvbWUgYnJvd3NlcnMgY2FuIGNhbGwgdGhlIGZvY3VzIGhhbmRsZXJzIGFzeW5jaHJvbm91c2x5LFxuICogd2hpbGUgb3RoZXJzIHdvbid0IGZpcmUgdGhlbSBhdCBhbGwgaWYgdGhlIGJyb3dzZXIgd2luZG93IGlzIG5vdCBmb2N1c2VkLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG4vLyBUT0RPOiBDaGVjayBpZiB0aGlzIGVsZW1lbnQgZm9jdXMgcGF0Y2hpbmcgaXMgc3RpbGwgbmVlZGVkIGZvciBsb2NhbCB0ZXN0aW5nLFxuLy8gd2hlcmUgYnJvd3NlciBpcyBub3QgbmVjZXNzYXJpbHkgZm9jdXNlZC5cbmV4cG9ydCBmdW5jdGlvbiBwYXRjaEVsZW1lbnRGb2N1cyhlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICBlbGVtZW50LmZvY3VzID0gKCkgPT4gZGlzcGF0Y2hGYWtlRXZlbnQoZWxlbWVudCwgJ2ZvY3VzJyk7XG4gIGVsZW1lbnQuYmx1ciA9ICgpID0+IGRpc3BhdGNoRmFrZUV2ZW50KGVsZW1lbnQsICdibHVyJyk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gdHJpZ2dlckZvY3VzKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gIHRyaWdnZXJGb2N1c0NoYW5nZShlbGVtZW50LCAnZm9jdXMnKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmlnZ2VyQmx1cihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICB0cmlnZ2VyRm9jdXNDaGFuZ2UoZWxlbWVudCwgJ2JsdXInKTtcbn1cbiJdfQ==