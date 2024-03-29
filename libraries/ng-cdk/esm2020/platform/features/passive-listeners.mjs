/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Cached result of whether the user's browser supports passive event listeners. */
let supportsPassiveEvents;
/**
 * Checks whether the user's browser supports passive event listeners.
 * See: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
export function supportsPassiveEventListeners() {
  if (supportsPassiveEvents == null && typeof window !== 'undefined') {
    try {
      window.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          get: () => (supportsPassiveEvents = true),
        })
      );
    } finally {
      supportsPassiveEvents = supportsPassiveEvents || false;
    }
  }
  return supportsPassiveEvents;
}
/**
 * Normalizes an `AddEventListener` object to something that can be passed
 * to `addEventListener` on any browser, no matter whether it supports the
 * `options` parameter.
 * @param options Object to be normalized.
 */
export function normalizePassiveListenerOptions(options) {
  return supportsPassiveEventListeners() ? options : !!options.capture;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc2l2ZS1saXN0ZW5lcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3BsYXRmb3JtL2ZlYXR1cmVzL3Bhc3NpdmUtbGlzdGVuZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILG9GQUFvRjtBQUNwRixJQUFJLHFCQUE4QixDQUFDO0FBRW5DOzs7R0FHRztBQUNILE1BQU0sVUFBVSw2QkFBNkI7SUFDM0MsSUFBSSxxQkFBcUIsSUFBSSxJQUFJLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxFQUFFO1FBQ2xFLElBQUk7WUFDRixNQUFNLENBQUMsZ0JBQWdCLENBQ3JCLE1BQU0sRUFDTixJQUFLLEVBQ0wsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFO2dCQUNuQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7YUFDMUMsQ0FBQyxDQUNILENBQUM7U0FDSDtnQkFBUztZQUNSLHFCQUFxQixHQUFHLHFCQUFxQixJQUFJLEtBQUssQ0FBQztTQUN4RDtLQUNGO0lBRUQsT0FBTyxxQkFBcUIsQ0FBQztBQUMvQixDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsK0JBQStCLENBQzdDLE9BQWdDO0lBRWhDLE9BQU8sNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUN2RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKiBDYWNoZWQgcmVzdWx0IG9mIHdoZXRoZXIgdGhlIHVzZXIncyBicm93c2VyIHN1cHBvcnRzIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXJzLiAqL1xubGV0IHN1cHBvcnRzUGFzc2l2ZUV2ZW50czogYm9vbGVhbjtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgdXNlcidzIGJyb3dzZXIgc3VwcG9ydHMgcGFzc2l2ZSBldmVudCBsaXN0ZW5lcnMuXG4gKiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9XSUNHL0V2ZW50TGlzdGVuZXJPcHRpb25zL2Jsb2IvZ2gtcGFnZXMvZXhwbGFpbmVyLm1kXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdXBwb3J0c1Bhc3NpdmVFdmVudExpc3RlbmVycygpOiBib29sZWFuIHtcbiAgaWYgKHN1cHBvcnRzUGFzc2l2ZUV2ZW50cyA9PSBudWxsICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAndGVzdCcsXG4gICAgICAgIG51bGwhLFxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdwYXNzaXZlJywge1xuICAgICAgICAgIGdldDogKCkgPT4gKHN1cHBvcnRzUGFzc2l2ZUV2ZW50cyA9IHRydWUpLFxuICAgICAgICB9KSxcbiAgICAgICk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHN1cHBvcnRzUGFzc2l2ZUV2ZW50cyA9IHN1cHBvcnRzUGFzc2l2ZUV2ZW50cyB8fCBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3VwcG9ydHNQYXNzaXZlRXZlbnRzO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZXMgYW4gYEFkZEV2ZW50TGlzdGVuZXJgIG9iamVjdCB0byBzb21ldGhpbmcgdGhhdCBjYW4gYmUgcGFzc2VkXG4gKiB0byBgYWRkRXZlbnRMaXN0ZW5lcmAgb24gYW55IGJyb3dzZXIsIG5vIG1hdHRlciB3aGV0aGVyIGl0IHN1cHBvcnRzIHRoZVxuICogYG9wdGlvbnNgIHBhcmFtZXRlci5cbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdCB0byBiZSBub3JtYWxpemVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyhcbiAgb3B0aW9uczogQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMsXG4pOiBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyB8IGJvb2xlYW4ge1xuICByZXR1cm4gc3VwcG9ydHNQYXNzaXZlRXZlbnRMaXN0ZW5lcnMoKSA/IG9wdGlvbnMgOiAhIW9wdGlvbnMuY2FwdHVyZTtcbn1cbiJdfQ==
