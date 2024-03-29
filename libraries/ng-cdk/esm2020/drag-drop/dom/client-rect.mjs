/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Gets a mutable version of an element's bounding `ClientRect`. */
export function getMutableClientRect(element) {
  const clientRect = element.getBoundingClientRect();
  // We need to clone the `clientRect` here, because all the values on it are readonly
  // and we need to be able to update them. Also we can't use a spread here, because
  // the values on a `ClientRect` aren't own properties. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#Notes
  return {
    top: clientRect.top,
    right: clientRect.right,
    bottom: clientRect.bottom,
    left: clientRect.left,
    width: clientRect.width,
    height: clientRect.height,
    x: clientRect.x,
    y: clientRect.y,
  };
}
/**
 * Checks whether some coordinates are within a `ClientRect`.
 * @param clientRect ClientRect that is being checked.
 * @param x Coordinates along the X axis.
 * @param y Coordinates along the Y axis.
 */
export function isInsideClientRect(clientRect, x, y) {
  const { top, bottom, left, right } = clientRect;
  return y >= top && y <= bottom && x >= left && x <= right;
}
/**
 * Updates the top/left positions of a `ClientRect`, as well as their bottom/right counterparts.
 * @param clientRect `ClientRect` that should be updated.
 * @param top Amount to add to the `top` position.
 * @param left Amount to add to the `left` position.
 */
export function adjustClientRect(clientRect, top, left) {
  clientRect.top += top;
  clientRect.bottom = clientRect.top + clientRect.height;
  clientRect.left += left;
  clientRect.right = clientRect.left + clientRect.width;
}
/**
 * Checks whether the pointer coordinates are close to a ClientRect.
 * @param rect ClientRect to check against.
 * @param threshold Threshold around the ClientRect.
 * @param pointerX Coordinates along the X axis.
 * @param pointerY Coordinates along the Y axis.
 */
