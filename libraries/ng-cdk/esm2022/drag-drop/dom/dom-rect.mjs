/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Gets a mutable version of an element's bounding `DOMRect`. */
export function getMutableClientRect(element) {
    const rect = element.getBoundingClientRect();
    // We need to clone the `clientRect` here, because all the values on it are readonly
    // and we need to be able to update them. Also we can't use a spread here, because
    // the values on a `DOMRect` aren't own properties. See:
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#Notes
    return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
    };
}
/**
 * Checks whether some coordinates are within a `DOMRect`.
 * @param clientRect DOMRect that is being checked.
 * @param x Coordinates along the X axis.
 * @param y Coordinates along the Y axis.
 */
export function isInsideClientRect(clientRect, x, y) {
    const { top, bottom, left, right } = clientRect;
    return y >= top && y <= bottom && x >= left && x <= right;
}
/**
 * Updates the top/left positions of a `DOMRect`, as well as their bottom/right counterparts.
 * @param domRect `DOMRect` that should be updated.
 * @param top Amount to add to the `top` position.
 * @param left Amount to add to the `left` position.
 */
export function adjustDomRect(domRect, top, left) {
    domRect.top += top;
    domRect.bottom = domRect.top + domRect.height;
    domRect.left += left;
    domRect.right = domRect.left + domRect.width;
}
/**
 * Checks whether the pointer coordinates are close to a DOMRect.
 * @param rect DOMRect to check against.
 * @param threshold Threshold around the DOMRect.
 * @param pointerX Coordinates along the X axis.
 * @param pointerY Coordinates along the Y axis.
 */
export function isPointerNearDomRect(rect, threshold, pointerX, pointerY) {
    const { top, right, bottom, left, width, height } = rect;
    const xThreshold = width * threshold;
    const yThreshold = height * threshold;
    return (pointerY > top - yThreshold &&
        pointerY < bottom + yThreshold &&
        pointerX > left - xThreshold &&
        pointerX < right + xThreshold);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLXJlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL2RyYWctZHJvcC9kb20vZG9tLXJlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsaUVBQWlFO0FBQ2pFLE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxPQUFnQjtJQUNuRCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUU3QyxvRkFBb0Y7SUFDcEYsa0ZBQWtGO0lBQ2xGLHdEQUF3RDtJQUN4RCx1RkFBdUY7SUFDdkYsT0FBTztRQUNMLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztRQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztRQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07UUFDbkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1FBQ2pCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtRQUNuQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDVCxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDQyxDQUFDO0FBQ2YsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUFDLFVBQW1CLEVBQUUsQ0FBUyxFQUFFLENBQVM7SUFDMUUsTUFBTSxFQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxHQUFHLFVBQVUsQ0FBQztJQUM5QyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLE1BQU0sSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUM7QUFDNUQsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLGFBQWEsQ0FDM0IsT0FPQyxFQUNELEdBQVcsRUFDWCxJQUFZO0lBRVosT0FBTyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUM7SUFDbkIsT0FBTyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFFOUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7SUFDckIsT0FBTyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDL0MsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSxvQkFBb0IsQ0FDbEMsSUFBYSxFQUNiLFNBQWlCLEVBQ2pCLFFBQWdCLEVBQ2hCLFFBQWdCO0lBRWhCLE1BQU0sRUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQyxHQUFHLElBQUksQ0FBQztJQUN2RCxNQUFNLFVBQVUsR0FBRyxLQUFLLEdBQUcsU0FBUyxDQUFDO0lBQ3JDLE1BQU0sVUFBVSxHQUFHLE1BQU0sR0FBRyxTQUFTLENBQUM7SUFFdEMsT0FBTyxDQUNMLFFBQVEsR0FBRyxHQUFHLEdBQUcsVUFBVTtRQUMzQixRQUFRLEdBQUcsTUFBTSxHQUFHLFVBQVU7UUFDOUIsUUFBUSxHQUFHLElBQUksR0FBRyxVQUFVO1FBQzVCLFFBQVEsR0FBRyxLQUFLLEdBQUcsVUFBVSxDQUM5QixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKiogR2V0cyBhIG11dGFibGUgdmVyc2lvbiBvZiBhbiBlbGVtZW50J3MgYm91bmRpbmcgYERPTVJlY3RgLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE11dGFibGVDbGllbnRSZWN0KGVsZW1lbnQ6IEVsZW1lbnQpOiBET01SZWN0IHtcbiAgY29uc3QgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgLy8gV2UgbmVlZCB0byBjbG9uZSB0aGUgYGNsaWVudFJlY3RgIGhlcmUsIGJlY2F1c2UgYWxsIHRoZSB2YWx1ZXMgb24gaXQgYXJlIHJlYWRvbmx5XG4gIC8vIGFuZCB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gdXBkYXRlIHRoZW0uIEFsc28gd2UgY2FuJ3QgdXNlIGEgc3ByZWFkIGhlcmUsIGJlY2F1c2VcbiAgLy8gdGhlIHZhbHVlcyBvbiBhIGBET01SZWN0YCBhcmVuJ3Qgb3duIHByb3BlcnRpZXMuIFNlZTpcbiAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0Qm91bmRpbmdDbGllbnRSZWN0I05vdGVzXG4gIHJldHVybiB7XG4gICAgdG9wOiByZWN0LnRvcCxcbiAgICByaWdodDogcmVjdC5yaWdodCxcbiAgICBib3R0b206IHJlY3QuYm90dG9tLFxuICAgIGxlZnQ6IHJlY3QubGVmdCxcbiAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuICAgIHg6IHJlY3QueCxcbiAgICB5OiByZWN0LnksXG4gIH0gYXMgRE9NUmVjdDtcbn1cblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBzb21lIGNvb3JkaW5hdGVzIGFyZSB3aXRoaW4gYSBgRE9NUmVjdGAuXG4gKiBAcGFyYW0gY2xpZW50UmVjdCBET01SZWN0IHRoYXQgaXMgYmVpbmcgY2hlY2tlZC5cbiAqIEBwYXJhbSB4IENvb3JkaW5hdGVzIGFsb25nIHRoZSBYIGF4aXMuXG4gKiBAcGFyYW0geSBDb29yZGluYXRlcyBhbG9uZyB0aGUgWSBheGlzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJbnNpZGVDbGllbnRSZWN0KGNsaWVudFJlY3Q6IERPTVJlY3QsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gIGNvbnN0IHt0b3AsIGJvdHRvbSwgbGVmdCwgcmlnaHR9ID0gY2xpZW50UmVjdDtcbiAgcmV0dXJuIHkgPj0gdG9wICYmIHkgPD0gYm90dG9tICYmIHggPj0gbGVmdCAmJiB4IDw9IHJpZ2h0O1xufVxuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIHRvcC9sZWZ0IHBvc2l0aW9ucyBvZiBhIGBET01SZWN0YCwgYXMgd2VsbCBhcyB0aGVpciBib3R0b20vcmlnaHQgY291bnRlcnBhcnRzLlxuICogQHBhcmFtIGRvbVJlY3QgYERPTVJlY3RgIHRoYXQgc2hvdWxkIGJlIHVwZGF0ZWQuXG4gKiBAcGFyYW0gdG9wIEFtb3VudCB0byBhZGQgdG8gdGhlIGB0b3BgIHBvc2l0aW9uLlxuICogQHBhcmFtIGxlZnQgQW1vdW50IHRvIGFkZCB0byB0aGUgYGxlZnRgIHBvc2l0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRqdXN0RG9tUmVjdChcbiAgZG9tUmVjdDoge1xuICAgIHRvcDogbnVtYmVyO1xuICAgIGJvdHRvbTogbnVtYmVyO1xuICAgIGxlZnQ6IG51bWJlcjtcbiAgICByaWdodDogbnVtYmVyO1xuICAgIHdpZHRoOiBudW1iZXI7XG4gICAgaGVpZ2h0OiBudW1iZXI7XG4gIH0sXG4gIHRvcDogbnVtYmVyLFxuICBsZWZ0OiBudW1iZXIsXG4pIHtcbiAgZG9tUmVjdC50b3AgKz0gdG9wO1xuICBkb21SZWN0LmJvdHRvbSA9IGRvbVJlY3QudG9wICsgZG9tUmVjdC5oZWlnaHQ7XG5cbiAgZG9tUmVjdC5sZWZ0ICs9IGxlZnQ7XG4gIGRvbVJlY3QucmlnaHQgPSBkb21SZWN0LmxlZnQgKyBkb21SZWN0LndpZHRoO1xufVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIHRoZSBwb2ludGVyIGNvb3JkaW5hdGVzIGFyZSBjbG9zZSB0byBhIERPTVJlY3QuXG4gKiBAcGFyYW0gcmVjdCBET01SZWN0IHRvIGNoZWNrIGFnYWluc3QuXG4gKiBAcGFyYW0gdGhyZXNob2xkIFRocmVzaG9sZCBhcm91bmQgdGhlIERPTVJlY3QuXG4gKiBAcGFyYW0gcG9pbnRlclggQ29vcmRpbmF0ZXMgYWxvbmcgdGhlIFggYXhpcy5cbiAqIEBwYXJhbSBwb2ludGVyWSBDb29yZGluYXRlcyBhbG9uZyB0aGUgWSBheGlzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQb2ludGVyTmVhckRvbVJlY3QoXG4gIHJlY3Q6IERPTVJlY3QsXG4gIHRocmVzaG9sZDogbnVtYmVyLFxuICBwb2ludGVyWDogbnVtYmVyLFxuICBwb2ludGVyWTogbnVtYmVyLFxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHt0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnQsIHdpZHRoLCBoZWlnaHR9ID0gcmVjdDtcbiAgY29uc3QgeFRocmVzaG9sZCA9IHdpZHRoICogdGhyZXNob2xkO1xuICBjb25zdCB5VGhyZXNob2xkID0gaGVpZ2h0ICogdGhyZXNob2xkO1xuXG4gIHJldHVybiAoXG4gICAgcG9pbnRlclkgPiB0b3AgLSB5VGhyZXNob2xkICYmXG4gICAgcG9pbnRlclkgPCBib3R0b20gKyB5VGhyZXNob2xkICYmXG4gICAgcG9pbnRlclggPiBsZWZ0IC0geFRocmVzaG9sZCAmJlxuICAgIHBvaW50ZXJYIDwgcmlnaHQgKyB4VGhyZXNob2xkXG4gICk7XG59XG4iXX0=