export function isPointerNearClientRect(rect, threshold, pointerX, pointerY) {
  const { top, right, bottom, left, width, height } = rect;
  const xThreshold = width * threshold;
  const yThreshold = height * threshold;
  return (
    pointerY > top - yThreshold &&
    pointerY < bottom + yThreshold &&
    pointerX > left - xThreshold &&
    pointerX < right + xThreshold
  );
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LXJlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL2RyYWctZHJvcC9kb20vY2xpZW50LXJlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsb0VBQW9FO0FBQ3BFLE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxPQUFnQjtJQUNuRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUVuRCxvRkFBb0Y7SUFDcEYsa0ZBQWtGO0lBQ2xGLDJEQUEyRDtJQUMzRCx1RkFBdUY7SUFDdkYsT0FBTztRQUNMLEdBQUcsRUFBRSxVQUFVLENBQUMsR0FBRztRQUNuQixLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUs7UUFDdkIsTUFBTSxFQUFFLFVBQVUsQ0FBQyxNQUFNO1FBQ3pCLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSTtRQUNyQixLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUs7UUFDdkIsTUFBTSxFQUFFLFVBQVUsQ0FBQyxNQUFNO1FBQ3pCLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNmLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztLQUNGLENBQUM7QUFDbEIsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUFDLFVBQXNCLEVBQUUsQ0FBUyxFQUFFLENBQVM7SUFDN0UsTUFBTSxFQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxHQUFHLFVBQVUsQ0FBQztJQUM5QyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLE1BQU0sSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUM7QUFDNUQsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLGdCQUFnQixDQUM5QixVQU9DLEVBQ0QsR0FBVyxFQUNYLElBQVk7SUFFWixVQUFVLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQztJQUN0QixVQUFVLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUV2RCxVQUFVLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztJQUN4QixVQUFVLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQztBQUN4RCxDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLHVCQUF1QixDQUNyQyxJQUFnQixFQUNoQixTQUFpQixFQUNqQixRQUFnQixFQUNoQixRQUFnQjtJQUVoQixNQUFNLEVBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUMsR0FBRyxJQUFJLENBQUM7SUFDdkQsTUFBTSxVQUFVLEdBQUcsS0FBSyxHQUFHLFNBQVMsQ0FBQztJQUNyQyxNQUFNLFVBQVUsR0FBRyxNQUFNLEdBQUcsU0FBUyxDQUFDO0lBRXRDLE9BQU8sQ0FDTCxRQUFRLEdBQUcsR0FBRyxHQUFHLFVBQVU7UUFDM0IsUUFBUSxHQUFHLE1BQU0sR0FBRyxVQUFVO1FBQzlCLFFBQVEsR0FBRyxJQUFJLEdBQUcsVUFBVTtRQUM1QixRQUFRLEdBQUcsS0FBSyxHQUFHLFVBQVUsQ0FDOUIsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqIEdldHMgYSBtdXRhYmxlIHZlcnNpb24gb2YgYW4gZWxlbWVudCdzIGJvdW5kaW5nIGBDbGllbnRSZWN0YC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNdXRhYmxlQ2xpZW50UmVjdChlbGVtZW50OiBFbGVtZW50KTogQ2xpZW50UmVjdCB7XG4gIGNvbnN0IGNsaWVudFJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIC8vIFdlIG5lZWQgdG8gY2xvbmUgdGhlIGBjbGllbnRSZWN0YCBoZXJlLCBiZWNhdXNlIGFsbCB0aGUgdmFsdWVzIG9uIGl0IGFyZSByZWFkb25seVxuICAvLyBhbmQgd2UgbmVlZCB0byBiZSBhYmxlIHRvIHVwZGF0ZSB0aGVtLiBBbHNvIHdlIGNhbid0IHVzZSBhIHNwcmVhZCBoZXJlLCBiZWNhdXNlXG4gIC8vIHRoZSB2YWx1ZXMgb24gYSBgQ2xpZW50UmVjdGAgYXJlbid0IG93biBwcm9wZXJ0aWVzLiBTZWU6XG4gIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEJvdW5kaW5nQ2xpZW50UmVjdCNOb3Rlc1xuICByZXR1cm4ge1xuICAgIHRvcDogY2xpZW50UmVjdC50b3AsXG4gICAgcmlnaHQ6IGNsaWVudFJlY3QucmlnaHQsXG4gICAgYm90dG9tOiBjbGllbnRSZWN0LmJvdHRvbSxcbiAgICBsZWZ0OiBjbGllbnRSZWN0LmxlZnQsXG4gICAgd2lkdGg6IGNsaWVudFJlY3Qud2lkdGgsXG4gICAgaGVpZ2h0OiBjbGllbnRSZWN0LmhlaWdodCxcbiAgICB4OiBjbGllbnRSZWN0LngsXG4gICAgeTogY2xpZW50UmVjdC55LFxuICB9IGFzIENsaWVudFJlY3Q7XG59XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgc29tZSBjb29yZGluYXRlcyBhcmUgd2l0aGluIGEgYENsaWVudFJlY3RgLlxuICogQHBhcmFtIGNsaWVudFJlY3QgQ2xpZW50UmVjdCB0aGF0IGlzIGJlaW5nIGNoZWNrZWQuXG4gKiBAcGFyYW0geCBDb29yZGluYXRlcyBhbG9uZyB0aGUgWCBheGlzLlxuICogQHBhcmFtIHkgQ29vcmRpbmF0ZXMgYWxvbmcgdGhlIFkgYXhpcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW5zaWRlQ2xpZW50UmVjdChjbGllbnRSZWN0OiBDbGllbnRSZWN0LCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICBjb25zdCB7dG9wLCBib3R0b20sIGxlZnQsIHJpZ2h0fSA9IGNsaWVudFJlY3Q7XG4gIHJldHVybiB5ID49IHRvcCAmJiB5IDw9IGJvdHRvbSAmJiB4ID49IGxlZnQgJiYgeCA8PSByaWdodDtcbn1cblxuLyoqXG4gKiBVcGRhdGVzIHRoZSB0b3AvbGVmdCBwb3NpdGlvbnMgb2YgYSBgQ2xpZW50UmVjdGAsIGFzIHdlbGwgYXMgdGhlaXIgYm90dG9tL3JpZ2h0IGNvdW50ZXJwYXJ0cy5cbiAqIEBwYXJhbSBjbGllbnRSZWN0IGBDbGllbnRSZWN0YCB0aGF0IHNob3VsZCBiZSB1cGRhdGVkLlxuICogQHBhcmFtIHRvcCBBbW91bnQgdG8gYWRkIHRvIHRoZSBgdG9wYCBwb3NpdGlvbi5cbiAqIEBwYXJhbSBsZWZ0IEFtb3VudCB0byBhZGQgdG8gdGhlIGBsZWZ0YCBwb3NpdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkanVzdENsaWVudFJlY3QoXG4gIGNsaWVudFJlY3Q6IHtcbiAgICB0b3A6IG51bWJlcjtcbiAgICBib3R0b206IG51bWJlcjtcbiAgICBsZWZ0OiBudW1iZXI7XG4gICAgcmlnaHQ6IG51bWJlcjtcbiAgICB3aWR0aDogbnVtYmVyO1xuICAgIGhlaWdodDogbnVtYmVyO1xuICB9LFxuICB0b3A6IG51bWJlcixcbiAgbGVmdDogbnVtYmVyLFxuKSB7XG4gIGNsaWVudFJlY3QudG9wICs9IHRvcDtcbiAgY2xpZW50UmVjdC5ib3R0b20gPSBjbGllbnRSZWN0LnRvcCArIGNsaWVudFJlY3QuaGVpZ2h0O1xuXG4gIGNsaWVudFJlY3QubGVmdCArPSBsZWZ0O1xuICBjbGllbnRSZWN0LnJpZ2h0ID0gY2xpZW50UmVjdC5sZWZ0ICsgY2xpZW50UmVjdC53aWR0aDtcbn1cblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgcG9pbnRlciBjb29yZGluYXRlcyBhcmUgY2xvc2UgdG8gYSBDbGllbnRSZWN0LlxuICogQHBhcmFtIHJlY3QgQ2xpZW50UmVjdCB0byBjaGVjayBhZ2FpbnN0LlxuICogQHBhcmFtIHRocmVzaG9sZCBUaHJlc2hvbGQgYXJvdW5kIHRoZSBDbGllbnRSZWN0LlxuICogQHBhcmFtIHBvaW50ZXJYIENvb3JkaW5hdGVzIGFsb25nIHRoZSBYIGF4aXMuXG4gKiBAcGFyYW0gcG9pbnRlclkgQ29vcmRpbmF0ZXMgYWxvbmcgdGhlIFkgYXhpcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUG9pbnRlck5lYXJDbGllbnRSZWN0KFxuICByZWN0OiBDbGllbnRSZWN0LFxuICB0aHJlc2hvbGQ6IG51bWJlcixcbiAgcG9pbnRlclg6IG51bWJlcixcbiAgcG9pbnRlclk6IG51bWJlcixcbik6IGJvb2xlYW4ge1xuICBjb25zdCB7dG9wLCByaWdodCwgYm90dG9tLCBsZWZ0LCB3aWR0aCwgaGVpZ2h0fSA9IHJlY3Q7XG4gIGNvbnN0IHhUaHJlc2hvbGQgPSB3aWR0aCAqIHRocmVzaG9sZDtcbiAgY29uc3QgeVRocmVzaG9sZCA9IGhlaWdodCAqIHRocmVzaG9sZDtcblxuICByZXR1cm4gKFxuICAgIHBvaW50ZXJZID4gdG9wIC0geVRocmVzaG9sZCAmJlxuICAgIHBvaW50ZXJZIDwgYm90dG9tICsgeVRocmVzaG9sZCAmJlxuICAgIHBvaW50ZXJYID4gbGVmdCAtIHhUaHJlc2hvbGQgJiZcbiAgICBwb2ludGVyWCA8IHJpZ2h0ICsgeFRocmVzaG9sZFxuICApO1xufVxuIl19
